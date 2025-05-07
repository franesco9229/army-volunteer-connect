
import React from 'react';
import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ProfileEditFormProps {
  name: string;
  email: string;
  bio: string;
  onSave: () => void;
  onCancel: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function ProfileEditForm({
  name,
  email,
  bio,
  onSave,
  onCancel,
  onChange
}: ProfileEditFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input 
          id="name" 
          name="name" 
          value={name} 
          onChange={onChange} 
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          name="email" 
          value={email} 
          onChange={onChange} 
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea 
          id="bio" 
          name="bio" 
          value={bio} 
          onChange={onChange} 
          className="mt-1 min-h-[100px]"
        />
      </div>
      <div className="flex gap-2 justify-center md:justify-start">
        <Button onClick={onSave} className="bg-sta-purple hover:bg-sta-purple-dark">
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
}
