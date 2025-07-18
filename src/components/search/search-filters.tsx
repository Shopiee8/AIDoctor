
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, SlidersHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const specialists = [
    { id: "urology", label: "Urology" },
    { id: "neurology", label: "Neurology" },
    { id: "dentist", label: "Dentist" },
    { id: "orthopedic", label: "Orthopedic" },
    { id: "cardiologist", label: "Cardiologist" },
];

export function SearchFilters() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleSearch = () => {
    // In a real application, this would trigger the search with the selected filters.
    console.log("Searching with filters...");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
            <SlidersHorizontal className="w-5 h-5" />
            Search Filter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label>Appointment Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold">Gender</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
                <Checkbox id="male-doctor" />
                <Label htmlFor="male-doctor" className="font-normal">Male Doctor</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox id="female-doctor" />
                <Label htmlFor="female-doctor" className="font-normal">Female Doctor</Label>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold">Select Specialist</h4>
           <div className="space-y-2">
            {specialists.map((specialist) => (
                <div key={specialist.id} className="flex items-center space-x-2">
                    <Checkbox id={specialist.id} />
                    <Label htmlFor={specialist.id} className="font-normal">{specialist.label}</Label>
                </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSearch} className="w-full">Search</Button>
      </CardFooter>
    </Card>
  );
};
