
import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { techRoles } from '@/data/techRoles';
import { additionalSkills } from '@/data/additionalSkills';

// Combine tech roles and additional skills
const allSkillOptions = [...techRoles, ...additionalSkills];

interface SkillsFilterSectionProps {
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
  title?: string;
}

export function SkillsFilterSection({
  selectedSkills,
  onSkillsChange,
  title = "Skills"
}: SkillsFilterSectionProps) {
  const handleAddSkill = (value: string) => {
    if (value && !selectedSkills.includes(value) && selectedSkills.length < 2) {
      onSkillsChange([...selectedSkills, value]);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onSkillsChange(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  // Find the role labels for display
  const getSkillLabel = (value: string) => {
    const skill = allSkillOptions.find(skill => skill.value === value);
    return skill ? skill.label : value;
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">{title} (max 2)</h3>
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedSkills.map(skill => (
          <Badge 
            key={skill} 
            variant="secondary"
            className="flex items-center gap-1"
          >
            {getSkillLabel(skill)}
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => handleRemoveSkill(skill)} 
            />
          </Badge>
        ))}
      </div>
      <div className="space-y-2">
        {selectedSkills.length < 2 && (
          <Select
            onValueChange={handleAddSkill}
            value=""
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a skill..." />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {allSkillOptions.map(skill => (
                <SelectItem 
                  key={skill.value} 
                  value={skill.value}
                  disabled={selectedSkills.includes(skill.value)}
                >
                  {skill.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {selectedSkills.length >= 2 && (
          <p className="text-xs text-muted-foreground">Maximum of 2 skills reached</p>
        )}
      </div>
    </div>
  );
}
