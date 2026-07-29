import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { useServerFn } from "@tanstack/react-start";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { adminCheckInGuest, getGuest, verifyAdmin } from "@/lib/admin.functions";
import { CheckCircle2, XCircle, Camera, Lock } from "lucide-react";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "مسح الباركود — دعوتي" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ScanPage,
});

function ScanPage() {
  const [password, setPassword] = React.useState("");
  const [authed, setAuthed] = React.useState(false);
  const [err, setErr] = React.useState("");
  const [guest, setGuest] = React.useState<any>(null);
  const [scanning, setScanning] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scannerRef = React.useRef<any>(null);
  const verify = useServerFn(verifyAdmin);
  const fetchGuest = useServerFn(getGuest);
  const checkIn = useServerFn(adminCheckInGuest);

  React.useEffect(() => {
    const stored = sessionStorage.getItem("admin_pw");
    if (stored) {
      setPassword(stored);
      setAuthed(true);
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await verify({ data: { password } });
    if (!res.ok) return setErr("كلمة المرور غير صحيحة");
    sessionStorage.setItem("admin_pw", password);
    setAuthed(true);
  }

  async function startScan() {
    setScanning(true);
    setGuest(null);
    const { Html5Qrcode } = await import("html5-qrcode");
    const scanner = new Html5Qrcode("qr-region");
    scannerRef.current = scanner;
    try {
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          await scanner.stop().catch(() => {});
          setScanning(false);
          await handleDecoded(decodedText);
        },
        () => {},
      );
    } catch (e) {
      console.error(e);
      setScanning(false);
      setErr("تعذر تشغيل الكاميرا");
    }
  }

  async function stopScan() {
    try { await scannerRef.current?.stop(); } catch {}
    setScanning(false);
  }

  async function handleDecoded(text: string) {
    const match = text.match(/guest\/([\w-]+)/);
    const id = match ? match[1] : text.trim();
    try {
      const g = await fetchGuest({ data: { guestId: id } });
      setGuest(g);
    } catch {
      setErr("لم يتم العثور على الضيف");
    }
  }

  async function doCheckIn() {
    if (!guest) return;
    const res = await checkIn({ data: { password, guestId: guest.id } });
    if ((res as any).ok) {
      setGuest({ ...guest, status: "entered" });
    } else {
      setErr("هذا الضيف مسجل دخوله مسبقًا");
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <section className="mx-auto max-w-md px-4 py-24">
          <div className="glass rounded-3xl p-8 text-center">
            <Lock className="mx-auto h-8 w-8 text-[color:var(--gold)]" />
            <h1 className="mt-4 text-2xl font-bold">مسح الباركود</h1>
            <form onSubmit={handleLogin} className="mt-6 space-y-3">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[color:var(--gold)]/30 bg-white/70 px-4 py-3 text-center outline-none"
                placeholder="كلمة المرور"
              />
              {err && <p className="text-sm text-destructive">{err}</p>}
              <button className="btn-gold btn-gold-hover w-full rounded-full py-3 text-sm font-semibold">دخول</button>
            </form>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-xl px-4 py-12">
        <h1 className="text-center text-3xl font-bold">
          <span className="text-gradient-gold">مسح</span> الباركود
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          وجّه الكاميرا نحو باركود الضيف لتسجيل دخوله.
        </p>

        <div className="glass mt-8 rounded-3xl p-6">
          <div
            id="qr-region"
            ref={containerRef}
            className="mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl bg-black/5"
          />
          <div className="mt-4 flex justify-center gap-3">
            {!scanning ? (
              <button onClick={startScan} className="btn-gold btn-gold-hover flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold">
                <Camera className="h-4 w-4" /> بدء المسح
              </button>
            ) : (
              <button onClick={stopScan} className="rounded-full border border-destructive/40 px-6 py-3 text-sm font-semibold text-destructive">
                إيقاف
              </button>
            )}
          </div>
          {err && <p className="mt-3 text-center text-sm text-destructive">{err}</p>}
        </div>

        {guest && (
          <div className="glass mt-6 rounded-3xl p-6 text-center">
            <h2 className="text-2xl font-bold">{guest.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              عدد المرافقين: {guest.companions ?? 0}
            </p>
            <div className="mt-4">
              {guest.status === "entered" ? (
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-emerald-700">
                  <CheckCircle2 className="h-5 w-5" /> تم الدخول
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--champagne)] px-4 py-2">
                  <XCircle className="h-5 w-5" /> لم يدخل
                </div>
              )}
            </div>
            {guest.status !== "entered" && (
              <button
                onClick={doCheckIn}
                className="btn-gold btn-gold-hover mt-6 rounded-full px-8 py-3 text-sm font-semibold"
              >
                تسجيل الدخول
              </button>
            )}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}