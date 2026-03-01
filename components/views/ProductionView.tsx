'use client';

import { useState } from 'react';
import {
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { orders, batches, factories } from '@/data/mockData';
import { Order, Batch } from '@/lib/types';

export default function ProductionView() {
  const [selectedTab, setSelectedTab] = useState<'orders' | 'batches' | 'factories'>('orders');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress':
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'delayed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-gray-600" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Выполнен';
      case 'in_progress': return 'В процессе';
      case 'delayed': return 'Задержан';
      case 'pending': return 'Ожидает';
      default: return status;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'delayed':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'pending':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStageBadge = (stage: string) => {
    switch (stage) {
      case 'cutting':
        return 'bg-purple-100 text-purple-700';
      case 'sewing':
        return 'bg-blue-100 text-blue-700';
      case 'quality-check':
        return 'bg-amber-100 text-amber-700';
      case 'packaging':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Управление производством</h2>
        <p className="text-gray-600 mt-1">Отслеживайте заказы, партии и производство на фабриках в реальном времени.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setSelectedTab('orders')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            selectedTab === 'orders'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Заказы ({orders.length})
        </button>
        <button
          onClick={() => setSelectedTab('batches')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            selectedTab === 'batches'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Активные партии ({batches.length})
        </button>
        <button
          onClick={() => setSelectedTab('factories')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            selectedTab === 'factories'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Производственные мощности
        </button>
      </div>

      {selectedTab === 'orders' && (
        <div className="space-y-4">
          {/* Order Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">Всего заказов</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">В процессе</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter((o) => o.status === 'in_progress').length}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Завершено</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter((o) => o.status === 'completed').length}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-sm text-gray-600">Задержано</span>
              </div>
              <p className="text-2xl font-bold text-red-600">
                {orders.filter((o) => o.status === 'delayed').length}
              </p>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">ID заказа</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Клиент</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Товар</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Прогресс</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Статус</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Срок</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Выручка</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Прибыль</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm font-medium text-blue-600">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{order.client}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{order.product}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 transition-all"
                            style={{ width: `${(order.completed / order.quantity) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {Math.round((order.completed / order.quantity) * 100)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.deadline}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {order.revenue.toLocaleString()} ₽
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-green-600">
                      +{(order.revenue - order.cost).toLocaleString()} ₽
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedTab === 'batches' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">ID партии</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Фабрика</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Этап</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Текущий шаг</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Прогресс</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Рабочие</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Брак</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Уровень брака</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {batches.map((batch) => {
                  const factory = factories.find((f) => f.id === batch.factoryId);
                  return (
                    <tr key={batch.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm font-medium text-purple-600">{batch.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{factory?.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStageBadge(batch.stage)}`}>
                          {batch.stage.charAt(0).toUpperCase() + batch.stage.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{batch.currentStep}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-purple-600 transition-all"
                              style={{ width: `${batch.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{batch.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{batch.workers}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{batch.defects}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <span className={batch.defectRate > 0.1 ? 'text-red-600 font-medium' : 'text-green-600'}>
                          {(batch.defectRate * 100).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedTab === 'factories' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {factories.map((factory) => (
              <div key={factory.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{factory.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                    factory.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {factory.status === 'active' ? 'Активна' : 'На обслуживании'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{factory.location}</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Сотрудники</span>
                    <span className="font-medium">{factory.employees} / {factory.capacity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Оборудование</span>
                    <span className="font-medium">{factory.machines}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Производство сегодня</span>
                    <span className="font-medium">{factory.todayProduction.toLocaleString()} ед.</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Эффективность</span>
                    <span className={`font-medium ${factory.efficiency >= 80 ? 'text-green-600' : 'text-amber-600'}`}>
                      {factory.efficiency}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Прибыль сегодня</span>
                    <span className="font-medium text-green-600">{factory.profit.toLocaleString()} ₽</span>
                  </div>
                </div>

                <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                  Подробнее
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}