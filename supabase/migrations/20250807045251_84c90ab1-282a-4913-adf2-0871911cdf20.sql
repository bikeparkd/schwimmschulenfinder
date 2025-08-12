-- Create table for swimming schools CSV import
CREATE TABLE public.schwimmschulen_import (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  place_id TEXT UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  reviews TEXT,
  rating TEXT,
  website TEXT,
  phone TEXT,
  can_claim TEXT,
  owner_name TEXT,
  owner_profile_link TEXT,
  featured_image TEXT,
  main_category TEXT,
  categories TEXT,
  workday_timing TEXT,
  is_temporarily_closed TEXT,
  closed_on TEXT,
  address TEXT,
  street TEXT,
  zip TEXT,
  city TEXT,
  review_keywords TEXT,
  link TEXT,
  query TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.schwimmschulen_import ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access for schwimmschulen_import" 
ON public.schwimmschulen_import 
FOR SELECT 
USING (true);

-- Create index on commonly searched fields
CREATE INDEX idx_schwimmschulen_import_city ON public.schwimmschulen_import(city);
CREATE INDEX idx_schwimmschulen_import_zip ON public.schwimmschulen_import(zip);
CREATE INDEX idx_schwimmschulen_import_place_id ON public.schwimmschulen_import(place_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_schwimmschulen_import_updated_at
  BEFORE UPDATE ON public.schwimmschulen_import
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();