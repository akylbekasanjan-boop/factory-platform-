'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Factory, Phone, Lock, User, ArrowLeft, ArrowRight, Check, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Generate random 6-digit code
  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSendCode = () => {
    if (phone.length < 10) {
      setError('Введите корректный номер телефона');
      return;
    }
    setError('');
    setLoading(true);
    
    // Generate code (in real app, send SMS)
    const newCode = generateCode();
    setGeneratedCode(newCode);
    
    // Simulate SMS sending
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      alert(`Ваш код: ${newCode}\n\n(В реальном приложении код придёт в SMS)`);
    }, 1500);
  };

  const handleVerifyCode = () => {
    if (code === generatedCode) {
      setLoading(true);
      
      // Save user
      const user = {
        id: Date.now().toString(),
        phone: phone,
        name: name || 'Пользователь',
        role: 'user' as const,
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('users', JSON.stringify([user]));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', user.name);
      localStorage.setItem('userPhone', user.phone);
      localStorage.removeItem('onboardingCompleted'); // Reset onboarding
      
      setTimeout(() => {
        router.push('/');
      }, 500);
    } else {
      setError('Неверный код. Попробуйте ещё раз.');
    }
  };

  const handleResendCode = () => {
    const newCode = generateCode();
    setGeneratedCode(newCode);
    setCode('');
    alert(`Новый код: ${newCode}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Factory className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Регистрация</h1>
          <p className="text-gray-600 text-sm">Создайте аккаунт для входа</p>
        </div>

        {/* Step indicator */}
        <div className="flex justify-center gap-2 mb-6">
          <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`} />
          <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
          <div className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`} />
        </div>

        {/* Step 1: Phone */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                📱 Номер телефона
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="79991234567"
                  className="w-full px-4 py-4 text-lg border-3 border-gray-400 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-600 transition-all bg-white text-black font-bold"
                  maxLength={11}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Введите номер без +7 или 8</p>
            </div>

            <button
              onClick={handleSendCode}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 px-4 rounded-xl hover:bg-blue-700 transition-all font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Получить код <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Step 2: Name */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                👤 Ваше имя
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Как к вам обращаться?"
                  className="w-full px-4 py-4 text-lg border-3 border-gray-400 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-600 transition-all bg-white text-black font-bold"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(3)}
              disabled={!name}
              className="w-full bg-blue-600 text-white py-4 px-4 rounded-xl hover:bg-blue-700 transition-all font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Продолжить <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 3: Verify Code */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                🔐 Код из SMS
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-4 text-2xl border-3 border-gray-400 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-600 transition-all bg-white text-black font-bold text-center tracking-widest"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Код отправлен на номер {phone}</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              onClick={handleVerifyCode}
              disabled={code.length !== 6 || loading}
              className="w-full bg-green-600 text-white py-4 px-4 rounded-xl hover:bg-green-700 transition-all font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-6 h-6" />
                  Подтвердить и войти
                </>
              )}
            </button>

            <button
              onClick={handleResendCode}
              className="w-full text-blue-600 text-sm font-medium hover:underline"
            >
              Отправить код повторно
            </button>
          </div>
        )}

        {/* Back to login */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/login')}
            className="text-gray-600 hover:text-gray-900 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться к входу
          </button>
        </div>
      </div>
    </div>
  );
}