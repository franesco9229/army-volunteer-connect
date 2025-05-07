
import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TIME_COMMITMENT_OPTIONS, ROLE_TYPE_OPTIONS } from './FilterOptionsList';

interface ActiveFilterBadgesProps {
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
  timeCommitment: string;
  onTimeCommitmentChange: (value: string) => void;
  roleType: string;
  onRoleTypeChange: (value: string) => void;
}

export function ActiveFilterBadges({
  selectedSkills,
  onSkillsChange,
  timeCommitment,
  onTimeCommitmentChange,
  roleType,
  onRoleTypeChange
}: ActiveFilterBadgesProps) {
  const handleRemoveSkill = (skillToRemove: string) => {
    onSkillsChange(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  const activeFilterCount = 
    (selectedSkills.length > 0 ? 1 : 0) + 
    (timeCommitment !== 'any' ? 1 : 0) + 
    (roleType !== 'any' ? 1 : 0);

  if (activeFilterCount === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
      {selectedSkills.map(skill => (
        <Badge 
          key={skill}
          variant="outline" 
          className="bg-sta-purple/10 text-sta-purple border-sta-purple/30 flex items-center gap-1"
        >
          {skill}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => handleRemoveSkill(skill)} 
          />
        </Badge>
      ))}

      {roleType !== 'any' && (
        <Badge 
          variant="outline" 
          className="bg-sta-purple/10 text-sta-purple border-sta-purple/30 flex items-center gap-1"
        >
          {ROLE_TYPE_OPTIONS.find(o => o.value === roleType)?.label}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onRoleTypeChange('any')} 
          />
        </Badge>
      )}

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
