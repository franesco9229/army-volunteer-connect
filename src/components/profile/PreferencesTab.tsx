
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Star, Clock, Calendar } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface Preferences {
  wantToMentor: boolean;
  wantToBeMentored: boolean;
  hoursPerWeek: number;
  availability: {
    [key: string]: boolean;
  };
}

interface PreferencesTabProps {
  initialPreferences: Preferences;
}

export function PreferencesTab({ initialPreferences }: PreferencesTabProps) {
  const [preferences, setPreferences] = useState<Preferences>(initialPreferences);

  const handlePreferenceChange = (name: string, value: boolean | number) => {
    setPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvailabilityChange = (day: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: value
      }
    }));
  };

  const handleSavePreferences = () => {
    toast.success("Preferences saved successfully");
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-6">Your Volunteering Preferences</h3>
        
        {/* Mentoring Section */}
        <div className="space-y-6 mb-8">
          <h4 className="text-lg font-medium flex items-center">
            <Star className="h-5 w-5 mr-2 text-sta-purple" />
            Mentoring Preferences
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="want-to-mentor" 
                checked={preferences.wantToMentor}
                onCheckedChange={(checked) => 
                  handlePreferenceChange('wantToMentor', checked === true)
                }
              />
              <label 
                htmlFor="want-to-mentor" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I want to mentor others
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="want-to-be-mentored" 
                checked={preferences.wantToBeMentored}
                onCheckedChange={(checked) => 
                  handlePreferenceChange('wantToBeMentored', checked === true)
                }
              />
              <label 
                htmlFor="want-to-be-mentored" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I want to be mentored
              </label>
            </div>
          </div>
        </div>
        
        {/* Hours Per Week */}
        <div className="space-y-6 mb-8">
          <h4 className="text-lg font-medium flex items-center">
            <Clock className="h-5 w-5 mr-2 text-sta-purple" />
            Volunteer Hours
          </h4>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">Hours available per week</span>
              <span className="font-medium">{preferences.hoursPerWeek} hours</span>
            </div>
            
            <Slider 
              value={[preferences.hoursPerWeek]} 
              min={1} 
              max={20} 
              step={1}
              onValueChange={(values) => handlePreferenceChange('hoursPerWeek', values[0])} 
            />
          </div>
        </div>
        
        {/* Availability */}
        <div className="space-y-6">
          <h4 className="text-lg font-medium flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-sta-purple" />
            Weekly Availability
          </h4>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Object.entries(preferences.availability).map(([day, isAvailable]) => (
              <div key={day} className="flex items-center space-x-2">
                <Checkbox 
                  id={`day-${day}`} 
                  checked={isAvailable}
                  onCheckedChange={(checked) => 
                    handleAvailabilityChange(day, checked === true)
                  }
                />
                <label 
                  htmlFor={`day-${day}`} 
                  className="text-sm font-medium leading-none capitalize peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {day}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <Button 
          className="mt-8 bg-sta-purple hover:bg-sta-purple-dark"
          onClick={handleSavePreferences}
        >
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
}
