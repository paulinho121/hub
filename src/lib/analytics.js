// Analytics helpers – hoje apenas logam no console.
// Em produção, envie para uma tabela Supabase ou provedor externo.

export function trackEvent(name, payload = {}) {
  try {
    // eslint-disable-next-line no-console
    console.log('[analytics]', name, payload);
  } catch {
    // ignore
  }
}

export function trackViewEquipamento(equipamentoId) {
  trackEvent('view_equipamento', { equipamentoId });
}

export function trackStartReserva(equipamentoId) {
  trackEvent('start_reserva_flow', { equipamentoId });
}

export function trackCompleteReserva(reservaId) {
  trackEvent('complete_reserva', { reservaId });
}

