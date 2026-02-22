-- Migration: Add Logistics Fields to Reservas
-- Description: Adds support for delivery options, freight, and more granular statuses

-- Add new columns if they don't exist
ALTER TABLE IF EXISTS public.reservas 
ADD COLUMN IF NOT EXISTS modalidade_entrega text DEFAULT 'hub_pickup',
ADD COLUMN IF NOT EXISTS endereco_entrega jsonb,
ADD COLUMN IF NOT EXISTS valor_frete numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS logistica_status text DEFAULT 'pendente',
ADD COLUMN IF NOT EXISTS checklist_saida jsonb,
ADD COLUMN IF NOT EXISTS checklist_entrada jsonb;

-- Comment on columns for clarity
COMMENT ON COLUMN public.reservas.modalidade_entrega IS 'Opções: hub_pickup ou delivery';
COMMENT ON COLUMN public.reservas.logistica_status IS 'Status específico do transporte: pendente, em_transito_hub, pronto_retirada, em_entrega, entregue, coletado_retorno';

-- Optional: Update existing status check constraint if it exists
-- This depends on how the current status is enforced.
-- Assuming status is a text column, we will handle the new statuses in the application layer.
