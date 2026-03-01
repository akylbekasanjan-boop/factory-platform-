'use client';

import { useState, useEffect } from 'react';
import { Play, SkipForward, ChevronRight, ChevronLeft, Check } from 'lucide-react';

interface OnboardingStep {
  title: string;
  description: string;
  icon: string;
}

const steps: OnboardingStep[] = [
  {
    title: '👋 Добро пожаловать!',
    description: 'Это платформа для управления швейной фабрикой. Мы покажем как здесь всё работает.',
    icon: '👋'
  },
  {
    title: '🏭 Производство',
    description: 'Здесь вы видите все заказы и можете добавлять новые. Нажмите на кнопку чтобы создать заказ.',
    icon: '🏭'
  },
  {
    title: '📊 Дашборд',
    description: 'Общая статистика: выручка, прибыль, сколько фабрик работает.',
    icon: '📊'
  },
  {
    title: '👥 Сотрудники',
    description: 'Список всех работников, их зарплаты, эффективность работы.',
    icon: '👥'
  },
  {
    title: '💰 Финансы',
    description: 'Выручка, расходы, прибыль, рентабельность. Здесь бухгалтер видит все деньги.',
    icon: '💰'
  },
  {
    title: '📁 Отчёты',
    description: 'Загрузка и хранение отчётов. Бухгалтер загружает файлы сюда.',
    icon: '📁'
  },
  {
    title: '✅ Готово!',
    description: 'Теперь вы знаете как пользоваться платформой. Начните с добавления заказов!',
    icon: '✅'
  }
];

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const completed = localStorage.getItem('onboardingCompleted');
    if (completed === 'true') {
      onComplete();
      return;
    }
    setTimeout(() => {
      setShowWelcome(true);
    }, 500);
  }, [onComplete]);

  const handleStart = () => {
    setShowWelcome(false);
    setCurrentStep(0);
  };

  const handleSkip = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    onComplete();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('onboardingCompleted', 'true');
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
        <div className="bg-white rounded-2xl p-8 max-w-lg w-full text-center shadow-2xl">
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
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full text-center shadow-2xl">
        {/* Progress */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, index) => (
            <div 
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentStep ? 'bg-blue-600' : 
                index < currentStep ? 'bg-green-500' : 'bg-gray-300'
              }`} 
            />
          ))}
        </div>

        {/* Icon */}
        <div className="text-6xl mb-4">{current.icon}</div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {current.title}
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          {current.description}
        </p>

        {/* Navigation */}
        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={handlePrev}
              className="py-3 px-6 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Назад
            </button>
          )}
          <button
            onClick={handleNext}
            className={`py-3 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
              currentStep === steps.length - 1 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } ${currentStep === 0 ? 'w-full' : 'flex-1'}`}
          >
            {currentStep === steps.length - 1 ? (
              <>
                <Check className="w-5 h-5" />
                Готово!
              </>
            ) : (
              <>
                Далее
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Skip */}
        {currentStep < steps.length - 1 && (
          <button
            onClick={handleSkip}
            className="mt-4 text-gray-500 text-sm hover:text-gray-700"
          >
            Пропустить обучение
          </button>
        )}
      </div>
    </div>
  );
}