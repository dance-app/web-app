'use client';

import { useState, useEffect } from 'react';
import { useCurrentWorkspace } from './use-current-workspace';

export interface DashboardStats {
  totalStudents: number;
  totalEvents: number;
  totalParticipations: number;
  activeSubscriptions: number;
  revenueThisMonth: number;
  attendanceRate: number;
}

const mockDashboardStats = {
  totalStudents: 45,
  totalEvents: 12,
  totalParticipations: 156,
  activeSubscriptions: 38,
  revenueThisMonth: 2840,
  attendanceRate: 87,
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { workspace } = useCurrentWorkspace();

  const fetchStats = async () => {
    try {
      if (!workspace) return;

      setLoading(true);
      // Simulate API delay
      await delay(800);

      setStats(mockDashboardStats);
      console.log('Fetched dashboard stats:', mockDashboardStats);

      setLoading(false);
    } catch (error) {
      console.error('Fetch dashboard stats error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [workspace]);

  return {
    stats,
    loading,
    refetch: fetchStats,
  };
}
