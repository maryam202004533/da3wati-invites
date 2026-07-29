
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  groom_name TEXT NOT NULL,
  bride_name TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TEXT NOT NULL,
  venue_name TEXT NOT NULL,
  venue_map_url TEXT,
  guest_count INTEGER NOT NULL DEFAULT 0,
  design_choice TEXT,
  color_choice TEXT,
  invitation_text TEXT,
  image_url TEXT,
  music_url TEXT,
  package TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  companions INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'not_entered',
  entered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON public.guests (event_id);

GRANT SELECT, INSERT, UPDATE ON public.events TO anon;
GRANT SELECT, INSERT, UPDATE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;

GRANT SELECT, INSERT, UPDATE ON public.guests TO anon;
GRANT SELECT, INSERT, UPDATE ON public.guests TO authenticated;
GRANT ALL ON public.guests TO service_role;

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- Public can create events and guests (no login for customers)
CREATE POLICY "anyone can insert events" ON public.events FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anyone can read events" ON public.events FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "anyone can insert guests" ON public.guests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anyone can read guests" ON public.guests FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anyone can update guests" ON public.guests FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
