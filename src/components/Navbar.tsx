
import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { whatsappUrl } from "@/lib/config";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="mx-auto mt-4 max-w-6xl px-4">
        <nav className="glass flex items-center justify-between rounded-full px-4 py-2 sm:px-6">
          <Link to="/">
            <Logo />
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link to="/" className="text-sm hover:text-gold transition">الرئيسية</Link>
            <Link to="/packages" className="text-sm hover:text-gold transition">الباقات</Link>
            <Link to="/register" className="text-sm hover:text-gold transition">تسجيل مناسبة</Link>
            <Link to="/scanner" className="text-sm font-semibold text-[color:var(--gold)] hover:underline transition">
              دخول الأدمن
            </Link>
            <a
              href={whatsappUrl("مرحبًا، أرغب بالاستفسار عن خدمات مناسبتك")}
              target="_blank"
              rel="noreferrer"
              className="text-sm hover:text-gold transition"
            >
              تواصل
            </a>
          </div>
          <Link
            to="/register"
            className="btn-gold btn-gold-hover hidden rounded-full px-5 py-2 text-sm font-semibold md:inline-block"
          >
            ابدأ دعوتك
          </Link>
        </nav>
      </div>
    </header>
  );
}