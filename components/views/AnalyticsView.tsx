'use client';

import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import {
  TrendingUp,
  TrendingDown,
  Award,
  AlertTriangle,
  Activity,
  BarChart3,
} from 'lucide-react';
import { analytics, factories, orders, employees } from '@/data/mockData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AnalyticsView() {
  // Empty state handling
  const hasData = analytics.productionTrend.length > 0;

  // Production Trend Line Chart
  const productionTrendData = {
    labels: hasData ? analytics.productionTrend.map((d) => d.day) : ['Нет данных'],
    datasets: [
      {
        label: 'Произведено единиц',
        data: hasData ? analytics.productionTrend.map((d) => d.units) : [0],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointRadius: 4,
      },
    ],
  };

  const productionTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Defect Rate Line Chart
  const defectRateData = {
    labels: hasData ? analytics.productionTrend.map((d) => d.day) : ['Нет данных'],
    datasets: [
      {
        label: 'Брак',
        data: hasData ? analytics.productionTrend.map((d) => d.defects) : [0],
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgba(239, 68, 68, 1)',
        pointRadius: 4,
      },
    ],
  };

  const defectRateOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Factory Efficiency Bar Chart
  const factoryEfficiencyData = {
    labels: analytics.efficiencyByFactory.length > 0 
      ? analytics.efficiencyByFactory.map((f) => f.name.split(' ')[1])
      : ['Нет данных'],
    datasets: [
      {
        label: 'Эффективность %',
        data: analytics.efficiencyByFactory.length > 0 
          ? analytics.efficiencyByFactory.map((f) => f.efficiency)
          : [0],
        backgroundColor: analytics.efficiencyByFactory.length > 0
          ? analytics.efficiencyByFactory.map((f) =>
              f.efficiency >= 90
                ? 'rgba(34, 197, 94, 0.8)'
                : f.efficiency >= 80
                ? 'rgba(59, 130, 246, 0.8)'
                : 'rgba(239, 68, 68, 0.8)'
            )
          : ['rgba(156, 163, 175, 0.8)'],
        borderRadius: 6,
      },
    ],
  };

  const factoryEfficiencyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  // Priority Distribution Doughnut Chart
  const priorityCounts = {
    high: orders.filter((o) => o.priority === 'high').length,
    medium: orders.filter((o) => o.priority === 'medium').length,
    low: orders.filter((o) => o.priority === 'low').length,
  };

  const priorityData = {
    labels: ['Высокий', 'Средний', 'Низкий'],
    datasets: [
      {
        data: [priorityCounts.high, priorityCounts.medium, priorityCounts.low],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(156, 163, 175, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const priorityOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    cutout: '70%',
  };

  // Status Distribution
  const statusCounts = {
    completed: orders.filter((o) => o.status === 'completed').length,
    in_progress: orders.filter((o) => o.status === 'in_progress').length,
    delayed: orders.filter((o) => o.status === 'delayed').length,
    pending: orders.filter((o) => o.status === 'pending').length,
  };

  const statusData = {
    labels: ['Завершено', 'В процессе', 'Задержано', 'Ожидает'],
    datasets: [
      {
        data: [statusCounts.completed, statusCounts.in_progress, statusCounts.delayed, statusCounts.pending],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(156, 163, 175, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const statusOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    cutout: '70%',
  };

  // Calculated Metrics - all at 0
  const totalProduction = factories.reduce((sum, f) => sum + f.todayProduction, 0);
  const avgEfficiency = factories.length > 0 
    ? factories.reduce((sum, f) => sum + f.efficiency, 0) / factories.length 
    : 0;
  const totalDefects = hasData ? analytics.productionTrend.reduce((sum, d) => sum + d.defects, 0) : 0;
  const profitGrowthRate = 0;
  const productionGrowthRate = 0;

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Аналитика</h2>
        <p className="text-gray-600 mt-1">Добавьте заказы для отображения статистики</p>
      </div>

      {/* Empty State Message */}
      {!hasData && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Нет данных для анализа</h3>
          <p className="text-blue-700">Добавьте заказы в разделе "Производство" чтобы увидеть статистику</p>
        </div>
      )}

      {/* Key Analytics Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Производство за день</h3>
          <p className="text-2xl font-bold text-gray-900">{totalProduction.toLocaleString()} ед.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Средняя эффективность</h3>
          <p className="text-2xl font-bold text-gray-900">{avgEfficiency.toFixed(1)}%</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Уровень брака</h3>
          <p className="text-2xl font-bold text-gray-900">
            {totalProduction > 0 ? ((totalDefects / totalProduction) * 100).toFixed(2) : '0.00'}%
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Рост прибыли</h3>
          <p className="text-2xl font-bold text-gray-900">{profitGrowthRate}%</p>
        </div>
      </div>

      {/* Production Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Тренд производства (7 дней)</h3>
          <p className="text-sm text-gray-500 mb-4">Произведено единиц в день</p>
          <div className="h-72">
            <Line data={productionTrendData} options={productionTrendOptions} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Тренд брака (7 дней)</h3>
          <p className="text-sm text-gray-500 mb-4">Выявлено дефектов в день</p>
          <div className="h-72">
            <Line data={defectRateData} options={defectRateOptions} />
          </div>
        </div>
      </div>

      {/* Factory Efficiency */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Сравнение эффективности фабрик</h3>
        <p className="text-sm text-gray-500 mb-4">Эффективность по фабрикам (цель: 85%+)</p>
        <div className="h-80">
          <Bar data={factoryEfficiencyData} options={factoryEfficiencyOptions} />
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Распределение приоритетов заказов</h3>
          <p className="text-sm text-gray-500 mb-4">Заказы по уровню приоритета</p>
          <div className="h-72 flex justify-center">
            <Doughnut data={priorityData} options={priorityOptions} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div className="bg-red-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-red-600">{priorityCounts.high}</p>
              <p className="text-xs text-gray-600">Высокий приоритет</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-blue-600">{priorityCounts.medium}</p>
              <p className="text-xs text-gray-600">Средний приоритет</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-gray-600">{priorityCounts.low}</p>
              <p className="text-xs text-gray-600">Низкий приоритет</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Распределение статусов заказов</h3>
          <p className="text-sm text-gray-500 mb-4">Заказы по текущему статусу</p>
          <div className="h-72 flex justify-center">
            <Doughnut data={statusData} options={statusOptions} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-center">
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-green-600">{statusCounts.completed}</p>
              <p className="text-xs text-gray-600">Завершено</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-blue-600">{statusCounts.in_progress}</p>
              <p className="text-xs text-gray-600">В процессе</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-red-600">{statusCounts.delayed}</p>
              <p className="text-xs text-gray-600">Задержано</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-gray-600">{statusCounts.pending}</p>
              <p className="text-xs text-gray-600">Ожидает</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers - only show if there are employees */}
      {employees.length > 0 && analytics.topPerformers.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-6 h-6 text-amber-500" />
            <h3 className="text-lg font-semibold text-gray-900">Лучшие сотрудники</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {analytics.topPerformers.slice(0, 5).map((performer, idx) => {
              const employee = employees.find((e) => e.name === performer.name);
              return (
                <div
                  key={idx}
                  className={`border rounded-lg p-4 ${
                    idx === 0 ? 'bg-gradient-to-b from-amber-50 to-yellow-50 border-amber-300' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        idx === 0 ? 'bg-amber-500' : 'bg-blue-600'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{performer.name}</p>
                      <p className="text-xs text-gray-600">{performer.factory}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">{performer.score}</p>
                    <p className="text-xs text-gray-500">Оценка производительности</p>
                  </div>
                  {employee && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Эффективность</span>
                        <span className="font-medium">{employee.efficiency}%</span>
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span className="text-gray-600">Итого к выплате</span>
                        <span className="font-medium">{(employee.totalPay / 1000).toFixed(0)}K ₽</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Operational Health Score */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Общая операционная эффективность</h3>
            <p className="text-blue-100 text-sm">
              Добавьте заказы для расчёта показателей
            </p>
          </div>
          <div className="text-center">
            <p className="text-5xl font-bold">0%</p>
            <p className="text-blue-100 text-sm mt-1">Индекс здоровья</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-blue-100 text-xs mb-1">Производство</p>
            <p className="text-2xl font-bold">0%</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-blue-100 text-xs mb-1">Эффективность</p>
            <p className="text-2xl font-bold">0%</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-blue-100 text-xs mb-1">Качество</p>
            <p className="text-2xl font-bold">0%</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-blue-100 text-xs mb-1">Финансы</p>
            <p className="text-2xl font-bold">0%</p>
          </div>
        </div>
      </div>
    </div>
  );
}