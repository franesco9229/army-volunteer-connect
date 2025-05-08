
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TIME_COMMITMENT_OPTIONS } from './FilterOptionsList';

interface TimeCommitmentSelectorProps {
  timeCommitment: string;
  onTimeCommitmentChange: (value: string) => void;
}

export function TimeCommitmentSelector({
  timeCommitment,
  onTimeCommitmentChange
}: TimeCommitmentSelectorProps) {
  return (
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
  );
}
