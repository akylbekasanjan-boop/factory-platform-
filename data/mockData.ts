// Mock Data for Sewing Factory Demo Platform - ALL DATA STARTS AT ZERO

export const factories = [
  {
    id: 1,
    name: 'Фабрика Альфа',
    location: 'Москва',
    status: 'active',
    employees: 0,
    capacity: 200,
    machines: 45,
    todayProduction: 0,
    profit: 0,
    efficiency: 0,
  },
  {
    id: 2,
    name: 'Фабрика Бета',
    location: 'Санкт-Петербург',
    status: 'active',
    employees: 0,
    capacity: 250,
    machines: 62,
    todayProduction: 0,
    profit: 0,
    efficiency: 0,
  },
  {
    id: 3,
    name: 'Фабрика Гамма',
    location: 'Новосибирск',
    status: 'active',
    employees: 0,
    capacity: 150,
    machines: 32,
    todayProduction: 0,
    profit: 0,
    efficiency: 0,
  },
  {
    id: 4,
    name: 'Фабрика Дельта',
    location: 'Казань',
    status: 'active',
    employees: 0,
    capacity: 180,
    machines: 38,
    todayProduction: 0,
    profit: 0,
    efficiency: 0,
  },
  {
    id: 5,
    name: 'Фабрика Эпсилон',
    location: 'Екатеринбург',
    status: 'active',
    employees: 0,
    capacity: 120,
    machines: 28,
    todayProduction: 0,
    profit: 0,
    efficiency: 0,
  },
];

export const orders: any[] = [];

export const batches: any[] = [];

export const employees: any[] = [];

export const financialData: {
  today: {
    revenue: number;
    expenses: number;
    profit: number;
    cashIn: number;
    cashOut: number;
  };
  thisMonth: {
    revenue: number;
    expenses: number;
    profit: number;
    cashIn: number;
    cashOut: number;
    projectedProfit: number;
  };
  transactions: any[];
  profitHistory: Array<{ month: string; profit: number }>;
} = {
  today: {
    revenue: 0,
    expenses: 0,
    profit: 0,
    cashIn: 0,
    cashOut: 0,
  },
  thisMonth: {
    revenue: 0,
    expenses: 0,
    profit: 0,
    cashIn: 0,
    cashOut: 0,
    projectedProfit: 0,
  },
  transactions: [],
  profitHistory: [],
};

export const analytics: {
  productionTrend: Array<{ day: string; units: number; defects: number }>;
  efficiencyByFactory: Array<{ name: string; efficiency: number; trend: string }>;
  topPerformers: Array<{ name: string; factory: string; score: number }>;
  alerts: Array<{ type: 'warning' | 'danger' | 'info' | 'success'; message: string; time: string }>;
} = {
  productionTrend: [],
  efficiencyByFactory: [],
  topPerformers: [],
  alerts: [
    { type: 'info', message: 'Добро пожаловать! Начните работу с раздела Производство', time: 'Сейчас' },
  ],
};

export const keyMetrics = {
  totalFactories: 5,
  totalEmployees: 0,
  totalCapacity: 900,
  activeOrders: 0,
  monthlyRevenue: 0,
  monthlyProfit: 0,
  avgEfficiency: 0,
  defectRate: 0,
};

// User management for phone registration
export interface User {
  id: string;
  phone: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export const getUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const saveUser = (user: User) => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
};

export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};