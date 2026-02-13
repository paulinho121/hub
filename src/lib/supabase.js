/**
 * Supabase Client Configuration
 * 
 * IMPORTANT: Supabase integration is not yet complete.
 * Please complete the Supabase integration steps in your Hostinger dashboard
 * before using this client.
 * 
 * Current Status: NOT CONNECTED
 * 
 * This file serves as a placeholder and will be ready to use once
 * the integration is completed.
 */

// Placeholder - will be replaced with actual Supabase client after integration
export const supabase = null;

// Helper function to check if Supabase is connected
export const isSupabaseConnected = () => {
  return false; // Will return true once integration is complete
};

// Initial Data for Lighting Equipment - 12 Specific Items (9 Aputure + 3 Creamsource)
export const INITIAL_LIGHTING_DATA = [
  {
    id: '1',
    name: 'Aputure LS 1200d',
    titulo: 'Aputure LS 1200d',
    description: 'O LED Daylight mais brilhante da linha Light Storm. Ideal para grandes produções que exigem potência bruta e confiabilidade.',
    daily_price: 1200,
    valorDiaria: 1200,
    statusDisponibilidade: 'disponivel',
    quantidadeTotal: 4,
    cidade: 'São Paulo',
    estado: 'SP',
    enderecoCurto: 'Vila Madalena',
    image_url: 'https://images.unsplash.com/photo-1580168500910-a57358352f14?w=800&h=600&fit=crop',
    fotoPrincipal: 'https://images.unsplash.com/photo-1580168500910-a57358352f14?w=800&h=600&fit=crop',
    specifications: { power: '1200W', type: 'LED Monolight', colorTemp: '5600K', mount: 'Bowens', weight: '8.5kg' }
  },
  {
    id: '2',
    name: 'Aputure Storm 1200x',
    titulo: 'Aputure Storm 1200x',
    description: 'Versatilidade extrema com tecnologia Bicolor. Ajuste a temperatura de cor sem perder potência significativa em qualquer set.',
    daily_price: 1350,
    valorDiaria: 1350,
    statusDisponibilidade: 'disponivel',
    quantidadeTotal: 2,
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    enderecoCurto: 'Barra da Tijuca',
    image_url: 'https://images.unsplash.com/photo-1689979030586-a801e23870b7?w=800&h=600&fit=crop',
    fotoPrincipal: 'https://images.unsplash.com/photo-1689979030586-a801e23870b7?w=800&h=600&fit=crop',
    specifications: { power: '1200W', type: 'LED Bicolor', colorTemp: '2700K-6500K', mount: 'Bowens', weight: '9kg' }
  },
  {
    id: '3',
    name: 'Aputure LS 600d PRO',
    titulo: 'Aputure LS 600d PRO',
    description: 'O padrão da indústria para LEDs de média/alta potência. Weather-resistant e controle via Sidus Link para máxima eficiência.',
    daily_price: 600,
    valorDiaria: 600,
    statusDisponibilidade: 'indisponivel',
    quantidadeTotal: 0,
    cidade: 'Belo Horizonte',
    estado: 'MG',
    enderecoCurto: 'Savassi',
    image_url: 'https://images.unsplash.com/photo-1580168500910-a57358352f14?w=800&h=600&fit=crop',
    fotoPrincipal: 'https://images.unsplash.com/photo-1580168500910-a57358352f14?w=800&h=600&fit=crop',
    specifications: { power: '600W', type: 'LED Monolight', colorTemp: '5600K', mount: 'Bowens', weight: '4.6kg' }
  },
  {
    id: '4',
    name: 'Aputure LS 1200x',
    titulo: 'Aputure LS 1200x',
    description: 'Potência massiva com flexibilidade Bicolor. A escolha certa para sets dinâmicos que exigem adaptação rápida.',
    daily_price: 1300,
    valorDiaria: 1300,
    statusDisponibilidade: 'disponivel',
    quantidadeTotal: 3,
    cidade: 'Curitiba',
    estado: 'PR',
    enderecoCurto: 'Batel',
    image_url: 'https://images.unsplash.com/photo-1580168500910-a57358352f14?w=800&h=600&fit=crop',
    fotoPrincipal: 'https://images.unsplash.com/photo-1580168500910-a57358352f14?w=800&h=600&fit=crop',
    specifications: { power: '1200W', type: 'LED Bicolor', colorTemp: '2700K-6500K', mount: 'Bowens', weight: '8.8kg' }
  },
  {
    id: '5',
    name: 'Aputure 600D Pro',
    titulo: 'Aputure 600D Pro',
    description: 'Versão Pro do aclamado 600D. Mais robustez, melhor refrigeração e resistência a intempéries para externas.',
    daily_price: 650,
    valorDiaria: 650,
    statusDisponibilidade: 'disponivel',
    quantidadeTotal: 5,
    cidade: 'Porto Alegre',
    estado: 'RS',
    enderecoCurto: 'Moinhos de Vento',
    image_url: 'https://images.unsplash.com/photo-1689979030586-a801e23870b7?w=800&h=600&fit=crop',
    fotoPrincipal: 'https://images.unsplash.com/photo-1689979030586-a801e23870b7?w=800&h=600&fit=crop',
    specifications: { power: '600W', type: 'LED Monolight', colorTemp: '5600K', mount: 'Bowens', weight: '4.8kg' }
  },
  {
    id: '6',
    name: 'Aputure LS 1200d Pro',
    titulo: 'Aputure LS 1200d Pro',
    description: 'O ápice da iluminação LED Daylight. Output comparável a HMIs de 1.8k com consumo de energia muito menor.',
    daily_price: 1400,
    valorDiaria: 1400,
    statusDisponibilidade: 'disponivel',
    quantidadeTotal: 2,
    cidade: 'São Paulo',
    estado: 'SP',
    enderecoCurto: 'Itaim Bibi',
    image_url: 'https://images.unsplash.com/photo-1580168500910-a57358352f14?w=800&h=600&fit=crop',
    fotoPrincipal: 'https://images.unsplash.com/photo-1580168500910-a57358352f14?w=800&h=600&fit=crop',
    specifications: { power: '1200W', type: 'LED Monolight', colorTemp: '5600K', mount: 'Bowens', weight: '8.9kg' }
  },
  {
    id: '7',
    name: 'Aputure Storm 1000c',
    titulo: 'Aputure Storm 1000c',
    description: 'Full Color com potência de sobra. Crie qualquer atmosfera com precisão de cor absoluta e efeitos dinâmicos.',
    daily_price: 1100,
    valorDiaria: 1100,
    statusDisponibilidade: 'indisponivel',
    quantidadeTotal: 0,
    cidade: 'Brasília',
    estado: 'DF',
    enderecoCurto: 'Asa Norte',
    image_url: 'https://images.unsplash.com/photo-1689979030586-a801e23870b7?w=800&h=600&fit=crop',
    fotoPrincipal: 'https://images.unsplash.com/photo-1689979030586-a801e23870b7?w=800&h=600&fit=crop',
    specifications: { power: '1000W', type: 'LED RGBWW', colorTemp: '2000K-10000K', mount: 'Bowens', weight: '7.5kg' }
  },
  {
    id: '8',
    name: 'Aputure LS 1200d Mark II',
    titulo: 'Aputure LS 1200d Mark II',
    description: 'A evolução do clássico. Mais silencioso e com melhor gerenciamento térmico para longas diárias.',
    daily_price: 1250,
    valorDiaria: 1250,
    statusDisponibilidade: 'disponivel',
    quantidadeTotal: 3,
    cidade: 'Salvador',
    estado: 'BA',
    enderecoCurto: 'Rio Vermelho',
    image_url: 'https://images.unsplash.com/photo-1580168500910-a57358352f14?w=800&h=600&fit=crop',
    fotoPrincipal: 'https://images.unsplash.com/photo-1580168500910-a57358352f14?w=800&h=600&fit=crop',
    specifications: { power: '1200W', type: 'LED Monolight', colorTemp: '5600K', mount: 'Bowens', weight: '8.2kg' }
  },
  {
    id: '9',
    name: 'Aputure LS 600x Pro',
    titulo: 'Aputure LS 600x Pro',
    description: 'Bi-Color flexível com montagem Bowens. Perfeito para entrevistas e documentários em locações variadas.',
    daily_price: 750,
    valorDiaria: 750,
    statusDisponibilidade: 'disponivel',
    quantidadeTotal: 4,
    cidade: 'São Paulo',
    estado: 'SP',
    enderecoCurto: 'Pinheiros',
    image_url: 'https://images.unsplash.com/photo-1689979030586-a801e23870b7?w=800&h=600&fit=crop',
    fotoPrincipal: 'https://images.unsplash.com/photo-1689979030586-a801e23870b7?w=800&h=600&fit=crop',
    specifications: { power: '600W', type: 'LED Bicolor', colorTemp: '2700K-6500K', mount: 'Bowens', weight: '4.8kg' }
  },
  {
    id: '10',
    name: 'Creamsource Vortex 24',
    titulo: 'Creamsource Vortex 24',
    description: 'Uma parede de luz. O Vortex 24 oferece cobertura massiva para grandes áreas e estúdios com qualidade de cor impecável.',
    daily_price: 2500,
    valorDiaria: 2500,
    statusDisponibilidade: 'disponivel',
    quantidadeTotal: 1,
    cidade: 'São Paulo',
    estado: 'SP',
    enderecoCurto: 'Vila Leopoldina',
    image_url: 'https://images.unsplash.com/photo-1629276298823-13b6653d65a5?w=800&h=600&fit=crop',
    fotoPrincipal: 'https://images.unsplash.com/photo-1629276298823-13b6653d65a5?w=800&h=600&fit=crop',
    specifications: { power: '1950W', type: 'LED Panel', colorTemp: '2200K-15000K', mount: 'Yoke', weight: '45kg' }
  },
  {
    id: '11',
    name: 'Creamsource Vortex 8',
    titulo: 'Creamsource Vortex 8',
    description: 'O padrão da indústria para painéis de alta intensidade IP65. Robusto, confiável e com efeitos integrados.',
    daily_price: 1100,
    valorDiaria: 1100,
    statusDisponibilidade: 'disponivel',
    quantidadeTotal: 4,
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    enderecoCurto: 'Botafogo',
    image_url: 'https://images.unsplash.com/photo-1574261450390-18ecf55412bf?w=800&h=600&fit=crop',
    fotoPrincipal: 'https://images.unsplash.com/photo-1574261450390-18ecf55412bf?w=800&h=600&fit=crop',
    specifications: { power: '650W', type: 'LED Panel', colorTemp: '2200K-15000K', mount: 'Yoke', weight: '16kg' }
  },
  {
    id: '12',
    name: 'Creamsource Vortex 4',
    titulo: 'Creamsource Vortex 4',
    description: 'Compacto mas poderoso. Toda a tecnologia Vortex em um formato menor para espaços apertados.',
    daily_price: 800,
    valorDiaria: 800,
    statusDisponibilidade: 'disponivel',
    quantidadeTotal: 2,
    cidade: 'São Paulo',
    estado: 'SP',
    enderecoCurto: 'Jardins',
    image_url: 'https://images.unsplash.com/photo-1629276298823-13b6653d65a5?w=800&h=600&fit=crop',
    fotoPrincipal: 'https://images.unsplash.com/photo-1629276298823-13b6653d65a5?w=800&h=600&fit=crop',
    specifications: { power: '325W', type: 'LED Panel', colorTemp: '2200K-15000K', mount: 'Yoke', weight: '9kg' }
  }
];

// Mock functions for development (using localStorage)
export const mockSupabaseOperations = {
  auth: {
    signUp: async ({ email, password, data }) => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (users.find(u => u.email === email)) {
        throw new Error('User already exists');
      }
      
      const newUser = {
        id: Date.now().toString(),
        email,
        password_hash: password, // In real app, this would be hashed
        name: data?.name || '',
        company: data?.company || '',
        phone: data?.phone || '',
        whatsapp: data?.whatsapp || '',
        role: data?.role || 'user',
        userType: data?.userType || 'cliente', // Add userType
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      return { data: { user: newUser }, error: null };
    },
    
    signInWithPassword: async ({ email, password }) => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email && u.password_hash === password);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { data: { user }, error: null };
    },
    
    signOut: async () => {
      localStorage.removeItem('currentUser');
      return { error: null };
    },
    
    getSession: async () => {
      const user = localStorage.getItem('currentUser');
      return { data: { session: user ? { user: JSON.parse(user) } : null }, error: null };
    }
  },

  // Equipment Mock Operations for Locadoras
  createEquipment: async (userId, equipmentData) => {
    const allEquipment = JSON.parse(localStorage.getItem('rental_equipment') || '[]');
    const newEquipment = {
      id: Date.now().toString(),
      userId,
      ...equipmentData,
      createdAt: new Date().toISOString()
    };
    allEquipment.push(newEquipment);
    localStorage.setItem('rental_equipment', JSON.stringify(allEquipment));
    return { data: newEquipment, error: null };
  },

  getEquipmentByLocadora: async (userId) => {
    const allEquipment = JSON.parse(localStorage.getItem('rental_equipment') || '[]');
    const userEquipment = allEquipment.filter(e => e.userId === userId);
    return { data: userEquipment, error: null };
  },

  updateEquipment: async (userId, equipmentId, updates) => {
    const allEquipment = JSON.parse(localStorage.getItem('rental_equipment') || '[]');
    const index = allEquipment.findIndex(e => e.id === equipmentId && e.userId === userId);
    
    if (index === -1) {
      return { data: null, error: { message: 'Equipment not found' } };
    }

    allEquipment[index] = { ...allEquipment[index], ...updates };
    localStorage.setItem('rental_equipment', JSON.stringify(allEquipment));
    return { data: allEquipment[index], error: null };
  },

  deleteEquipment: async (userId, equipmentId) => {
    const allEquipment = JSON.parse(localStorage.getItem('rental_equipment') || '[]');
    const filtered = allEquipment.filter(e => !(e.id === equipmentId && e.userId === userId));
    
    if (filtered.length === allEquipment.length) {
      return { error: { message: 'Equipment not found or unauthorized' } };
    }

    localStorage.setItem('rental_equipment', JSON.stringify(filtered));
    return { error: null };
  },

  // Notification and User Preferences Mock Operations
  updateUserNotificationPreferences: async (userId, preferences) => {
    const prefs = JSON.parse(localStorage.getItem('notificationPreferences') || '{}');
    prefs[userId] = { ...prefs[userId], ...preferences };
    localStorage.setItem('notificationPreferences', JSON.stringify(prefs));
    return { data: prefs[userId], error: null };
  },

  getUserNotificationPreferences: async (userId) => {
    const prefs = JSON.parse(localStorage.getItem('notificationPreferences') || '{}');
    return { data: prefs[userId] || { email: true, whatsapp: false, frequency: 'immediate' }, error: null };
  },

  updateUserContactInfo: async (userId, email, whatsapp) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return { data: null, error: { message: 'User not found' } };
    }

    users[userIndex] = { ...users[userIndex], email, whatsapp };
    localStorage.setItem('users', JSON.stringify(users));
    
    // Update current session if it matches
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.id === userId) {
        currentUser.email = email;
        currentUser.whatsapp = whatsapp;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    return { data: users[userIndex], error: null };
  },
  
  from: (table) => ({
    select: (columns = '*') => ({
      eq: (column, value) => ({
        single: async () => {
          const data = JSON.parse(localStorage.getItem(table) || '[]');
          const item = data.find(item => item[column] === value);
          return { data: item, error: item ? null : { message: 'Not found' } };
        },
        execute: async () => {
          const data = JSON.parse(localStorage.getItem(table) || '[]');
          const filtered = data.filter(item => item[column] === value);
          return { data: filtered, error: null };
        }
      }),
      execute: async () => {
        const data = JSON.parse(localStorage.getItem(table) || '[]');
        return { data, error: null };
      }
    }),
    
    insert: (values) => ({
      select: () => ({
        single: async () => {
          const data = JSON.parse(localStorage.getItem(table) || '[]');
          const newItem = {
            id: Date.now().toString(),
            ...values,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          data.push(newItem);
          localStorage.setItem(table, JSON.stringify(data));
          return { data: newItem, error: null };
        }
      })
    }),
    
    update: (values) => ({
      eq: (column, value) => ({
        select: () => ({
          single: async () => {
            const data = JSON.parse(localStorage.getItem(table) || '[]');
            const index = data.findIndex(item => item[column] === value);
            
            if (index === -1) {
              return { data: null, error: { message: 'Not found' } };
            }
            
            data[index] = {
              ...data[index],
              ...values,
              updated_at: new Date().toISOString()
            };
            
            localStorage.setItem(table, JSON.stringify(data));
            return { data: data[index], error: null };
          }
        })
      })
    }),
    
    delete: () => ({
      eq: (column, value) => ({
        execute: async () => {
          const data = JSON.parse(localStorage.getItem(table) || '[]');
          const filtered = data.filter(item => item[column] !== value);
          localStorage.setItem(table, JSON.stringify(filtered));
          return { error: null };
        }
      })
    })
  })
};