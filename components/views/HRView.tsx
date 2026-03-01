'use client';

import { useState, useEffect } from 'react';
import { Users, TrendingUp, DollarSign, Award, Star, Plus, Search, Filter, Edit2, Trash2, X } from 'lucide-react';
import { Employee } from '@/lib/types';

const EMPLOYEES_KEY = 'employees_data';

export default function HRView() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [factories, setFactories] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<string>('efficiency');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedFactory, setSelectedFactory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [form, setForm] = useState<Partial<Employee>>({});

  useEffect(() => {
    const storedEmployees = localStorage.getItem(EMPLOYEES_KEY);
    if (storedEmployees) setEmployees(JSON.parse(storedEmployees));

    const storedFactories = localStorage.getItem('factories_data');
    if (storedFactories) setFactories(JSON.parse(storedFactories));
  }, []);

  const saveEmployees = (data: Employee[]) => {
    setEmployees(data);
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(data));
  };

  const openAddModal = () => {
    setEditingEmployee(null);
    setForm({ efficiency: 0, completedUnits: 0, salary: 50000, bonus: 0, attendanceRate: 100, totalPay: 50000 });
    setShowModal(true);
  };

  const openEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setForm({ ...emp });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.position) {
      alert('Заполните имя и должность');
      return;
    }
    if (editingEmployee) {
      const updated = employees.map(e => e.id === editingEmployee.id ? { ...e, ...form } as Employee : e);
      saveEmployees(updated);
    } else {
      const newEmployee: Employee = {
        id: `EMP-${Date.now().toString().slice(-6)}`,
        name: form.name || '',
        factoryId: form.factoryId || '',
        position: form.position || '',
        department: form.department || 'Производство',
        efficiency: form.efficiency || 0,
        completedUnits: form.completedUnits || 0,
        salary: form.salary || 50000,
        bonus: form.bonus || 0,
        attendanceRate: form.attendanceRate || 100,
        totalPay: (form.salary || 50000) + (form.bonus || 0),
        createdAt: new Date().toISOString(),
      };
      saveEmployees([...employees, newEmployee]);
    }
    setShowModal(false);
    setForm({});
  };

  const deleteEmployee = (id: string) => {
    if (confirm('Удалить сотрудника?')) {
      saveEmployees(employees.filter(e => e.id !== id));
    }
  };

  const filteredEmployees = employees
    .filter(emp => selectedFactory === 'all' || emp.factoryId === selectedFactory)
    .filter(emp => !searchTerm || emp.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const aValue = a[sortBy as keyof Employee] as any;
      const bValue = b[sortBy as keyof Employee] as any;
      return sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });

  const totalPayroll = employees.reduce((sum, e) => sum + (e.totalPay || 0), 0);
  const avgEfficiency = employees.length > 0 ? employees.reduce((sum, e) => sum + (e.efficiency || 0), 0) / employees.length : 0;
  const topPerformers = employees.filter(e => (e.efficiency || 0) >= 90);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">👥 Управление персоналом</h2>
          <p className="text-gray-600 mt-1">Добавьте сотрудников и отслеживайте их эффективность</p>
        </div>
        <button onClick={openAddModal} className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 font-medium flex items-center gap-2">
          <Plus className="w-5 h-5" /> Добавить сотрудника
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2"><Users className="w-5 h-5 text-blue-600" /><span className="text-sm text-gray-600">Всего</span></div>
          <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-5 h-5 text-green-600" /><span className="text-sm text-gray-600">Эффективность</span></div>
          <p className="text-2xl font-bold text-gray-900">{avgEfficiency.toFixed(1)}%</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2"><DollarSign className="w-5 h-5 text-purple-600" /><span className="text-sm text-gray-600">Фонд зарплаты</span></div>
          <p className="text-2xl font-bold text-gray-900">{(totalPayroll / 1000).toFixed(0)}K ₽</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2"><Award className="w-5 h-5 text-amber-600" /><span className="text-sm text-gray-600">Топ</span></div>
          <p className="text-2xl font-bold text-gray-900">{topPerformers.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={selectedFactory}
            onChange={(e) => setSelectedFactory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
          >
            <option value="all">Все фабрики</option>
            {factories.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>
      </div>

      {employees.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Нет сотрудников</h3>
          <p className="text-gray-500 mb-4">Добавьте первого сотрудника</p>
          <button onClick={openAddModal} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Добавить сотрудника</button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Сотрудник</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Фабрика</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Должность</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Эффективность</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Зарплата</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.map(emp => {
                const factory = factories.find(f => f.id === emp.factoryId);
                return (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                          {emp.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                        </div>
                        <span className="font-medium text-gray-900">{emp.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-900">{factory?.name || '—'}</td>
                    <td className="px-4 py-3 text-gray-900">{emp.position}</td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${(emp.efficiency || 0) >= 90 ? 'text-green-600' : (emp.efficiency || 0) >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {emp.efficiency || 0}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-900">{(emp.totalPay || 0).toLocaleString()} ₽</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openEditModal(emp)} className="p-1.5 text-gray-400 hover:text-blue-600"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => deleteEmployee(emp.id)} className="p-1.5 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">{editingEmployee ? 'Редактировать' : 'Новый сотрудник'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-900 text-2xl">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ФИО *</label>
                <input type="text" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900" placeholder="Иванов Иван" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Должность *</label>
                <input type="text" value={form.position || ''} onChange={(e) => setForm({ ...form, position: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900" placeholder="Швея" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Фабрика</label>
                <select value={form.factoryId || ''} onChange={(e) => setForm({ ...form, factoryId: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 bg-white">
                  <option value="">Не назначена</option>
                  {factories.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Зарплата (₽)</label>
                  <input type="number" value={form.salary || ''} onChange={(e) => setForm({ ...form, salary: parseInt(e.target.value) || 0, totalPay: (parseInt(e.target.value) || 0) + (form.bonus || 0) })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Бонус (₽)</label>
                  <input type="number" value={form.bonus || ''} onChange={(e) => setForm({ ...form, bonus: parseInt(e.target.value) || 0, totalPay: (form.salary || 0) + (parseInt(e.target.value) || 0) })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Эффективность (%)</label>
                <input type="number" value={form.efficiency || ''} onChange={(e) => setForm({ ...form, efficiency: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900" />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-900 hover:bg-gray-50">Отмена</button>
              <button onClick={handleSave} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}