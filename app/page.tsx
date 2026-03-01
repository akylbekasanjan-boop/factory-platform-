'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import DashboardView from '@/components/views/DashboardView';
import ProductionView from '@/components/views/ProductionView';
import HRView from '@/components/views/HRView';
import FinanceView from '@/components/views/FinanceView';
import AnalyticsView from '@/components/views/AnalyticsView';
import ReportsView from '@/components/views/ReportsView';
import Onboarding from '@/components/Onboarding';
import { ViewType } from '@/lib/types';

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('production');
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    if (auth !== 'true') {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
      const completed = localStorage.getItem('onboardingCompleted');
      if (completed !== 'true') {
        setShowOnboarding(true);
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    router.push('/login');
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'production':
        return <ProductionView />;
      case 'hr':
        return <HRView />;
      case 'finance':
        return <FinanceView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'reports':
        return <ReportsView />;
      default:
        return <ProductionView />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Sidebar 
          currentView={currentView} 
          onViewChange={setCurrentView} 
          onLogout={handleLogout}
        />
        <main className="md:ml-64 transition-all duration-300">
          <Header onLogout={handleLogout} />
          <div className="p-4 md:p-6">
            {renderView()}
          </div>
        </main>
      </div>
      {showOnboarding && (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      )}
    </>
  );
}