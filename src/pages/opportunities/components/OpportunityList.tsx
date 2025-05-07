
import React from 'react';
import { Opportunity } from '@/types';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';

interface OpportunityListProps {
  opportunities: Opportunity[];
  appliedOpportunityIds: string[];
  onApply: (opportunityId: string) => void;
  isLoading: boolean;
}

export function OpportunityList({ 
  opportunities, 
  appliedOpportunityIds, 
  onApply,
  isLoading 
}: OpportunityListProps) {
  if (isLoading) {
    return (
      <div className="col-span-full py-10 text-center">
        <p>Loading opportunities...</p>
      </div>
    );
  }
  
  if (opportunities.length === 0) {
    return (
      <div className="col-span-full py-10 text-center">
        <p className="text-muted-foreground">No opportunities found matching your search.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {opportunities.map((opportunity) => (
        <OpportunityCard
          key={opportunity.id}
          opportunity={opportunity}
          onApply={onApply}
          hasApplied={appliedOpportunityIds.includes(opportunity.id)}
        />
      ))}
    </div>
  );
}
