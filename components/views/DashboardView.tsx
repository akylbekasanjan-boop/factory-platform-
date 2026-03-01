'use client';

import {
  Factory,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import ChartCard from '@/components/ChartCard';
import { keyMetrics, factories, orders, analytics, financialData } from '@/data/mockData';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DashboardView() {
  const productionChartData = {
    labels: analytics.productionTrend.map((d) => {
      const days: { [key: string]: string } = {
        'Mon': 'Пн',
        'Tue': 'Вт',
        'Wed': 'Ср',
        'Thu': 'Чт',
        'Fri': 'Пт',
        'Sat': 'Сб',
        'Sun': 'Вс'
      };
      return days[d.day] || d.day;
    }),
    datasets: [
      {
        label: 'Произведено',
        data: analytics.productionTrend.map((d) => d.units),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 6,
      },
      {
        label: 'Брак',
        data: analytics.productionTrend.map((d) => d.defects),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderRadius: 6,
      },
    ],
  };

  const productionChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const profitChartData = {
    labels: financialData.profitHistory.map((d) => {
      const months: { [key: string]: string } = {
        'Jul 2023': 'Июл 2023',
        'Aug 2023': 'Авг 2023',
        'Sep 2023': 'Сен 2023',
        'Oct 2023': 'Окт 2023',
        'Nov 2023': 'Ноя 2023',
        'Dec 2023': 'Дек 2023',
        'Jan 2024': 'Янв 2024'
      };
      return months[d.month] || d.month;
    }),
    datasets: [
      {
        label: 'Прибыль (₽)',
        data: financialData.profitHistory.map((d) => d.profit),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderRadius: 6,
      },
    ],
  };

  const profitChartOptions = {
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
        ticks: {
          callback: (value: any) => `${(value / 1000000).toFixed(1)}M`,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Дашборд</h2>
        <p className="text-gray-600 mt-1">
          Добро пожаловать! Вот что происходит на ваших фабриках.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Общая выручка (месяц)"
          value={keyMetrics.monthlyRevenue.toLocaleString('ru-RU') + ' ₽'}
          change='+12.5%'
          changeType='positive'
          icon={DollarSign}
          iconColor='text-green-600'
          bgColor='bg-green-100'
        />
        <StatCard
          title="Общая прибыль (месяц)"
          value={keyMetrics.monthlyProfit.toLocaleString('ru-RU') + ' ₽'}
          change='+8.3%'
          changeType='positive'
          icon={TrendingUp}
          iconColor='text-blue-600'
          bgColor='bg-blue-100'
        />
        <StatCard
          title="Активные фабрики"
          value={factories.filter((f) => f.status === 'active').length + '/' + keyMetrics.totalFactories}
          change='+1'
          changeType='positive'
          icon={Factory}
          iconColor='text-purple-600'
          bgColor='bg-purple-100'
        />
        <StatCard
          title="Всего сотрудников"
          value={keyMetrics.totalEmployees}
          change='+18'
          changeType='positive'
          icon={Users}
          iconColor='text-orange-600'
          bgColor='bg-orange-100'
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Средняя эффективность"
          value={keyMetrics.avgEfficiency + '%'}
          change='+2.4%'
          changeType='positive'
          icon={Activity}
          iconColor='text-cyan-600'
          bgColor='bg-cyan-100'
        />
        <StatCard
          title="Уровень брака"
          value={keyMetrics.defectRate + '%'}
          change='-0.3%'
          changeType='positive'
          icon={CheckCircle}
          iconColor='text-green-600'
          bgColor='bg-green-100'
        />
        <StatCard
          title="Активные заказы"
          value={keyMetrics.activeOrders}
          change={orders.filter((o) => o.status === 'delayed').length + ' задержано'}
          changeType='negative'
          icon={Clock}
          iconColor='text-amber-600'
          bgColor='bg-amber-100'
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Производство (последние 7 дней)" subtitle="Произведено единиц vs брак">
          <div className="h-80">
            <Bar data={productionChartData} options={productionChartOptions} />
          </div>
        </ChartCard>

        <ChartCard title="История прибыли" subtitle="Ежемесячная прибыль">
          <div className="h-80">
            <Bar data={profitChartData} options={profitChartOptions} />
          </div>
        </ChartCard>
      </div>

      {/* Alerts & Factory Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Последние уведомления</h3>
          <div className="space-y-3">
            {analytics.alerts.slice(0, 4).map((alert, idx) => (
              <div
                key={idx}
                className={`flex gap-3 p-3 rounded-lg ${
                  alert.type === 'danger'
                    ? 'bg-red-50 border border-red-200'
                    : alert.type === 'warning'
                    ? 'bg-amber-50 border border-amber-200'
                    : alert.type === 'success'
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-blue-50 border border-blue-200'
                }`}
              >
                <AlertTriangle
                  className={`w-5 h-5 mt-0.5 shrink-0 ${
                    alert.type === 'danger'
                      ? 'text-red-600'
                      : alert.type === 'warning'
                      ? 'text-amber-600'
                      : alert.type === 'success'
                      ? 'text-green-600'
                      : 'text-blue-600'
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Factories */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Производительность фабрик</h3>
          <div className="space-y-4">
            {factories.map((factory) => (
              <div
                key={factory.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900">{factory.name}</h4>
                    <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700">
                      {factory.location}
                    </span>
                    {factory.status === 'active' ? (
                      <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                        Активна
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-700">
                        На обслуживании
                      </span>
                    )}
                  </div>
                  <div className="flex gap-6 text-sm text-gray-600">
                    <span>Сотрудники: {factory.employees}</span>
                    <span>Сегодня: {factory.todayProduction.toLocaleString()} ед.</span>
                    <span>Прибыль: {factory.profit.toLocaleString()} ₽</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{factory.efficiency}%</p>
                  <p className="text-sm text-gray-500">Эффективность</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}