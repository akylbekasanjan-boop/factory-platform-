'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Factory, LogIn, Eye, EyeOff, Phone } from 'lucide-react';

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

export default function LoginPage() {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCountryList, setShowCountryList] = useState(false);
  const router = useRouter();

  const fullPhone = selectedCountry.code + phone;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Get users from localStorage
    const usersStr = localStorage.getItem('users');
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];

    // Find user by phone and password
    const user = users.find(u => u.phone === fullPhone && u.password === password);

    if (user) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', user.name);
      localStorage.setItem('userPhone', user.phone);
      localStorage.setItem('userRole', user.role);
      
      setTimeout(() => {
        router.push('/');
      }, 500);
    } else if (fullPhone === '79991234567' && password === 'admin123') {
      // Demo admin account
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', 'Администратор');
      localStorage.setItem('userPhone', '79991234567');
      localStorage.setItem('userRole', 'admin');
      
      setTimeout(() => {
        router.push('/');
      }, 500);
    } else {
      setError('Неверный номер телефона или пароль');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Factory className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Управление Швейной Фабрикой</h1>
          <p className="text-gray-600">Войдите в систему</p>
        </div>

        {/* Demo Credentials */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-900 font-medium mb-2">👨‍💻 Демо-аккаунт:</p>
          <div className="text-sm text-yellow-800 space-y-1">
            <p><strong>Телефон:</strong> +7 999 123-45-67</p>
            <p><strong>Пароль:</strong> admin123</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Country Selector */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              📱 Номер телефона
            </label>
            
            <div className="relative mb-3">
              <button
                type="button"
                onClick={() => setShowCountryList(!showCountryList)}
                className="w-full px-4 py-3 border-3 border-gray-500 rounded-xl bg-white flex items-center justify-between hover:border-blue-500 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="text-2xl">{selectedCountry.flag}</span>
                  <span className="font-bold text-gray-900">+{selectedCountry.code}</span>
                </span>
                <span className="text-gray-400">▼</span>
              </button>

              {showCountryList && (
                <div className="absolute z-10 w-full mt-1 bg-white border-3 border-gray-500 rounded-xl max-h-48 overflow-y-auto shadow-lg">
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

            {/* Phone Input */}
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="9123456789"
                maxLength={15}
                required
                className="w-full px-4 py-4 text-xl border-3 border-gray-500 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-600 transition-all bg-white"
                style={{ color: 'black', fontWeight: 'bold' }}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-gray-800 mb-2">
              🔐 Пароль
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 text-xl border-3 border-gray-500 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-600 transition-all bg-white"
                placeholder="Введите пароль"
                required
                style={{ color: 'black', fontWeight: 'bold' }}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <button 
              type="button"
              onClick={() => router.push('/forgot-password')}
              className="text-blue-600 font-medium hover:underline text-sm"
            >
              🔑 Забыли пароль?
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-300 rounded-lg p-3">
              <p className="text-base text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 px-4 rounded-xl hover:bg-blue-700 transition-all font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                Вход в систему...
              </span>
            ) : (
              <>
                <LogIn className="w-6 h-6" />
                Войти
              </>
            )}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Нет аккаунта?{' '}
            <button 
              onClick={() => router.push('/register')}
              className="text-blue-600 font-bold hover:underline"
            >
              Зарегистрироваться
            </button>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Демо-версия платформы</p>
          <p className="text-xs mt-1">© 2024 Управление Швейной Фабрикой</p>
        </div>
      </div>
    </div>
  );
}