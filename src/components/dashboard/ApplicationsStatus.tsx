
import React from 'react';
import { Application, Opportunity } from '@/types';
import { ApplicationCard } from '@/components/applications/ApplicationCard';

interface ApplicationsStatusProps {
  applications: Application[];
  opportunities: Opportunity[];
}

export function ApplicationsStatus({ 
  applications, 
  opportunities 
}: ApplicationsStatusProps) {
  // Get the 3 most recent applications
  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
    .slice(0, 3);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Recent Applications</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recentApplications.map((application) => {
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
        
        {recentApplications.length === 0 && (
          <div className="col-span-full py-10 text-center">
            <p className="text-muted-foreground">No applications submitted yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
