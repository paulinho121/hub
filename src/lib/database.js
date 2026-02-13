/**
 * Mock Database and CRUD Operations for Hub Rental CinePro
 * 
 * Data Structures:
 * - Locadoras: Companies renting out equipment
 * - Equipamentos: Items available for rent
 * - Reservas: Rental transactions
 */

// Helper to simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- Initial Data Generators ---

const INITIAL_LOCADORAS = [
  {
    id: 'loc-1',
    razaoSocial: 'CineLight SP Locações Ltda',
    cnpj: '12.345.678/0001-90',
    inscricaoEstadual: '123.456.789.111',
    contribuinte: 'Sim',
    email: 'contato@cinelight.com.br',
    senha: '123', // In real app, hash this
    telefone: '(11) 98765-4321',
    endereco: 'Rua das Câmeras, 123 - Vila Madalena',
    cidade: 'São Paulo',
    estado: 'SP',
    dataCadastro: '2023-01-15T10:00:00Z',
    status: 'ativo'
  },
  {
    id: 'loc-2',
    razaoSocial: 'Sul Cine Equipamentos',
    cnpj: '98.765.432/0001-10',
    inscricaoEstadual: '987.654.321.222',
    contribuinte: 'Sim',
    email: 'admin@sulcine.com.br',
    senha: '123',
    telefone: '(51) 99999-8888',
    endereco: 'Av. do Cinema, 500 - Moinhos de Vento',
    cidade: 'Porto Alegre',
    estado: 'RS',
    dataCadastro: '2023-03-20T14:30:00Z',
    status: 'ativo'
  }
];

const INITIAL_EQUIPAMENTOS = [
  {
    id: 'eq-1',
    locadoraId: 'loc-1',
    titulo: 'Aputure 600d Pro',
    descricao: 'LED Daylight de alta potência, equivalente a HMI 1.2k. Resistente à água (IP54). Inclui control box e cabos.',
    valorDiaria: 450.00,
    quantidadeTotal: 4,
    statusDisponibilidade: 'disponivel',
    cidade: 'São Paulo',
    estado: 'SP',
    enderecoCurto: 'Vila Madalena, SP',
    fotoPrincipal: 'https://images.unsplash.com/photo-1580168500910-a57358352f14?w=800&h=600&fit=crop',
    fotoExtra1: 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125f?w=800&h=600&fit=crop',
    fotoExtra2: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=800&h=600&fit=crop',
    dataCadastro: '2023-01-16T09:00:00Z',
    ultimaAtualizacao: '2023-01-16T09:00:00Z'
  },
  {
    id: 'eq-2',
    locadoraId: 'loc-1',
    titulo: 'Arri SkyPanel S60-C',
    descricao: 'Painel de LED Softlight, temperatura de cor ajustável de 2800K a 10000K. Full RGBW.',
    valorDiaria: 850.00,
    quantidadeTotal: 2,
    statusDisponibilidade: 'disponivel',
    cidade: 'São Paulo',
    estado: 'SP',
    enderecoCurto: 'Vila Madalena, SP',
    fotoPrincipal: 'https://images.unsplash.com/photo-1584662504453-c544619622bf?w=800&h=600&fit=crop',
    fotoExtra1: '',
    fotoExtra2: '',
    dataCadastro: '2023-01-16T09:30:00Z',
    ultimaAtualizacao: '2023-01-16T09:30:00Z'
  },
  {
    id: 'eq-3',
    locadoraId: 'loc-2',
    titulo: 'Aputure 300d II',
    descricao: 'O workhorse da Aputure. LED 5500K balanceado, 20% mais brilhante que o antecessor.',
    valorDiaria: 250.00,
    quantidadeTotal: 6,
    statusDisponibilidade: 'disponivel',
    cidade: 'Porto Alegre',
    estado: 'RS',
    enderecoCurto: 'Moinhos de Vento, POA',
    fotoPrincipal: 'https://images.unsplash.com/photo-1574261450390-18ecf55412bf?w=800&h=600&fit=crop',
    fotoExtra1: '',
    fotoExtra2: '',
    dataCadastro: '2023-03-21T11:00:00Z',
    ultimaAtualizacao: '2023-03-21T11:00:00Z'
  }
];

const INITIAL_RESERVAS = [
  {
    id: 'res-1',
    equipamentoId: 'eq-1',
    locadoraId: 'loc-1',
    usuarioClienteId: 'cli-1',
    nomeCliente: 'João Diretor',
    emailCliente: 'joao@producao.com',
    dataInicio: '2023-11-10',
    dataFim: '2023-11-12',
    quantidadeReservada: 1,
    status: 'confirmada', // pendente, confirmada, cancelada, concluida
    valorTotal: 1350.00,
    dataCriacao: '2023-11-01T10:00:00Z'
  }
];

// --- Initialization ---

const initializeDB = () => {
  if (!localStorage.getItem('hub_locadoras')) {
    localStorage.setItem('hub_locadoras', JSON.stringify(INITIAL_LOCADORAS));
  }
  if (!localStorage.getItem('hub_equipamentos')) {
    localStorage.setItem('hub_equipamentos', JSON.stringify(INITIAL_EQUIPAMENTOS));
  }
  if (!localStorage.getItem('hub_reservas')) {
    localStorage.setItem('hub_reservas', JSON.stringify(INITIAL_RESERVAS));
  }
};

initializeDB();

// --- Generic CRUD Helpers ---

const getCollection = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const saveCollection = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// --- Locadora Operations ---

export const getLocadoras = async () => {
  await delay(300);
  return getCollection('hub_locadoras');
};

export const getLocadoraById = async (id) => {
  await delay(200);
  const list = getCollection('hub_locadoras');
  return list.find(l => l.id === id);
};

export const getLocadoraByEmail = async (email) => {
  await delay(200);
  const list = getCollection('hub_locadoras');
  return list.find(l => l.email === email);
};

export const createLocadora = async (data) => {
  await delay(500);
  const list = getCollection('hub_locadoras');
  
  if (list.some(l => l.email === data.email)) {
    throw new Error('Email já cadastrado');
  }
  if (list.some(l => l.cnpj === data.cnpj)) {
    throw new Error('CNPJ já cadastrado');
  }

  const newLocadora = {
    id: `loc-${Date.now()}`,
    ...data,
    dataCadastro: new Date().toISOString(),
    status: 'ativo'
  };

  list.push(newLocadora);
  saveCollection('hub_locadoras', list);
  return newLocadora;
};

export const updateLocadora = async (id, updates) => {
  await delay(400);
  const list = getCollection('hub_locadoras');
  const index = list.findIndex(l => l.id === id);
  
  if (index === -1) throw new Error('Locadora não encontrada');
  
  list[index] = { ...list[index], ...updates };
  saveCollection('hub_locadoras', list);
  return list[index];
};

export const loginLocadora = async (email, senha) => {
  await delay(600);
  const list = getCollection('hub_locadoras');
  const locadora = list.find(l => l.email === email && l.senha === senha);
  
  if (!locadora) throw new Error('Credenciais inválidas');
  if (locadora.status !== 'ativo') throw new Error('Conta inativa');
  
  return locadora;
};

// --- Equipamento Operations ---

export const getEquipamentos = async (filters = {}) => {
  await delay(300);
  let list = getCollection('hub_equipamentos');

  if (filters.locadoraId) {
    list = list.filter(e => e.locadoraId === filters.locadoraId);
  }
  if (filters.cidade) {
    list = list.filter(e => e.cidade === filters.cidade);
  }
  if (filters.estado) {
    list = list.filter(e => e.estado === filters.estado);
  }
  
  return list;
};

export const getEquipamentoById = async (id) => {
  await delay(200);
  const list = getCollection('hub_equipamentos');
  return list.find(e => e.id === id);
};

export const createEquipamento = async (data) => {
  await delay(400);
  const list = getCollection('hub_equipamentos');
  const newEquipamento = {
    id: `eq-${Date.now()}`,
    ...data,
    dataCadastro: new Date().toISOString(),
    ultimaAtualizacao: new Date().toISOString()
  };
  
  list.push(newEquipamento);
  saveCollection('hub_equipamentos', list);
  return newEquipamento;
};

export const updateEquipamento = async (id, updates) => {
  await delay(300);
  const list = getCollection('hub_equipamentos');
  const index = list.findIndex(e => e.id === id);
  
  if (index === -1) throw new Error('Equipamento não encontrado');
  
  list[index] = { 
    ...list[index], 
    ...updates,
    ultimaAtualizacao: new Date().toISOString()
  };
  saveCollection('hub_equipamentos', list);
  return list[index];
};

export const deleteEquipamento = async (id) => {
  await delay(300);
  const list = getCollection('hub_equipamentos');
  const filtered = list.filter(e => e.id !== id);
  saveCollection('hub_equipamentos', filtered);
  return true;
};

// --- Reserva Operations ---

export const getReservas = async (locadoraId = null) => {
  await delay(300);
  let list = getCollection('hub_reservas');
  
  if (locadoraId) {
    list = list.filter(r => r.locadoraId === locadoraId);
  }
  
  // Sort by most recent
  return list.sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao));
};

export const createReserva = async (data) => {
  await delay(500);
  const list = getCollection('hub_reservas');
  
  // Basic validation would go here
  
  const newReserva = {
    id: `res-${Date.now()}`,
    ...data,
    status: 'pendente',
    dataCriacao: new Date().toISOString()
  };
  
  list.push(newReserva);
  saveCollection('hub_reservas', list);
  return newReserva;
};

export const updateReservaStatus = async (id, status) => {
  await delay(300);
  const list = getCollection('hub_reservas');
  const index = list.findIndex(r => r.id === id);
  
  if (index === -1) throw new Error('Reserva não encontrada');
  
  list[index].status = status;
  saveCollection('hub_reservas', list);
  return list[index];
};

// --- Logic ---

export const checkAvailability = async (equipamentoId, dataInicio, dataFim) => {
  // 1. Get equipment total quantity
  const equipamento = await getEquipamentoById(equipamentoId);
  if (!equipamento) return 0;
  
  const totalQty = parseInt(equipamento.quantidadeTotal);
  
  // 2. Get all ACTIVE reservations for this equipment in the date range
  const reservas = getCollection('hub_reservas').filter(r => 
    r.equipamentoId === equipamentoId && 
    r.status !== 'cancelada' &&
    r.status !== 'concluida' // Assuming 'concluida' means returned, but for future dates it blocks
  );
  
  const start = new Date(dataInicio);
  const end = new Date(dataFim);
  
  let maxReserved = 0;
  
  // Simple day-by-day check (not efficient for large datasets but works for mock)
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    let reservedOnDay = 0;
    reservas.forEach(r => {
      const rStart = new Date(r.dataInicio);
      const rEnd = new Date(r.dataFim);
      if (d >= rStart && d <= rEnd) {
        reservedOnDay += parseInt(r.quantidadeReservada);
      }
    });
    if (reservedOnDay > maxReserved) maxReserved = reservedOnDay;
  }
  
  return Math.max(0, totalQty - maxReserved);
};