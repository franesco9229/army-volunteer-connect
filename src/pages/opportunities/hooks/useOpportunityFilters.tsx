
import { useState, useCallback } from 'react';
import { Opportunity, OpportunityStatus } from '@/types';

export function useOpportunityFilters() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter states
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [timeCommitment, setTimeCommitment] = useState<string>("any");
  const [roleType, setRoleType] = useState<string>("any");
  const [skillInputValue, setSkillInputValue] = useState('');

  const handleAddSkill = useCallback(() => {
    if (skillInputValue.trim() && selectedSkills.length < 2) {
      setSelectedSkills([...selectedSkills, skillInputValue.trim()]);
      setSkillInputValue('');
    }
  }, [skillInputValue, selectedSkills]);

  const clearFilters = useCallback(() => {
    setSelectedSkills([]);
    setTimeCommitment("any");
    setRoleType("any");
    setSkillInputValue('');
  }, []);

  // Filter opportunities based on search term, filters, and status
  const filterOpportunities = useCallback((opportunities: Opportunity[], appliedOpportunityIds: string[]) => {
    return opportunities.filter(opp => {
      // Text search filter
      const matchesSearch = 
        opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.requiredSkills.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      // Skills filter
      const matchesSkills = selectedSkills.length === 0 || 
        selectedSkills.some(skill => 
          opp.requiredSkills.some(oppSkill => 
            oppSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
        
      // Role type filter
      const matchesRole = roleType === "any" || (opp.role && opp.role.toLowerCase() === roleType.toLowerCase());
        
      // Time commitment filter
      let matchesTimeCommitment = true;
      if (timeCommitment !== "any" && opp.timeCommitment) {
        const hours = opp.timeCommitment.toLowerCase();
        
        if (timeCommitment === "under5" && hours.includes("5+")) {
          matchesTimeCommitment = false;
        } else if (timeCommitment === "5to10" && !hours.includes("5-10")) {
          matchesTimeCommitment = false;
        } else if (timeCommitment === "10to20" && !hours.includes("10-20")) {
          matchesTimeCommitment = false;
        } else if (timeCommitment === "over20" && !hours.includes("20+")) {
          matchesTimeCommitment = false;
        }
      }
      
      // Tab filters
      if (activeTab === 'all') return matchesSearch && matchesSkills && matchesRole && matchesTimeCommitment;
      if (activeTab === 'open') return matchesSearch && matchesSkills && matchesRole && matchesTimeCommitment && opp.status === OpportunityStatus.Open;
      if (activeTab === 'applied') {
        return matchesSearch && matchesSkills && matchesRole && matchesTimeCommitment && appliedOpportunityIds.includes(opp.id);
      }
      return false;
    });
  }, [searchTerm, selectedSkills, roleType, timeCommitment, activeTab]);

  return {
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    selectedSkills,
    setSelectedSkills,
    timeCommitment,
    setTimeCommitment,
    roleType,
    setRoleType,
    skillInputValue,
    setSkillInputValue,
    handleAddSkill,
    clearFilters,
    filterOpportunities
  };
}
