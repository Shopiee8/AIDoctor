
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Clock } from 'lucide-react';

type Slot = { start: string; end: string };

const initialSlots: { [key: string]: Slot[] } = {
  Sunday: [],
  Monday: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '17:00' }],
  Tuesday: [{ start: '09:00', end: '12:00' }],
  Wednesday: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '17:00' }],
  Thursday: [{ start: '09:00', end: '17:00' }],
  Friday: [{ start: '09:00', end: '13:00' }],
  Saturday: [],
};

export default function ScheduleTimingsPage() {
  const [slots, setSlots] = useState(initialSlots);
  const [activeDay, setActiveDay] = useState('Monday');

  const addSlot = () => {
    setSlots(prev => ({
      ...prev,
      [activeDay]: [...prev[activeDay], { start: '', end: '' }],
    }));
  };

  const removeSlot = (index: number) => {
    setSlots(prev => ({
      ...prev,
      [activeDay]: prev[activeDay].filter((_, i) => i !== index),
    }));
  };

  const handleSlotChange = (index: number, field: 'start' | 'end', value: string) => {
    setSlots(prev => {
      const newDaySlots = [...prev[activeDay]];
      newDaySlots[index][field] = value;
      return { ...prev, [activeDay]: newDaySlots };
    });
  };

  return (
    <div className="space-y-6">
       <div>
            <h1 className="text-3xl font-bold font-headline">Schedule Timings</h1>
            <p className="text-muted-foreground">Set your available hours for consultations.</p>
        </div>
      <Card>
        <CardContent className="p-6">
            <Tabs value={activeDay} onValueChange={setActiveDay} className="flex flex-col md:flex-row gap-6">
                <TabsList className="flex flex-row md:flex-col h-auto md:h-full justify-start w-full md:w-1/4">
                    {Object.keys(initialSlots).map(day => (
                        <TabsTrigger key={day} value={day} className="w-full justify-start">{day}</TabsTrigger>
                    ))}
                </TabsList>
                <div className="w-full md:w-3/4">
                    {Object.keys(slots).map(day => (
                        <TabsContent key={day} value={day}>
                            <CardTitle className="mb-4 flex items-center justify-between">
                                <span>Time Slots for {day}</span>
                                <Button size="sm" onClick={addSlot}><Plus className="mr-2 h-4 w-4" /> Add Slot</Button>
                            </CardTitle>
                            <div className="space-y-4">
                                {slots[day].length > 0 ? (
                                    slots[day].map((slot, index) => (
                                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                                        <div className="grid gap-2 flex-1">
                                            <Label htmlFor={`start-${index}`}>Start Time</Label>
                                            <Input id={`start-${index}`} type="time" value={slot.start} onChange={e => handleSlotChange(index, 'start', e.target.value)} />
                                        </div>
                                        <div className="grid gap-2 flex-1">
                                            <Label htmlFor={`end-${index}`}>End Time</Label>
                                            <Input id={`end-${index}`} type="time" value={slot.end} onChange={e => handleSlotChange(index, 'end', e.target.value)} />
                                        </div>
                                        <Button variant="destructive" size="icon" onClick={() => removeSlot(index)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    ))
                                ) : (
                                    <div className="text-center text-muted-foreground py-10 border-dashed border-2 rounded-lg">
                                        <p>Not available on {day}</p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    ))}
                </div>
            </Tabs>
            <div className="mt-6 flex justify-end">
                <Button>Save Changes</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
