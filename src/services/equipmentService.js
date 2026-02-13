import { supabase } from '@/lib/customSupabaseClient';
import { INITIAL_LIGHTING_DATA } from '@/lib/supabase';

/**
 * Service to handle equipment data operations.
 * Centralizes the logic for fetching and managing equipment.
 */
export const equipmentService = {
    /**
     * Fetches all equipment from Supabase or falls back to initial data.
     */
    async getAllEquipment() {
        try {
            if (!supabase) return [];

            const { data, error } = await supabase
                .from('equipamentos')
                .select('*, locadoras(nome)')
                .eq('disponivel', true)
                .order('data_criacao', { ascending: false });

            if (error) {
                console.error('Erro ao buscar equipamentos:', error);
                return [];
            }

            return data || [];
        } catch (err) {
            console.error('Erro no equipmentService.getAllEquipment:', err);
            return [];
        }
    },

    /**
     * Fetches a single equipment item by ID.
     */
    async getEquipmentById(id) {
        try {
            if (!supabase) {
                return INITIAL_LIGHTING_DATA.find(e => e.id === id);
            }

            const { data, error } = await supabase
                .from('equipamentos')
                .select('*, locadoras(nome)')
                .eq('id', id)
                .single();

            if (error) {
                console.warn(`Error fetching equipment ${id}, falling back to mock data:`, error);
                return INITIAL_LIGHTING_DATA.find(e => e.id === id);
            }

            return data;
        } catch (err) {
            console.error('Error in equipmentService.getEquipmentById:', err);
            return INITIAL_LIGHTING_DATA.find(e => e.id === id);
        }
    },

    /**
     * Fetches equipment belonging to a specific locadora.
     */
    async getByLocadora(locadoraId) {
        try {
            if (!supabase) return [];
            const { data, error } = await supabase
                .from('equipamentos')
                .select('*')
                .eq('locadora_id', locadoraId)
                .order('data_criacao', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (err) {
            console.error('Error in equipmentService.getByLocadora:', err);
            return [];
        }
    },

    /**
     * Creates a new equipment item.
     */
    async create(equipmentData) {
        try {
            if (!supabase) throw new Error('Supabase not initialized');
            const { data, error } = await supabase
                .from('equipamentos')
                .insert([equipmentData])
                .select();

            if (error) throw error;
            return data[0];
        } catch (err) {
            console.error('Error in equipmentService.create:', err);
            throw err;
        }
    },

    /**
     * Updates an existing equipment item.
     */
    async update(id, equipmentData) {
        try {
            if (!supabase) throw new Error('Supabase not initialized');
            const { data, error } = await supabase
                .from('equipamentos')
                .update(equipmentData)
                .eq('id', id)
                .select();

            if (error) throw error;
            return data[0];
        } catch (err) {
            console.error('Error in equipmentService.update:', err);
            throw err;
        }
    },

    /**
     * Deletes an equipment item.
     */
    async delete(id) {
        try {
            if (!supabase) throw new Error('Supabase not initialized');
            const { error } = await supabase
                .from('equipamentos')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (err) {
            console.error('Error in equipmentService.delete:', err);
            throw err;
        }
    }
};
