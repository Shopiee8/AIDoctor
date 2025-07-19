
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { X as XIcon } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

interface InfoItem {
    id: string;
    value: string;
    year?: string;
    description?: string;
}

interface InfoCardProps {
    title: string;
    placeholder: string;
    field: string; // e.g. 'services', 'specialization', etc.
    userId: string;
    hasExtraFields?: boolean;
}

// Helper to recursively remove undefined values from an object or array
function removeUndefined(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined);
  } else if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, removeUndefined(v)])
    );
  }
  return obj;
}

export function InfoCard({ title, placeholder, field, userId, hasExtraFields = false }: InfoCardProps) {
    const [items, setItems] = useState<InfoItem[]>([]);
    const [inputValue, setInputValue] = useState('');

    // Fetch from Firestore on mount and listen for changes
    useEffect(() => {
        if (!userId) return;
        const docRef = doc(db, 'doctors', userId);
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const arr = docSnap.data()[field] || [];
                setItems(arr.map((item: any, idx: number) => ({
                    id: item.id || `${field}-${idx}-${Math.random()}`,
                    value: item.value || item,
                    year: item.year,
                    description: item.description,
                })));
            }
        });
        return () => unsubscribe();
    }, [userId, field]);

    // Update Firestore
    const updateFirestore = async (newItems: InfoItem[]) => {
        if (!userId) return;
        const docRef = doc(db, 'doctors', userId);
        // Clean newItems before saving
        const cleanedItems = removeUndefined(newItems);
        await setDoc(docRef, { [field]: cleanedItems }, { merge: true });
        window.dispatchEvent(new Event('doctor-profile-updated'));
    };

    const addItem = () => {
        if (inputValue.trim()) {
            const newItem: InfoItem = {
                id: `${field}-${Date.now()}-${Math.random()}`,
                value: inputValue.trim(),
            };
            if (hasExtraFields) {
                newItem.year = new Date().getFullYear().toString();
                newItem.description = '';
            }
            const newItems = [...items, newItem];
            setItems(newItems);
            setInputValue('');
            updateFirestore(newItems);
        }
    };

    const removeItem = (idToRemove: string) => {
        const newItems = items.filter(item => item.id !== idToRemove);
        setItems(newItems);
        updateFirestore(newItems);
    };

    const handleItemChange = (id: string, fieldKey: keyof InfoItem, value: any) => {
        const newItems = items.map(item => item.id === id ? { ...item, [fieldKey]: value } : item);
        setItems(newItems);
        updateFirestore(newItems);
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
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addItem(); } }}
                    />
                    <Button onClick={addItem}>Add</Button>
                </div>
            </CardContent>
        </Card>
    );
}
