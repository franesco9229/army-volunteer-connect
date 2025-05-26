
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { mockCurrentUser } from '@/data/mockData';

export default function Index() {
  const { isAuthenticated } = useAuth();
  const { 
    opportunities, 
    applications, 
    volunteeringRecords, 
    isLoading, 
    error, 
    refetchData 
  } = useDashboardData();

  if (!isAuthenticated) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome to Volunteer App</h2>
            <p className="text-muted-foreground">Please sign in to access your dashboard.</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-8 animate-fade-in">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <DashboardContent
        userName={mockCurrentUser.name}
        totalHours={mockCurrentUser.totalVolunteerHours}
        opportunities={opportunities}
        applications={applications}
        volunteeringRecords={volunteeringRecords}
        userId={mockCurrentUser.id}
        onApplicationSubmitted={refetchData}
      />
    </AppLayout>
  );
}
