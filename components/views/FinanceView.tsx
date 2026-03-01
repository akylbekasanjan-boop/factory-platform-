'use client';

import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Calendar,
  Wallet,
} from 'lucide-react';
import { financialData, factories } from '@/data/mockData';
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

export default function FinanceView() {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'month'>('month');

  const currentData = selectedPeriod === 'today' ? financialData.today : financialData.thisMonth;
  const profitMargin = ((currentData.profit / currentData.revenue) * 100).toFixed(1);

  const profitChartData = {
    labels: financialData.profitHistory.map((d) => d.month),
    datasets: [
      {
        label: 'Прибыль (млн ₽)',
        data: financialData.profitHistory.map((d) => d.profit / 1000000),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderRadius: 6,
      },
    ],
  };

  const profitChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => `${value.toFixed(1)}M`,
        },
      },
    },
  };

  const revenueExpenseChartData = {
    labels: financialData.profitHistory.map((d) => d.month),
    datasets: [
      {
        label: 'Выручка',
        data: [10.5, 11.2, 12.1, 12.8, 12.5, 13.8, 12.5],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 6,
      },
      {
        label: 'Расходы',
        data: [7.3, 7.7, 8.2, 8.7, 8.5, 9.3, 8.2],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderRadius: 6,
      },
    ],
  };

  const revenueExpenseChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => `${value.toFixed(1)}M`,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Обзор финансов</h2>
          <p className="text-gray-600 mt-1">Отслеживайте выручку, расходы и прибыль вашего производства.</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as 'today' | 'month')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="today">Сегодня</option>
            <option value="month">Этот месяц</option>
          </select>
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" />
              +12.5%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Выручка</h3>
          <p className="text-2xl font-bold text-gray-900">
            {currentData.revenue.toLocaleString()} ₽
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-red-600 text-sm font-medium flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" />
              +8.2%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Расходы</h3>
          <p className="text-2xl font-bold text-gray-900">
            {currentData.expenses.toLocaleString()} ₽
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" />
              +15.3%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Прибыль</h3>
          <p className="text-2xl font-bold text-green-600">
            {currentData.profit.toLocaleString()} ₽
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" />
              +25.7%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Рентабельность</h3>
          <p className="text-2xl font-bold text-gray-900">{profitMargin}%</p>
        </div>
      </div>

      {/* Cash Flow */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Поступления</h3>
              <p className="text-sm text-gray-600">Денежные средства получены</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {currentData.cashIn.toLocaleString()} ₽
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {((currentData.cashIn / currentData.revenue) * 100).toFixed(1)}% от выручки получено
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Выплаты</h3>
              <p className="text-sm text-gray-600">Денежные средства потрачены</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-red-600">
            {currentData.cashOut.toLocaleString()} ₽
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {((currentData.cashOut / currentData.expenses) * 100).toFixed(1)}% расходов оплачено
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">История прибыли</h3>
          <div className="h-80">
            <Bar data={profitChartData} options={profitChartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Выручка vs Расходы</h3>
          <div className="h-80">
            <Bar data={revenueExpenseChartData} options={revenueExpenseChartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Последние операции</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Показать все</button>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Дата</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Категория</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Описание</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Тип</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Сумма</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {financialData.transactions.map((txn) => (
              <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900">{txn.date}</td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900">{txn.category}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{txn.description}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                    txn.type === 'revenue'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {txn.type === 'revenue' ? (
                      <>Выручка</>
                    ) : (
                      <>Расход</>
                    )}
                  </span>
                </td>
                <td className={`px-6 py-4 text-right text-sm font-semibold ${
                  txn.type === 'revenue' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {txn.type === 'revenue' ? '+' : '-'}
                  {txn.amount.toLocaleString()} ₽
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Factory Financial Performance */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Финансовые показатели фабрик (этот месяц)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {factories.map((factory) => (
            <div key={factory.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{factory.name}</h4>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Прибыль сегодня</span>
                  <span className="font-medium text-green-600">{factory.profit.toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Производство сегодня</span>
                  <span className="font-medium">{factory.todayProduction.toLocaleString()} ед.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Эффективность</span>
                  <span className="font-medium">
                    <span className={factory.efficiency >= 80 ? 'text-green-600' : 'text-amber-600'}>
                      {factory.efficiency}%
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}