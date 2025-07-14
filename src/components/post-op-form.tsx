"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  postOpFollowUp,
  type PostOpFollowUpOutput,
} from "@/ai/flows/post-op-follow-up";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  patientName: z.string().min(2, "Name is required."),
  surgeryType: z.string().min(3, "Surgery type is required."),
  daysSinceSurgery: z.coerce.number().min(0, "Must be a positive number."),
  painLevel: z.string({ required_error: "Please select a pain level." }),
  nauseaLevel: z.string({ required_error: "Please select a nausea level." }),
  recoveryProgress: z
    .string()
    .min(10, "Please briefly describe your recovery progress."),
});

export function PostOpForm() {
  const [result, setResult] = useState<PostOpFollowUpOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: "",
      surgeryType: "",
      daysSinceSurgery: 1,
      recoveryProgress: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const output = await postOpFollowUp(values);
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
             <Wand2 className="w-6 h-6 text-primary" />
            Post-Operative Follow-Up Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="patientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Alex Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="surgeryType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of Surgery</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Knee Replacement" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="daysSinceSurgery"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Days Since Surgery</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="painLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pain Level (0-10)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your pain level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[...Array(11)].map((_, i) => (
                           <SelectItem key={i} value={i.toString()}>{i} - {i === 0 ? "No pain" : (i < 4 ? "Mild" : (i < 7 ? "Moderate" : "Severe"))}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="nauseaLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nausea Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your nausea level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                          <SelectItem value="None">None</SelectItem>
                          <SelectItem value="Mild">Mild</SelectItem>
                          <SelectItem value="Moderate">Moderate</SelectItem>
                          <SelectItem value="Severe">Severe</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="recoveryProgress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recovery Progress</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your recovery, any issues, or improvements..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting to Julia...</>
                ) : (
                  <>Get AI Follow-Up</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="space-y-8">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Sparkles className="w-6 h-6 text-primary" />
              Julia's Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading && (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
                <span className="text-muted-foreground">AI is analyzing...</span>
              </div>
            )}
            {result ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Summary of Check-in</h3>
                  <p className="text-sm text-muted-foreground bg-secondary p-4 rounded-md">{result.summary}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Recommended Next Steps</h3>
                   <p className="text-sm text-muted-foreground bg-secondary p-4 rounded-md">{result.nextSteps}</p>
                </div>
                 <div>
                  <h3 className="font-semibold mb-2">Identified Concerns</h3>
                   <p className="text-sm text-muted-foreground bg-destructive/10 border border-destructive/20 text-destructive-foreground p-4 rounded-md">{result.concerns || "No major concerns identified."}</p>
                </div>
              </div>
            ) : !isLoading && (
              <div className="text-center text-muted-foreground p-8">
                Your post-operative assessment from our AI agent, Julia, will appear here.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
