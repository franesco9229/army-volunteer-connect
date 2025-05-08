
import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import { Checkbox } from '@/components/ui/checkbox';
import { SkillsFilterSection } from './filters/SkillsFilterSection';
import { ActiveFilterBadges } from './filters/ActiveFilterBadges';
import { TIME_COMMITMENT_OPTIONS, useProfileSkillsLabel } from './filters/FilterOptionsList';

interface OpportunitiesFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
  secondarySkills: string[];
  onSecondarySkillsChange: (skills: string[]) => void;
  timeCommitment: string;
  onTimeCommitmentChange: (value: string) => void;
  onClearFilters: () => void;
  useProfileSkills: boolean;
  onUseProfileSkillsChange: (value: boolean) => void;
}

export function OpportunitiesFilter({
  searchTerm,
  onSearchChange,
  selectedSkills,
  onSkillsChange,
  secondarySkills,
  onSecondarySkillsChange,
  timeCommitment,
  onTimeCommitmentChange,
  onClearFilters,
  useProfileSkills,
  onUseProfileSkillsChange
}: OpportunitiesFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Count active filters
  const activeFilterCount = 
    (selectedSkills.length > 0 ? 1 : 0) + 
    (secondarySkills.length > 0 ? 1 : 0) + 
    (timeCommitment !== 'any' ? 1 : 0) +
    (useProfileSkills ? 1 : 0);

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
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="useProfileSkills" 
                checked={useProfileSkills} 
                onCheckedChange={(checked) => onUseProfileSkillsChange(checked as boolean)}
              />
              <label 
                htmlFor="useProfileSkills" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {useProfileSkillsLabel}
              </label>
            </div>
            
            <SkillsFilterSection 
              title="Primary Skills"
              selectedSkills={selectedSkills}
              onSkillsChange={onSkillsChange}
            />
            
            <SkillsFilterSection 
              title="Secondary Skills"
              selectedSkills={secondarySkills}
              onSkillsChange={onSecondarySkillsChange}
            />
            
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
      <ActiveFilterBadges
        selectedSkills={selectedSkills}
        onSkillsChange={onSkillsChange}
        secondarySkills={secondarySkills}
        onSecondarySkillsChange={onSecondarySkillsChange}
        timeCommitment={timeCommitment}
        onTimeCommitmentChange={onTimeCommitmentChange}
        useProfileSkills={useProfileSkills}
        onUseProfileSkillsChange={onUseProfileSkillsChange}
      />
    </div>
  );
}
