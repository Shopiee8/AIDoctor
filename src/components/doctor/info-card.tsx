
'use client';

import { useState, KeyboardEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { X as XIcon } from 'lucide-react';

interface InfoItem {
    id: number;
    value: string;
    year?: string;
    description?: string;
}

interface InfoCardProps {
    title: string;
    placeholder: string;
    initialItems?: string[];
    hasExtraFields?: boolean;
}

export function InfoCard({ title, placeholder, initialItems = [], hasExtraFields = false }: InfoCardProps) {
    const [items, setItems] = useState<InfoItem[]>(initialItems.map((item, index) => ({ 
        id: Math.random(), 
        value: item, 
        year: hasExtraFields ? '2023' : undefined,
        description: hasExtraFields ? 'Lorem ipsum...' : undefined
    })));
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && inputValue.trim()) {
            event.preventDefault();
            addItem();
        }
    };

    const addItem = () => {
        if (inputValue.trim()) {
            const newItem: InfoItem = {
                id: Math.random(),
                value: inputValue.trim(),
            };
             if (hasExtraFields) {
                newItem.year = new Date().getFullYear().toString();
                newItem.description = '';
            }
            setItems([...items, newItem]);
            setInputValue('');
        }
    }

    const removeItem = (idToRemove: number) => {
        setItems(items.filter(item => item.id !== idToRemove));
    }
    
    const handleItemChange = (id: number, field: keyof InfoItem, value: any) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-3">
                    {items.map((item) => (
                        <div key={item.id} className="p-4 border rounded-lg space-y-4">
                            <div className="flex items-center gap-2">
                               <div className="flex-1">
                                    <Label>Name</Label>
                                    <Input value={item.value} onChange={(e) => handleItemChange(item.id, 'value', e.target.value)} />
                               </div>
                               {hasExtraFields && (
                                   <div className="w-28">
                                       <Label>Year</Label>
                                       <Input type="text" value={item.year} onChange={(e) => handleItemChange(item.id, 'year', e.target.value)} />
                                   </div>
                               )}
                               <div className="pt-6">
                                    <Button variant="destructive" size="icon" onClick={() => removeItem(item.id)}>
                                       <XIcon className="h-4 w-4" />
                                   </Button>
                               </div>
                            </div>
                            {hasExtraFields && (
                                <div>
                                    <Label>Description</Label>
                                    <Textarea value={item.description} onChange={(e) => handleItemChange(item.id, 'description', e.target.value)} className="mt-1" />
                                </div>
                            )}
                        </div>
                    ))}
                 </div>
                 <div className="flex items-center gap-2">
                    <Input 
                        placeholder={placeholder} 
                        value={inputValue} 
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <Button onClick={addItem}>Add</Button>
                </div>
            </CardContent>
        </Card>
    );
}
