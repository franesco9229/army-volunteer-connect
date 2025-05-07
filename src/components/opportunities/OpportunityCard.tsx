
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Opportunity } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SkillBadge } from '@/components/ui/SkillBadge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Clock, Building, Calendar, Briefcase, Play, Video } from 'lucide-react';
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
    role,
    video
  } = opportunity;

  const [isPlaying, setIsPlaying] = useState(false);
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

  const handleVideoToggle = () => {
    setIsPlaying(!isPlaying);
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
        {video && (
          <div className="mb-4">
            <div className="relative rounded-md overflow-hidden border border-sta-purple/10">
              <AspectRatio ratio={16/9} className="bg-muted">
                {isPlaying ? (
                  <video 
                    src={video.url} 
                    controls 
                    autoPlay 
                    className="w-full h-full object-cover"
                    onEnded={() => setIsPlaying(false)}
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <img 
                      src={video.thumbnail || video.url} 
                      alt={video.title || "Opportunity video"} 
                      className="w-full h-full object-cover"
                    />
                    <div 
                      className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer hover:bg-black/40 transition-colors"
                      onClick={handleVideoToggle}
                    >
                      <Button 
                        size="icon" 
                        className="bg-sta-purple hover:bg-sta-purple/90 text-white rounded-full w-12 h-12"
                        onClick={handleVideoToggle}
                      >
                        <Play className="w-6 h-6" />
                      </Button>
                    </div>
                  </div>
                )}
              </AspectRatio>
              {!isPlaying && video.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-sm flex items-center">
                  <Video className="w-4 h-4 mr-2" />
                  {video.title}
                </div>
              )}
            </div>
          </div>
        )}

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
