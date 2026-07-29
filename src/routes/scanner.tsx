

import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { UserCheck, Camera, CheckCircle2, XCircle, AlertTriangle, ShieldCheck } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

export const Route = createFileRoute("/scanner")({
  head: () => ({
    meta: [
      { title: "دخول المنظمين — مناسبتك" },
      { name: "description", content: "لوحة التحقق ومسح باركود الضيوف للمنظمين." },
    ],
  }),
  component: ScannerPage,
});

function ScannerPage() {
  const ADMIN_USERNAME = "maryam1234"; 
  const [usernameInput, setUsernameInput] = React.useState("");
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [loginError, setLoginError] = React.useState(false);

  const [cameraError, setCameraError] = React.useState<string | null>(null);
  const [scanResult, setScanResult] = React.useState<{
    status: "success" | "already_used" | "error" | null;
    message: string;
    guestName?: string;
  }>({ status: null, message: "" });

  const [manualCode, setManualCode] = React.useState("");
  
  // ذاكرة مؤقتة لحفظ الضيوف الذين تم تسجيل دخولهم لمنع التكرار
  const enteredGuestsRef = React.useRef<Set<string>>(new Set());
  const scannerRef = React.useRef<Html5Qrcode | null>(null);
  const isProcessingRef = React.useRef(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim() === ADMIN_USERNAME) {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const verifyGuestCode = (guestNameInput: string) => {
    const trimmedName = guestNameInput.trim();
    if (!trimmedName || isProcessingRef.current) return;

    isProcessingRef.current = true;

    // 1. التحقق هل الضيف مسجل مسبقاً في الجلسة الحالية
    if (enteredGuestsRef.current.has(trimmedName)) {
      setScanResult({
        status: "already_used",
        message: "تنبيه: هذا الباركود تم استخدامه مسبقاً!",
        guestName: trimmedName,
      });
      setTimeout(() => { isProcessingRef.current = false; }, 2000);
      return;
    }

    // 2. التحقق من صحة الاسم
    if (trimmedName === "ساره العتيبي" || trimmedName === "عبدالله السلمان") {
      enteredGuestsRef.current.add(trimmedName); // حفظه أنه دخل
      setScanResult({
        status: "success",
        message: "تم تسجيل الدخول بنجاح",
        guestName: trimmedName,
      });
    } else {
      setScanResult({
        status: "error",
        message: "رمز الدعوة أو الاسم غير صحيح أو غير مسجل",
        guestName: trimmedName,
      });
    }

    setTimeout(() => {
      isProcessingRef.current = false;
    }, 2500);
  };

  React.useEffect(() => {
    if (!isAuthenticated) return;

    const qrRegionId = "reader";
    let html5QrCode: Html5Qrcode | null = null;

    const startScanner = async () => {
      try {
        setCameraError(null);
        html5QrCode = new Html5Qrcode(qrRegionId);
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            verifyGuestCode(decodedText);
          },
          (_errorMessage) => {
            // تجاهل أخطاء الإطار الافتراضية أثناء البحث عن الـ QR
          }
        );
      } catch (err) {
        console.error("Error starting QR scanner:", err);
        setCameraError("تعذر الوصول إلى الكاميرا. يرجى التأكد من السماح للمتصفح بالوصول للكاميرا.");
      }
    };

    const timer = setTimeout(() => {
      startScanner();
    }, 500);

    return () => {
      clearTimeout(timer);
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch((err) => console.error("Failed to stop scanner", err));
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
              يرجى إدخال اسم المستخدم للوصول إلى لوحة الماسح الضوئي.
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
          <div className="glass rounded-3xl p-8 text-center shadow-xl">
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

            <div className="relative mx-auto w-full max-w-[280px] rounded-2xl bg-black overflow-hidden border-2 border-[color:var(--gold)]">
              {cameraError ? (
                <div className="p-8 text-xs text-rose-400 text-center">
                  <Camera className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  {cameraError}
                </div>
              ) : (
                <div id="reader" className="w-full"></div>
              )}
            </div>

            <div className="mt-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="أدخل اسم الضيف للتحقق..."
                  className="w-full rounded-xl border border-[color:var(--gold)]/30 bg-white/70 px-3 py-2 text-center text-sm outline-none"
                />
                <button
                  onClick={() => {
                    verifyGuestCode(manualCode);
                    setManualCode("");
                  }}
                  className="btn-gold rounded-xl px-4 text-xs font-semibold shrink-0"
                >
                  تحقق
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
                    {scanResult.guestName && (
                      <p className="text-xs mt-1">الضيف: {scanResult.guestName}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
