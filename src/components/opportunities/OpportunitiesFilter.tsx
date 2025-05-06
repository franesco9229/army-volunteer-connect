
import React, { useState } from 'react';
import { Search, Filter, X, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface OpportunitiesFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
  timeCommitment: string;
  onTimeCommitmentChange: (value: string) => void;
  roleType: string;
  onRoleTypeChange: (value: string) => void;
  onClearFilters: () => void;
  skillInputValue: string;
  onSkillInputChange: (value: string) => void;
  onAddSkill: () => void;
}

// Predefined options
const TIME_COMMITMENT_OPTIONS = [
  { label: "Any Time", value: "any" },
  { label: "Less than 5 hours/week", value: "under5" },
  { label: "5-10 hours/week", value: "5to10" },
  { label: "10-20 hours/week", value: "10to20" },
  { label: "20+ hours/week", value: "over20" }
];

const ROLE_TYPE_OPTIONS = [
  { label: "Any Role", value: "any" },
  { label: "Developer", value: "developer" },
  { label: "Designer", value: "designer" },
  { label: "Project Manager", value: "project-manager" },
  { label: "Business Analyst", value: "business-analyst" },
  { label: "Marketing", value: "marketing" },
  { label: "Content Creator", value: "content-creator" }
];

export function OpportunitiesFilter({
  searchTerm,
  onSearchChange,
  selectedSkills,
  onSkillsChange,
  timeCommitment,
  onTimeCommitmentChange,
  roleType,
  onRoleTypeChange,
  onClearFilters,
  skillInputValue,
  onSkillInputChange,
  onAddSkill
}: OpportunitiesFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const handleRemoveSkill = (skillToRemove: string) => {
    onSkillsChange(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInputValue.trim() && selectedSkills.length < 2) {
      e.preventDefault();
      onAddSkill();
    }
  };
  
  // Count active filters
  const activeFilterCount = 
    (selectedSkills.length > 0 ? 1 : 0) + 
    (timeCommitment !== 'any' ? 1 : 0) + 
    (roleType !== 'any' ? 1 : 0);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search opportunities..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="bg-sta-purple text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle>Filter Opportunities</SheetTitle>
            <SheetDescription>
              Refine results based on your preferences
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Skills (max 2)</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedSkills.map(skill => (
                  <Badge 
                    key={skill} 
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {skill}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleRemoveSkill(skill)} 
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Type a skill..."
                  value={skillInputValue}
                  onChange={(e) => onSkillInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={selectedSkills.length >= 2}
                />
                <Button 
                  type="button" 
                  size="sm" 
                  onClick={onAddSkill} 
                  disabled={!skillInputValue.trim() || selectedSkills.length >= 2}
                >
                  Add
                </Button>
              </div>
              {selectedSkills.length >= 2 && (
                <p className="text-xs text-muted-foreground">Maximum of 2 skills reached</p>
              )}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Role Type</h3>
              <Select 
                value={roleType} 
                onValueChange={onRoleTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role type" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_TYPE_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Time Commitment</h3>
              <Select 
                value={timeCommitment} 
                onValueChange={onTimeCommitmentChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time commitment" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_COMMITMENT_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <SheetFooter className="flex flex-row justify-between sm:justify-between gap-2">
            <Button variant="outline" onClick={onClearFilters} className="flex items-center gap-1">
              <X size={16} />
              Clear filters
            </Button>
            <SheetClose asChild>
              <Button className="bg-sta-purple hover:bg-sta-purple/90">Apply Filters</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Show active filters on mobile */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          {selectedSkills.map(skill => (
            <Badge 
              key={skill}
              variant="outline" 
              className="bg-sta-purple/10 text-sta-purple border-sta-purple/30 flex items-center gap-1"
            >
              {skill}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleRemoveSkill(skill)} 
              />
            </Badge>
          ))}

          {roleType !== 'any' && (
            <Badge 
              variant="outline" 
              className="bg-sta-purple/10 text-sta-purple border-sta-purple/30 flex items-center gap-1"
            >
              {ROLE_TYPE_OPTIONS.find(o => o.value === roleType)?.label}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onRoleTypeChange('any')} 
              />
            </Badge>
          )}

          {timeCommitment !== 'any' && (
            <Badge 
              variant="outline" 
              className="bg-sta-purple/10 text-sta-purple border-sta-purple/30 flex items-center gap-1"
            >
              {TIME_COMMITMENT_OPTIONS.find(o => o.value === timeCommitment)?.label}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onTimeCommitmentChange('any')} 
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
