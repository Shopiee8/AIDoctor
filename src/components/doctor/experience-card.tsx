
'use client';

import { ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, CalendarIcon, Image as ImageIcon } from 'lucide-react';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Checkbox } from '../ui/checkbox';
import { isValid, parseISO } from 'date-fns';

export interface ExperienceItem {
  id: number;
  hospital: string;
  title: string;
  yearOfExperience: string;
  location: string;
  employmentType: string;
  jobDescription: string;
  startDate?: Date;
  endDate?: Date;
  currentlyWorking: boolean;
  logoFile?: File | null;
  logoPreview?: string | null;
}

const employmentTypes = [
  'Full Time',
  'Part Time',
  'Contract',
  'Internship',
  'Temporary',
  'Other',
];

interface ExperienceCardProps {
  items: ExperienceItem[];
  onChange: (items: ExperienceItem[]) => void;
}

export function ExperienceCard({ items, onChange }: ExperienceCardProps) {
  const addItem = () => {
    const newItem: ExperienceItem = {
      id: Math.random(),
      hospital: '',
      title: '',
      yearOfExperience: '',
      location: '',
      employmentType: '',
      jobDescription: '',
      startDate: undefined,
      endDate: undefined,
      currentlyWorking: false,
      logoFile: null,
      logoPreview: null,
    };
    onChange([...items, newItem]);
  };

  const removeItem = (id: number) => {
    onChange(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id: number, field: keyof ExperienceItem, value: any) => {
    // If setting currentlyWorking to true, set all others to false
    if (field === 'currentlyWorking' && value === true) {
      onChange(items.map(item => item.id === id ? { ...item, currentlyWorking: true } : { ...item, currentlyWorking: false }));
    } else {
      onChange(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    }
  };

  const handleLogoChange = (id: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(items.map(item =>
        item.id === id ? { ...item, logoFile: file, logoPreview: reader.result as string } : item
      ));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = (id: number) => {
    onChange(items.map(item =>
      item.id === id ? { ...item, logoFile: null, logoPreview: null } : item
    ));
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
          <div key={item.id} className="p-4 border rounded-lg space-y-4 bg-muted/50">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Logo Upload */}
              <div className="grid gap-2">
                <Label>Hospital Logo / Picture</Label>
                <div className="flex items-center gap-4">
                  {item.logoPreview ? (
                    <img src={item.logoPreview} alt="Logo Preview" className="w-16 h-16 rounded object-cover border" />
                  ) : (
                    <span className="w-16 h-16 flex items-center justify-center bg-gray-100 border rounded"><ImageIcon className="w-8 h-8 text-gray-400" /></span>
                  )}
                  <label className="btn btn-sm btn-outline-primary mb-0 cursor-pointer">
                    Upload
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleLogoChange(item.id, e)} />
                  </label>
                  {item.logoPreview && (
                    <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveLogo(item.id)}>
                      Remove
                    </Button>
                  )}
                </div>
              </div>
              {/* Title */}
              <div className="grid gap-2">
                <Label htmlFor={`title-${item.id}`}>Title</Label>
                <Input id={`title-${item.id}`} value={item.title} onChange={e => handleItemChange(item.id, 'title', e.target.value)} />
              </div>
              {/* Hospital */}
              <div className="grid gap-2">
                <Label htmlFor={`hospital-${item.id}`}>Hospital <span className="text-danger">*</span></Label>
                <Input id={`hospital-${item.id}`} value={item.hospital} onChange={e => handleItemChange(item.id, 'hospital', e.target.value)} required />
              </div>
              {/* Year of Experience */}
              <div className="grid gap-2">
                <Label htmlFor={`yearOfExperience-${item.id}`}>Year of Experience <span className="text-danger">*</span></Label>
                <Input id={`yearOfExperience-${item.id}`} type="number" min={0} value={item.yearOfExperience} onChange={e => handleItemChange(item.id, 'yearOfExperience', e.target.value)} required />
              </div>
              {/* Location */}
              <div className="grid gap-2">
                <Label htmlFor={`location-${item.id}`}>Location</Label>
                <Input id={`location-${item.id}`} value={item.location} onChange={e => handleItemChange(item.id, 'location', e.target.value)} />
              </div>
              {/* Employment Type */}
              <div className="grid gap-2">
                <Label htmlFor={`employmentType-${item.id}`}>Employment Type</Label>
                <select
                  id={`employmentType-${item.id}`}
                  className="form-control rounded border px-2 py-2"
                  value={item.employmentType}
                  onChange={e => handleItemChange(item.id, 'employmentType', e.target.value)}
                >
                  <option value="">Select Type</option>
                  {employmentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              {/* Job Description */}
              <div className="md:col-span-2 grid gap-2">
                <Label htmlFor={`jobDescription-${item.id}`}>Job Description <span className="text-danger">*</span></Label>
                <Textarea id={`jobDescription-${item.id}`} value={item.jobDescription} onChange={e => handleItemChange(item.id, 'jobDescription', e.target.value)} required rows={3} />
              </div>
              {/* Start Date */}
              <div className="grid gap-2">
                <Label>Start Date <span className="text-danger">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {item.startDate && isValid(new Date(item.startDate)) ? format(new Date(item.startDate), 'dd/MM/yyyy') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={item.startDate} onSelect={date => handleItemChange(item.id, 'startDate', date)} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              {/* End Date */}
              <div className="grid gap-2">
                <Label>End Date <span className="text-danger">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal" disabled={item.currentlyWorking}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {item.endDate && isValid(new Date(item.endDate)) ? format(new Date(item.endDate), 'dd/MM/yyyy') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={item.endDate} onSelect={date => handleItemChange(item.id, 'endDate', date)} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              {/* Currently Working Here */}
              <div className="flex items-center space-x-2 md:col-span-2">
                <Checkbox
                  id={`current-${item.id}`}
                  checked={item.currentlyWorking}
                  onCheckedChange={checked => handleItemChange(item.id, 'currentlyWorking', checked)}
                />
                <Label htmlFor={`current-${item.id}`}>I currently work here</Label>
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
