
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { useProfileSkillsLabel } from './FilterOptionsList';

interface UseProfileSkillsCheckboxProps {
  useProfileSkills: boolean;
  onUseProfileSkillsChange: (checked: boolean) => void;
}

export function UseProfileSkillsCheckbox({
  useProfileSkills,
  onUseProfileSkillsChange
}: UseProfileSkillsCheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id="useProfileSkills" 
        checked={useProfileSkills} 
        onCheckedChange={(checked) => onUseProfileSkillsChange(checked as boolean)}
      />
      <label 
        htmlFor="useProfileSkills" 
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {useProfileSkillsLabel}
      </label>
    </div>
  );
}
