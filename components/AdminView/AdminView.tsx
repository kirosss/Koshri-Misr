'use client';

import React from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { AdminHeader } from './AdminHeader';
import { OverviewDashboard } from './OverviewDashboard';
import { OrdersManager } from './OrdersManager';
import { MenuManager } from './MenuManager';
import { ReportsAnalytics } from './ReportsAnalytics';
import { SettingsManager } from './SettingsManager';

export const AdminView: React.FC = () => {
  const { adminTab } = useRestaurant();

  return (
    <div className="space-y-6 py-2">
      <AdminHeader />

      {adminTab === 'overview' && <OverviewDashboard />}
      {adminTab === 'orders' && <OrdersManager />}
      {adminTab === 'menu' && <MenuManager />}
      {adminTab === 'reports' && <ReportsAnalytics />}
      {adminTab === 'settings' && <SettingsManager />}
    </div>
  );
};
