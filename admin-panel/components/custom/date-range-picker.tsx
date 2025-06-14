'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

interface DatePickerWithRangeProps {
  date: { from?: Date; to?: Date } | undefined;
  setDate: (date: { from?: Date; to?: Date } | undefined) => void;
}

export function DatePickerWithRange({ date, setDate }: DatePickerWithRangeProps) {
  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFrom = e.target.value ? new Date(e.target.value) : undefined;
    setDate({ from: newFrom, to: date?.to });
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTo = e.target.value ? new Date(e.target.value) : undefined;
    setDate({ from: date?.from, to: newTo });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label>Start Date</Label>
        <Input
          type="date"
          value={date?.from ? format(date.from, 'yyyy-MM-dd') : ''}
          onChange={handleStartChange}
        />
      </div>
      <div>
        <Label>End Date</Label>
        <Input
          type="date"
          value={date?.to ? format(date.to, 'yyyy-MM-dd') : ''}
          onChange={handleEndChange}
        />
      </div>
    </div>
  );
}
