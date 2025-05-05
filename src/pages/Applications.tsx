
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { ApplicationCard } from '@/components/applications/ApplicationCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  fetchUserApplications, 
  fetchOpportunities,
  mockCurrentUser
} from '@/data/mockData';
import { Application, Opportunity, ApplicationStatus } from '@/types';

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [appsData, oppsData] = await Promise.all([
        fetchUserApplications(mockCurrentUser.id),
        fetchOpportunities()
      ]);
      
      setApplications(appsData);
      setOpportunities(oppsData);
    } catch (error) {
      console.error("Error fetching applications data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter applications by status
  const pendingApplications = applications.filter(
    app => app.status === ApplicationStatus.Pending
  );
  
  const successfulApplications = applications.filter(
    app => app.status === ApplicationStatus.Successful
  );
  
  const unsuccessfulApplications = applications.filter(
    app => app.status === ApplicationStatus.Unsuccessful
  );

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Applications</h1>
          <p className="text-muted-foreground">
            Track the status of your volunteering applications.
          </p>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Applications</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="successful">Successful</TabsTrigger>
            <TabsTrigger value="unsuccessful">Unsuccessful</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applications.map((application) => {
                const opportunity = opportunities.find(
                  opp => opp.id === application.opportunityId
                );
                
                if (!opportunity) return null;
                
                return (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    opportunity={opportunity}
                  />
                );
              })}
              
              {applications.length === 0 && (
                <div className="col-span-full py-10 text-center">
                  <p className="text-muted-foreground">You haven't applied to any opportunities yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="pending" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingApplications.map((application) => {
                const opportunity = opportunities.find(
                  opp => opp.id === application.opportunityId
                );
                
                if (!opportunity) return null;
                
                return (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    opportunity={opportunity}
                  />
                );
              })}
              
              {pendingApplications.length === 0 && (
                <div className="col-span-full py-10 text-center">
                  <p className="text-muted-foreground">No pending applications.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="successful" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {successfulApplications.map((application) => {
                const opportunity = opportunities.find(
                  opp => opp.id === application.opportunityId
                );
                
                if (!opportunity) return null;
                
                return (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    opportunity={opportunity}
                  />
                );
              })}
              
              {successfulApplications.length === 0 && (
                <div className="col-span-full py-10 text-center">
                  <p className="text-muted-foreground">No successful applications yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="unsuccessful" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unsuccessfulApplications.map((application) => {
                const opportunity = opportunities.find(
                  opp => opp.id === application.opportunityId
                );
                
                if (!opportunity) return null;
                
                return (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    opportunity={opportunity}
                  />
                );
              })}
              
              {unsuccessfulApplications.length === 0 && (
                <div className="col-span-full py-10 text-center">
                  <p className="text-muted-foreground">No unsuccessful applications.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
