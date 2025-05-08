
import { useState, useEffect } from 'react';
import { Opportunity, Application, Skill } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { 
  VolunteeringApi, 
  JiraApi,
  HubSpotApi 
} from '@/services/api';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';

// For development, we'll still use mock data but set up for easy transition
import { 
  fetchOpportunities,
  fetchUserApplications,
  applyForOpportunity,
  fetchUserSkills
} from '@/data/mockData';

// Flag to switch between mock and real API calls
const USE_REAL_APIS = false;

export function useOpportunities() {
  const { isAuthenticated, user } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const navigate = useNavigate();

  // Get IDs of opportunities the user has already applied to
  const appliedOpportunityIds = applications.map(app => app.opportunityId);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch opportunities for all users (whether logged in or not)
      let oppsData;
      if (USE_REAL_APIS) {
        oppsData = await VolunteeringApi.getOpportunities();
      } else {
        oppsData = await fetchOpportunities();
      }
      setOpportunities(oppsData);
      
      // Only fetch applications if the user is logged in
      if (isAuthenticated && user) {
        let appsData;
        let skills;
        
        if (USE_REAL_APIS) {
          appsData = await VolunteeringApi.getUserApplications(user.id);
          skills = await VolunteeringApi.getUserSkills(user.id);
        } else {
          appsData = await fetchUserApplications(user.id);
          skills = await fetchUserSkills(user.id);
        }
        
        setApplications(appsData);
        console.log("Fetched user skills:", skills);
        setUserSkills(skills);
      } else {
        setApplications([]);
        setUserSkills([]);
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
      
      if (USE_REAL_APIS) {
        // Create application in DynamoDB through API Gateway
        await VolunteeringApi.applyForOpportunity(opportunityId, user.id, {
          userAgent: navigator.userAgent
        });
        
        // Create Jira ticket for this application
        await JiraApi.createJiraTicket(opportunityId, user.id);
        
        // Track this engagement in HubSpot
        await HubSpotApi.trackEngagement(user.id, 'opportunity_application', {
          opportunityId
        });
      } else {
        // Using mock API for now
        await applyForOpportunity(user.id, opportunityId);
      }
      
      toast.success("Application submitted successfully!");
      
      // Refresh applications data
      let newApplications;
      if (USE_REAL_APIS) {
        newApplications = await VolunteeringApi.getUserApplications(user.id);
      } else {
        newApplications = await fetchUserApplications(user.id);
      }
      
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
    handleApply,
    userSkills
  };
}
