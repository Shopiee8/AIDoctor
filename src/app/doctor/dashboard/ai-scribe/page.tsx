
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Calendar,
  UserPlus,
  Trash2,
  Languages,
  Zap,
  Mic,
  Undo,
  Redo,
  Copy,
  ChevronDown,
  Sparkles,
  Wand2,
  FileText,
  FileJson,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { scribe, ScribeOutput } from '@/ai/flows/scribe-flow';
import toast from 'react-hot-toast';

const sampleTranscript = `Doctor: Good morning, Alex. What brings you in today?

Patient: Good morning, Dr. Evans. I've been having this persistent, dull headache for about a week now. It's mostly on the right side of my head.

Doctor: I see. On a scale of 1 to 10, how would you rate the pain?

Patient: It's usually around a 3 or 4. It's not debilitating, but it's constant and annoying. It seems to get a bit worse in the afternoon.

Doctor: Have you noticed any other symptoms? Any nausea, sensitivity to light or sound, or changes in your vision?

Patient: No nausea or vision changes. I do feel a bit more sensitive to bright lights than usual, but not extremely so.

Doctor: Okay. Any recent changes in your diet, sleep patterns, or stress levels?

Patient: Well, work has been incredibly stressful lately. We have a major project deadline, and I've been pulling some late nights, so my sleep schedule is definitely off. I've probably been drinking more coffee than usual, too.

Doctor: That's very helpful information. I'm going to do a quick neurological exam. Can you follow my finger with your eyes?

(Doctor performs exam)

Doctor: Everything looks normal there. Based on what you've told me, it sounds like you're experiencing tension headaches, likely exacerbated by stress and lack of sleep. The caffeine probably isn't helping either.

Patient: That makes sense. What should I do?

Doctor: I recommend we start with some lifestyle adjustments. Try to regulate your sleep schedule, even on weekends. Cut back on the caffeine, and I want you to try some relaxation techniques like deep breathing or meditation for at least 10 minutes a day. Over-the-counter pain relievers like ibuprofen or acetaminophen should help with the immediate pain. If it's not better in two weeks, or if it gets worse, I want you to come back, and we can discuss other options.

Patient: Okay, I can do that. Thank you, Doctor.`;


export default function AiScribePage() {
  const [patientName, setPatientName] = useState('Alldeales Ades');
  const [transcript, setTranscript] = useState(sampleTranscript);
  const [note, setNote] = useState<ScribeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateNote = async () => {
    setIsLoading(true);
    setError('');
    setNote(null);
    toast.loading('Generating SOAP note...');
    try {
      const result = await scribe({ conversation: transcript });
      setNote(result);
      toast.success('Note generated successfully!');
    } catch (err) {
      setError('Something went wrong while generating your note. Please try again.');
      toast.error('Failed to generate note.');
      console.error(err);
    } finally {
      toast.dismiss();
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (note) {
      const noteText = `
Subjective:
${note.subjective}

Objective:
${note.objective}

Assessment:
${note.assessment}

Plan:
${note.plan}
      `;
      navigator.clipboard.writeText(noteText.trim());
      toast.success('Note copied to clipboard!');
    }
  };


  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
        {/* Header */}
        <div className="flex-shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
                 <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-muted-foreground"/>
                        {patientName || 'Add patient details'}
                    </h1>
                     <Button variant="ghost" size="icon" className="h-6 w-6"><Trash2 className="w-4 h-4 text-muted-foreground" /></Button>
                 </div>
                 <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4"/> <span>23/12/2024 06:36am</span></div>
                    <div className="flex items-center gap-1.5"><Languages className="w-4 h-4"/> <span>English</span></div>
                    <Button variant="secondary" size="sm" className="h-7"><Zap className="w-4 h-4 mr-1.5"/> Try Heidi Pro for free</Button>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline"><Mic className="w-4 h-4 mr-2"/> Resume</Button>
                <Button onClick={handleGenerateNote} disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
                    Create
                </Button>
            </div>
        </div>

        {/* Main Content */}
        <Card className="flex-grow flex flex-col min-h-0">
            <Tabs defaultValue="note" className="flex-grow flex flex-col">
                <div className="px-4 pt-4 border-b">
                    <TabsList>
                        <TabsTrigger value="transcript">Transcript</TabsTrigger>
                        <TabsTrigger value="note">Note</TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="transcript" className="flex-grow p-4">
                    <Textarea 
                        className="h-full w-full resize-none text-sm" 
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        placeholder="Paste or type the conversation transcript here..."
                    />
                </TabsContent>
                <TabsContent value="note" className="flex-grow flex flex-col bg-muted/20 p-4">
                    <div className="flex-shrink-0 flex items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm"><FileText className="w-4 h-4 mr-2"/> SOAP</Button>
                            <Button variant="ghost" size="sm"><FileJson className="w-4 h-4 mr-2"/> Goldilocks</Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Undo className="w-4 h-4"/></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Redo className="w-4 h-4"/></Button>
                            <Button variant="outline" size="sm" onClick={handleCopyToClipboard} disabled={!note}><Copy className="w-4 h-4 mr-2"/> Copy</Button>
                        </div>
                    </div>
                    
                    <div className="flex-grow bg-background border rounded-md p-6 overflow-y-auto">
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                                <p className="font-semibold">Generating note...</p>
                                <p className="text-sm">This may take a few moments.</p>
                            </div>
                        )}
                        {error && !isLoading && (
                             <div className="flex flex-col items-center justify-center h-full text-center text-red-600">
                                <AlertTriangle className="w-12 h-12 mb-4" />
                                <h3 className="font-bold text-lg">Note couldn't be generated</h3>
                                <p className="text-sm">{error}</p>
                            </div>
                        )}
                        {note && !isLoading && (
                            <div className="prose prose-sm max-w-none">
                                <h3 className="font-bold">Subjective</h3>
                                <p>{note.subjective}</p>
                                <h3 className="font-bold">Objective</h3>
                                <p>{note.objective}</p>
                                <h3 className="font-bold">Assessment</h3>
                                <p>{note.assessment}</p>
                                <h3 className="font-bold">Plan</h3>
                                <p>{note.plan}</p>
                            </div>
                        )}
                         {!isLoading && !error && !note && (
                            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                                <FileText className="w-12 h-12 mb-4" />
                                <h3 className="font-bold text-lg">Your generated note will appear here</h3>
                                <p className="text-sm">Enter a transcript and click "Create" to start.</p>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </Card>
        
        {/* Footer */}
        <div className="flex-shrink-0 mt-4">
             <div className="relative">
                <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                <Input placeholder="Ask Heidi to do anything..." className="pl-10 pr-20 h-12" />
                <Button className="absolute right-2 top-1/2 -translate-y-1/2">Send</Button>
            </div>
            <div className="text-center text-xs text-muted-foreground mt-2">
                Review your note before use to ensure it accurately represents the visit.
            </div>
        </div>
    </div>
  );
}
