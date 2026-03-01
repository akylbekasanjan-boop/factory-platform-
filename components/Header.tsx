'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Search, User, Menu, ChevronDown, LogOut, Settings, Users } from 'lucide-react';

interface HeaderProps {
  onLogout?: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  const router = useRouter();
  const [username, setUsername] = useState('Пользователь');
  const [userPhone, setUserPhone] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedPhone = localStorage.getItem('userPhone');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedPhone) {
      setUserPhone(storedPhone);
    }
  }, []);

  const handleProfileClick = () => {
    setShowProfile(!showProfile);
    setShowNotifications(false);
  };

  const handleNotificationsClick = () => {
    setShowNotifications(!showNotifications);
    setShowProfile(false);
  };

  const handleGoToAdmin = () => {
    router.push('/admin');
    setShowProfile(false);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const notifications = [
    { id: 1, text: 'Добро пожаловать! Начните работу с раздела Производство', time: 'Сейчас', read: false },
    { id: 2, text: 'Вы можете добавить новые заказы', time: '5 мин назад', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between z-30">
      {/* Search - hidden on small mobile */}
      <div className="hidden sm:flex flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск заказов, сотрудников, фабрик..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Mobile search icon */}
      <div className="sm:hidden">
        <Search className="w-5 h-5 text-gray-600" />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={handleNotificationsClick}
            className="relative p-2 hover:bg-gray-100 rounded-full transition-all"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Уведомления</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 ${!notif.read ? 'bg-blue-50' : ''}`}
                  >
                    <p className="text-sm text-gray-900">{notif.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 bg-gray-50">
                <button className="text-sm text-blue-600 font-medium">Показать все</button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={handleProfileClick}
            className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-gray-200 hover:bg-gray-50 rounded-lg py-1 transition-colors"
          >
            <div className="text-right hidden sm:block">
              <p className="font-medium text-gray-900 text-sm">{username}</p>
              <p className="text-xs text-gray-500">{userPhone || 'Администратор'}</p>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
              <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
          </button>

          {/* Profile Dropdown */}
          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-semibold text-gray-900">{username}</p>
                <p className="text-sm text-gray-500">{userPhone || 'admin'}</p>
              </div>
              <div className="py-2">
                <button 
                  onClick={handleGoToAdmin}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                >
                  <Users className="w-4 h-4" />
                  Админка
                </button>
                <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                  <Settings className="w-4 h-4" />
                  Настройки
                </button>
                <hr className="my-2" />
                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-3"
                >
                  <LogOut className="w-4 h-4" />
                  Выйти
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}