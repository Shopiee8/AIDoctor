
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

interface EducationItem {
  id: number;
  institution: string;
  course: string;
  startDate?: Date;
  endDate?: Date;
  description: string;
}

const initialEducation: EducationItem[] = [
    { id: 1, institution: 'Cambridge University', course: 'MBBS', startDate: new Date('2010-09-01'), endDate: new Date('2015-06-30'), description: 'Completed medical degree with honors.' },
    { id: 2, institution: 'Stanford University', course: 'MD - Cardiology', startDate: new Date('2016-07-01'), endDate: new Date('2019-06-30'), description: 'Fellowship in Interventional Cardiology.' },
];

export function EducationCard() {
    const [items, setItems] = useState<EducationItem[]>(initialEducation);

    const addItem = () => {
        const newItem: EducationItem = {
            id: Math.random(),
            institution: '',
            course: '',
            startDate: undefined,
            endDate: undefined,
            description: '',
        };
        setItems([...items, newItem]);
    };

    const removeItem = (id: number) => {
        setItems(items.filter(item => item.id !== id));
    };

    const handleItemChange = (id: number, field: keyof EducationItem, value: any) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Education</CardTitle>
                    <CardDescription>Manage your educational qualifications.</CardDescription>
                </div>
                <Button onClick={addItem}><Plus className="mr-2 h-4 w-4" /> Add Education</Button>
            </CardHeader>
            <CardContent className="space-y-4">
                 {items.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor={`institution-${item.id}`}>Institution</Label>
                                <Input id={`institution-${item.id}`} value={item.institution} onChange={(e) => handleItemChange(item.id, 'institution', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor={`course-${item.id}`}>Course / Degree</Label>
                                <Input id={`course-${item.id}`} value={item.course} onChange={(e) => handleItemChange(item.id, 'course', e.target.value)} />
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
                                        <Button variant="outline" className="w-full justify-start text-left font-normal">
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
                        <div className="grid gap-2">
                            <Label htmlFor={`description-${item.id}`}>Description</Label>
                            <Textarea id={`description-${item.id}`} value={item.description} onChange={(e) => handleItemChange(item.id, 'description', e.target.value)} />
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
