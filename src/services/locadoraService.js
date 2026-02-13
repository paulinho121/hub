import { supabase } from '@/lib/customSupabaseClient';

export const locadoraService = {
    async getAll() {
        try {
            if (!supabase) return [];
            const { data, error } = await supabase
                .from('locadoras')
                .select('*')
                .order('nome', { ascending: true });
            if (error) throw error;
            return data;
        } catch (err) {
            console.error('Error in locadoraService.getAll:', err);
            return [];
        }
    },

    async updateStatus(id, ativo) {
        try {
            if (!supabase) throw new Error('Supabase not initialized');
            const { data, error } = await supabase
                .from('locadoras')
                .update({ ativo })
                .eq('id', id)
                .select();
            if (error) throw error;
            return data;
        } catch (err) {
            console.error('Error in locadoraService.updateStatus:', err);
            throw err;
        }
    }
};
