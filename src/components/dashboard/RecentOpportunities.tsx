
import React from 'react';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { Opportunity, Application } from '@/types';
import { applyForOpportunity } from '@/data/mockData';
import { toast } from '@/components/ui/sonner';

interface RecentOpportunitiesProps {
  opportunities: Opportunity[];
  applications: Application[];
  userId: string;
  onApplicationSubmitted: () => void;
}

export function RecentOpportunities({ 
  opportunities, 
  applications,
  userId,
  onApplicationSubmitted 
}: RecentOpportunitiesProps) {
  // Get IDs of opportunities the user has already applied to
  const appliedOpportunityIds = applications.map(app => app.opportunityId);
  
  // Only show open opportunities
  const openOpportunities = opportunities
    .filter(opp => opp.status === 'Open')
    .slice(0, 3); // Limit to the first 3
  
  const handleApply = async (opportunityId: string) => {
    try {
      await applyForOpportunity(userId, opportunityId);
      toast.success("Application submitted successfully!");
      onApplicationSubmitted();
    } catch (error) {
      toast.error("Failed to submit application");
      console.error(error);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Recent Opportunities</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {openOpportunities.map((opportunity) => (
          <OpportunityCard
            key={opportunity.id}
            opportunity={opportunity}
            onApply={handleApply}
            hasApplied={appliedOpportunityIds.includes(opportunity.id)}
          />
        ))}
        
        {openOpportunities.length === 0 && (
          <div className="col-span-full py-10 text-center">
            <p className="text-muted-foreground">No open opportunities available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
