

import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { whatsappUrl } from "@/lib/config";
import { Plus, Trash2, Send, Loader2 } from "lucide-react";
import { toast, Toaster } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "تسجيل بيانات المناسبة — دعوتي" },
      { name: "description", content: "سجّل بيانات مناسبتك وأرسلها مباشرة عبر واتساب." },
      { property: "og:title", content: "تسجيل بيانات المناسبة — دعوتي" },
      { property: "og:description", content: "نموذج تسجيل بيانات دعوة الزفاف الإلكترونية." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const [form, setForm] = React.useState({
    groom: "",
    bride: "",
    date: "",
    time: "",
    venue: "",
    guestCount: "",
    color: "",
  });
  const [guests, setGuests] = React.useState<string[]>([""]);
  const [image, setImage] = React.useState<File | null>(null);
  const [music, setMusic] = React.useState<File | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.groom || !form.bride || !form.date) {
      toast.error("يرجى تعبئة الحقول الأساسية");
      return;
    }
    setSubmitting(true);
    try {
      const { data: event, error } = await supabase
        .from("events")
        .insert({
          groom_name: form.groom,
          bride_name: form.bride,
          event_date: form.date,
          event_time: form.time,
          venue_name: form.venue,
          guest_count: Number(form.guestCount) || guests.filter(Boolean).length,
          color_choice: form.color,
        })
        .select()
        .single();
      if (error) throw error;

      const cleanGuests = guests.map((g) => g.trim()).filter(Boolean);
      if (cleanGuests.length && event) {
        await supabase.from("guests").insert(
          cleanGuests.map((name) => ({ event_id: event.id, name, companions: 0 })),
        );
      }

      const lines = [
        "🌿 طلب دعوة زفاف جديد — دعوتي",
        "",
        `👰 العروس: ${form.bride}`,
        `🤵 العريس: ${form.groom}`,
        `📅 التاريخ: ${form.date}`,
        `⏰ الوقت: ${form.time}`,
        `🏛 القاعة: ${form.venue}`,
        `👥 عدد المدعوين: ${form.guestCount || cleanGuests.length}`,
        form.color ? `🎨 اللون المطلوب: ${form.color}` : null,
        cleanGuests.length ? `\n📝 قائمة المدعوين:\n${cleanGuests.map((n, i) => `${i + 1}. ${n}`).join("\n")}` : null,
        image ? `🖼 تم رفع صورة الدعوة` : null,
        music ? `🎵 تم رفع الموسيقى` : null,
      ].filter(Boolean).join("\n");

      window.open(whatsappUrl(lines), "_blank");
      toast.success("تم تسجيل مناسبتك وفتح واتساب");
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء الإرسال");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <Toaster position="top-center" richColors />
      <section className="mx-auto max-w-3xl px-4 py-12 md:py-20">
        <div className="text-center">
          <span className="text-xs tracking-[0.3em] text-[color:var(--gold)]">تسجيل المناسبة</span>
          <h1 className="mt-3 text-3xl font-bold md:text-4xl">
            <span className="text-gradient-gold">بيانات</span> دعوتك الإلكترونية
          </h1>
          <p className="mt-3 text-muted-foreground">
            أكمل النموذج وسنستلم بياناتك عبر واتساب مباشرة.
          </p>
        </div>

        <form onSubmit={submit} className="glass mt-10 rounded-3xl p-6 md:p-10 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="اسم العريس" value={form.groom} onChange={(v) => update("groom", v)} required />
            <Field label="اسم العروس" value={form.bride} onChange={(v) => update("bride", v)} required />
            <Field type="date" label="تاريخ المناسبة" value={form.date} onChange={(v) => update("date", v)} required />
            <Field type="time" label="وقت المناسبة" value={form.time} onChange={(v) => update("time", v)} />
            <Field label="اسم القاعة" value={form.venue} onChange={(v) => update("venue", v)} />
            <Field type="number" label="عدد المدعوين" value={form.guestCount} onChange={(v) => update("guestCount", v)} />
            <Field label="لون الدعوة" value={form.color} onChange={(v) => update("color", v)} placeholder="اكتبي اللون المطلوب (مثال: ذهبي، أوف وايت...)" />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label>أسماء المدعوين</Label>
              <button
                type="button"
                onClick={() => setGuests((g) => [...g, ""])}
                className="flex items-center gap-1 text-xs text-[color:var(--gold)] hover:underline"
              >
                <Plus className="h-3 w-3" /> إضافة مدعو
              </button>
            </div>
            <div className="space-y-2">
              {guests.map((g, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className={inputCls}
                    placeholder={`المدعو ${i + 1}`}
                    value={g}
                    onChange={(e) => {
                      const next = [...guests];
                      next[i] = e.target.value;
                      setGuests(next);
                    }}
                  />
                  {guests.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setGuests(guests.filter((_, x) => x !== i))}
                      className="rounded-xl border border-destructive/30 px-3 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>صورة الدعوة (اختياري)</Label>
              <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] ?? null)} className={inputCls} />
            </div>
            <div>
              <Label>موسيقى (اختياري)</Label>
              <input type="file" accept="audio/*" onChange={(e) => setMusic(e.target.files?.[0] ?? null)} className={inputCls} />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-gold btn-gold-hover flex w-full items-center justify-center gap-2 rounded-full py-4 text-base font-semibold disabled:opacity-60"
          >
            {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            إرسال عبر واتساب
          </button>
        </form>
      </section>
      <Footer />
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-[color:var(--gold)]/30 bg-white/70 px-4 py-3 text-sm outline-none focus:border-[color:var(--gold)] focus:ring-2 focus:ring-[color:var(--gold)]/25 transition";

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1 block text-sm font-semibold">{children}</label>;
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <Label>{label}{required && <span className="text-destructive"> *</span>}</Label>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
    </div>
  );
}