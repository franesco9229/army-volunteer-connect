
import React from 'react';
import { 
  ApplicationStatus, 
  OpportunityStatus, 
  VolunteeringRecordStatus 
} from '@/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: ApplicationStatus | OpportunityStatus | VolunteeringRecordStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  let baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  let colorClasses = "";

  // Application Status Colors
  if (status === ApplicationStatus.Pending) {
    colorClasses = "bg-yellow-100 text-yellow-800";
  } else if (status === ApplicationStatus.Successful) {
    colorClasses = "bg-green-100 text-green-800";
  } else if (status === ApplicationStatus.Unsuccessful) {
    colorClasses = "bg-red-100 text-red-800";
  }
  
  // Opportunity Status Colors
  else if (status === OpportunityStatus.Open) {
    colorClasses = "bg-blue-100 text-blue-800";
  } else if (status === OpportunityStatus.Filled) {
    colorClasses = "bg-purple-100 text-purple-800";
  } else if (status === OpportunityStatus.Completed) {
    colorClasses = "bg-green-100 text-green-800";
  }
  
  // Volunteering Record Status Colors
  else if (status === VolunteeringRecordStatus.Active) {
    colorClasses = "bg-blue-100 text-blue-800";
  } else if (status === VolunteeringRecordStatus.Completed) {
    colorClasses = "bg-green-100 text-green-800";
  } else if (status === VolunteeringRecordStatus.Dropped) {
    colorClasses = "bg-gray-100 text-gray-800";
  }

  return (
    <span className={cn(baseClasses, colorClasses, className)}>
      {status}
    </span>
  );
}
