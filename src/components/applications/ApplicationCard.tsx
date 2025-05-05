
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Application, ApplicationStatus, Opportunity } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Calendar } from 'lucide-react';

interface ApplicationCardProps {
  application: Application;
  opportunity: Opportunity;
}

export function ApplicationCard({ application, opportunity }: ApplicationCardProps) {
  const { status, appliedDate } = application;
  const { title, client, timeCommitment } = opportunity;

  // Get appropriate message based on status
  let statusMessage = "";
  if (status === ApplicationStatus.Pending) {
    statusMessage = "Your application is being reviewed.";
  } else if (status === ApplicationStatus.Successful) {
    statusMessage = "Congratulations! Your application was accepted.";
  } else if (status === ApplicationStatus.Unsuccessful) {
    statusMessage = "Unfortunately, your application was not selected for this opportunity.";
  }

  return (
    <Card className="card-transition">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-lg">{title}</h3>
          <StatusBadge status={status} />
        </div>
        
        <p className="text-sm text-muted-foreground mt-1">{client}</p>
        
        <div className="flex items-center mt-4 text-sm">
          <Calendar className="h-4 w-4 mr-2 text-sta-purple" />
          <span>Applied on {new Date(appliedDate).toLocaleDateString()}</span>
        </div>
        
        <p className="mt-4 text-sm">{statusMessage}</p>
      </CardContent>
      
      <CardFooter className="px-6 py-4 bg-muted/50 text-sm">
        Time commitment: {timeCommitment}
      </CardFooter>
    </Card>
  );
}
