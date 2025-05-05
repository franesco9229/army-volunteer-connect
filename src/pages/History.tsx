
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { VolunteeringRecordCard } from '@/components/volunteering/VolunteeringRecordCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  fetchUserVolunteeringRecords, 
  fetchOpportunities,
  mockCurrentUser
} from '@/data/mockData';
import { VolunteeringRecord, Opportunity, VolunteeringRecordStatus } from '@/types';

export default function History() {
  const [records, setRecords] = useState<VolunteeringRecord[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [recordsData, oppsData] = await Promise.all([
        fetchUserVolunteeringRecords(mockCurrentUser.id),
        fetchOpportunities()
      ]);
      
      setRecords(recordsData);
      setOpportunities(oppsData);
    } catch (error) {
      console.error("Error fetching volunteering history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter records by status
  const activeRecords = records.filter(
    record => record.status === VolunteeringRecordStatus.Active
  );
  
  const completedRecords = records.filter(
    record => record.status === VolunteeringRecordStatus.Completed
  );
  
  const droppedRecords = records.filter(
    record => record.status === VolunteeringRecordStatus.Dropped
  );

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold mb-2">Volunteering History</h1>
          <p className="text-muted-foreground">
            Track and manage your volunteering contributions.
          </p>
        </div>
        
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Total Hours: <span className="text-sta-purple">{mockCurrentUser.totalVolunteerHours}</span>
          </h2>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="dropped">Dropped</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {records.map((record) => {
                const opportunity = opportunities.find(
                  opp => opp.id === record.opportunityId
                );
                
                if (!opportunity) return null;
                
                return (
                  <VolunteeringRecordCard
                    key={record.id}
                    record={record}
                    opportunity={opportunity}
                    onUpdate={fetchData}
                  />
                );
              })}
              
              {records.length === 0 && (
                <div className="col-span-full py-10 text-center">
                  <p className="text-muted-foreground">No volunteering records found.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="active" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeRecords.map((record) => {
                const opportunity = opportunities.find(
                  opp => opp.id === record.opportunityId
                );
                
                if (!opportunity) return null;
                
                return (
                  <VolunteeringRecordCard
                    key={record.id}
                    record={record}
                    opportunity={opportunity}
                    onUpdate={fetchData}
                  />
                );
              })}
              
              {activeRecords.length === 0 && (
                <div className="col-span-full py-10 text-center">
                  <p className="text-muted-foreground">No active volunteering projects.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="completed" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedRecords.map((record) => {
                const opportunity = opportunities.find(
                  opp => opp.id === record.opportunityId
                );
                
                if (!opportunity) return null;
                
                return (
                  <VolunteeringRecordCard
                    key={record.id}
                    record={record}
                    opportunity={opportunity}
                    onUpdate={fetchData}
                  />
                );
              })}
              
              {completedRecords.length === 0 && (
                <div className="col-span-full py-10 text-center">
                  <p className="text-muted-foreground">No completed volunteering projects.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="dropped" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {droppedRecords.map((record) => {
                const opportunity = opportunities.find(
                  opp => opp.id === record.opportunityId
                );
                
                if (!opportunity) return null;
                
                return (
                  <VolunteeringRecordCard
                    key={record.id}
                    record={record}
                    opportunity={opportunity}
                    onUpdate={fetchData}
                  />
                );
              })}
              
              {droppedRecords.length === 0 && (
                <div className="col-span-full py-10 text-center">
                  <p className="text-muted-foreground">No dropped volunteering projects.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
