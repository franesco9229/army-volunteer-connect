
import React from 'react';
import { X, Filter } from 'lucide-react';
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
import { UseProfileSkillsCheckbox } from './UseProfileSkillsCheckbox';
import { SecondarySkillsSelector } from './SecondarySkillsSelector';
import { TimeCommitmentSelector } from './TimeCommitmentSelector';

interface FilterSheetProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
  secondarySkills: string[];
  onSecondarySkillsChange: (skills: string[]) => void;
  timeCommitment: string;
  onTimeCommitmentChange: (value: string) => void;
  onClearFilters: () => void;
  useProfileSkills: boolean;
  onUseProfileSkillsChange: (value: boolean) => void;
  activeFilterCount: number;
  onHandleAddSecondarySkill: (index: number, value: string) => void;
}

export function FilterSheet({
  isFilterOpen,
  setIsFilterOpen,
  selectedSkills,
  onSkillsChange,
  secondarySkills,
  onSecondarySkillsChange,
  timeCommitment,
  onTimeCommitmentChange,
  onClearFilters,
  useProfileSkills,
  onUseProfileSkillsChange,
  activeFilterCount,
  onHandleAddSecondarySkill
}: FilterSheetProps) {
  return (
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
          <UseProfileSkillsCheckbox 
            useProfileSkills={useProfileSkills}
            onUseProfileSkillsChange={onUseProfileSkillsChange}
          />
          
          <SecondarySkillsSelector 
            secondarySkills={secondarySkills}
            onHandleAddSecondarySkill={onHandleAddSecondarySkill}
          />
          
          <TimeCommitmentSelector
            timeCommitment={timeCommitment}
            onTimeCommitmentChange={onTimeCommitmentChange}
          />
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
  );
}
