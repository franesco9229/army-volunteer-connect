
import React from 'react';
import { SkillLevel } from '@/types';
import { Slider } from '@/components/ui/slider';

interface SkillLevelSelectorProps {
  skillName: string;
  currentLevel: SkillLevel;
  onChange: (level: SkillLevel) => void;
}

export function SkillLevelSelector({ 
  skillName, 
  currentLevel, 
  onChange 
}: SkillLevelSelectorProps) {
  // Convert skill level to number for slider
  const skillLevels = [
    SkillLevel.None,
    SkillLevel.Learning,
    SkillLevel.Competent,
    SkillLevel.Advanced,
    SkillLevel.Expert,
    SkillLevel.Teacher
  ];
  
  const currentIndex = skillLevels.indexOf(currentLevel);
  
  const handleSliderChange = (value: number[]) => {
    const newLevel = skillLevels[value[0]];
    onChange(newLevel);
  };
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label className="text-sm font-medium">{skillName}</label>
        <span className="text-sm font-medium text-sta-purple">{currentLevel}</span>
      </div>
      <Slider
        value={[currentIndex]}
        min={0}
        max={skillLevels.length - 1}
        step={1}
        onValueChange={handleSliderChange}
        className="py-4"
      />
    </div>
  );
}
