import { Logo } from "./Logo";
import { whatsappUrl, WHATSAPP_PHONE } from "@/lib/config";
import { MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[color:var(--gold)]/25 bg-[color:var(--beige)]/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row">
        <Logo />
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} دعوتي. جميع الحقوق محفوظة.
        </p>
        <a
          href={whatsappUrl("السلام عليكم، أرغب بالتواصل مع دعوتي")}
          target="_blank"
          rel="noreferrer"
          aria-label={`تواصل واتساب ${WHATSAPP_PHONE}`}
          className="flex h-12 w-12 items-center justify-center rounded-full btn-gold btn-gold-hover"
        >
          <MessageCircle className="h-5 w-5" />
        </a>
      </div>
    </footer>
  );
}