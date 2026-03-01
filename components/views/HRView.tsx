'use client';

import { useState } from 'react';
import {
  Users,
  TrendingUp,
  DollarSign,
  Award,
  Star,
  Download,
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { employees, factories } from '@/data/mockData';
import { Employee } from '@/lib/types';

export default function HRView() {
  const [sortBy, setSortBy] = useState<string>('efficiency');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedFactory, setSelectedFactory] = useState<string>('all');

  const sortedEmployees = [...employees]
    .filter((emp) => selectedFactory === 'all' || emp.factoryId.toString() === selectedFactory)
    .sort((a, b) => {
      const aValue = a[sortBy as keyof Employee] as any;
      const bValue = b[sortBy as keyof Employee] as any;
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const totalPayroll = employees.reduce((sum, emp) => sum + emp.totalPay, 0);
  const avgEfficiency = employees.reduce((sum, emp) => sum + emp.efficiency, 0) / employees.length;
  const topPerformers = employees.filter((emp) => emp.efficiency >= 90);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Управление персоналом</h2>
        <p className="text-gray-600 mt-1">Отслеживайте производительность сотрудников, рассчитывайте зарплату и управляйте персоналом.</p>
      </div>

      {/* HR Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Всего сотрудников</h3>
          <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Средняя эффективность</h3>
          <p className="text-2xl font-bold text-gray-900">{avgEfficiency.toFixed(1)}%</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Фонд зарплаты</h3>
          <p className="text-2xl font-bold text-gray-900">{(totalPayroll / 1000).toFixed(0)}K ₽</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Лучшие сотрудники</h3>
          <p className="text-2xl font-bold text-gray-900">{topPerformers.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск сотрудников..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={selectedFactory}
            onChange={(e) => setSelectedFactory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Все фабрики</option>
            {factories.map((factory) => (
              <option key={factory.id} value={factory.id}>
                {factory.name}
              </option>
            ))}
          </select>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Download className="w-4 h-4" />
          Экспорт отчёта
        </button>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500" />
          Лучшие сотрудники
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topPerformers.map((employee) => {
            const factory = factories.find((f) => f.id === employee.factoryId);
            return (
              <div key={employee.id} className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                    {employee.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{employee.name}</h4>
                    <p className="text-sm text-gray-600">{employee.position}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Фабрика</span>
                    <span className="font-medium">{factory?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Эффективность</span>
                    <span className="font-medium text-green-600">{employee.efficiency}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Итого к выплате</span>
                    <span className="font-medium">{employee.totalPay.toLocaleString()} ₽</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Все сотрудники</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Сотрудник</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('position')}>
                Должность
                {sortBy === 'position' && (sortOrder === 'asc' ? <ChevronUp className="inline w-4 h-4" /> : <ChevronDown className="inline w-4 h-4" />)}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('factoryId')}>
                Фабрика
                {sortBy === 'factoryId' && (sortOrder === 'asc' ? <ChevronUp className="inline w-4 h-4" /> : <ChevronDown className="inline w-4 h-4" />)}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('efficiency')}>
                Эффективность
                {sortBy === 'efficiency' && (sortOrder === 'asc' ? <ChevronUp className="inline w-4 h-4" /> : <ChevronDown className="inline w-4 h-4" />)}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Выполнено единиц</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('salary')}>
                Базовая зарплата
                {sortBy === 'salary' && (sortOrder === 'asc' ? <ChevronUp className="inline w-4 h-4" /> : <ChevronDown className="inline w-4 h-4" />)}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Премия</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('totalPay')}>
                Итого к выплате
                {sortBy === 'totalPay' && (sortOrder === 'asc' ? <ChevronUp className="inline w-4 h-4" /> : <ChevronDown className="inline w-4 h-4" />)}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedEmployees.map((employee) => {
              const factory = factories.find((f) => f.id === employee.factoryId);
              return (
                <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{employee.name}</p>
                      <p className="text-sm text-gray-600">{employee.department}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{employee.position}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{factory?.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${employee.efficiency >= 90 ? 'bg-green-500' : employee.efficiency >= 80 ? 'bg-blue-500' : 'bg-amber-500'}`}
                          style={{ width: `${employee.efficiency}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{employee.efficiency}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{employee.completedUnits.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{employee.salary.toLocaleString()} ₽</td>
                  <td className="px-6 py-4 text-sm text-green-600">+{employee.bonus.toLocaleString()} ₽</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{employee.totalPay.toLocaleString()} ₽</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}