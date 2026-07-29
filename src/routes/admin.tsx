import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { useServerFn } from "@tanstack/react-start";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { verifyAdmin, adminListEvents } from "@/lib/admin.functions";
import { Lock, Users, CheckCircle2, XCircle, QrCode as QrIcon, Loader2 } from "lucide-react";
import QRCode from "qrcode";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة الإدارة — دعوتي" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [password, setPassword] = React.useState("");
  const [authed, setAuthed] = React.useState(false);
  const [events, setEvents] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState("");
  const verify = useServerFn(verifyAdmin);
  const list = useServerFn(adminListEvents);

  React.useEffect(() => {
    const stored = sessionStorage.getItem("admin_pw");
    if (stored) {
      setPassword(stored);
      loadEvents(stored);
    }
  }, []);

  async function loadEvents(pw: string) {
    setLoading(true);
    try {
      const data = await list({ data: { password: pw } });
      setEvents(data as any[]);
      setAuthed(true);
      sessionStorage.setItem("admin_pw", pw);
    } catch {
      sessionStorage.removeItem("admin_pw");
      setErr("كلمة المرور غير صحيحة");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const res = await verify({ data: { password } });
    if (!res.ok) return setErr("كلمة المرور غير صحيحة");
    await loadEvents(password);
  }

  if (!authed) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <section className="mx-auto max-w-md px-4 py-24">
          <div className="glass rounded-3xl p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[color:var(--gold)] to-[color:var(--gold-soft)] text-white">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="mt-4 text-2xl font-bold">لوحة الإدارة</h1>
            <p className="mt-2 text-sm text-muted-foreground">أدخل كلمة المرور للوصول</p>
            <form onSubmit={handleLogin} className="mt-6 space-y-3">
              <input
                type="password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[color:var(--gold)]/30 bg-white/70 px-4 py-3 text-center outline-none focus:border-[color:var(--gold)]"
                placeholder="كلمة المرور"
              />
              {err && <p className="text-sm text-destructive">{err}</p>}
              <button className="btn-gold btn-gold-hover w-full rounded-full py-3 text-sm font-semibold">
                دخول
              </button>
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
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            <span className="text-gradient-gold">لوحة</span> الإدارة
          </h1>
          <button
            onClick={() => {
              sessionStorage.removeItem("admin_pw");
              setAuthed(false);
              setPassword("");
            }}
            className="text-sm text-muted-foreground hover:text-destructive"
          >
            تسجيل خروج
          </button>
        </div>

        {loading && <Loader2 className="mx-auto mt-10 h-6 w-6 animate-spin text-[color:var(--gold)]" />}

        <div className="mt-8 space-y-6">
          {events.length === 0 && !loading && (
            <div className="glass rounded-2xl p-10 text-center text-muted-foreground">
              لا توجد مناسبات بعد.
            </div>
          )}
          {events.map((ev) => (
            <EventCard key={ev.id} event={ev} />
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}

function EventCard({ event }: { event: any }) {
  const guests = event.guests || [];
  const attended = guests.filter((g: any) => g.status === "entered").length;
  const absent = guests.length - attended;
  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">
            {event.groom_name} <span className="text-[color:var(--gold)]">و</span> {event.bride_name}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {event.event_date} · {event.event_time} · {event.venue_name}
          </p>
        </div>
        <div className="flex gap-4 text-sm">
          <Stat icon={Users} label="ضيف" value={guests.length} />
          <Stat icon={CheckCircle2} label="حضر" value={attended} color="text-emerald-600" />
          <Stat icon={XCircle} label="لم يحضر" value={absent} color="text-destructive" />
        </div>
      </div>

      {guests.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-right text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-2">الاسم</th>
                <th className="p-2">الحالة</th>
                <th className="p-2">QR</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((g: any) => (
                <GuestRow key={g.id} guest={g} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Stat({ icon: Icon, label, value, color }: any) {
  return (
    <div className={`flex items-center gap-2 ${color || ""}`}>
      <Icon className="h-4 w-4" />
      <span className="font-bold">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function GuestRow({ guest }: { guest: any }) {
  const [qr, setQr] = React.useState<string>("");
  const [show, setShow] = React.useState(false);

  async function makeQr() {
    if (qr) return setShow(true);
    const url = `${window.location.origin}/guest/${guest.id}`;
    const dataUrl = await QRCode.toDataURL(url, { margin: 2, width: 300, color: { dark: "#8E6E14", light: "#F8F3EA" } });
    setQr(dataUrl);
    setShow(true);
  }

  return (
    <>
      <tr className="border-t border-[color:var(--gold)]/15">
        <td className="p-2">{guest.name}</td>
        <td className="p-2">
          {guest.status === "entered" ? (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">تم الدخول</span>
          ) : (
            <span className="rounded-full bg-[color:var(--champagne)] px-2 py-0.5 text-xs">لم يدخل</span>
          )}
        </td>
        <td className="p-2">
          <button onClick={makeQr} className="flex items-center gap-1 text-[color:var(--gold)] hover:underline">
            <QrIcon className="h-4 w-4" /> عرض
          </button>
        </td>
      </tr>
      {show && qr && (
        <tr>
          <td colSpan={3} className="border-t border-[color:var(--gold)]/15 p-4">
            <div className="flex flex-col items-center gap-2">
              <img src={qr} alt={`QR ${guest.name}`} width={200} height={200} />
              <a href={qr} download={`qr-${guest.name}.png`} className="text-xs text-[color:var(--gold)] hover:underline">
                تحميل الباركود
              </a>
              <button onClick={() => setShow(false)} className="text-xs text-muted-foreground">إخفاء</button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}