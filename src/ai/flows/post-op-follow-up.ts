'use server';
/**
 * @fileOverview Implements an AI agent named 'Julia' for post-operative check-in calls.
 *
 * - postOpFollowUp - A function that initiates post-operative check-in calls.
 * - PostOpFollowUpInput - The input type for the postOpFollowUp function.
 * - PostOpFollowUpOutput - The return type for the postOpFollowUp function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PostOpFollowUpInputSchema = z.object({
  patientName: z.string().describe('The name of the patient.'),
  surgeryType: z.string().describe('The type of surgery the patient underwent.'),
  daysSinceSurgery: z
    .number()
    .describe('The number of days since the surgery.'),
  painLevel: z.string().describe('The patient reported pain level.'),
  nauseaLevel: z.string().describe('The patient reported nausea level.'),
  recoveryProgress: z
    .string()
    .describe('The patient reported recovery progress.'),
});
export type PostOpFollowUpInput = z.infer<typeof PostOpFollowUpInputSchema>;

const PostOpFollowUpOutputSchema = z.object({
  summary: z
    .string()
    .describe('A summary of the post-operative check-in call.'),
  nextSteps: z.string().describe('Recommended next steps for the patient.'),
  concerns: z.string().describe('Any concerns identified during the check-in.'),
});
export type PostOpFollowUpOutput = z.infer<typeof PostOpFollowUpOutputSchema>;

export async function postOpFollowUp(
  input: PostOpFollowUpInput
): Promise<PostOpFollowUpOutput> {
  return postOpFollowUpFlow(input);
}

const prompt = ai.definePrompt({
  name: 'postOpFollowUpPrompt',
  input: {schema: PostOpFollowUpInputSchema},
  output: {schema: PostOpFollowUpOutputSchema},
  prompt: `You are Julia, an AI agent conducting a post-operative check-in call.
  Your goal is to inquire about the patient's pain, nausea, and recovery progress.
  Based on the information, provide a summary of the call, recommended next steps, and any concerns identified.

  Patient Name: {{{patientName}}}
  Surgery Type: {{{surgeryType}}}
  Days Since Surgery: {{{daysSinceSurgery}}}
  Pain Level: {{{painLevel}}}
  Nausea Level: {{{nauseaLevel}}}
  Recovery Progress: {{{recoveryProgress}}}

  Respond in a professional and caring tone.
  Make sure to set summary, nextSteps, and concerns appropriately.`,
});

const postOpFollowUpFlow = ai.defineFlow(
  {
    name: 'postOpFollowUpFlow',
    inputSchema: PostOpFollowUpInputSchema,
    outputSchema: PostOpFollowUpOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
