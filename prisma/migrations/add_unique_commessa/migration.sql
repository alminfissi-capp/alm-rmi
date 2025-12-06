-- Add UNIQUE constraint to commessa field
-- This ensures no duplicate commessa numbers can exist

ALTER TABLE public.rilievi
ADD CONSTRAINT rilievi_commessa_unique UNIQUE (commessa);

-- Optional: Update existing NULL commessa values to avoid conflicts
-- This generates a unique commessa for any existing records without one
UPDATE public.rilievi
SET commessa = LPAD((ROW_NUMBER() OVER (ORDER BY created_at))::text, 3, '0')
WHERE commessa IS NULL OR commessa = '';
