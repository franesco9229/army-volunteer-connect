
import { useState, useCallback, useEffect } from 'react';
import { Opportunity, OpportunityStatus, User } from '@/types';
import { techRoles } from '@/data/techRoles';

export function useOpportunityFilters(currentUser: User | null = null) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter states
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [secondarySkills, setSecondarySkills] = useState<string[]>([]);
  const [timeCommitment, setTimeCommitment] = useState<string>("any");

  // Auto-apply user skills if available
  useEffect(() => {
    if (currentUser?.skills?.length) {
      // Map user skills to tech roles
      const matchedSkills = currentUser.skills
        .map(skill => {
          // Find matching tech role by name (case insensitive)
          const matchedRole = techRoles.find(role => 
            role.label.toLowerCase() === skill.name.toLowerCase()
          );
          return matchedRole?.value;
        })
        .filter(Boolean) as string[];
      
      // Take up to 2 skills
      setSelectedSkills(matchedSkills.slice(0, 2));
    }
  }, [currentUser]);

  const clearFilters = useCallback(() => {
    setSelectedSkills([]);
    setSecondarySkills([]);
    setTimeCommitment("any");
  }, []);

  // Find role label for displaying in filter badges
  const getRoleLabel = useCallback((value: string) => {
    const role = techRoles.find(role => role.value === value);
    return role ? role.label : value;
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
      
      // Primary Skills filter
      const matchesPrimarySkills = selectedSkills.length === 0 || 
        selectedSkills.some(skill => {
          const roleLabel = getRoleLabel(skill);
          return opp.requiredSkills.some(oppSkill => 
            oppSkill.toLowerCase().includes(roleLabel.toLowerCase())
          );
        });
      
      // Secondary Skills filter
      const matchesSecondarySkills = secondarySkills.length === 0 || 
        secondarySkills.some(skill => {
          const roleLabel = getRoleLabel(skill);
          return opp.requiredSkills.some(oppSkill => 
            oppSkill.toLowerCase().includes(roleLabel.toLowerCase())
          );
        });
        
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
      if (activeTab === 'all') return matchesSearch && matchesPrimarySkills && matchesSecondarySkills && matchesTimeCommitment;
      if (activeTab === 'open') return matchesSearch && matchesPrimarySkills && matchesSecondarySkills && matchesTimeCommitment && opp.status === OpportunityStatus.Open;
      if (activeTab === 'applied') {
        return matchesSearch && matchesPrimarySkills && matchesSecondarySkills && matchesTimeCommitment && appliedOpportunityIds.includes(opp.id);
      }
      return false;
    });
  }, [searchTerm, selectedSkills, secondarySkills, timeCommitment, activeTab, getRoleLabel]);

  return {
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
    clearFilters,
    filterOpportunities,
    getRoleLabel
  };
}
