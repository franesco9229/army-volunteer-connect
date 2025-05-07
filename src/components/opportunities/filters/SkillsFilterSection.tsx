
import React from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SkillsFilterSectionProps {
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
  skillInputValue: string;
  onSkillInputChange: (value: string) => void;
  onAddSkill: () => void;
}

export function SkillsFilterSection({
  selectedSkills,
  onSkillsChange,
  skillInputValue,
  onSkillInputChange,
  onAddSkill
}: SkillsFilterSectionProps) {
  const handleRemoveSkill = (skillToRemove: string) => {
    onSkillsChange(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInputValue.trim() && selectedSkills.length < 2) {
      e.preventDefault();
      onAddSkill();
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Skills (max 2)</h3>
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedSkills.map(skill => (
          <Badge 
            key={skill} 
            variant="secondary"
            className="flex items-center gap-1"
          >
            {skill}
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => handleRemoveSkill(skill)} 
            />
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Type a skill..."
          value={skillInputValue}
          onChange={(e) => onSkillInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={selectedSkills.length >= 2}
        />
        <Button 
          type="button" 
          size="sm" 
          onClick={onAddSkill} 
          disabled={!skillInputValue.trim() || selectedSkills.length >= 2}
        >
          Add
        </Button>
      </div>
      {selectedSkills.length >= 2 && (
        <p className="text-xs text-muted-foreground">Maximum of 2 skills reached</p>
      )}
    </div>
  );
}
