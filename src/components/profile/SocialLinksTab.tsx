import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Linkedin, Facebook, MessageCircle, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: React.FC<any>;
}

interface SocialLinksTabProps {
  initialLinks?: SocialLink[];
}

const platformOptions = [
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { value: 'facebook', label: 'Facebook', icon: Facebook },
  { value: 'medium', label: 'Medium', icon: MessageCircle }
];

export function SocialLinksTab({ initialLinks = [] }: SocialLinksTabProps) {
  const [links, setLinks] = useState<SocialLink[]>(initialLinks);
  const [newLink, setNewLink] = useState({ platform: 'linkedin', url: '' });

  const handleAddLink = () => {
    if (!newLink.url) {
      toast.error("Please enter a valid URL");
      return;
    }

    const platform = platformOptions.find(p => p.value === newLink.platform);
    
    if (!platform) {
      toast.error("Please select a valid platform");
      return;
    }

    const newLinkObj: SocialLink = {
      id: `link-${Date.now()}`,
      platform: platform.label,
      url: newLink.url,
      icon: platform.icon
    };

    setLinks([...links, newLinkObj]);
    setNewLink({ platform: 'linkedin', url: '' });
    toast.success("Social link added");
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
    toast.success("Social link removed");
  };

  const getPlatformIcon = (platform: string) => {
    const option = platformOptions.find(p => p.label.toLowerCase() === platform.toLowerCase());
    return option ? option.icon : Linkedin;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Links</CardTitle>
        <CardDescription>Connect your social media accounts to your profile</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-4">
            <div>
              <Label htmlFor="platform">Platform</Label>
              <select
                id="platform"
                value={newLink.platform}
                onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                className="w-full h-10 px-3 mt-1 rounded-md border border-input bg-background"
              >
                {platformOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                placeholder="https://"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddLink} className="bg-sta-purple hover:bg-sta-purple-dark">
                Add Link
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {links.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No social links added yet
            </p>
          ) : (
            links.map(link => {
              const Icon = getPlatformIcon(link.platform);
              return (
                <div 
                  key={link.id} 
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{link.platform}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline truncate max-w-[200px]"
                    >
                      {link.url}
                    </a>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteLink(link.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
