'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Plus, Trash2, Calendar, Wallet, Edit2 } from 'lucide-react';
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

interface Transaction {
  id: string;
  type: 'revenue' | 'expense';
  category: string;
  amount: number;
  date: string;
  description: string;
}

const TRANSACTIONS_KEY = 'finance_transactions';

export default function FinanceView() {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'month'>('month');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState<Partial<Transaction>>({});

  useEffect(() => {
    const stored = localStorage.getItem(TRANSACTIONS_KEY);
    if (stored) {
      setTransactions(JSON.parse(stored));
    }
  }, []);

  const saveTransactions = (data: Transaction[]) => {
    setTransactions(data);
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(data));
  };

  const addTransaction = () => {
    if (!form.category || !form.amount) {
      alert('Заполните категорию и сумму');
      return;
    }
    const newTransaction: Transaction = {
      id: `TRX-${Date.now().toString().slice(-6)}`,
      type: form.type || 'expense',
      category: form.category || '',
      amount: form.amount || 0,
      date: form.date || new Date().toISOString().split('T')[0],
      description: form.description || '',
    };
    saveTransactions([...transactions, newTransaction]);
    setShowAddModal(false);
    setForm({});
  };

  const deleteTransaction = (id: string) => {
    if (confirm('Удалить эту транзакцию?')) {
      saveTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const today = new Date().toISOString().split('T')[0];
  
  const todayTransactions = transactions.filter(t => t.date === today);
  const todayRevenue = todayTransactions.filter(t => t.type === 'revenue').reduce((sum, t) => sum + t.amount, 0);
  const todayExpenses = todayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const todayProfit = todayRevenue - todayExpenses;

  const thisMonth = today.substring(0, 7);
  const monthTransactions = transactions.filter(t => t.date.startsWith(thisMonth));
  const monthRevenue = monthTransactions.filter(t => t.type === 'revenue').reduce((sum, t) => sum + t.amount, 0);
  const monthExpenses = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const monthProfit = monthRevenue - monthExpenses;

  const currentData = selectedPeriod === 'today' ? {
    revenue: todayRevenue,
    expenses: todayExpenses,
    profit: todayProfit,
  } : {
    revenue: monthRevenue,
    expenses: monthExpenses,
    profit: monthProfit,
  };

  const profitMargin = currentData.revenue > 0 ? ((currentData.profit / currentData.revenue) * 100).toFixed(1) : '0.0';

  const profitChartData = {
    labels: monthTransactions.slice(-6).map(t => t.date),
    datasets: [{
      label: 'Прибыль (₽)',
      data: monthTransactions.slice(-6).map(t => t.type === 'revenue' ? t.amount : -t.amount),
      backgroundColor: monthTransactions.slice(-6).map(t => t.type === 'revenue' ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'),
      borderRadius: 6,
    }],
  };

  const profitChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">💰 Финансы</h2>
          <p className="text-gray-600 mt-1">Управляйте транзакциями и отслеживайте прибыль</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Добавить транзакцию
        </button>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => setSelectedPeriod('today')}
          className={`px-4 py-2 rounded-lg font-medium ${selectedPeriod === 'today' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Сегодня
        </button>
        <button 
          onClick={() => setSelectedPeriod('month')}
          className={`px-4 py-2 rounded-lg font-medium ${selectedPeriod === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Этот месяц
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2"><DollarSign className="w-5 h-5 text-blue-600" /><span className="text-sm text-gray-600">Выручка</span></div>
          <p className="text-2xl font-bold text-gray-900">{currentData.revenue.toLocaleString()} ₽</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2"><Wallet className="w-5 h-5 text-red-600" /><span className="text-sm text-gray-600">Расходы</span></div>
          <p className="text-2xl font-bold text-gray-900">{currentData.expenses.toLocaleString()} ₽</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-5 h-5 text-green-600" /><span className="text-sm text-gray-600">Прибыль</span></div>
          <p className={`text-2xl font-bold ${currentData.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{currentData.profit.toLocaleString()} ₽</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-5 h-5 text-purple-600" /><span className="text-sm text-gray-600">Маржа</span></div>
          <p className="text-2xl font-bold text-gray-900">{profitMargin}%</p>
        </div>
      </div>

      {monthTransactions.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4">📊 История транзакций</h3>
          <div className="h-64">
            <Bar data={profitChartData} options={profitChartOptions} />
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Последние транзакции</h3>
        </div>
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Нет транзакций. Добавьте первую для начала работы.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {transactions.slice(-10).reverse().map((t) => (
              <div key={t.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${t.type === 'revenue' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {t.type === 'revenue' ? <DollarSign className="w-5 h-5 text-green-600" /> : <Wallet className="w-5 h-5 text-red-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{t.category}</p>
                    <p className="text-sm text-gray-500">{t.date} · {t.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className={`font-semibold ${t.type === 'revenue' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'revenue' ? '+' : '-'}{t.amount.toLocaleString()} ₽
                  </p>
                  <button 
                    onClick={() => deleteTransaction(t.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">💸 Новая транзакция</h3>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setForm({});
                }}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-900"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Тип</label>
                <select 
                  value={form.type || 'expense'}
                  onChange={(e) => setForm({ ...form, type: e.target.value as 'revenue' | 'expense' })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 bg-white"
                >
                  <option value="revenue">Доход</option>
                  <option value="expense">Расход</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                <select 
                  value={form.category || ''}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 bg-white"
                >
                  <option value="">Выберите категорию</option>
                  <option value="Продажи">Продажи</option>
                  <option value="Материалы">Материалы</option>
                  <option value="Зарплата">Зарплата</option>
                  <option value="Аренда">Аренда</option>
                  <option value="Коммунальные">Коммунальные</option>
                  <option value="Прочее">Прочее</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Сумма (₽)</label>
                <input 
                  type="number"
                  value={form.amount || ''}
                  onChange={(e) => setForm({ ...form, amount: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400"
                  placeholder="Введите сумму"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Дата</label>
                <input 
                  type="date"
                  value={form.date || ''}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <input 
                  type="text"
                  value={form.description || ''}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400"
                  placeholder="Описание (необязательно)"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setForm({});
                }}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium text-gray-900"
              >
                Отмена
              </button>
              <button 
                onClick={addTransaction}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}