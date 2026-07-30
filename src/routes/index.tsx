
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { whatsappUrl } from "@/lib/config";
import {
  Sparkles,
  QrCode,
  MessageCircle,
  CheckCircle2,
  Palette,
} from "lucide-react";
import * as React from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "مناسبتك — دعوات إلكترونية" },
      {
        name: "description",
        content:
          "صمّم دعوتك الإلكترونية للمناسبة بلمسة راقية وأرسلها مباشرة عبر واتساب.",
      },
      { property: "og:title", content: "مناسبتك — دعوات إلكترونية" },
      {
        property: "og:description",
        content: "منصة متخصصة في الدعوات الإلكترونية.",
      },
    ],
  }),
  component: Index,
});

const features = [
  { icon: Sparkles, title: "تصميم فاخر", desc: "لمسات ذهبية وزخارف عربية أنيقة." },
  { icon: QrCode, title: "باركود للدخول", desc: "دخول سلس عبر QR لكل ضيف." },
  { icon: MessageCircle, title: "مشاركة عبر واتساب", desc: "أرسل دعوتك بضغطة واحدة." },
  { icon: CheckCircle2, title: "تأكيد الحضور", desc: "متابعة حضور الضيوف مباشرة." },
  { icon: Palette, title: "تصميم مخصص", desc: "ألوان وقوالب تُختار حسب ذوقك." },
];

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

function Index() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden px-4 pt-10 pb-24 md:pt-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center"
          >
            <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs">
              <Sparkles className="h-3.5 w-3.5 text-[color:var(--gold)]" />
              دعوات إلكترونية
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-[1.2] md:text-6xl">
              صمم <span className="text-gradient-gold">دعوتك</span> الإلكترونية
              <br />
              بكل سهولة
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              نصنع لك دعوة إلكترونية تعكس رقي مناسبتك، مع باركود
              للدخول ومتابعة الحضور، وتُرسل مباشرة عبر واتساب.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/register"
                className="btn-gold btn-gold-hover rounded-full px-7 py-3 text-sm font-semibold"
              >
                تسجيل بيانات مناسبتك
              </Link>
              <Link
                to="/packages"
                className="glass rounded-full px-7 py-3 text-sm font-semibold gold-border"
              >
                الباقات
              </Link>
              <a
                href={whatsappUrl("مرحبًا، أرغب بالاستفسار عن خدمات مناسبتك")}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[color:var(--gold)]/60 bg-[color:var(--champagne)] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--gold)] hover:text-black"
              >
                التواصل عبر واتساب
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionTitle eyebrow="مميزاتنا" title="لماذا مناسبتك؟" />
        <div className="mt-12 grid gap-6 md:grid-cols-3 lg:grid-cols-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-3xl p-6 text-center transition hover:-translate-y-1"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[color:var(--gold)] to-[color:var(--gold-soft)] text-white">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PACKAGES */}
      <section id="packages" className="mx-auto max-w-7xl px-4 py-20">
        <SectionTitle eyebrow="الباقات" title="اختر ما يناسب مناسبتك" />
        <div className="mt-12 grid gap-8 md:grid-cols-3">
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
                <h3 className="text-2xl font-bold">{p.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-extrabold text-[color:var(--gold)]">{p.price}</span>
                </div>
                
                <ul className="mt-6 space-y-3 text-sm border-t border-[color:var(--gold)]/20 pt-6">
                  {p.features.map((ft, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-[color:var(--gold)] shrink-0" />
                      <span className="text-muted-foreground">{ft}</span>
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

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="text-center">
      <span className="text-xs tracking-[0.3em] text-[color:var(--gold)]">
        {eyebrow}
      </span>
      <h2 className="mt-3 text-3xl font-bold md:text-4xl">{title}</h2>
      <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-l from-transparent via-[color:var(--gold)] to-transparent" />
    </div>
  );
}
