
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VolunteeringRecord, Opportunity, VolunteeringRecordStatus } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Calendar, Clock } from 'lucide-react';
import { updateVolunteerHours } from '@/data/mockData';
import { toast } from '@/components/ui/sonner';

interface VolunteeringRecordCardProps {
  record: VolunteeringRecord;
  opportunity: Opportunity;
  onUpdate?: () => void;
}

export function VolunteeringRecordCard({ 
  record, 
  opportunity,
  onUpdate
}: VolunteeringRecordCardProps) {
  const { hoursContributed, startDate, endDate, status, id } = record;
  const { title, client } = opportunity;
  const [hours, setHours] = useState(hoursContributed.toString());
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateHours = async () => {
    setIsLoading(true);
    try {
      await updateVolunteerHours(id, parseFloat(hours));
      setIsEditing(false);
      if (onUpdate) onUpdate();
      toast.success("Volunteer hours updated successfully");
    } catch (error) {
      toast.error("Failed to update hours");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

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
          <span>
            Started {new Date(startDate).toLocaleDateString()}
            {endDate && ` • Ended ${new Date(endDate).toLocaleDateString()}`}
          </span>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-sta-purple" />
            <span className="text-sm font-medium">Hours Contributed:</span>
          </div>
          
          {isEditing ? (
            <div className="flex items-center mt-2">
              <Input
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-24 mr-2"
                min="0"
                step="0.5"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleUpdateHours}
                disabled={isLoading}
              >
                Save
              </Button>
            </div>
          ) : (
            <div className="flex items-center mt-2">
              <span className="text-2xl font-bold">{hoursContributed}</span>
              {status === VolunteeringRecordStatus.Active && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                  className="ml-2 text-sta-purple"
                >
                  Update
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="px-6 py-4 bg-muted/50 text-sm">
        {status === VolunteeringRecordStatus.Active ? 
          "Project in progress" : 
          `Project ${status.toLowerCase()}`
        }
      </CardFooter>
    </Card>
  );
}
