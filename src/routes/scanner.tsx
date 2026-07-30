
import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { UserCheck, Camera, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Users } from "lucide-react";

export const Route = createFileRoute("/scanner")({
  head: () => ({
    meta: [
      { title: "دخول المنظمين — مناسبتك" },
      { name: "description", content: "لوحة التحقق ومسح باركود الضيوف للمنظمين." },
    ],
  }),
  component: ScannerPage,
});

interface LoggedGuest {
  indexNumber: number;
  name: string;
  idNumber: string;
  time: string;
}

function ScannerPage() {
  const ADMIN_USERNAME = "maryam1234"; 
  const [usernameInput, setUsernameInput] = React.useState("");
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [loginError, setLoginError] = React.useState(false);

  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [cameraError, setCameraError] = React.useState<string | null>(null);

  const [scanResult, setScanResult] = React.useState<{
    status: "success" | "already_used" | "error" | null;
    message: string;
    guestName?: string;
    guestId?: string;
    indexNumber?: number;
  }>({ status: null, message: "" });

  const [manualName, setManualName] = React.useState("");
  const [manualId, setManualId] = React.useState("");
  const lastScannedRef = React.useRef<string | null>(null);

  const [enteredGuestsList, setEnteredGuestsList] = React.useState<LoggedGuest[]>([]);
  const enteredGuestsSetRef = React.useRef<Set<string>>(new Set());

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim() === ADMIN_USERNAME) {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const verifyGuest = (nameInput: string, idInput: string) => {
    const trimmedName = nameInput.trim();
    const trimmedId = idInput.trim();
    
    if (!trimmedName || !trimmedId) return;

    const uniqueKey = `${trimmedId}-${trimmedName}`;
    if (lastScannedRef.current === uniqueKey) return;
    
    lastScannedRef.current = uniqueKey;
    setTimeout(() => { lastScannedRef.current = null; }, 3000);

    try {
      if (enteredGuestsSetRef.current.has(trimmedId) || enteredGuestsSetRef.current.has(uniqueKey)) {
        setScanResult({
          status: "already_used",
          message: "تم تسجيل دخول هذا الضيف مسبقاً",
          guestName: trimmedName,
          guestId: trimmedId,
        });
        return;
      }

      if (trimmedId.length >= 1) {
        enteredGuestsSetRef.current.add(trimmedId);
        enteredGuestsSetRef.current.add(uniqueKey);
        
        const nextIndex = enteredGuestsList.length + 1;
        const currentTime = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
        
        setEnteredGuestsList((prev) => [
          { indexNumber: nextIndex, name: trimmedName, idNumber: trimmedId, time: currentTime },
          ...prev,
        ]);

        setScanResult({
          status: "success",
          message: "تم تسجيل الدخول بنجاح",
          guestName: trimmedName,
          guestId: trimmedId,
          indexNumber: nextIndex,
        });
      } else {
        setScanResult({
          status: "error",
          message: "رقم الهوية أو الاسم غير صحيح",
          guestName: trimmedName,
          guestId: trimmedId,
        });
      }

    } catch (err) {
      console.error("Verification error:", err);
      setScanResult({
        status: "error",
        message: "حدث خطأ أثناء التحقق من البيانات",
      });
    }
  };

  const handleQrCodeData = (qrData: string) => {
    if (qrData.includes(",")) {
      const [name, id] = qrData.split(",");
      verifyGuest(name, id);
    } else {
      verifyGuest(qrData, "1");
    }
  };

  React.useEffect(() => {
    if (!isAuthenticated) return;

    let stream: MediaStream | null = null;
    let intervalId: any;

    async function startCamera() {
      try {
        setCameraError(null);
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // استخدام BarcodeDetector المدمج في المتصفح إن توفر
        if ('BarcodeDetector' in window) {
          //@ts-ignore
          const barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] });
          
          intervalId = setInterval(async () => {
            if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
              try {
                const barcodes = await barcodeDetector.detect(videoRef.current);
                if (barcodes.length > 0 && barcodes[0].rawValue) {
                  handleQrCodeData(barcodes[0].rawValue);
                }
              } catch (e) {
                // تجاهل أخطاء الإطار المؤقتة
              }
            }
          }, 1000);
        } else {
          setCameraError("الكاميرا مفعلة. استخدم الإدخال اليد أدناه للتحقق السريع.");
        }
      } catch (err) {
        console.error("Camera Error:", err);
        setCameraError("تعذر الوصول إلى الكاميرا. يرجى إدخال بيانات الضيف يدوياً.");
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="mx-auto max-w-lg px-4 py-12 w-full">
        {!isAuthenticated ? (
          <div className="glass rounded-3xl p-8 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--gold)]/20 text-[color:var(--gold)]">
              <UserCheck className="h-7 w-7" />
            </div>

            <h1 className="text-2xl font-bold">دخول المنظمين</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              يرجى إدخال اسم المستخدم للوصول إلى لوحة التحقق.
            </p>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="أدخل اسم المستخدم..."
                  className="w-full rounded-2xl border border-[color:var(--gold)]/30 bg-white/70 p-4 text-center text-lg outline-none focus:border-[color:var(--gold)] focus:ring-2 focus:ring-[color:var(--gold)]/25 transition"
                />
              </div>

              {loginError && (
                <p className="text-xs text-rose-500 font-semibold">اسم المستخدم غير صحيح!</p>
              )}

              <button
                type="submit"
                className="btn-gold btn-gold-hover w-full rounded-2xl py-3.5 text-base font-semibold"
              >
                دخول
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="glass rounded-3xl p-6 text-center shadow-xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[color:var(--gold)]/20">
                <div className="flex items-center gap-2 text-emerald-600 font-semibold text-xs">
                  <ShieldCheck className="h-4 w-4" />
                  المُنظّم: maryam1234
                </div>
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="text-xs text-muted-foreground hover:underline"
                >
                  خروج
                </button>
              </div>

              <div className="relative mx-auto w-full aspect-square max-w-[260px] rounded-2xl bg-black overflow-hidden border-2 border-[color:var(--gold)] flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>

              {cameraError && (
                <p className="text-xs text-amber-600 mt-2 font-medium">{cameraError}</p>
              )}

              <div className="mt-6 space-y-3">
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="اسم الضيف..."
                    className="w-full rounded-xl border border-[color:var(--gold)]/30 bg-white/70 px-3 py-2 text-center text-sm outline-none"
                  />
                  <input
                    type="text"
                    value={manualId}
                    onChange={(e) => setManualId(e.target.value)}
                    placeholder="رقم الهوية / ID..."
                    className="w-full rounded-xl border border-[color:var(--gold)]/30 bg-white/70 px-3 py-2 text-center text-sm outline-none"
                  />
                  <button
                    onClick={() => {
                      verifyGuest(manualName, manualId);
                      setManualName("");
                      setManualId("");
                    }}
                    className="btn-gold rounded-xl py-2.5 text-xs font-semibold w-full"
                  >
                    تحقق وتسجيل الدخول
                  </button>
                </div>
              </div>

              {scanResult.status && (
                <div
                  className={`mt-6 rounded-2xl p-4 text-right transition-all ${
                    scanResult.status === "success"
                      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-600"
                      : scanResult.status === "already_used"
                      ? "bg-amber-500/10 border border-amber-500/30 text-amber-600"
                      : "bg-rose-500/10 border border-rose-500/30 text-rose-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {scanResult.status === "success" && (
                      <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                    )}
                    {scanResult.status === "already_used" && (
                      <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0" />
                    )}
                    {scanResult.status === "error" && (
                      <XCircle className="h-6 w-6 text-rose-500 shrink-0" />
                    )}

                    <div>
                      <p className="font-bold text-sm">{scanResult.message}</p>
                      {scanResult.indexNumber && (
                        <p className="text-xs mt-1 font-semibold text-[color:var(--gold)]">
                          الرقم التسلسلي: {scanResult.indexNumber}
                        </p>
                      )}
                      {scanResult.guestName && (
                        <p className="text-xs mt-0.5">الضيف: {scanResult.guestName}</p>
                      )}
                      {scanResult.guestId && (
                        <p className="text-xs mt-0.5">رقم الهوية (ID): {scanResult.guestId}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="glass rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[color:var(--gold)]/20">
                <h3 className="font-bold text-sm flex items-center gap-2 text-[color:var(--gold)]">
                  <Users className="h-4 w-4" />
                  سجل الحاضرين ({enteredGuestsList.length})
                </h3>
              </div>

              {enteredGuestsList.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">لم يتم تسجيل أي حضور حتى الآن</p>
              ) : (
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {enteredGuestsList.map((guest) => (
                    <div key={guest.indexNumber} className="flex items-center justify-between bg-white/60 p-3 rounded-xl border border-emerald-500/20 text-right">
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--gold)]/20 text-[color:var(--gold)] text-xs font-bold shrink-0">
                          {guest.indexNumber}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-gray-800">{guest.name}</p>
                          <p className="text-[10px] text-muted-foreground">ID: {guest.idNumber}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{guest.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
