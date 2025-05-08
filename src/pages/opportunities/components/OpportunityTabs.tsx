import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Opportunity } from '@/types';
import { Check } from 'lucide-react';
import { OpportunityList } from './OpportunityList';
interface OpportunityTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  filteredOpportunities: Opportunity[];
  appliedOpportunityIds: string[];
  onApply: (opportunityId: string) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}
export function OpportunityTabs({
  activeTab,
  onTabChange,
  filteredOpportunities,
  appliedOpportunityIds,
  onApply,
  isAuthenticated,
  isLoading
}: OpportunityTabsProps) {
  return <Tabs defaultValue="all" value={activeTab} onValueChange={onTabChange}>
      <TabsList>
        <TabsTrigger value="all">All Opportunities</TabsTrigger>
        
        {isAuthenticated && <TabsTrigger value="applied" className="flex items-center gap-1">
            <Check className="h-4 w-4" />
            <span>Applied</span>
          </TabsTrigger>}
      </TabsList>
      
      <TabsContent value="all" className="mt-6">
        <OpportunityList opportunities={filteredOpportunities} appliedOpportunityIds={appliedOpportunityIds} onApply={onApply} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="open" className="mt-6">
        <OpportunityList opportunities={filteredOpportunities} appliedOpportunityIds={appliedOpportunityIds} onApply={onApply} isLoading={isLoading} />
      </TabsContent>
      
      {isAuthenticated && <TabsContent value="applied" className="mt-6">
          <OpportunityList opportunities={filteredOpportunities} appliedOpportunityIds={appliedOpportunityIds} onApply={onApply} isLoading={isLoading} />
        </TabsContent>}
    </Tabs>;
}