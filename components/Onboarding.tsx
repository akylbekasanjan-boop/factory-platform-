'use client';

import { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Play, 
  SkipForward,
  Factory,
  Package,
  Users,
  DollarSign,
  FileText,
  ArrowRight,
  Check
} from 'lucide-react';

interface OnboardingStep {
  title: string;
  description: string;
  target?: string;
  position: 'center' | 'top' | 'bottom' | 'left' | 'right';
}

const steps: OnboardingStep[] = [
  {
    title: '👋 Добро пожаловать!',
    description: 'Это платформа для управления швейной фабрикой. Мы покажем как здесь всё работает.',
    position: 'center'
  },
  {
    title: '🏭 Производство',
    description: 'Здесь вы видите все заказы, их статус и можете добавлять новые заказы. Нажмите "+ Добавить заказ" чтобы создать новый.',
    target: 'production-tab',
    position: 'top'
  },
  {
    title: '📊 Дашборд',
    description: 'Общая статистика: выручка, прибыль, сколько фабрик работает, сколько сотрудников.',
    target: 'dashboard-tab',
    position: 'top'
  },
  {
    title: '👥 Сотрудники',
    description: 'Список всех работников, их зарплаты, эффективность работы.',
    target: 'hr-tab',
    position: 'top'
  },
  {
    title: '💰 Финансы',
    description: 'Выручка, расходы, прибыль, рентабельность. Здесь бухгалтер видит все деньги.',
    target: 'finance-tab',
    position: 'top'
  },
  {
    title: '📁 Отчёты',
    description: 'Загрузка и хранение отчётов. Бухгалтер загружает файлы сюда.',
    target: 'reports-tab',
    position: 'top'
  },
  {
    title: '➕ Добавление заказа',
    description: 'Чтобы добавить заказ: 1) Нажмите "+ Добавить заказ" 2) Заполните название товара, количество, клиента 3) Нажмите "Сохранить"',
    target: 'add-order-btn',
    position: 'bottom'
  },
  {
    title: '💵 Финансы работают!',
    description: 'В разделе "Финансы"能看到те реальные цифры. Данные обновляются автоматически при работе с заказами.',
    target: 'finance-tab',
    position: 'top'
  },
  {
    title: '✅ Готово!',
    description: 'Теперь вы знаете как пользоваться платформой. Начните с раздела "Производство" - добавляйте заказы и следите за работой фабрик!',
    position: 'center'
  }
];

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if onboarding was already completed
    const completed = localStorage.getItem('onboardingCompleted');
    if (completed === 'true') {
      onComplete();
      return;
    }
    // Show welcome after a short delay
    setTimeout(() => {
      setShowWelcome(true);
    }, 500);
  }, [onComplete]);

  const handleStart = () => {
    setShowWelcome(false);
    setIsVisible(true);
    setCurrentStep(0);
  };

  const handleSkip = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    setIsVisible(false);
    onComplete();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('onboardingCompleted', 'true');
      setIsVisible(false);
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const current = steps[currentStep];

  // Welcome screen
  if (showWelcome) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-lg w-full text-center animate-[bounce_0.5s_ease-out]">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Play className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            🎓 Давайте поможем разобраться!
          </h2>
          
          <p className="text-gray-600 mb-6">
            Мы покажем как работает платформа, что за что отвечает и как правильно заполнять данные.
          </p>

          <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-semibold text-blue-900 mb-2">📋 Что вы узнаете:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Как добавлять новые заказы</li>
              <li>• Как следить за производством</li>
              <li>• Где смотреть финансы</li>
              <li>• Как загружать отчёты</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <SkipForward className="w-5 h-5" />
              Пропустить
            </button>
            <button
              onClick={handleStart}
              className="flex-1 py-3 px-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Начать обучение
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tutorial steps
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-40" />
  );
}