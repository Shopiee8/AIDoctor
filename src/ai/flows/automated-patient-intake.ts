'use server';

/**
 * @fileOverview An automated patient intake AI agent.
 *
 * - automatedPatientIntake - A function that handles the automated patient intake process.
 * - AutomatedPatientIntakeInput - The input type for the automatedPatientIntake function.
 * - AutomatedPatientIntakeOutput - The return type for the automatedPatientIntake function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomatedPatientIntakeInputSchema = z.object({
  patientName: z.string().describe('The name of the patient.'),
  chiefComplaint: z.string().describe('The primary reason for the patient seeking medical attention.'),
  symptoms: z.string().describe('A detailed description of the patient’s symptoms.'),
  medicalHistory: z.string().describe('The patient’s past medical history, including illnesses, surgeries, and hospitalizations.'),
  medications: z.string().describe('A list of current medications the patient is taking, including dosages.'),
  allergies: z.string().describe('A list of the patient’s allergies, including reactions.'),
});
export type AutomatedPatientIntakeInput = z.infer<typeof AutomatedPatientIntakeInputSchema>;

const AutomatedPatientIntakeOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the patient intake information.'),
  nextSteps: z.string().describe('Recommended next steps for the patient, such as scheduling an appointment or seeking immediate medical attention.'),
});
export type AutomatedPatientIntakeOutput = z.infer<typeof AutomatedPatientIntakeOutputSchema>;

export async function automatedPatientIntake(input: AutomatedPatientIntakeInput): Promise<AutomatedPatientIntakeOutput> {
  return automatedPatientIntakeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'automatedPatientIntakePrompt',
  input: {schema: AutomatedPatientIntakeInputSchema},
  output: {schema: AutomatedPatientIntakeOutputSchema},
  prompt: `You are an AI assistant designed to conduct patient intake for a medical clinic. Please collect the following information from the patient and provide a summary of their condition and recommended next steps.

Patient Name: {{{patientName}}}
Chief Complaint: {{{chiefComplaint}}}
Symptoms: {{{symptoms}}}
Medical History: {{{medicalHistory}}}
Medications: {{{medications}}}
Allergies: {{{allergies}}}

Based on this information, provide a concise summary of the patient's condition and recommend appropriate next steps.`,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const automatedPatientIntakeFlow = ai.defineFlow(
  {
    name: 'automatedPatientIntakeFlow',
    inputSchema: AutomatedPatientIntakeInputSchema,
    outputSchema: AutomatedPatientIntakeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
