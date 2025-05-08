
import React, { useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { OpportunitiesFilter } from '@/components/opportunities/OpportunitiesFilter';
import { useAuth } from '@/contexts/AuthContext';
import { useOpportunities } from './opportunities/hooks/useOpportunities';
import { useOpportunityFilters } from './opportunities/hooks/useOpportunityFilters';
import { OpportunityTabs } from './opportunities/components/OpportunityTabs';
import { authUserToUser } from '@/utils/userUtils';

export default function Opportunities() {
  const { isAuthenticated, user: authUser } = useAuth();
  const {
    opportunities,
    isLoading,
    appliedOpportunityIds,
    handleApply,
    userSkills
  } = useOpportunities();
  
  // Convert AuthUser to User type before passing to useOpportunityFilters
  const user = authUserToUser(authUser);
  
  const {
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    selectedSkills,
    setSelectedSkills,
    secondarySkills,
    setSecondarySkills,
    timeCommitment,
    setTimeCommitment,
    useProfileSkills,
    setUseProfileSkills,
    clearFilters,
    filterOpportunities
  } = useOpportunityFilters(user, userSkills);

  // Debug logs to check values
  useEffect(() => {
    console.log("Profile skills state:", useProfileSkills);
    console.log("User skills:", userSkills);
    console.log("Selected skills:", selectedSkills);
    console.log("Secondary skills:", secondarySkills);
  }, [useProfileSkills, userSkills, selectedSkills, secondarySkills]);

  const filteredOpportunities = filterOpportunities(opportunities, appliedOpportunityIds);

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-sta-purple-dark">Volunteering Opportunities</h1>
          <p className="text-muted-foreground">
            Browse and apply for volunteering opportunities that match your skills.
          </p>
        </div>
        
        <OpportunitiesFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedSkills={selectedSkills}
          onSkillsChange={setSelectedSkills}
          secondarySkills={secondarySkills}
          onSecondarySkillsChange={setSecondarySkills}
          timeCommitment={timeCommitment}
          onTimeCommitmentChange={setTimeCommitment}
          onClearFilters={clearFilters}
          useProfileSkills={useProfileSkills}
          onUseProfileSkillsChange={setUseProfileSkills}
        />
        
        <OpportunityTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          filteredOpportunities={filteredOpportunities}
          appliedOpportunityIds={appliedOpportunityIds}
          onApply={handleApply}
          isAuthenticated={isAuthenticated}
          isLoading={isLoading}
        />
      </div>
    </AppLayout>
  );
}
