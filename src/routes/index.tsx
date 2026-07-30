
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
    name: "الباقة الأساسية",
    features: ["دعوة إلكترونية بتصميم أنيق", "مشاركة عبر واتساب", "قائمة ضيوف حتى 50"],
  },
  {
    name: "الباقة الذهبية",
    features: [
      "تصميم فاخر مع لمسات ذهبية",
      "باركود لكل ضيف",
      "تأكيد حضور",
      "قائمة ضيوف حتى 200",
    ],
    featured: true,
  },
  {
    name: "الباقة الملكية",
    features: [
      "تصميم مخصص بالكامل",
      "موسيقى وصورة خاصة",
      "لوحة إدارة كاملة",
      "ضيوف بلا حد",
    ],
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
                className="rounded-full border border-[color:var(--gold)]/60 bg-white px-7 py-3 text-sm font-semibold text-[color:var(--ink)] transition hover:bg-[color:var(--champagne)]"
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
      <section id="packages" className="mx-auto max-w-6xl px-4 py-20">
        <SectionTitle eyebrow="الباقات" title="اختر ما يناسب مناسبتك" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {packages.map((p) => (
            <div
              key={p.name}
              className={`glass relative overflow-hidden rounded-3xl p-8 flex flex-col justify-between transition hover:-translate-y-1 ${
                p.featured ? "ring-2 ring-[color:var(--gold)]" : ""
              }`}
            >
              <div>
                {p.featured && (
                  <span className="absolute left-6 top-6 rounded-full btn-gold px-3 py-1 text-xs">
                    الأكثر طلبًا
                  </span>
                )}
                <h3 className="text-2xl font-bold">{p.name}</h3>
                
                <ul className="mt-6 space-y-3 text-sm">
                  {p.features.map((ft) => (
                    <li key={ft} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-[color:var(--gold)] shrink-0" />
                      <span>{ft}</span>
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
                اطلب الآن
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
