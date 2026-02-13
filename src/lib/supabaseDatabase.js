import { supabase } from './customSupabaseClient';
import { INITIAL_LIGHTING_DATA } from './supabase';

/**
 * MIGRATION / SEED
 */
export const seedInitialData = async (locadoraId) => {
  if (!locadoraId) throw new Error("É necessário um ID de locadora para vincular os equipamentos.");

  const formattedData = INITIAL_LIGHTING_DATA.map(item => ({
    modelo: item.name || item.titulo,
    marca: item.name.includes('Aputure') ? 'Aputure' : 'Creamsource',
    categoria: item.specifications?.type || 'Iluminação',
    watts: parseInt(item.specifications?.power) || 600,
    valor_diaria: item.daily_price || item.valorDiaria,
    quantidade: item.quantidadeTotal || 2,
    descricao: item.description,
    imagem: item.image_url || item.fotoPrincipal,
    locadora_id: locadoraId,
    disponivel: true
  }));

  const { data, error } = await supabase
    .from('equipamentos')
    .insert(formattedData)
    .select();

  if (error) throw error;
  return data;
};

/**
 * LOCADORAS
 */
export const getLocadoras = async () => {
  const { data, error } = await supabase
    .from('locadoras')
    .select('*')
    .order('nome', { ascending: true });
  if (error) throw error;
  return data;
};

export const updateLocadoraStatus = async (id, ativo) => {
  const { data, error } = await supabase
    .from('locadoras')
    .update({ ativo })
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
};

/**
 * EQUIPAMENTOS
 */
export const getAllEquipamentos = async () => {
  const { data, error } = await supabase
    .from('equipamentos')
    .select('*, locadoras(nome)')
    .eq('disponivel', true)
    .order('data_criacao', { ascending: false });
  if (error) throw error;
  return data;
};

export const getEquipamentosByLocadora = async (locadoraId) => {
  const { data, error } = await supabase
    .from('equipamentos')
    .select('*')
    .eq('locadora_id', locadoraId)
    .order('data_criacao', { ascending: false });
  if (error) throw error;
  return data;
};

export const getOtherLocadorasEquipment = async (myLocadoraId) => {
  const { data, error } = await supabase
    .from('equipamentos')
    .select('*, locadoras(cidade, estado)') // Only get location info, not name
    .neq('locadora_id', myLocadoraId)
    .eq('disponivel', true)
    .order('data_criacao', { ascending: false });
  if (error) throw error;
  return data;
};

export const createEquipamento = async (equipamentoData) => {
  const { data, error } = await supabase
    .from('equipamentos')
    .insert([equipamentoData])
    .select();
  if (error) throw error;
  return data;
};

export const updateEquipamento = async (id, equipamentoData) => {
  const { data, error } = await supabase
    .from('equipamentos')
    .update(equipamentoData)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
};

export const deleteEquipamento = async (id) => {
  const { error } = await supabase
    .from('equipamentos')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
};

/**
 * RESERVAS
 */
export const getReservas = async (filters = {}) => {
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
};

export const createReserva = async (reservaData) => {
  const { data, error } = await supabase
    .from('reservas')
    .insert([reservaData])
    .select();
  if (error) throw error;
  return data;
};

export const updateReservaStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('reservas')
    .update({ status })
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
};

/**
 * USUARIOS
 */
export const getUsuarios = async () => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*');
  if (error) throw error;
  return data;
};

export const getUserProfile = async (authId) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', authId) // Assuming auth.uid() matches id in usuarios table
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is no rows found
  return data;
};