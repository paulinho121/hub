// Simple AI client abstraction.
// In produção, aponte VITE_AI_API_URL para um backend (Edge Function / API)
// que chama um LLM (OpenAI, Gemini, etc.) e retorne sugestões de kit.

const AI_API_URL = import.meta.env.VITE_AI_API_URL || null;

/**
 * Sugere um kit de iluminação com base na descrição do job
 * e no catálogo atual de equipamentos.
 *
 * @param {{ description: string; days: number; city?: string; budget?: number; equipmentCatalog: any[] }} params
 * @returns {Promise<{ items: Array<{ equipamentoId: string; quantidade: number }>; rationale: string }>}
 */
export async function suggestKit(params) {
  const { description, days, city, budget, equipmentCatalog } = params || {};

  // Se houver backend configurado, delega a lógica para ele
  if (AI_API_URL) {
    const res = await fetch(`${AI_API_URL}/suggest-kit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description,
        days,
        city,
        budget,
      }),
    });

    if (!res.ok) {
      throw new Error('Falha ao obter sugestão de kit da IA');
    }

    const data = await res.json();
    return data;
  }

  // Fallback local determinístico (sem IA real) para desenvolvimento:
  // Escolhe até 3 equipamentos mais caros (supostamente "principais")
  // e sugere quantidades pequenas com base nos dias.
  const sorted = [...(equipmentCatalog || [])]
    .filter(e => e.disponivel)
    .sort((a, b) => (b.valor_diaria || 0) - (a.valor_diaria || 0));

  const top = sorted.slice(0, 3);
  const items = top.map((e, idx) => ({
    equipamentoId: e.id,
    quantidade: idx === 0 ? 2 : 1,
  }));

  const rationaleParts = [];
  if (description) rationaleParts.push(`Job: ${description}`);
  if (city) rationaleParts.push(`Cidade: ${city}`);
  if (days) rationaleParts.push(`Duração: ${days} dia(s)`);
  if (budget) rationaleParts.push(`Orçamento aproximado: R$ ${budget}`);

  const rationaleHeader = rationaleParts.length
    ? rationaleParts.join(' | ')
    : 'Sugestão baseada nos equipamentos mais potentes disponíveis.';

  return {
    items,
    rationale:
      rationaleHeader +
      ' (sugestão automática local; configure VITE_AI_API_URL para IA avançada).',
  };
}

