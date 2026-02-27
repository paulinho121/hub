import React, { useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Painel de assistente (stub) – pronto para conectar em backend de IA.

const AdminAssistantPanel = ({ contextLabel = 'Painel Master' }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    try {
      // Aqui você pode integrar com um backend de IA privado.
      // Por enquanto, retornamos uma resposta estática.
      setAnswer(
        'Este é um assistente de exemplo. Conecte-o a um endpoint de IA para responder perguntas sobre métricas, locadoras e reservas.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="p-2 rounded-lg bg-indigo-500/20 border border-indigo-500/40">
          <MessageCircle className="w-4 h-4 text-indigo-300" />
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
            Assistente IA (em breve)
          </p>
          <p className="text-xs text-gray-300">
            Pergunte sobre {contextLabel}, métricas e tendências. Idealmente conectado a um LLM.
          </p>
        </div>
      </div>
      <form onSubmit={handleAsk} className="space-y-2">
        <textarea
          rows={2}
          className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-2 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFD700]"
          placeholder="Ex: Quais locadoras têm maior cancelamento de reservas nos últimos 30 dias?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <Button
          type="submit"
          disabled={loading || !question.trim()}
          className="w-full bg-[#FFD700] hover:bg-[#E5C100] text-black font-semibold text-xs"
        >
          {loading ? (
            'Consultando...'
          ) : (
            <>
              <Send className="w-3 h-3 mr-1" />
              Perguntar
            </>
          )}
        </Button>
      </form>
      {answer && (
        <div className="mt-2 text-xs text-gray-200 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
          {answer}
        </div>
      )}
    </div>
  );
};

export default AdminAssistantPanel;

