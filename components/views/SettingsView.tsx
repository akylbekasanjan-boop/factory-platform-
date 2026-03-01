'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Database,
  Save,
  CheckCircle,
  Key,
  Smartphone,
  Mail,
  Building,
  Clock,
  Moon,
  Sun,
  Monitor,
  ChevronRight,
  LogOut,
  Trash2,
  Download,
  Upload
} from 'lucide-react';

interface SettingsData {
  company: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    orders: boolean;
    finance: boolean;
    hr: boolean;
    production: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    language: 'ru' | 'en';
    timezone: string;
  };
  security: {
    twoFactor: boolean;
    sessionTimeout: number;
  };
}

const STORAGE_KEY = 'app_settings';

const defaultSettings: SettingsData = {
  company: {
    name: 'Швейная Фабрика',
    email: 'info@factory.ru',
    phone: '+7 (800) 123-45-67',
    address: 'г. Москва, ул. Промышленная, 1',
  },
  notifications: {
    email: true,
    push: true,
    orders: true,
    finance: true,
    hr: true,
    production: true,
  },
  appearance: {
    theme: 'light',
    language: 'ru',
    timezone: 'Europe/Moscow',
  },
  security: {
    twoFactor: false,
    sessionTimeout: 30,
  },
};

const timezones = [
  'Europe/Moscow',
  'Europe/Kaliningrad',
  'Europe/Samara',
  'Asia/Yekaterinburg',
  'Asia/Omsk',
  'Asia/Novosibirsk',
  'Asia/Irkutsk',
  'Asia/Vladivostok',
];

export default function SettingsView() {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [activeTab, setActiveTab] = useState<'company' | 'notifications' | 'appearance' | 'security' | 'data'>('company');
  const [saved, setSaved] = useState(false);

  const applyTheme = (theme: 'light' | 'dark' | 'auto') => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setSettings(parsed);
      applyTheme(parsed.appearance?.theme || 'light');
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    applyTheme(settings.appearance.theme);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateCompany = (field: keyof SettingsData['company'], value: string) => {
    setSettings({
      ...settings,
      company: { ...settings.company, [field]: value }
    });
  };

  const updateNotification = (field: keyof SettingsData['notifications'], value: boolean) => {
    setSettings({
      ...settings,
      notifications: { ...settings.notifications, [field]: value }
    });
  };

  const updateAppearance = (field: keyof SettingsData['appearance'], value: any) => {
    setSettings({
      ...settings,
      appearance: { ...settings.appearance, [field]: value }
    });
  };

  const updateSecurity = (field: keyof SettingsData['security'], value: any) => {
    setSettings({
      ...settings,
      security: { ...settings.security, [field]: value }
    });
  };

  const exportData = () => {
    const data = {
      settings,
      factories: localStorage.getItem('factories_data'),
      employees: localStorage.getItem('employees_data'),
      orders: localStorage.getItem('orders_data'),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `factory_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAllData = () => {
    if (confirm('Вы уверены? Все данные будут удалены. Это действие нельзя отменить.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const tabs = [
    { id: 'company', label: 'Компания', icon: Building },
    { id: 'notifications', label: 'Уведомления', icon: Bell },
    { id: 'appearance', label: 'Оформление', icon: Palette },
    { id: 'security', label: 'Безопасность', icon: Shield },
    { id: 'data', label: 'Данные', icon: Database },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">⚙️ Настройки</h2>
          <p className="text-gray-600 mt-1">Управление параметрами системы</p>
        </div>
        <button
          onClick={handleSave}
          className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${
            saved 
              ? 'bg-green-500 text-white' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {saved ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Сохранено!
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Сохранить
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Tabs */}
        <div className="w-full md:w-64 bg-white rounded-xl border border-gray-200 p-2 h-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
                <ChevronRight className="w-4 h-4 ml-auto" />
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-6">
          {activeTab === 'company' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                Информация о компании
              </h3>
              
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Название компании
                  </label>
                  <input
                    type="text"
                    value={settings.company.name}
                    onChange={(e) => updateCompany('name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={settings.company.email}
                        onChange={(e) => updateCompany('email', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Телефон
                    </label>
                    <div className="relative">
                      <Smartphone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={settings.company.phone}
                        onChange={(e) => updateCompany('phone', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Адрес
                  </label>
                  <textarea
                    value={settings.company.address}
                    onChange={(e) => updateCompany('address', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                Настройки уведомлений
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Email уведомления</p>
                      <p className="text-sm text-gray-500">Получать уведомления на почту</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.email}
                      onChange={(e) => updateNotification('email', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Push уведомления</p>
                      <p className="text-sm text-gray-500">Уведомления в браузере</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.push}
                      onChange={(e) => updateNotification('push', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <hr className="border-gray-200" />

                <p className="font-medium text-gray-700">Уведомлять о:</p>

                {[
                  { key: 'orders', label: 'Новые заказы', desc: 'При создании нового заказа' },
                  { key: 'finance', label: 'Финансовые операции', desc: 'Транзакции и платежи' },
                  { key: 'hr', label: 'HR события', desc: 'Новые сотрудники, изменения' },
                  { key: 'production', label: 'Производство', desc: 'Этапы, завершение заказов' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications[item.key as keyof SettingsData['notifications']]}
                        onChange={(e) => updateNotification(item.key as keyof SettingsData['notifications'], e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Palette className="w-5 h-5 text-blue-600" />
                Оформление
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Тема оформления
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'light', label: 'Светлая', icon: Sun },
                      { value: 'dark', label: 'Тёмная', icon: Moon },
                      { value: 'auto', label: 'Авто', icon: Monitor },
                    ].map((theme) => {
                      const Icon = theme.icon;
                      return (
                        <button
                          key={theme.value}
                          onClick={() => updateAppearance('theme', theme.value)}
                          className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                            settings.appearance.theme === theme.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Icon className={`w-6 h-6 ${
                            settings.appearance.theme === theme.value ? 'text-blue-600' : 'text-gray-500'
                          }`} />
                          <span className={`text-sm font-medium ${
                            settings.appearance.theme === theme.value ? 'text-blue-600' : 'text-gray-700'
                          }`}>{theme.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Язык интерфейса
                  </label>
                  <select
                    value={settings.appearance.language}
                    onChange={(e) => updateAppearance('language', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ru">🇷🇺 Русский</option>
                    <option value="en">🇬🇧 English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Часовой пояс
                  </label>
                  <div className="relative">
                    <Clock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={settings.appearance.timezone}
                      onChange={(e) => updateAppearance('timezone', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {timezones.map((tz) => (
                        <option key={tz} value={tz}>{tz}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Безопасность
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Двухфакторная аутентификация</p>
                      <p className="text-sm text-gray-500">Дополнительная защита аккаунта</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.security.twoFactor}
                      onChange={(e) => updateSecurity('twoFactor', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Автоматический выход (минуты)
                  </label>
                  <select
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSecurity('sessionTimeout', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={15}>15 минут</option>
                    <option value={30}>30 минут</option>
                    <option value={60}>1 час</option>
                    <option value={120}>2 часа</option>
                    <option value={0}>Никогда</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                    <Key className="w-5 h-5" />
                    Изменить пароль
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                Управление данными
              </h3>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Download className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-blue-900">Экспорт данных</p>
                      <p className="text-sm text-blue-700 mb-3">
                        Скачать резервную копию всех данных
                      </p>
                      <button
                        onClick={exportData}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Скачать JSON
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Upload className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Импорт данных</p>
                      <p className="text-sm text-gray-600 mb-3">
                        Восстановить данные из резервной копии
                      </p>
                      <input type="file" accept=".json" className="hidden" id="import-file" />
                      <label
                        htmlFor="import-file"
                        className="inline-block px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium cursor-pointer"
                      >
                        Выбрать файл
                      </label>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Trash2 className="w-5 h-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-red-900">Очистить все данные</p>
                      <p className="text-sm text-red-700 mb-3">
                        Удалить все данные и настройки. Это действие нельзя отменить.
                      </p>
                      <button
                        onClick={clearAllData}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        Очистить данные
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}