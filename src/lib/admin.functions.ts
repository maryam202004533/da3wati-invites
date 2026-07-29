import { createServerFn } from "@tanstack/react-start";

function checkPw(pw: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("ADMIN_PASSWORD not set");
  return pw === expected;
}

export const verifyAdmin = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string }) => d)
  .handler(async ({ data }) => ({ ok: checkPw(data.password) }));

export const adminListEvents = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string }) => d)
  .handler(async ({ data }) => {
    if (!checkPw(data.password)) throw new Error("Unauthorized");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: events, error } = await supabaseAdmin
      .from("events")
      .select("*, guests(*)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return events;
  });

export const adminCheckInGuest = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string; guestId: string }) => d)
  .handler(async ({ data }) => {
    if (!checkPw(data.password)) throw new Error("Unauthorized");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: guest, error: fetchErr } = await supabaseAdmin
      .from("guests")
      .select("*")
      .eq("id", data.guestId)
      .single();
    if (fetchErr || !guest) throw new Error("Guest not found");
    if (guest.status === "entered") {
      return { ok: false, reason: "already_entered", guest };
    }
    const { data: updated, error } = await supabaseAdmin
      .from("guests")
      .update({ status: "entered", entered_at: new Date().toISOString() })
      .eq("id", data.guestId)
      .select()
      .single();
    if (error) throw error;
    return { ok: true, guest: updated };
  });

export const getGuest = createServerFn({ method: "POST" })
  .inputValidator((d: { guestId: string }) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: guest, error } = await supabaseAdmin
      .from("guests")
      .select("*, events(groom_name, bride_name, event_date, venue_name)")
      .eq("id", data.guestId)
      .single();
    if (error) throw error;
    return guest;
  });