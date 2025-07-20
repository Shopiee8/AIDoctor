
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import { SlidersHorizontal, Search, Star, ChevronDown, AlertTriangle, Clock, Languages, DollarSign } from 'lucide-react';

const specialists = [
    { id: "urology", label: "Urology", count: 21 },
    { id: "neurology", label: "Neurology", count: 18 },
    { id: "dentist", label: "Dentist", count: 15 },
    { id: "orthopedic", label: "Orthopedic", count: 12 },
    { id: "cardiologist", label: "Cardiologist", count: 10 },
    { id: "pulmonology", label: "Pulmonology", count: 8 },
];
const moreSpecialists = [
    { id: "ent", label: "ENT", count: 5 },
    { id: "dermatology", label: "Dermatology", count: 9 },
];
const consultationTypes = [
    { id: "video", label: "Video Call" },
    { id: "audio", label: "Audio Call" },
    { id: "chat", label: "Chat" },
    { id: "in-person", label: "In-Person" },
];
const availabilityOptions = [
    { id: "today", label: "Available Today" },
    { id: "tomorrow", label: "Available Tomorrow" },
    { id: "next-7-days", label: "In Next 7 Days" },
];
const urgencyLevels = [
    { id: "low", label: "Low - Routine Checkup", icon: Clock },
    { id: "medium", label: "Medium - Non-urgent", icon: AlertTriangle },
    { id: "high", label: "High - Urgent Care", icon: AlertTriangle },
];
const languages = [
    { id: "english", label: "English" },
    { id: "spanish", label: "Spanish" },
    { id: "french", label: "French" },
    { id: "german", label: "German" },
    { id: "chinese", label: "Chinese" },
    { id: "arabic", label: "Arabic" },
    { id: "hindi", label: "Hindi" },
];

export function SearchFilters() {
  const [priceRange, setPriceRange] = useState([20, 500]);
  const [symptoms, setSymptoms] = useState('');
  const [urgency, setUrgency] = useState('medium');
  const [preferredLanguage, setPreferredLanguage] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedConsultationTypes, setSelectedConsultationTypes] = useState<string[]>([]);

  const handleSearch = () => {
    // Build search parameters for AI matching
    const searchParams = new URLSearchParams();
    
    if (symptoms) searchParams.set('symptoms', symptoms);
    if (urgency) searchParams.set('urgency', urgency);
    if (preferredLanguage) searchParams.set('language', preferredLanguage);
    if (priceRange[1] < 1000) searchParams.set('budget', priceRange[1].toString());
    if (selectedConsultationTypes.length > 0) searchParams.set('type', selectedConsultationTypes[0]);
    if (selectedSpecialties.length > 0) searchParams.set('specialty', selectedSpecialties[0]);
    
    // In a real app, this would update the URL and trigger search
    console.log("Searching with AI matching parameters:", searchParams.toString());
  };

  const handleSpecialtyChange = (specialtyId: string, checked: boolean) => {
    if (checked) {
      setSelectedSpecialties(prev => [...prev, specialtyId]);
    } else {
      setSelectedSpecialties(prev => prev.filter(id => id !== specialtyId));
    }
  };

  const handleConsultationTypeChange = (typeId: string, checked: boolean) => {
    if (checked) {
      setSelectedConsultationTypes(prev => [...prev, typeId]);
    } else {
      setSelectedConsultationTypes(prev => prev.filter(id => id !== typeId));
    }
  };

  return (
    <Card>
      <CardHeader className='pb-2'>
        <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
                <SlidersHorizontal className="w-5 h-5" />
                AI-Powered Filters
            </CardTitle>
            <Button variant="link" className="p-0 h-auto">Clear All</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3']} className="w-full">
            
            <AccordionItem value="item-1">
                <AccordionTrigger className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Symptoms & Urgency
                </AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="symptoms">Describe your symptoms</Label>
                            <Textarea 
                                id="symptoms"
                                placeholder="e.g., chest pain, headache, fever, joint pain..."
                                value={symptoms}
                                onChange={(e) => setSymptoms(e.target.value)}
                                className="mt-1"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                This helps our AI match you with the most relevant specialists
                            </p>
                        </div>
                        
                        <div>
                            <Label>Urgency Level</Label>
                            <div className="space-y-2 mt-2">
                                {urgencyLevels.map((level) => (
                                    <div key={level.id} className="flex items-center space-x-2">
                                        <Checkbox 
                                            id={`urgency-${level.id}`}
                                            checked={urgency === level.id}
                                            onCheckedChange={(checked) => checked && setUrgency(level.id)}
                                        />
                                        <Label htmlFor={`urgency-${level.id}`} className="font-normal flex items-center gap-2">
                                            <level.icon className="w-4 h-4" />
                                            {level.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
                <AccordionTrigger>Specialties</AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-2">
                         {specialists.map((item) => (
                            <div key={item.id} className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Checkbox 
                                        id={`spec-${item.id}`}
                                        checked={selectedSpecialties.includes(item.id)}
                                        onCheckedChange={(checked) => handleSpecialtyChange(item.id, !!checked)}
                                    />
                                    <Label htmlFor={`spec-${item.id}`} className="font-normal">{item.label}</Label>
                                </div>
                                <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-sm">{item.count}</span>
                            </div>
                        ))}
                        
                        <Collapsible>
                            <CollapsibleContent className="space-y-2">
                               {moreSpecialists.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox 
                                                id={`spec-${item.id}`}
                                                checked={selectedSpecialties.includes(item.id)}
                                                onCheckedChange={(checked) => handleSpecialtyChange(item.id, !!checked)}
                                            />
                                            <Label htmlFor={`spec-${item.id}`} className="font-normal">{item.label}</Label>
                                        </div>
                                        <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-sm">{item.count}</span>
                                    </div>
                                ))}
                            </CollapsibleContent>
                            <CollapsibleTrigger asChild>
                                <Button variant="link" className="p-0 h-auto text-sm text-primary">
                                    View More <ChevronDown className="w-4 h-4 ml-1" />
                                </Button>
                            </CollapsibleTrigger>
                        </Collapsible>
                    </div>
                </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
                <AccordionTrigger>Consultation Type</AccordionTrigger>
                <AccordionContent>
                     <div className="space-y-2">
                         {consultationTypes.map((item) => (
                            <div key={item.id} className="flex items-center space-x-2">
                                <Checkbox 
                                    id={`type-${item.id}`}
                                    checked={selectedConsultationTypes.includes(item.id)}
                                    onCheckedChange={(checked) => handleConsultationTypeChange(item.id, !!checked)}
                                />
                                <Label htmlFor={`type-${item.id}`} className="font-normal">{item.label}</Label>
                            </div>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
                <AccordionTrigger className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Pricing
                </AccordionTrigger>
                <AccordionContent>
                   <div className="p-2">
                    <Slider
                        defaultValue={[20, 500]}
                        max={1000}
                        step={10}
                        onValueChange={(value) => setPriceRange(value)}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                    </div>
                   </div>
                </AccordionContent>
            </AccordionItem>
             
            <AccordionItem value="item-5">
                <AccordionTrigger>Availability</AccordionTrigger>
                <AccordionContent>
                     <div className="space-y-2">
                         {availabilityOptions.map((item) => (
                            <div key={item.id} className="flex items-center space-x-2">
                                <Checkbox id={`avail-${item.id}`} />
                                <Label htmlFor={`avail-${item.id}`} className="font-normal">{item.label}</Label>
                            </div>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
                <AccordionTrigger className="flex items-center gap-2">
                    <Languages className="w-4 h-4" />
                    Language Preference
                </AccordionTrigger>
                <AccordionContent>
                    <div>
                        <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select preferred language" />
                            </SelectTrigger>
                            <SelectContent>
                                {languages.map((lang) => (
                                    <SelectItem key={lang.id} value={lang.id}>
                                        {lang.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
                <AccordionTrigger>Rating</AccordionTrigger>
                <AccordionContent>
                   <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center space-x-2">
                                <Checkbox id={`rating-${rating}`} />
                                <Label htmlFor={`rating-${rating}`} className="font-normal flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                    ))}
                                </Label>
                            </div>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSearch} className="w-full">
            <Search className="w-4 h-4 mr-2" />
            Find AI-Matched Doctors
        </Button>
      </CardFooter>
    </Card>
  );
}
