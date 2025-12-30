'use client';

import { useState, useEffect, useCallback } from 'react';
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
  const { workspace, isLoading: workspaceLoading } = useCurrentWorkspace();

  const fetchStats = useCallback(async () => {
    try {
      if (!workspace) {
        setLoading(false);
        return;
      }

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
  }, [workspace]);

  useEffect(() => {
    if (!workspaceLoading) {
      fetchStats();
    }
  }, [workspace, workspaceLoading, fetchStats]);

  return {
    stats,
    loading: loading || workspaceLoading,
    refetch: fetchStats,
  };
}
