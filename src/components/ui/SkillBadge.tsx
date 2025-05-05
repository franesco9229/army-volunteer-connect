
import React from 'react';
import { SkillLevel } from '@/types';
import { cn } from '@/lib/utils';

interface SkillBadgeProps {
  name: string;
  level?: SkillLevel;
  className?: string;
}

export function SkillBadge({ name, level, className }: SkillBadgeProps) {
  // If no level, just display the skill name
  if (!level) {
    return (
      <span className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        "bg-sta-light text-sta-purple-darker",
        className
      )}>
        {name}
      </span>
    );
  }
  
  // If level is provided, add colors based on level
  let bgColor = "bg-sta-light";
  
  if (level === SkillLevel.Expert || level === SkillLevel.Teacher) {
    bgColor = "bg-sta-purple text-white";
  } else if (level === SkillLevel.Advanced) {
    bgColor = "bg-sta-purple-dark text-white";
  } else if (level === SkillLevel.Competent) {
    bgColor = "bg-sta-purple-darker text-white";
  } else if (level === SkillLevel.Learning) {
    bgColor = "bg-sta-light text-sta-purple-darker";
  } else {
    bgColor = "bg-gray-200 text-gray-700";
  }
  
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      bgColor,
      className
    )}>
      {name} {level && <span className="ml-1 opacity-75">• {level}</span>}
    </span>
  );
}
