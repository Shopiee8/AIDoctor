
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface InfoCardProps {
  title: string;
  placeholder: string;
  initialItems?: string[];
  hasExtraFields?: boolean;
}

export function InfoCard({ title, placeholder, initialItems = [], hasExtraFields = false }: InfoCardProps) {
    const [items, setItems] = useState<any[]>(initialItems.map(item => ({ id: Math.random(), value: item, year: '2023', description: 'Lorem ipsum...' })));
    const [newItem, setNewItem] = useState('');

    const addItem = () => {
        if (newItem.trim()) {
            setItems([...items, { id: Math.random(), value: newItem.trim() }]);
            setNewItem('');
        }
    }
    const removeItem = (id: number) => {
        setItems(items.filter(item => item.id !== id));
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 {items.map((item, index) => (
                    <div key={item.id} className="p-4 border rounded-lg space-y-4">
                        <div className="flex items-center gap-2">
                           <Input value={item.value} className="flex-1" readOnly={!hasExtraFields} />
                           {hasExtraFields && (
                                <Input type="text" placeholder="Year" defaultValue={item.year} className="w-24"/>
                           )}
                           <Button variant="destructive" size="icon" onClick={() => removeItem(item.id)}>
                               <Trash2 className="h-4 w-4" />
                           </Button>
                        </div>
                        {hasExtraFields && (
                            <div>
                                <Label className="text-xs">Description</Label>
                                <Textarea defaultValue={item.description} className="mt-1" />
                            </div>
                        )}
                    </div>
                ))}
                <div className="flex items-center gap-2">
                    <Input placeholder={placeholder} value={newItem} onChange={(e) => setNewItem(e.target.value)} />
                    <Button onClick={addItem}><Plus className="mr-2 h-4 w-4" /> Add</Button>
                </div>
            </CardContent>
        </Card>
    );
}
