const AI_API_URL = import.meta.env.VITE_AI_API_URL || null;

export async function askAdminAssistant(question, contextLabel) {
  if (!AI_API_URL) {
    return 'Configure VITE_AI_API_URL para conectar este painel a um backend de IA (Edge Function ou API privada).';
  }

  const res = await fetch(`${AI_API_URL}/admin-assistant`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, contextLabel }),
  });

  if (!res.ok) {
    throw new Error('Falha ao consultar assistente de IA');
  }

  const data = await res.json();
  return data.answer || 'Assistente respondeu, mas a resposta veio vazia.';
}

export async function suggestLogisticsWindows(reservas) {
  if (!AI_API_URL) {
    // Fallback simples: agrupa por cidade e tipo de entrega
    const porCidade = new Map();
    (reservas || []).forEach((r) => {
      const cidade = r.locadoras?.cidade || 'Indefinida';
      porCidade.set(cidade, (porCidade.get(cidade) || 0) + 1);
    });
    const partes = [];
    porCidade.forEach((count, cidade) => {
      partes.push(`${cidade}: ${count} reserva(s).`);
    });
    return (
      'Sugestão local: agrupe entregas por cidade/bairro e concentre coletas pela manhã.\n' +
      partes.join(' ')
    );
  }

  const res = await fetch(`${AI_API_URL}/suggest-logistics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reservas }),
  });

  if (!res.ok) {
    throw new Error('Falha ao obter sugestão logística da IA');
  }

  const data = await res.json();
  return data.rationale || 'Sugestão logística retornada, mas sem detalhes.';
}

