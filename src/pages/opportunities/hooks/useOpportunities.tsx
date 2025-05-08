
import { useState, useEffect } from 'react';
import { Opportunity, Application } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { 
  fetchOpportunities,
  fetchUserApplications,
  applyForOpportunity
} from '@/data/mockData';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';

export function useOpportunities() {
  const { isAuthenticated, user } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Get IDs of opportunities the user has already applied to
  const appliedOpportunityIds = applications.map(app => app.opportunityId);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch opportunities for all users (whether logged in or not)
      const oppsData = await fetchOpportunities();
      setOpportunities(oppsData);
      
      // Only fetch applications if the user is logged in
      if (isAuthenticated && user) {
        const appsData = await fetchUserApplications(user.id);
        setApplications(appsData);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error("Error fetching opportunities data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAuthenticated, user]);

  const handleApply = async (opportunityId: string) => {
    if (!isAuthenticated || !user) {
      toast.error("Please login to apply for opportunities");
      // Redirect to login page
      navigate('/login', { state: { from: '/opportunities' } });
      return;
    }
    
    try {
      // Prepare data for AWS backend integration
      const applicationData = {
        userId: user.id,
        opportunityId: opportunityId,
        timestamp: new Date().toISOString(),
        // Additional fields that would be sent to AWS API Gateway
        metadata: {
          source: 'web-platform',
          userAgent: navigator.userAgent,
        }
      };
      
      console.log("Sending application data to backend:", applicationData);
      
      // This will be replaced with actual AWS API call
      // Using DynamoDB and integrating with Jira and HubSpot
      await applyForOpportunity(user.id, opportunityId);
      
      toast.success("Application submitted successfully!");
      
      // Refresh applications data
      const newApplications = await fetchUserApplications(user.id);
      setApplications(newApplications);
    } catch (error) {
      toast.error("Failed to submit application");
      console.error(error);
    }
  };

  return {
    opportunities,
    applications,
    isLoading,
    appliedOpportunityIds,
    handleApply
  };
}
