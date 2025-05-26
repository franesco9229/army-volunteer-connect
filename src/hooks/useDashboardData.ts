
import { useState, useEffect } from 'react';
import { Opportunity, Application, VolunteeringRecord } from '@/types';
import { 
  fetchOpportunities, 
  fetchUserApplications, 
  fetchUserVolunteeringRecords,
  mockCurrentUser
} from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

export function useDashboardData() {
  const { isAuthenticated } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [volunteeringRecords, setVolunteeringRecords] = useState<VolunteeringRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const [oppsData, appsData, recordsData] = await Promise.all([
        fetchOpportunities(),
        fetchUserApplications(mockCurrentUser.id),
        fetchUserVolunteeringRecords(mockCurrentUser.id)
      ]);
      
      setOpportunities(oppsData);
      setApplications(appsData);
      setVolunteeringRecords(recordsData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAuthenticated]);

  return {
    opportunities,
    applications,
    volunteeringRecords,
    isLoading,
    error,
    refetchData: fetchData
  };
}
