import { createFileRoute, useParams } from "@tanstack/react-router";
import * as React from "react";
import { useServerFn } from "@tanstack/react-start";
import { getGuest } from "@/lib/admin.functions";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export const Route = createFileRoute("/guest/$id")({
  head: () => ({
    meta: [
      { title: "بطاقة الضيف — دعوتي" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: GuestPage,
});

function GuestPage() {
  const { id } = useParams({ from: "/guest/$id" });
  const fetchGuest = useServerFn(getGuest);
  const [guest, setGuest] = React.useState<any>(null);
  const [err, setErr] = React.useState("");

  React.useEffect(() => {
    fetchGuest({ data: { guestId: id } }).then(setGuest).catch(() => setErr("لم يتم العثور على الضيف"));
  }, [id]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-md px-4 py-16">
        <div className="glass rounded-3xl p-8 text-center">
          {err ? (
            <p className="text-destructive">{err}</p>
          ) : !guest ? (
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-[color:var(--gold)]" />
          ) : (
            <>
              <span className="text-xs tracking-[0.3em] text-[color:var(--gold)]">بطاقة الضيف</span>
              <h1 className="mt-3 text-3xl font-bold">{guest.name}</h1>
              {guest.events && (
                <p className="mt-2 text-sm text-muted-foreground">
                  حفل {guest.events.groom_name} و {guest.events.bride_name}
                  <br />
                  {guest.events.event_date} — {guest.events.venue_name}
                </p>
              )}
              <div className="mt-6">
                {guest.status === "entered" ? (
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-emerald-700">
                    <CheckCircle2 className="h-5 w-5" /> تم الدخول
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--champagne)] px-4 py-2">
                    <XCircle className="h-5 w-5" /> لم يدخل
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}