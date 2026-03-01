// TypeScript Types for Sewing Factory Demo Platform

export interface Factory {
  id: number;
  name: string;
  location: string;
  status: 'active' | 'maintenance' | 'inactive';
  employees: number;
  capacity: number;
  machines: number;
  todayProduction: number;
  profit: number;
  efficiency: number;
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
  assignedFactories: number[];
  revenue: number;
  cost: number;
}

export interface Batch {
  id: string;
  orderId: string;
  factoryId: number;
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
  id: number;
  name: string;
  factoryId: number;
  position: string;
  department: string;
  efficiency: number;
  completedUnits: number;
  salary: number;
  bonus: number;
  attendanceRate: number;
  totalPay: number;
}

export interface Transaction {
  id: number;
  type: 'revenue' | 'expense';
  category: string;
  amount: number;
  date: string;
  description: string;
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

export type ViewType = 'dashboard' | 'production' | 'hr' | 'finance' | 'analytics';