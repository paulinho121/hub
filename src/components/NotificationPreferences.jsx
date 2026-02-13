import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, MessageSquare, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getNotificationPreferences, saveNotificationPreferences } from '@/lib/NotificationService';

const NotificationPreferences = ({ userId }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [preferences, setPreferences] = useState({
    email: true,
    whatsapp: false,
    frequency: 'immediate'
  });

  useEffect(() => {
    const loadPreferences = async () => {
      if (!userId) return;
      try {
        const { data } = await getNotificationPreferences(userId);
        if (data) {
          setPreferences(data);
        }
      } catch (error) {
        console.error("Failed to load preferences", error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [userId]);

  const handleToggle = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveNotificationPreferences(userId, preferences);
      toast({
        title: "Preferências salvas",
        description: "Suas configurações de notificação foram atualizadas.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar suas preferências.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-4 text-center text-gray-400">Carregando preferências...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center space-x-2 mb-4">
        <Bell className="w-5 h-5 text-yellow-500" />
        <h3 className="text-lg font-bold text-white">Configurações de Notificação</h3>
      </div>

      <div className="space-y-4">
        {/* Email Toggle */}
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-white font-medium">Notificações por Email</p>
              <p className="text-xs text-gray-400">Receba atualizações de reservas por email</p>
            </div>
          </div>
          <button
            onClick={() => handleToggle('email')}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              preferences.email ? 'bg-yellow-500' : 'bg-gray-700'
            }`}
          >
            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
              preferences.email ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* WhatsApp Toggle */}
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-white font-medium">Notificações por WhatsApp</p>
              <p className="text-xs text-gray-400">Receba mensagens instantâneas no seu WhatsApp</p>
            </div>
          </div>
          <button
            onClick={() => handleToggle('whatsapp')}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              preferences.whatsapp ? 'bg-green-500' : 'bg-gray-700'
            }`}
          >
            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
              preferences.whatsapp ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Frequency Dropdown */}
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <label className="block text-sm font-medium text-gray-300 mb-2">Frequência de Alertas</label>
          <select
            name="frequency"
            value={preferences.frequency}
            onChange={handleChange}
            className="w-full bg-black/30 border border-yellow-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
          >
            <option value="immediate" className="bg-gray-900">Imediato (Assim que ocorrer)</option>
            <option value="daily" className="bg-gray-900">Resumo Diário</option>
            <option value="weekly" className="bg-gray-900">Resumo Semanal</option>
          </select>
        </div>
      </div>

      <Button 
        onClick={handleSave} 
        disabled={saving}
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black mt-4"
      >
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Salvando...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Salvar Preferências
          </>
        )}
      </Button>
    </div>
  );
};

export default NotificationPreferences;