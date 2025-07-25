
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
  conversation: z.string().describe('The full transcript of the conversation between a clinician and a patient.'),
});
export type ScribeInput = z.infer<typeof ScribeInputSchema>;

// Define the output schema for the SOAP note
const ScribeOutputSchema = z.object({
  subjective: z.string().describe("The patient's subjective complaints, including their main symptoms, history of the present illness, and any relevant personal or family medical history mentioned. This should be a direct summary of what the patient reported."),
  objective: z.string().describe("The clinician's objective findings from any physical examinations, lab results, or other diagnostic data mentioned in the conversation. If no objective data is mentioned, state 'No objective findings were mentioned in the transcript.'"),
  assessment: z.string().describe("The clinician's differential diagnosis or final assessment of the patient's condition based on the subjective and objective information. This section synthesizes the information into a clinical conclusion."),
  plan: z.string().describe("The treatment plan, including any prescriptions, lifestyle changes, recommended follow-ups, or further tests. This should outline the next steps for the patient's care."),
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
  - Subjective: Capture what the patient says about the problem. This includes the chief complaint, history of present illness, and relevant past medical, social, or family history. Quote the patient where appropriate but keep it concise.
  - Objective: Detail the clinician's observations, physical exam findings, lab results, and any other measurable data mentioned. If none are explicitly stated, write 'No objective findings were mentioned in the transcript.'
  - Assessment: Provide the diagnosis or differential diagnoses. This is the clinician's professional judgment based on the gathered information.
  - Plan: Outline the treatment plan. This includes prescriptions (medication, dose, frequency), recommended tests, referrals, patient education, and follow-up instructions.

  Ensure the output is clinically precise, well-organized, and uses professional medical language suitable for an electronic health record (EHR).
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
