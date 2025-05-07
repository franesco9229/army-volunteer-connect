
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ProfilePrivacyOptionProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function ProfilePrivacyOption({
  id,
  label,
  description,
  checked,
  onCheckedChange
}: ProfilePrivacyOptionProps) {
  return (
    <div className="flex items-start space-x-2 mt-1">
      <Checkbox 
        id={id} 
        checked={checked} 
        onCheckedChange={onCheckedChange}
        className="mt-1" 
      />
      <div>
        <Label 
          htmlFor={id}
          className="font-normal"
        >
          {label}
        </Label>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}
