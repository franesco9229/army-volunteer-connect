
import React from 'react';
import { Skill } from '@/types';
import { SkillBadge } from '@/components/ui/SkillBadge';

interface ProfileSkillsDisplayProps {
  skills: Skill[];
}

export function ProfileSkillsDisplay({ skills }: ProfileSkillsDisplayProps) {
  return (
    <div className="text-center md:text-left w-full">
      <h3 className="font-medium text-sm text-muted-foreground mb-2">My Skills</h3>
      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
        {skills.slice(0, 5).map((skill) => (
          <SkillBadge 
            key={skill.id} 
            name={skill.name} 
            level={skill.level} 
          />
        ))}
        {skills.length > 5 && (
          <span className="text-sm text-muted-foreground">
            +{skills.length - 5} more
          </span>
        )}
      </div>
    </div>
  );
}
