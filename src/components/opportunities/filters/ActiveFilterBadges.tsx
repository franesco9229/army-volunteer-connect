
import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TIME_COMMITMENT_OPTIONS, useProfileSkillsLabel } from './FilterOptionsList';

interface ActiveFilterBadgesProps {
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
  secondarySkills: string[];
  onSecondarySkillsChange: (skills: string[]) => void;
  timeCommitment: string;
  onTimeCommitmentChange: (value: string) => void;
  useProfileSkills: boolean;
  onUseProfileSkillsChange: (value: boolean) => void;
}

export function ActiveFilterBadges({
  selectedSkills,
  onSkillsChange,
  secondarySkills,
  onSecondarySkillsChange,
  timeCommitment,
  onTimeCommitmentChange,
  useProfileSkills,
  onUseProfileSkillsChange
}: ActiveFilterBadgesProps) {
  const handleRemoveSkill = (skillToRemove: string, isPrimary: boolean) => {
    if (isPrimary) {
      onSkillsChange(selectedSkills.filter(skill => skill !== skillToRemove));
    } else {
      onSecondarySkillsChange(secondarySkills.filter(skill => skill !== skillToRemove));
    }
  };

  const activeFilterCount = 
    (selectedSkills.length > 0 ? 1 : 0) + 
    (secondarySkills.length > 0 ? 1 : 0) + 
    (timeCommitment !== 'any' ? 1 : 0) +
    (useProfileSkills ? 1 : 0);

  if (activeFilterCount === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
      {useProfileSkills && (
        <Badge 
          variant="outline" 
          className="bg-sta-purple/10 text-sta-purple border-sta-purple/30 flex items-center gap-1"
        >
          {useProfileSkillsLabel}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onUseProfileSkillsChange(false)} 
          />
        </Badge>
      )}

      {selectedSkills.map(skill => (
        <Badge 
          key={`primary-${skill}`}
          variant="outline" 
          className="bg-sta-purple/10 text-sta-purple border-sta-purple/30 flex items-center gap-1"
        >
          Primary: {skill}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => handleRemoveSkill(skill, true)} 
          />
        </Badge>
      ))}

      {secondarySkills.map(skill => (
        <Badge 
          key={`secondary-${skill}`}
          variant="outline" 
          className="bg-sta-purple/10 text-sta-purple border-sta-purple/30 flex items-center gap-1"
        >
          Additional: {skill}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => handleRemoveSkill(skill, false)} 
          />
        </Badge>
      ))}

      {timeCommitment !== 'any' && (
        <Badge 
          variant="outline" 
          className="bg-sta-purple/10 text-sta-purple border-sta-purple/30 flex items-center gap-1"
        >
          {TIME_COMMITMENT_OPTIONS.find(o => o.value === timeCommitment)?.label}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onTimeCommitmentChange('any')} 
          />
        </Badge>
      )}
    </div>
  );
}
