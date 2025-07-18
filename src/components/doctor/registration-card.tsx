
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { Label } from '../ui/label';

interface RegistrationItem {
  id: number;
  registration: string;
  year: string;
}

const initialRegistrations: RegistrationItem[] = [
    { id: 1, registration: 'GMC-1234567', year: '2015' },
    { id: 2, registration: 'DEA-AB1234567', year: '2016' },
];

export function RegistrationCard() {
    const [items, setItems] = useState<RegistrationItem[]>(initialRegistrations);

    const addItem = () => {
        const newItem: RegistrationItem = {
            id: Math.random(),
            registration: '',
            year: '',
        };
        setItems([...items, newItem]);
    };

    const removeItem = (id: number) => {
        setItems(items.filter(item => item.id !== id));
    };

    const handleItemChange = (id: number, field: keyof RegistrationItem, value: any) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Registrations</CardTitle>
                    <CardDescription>Manage your professional registrations.</CardDescription>
                </div>
                <Button onClick={addItem}><Plus className="mr-2 h-4 w-4" /> Add Registration</Button>
            </CardHeader>
            <CardContent className="space-y-4">
                 {items.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor={`registration-${item.id}`}>Registration Number / ID</Label>
                                <Input id={`registration-${item.id}`} value={item.registration} onChange={(e) => handleItemChange(item.id, 'registration', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor={`year-${item.id}`}>Year of Registration</Label>
                                <Input id={`year-${item.id}`} value={item.year} onChange={(e) => handleItemChange(item.id, 'year', e.target.value)} />
                            </div>
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
