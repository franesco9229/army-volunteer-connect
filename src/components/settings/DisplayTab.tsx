
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from 'lucide-react';
import { useTheme } from "@/components/ThemeProvider";

export function DisplayTab() {
  const { theme, toggleTheme } = useTheme();
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [isLargeText, setIsLargeText] = useState(false);
  
  // Apply compact mode
  useEffect(() => {
    const root = document.documentElement;
    if (isCompactMode) {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }
  }, [isCompactMode]);

  // Apply large text
  useEffect(() => {
    const root = document.documentElement;
    if (isLargeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
  }, [isLargeText]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Display Settings</CardTitle>
        <CardDescription>
          Customize how the application looks and behaves
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Appearance</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Dark Mode</h4>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark mode
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Sun className="h-5 w-5 text-muted-foreground" />
                <Switch 
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme} 
                />
                <Moon className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Compact Mode</h4>
                <p className="text-sm text-muted-foreground">
                  Display more content by reducing spacing
                </p>
              </div>
              <Switch 
                checked={isCompactMode}
                onCheckedChange={setIsCompactMode}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Large Text</h4>
                <p className="text-sm text-muted-foreground">
                  Increase text size for better readability
                </p>
              </div>
              <Switch 
                checked={isLargeText}
                onCheckedChange={setIsLargeText}
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Dashboard</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Show Statistics</h4>
                <p className="text-sm text-muted-foreground">
                  Display volunteering statistics on your dashboard
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Show Recent Activities</h4>
                <p className="text-sm text-muted-foreground">
                  Display your recent volunteering activities
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
