-- Optional: Add customer contact fields to reservas for display and notifications.
-- Run only if your reservas table does not already have these columns.

ALTER TABLE IF EXISTS public.reservas
ADD COLUMN IF NOT EXISTS customer_name text,
ADD COLUMN IF NOT EXISTS customer_email text,
ADD COLUMN IF NOT EXISTS customer_phone text,
ADD COLUMN IF NOT EXISTS customer_whatsapp text,
ADD COLUMN IF NOT EXISTS customer_company text;

COMMENT ON COLUMN public.reservas.customer_name IS 'Nome do cliente no momento da reserva';
COMMENT ON COLUMN public.reservas.customer_email IS 'Email do cliente';
COMMENT ON COLUMN public.reservas.customer_phone IS 'Telefone do cliente';
COMMENT ON COLUMN public.reservas.customer_whatsapp IS 'WhatsApp do cliente';
COMMENT ON COLUMN public.reservas.customer_company IS 'Empresa do cliente (opcional)';
