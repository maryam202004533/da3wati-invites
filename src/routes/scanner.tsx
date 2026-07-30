

import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { UserCheck, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Users } from "lucide-react";
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

  const [scanResult, setScanResult] = React.useState<{
    status: "success" | "already_used" | "error" | null;
    message: string;
    guestName?: string;
    guestId?: string;
    indexNumber?: number;
  }>({ status: null, message: "" });

  const [manualName, setManualName] = React.useState("");
  const [manualId, setManualId] = React.useState("");
  
  // حماية صارمة لمنع التكرار الفوري أثناء المسح بالكاميرا
  const isProcessingRef = React.useRef(false);

  const [enteredGuestsList, setEnteredGuestsList] = React.useState<LoggedGuest[]>([]);
  
  // استخدام Set لتخزين الهويات التي تم تسجيلها مسبقاً لمنع التكرار نهائياً
  const enteredGuestsSetRef = React.useRef<Set<string>>(new Set());

  const scannerRef = React.useRef<Html5Qrcode | null>(null);

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

    // منع المعالجة المتكررة لنفس الإطار اللحظي
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    // فتح قفل المعالجة بعد ثانيتين لتجربة ضيف آخر
    setTimeout(() => {
      isProcessingRef.current = false;
    }, 2500);

    const uniqueKey = trimmedId; // الاعتماد على رقم الهوية كمعرف فريد للضيف

    try {
      // التحقق هل تم تسجيله مسبقاً؟
      if (enteredGuestsSetRef.current.has(uniqueKey)) {
        setScanResult({
          status: "already_used",
          message: "تم تسجيل دخول هذا الضيف مسبقاً ولا يمكن تكراره",
          guestName: trimmedName,
          guestId: trimmedId,
        });
        return;
      }

      // إضافة الضيف للسجل لأنه لم يدخل من قبل
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

    } catch (err) {
      console.error("Verification error:", err);
      setScanResult({
        status: "error",
        message: "حدث خطأ أثناء التحقق من البيانات",
      });
    }
  };

  React.useEffect(() => {
    if (!isAuthenticated) return;

    const html5QrCode = new Html5Qrcode("reader-container");
    scannerRef.current = html5QrCode;

    html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 220, height: 220 },
      },
      (decodedText) => {
        if (isProcessingRef.current) return;

        // تحليل النص القادم من الباركود
        if (decodedText.includes(",")) {
          const [name, id] = decodedText.split(",");
          setManualName(name);
          setManualId(id);
          verifyGuest(name, id);
        } else {
          setManualName(decodedText);
          // إذا لم يحتوي الباركود على فاصلة نعتبر النص هو الاسم ورقم عشوائي أو ثابت للتعريف
          const generatedId = "ID-" + decodedText;
          setManualId(generatedId);
          verifyGuest(decodedText, generatedId);
        }
      },
      () => {
        // أخطاء الإطار المؤقتة تُترك فارغة لتفادي توقف الكاميرا
      }
    ).catch((err) => {
      console.error("Failed to start scanner", err);
    });

    return () => {
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
              يرجى إدخال اسم المستخدم للوصول إلى لوحة التحقق.
            </p>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="أدخل اسم المستخدم..."
                  className="w-full rounded-2xl border border-[color:var(--gold)]/30 bg-white/70 p-4 text-center text-lg outline-none focus:border-[color:var(--gold)] focus:ring-2 focus:ring-[color:var(--gold)]/25 transition text-black"
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
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
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

              {/* حاوية قارئ الباركود التلقائي */}
              <div id="reader-container" className="mx-auto w-full max-w-[280px] rounded-2xl overflow-hidden border-2 border-[color:var(--gold)] bg-black mb-4"></div>

              <p className="text-xs text-[color:var(--gold)] font-medium mb-4">
                الكاميرا مفعلة تفحص الباركود (يتم تسجيل الضيف مرة واحدة فقط).
              </p>

              <div className="space-y-3">
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="اسم الضيف..."
                    className="w-full rounded-xl border border-[color:var(--gold)]/30 bg-white/90 px-3 py-2.5 text-center text-sm outline-none text-black font-medium"
                  />
                  <input
                    type="text"
                    value={manualId}
                    onChange={(e) => setManualId(e.target.value)}
                    placeholder="رقم الهوية / ID..."
                    className="w-full rounded-xl border border-[color:var(--gold)]/30 bg-white/90 px-3 py-2.5 text-center text-sm outline-none text-black font-medium"
                  />
                  <button
                    onClick={() => {
                      verifyGuest(manualName, manualId);
                      setManualName("");
                      setManualId("");
                    }}
                    className="btn-gold btn-gold-hover rounded-xl py-3 text-xs font-bold w-full mt-1"
                  >
                    تحقق وتسجيل الدخول
                  </button>
                </div>
              </div>

              {scanResult.status && (
                <div
                  className={`mt-6 rounded-2xl p-4 text-right transition-all ${
                    scanResult.status === "success"
                      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                      : scanResult.status === "already_used"
                      ? "bg-amber-500/10 border border-amber-500/30 text-amber-300"
                      : "bg-rose-500/10 border border-rose-500/30 text-rose-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {scanResult.status === "success" && (
                      <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
                    )}
                    {scanResult.status === "already_used" && (
                      <AlertTriangle className="h-6 w-6 text-amber-400 shrink-0" />
                    )}
                    {scanResult.status === "error" && (
                      <XCircle className="h-6 w-6 text-rose-400 shrink-0" />
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
                    <div key={guest.indexNumber} className="flex items-center justify-between bg-black/30 p-3 rounded-xl border border-[color:var(--gold)]/20 text-right">
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--gold)]/20 text-[color:var(--gold)] text-xs font-bold shrink-0">
                          {guest.indexNumber}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-white">{guest.name}</p>
                          <p className="text-[10px] text-muted-foreground">ID: {guest.idNumber}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-[color:var(--gold)]">{guest.time}</span>
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
