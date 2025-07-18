
'use server';

/**
 * @fileOverview An AI Scribe agent for generating clinical notes from conversations.
 * 
 * - scribe - A function that converts a conversation transcript into a SOAP note.
 * - ScribeInput - The input type for the scribe function.
 * - ScribeOutput - The return type for the scribe function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Define the input schema for the scribe flow
const ScribeInputSchema = z.object({
  conversation: z.string().describe('The full transcript of the conversation between a doctor and a patient.'),
});
export type ScribeInput = z.infer<typeof ScribeInputSchema>;

// Define the output schema for the SOAP note
const ScribeOutputSchema = z.object({
  subjective: z.string().describe("The patient's subjective complaints, including their main symptoms, history of the present illness, and any relevant personal or family medical history mentioned."),
  objective: z.string().describe("The doctor's objective findings from any physical examinations, lab results, or other diagnostic data mentioned in the conversation."),
  assessment: z.string().describe("The doctor's diagnosis or assessment of the patient's condition based on the subjective and objective information."),
  plan: z.string().describe("The treatment plan, including any prescriptions, lifestyle changes, recommended follow-ups, or further tests."),
});
export type ScribeOutput = z.infer<typeof ScribeOutputSchema>;


// Define the exported function that clients will call
export async function scribe(input: ScribeInput): Promise<ScribeOutput> {
  return scribeFlow(input);
}


// Define the main AI prompt for the scribe
const scribePrompt = ai.definePrompt({
  name: 'scribePrompt',
  input: { schema: ScribeInputSchema },
  output: { schema: ScribeOutputSchema },
  prompt: `You are an expert AI medical scribe. Your task is to analyze the following conversation transcript between a clinician and a patient and generate a structured, accurate clinical note in the SOAP format.

  Transcript:
  {{{conversation}}}
  
  Please extract the relevant information and structure it into the four SOAP categories:
  - Subjective: What the patient says about the problem.
  - Objective: The doctor's observations and examination findings.
  - Assessment: The diagnosis or differential diagnosis.
  - Plan: What the healthcare provider will do to treat the patient's concerns.

  Ensure the output is concise, clinically accurate, and written in professional medical language.
  `,
});


// Define the Genkit flow
const scribeFlow = ai.defineFlow(
  {
    name: 'scribeFlow',
    inputSchema: ScribeInputSchema,
    outputSchema: ScribeOutputSchema,
  },
  async (input) => {
    const { output } = await scribePrompt(input);
    
    if (!output) {
      throw new Error("Failed to generate a valid SOAP note from the conversation.");
    }
    
    return output;
  }
);
