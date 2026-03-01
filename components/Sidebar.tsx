'use client';

import { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Users,
  DollarSign,
  BarChart3,
  Factory,
  Settings,
  LogOut,
  Menu,
  X,
  FileText,
} from 'lucide-react';
import { ViewType } from '@/lib/types';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onLogout?: () => void;
}

const menuItems: { id: ViewType; label: string; icon: any }[] = [
  { id: 'dashboard', label: '📊 Дашборд', icon: LayoutDashboard },
  { id: 'production', label: '🏭 Производство', icon: Package },
  { id: 'hr', label: '👥 Сотрудники', icon: Users },
  { id: 'finance', label: '💰 Финансы', icon: DollarSign },
  { id: 'analytics', label: '📈 Аналитика', icon: BarChart3 },
  { id: 'reports', label: '📁 Отчёты', icon: FileText },
];

export default function Sidebar({ currentView, onViewChange, onLogout }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg md:hidden"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-4 flex flex-col z-40 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Factory className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-gray-900 text-sm md:text-base truncate">Управление Фабрикой</h1>
            <p className="text-xs text-gray-500">Демо-версия</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onViewChange(item.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="font-medium truncate">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-gray-200 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all">
            <Settings className="w-5 h-5 shrink-0" />
            <span className="font-medium">Настройки</span>
          </button>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="font-medium">Выйти</span>
          </button>
        </div>
      </aside>
    </>
  );
}