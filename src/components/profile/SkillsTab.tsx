
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SkillLevelSelector } from '@/components/ui/SkillLevelSelector';
import { SkillBadge } from '@/components/ui/SkillBadge';
import { Plus } from 'lucide-react';
import { Skill, SkillLevel } from '@/types';

interface SkillsTabProps {
  skills: Skill[];
  onSkillUpdate: (skillId: string, level: SkillLevel) => Promise<void>;
  onAddSkill: (skillName: string) => void;
}

export function SkillsTab({ skills, onSkillUpdate, onAddSkill }: SkillsTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      onAddSkill(newSkill.trim());
      setNewSkill('');
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Your Skills</h3>
          <Button 
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Done' : 'Edit Skills'}
          </Button>
        </div>
        
        <div className="space-y-6">
          {isEditing ? (
            // Edit mode
            <div className="space-y-6">
              {/* Add new skill input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add a new skill..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleAddSkill} className="bg-sta-purple hover:bg-sta-purple-dark">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              {skills.map((skill) => (
                <SkillLevelSelector
                  key={skill.id}
                  skillName={skill.name}
                  currentLevel={skill.level}
                  onChange={(level) => onSkillUpdate(skill.id, level)}
                />
              ))}
            </div>
          ) : (
            // View mode
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map((skill) => (
                <div key={skill.id} className="flex justify-between items-center p-3 border rounded-md">
                  <span className="font-medium">{skill.name}</span>
                  <SkillBadge name="" level={skill.level} />
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
