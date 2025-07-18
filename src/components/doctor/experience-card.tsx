
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, CalendarIcon } from 'lucide-react';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Checkbox } from '../ui/checkbox';

interface ExperienceItem {
  id: number;
  hospital: string;
  title: string;
  location: string;
  startDate?: Date;
  endDate?: Date;
  currentlyWorking: boolean;
}

const initialExperience: ExperienceItem[] = [
    { id: 1, hospital: 'Hill Medical Hospital', title: 'Cardiologist', location: 'Newcastle', startDate: new Date('2021-03-15'), endDate: new Date('2023-01-24'), currentlyWorking: false },
    { id: 2, hospital: 'Central City Clinic', title: 'Senior Cardiologist', location: 'Metropolis', startDate: new Date('2023-02-01'), endDate: undefined, currentlyWorking: true },
];

export function ExperienceCard() {
    const [items, setItems] = useState<ExperienceItem[]>(initialExperience);

    const addItem = () => {
        const newItem: ExperienceItem = {
            id: Math.random(),
            hospital: '',
            title: '',
            location: '',
            startDate: undefined,
            endDate: undefined,
            currentlyWorking: false,
        };
        setItems([...items, newItem]);
    };

    const removeItem = (id: number) => {
        setItems(items.filter(item => item.id !== id));
    };

    const handleItemChange = (id: number, field: keyof ExperienceItem, value: any) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Experience</CardTitle>
                    <CardDescription>Manage your professional work experience.</CardDescription>
                </div>
                <Button onClick={addItem}><Plus className="mr-2 h-4 w-4" /> Add Experience</Button>
            </CardHeader>
            <CardContent className="space-y-4">
                 {items.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor={`hospital-${item.id}`}>Hospital</Label>
                                <Input id={`hospital-${item.id}`} value={item.hospital} onChange={(e) => handleItemChange(item.id, 'hospital', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor={`title-${item.id}`}>Title</Label>
                                <Input id={`title-${item.id}`} value={item.title} onChange={(e) => handleItemChange(item.id, 'title', e.target.value)} />
                            </div>
                             <div className="grid gap-2">
                                <Label>Start Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {item.startDate ? format(item.startDate, 'PPP') : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={item.startDate} onSelect={(date) => handleItemChange(item.id, 'startDate', date)} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="grid gap-2">
                                <Label>End Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal" disabled={item.currentlyWorking}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {item.endDate ? format(item.endDate, 'PPP') : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={item.endDate} onSelect={(date) => handleItemChange(item.id, 'endDate', date)} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox 
                                id={`current-${item.id}`} 
                                checked={item.currentlyWorking} 
                                onCheckedChange={(checked) => handleItemChange(item.id, 'currentlyWorking', checked)}
                            />
                            <Label htmlFor={`current-${item.id}`}>I currently work here</Label>
                        </div>
                         <div className="text-right">
                           <Button variant="destructive" size="sm" onClick={() => removeItem(item.id)}>
                               <Trash2 className="h-4 w-4 mr-1" /> Remove
                           </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
