'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Factory, LogIn, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', username);
      setTimeout(() => {
        router.push('/');
      }, 500);
    } else {
      setError('Неверный логин или пароль');
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-900 font-medium mb-2">🔐 Демо-данные для входа:</p>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Логин:</strong> admin</p>
            <p><strong>Пароль:</strong> admin123</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-bold text-gray-800 mb-2">
              👤 Логин
            </label>
            <div className="relative">
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-xl border-3 border-gray-500 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-600 transition-all bg-white"
                placeholder="Введите логин"
                required
                autoComplete="off"
                style={{ color: 'black', WebkitTextFillColor: 'black', fontWeight: 'bold' }}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
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
                autoComplete="off"
                style={{ color: 'black', WebkitTextFillColor: 'black', fontWeight: 'bold' }}
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

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Демо-версия платформы</p>
          <p className="text-xs mt-1">© 2024 Управление Швейной Фабрикой</p>
        </div>
      </div>
    </div>
  );
}