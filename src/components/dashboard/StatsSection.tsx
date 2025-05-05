
import React from 'react';
import { StatCard } from '@/components/ui/StatCard';
import { Clock, Briefcase, CheckCircle, Calendar } from 'lucide-react';

interface StatsSectionProps {
  totalHours: number;
  activeProjects: number;
  completedProjects: number;
  pendingApplications: number;
}

export function StatsSection({ 
  totalHours, 
  activeProjects, 
  completedProjects, 
  pendingApplications 
}: StatsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Volunteer Hours"
        value={totalHours}
        icon={<Clock className="h-6 w-6" />}
        description="Total hours contributed"
      />
      <StatCard
        title="Active Projects"
        value={activeProjects}
        icon={<Briefcase className="h-6 w-6" />}
        description="Currently volunteering"
      />
      <StatCard
        title="Completed Projects"
        value={completedProjects}
        icon={<CheckCircle className="h-6 w-6" />}
        description="Successfully finished"
      />
      <StatCard
        title="Pending Applications"
        value={pendingApplications}
        icon={<Calendar className="h-6 w-6" />}
        description="Awaiting response"
      />
    </div>
  );
}
