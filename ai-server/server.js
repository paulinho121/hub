import express from 'express';

// Pequeno servidor de IA que expõe:
// POST /suggest-kit
// POST /admin-assistant
// POST /suggest-logistics
//
// Use a variável de ambiente GEMINI_API_KEY para configurar sua chave.

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8787;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

async function callGemini(prompt, extraSystem = '') {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY não configurada no backend.');
  }

  const systemInstruction =
    extraSystem ||
    'Você é um assistente especializado em locação de equipamentos de iluminação de cinema, ajudando com kits, logística e análises.';

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      GEMINI_MODEL
    )}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        systemInstruction: {
          role: 'system',
          parts: [{ text: systemInstruction }]
        }
      })
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Gemini error: ${res.status} ${text}`);
  }

  const data = await res.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join(' ') ||
    'Não consegui gerar uma resposta.';
  return text.trim();
}

// POST /suggest-kit
// body: { description, days, city, budget }
app.post('/suggest-kit', async (req, res) => {
  try {
    const { description, days, city, budget } = req.body || {};

    const prompt = [
      'Monte um kit de iluminação para cinema usando modelos genéricos (sem citar marcas específicas)',
      description ? `Descrição do job: ${description}` : '',
      days ? `Duração: ${days} dia(s)` : '',
      city ? `Cidade: ${city}` : '',
      budget ? `Orçamento aproximado: R$ ${budget}` : ''
    ]
      .filter(Boolean)
      .join('\n');

    const text = await callGemini(
      prompt,
      'Retorne primeiro uma explicação concisa, depois uma lista estruturada de itens no formato: ID_FICTICIO | quantidade. Use IDs simples como E1, E2, E3.'
    );

    const lines = text.split('\n').map((l) => l.trim());
    const items = [];
    for (const line of lines) {
      const match = line.match(/^E(\d+)\s*\|\s*(\d+)/i);
      if (match) {
        const id = match[1];
        const qty = parseInt(match[2], 10) || 1;
        items.push({
          equipamentoId: `E${id}`,
          quantidade: qty
        });
      }
    }

    res.json({
      items,
      rationale: text
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error /suggest-kit:', err);
    res.status(500).json({ error: 'Falha ao gerar sugestão de kit.' });
  }
});

// POST /admin-assistant
// body: { question, contextLabel }
app.post('/admin-assistant', async (req, res) => {
  try {
    const { question, contextLabel } = req.body || {};
    const prompt = `Contexto: ${contextLabel || 'painel master'}.\nPergunta: ${question}`;
    const answer = await callGemini(prompt);
    res.json({ answer });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error /admin-assistant:', err);
    res.status(500).json({ error: 'Falha ao consultar assistente.' });
  }
});

// POST /suggest-logistics
// body: { reservas }
app.post('/suggest-logistics', async (req, res) => {
  try {
    const { reservas } = req.body || {};
    const resumo =
      Array.isArray(reservas) && reservas.length > 0
        ? reservas
            .slice(0, 20)
            .map((r) => {
              const locadora = r.locadoras?.nome || 'Locadora';
              const cidade = r.locadoras?.cidade || 'Cidade';
              const entrega = r.modalidade_entrega || 'hub_pickup';
              return `${locadora} em ${cidade} - ${entrega}`;
            })
            .join('\n')
        : 'Nenhuma reserva fornecida.';

    const prompt = `Você é responsável pela logística de entregas e pickups deste hub de iluminação. Estas são algumas reservas (locadora, cidade, tipo de entrega):\n${resumo}\n\nSugira janelas de entrega/retirada e possíveis agrupamentos de rota (em texto corrido, objetivo).`;
    const rationale = await callGemini(prompt);
    res.json({ rationale });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error /suggest-logistics:', err);
    res.status(500).json({ error: 'Falha ao gerar sugestão logística.' });
  }
});

app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'hub-lumi-ai-server' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`AI server listening on port ${PORT}`);
});

