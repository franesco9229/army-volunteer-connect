
import React from 'react';
import { SocialLink } from './SocialLinksTab';
import { Linkedin, Twitter, Github, Facebook, Instagram } from 'lucide-react';

interface SocialLinksDisplayProps {
  links: SocialLink[];
}

export function SocialLinksDisplay({ links }: SocialLinksDisplayProps) {
  const renderSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return <Linkedin className="w-5 h-5" />;
      case 'x (twitter)':
      case 'twitter':
        return <Twitter className="w-5 h-5" />;
      case 'facebook':
        return <Facebook className="w-5 h-5" />;
      case 'instagram':
        return <Instagram className="w-5 h-5" />;
      case 'github':
        return <Github className="w-5 h-5" />;
      default:
        return <Linkedin className="w-5 h-5" />;
    }
  };

  return (
    <div className="w-full">
      <h3 className="font-medium text-sm text-muted-foreground mb-2 text-center md:text-left">Connect with me</h3>
      <div className="flex flex-wrap gap-3 justify-center md:justify-start">
        {links.length > 0 ? (
          links.map((link) => (
            <a 
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-sta-purple transition-colors"
              title={link.platform}
            >
              {renderSocialIcon(link.platform)}
            </a>
          ))
        ) : (
          <span className="text-sm text-muted-foreground">No social links added</span>
        )}
      </div>
    </div>
  );
}
