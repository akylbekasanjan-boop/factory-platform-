'use client';

import { useState, useEffect } from 'react';
import { 
  Factory, 
  Plus, 
  Edit2, 
  Trash2, 
  MapPin, 
  Users, 
  Settings,
  Phone,
  Mail,
  User,
  X,
  Save,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Package
} from 'lucide-react';
import { Factory as FactoryType } from '@/lib/types';

const STORAGE_KEY = 'factories_data';

const defaultFactories: FactoryType[] = [
  {
    id: '1',
    name: 'Фабрика Альфа',
    location: 'Москва',
    status: 'active',
    employees: 0,
    capacity: 200,
    machines: 45,
    todayProduction: 0,
    profit: 0,
    efficiency: 0,
    phone: '+7 (495) 123-45-67',
    email: 'alpha@factory.ru',
    manager: 'Иванов И.И.',
    address: 'г. Москва, ул. Промышленная, 15',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Фабрика Бета',
    location: 'Санкт-Петербург',
    status: 'active',
    employees: 0,
    capacity: 250,
    machines: 62,
    todayProduction: 0,
    profit: 0,
    efficiency: 0,
    phone: '+7 (812) 234-56-78',
    email: 'beta@factory.ru',
    manager: 'Петров П.П.',
    address: 'г. Санкт-Петербург, ул. Заводская, 8',
    createdAt: new Date().toISOString(),
  },
];

export default function FactoriesView() {
  const [factories, setFactories] = useState<FactoryType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFactory, setEditingFactory] = useState<FactoryType | null>(null);
  const [formData, setFormData] = useState<Partial<FactoryType>>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setFactories(JSON.parse(stored));
    }
    // По умолчанию - пустой массив, фабрики добавляются вручную
  }, []);

  const saveFactories = (data: FactoryType[]) => {
    setFactories(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const openAddModal = () => {
    setEditingFactory(null);
    setFormData({
      status: 'active',
      employees: 0,
      capacity: 100,
      machines: 20,
      todayProduction: 0,
      profit: 0,
      efficiency: 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (factory: FactoryType) => {
    setEditingFactory(factory);
    setFormData({ ...factory });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFactory(null);
    setFormData({});
  };

  const handleSave = () => {
    if (!formData.name || !formData.location) {
      alert('Заполните обязательные поля: Название и Город');
      return;
    }

    if (editingFactory) {
      const updated = factories.map(f => 
        f.id === editingFactory.id ? { ...f, ...formData } as FactoryType : f
      );
      saveFactories(updated);
    } else {
      const newFactory: FactoryType = {
        id: Date.now().toString(),
        name: formData.name || '',
        location: formData.location || '',
        status: formData.status || 'active',
        employees: formData.employees || 0,
        capacity: formData.capacity || 100,
        machines: formData.machines || 20,
        todayProduction: 0,
        profit: 0,
        efficiency: 0,
        phone: formData.phone || '',
        email: formData.email || '',
        manager: formData.manager || '',
        address: formData.address || '',
        createdAt: new Date().toISOString(),
      };
      saveFactories([...factories, newFactory]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту фабрику?')) {
      saveFactories(factories.filter(f => f.id !== id));
    }
  };

  const toggleStatus = (factory: FactoryType) => {
    const newStatus: FactoryType['status'] = factory.status === 'active' ? 'maintenance' : 
                      factory.status === 'maintenance' ? 'inactive' : 'active';
    const updated = factories.map(f => 
      f.id === factory.id ? { ...f, status: newStatus } : f
    );
    saveFactories(updated);
  };

  const filteredFactories = factories.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'maintenance': return 'bg-yellow-100 text-yellow-700';
      case 'inactive': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Активна';
      case 'maintenance': return 'На обслуживании';
      case 'inactive': return 'Неактивна';
      default: return status;
    }
  };

  const totalCapacity = factories.reduce((sum, f) => sum + f.capacity, 0);
  const totalMachines = factories.reduce((sum, f) => sum + f.machines, 0);
  const totalEmployees = factories.reduce((sum, f) => sum + f.employees, 0);
  const activeCount = factories.filter(f => f.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🏭 Управление фабриками</h2>
          <p className="text-gray-600 mt-1">Добавляйте и управляйте вашими производствами</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-5 h-5" />
          Добавить фабрику
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Factory className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Всего фабрик</p>
              <p className="text-2xl font-bold text-gray-900">{factories.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Активных</p>
              <p className="text-2xl font-bold text-green-600">{activeCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Мощность</p>
              <p className="text-2xl font-bold text-gray-900">{totalCapacity}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Сотрудников</p>
              <p className="text-2xl font-bold text-gray-900">{totalEmployees}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <input
          type="text"
          placeholder="🔍 Поиск по названию или городу..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
        />
      </div>

      {/* Factories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFactories.map((factory) => (
          <div key={factory.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Factory className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{factory.name}</h3>
                    <div className="flex items-center gap-1 text-blue-100 text-sm">
                      <MapPin className="w-4 h-4" />
                      {factory.location}
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(factory.status)}`}>
                  {getStatusLabel(factory.status)}
                </span>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-gray-500">Мощность</p>
                  <p className="font-semibold">{factory.capacity} ед/день</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-gray-500">Машины</p>
                  <p className="font-semibold">{factory.machines} шт</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-gray-500">Сотрудники</p>
                  <p className="font-semibold">{factory.employees} чел</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-gray-500">Эффективность</p>
                  <p className="font-semibold">{factory.efficiency}%</p>
                </div>
              </div>

              {factory.manager && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{factory.manager}</span>
                </div>
              )}

              {factory.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{factory.phone}</span>
                </div>
              )}

              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => openEditModal(factory)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Изменить
                </button>
                <button
                  onClick={() => toggleStatus(factory)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                >
                  <Settings className="w-4 h-4" />
                  Статус
                </button>
                <button
                  onClick={() => handleDelete(factory.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFactories.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Factory className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Фабрики не найдены</h3>
          <p className="text-gray-500 mb-4">Добавьте первую фабрику для начала работы</p>
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Добавить фабрику
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {editingFactory ? '✏️ Редактировать фабрику' : '🏭 Новая фабрика'}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Название *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Например: Фабрика Альфа"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Город *
                </label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Например: Москва"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Адрес
                </label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Полный адрес"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Мощность (ед/день)
                  </label>
                  <input
                    type="number"
                    value={formData.capacity || ''}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Кол-во машин
                  </label>
                  <input
                    type="number"
                    value={formData.machines || ''}
                    onChange={(e) => setFormData({ ...formData, machines: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Управляющий
                </label>
                <input
                  type="text"
                  value={formData.manager || ''}
                  onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                  placeholder="ФИО управляющего"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+7 (___) ___-__-__"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="factory@example.com"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Статус
                </label>
                <select
                  value={formData.status || 'active'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as FactoryType['status'] })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Активна</option>
                  <option value="maintenance">На обслуживании</option>
                  <option value="inactive">Неактивна</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}