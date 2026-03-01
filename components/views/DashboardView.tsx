'use client';

import { useState, useEffect } from 'react';
import { Factory, Users, DollarSign, TrendingUp, Activity, Package } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DashboardView() {
  const [factories, setFactories] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const storedFactories = localStorage.getItem('factories_data');
    if (storedFactories) setFactories(JSON.parse(storedFactories));

    const storedOrders = localStorage.getItem('orders_data');
    if (storedOrders) setOrders(JSON.parse(storedOrders));

    const storedTransactions = localStorage.getItem('finance_transactions');
    if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
  }, []);

  const activeFactories = factories.filter(f => f.status === 'active').length;
  const totalCapacity = factories.reduce((sum, f) => sum + (f.capacity || 0), 0);
  const totalMachines = factories.reduce((sum, f) => sum + (f.machines || 0), 0);

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const inProgressOrders = orders.filter(o => o.status === 'in-progress').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;

  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthTransactions = transactions.filter(t => t.date.startsWith(thisMonth));
  const monthRevenue = monthTransactions.filter(t => t.type === 'revenue').reduce((sum, t) => sum + t.amount, 0);
  const monthExpenses = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const monthProfit = monthRevenue - monthExpenses;

  const hasData = factories.length > 0 || orders.length > 0 || transactions.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">📊 Дашборд</h2>
        <p className="text-gray-600 mt-1">Обзор всех показателей в реальном времени</p>
      </div>

      {!hasData ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Нет данных</h3>
          <p className="text-gray-500">Добавьте фабрики, заказы или транзакции для отображения статистики</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Активные фабрики"
              value={`${activeFactories}/${factories.length}`}
              icon={Factory}
              iconColor="text-blue-600"
              bgColor="bg-blue-100"
            />
            <StatCard
              title="Всего заказов"
              value={orders.length.toString()}
              change={pendingOrders > 0 ? `${pendingOrders} в ожидании` : undefined}
changeType={pendingOrders > 0 ? 'neutral' : undefined}
              icon={Package}
              iconColor="text-purple-600"
              bgColor="bg-purple-100"
            />
            <StatCard
              title="Выручка (месяц)"
              value={monthRevenue > 0 ? monthRevenue.toLocaleString() + ' ₽' : '0 ₽'}
              icon={DollarSign}
              iconColor="text-green-600"
              bgColor="bg-green-100"
            />
            <StatCard
              title="Прибыль (месяц)"
              value={monthProfit > 0 ? monthProfit.toLocaleString() + ' ₽' : '0 ₽'}
              icon={TrendingUp}
              iconColor={monthProfit >= 0 ? 'text-green-600' : 'text-red-600'}
              bgColor={monthProfit >= 0 ? 'bg-green-100' : 'bg-red-100'}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Статусы заказов</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">В ожидании</span>
                  <span className="font-semibold text-gray-900">{pendingOrders}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">В работе</span>
                  <span className="font-semibold text-blue-600">{inProgressOrders}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Завершено</span>
                  <span className="font-semibold text-green-600">{completedOrders}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Производственные мощности</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Всего фабрик</span>
                  <span className="font-semibold text-gray-900">{factories.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Мощность (ед/день)</span>
                  <span className="font-semibold text-gray-900">{totalCapacity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Оборудование</span>
                  <span className="font-semibold text-gray-900">{totalMachines} шт</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}