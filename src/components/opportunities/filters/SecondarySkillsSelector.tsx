
import React from 'react';
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

interface SecondarySkillsSelectorProps {
  secondarySkills: string[];
  onHandleAddSecondarySkill: (index: number, value: string) => void;
}

export function SecondarySkillsSelector({
  secondarySkills,
  onHandleAddSecondarySkill
}: SecondarySkillsSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Select 2 Additional skills:</h3>
      
      <div className="grid grid-cols-1 gap-2">
        {/* First Dropdown */}
        <Select
          value={secondarySkills[0] || "none"}
          onValueChange={(value) => onHandleAddSecondarySkill(0, value === "none" ? "" : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a skill..." />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <SelectItem value="none">None</SelectItem>
            {allSkillOptions.map(skill => (
              <SelectItem 
                key={skill.value} 
                value={skill.value}
                disabled={secondarySkills[1] === skill.value}
              >
                {skill.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Second Dropdown */}
        <Select
          value={secondarySkills[1] || "none"}
          onValueChange={(value) => onHandleAddSecondarySkill(1, value === "none" ? "" : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a skill..." />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <SelectItem value="none">None</SelectItem>
            {allSkillOptions.map(skill => (
              <SelectItem 
                key={skill.value} 
                value={skill.value}
                disabled={secondarySkills[0] === skill.value}
              >
                {skill.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
