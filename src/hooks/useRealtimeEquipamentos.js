import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export const useRealtimeEquipamentos = (initialData = [], locadoraId = null) => {
  const [equipamentos, setEquipamentos] = useState(initialData);

  useEffect(() => {
    // If initial data is provided, set it
    if (initialData.length > 0) {
      setEquipamentos(initialData);
    }

    // Subscribe to realtime changes
    const channel = supabase
      .channel('equipamentos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'equipamentos',
          ...(locadoraId ? { filter: `locadora_id=eq.${locadoraId}` } : {})
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setEquipamentos((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setEquipamentos((prev) =>
              prev.map((item) => (item.id === payload.new.id ? payload.new : item))
            );
          } else if (payload.eventType === 'DELETE') {
            setEquipamentos((prev) =>
              prev.filter((item) => item.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialData, locadoraId]);

  return [equipamentos, setEquipamentos];
};