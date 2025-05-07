
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ProfilePrivacyOptionProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const ProfilePrivacyOption = ({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: ProfilePrivacyOptionProps) => {
  return (
    <div className="flex items-start justify-between space-x-4">
      <div className="space-y-0.5">
        <Label htmlFor={id} className="font-medium">{label}</Label>
        {description && (
          <div className="text-sm text-muted-foreground">{description}</div>
        )}
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
};
