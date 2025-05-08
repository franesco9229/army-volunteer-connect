
import { useState, useCallback, useEffect } from 'react';
import { Opportunity, OpportunityStatus, User, Skill } from '@/types';
import { techRoles } from '@/data/techRoles';
import { additionalSkills } from '@/data/additionalSkills';

// Combine tech roles and additional skills
const allSkillOptions = [...techRoles, ...additionalSkills];

export function useOpportunityFilters(currentUser: User | null = null, userSkills: Skill[] = []) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter states
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [secondarySkills, setSecondarySkills] = useState<string[]>([]);
  const [timeCommitment, setTimeCommitment] = useState<string>("any");
  const [useProfileSkills, setUseProfileSkills] = useState<boolean>(false);

  // Auto-apply user skills if useProfileSkills is true
  useEffect(() => {
    console.log("useProfileSkills changed:", useProfileSkills);
    console.log("userSkills:", userSkills);
    
    if (useProfileSkills && userSkills?.length) {
      console.log("Applying profile skills to filters");
      
      // Map user skills to tech roles
      const matchedSkills = userSkills
        .map(skill => {
          // Find matching tech role or additional skill by name (case insensitive)
          const matchedSkill = allSkillOptions.find(option => 
            option.label.toLowerCase() === skill.name.toLowerCase()
          );
          return matchedSkill?.value;
        })
        .filter(Boolean) as string[];
      
      console.log("Matched skills:", matchedSkills);
      
      // Take up to 2 skills for primary
      setSelectedSkills(matchedSkills.slice(0, 2));
      
      // Take any remaining skills for secondary (up to 2)
      if (matchedSkills.length > 2) {
        setSecondarySkills(matchedSkills.slice(2, 4));
      }
    } else if (!useProfileSkills) {
      // When turning off profile skills, clear the filter selections
      setSelectedSkills([]);
      setSecondarySkills([]);
    }
  }, [useProfileSkills, userSkills]);

  // Function to toggle useProfileSkills state
  const toggleUseProfileSkills = (checked: boolean) => {
    console.log("Toggling useProfileSkills to:", checked);
    setUseProfileSkills(checked);
  };

  const clearFilters = useCallback(() => {
    setSelectedSkills([]);
    setSecondarySkills([]);
    setTimeCommitment("any");
    setUseProfileSkills(false);
  }, []);

  // Find role label for displaying in filter badges
  const getSkillLabel = useCallback((value: string) => {
    const skill = allSkillOptions.find(skill => skill.value === value);
    return skill ? skill.label : value;
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
          const skillLabel = getSkillLabel(skill);
          return opp.requiredSkills.some(oppSkill => 
            oppSkill.toLowerCase().includes(skillLabel.toLowerCase())
          );
        });
      
      // Secondary Skills filter
      const matchesSecondarySkills = secondarySkills.length === 0 || 
        secondarySkills.some(skill => {
          const skillLabel = getSkillLabel(skill);
          return opp.requiredSkills.some(oppSkill => 
            oppSkill.toLowerCase().includes(skillLabel.toLowerCase())
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
  }, [searchTerm, selectedSkills, secondarySkills, timeCommitment, activeTab, getSkillLabel]);

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
    useProfileSkills,
    setUseProfileSkills: toggleUseProfileSkills,
    clearFilters,
    filterOpportunities,
    getSkillLabel
  };
}
