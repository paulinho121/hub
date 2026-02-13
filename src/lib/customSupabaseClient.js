import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Falha crítica: Variáveis de ambiente do Supabase não configuradas!');
}

// Cliente Supabase com persistência e auto-refresh de token
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    }
});

/**
 * Especialista Helper: Verifica se a conexão está ativa
 */
export const checkDbConnection = async () => {
    try {
        const { data, error } = await supabase.from('usuarios').select('count', { count: 'exact', head: true });
        return !error;
    } catch (e) {
        return false;
    }
};

export default supabase;

export {
    supabase as customSupabaseClient
};
