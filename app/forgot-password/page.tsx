'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Factory, Phone, Lock, ArrowLeft, Check, AlertCircle, Eye, EyeOff, Send } from 'lucide-react';

interface User {
  phone: string;
  password: string;
  name: string;
  role: string;
  createdAt: string;
}

interface Country {
  code: string;
  name: string;
  flag: string;
}

const countries: Country[] = [
  { code: '7', name: 'Россия', flag: '🇷🇺' },
  { code: '375', name: 'Беларусь', flag: '🇧🇾' },
  { code: '380', name: 'Украина', flag: '🇺🇦' },
  { code: '77', name: 'Казахстан', flag: '🇰🇿' },
  { code: '994', name: 'Азербайджан', flag: '🇦🇿' },
  { code: '992', name: 'Таджикистан', flag: '🇹🇯' },
  { code: '993', name: 'Туркменистан', flag: '🇹🇲' },
  { code: '996', name: 'Кыргызстан', flag: '🇰🇬' },
  { code: '998', name: 'Узбекистан', flag: '🇺🇿' },
  { code: '373', name: 'Молдова', flag: '🇲🇩' },
  { code: '374', name: 'Армения', flag: '🇦🇲' },
  { code: '995', name: 'Грузия', flag: '🇬🇪' },
  { code: '372', name: 'Эстония', flag: '🇪🇪' },
  { code: '371', name: 'Латвия', flag: '🇱🇻' },
  { code: '370', name: 'Литва', flag: '🇱🇹' },
  { code: '44', name: 'Великобритания', flag: '🇬🇧' },
  { code: '49', name: 'Германия', flag: '🇩🇪' },
  { code: '33', name: 'Франция', flag: '🇫🇷' },
  { code: '1', name: 'США/Канада', flag: '🇺🇸' },
  { code: '90', name: 'Турция', flag: '🇹🇷' },
  { code: '972', name: 'Израиль', flag: '🇮🇱' },
  { code: '81', name: 'Япония', flag: '🇯🇵' },
  { code: '82', name: 'Южная Корея', flag: '🇰🇷' },
  { code: '86', name: 'Китай', flag: '🇨🇳' },
];

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCountryList, setShowCountryList] = useState(false);

  const fullPhone = selectedCountry.code + phone;

  const handleSendCode = async () => {
    if (phone.length < 7) {
      setError('Введите корректный номер телефона');
      return;
    }

    // Check if phone exists
    const usersStr = localStorage.getItem('users');
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];
    if (!users.find(u => u.phone === fullPhone)) {
      setError('Пользователь с таким номером не найден');
      return;
    }

    setError('');
    setLoading(true);
    
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    try {
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: fullPhone,
          message: `Код восстановления: ${newCode}`,
          type: 'password_reset'
        })
      });

      const result = await response.json();

      if (result.success) {
        setGeneratedCode(newCode);
        if (result.demo) {
          alert(`📱 Код для восстановления (демо): ${newCode}`);
        }
        setStep(2);
      } else {
        setError(result.error || 'Ошибка отправки SMS');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = () => {
    if (code !== generatedCode) {
      setError('Неверный код. Попробуйте ещё раз.');
      return;
    }
    
    setError('');
    setStep(3);
  };

  const handleResetPassword = () => {
    if (newPassword.length < 4) {
      setError('Пароль должен быть не менее 4 символов');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setLoading(true);
    
    // Update password
    const usersStr = localStorage.getItem('users');
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];
    const userIndex = users.findIndex(u => u.phone === fullPhone);
    
    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      localStorage.setItem('users', JSON.stringify(users));
      setSuccess('Пароль успешно изменён!');
      
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } else {
      setError('Ошибка. Попробуйте ещё раз.');
    }
    
    setLoading(false);
  };

  const handleResendCode = async () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    try {
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: fullPhone,
          message: `Код восстановления: ${newCode}`,
          type: 'password_reset'
        })
      });

      const result = await response.json();

      if (result.success) {
        setGeneratedCode(newCode);
        setCode('');
        if (result.demo) {
          alert(`📱 Новый код (демо): ${newCode}`);
        }
      } else {
        setError(result.error || 'Ошибка отправки');
      }
    } catch (err) {
      setError('Ошибка соединения');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Восстановление пароля</h1>
          <p className="text-gray-600 text-sm">Введите номер телефона для восстановления</p>
        </div>

        {/* Step indicator */}
        <div className="flex justify-center gap-2 mb-6">
          <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`} />
          <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
          <div className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`} />
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <Check className="w-6 h-6 text-green-600" />
            <p className="text-green-700 font-medium">{success}</p>
          </div>
        )}

        {/* Step 1: Phone */}
        {step === 1 && (
          <div className="space-y-4">
            {/* Country Selector */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                📱 Номер телефона
              </label>
              
              <div className="relative mb-3">
                <button
                  type="button"
                  onClick={() => setShowCountryList(!showCountryList)}
                  className="w-full px-4 py-3 border-3 border-gray-400 rounded-xl bg-white flex items-center justify-between hover:border-blue-500 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-2xl">{selectedCountry.flag}</span>
                    <span className="font-bold text-gray-900">+{selectedCountry.code}</span>
                    <span className="text-gray-600 text-sm">{selectedCountry.name}</span>
                  </span>
                  <span className="text-gray-400">▼</span>
                </button>

                {showCountryList && (
                  <div className="absolute z-10 w-full mt-1 bg-white border-3 border-gray-400 rounded-xl max-h-48 overflow-y-auto shadow-lg">
                    {countries.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => {
                          setSelectedCountry(country);
                          setShowCountryList(false);
                        }}
                        className="w-full px-4 py-2 flex items-center gap-3 hover:bg-blue-50 transition-colors text-left"
                      >
                        <span className="text-xl">{country.flag}</span>
                        <span className="font-medium text-gray-900">+{country.code}</span>
                        <span className="text-gray-600 text-sm">{country.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9123456789"
                  className="w-full px-4 py-4 text-lg border-3 border-gray-400 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-600 transition-all bg-white text-black font-bold"
                  maxLength={15}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Введите номер, указанный при регистрации</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              onClick={handleSendCode}
              disabled={loading || phone.length < 7}
              className="w-full bg-blue-600 text-white py-4 px-4 rounded-xl hover:bg-blue-700 transition-all font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Получить код в SMS
                </>
              )}
            </button>
          </div>
        )}

        {/* Step 2: Verify Code */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-blue-800 text-sm">
                📱 Код отправлен на номер<br />
                <strong className="text-lg">+{fullPhone}</strong>
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                🔐 Код из SMS
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-4 text-2xl border-3 border-gray-400 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-600 transition-all bg-white text-black font-bold text-center tracking-widest"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              onClick={handleVerifyCode}
              disabled={code.length !== 6}
              className="w-full bg-green-600 text-white py-4 px-4 rounded-xl hover:bg-green-700 transition-all font-bold text-lg disabled:opacity-50"
            >
              Подтвердить код
            </button>

            <button
              onClick={handleResendCode}
              className="w-full text-blue-600 text-sm font-medium hover:underline"
            >
              Отправить код повторно
            </button>

            <button
              onClick={() => { setStep(1); setCode(''); }}
              className="w-full text-gray-500 text-sm hover:text-gray-700"
            >
              ← Изменить номер
            </button>
          </div>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                🔐 Новый пароль
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Придумайте новый пароль"
                  className="w-full px-4 py-4 text-lg border-3 border-gray-400 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-600 transition-all bg-white text-black font-bold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-6 h-6 text-gray-400" /> : <Eye className="w-6 h-6 text-gray-400" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Минимум 4 символа</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                🔐 Подтвердите пароль
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Повторите пароль"
                className="w-full px-4 py-4 text-lg border-3 border-gray-400 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-600 transition-all bg-white text-black font-bold"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              onClick={handleResetPassword}
              disabled={loading || !newPassword || !confirmPassword}
              className="w-full bg-green-600 text-white py-4 px-4 rounded-xl hover:bg-green-700 transition-all font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-6 h-6" />
                  Сохранить новый пароль
                </>
              )}
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