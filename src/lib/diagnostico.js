import { supabase } from './customSupabaseClient';
import { logDebug } from './debug';

export const checkSupabaseSetup = async () => {
  logDebug('DIAGNOSTICO', 'Iniciando verificação do sistema...');
  
  const results = {
    auth: { status: 'pending', message: '' },
    tables: {}
  };

  // 1. Check Auth (Can we reach the auth server?)
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    results.auth = { status: 'ok', message: data.session ? 'Sessão ativa' : 'Sem sessão ativa' };
  } catch (e) {
    results.auth = { status: 'error', message: e.message };
  }

  // 2. Check Tables
  const tablesToCheck = ['usuarios', 'locadoras', 'equipamentos', 'categorias', 'reservas'];

  for (const table of tablesToCheck) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        results.tables[table] = { status: 'error', message: error.message };
      } else {
        results.tables[table] = { status: 'ok', count: count, message: 'Tabela existe e é acessível' };
      }
    } catch (e) {
      results.tables[table] = { status: 'error', message: e.message };
    }
  }

  // 3. Check Specific Columns (Sample check for equipamentos)
  if (results.tables.equipamentos?.status === 'ok') {
    const { error } = await supabase
      .from('equipamentos')
      .select('modelo, categoria, valor_diaria, disponivel')
      .limit(1);
    
    if (error) {
      results.tables.equipamentos.columnsStatus = 'error';
      results.tables.equipamentos.columnsMessage = 'Colunas obrigatórias faltando: ' + error.message;
    } else {
      results.tables.equipamentos.columnsStatus = 'ok';
    }
  }

  logDebug('DIAGNOSTICO', 'Verificação concluída', results);
  return results;
};