
import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { ActiveFilterBadges } from './filters/ActiveFilterBadges';
import { SearchInput } from './filters/SearchInput';
import { FilterSheet } from './filters/FilterSheet';

interface OpportunitiesFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
  secondarySkills: string[];
  onSecondarySkillsChange: (skills: string[]) => void;
  timeCommitment: string;
  onTimeCommitmentChange: (value: string) => void;
  onClearFilters: () => void;
  useProfileSkills: boolean;
  onUseProfileSkillsChange: (value: boolean) => void;
}

export function OpportunitiesFilter({
  searchTerm,
  onSearchChange,
  selectedSkills,
  onSkillsChange,
  secondarySkills,
  onSecondarySkillsChange,
  timeCommitment,
  onTimeCommitmentChange,
  onClearFilters,
  useProfileSkills,
  onUseProfileSkillsChange
}: OpportunitiesFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const handleAddSecondarySkill = (index: number, value: string) => {
    if (value) {
      const newSkills = [...secondarySkills];
      
      // Remove the value if it's already in the other position
      const otherIndex = index === 0 ? 1 : 0;
      if (newSkills[otherIndex] === value) {
        newSkills[otherIndex] = "";
      }
      
      newSkills[index] = value;
      // Filter out empty strings when updating
      onSecondarySkillsChange(newSkills.filter(skill => skill !== ""));
    }
  };
  
  // Count active filters
  const activeFilterCount = 
    (selectedSkills.length > 0 ? 1 : 0) + 
    (secondarySkills.length > 0 ? 1 : 0) + 
    (timeCommitment !== 'any' ? 1 : 0) +
    (useProfileSkills ? 1 : 0);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <SearchInput searchTerm={searchTerm} onSearchChange={onSearchChange} />

      <FilterSheet
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        selectedSkills={selectedSkills}
        onSkillsChange={onSkillsChange}
        secondarySkills={secondarySkills}
        onSecondarySkillsChange={onSecondarySkillsChange}
        timeCommitment={timeCommitment}
        onTimeCommitmentChange={onTimeCommitmentChange}
        onClearFilters={onClearFilters}
        useProfileSkills={useProfileSkills}
        onUseProfileSkillsChange={onUseProfileSkillsChange}
        activeFilterCount={activeFilterCount}
        onHandleAddSecondarySkill={handleAddSecondarySkill}
      />

      <ActiveFilterBadges
        selectedSkills={selectedSkills}
        onSkillsChange={onSkillsChange}
        secondarySkills={secondarySkills}
        onSecondarySkillsChange={onSecondarySkillsChange}
        timeCommitment={timeCommitment}
        onTimeCommitmentChange={onTimeCommitmentChange}
        useProfileSkills={useProfileSkills}
        onUseProfileSkillsChange={onUseProfileSkillsChange}
      />
    </div>
  );
}
