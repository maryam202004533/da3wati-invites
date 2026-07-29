
import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { whatsappUrl } from "@/lib/config";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/packages")({
  head: () => ({
    meta: [
      { title: "الباقات — مناسبتك" },
      { name: "description", content: "باقات دعوات إلكترونية فاخرة تناسب جميع المناسبات." },
      { property: "og:title", content: "الباقات — مناسبتك" },
      { property: "og:description", content: "اختر باقتك الأنسب لتصميم دعوة إلكترونية فاخرة." },
    ],
  }),
  component: PackagesPage,
});

const packages = [
  {
    name: "الباقة الأساسية",
    desc: "لبدايةٍ أنيقة تجمع الأساسيات.",
    features: [
      "دعوة إلكترونية بتصميم راقٍ",
      "مشاركة الدعوة عبر واتساب",
      "قائمة ضيوف حتى 50",
      "تعديلات محدودة",
    ],
  },
  {
    name: "الباقة الذهبية",
    desc: "الخيار الأكثر طلبًا للمناسبات المميزة.",
    features: [
      "تصميم فاخر بلمسات ذهبية",
      "باركود QR لكل ضيف",
      "متابعة حضور الضيوف",
      "قائمة ضيوف حتى 200",
      "دعم فني سريع",
    ],
    featured: true,
  },
  {
    name: "الباقة الملكية",
    desc: "تجربة استثنائية بلا حدود.",
    features: [
      "تصميم مخصص بالكامل",
      "رفع صورة خاصة وموسيقى",
      "لوحة إدارة كاملة للمناسبة",
      "عدد ضيوف بلا حد",
      "أولوية في التنفيذ",
    ],
  },
];

function PackagesPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="text-center">
          <span className="text-xs tracking-[0.3em] text-[color:var(--gold)]">الباقات</span>
          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            <span className="text-gradient-gold">باقات</span> تليق بمناسبتك
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            اختر الباقة التي تناسب احتياجاتك، وتواصل معنا عبر واتساب لبدء التصميم.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {packages.map((p) => (
            <div
              key={p.name}
              className={`glass relative overflow-hidden rounded-3xl p-8 flex flex-col justify-between transition hover:-translate-y-1 ${
                p.featured ? "ring-2 ring-[color:var(--gold)] shadow-2xl" : ""
              }`}
            >
              <div>
                {p.featured && (
                  <span className="absolute left-6 top-6 rounded-full btn-gold px-3 py-1 text-xs">
                    الأكثر طلبًا
                  </span>
                )}
                <h2 className="text-2xl font-bold">{p.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                
                <ul className="mt-6 space-y-3 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-[color:var(--gold)] shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={whatsappUrl(`مرحبًا، أرغب بطلب ${p.name}`)}
                target="_blank"
                rel="noreferrer"
                className="btn-gold btn-gold-hover mt-8 block rounded-full py-3 text-center text-sm font-semibold"
              >
                التواصل عبر واتساب
              </a>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}