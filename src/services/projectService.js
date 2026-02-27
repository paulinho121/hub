import { supabase } from '@/lib/customSupabaseClient';

export const projectService = {
  async listByUser(usuarioId) {
    if (!usuarioId || !supabase) return [];
    try {
      const { data, error } = await supabase
        .from('projetos')
        .select('*')
        .eq('usuario_id', usuarioId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error in projectService.listByUser:', err);
      return [];
    }
  },

  async create({ usuario_id, titulo, descricao, equipamentos }) {
    if (!supabase) throw new Error('Supabase not initialized');
    const payload = {
      usuario_id,
      titulo,
      descricao: descricao || null,
      equipamentos: equipamentos || []
    };
    const { data, error } = await supabase
      .from('projetos')
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateEquipamentos(id, equipamentos) {
    if (!supabase) throw new Error('Supabase not initialized');
    const { data, error } = await supabase
      .from('projetos')
      .update({ equipamentos })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

