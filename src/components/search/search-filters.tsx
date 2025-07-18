
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import { SlidersHorizontal, Search, Star, ChevronDown } from 'lucide-react';

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


export function SearchFilters() {
  const [priceRange, setPriceRange] = useState([20, 500]);

  const handleSearch = () => {
    // In a real application, this would trigger the search with the selected filters.
    console.log("Searching with filters...");
  };

  return (
    <Card>
      <CardHeader className='pb-2'>
        <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
                <SlidersHorizontal className="w-5 h-5" />
                Filters
            </CardTitle>
            <Button variant="link" className="p-0 h-auto">Clear All</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={['item-1', 'item-2']} className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>Specialties</AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-2">
                         {specialists.map((item) => (
                            <div key={item.id} className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id={`spec-${item.id}`} />
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
                                            <Checkbox id={`spec-${item.id}`} />
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
            <AccordionItem value="item-2">
                <AccordionTrigger>Consultation Type</AccordionTrigger>
                <AccordionContent>
                     <div className="space-y-2">
                         {consultationTypes.map((item) => (
                            <div key={item.id} className="flex items-center space-x-2">
                                <Checkbox id={`type-${item.id}`} />
                                <Label htmlFor={`type-${item.id}`} className="font-normal">{item.label}</Label>
                            </div>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>Pricing</AccordionTrigger>
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
             <AccordionItem value="item-4">
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
            <AccordionItem value="item-5">
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
            Apply Filters
        </Button>
      </CardFooter>
    </Card>
  );
};
