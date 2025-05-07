
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skill } from '@/types';

interface ProfileStatsProps {
  totalVolunteerHours: number;
  skillsCount: number;
}

export function ProfileStats({ totalVolunteerHours, skillsCount }: ProfileStatsProps) {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h3 className="font-medium mb-4">Volunteer Stats</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Total Hours</p>
            <p className="text-2xl font-bold">{totalVolunteerHours}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Skills</p>
            <p className="text-2xl font-bold">{skillsCount}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Member Since</p>
            <p className="text-2xl font-bold">April 2025</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
