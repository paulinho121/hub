import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ReservaConfirmationPage = () => {
  const { state } = useLocation();
  const { reservation, item } = state || {};

  if (!reservation) {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center">
            <h1 className="text-2xl text-white mb-4">Nenhuma reserva encontrada</h1>
            <Link to="/">
                <Button className="bg-[#FFD700] text-black">Voltar para Home</Button>
            </Link>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Helmet>
        <title>Reserva Confirmada - HubLumi</title>
      </Helmet>

      <div className="max-w-md w-full glass p-8 rounded-3xl text-center border border-[#FFD700]/20">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2">Solicitação Enviada!</h1>
        <p className="text-gray-400 mb-8">
          A locadora recebeu seu pedido e entrará em contato em breve para confirmar os detalhes.
        </p>

        <div className="bg-white/5 rounded-xl p-6 text-left mb-8 space-y-3">
            <div className="flex justify-between text-sm">
                <span className="text-gray-500">ID da Reserva</span>
                <span className="text-white font-mono">{reservation.id}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-gray-500">Equipamento</span>
                <span className="text-white font-medium">{item?.titulo}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Estimado</span>
                <span className="text-[#FFD700] font-bold">R$ {reservation.valorTotal}</span>
            </div>
            <div className="pt-3 border-t border-white/10 text-xs text-gray-500 text-center">
                Você receberá uma cópia destes detalhes por email.
            </div>
        </div>

        <Link to="/catalogo">
          <Button className="w-full bg-[#FFD700] hover:bg-[#E5C100] text-black font-bold h-12 rounded-xl">
            Voltar ao Catálogo
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ReservaConfirmationPage;