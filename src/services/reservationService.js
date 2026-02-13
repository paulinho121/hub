import { supabase } from '@/lib/customSupabaseClient';

export const reservationService = {
    async getReservas(filters = {}) {
        try {
            if (!supabase) return [];
            let query = supabase
                .from('reservas')
                .select('*, equipamentos(modelo, imagem), usuarios(nome, email), locadoras(nome)');

            if (filters.locadora_id) {
                query = query.eq('locadora_id', filters.locadora_id);
            }

            if (filters.usuario_id) {
                query = query.eq('usuario_id', filters.usuario_id);
            }

            const { data, error } = await query.order('data_criacao', { ascending: false });
            if (error) throw error;
            return data;
        } catch (err) {
            console.error('Error in reservationService.getReservas:', err);
            return [];
        }
    },

    async create(reservaData) {
        try {
            if (!supabase) throw new Error('Supabase not initialized');
            const { data, error } = await supabase
                .from('reservas')
                .insert([reservaData])
                .select();
            if (error) throw error;
            return data[0];
        } catch (err) {
            console.error('Error in reservationService.create:', err);
            throw err;
        }
    },

    async updateStatus(id, status) {
        try {
            if (!supabase) throw new Error('Supabase not initialized');
            const { data, error } = await supabase
                .from('reservas')
                .update({ status })
                .eq('id', id)
                .select();
            if (error) throw error;
            return data[0];
        } catch (err) {
            console.error('Error in reservationService.updateStatus:', err);
            throw err;
        }
    }
};
