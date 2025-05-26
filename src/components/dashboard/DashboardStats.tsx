
import React from 'react';
import { StatsSection } from './StatsSection';
import { VolunteeringRecord, Application, VolunteeringRecordStatus, ApplicationStatus } from '@/types';

interface DashboardStatsProps {
  totalHours: number;
  volunteeringRecords: VolunteeringRecord[];
  applications: Application[];
}

export function DashboardStats({ 
  totalHours, 
  volunteeringRecords, 
  applications 
}: DashboardStatsProps) {
  const activeProjects = volunteeringRecords.filter(
    record => record.status === VolunteeringRecordStatus.Active
  ).length;
  
  const completedProjects = volunteeringRecords.filter(
    record => record.status === VolunteeringRecordStatus.Completed
  ).length;
  
  const pendingApplications = applications.filter(
    app => app.status === ApplicationStatus.Pending
  ).length;

  return (
    <StatsSection
      totalHours={totalHours}
      activeProjects={activeProjects}
      completedProjects={completedProjects}
      pendingApplications={pendingApplications}
    />
  );
}
