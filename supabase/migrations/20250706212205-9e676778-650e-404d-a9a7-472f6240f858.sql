
-- Tabelle für Schwimmschul-Registrierungsanfragen erstellen
CREATE TABLE public.schwimmschule_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  description TEXT,
  features TEXT[], -- Array für Features/Angebote
  opening_hours JSONB,
  contact_person_name TEXT,
  contact_person_role TEXT,
  image_url TEXT, -- URL für hochgeladenes Foto
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT, -- Notizen für Admin
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS für die Registrierungstabelle aktivieren
ALTER TABLE public.schwimmschule_registrations ENABLE ROW LEVEL SECURITY;

-- Policy: Jeder kann eine Registrierung erstellen (für das öffentliche Formular)
CREATE POLICY "Anyone can create registration" 
  ON public.schwimmschule_registrations 
  FOR INSERT 
  WITH CHECK (true);

-- Policy: Nur Admins können alle Registrierungen sehen
CREATE POLICY "Admins can view all registrations" 
  ON public.schwimmschule_registrations 
  FOR SELECT 
  USING (auth.jwt() ->> 'role' = 'admin');

-- Policy: Registranten können nur ihre eigene Registrierung sehen
CREATE POLICY "Users can view their own registration" 
  ON public.schwimmschule_registrations 
  FOR SELECT 
  USING (email = auth.jwt() ->> 'email');

-- Policy: Nur Admins können Registrierungen aktualisieren
CREATE POLICY "Admins can update registrations" 
  ON public.schwimmschule_registrations 
  FOR UPDATE 
  USING (auth.jwt() ->> 'role' = 'admin');

-- Storage Bucket für Schwimmschul-Fotos erstellen
INSERT INTO storage.buckets (id, name, public) 
VALUES ('schwimmschule-photos', 'schwimmschule-photos', true);

-- Storage Policy: Jeder kann Fotos hochladen
CREATE POLICY "Anyone can upload photos" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'schwimmschule-photos');

-- Storage Policy: Jeder kann Fotos anzeigen
CREATE POLICY "Anyone can view photos" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'schwimmschule-photos');
