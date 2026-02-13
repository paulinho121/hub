import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export const useRealtimeReservas = (initialData = [], locadoraId = null) => {
  const [reservas, setReservas] = useState(initialData);

  useEffect(() => {
    if (initialData.length > 0) {
      setReservas(initialData);
    }

    const channel = supabase
      .channel('reservas-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reservas',
          ...(locadoraId ? { filter: `locadora_id=eq.${locadoraId}` } : {})
        },
        (payload) => {
           // Note: Realtime payload only sends the modified row data.
           // It does not include joined data (like usuario info).
           // In a full app, you might trigger a re-fetch here, 
           // but for now we update the local state with available data.
          if (payload.eventType === 'INSERT') {
            setReservas((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setReservas((prev) =>
              prev.map((item) => (item.id === payload.new.id ? { ...item, ...payload.new } : item))
            );
          } else if (payload.eventType === 'DELETE') {
            setReservas((prev) =>
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

  return [reservas, setReservas];
};