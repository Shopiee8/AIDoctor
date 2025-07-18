
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '../ui/label';

interface SocialLink {
  id: number;
  platform: 'Facebook' | 'Twitter' | 'Linkedin' | 'Instagram';
  url: string;
}

const initialLinks: SocialLink[] = [
    { id: 1, platform: 'Facebook', url: 'https://www.facebook.com/johndoe' },
    { id: 2, platform: 'Twitter', url: 'https://www.twitter.com/johndoe' },
];

const platformIcons = {
    Facebook: <Facebook className="h-5 w-5" />,
    Twitter: <Twitter className="h-5 w-5" />,
    Linkedin: <Linkedin className="h-5 w-5" />,
    Instagram: <Instagram className="h-5 w-5" />,
}

export function SocialLinksCard() {
    const [items, setItems] = useState<SocialLink[]>(initialLinks);

    const addItem = () => {
        const newItem: SocialLink = {
            id: Math.random(),
            platform: 'Facebook',
            url: '',
        };
        setItems([...items, newItem]);
    };

    const removeItem = (id: number) => {
        setItems(items.filter(item => item.id !== id));
    };

    const handleItemChange = (id: number, field: keyof SocialLink, value: any) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Social Media</CardTitle>
                    <CardDescription>Connect your social media profiles.</CardDescription>
                </div>
                <Button onClick={addItem}><Plus className="mr-2 h-4 w-4" /> Add Link</Button>
            </CardHeader>
            <CardContent className="space-y-4">
                 {items.map((item) => (
                    <div key={item.id} className="flex items-end gap-4">
                        <div className="grid gap-2 flex-1">
                            <Label htmlFor={`platform-${item.id}`}>Platform</Label>
                            <Select 
                                value={item.platform} 
                                onValueChange={(value) => handleItemChange(item.id, 'platform', value)}
                            >
                                <SelectTrigger id={`platform-${item.id}`} className="w-48">
                                    <div className="flex items-center gap-2">
                                        {platformIcons[item.platform]}
                                        <SelectValue />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(platformIcons).map(p => (
                                        <SelectItem key={p} value={p}>
                                            <div className="flex items-center gap-2">
                                                {platformIcons[p as keyof typeof platformIcons]}
                                                {p}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="grid gap-2 flex-1">
                             <Label htmlFor={`url-${item.id}`}>URL</Label>
                            <Input id={`url-${item.id}`} value={item.url} onChange={(e) => handleItemChange(item.id, 'url', e.target.value)} />
                        </div>
                        <Button variant="destructive" size="icon" onClick={() => removeItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
