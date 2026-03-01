// TypeScript Types for Sewing Factory Demo Platform

export interface Factory {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'maintenance' | 'inactive';
  employees: number;
  capacity: number;
  machines: number;
  todayProduction: number;
  profit: number;
  efficiency: number;
  phone?: string;
  email?: string;
  manager?: string;
  address?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  client: string;
  product: string;
  quantity: number;
  completed: number;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed';
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  assignedFactories: string[];
  revenue: number;
  cost: number;
  createdAt: string;
}

export interface Batch {
  id: string;
  orderId: string;
  factoryId: string;
  stage: 'cutting' | 'sewing' | 'quality-check' | 'packaging';
  progress: number;
  startedAt: string;
  currentStep: string;
  workers: number;
  machines: number;
  defects: number;
  defectRate: number;
}

export interface Employee {
  id: string;
  name: string;
  factoryId: string;
  position: string;
  department: string;
  efficiency: number;
  completedUnits: number;
  salary: number;
  bonus: number;
  attendanceRate: number;
  totalPay: number;
  phone?: string;
  email?: string;
  hireDate?: string;
  createdAt?: string;
}

export interface Transaction {
  id: string;
  type: 'revenue' | 'expense';
  category: string;
  amount: number;
  date: string;
  description: string;
  factoryId?: string;
}

export interface FinancialData {
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
  transactions: Transaction[];
  profitHistory: Array<{ month: string; profit: number }>;
}

export interface Analytics {
  productionTrend: Array<{ day: string; units: number; defects: number }>;
  efficiencyByFactory: Array<{ name: string; efficiency: number; trend: string }>;
  topPerformers: Array<{ name: string; factory: string; score: number }>;
  alerts: Array<{ type: 'warning' | 'danger' | 'info' | 'success'; message: string; time: string }>;
}

export interface KeyMetrics {
  totalFactories: number;
  totalEmployees: number;
  totalCapacity: number;
  activeOrders: number;
  monthlyRevenue: number;
  monthlyProfit: number;
  avgEfficiency: number;
  defectRate: number;
}

// Report types for accountant
export interface Report {
  id: string;
  name: string;
  type: 'financial' | 'production' | 'hr' | 'sales' | 'tax' | 'inventory';
  category: string;
  size: number;
  date: string;
  uploadedBy: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Training/Learning types
export interface TrainingCourse {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  completed: boolean;
  progress: number;
  category: 'basics' | 'production' | 'finance' | 'hr' | 'advanced';
  videoUrl?: string;
}

export interface TrainingVideo {
  id: string;
  title: string;
  description: string;
  duration: string;
  courseId: string;
  order: number;
  watched: boolean;
}

// Settings types
export interface UserSettings {
  companyName: string;
  language: 'ru' | 'en';
  timezone: string;
  currency: string;
  notifications: {
    email: boolean;
    push: boolean;
    orders: boolean;
    finance: boolean;
    hr: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
}

export interface User {
  id: string;
  phone: string;
  name: string;
  role: 'admin' | 'accountant' | 'manager' | 'employee';
  email?: string;
  createdAt: string;
  factoryId?: string;
}

export type ViewType = 'dashboard' | 'production' | 'hr' | 'finance' | 'analytics' | 'reports' | 'factories' | 'training' | 'settings';