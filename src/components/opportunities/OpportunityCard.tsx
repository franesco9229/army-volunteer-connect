
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Opportunity } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SkillBadge } from '@/components/ui/SkillBadge';
import { Clock, Building, Calendar, Briefcase } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onApply?: (opportunityId: string) => void;
  hasApplied?: boolean;
}

export function OpportunityCard({ 
  opportunity, 
  onApply,
  hasApplied = false
}: OpportunityCardProps) {
  const { 
    id, 
    title, 
    description, 
    client, 
    requiredSkills, 
    timeCommitment, 
    projectDuration, 
    status, 
    postedDate,
    role
  } = opportunity;

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleApply = () => {
    if (!isAuthenticated) {
      // Redirect to login page with the intended destination
      navigate('/login', { state: { from: `/opportunities` } });
      return;
    }

    if (onApply) {
      onApply(id);
    }
  };

  // Show the Apply button for both "Open" and "Active" statuses
  const isApplicable = status === 'Open' || status === 'active';
  
  return (
    <Card className="card-transition h-full flex flex-col border-sta-purple/20 hover:border-sta-purple/50 shadow-sm">
      <CardHeader className="pb-2 bg-gradient-to-r from-transparent to-sta-purple/5 rounded-t-md">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl text-sta-purple-dark">{title}</CardTitle>
          <StatusBadge status={status} />
        </div>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <Building className="h-4 w-4 mr-1 text-sta-purple" />
          <span>{client}</span>
        </div>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <p className="text-sm mb-4">{description}</p>
        
        <div className="space-y-3">
          {role && (
            <div className="flex items-center text-sm">
              <Briefcase className="h-4 w-4 mr-2 text-sta-purple" />
              <span>Role: {role}</span>
            </div>
          )}
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-sta-purple" />
            <span>{timeCommitment}</span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-sta-purple" />
            <span>{projectDuration}</span>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Required Skills:</p>
          <div className="flex flex-wrap gap-2">
            {requiredSkills.map((skill) => (
              <SkillBadge key={skill} name={skill} />
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex items-center justify-between border-t border-sta-purple/10">
        <div className="text-xs text-muted-foreground">
          Posted: {new Date(postedDate).toLocaleDateString()}
        </div>
        {isApplicable && (
          <Button 
            onClick={handleApply} 
            disabled={hasApplied}
            variant={hasApplied ? "outline" : "default"}
            className={hasApplied 
              ? "border-sta-purple text-sta-purple" 
              : "bg-sta-purple hover:bg-sta-purple/90 text-white"}
          >
            {hasApplied ? 'Applied' : isAuthenticated ? 'Apply Now' : 'Login to Apply'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
