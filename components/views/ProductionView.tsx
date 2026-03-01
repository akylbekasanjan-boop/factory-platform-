'use client';

import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, AlertCircle, TrendingUp, Plus, Edit2, Trash2, X, Calendar, User, DollarSign } from 'lucide-react';
import { Order } from '@/lib/types';

const ORDERS_KEY = 'orders_data';

export default function ProductionView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [orderForm, setOrderForm] = useState<Partial<Order>>({});
  const [factories, setFactories] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    const storedOrders = localStorage.getItem(ORDERS_KEY);
    if (storedOrders) setOrders(JSON.parse(storedOrders));

    const storedFactories = localStorage.getItem('factories_data');
    if (storedFactories) {
      const parsed = JSON.parse(storedFactories);
      setFactories(parsed.map((f: any) => ({ id: f.id, name: f.name })));
    } else {
      setFactories([
        { id: '1', name: 'Фабрика Альфа' },
        { id: '2', name: 'Фабрика Бета' },
        { id: '3', name: 'Фабрика Гамма' },
      ]);
    }
  }, []);

  const saveOrders = (data: Order[]) => {
    setOrders(data);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(data));
  };

  const openAddOrder = () => {
    setEditingOrder(null);
    setOrderForm({ status: 'pending', priority: 'medium', quantity: 100, completed: 0, revenue: 0, cost: 0 });
    setShowOrderModal(true);
  };

  const openEditOrder = (order: Order) => {
    setEditingOrder(order);
    setOrderForm({ ...order });
    setShowOrderModal(true);
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setEditingOrder(null);
    setOrderForm({});
  };

  const handleSaveOrder = () => {
    if (!orderForm.client || !orderForm.product || !orderForm.quantity) {
      alert('Заполните обязательные поля: Клиент, Товар, Количество');
      return;
    }
    if (editingOrder) {
      const updated = orders.map(o => o.id === editingOrder.id ? { ...o, ...orderForm } as Order : o);
      saveOrders(updated);
    } else {
      const newOrder: Order = {
        id: `ORD-${Date.now().toString().slice(-6)}`,
        client: orderForm.client || '',
        product: orderForm.product || '',
        quantity: orderForm.quantity || 0,
        completed: 0,
        status: orderForm.status || 'pending',
        deadline: orderForm.deadline || new Date().toISOString().split('T')[0],
        priority: orderForm.priority || 'medium',
        assignedFactories: orderForm.assignedFactories || [],
        revenue: orderForm.revenue || 0,
        cost: orderForm.cost || 0,
        createdAt: new Date().toISOString(),
      };
      saveOrders([...orders, newOrder]);
    }
    closeOrderModal();
  };

  const deleteOrder = (id: string) => {
    if (confirm('Удалить этот заказ?')) saveOrders(orders.filter(o => o.id !== id));
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    saveOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'delayed': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    inProgress: orders.filter(o => o.status === 'in-progress').length,
    completed: orders.filter(o => o.status === 'completed').length,
    delayed: orders.filter(o => o.status === 'delayed').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🏭 Управление производством</h2>
          <p className="text-gray-600 mt-1">Создавайте заказы и отслеживайте производство</p>
        </div>
        <button onClick={openAddOrder} className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
          <Plus className="w-5 h-5" /> Добавить заказ
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2"><Package className="w-5 h-5 text-blue-600" /><span className="text-sm text-gray-600">Всего</span></div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2"><Clock className="w-5 h-5 text-gray-600" /><span className="text-sm text-gray-600">Ожидает</span></div>
          <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-5 h-5 text-blue-600" /><span className="text-sm text-gray-600">В работе</span></div>
          <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2"><CheckCircle className="w-5 h-5 text-green-600" /><span className="text-sm text-gray-600">Завершено</span></div>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2"><AlertCircle className="w-5 h-5 text-red-600" /><span className="text-sm text-gray-600">Задержано</span></div>
          <p className="text-2xl font-bold text-red-600">{stats.delayed}</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Нет заказов</h3>
          <p className="text-gray-500 mb-4">Создайте первый заказ</p>
          <button onClick={openAddOrder} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Добавить заказ</button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Заказ</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Клиент</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Товар</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Прогресс</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Статус</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Срок</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Сумма</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${getPriorityColor(order.priority)}`} /><span className="font-mono text-sm font-medium text-blue-600">{order.id}</span></div></td>
                    <td className="px-4 py-3 text-sm text-gray-900">{order.client}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{order.product}</td>
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-20 h-2 bg-gray-200 rounded-full"><div className="h-full bg-blue-600" style={{ width: `${(order.completed / order.quantity) * 100}%` }} /></div><span className="text-xs text-gray-600">{order.completed}/{order.quantity}</span></div></td>
                    <td className="px-4 py-3"><select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])} className={`text-xs px-2 py-1 rounded-full border ${getStatusBadge(order.status)} bg-white`}><option value="pending">Ожидает</option><option value="in-progress">В процессе</option><option value="completed">Выполнен</option><option value="delayed">Задержан</option></select></td>
                    <td className="px-4 py-3 text-sm text-gray-600">{order.deadline}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.revenue?.toLocaleString() || 0} ₽</td>
                    <td className="px-4 py-3"><div className="flex items-center gap-1"><button onClick={() => openEditOrder(order)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded"><Edit2 className="w-4 h-4" /></button><button onClick={() => deleteOrder(order.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded"><Trash2 className="w-4 h-4" /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showOrderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">{editingOrder ? '✏️ Редактировать заказ' : '📦 Новый заказ'}</h3>
              <button onClick={closeOrderModal} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">ID заказа</label><input type="text" value={editingOrder?.id || 'Авто'} disabled className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Приоритет</label><select value={orderForm.priority || 'medium'} onChange={(e) => setOrderForm({ ...orderForm, priority: e.target.value as Order['priority'] })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 bg-white"><option value="low">Низкий</option><option value="medium">Средний</option><option value="high">Высокий</option></select></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Клиент *</label><div className="relative"><User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" /><input type="text" value={orderForm.client || ''} onChange={(e) => setOrderForm({ ...orderForm, client: e.target.value })} placeholder="Название компании" className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400" /></div></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Товар *</label><input type="text" value={orderForm.product || ''} onChange={(e) => setOrderForm({ ...orderForm, product: e.target.value })} placeholder="Например: Футболки" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Количество *</label><input type="number" value={orderForm.quantity || ''} onChange={(e) => setOrderForm({ ...orderForm, quantity: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Выполнено</label><input type="number" value={orderForm.completed || 0} onChange={(e) => setOrderForm({ ...orderForm, completed: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Срок</label><div className="relative"><Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" /><input type="date" value={orderForm.deadline || ''} onChange={(e) => setOrderForm({ ...orderForm, deadline: e.target.value })} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-gray-900" /></div></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Статус</label><select value={orderForm.status || 'pending'} onChange={(e) => setOrderForm({ ...orderForm, status: e.target.value as Order['status'] })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 bg-white"><option value="pending">Ожидает</option><option value="in-progress">В процессе</option><option value="completed">Выполнен</option><option value="delayed">Задержан</option></select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Выручка (₽)</label><div className="relative"><DollarSign className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" /><input type="number" value={orderForm.revenue || ''} onChange={(e) => setOrderForm({ ...orderForm, revenue: parseInt(e.target.value) || 0 })} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-gray-900" /></div></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Себестоимость (₽)</label><input type="number" value={orderForm.cost || ''} onChange={(e) => setOrderForm({ ...orderForm, cost: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Назначить фабрику</label><select value={orderForm.assignedFactories?.[0] || ''} onChange={(e) => setOrderForm({ ...orderForm, assignedFactories: e.target.value ? [e.target.value] : [] })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 bg-white"><option value="">Выберите фабрику</option>{factories.map(f => (<option key={f.id} value={f.id}>{f.name}</option>))}</select></div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
<button onClick={closeOrderModal} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium text-gray-900">Отмена</button>
              <button onClick={handleSaveOrder} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}