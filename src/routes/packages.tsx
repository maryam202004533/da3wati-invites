
import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { whatsappUrl } from "@/lib/config";
import { CheckCircle2, Sparkles } from "lucide-react";

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
    name: "باقة 100 دعوة",
    price: "600 ر.س",
    desc: "مناسبة للمناسبات العائلية الخاصة.",
    features: [
      "تصميم دعوة إلكترونية راقٍ",
      "مشاركة الدعوة عبر واتساب",
      "قائمة ضيوف حتى 100 ضيف",
      "باركود QR لكل ضيف",
      "متابعة حضور الضيوف",
    ],
  },
  {
    name: "باقة 150 دعوة",
    price: "900 ر.س",
    desc: "خيار أنيق ومميز للحفلات المتوسطة.",
    features: [
      "تصميم فاخر بلمسات ذهبية",
      "مشاركة الدعوة عبر واتساب",
      "قائمة ضيوف حتى 150 ضيف",
      "باركود QR لكل ضيف لمنع التكرار",
      "متابعة حضور الضيوف لحظة بلحظة",
    ],
  },
  {
    name: "باقة 200 دعوة",
    price: "1100 ر.س",
    desc: "الخيار الأكثر طلباً للمناسبات المميزة.",
    features: [
      "تصميم فاخر بلمسات ذهبية",
      "باركود QR لكل ضيف",
      "متابعة حضور الضيوف",
      "قائمة ضيوف حتى 200 ضيف",
      "تشمل جميع مزايا الباقات الأساسية",
      "دعم فني سريع",
    ],
    featured: true,
  },
  {
    name: "باقة 250 دعوة",
    price: "1500 ر.س",
    desc: "تغطية شاملة للحفلات الكبيرة.",
    features: [
      "تصميم دعوة إلكترونية متكامل",
      "قائمة ضيوف حتى 250 ضيف",
      "باركود QR لكل ضيف وتأكيد الدخول",
      "لوحة إدارة الحضور للمنظمين",
      "دعم فني متميز",
    ],
  },
  {
    name: "باقة 300 دعوة",
    price: "1700 ر.س",
    desc: "حضور واسع وتنظيم احترافي.",
    features: [
      "تصميم مخصص وراقي",
      "قائمة ضيوف حتى 300 ضيف",
      "باركود QR ونظام منع التكرار",
      "متابعة حضور الضيوف لحظة بلحظة",
      "دعم فني سريع",
    ],
  },
  {
    name: "باقة 350 دعوة",
    price: "2000 ر.س",
    desc: "مثالية للمناسبات الكبرى والفاخرة.",
    features: [
      "تصميم استثنائي وفاخر",
      "قائمة ضيوف حتى 350 ضيف",
      "باركود QR ولوحة تحكم متكاملة",
      "تشمل جميع المزايا المتقدمة",
      "أولوية في الدعم الفني",
    ],
  },
  {
    name: "باقة 400 دعوة",
    price: "2500 ر.س",
    desc: "تنظيم متكامل لحفلات الضخمة.",
    features: [
      "تصميم احترافي مخصص",
      "قائمة ضيوف حتى 400 ضيف",
      "باركود QR لكل ضيف وسجل الحضور",
      "لوحة إدارة كاملة للمناسبة",
      "دعم فني خاص",
    ],
  },
  {
    name: "باقة 450 دعوة",
    price: "2700 ر.س",
    desc: "للحفلات الكبرى والمناسبات الرسمية.",
    features: [
      "تصميم ملكي راقٍ",
      "قائمة ضيوف حتى 450 ضيف",
      "باركود QR ونظام ماسح متطور",
      "متابعة حضور دقيقة لحظة بلحظة",
      "أولوية قصوى في التنفيذ",
    ],
  },
  {
    name: "الباقة بلا حدود",
    price: "3500 ر.س",
    desc: "تجربة استثنائية شاملة بلا أي قيود.",
    features: [
      "تصميم مخصص بالكامل حسب طلبك",
      "رفع صور خاصة وموسيقى اختيارية",
      "لوحة إدارة كاملة للمناسبة والمنظمين",
      "عدد ضيوف بلا حدود (غير محدود)",
      "تشمل جميع مزايا وباقات الموقع",
      "أولوية قصوى في التنفيذ والدعم",
    ],
    featured: true,
  },
];

function PackagesPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-24 w-full">
        <div className="text-center">
          <span className="text-xs tracking-[0.3em] text-[color:var(--gold)] font-semibold">الباقات والأسعار</span>
          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            <span className="text-gradient-gold">باقات</span> تليق بمناسبتك
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground text-sm md:text-base">
            اختر الباقة المناسبة لعدد ضيوفك، وتواصل معنا عبر واتساب لبدء التصميم فوراً.
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
                  <span className="absolute left-6 top-6 rounded-full btn-gold px-3 py-1 text-xs font-bold flex items-center gap-1 shadow-sm">
                    <Sparkles className="h-3 w-3" />
                    مميز
                  </span>
                )}
                <h2 className="text-2xl font-bold">{p.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-extrabold text-[color:var(--gold)]">{p.price}</span>
                </div>
                
                <ul className="mt-6 space-y-3 text-sm border-t border-[color:var(--gold)]/20 pt-6">
                  {p.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-[color:var(--gold)] shrink-0" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={whatsappUrl(`مرحبًا، أرغب بطلب الاشتراك في ${p.name}`)}
                target="_blank"
                rel="noreferrer"
                className="btn-gold btn-gold-hover mt-8 block rounded-full py-3 text-center text-sm font-semibold shadow-md"
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
