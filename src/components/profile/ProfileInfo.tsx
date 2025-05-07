
import React from 'react';

interface ProfileInfoProps {
  name: string;
  email: string;
  bio: string;
  preferences: {
    wantToMentor: boolean;
    wantToBeMentored: boolean;
    hoursPerWeek: number;
    availability: {
      [key: string]: boolean;
    }
  };
}

export function ProfileInfo({ name, email, bio, preferences }: ProfileInfoProps) {
  return (
    <div className="space-y-5 text-center md:text-left">
      <div>
        <h2 className="text-2xl font-bold">{name}</h2>
        <div className="flex items-center justify-center md:justify-start mt-1 text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          <span>{email}</span>
        </div>
      </div>
      
      {/* Bio Section */}
      <div>
        <h3 className="font-medium text-sm text-muted-foreground mb-1">About Me</h3>
        <p className="text-sm">{bio}</p>
      </div>
      
      {/* Mentoring Preferences */}
      <div>
        <h3 className="font-medium text-sm text-muted-foreground mb-1">Mentoring</h3>
        <div className="flex flex-wrap gap-2">
          {preferences.wantToMentor && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              Available to mentor
            </span>
          )}
          {preferences.wantToBeMentored && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              Looking for mentorship
            </span>
          )}
          {!preferences.wantToMentor && !preferences.wantToBeMentored && (
            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              No mentoring preferences set
            </span>
          )}
        </div>
      </div>
      
      {/* Availability */}
      <div>
        <h3 className="font-medium text-sm text-muted-foreground mb-1">Availability</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(preferences.availability)
            .filter(([_, isAvailable]) => isAvailable)
            .map(([day]) => (
              <span key={day} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded capitalize">
                {day}s
              </span>
            ))}
          <span className="text-sm text-muted-foreground">
            ({preferences.hoursPerWeek} hrs/week)
          </span>
        </div>
      </div>
    </div>
  );
}
