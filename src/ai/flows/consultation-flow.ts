
'use server';

/**
 * @fileOverview The core logic for the AI Doctor consultation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { medicalTerms } from './medical-terms';
import { googleAI } from '@genkit-ai/googleai';

// Define the structured Assessment and Plan
const DifferentialDiagnosisSchema = z.object({
  diagnosis: z.string().describe("The name of the possible condition."),
  likelihood: z.string().describe("The percentage likelihood of this diagnosis (e.g., '60% Likelihood')."),
  rationale: z.string().describe("A brief rationale for why this diagnosis is being considered."),
});

const PlanOfActionSchema = z.object({
    laboratoryTests: z.string().describe("Recommended lab tests."),
    imagingStudies: z.string().describe("Recommended imaging studies."),
    medications: z.string().describe("Recommended medications and supportive care."),
    operationsOrProcedures: z.string().describe("Recommended operations or procedures, if any."),
    followUp: z.string().describe("Follow-up instructions for the patient."),
});

const AssessmentAndPlanSchema = z.object({
    overview: z.string().describe("A clinical overview of possible causes considered."),
    differentialDiagnosis: z.array(DifferentialDiagnosisSchema).describe("A list of possible diagnoses, ranked by likelihood."),
    planOfAction: PlanOfActionSchema,
    conclusion: z.string().describe("A concluding paragraph summarizing the workup plan."),
});


// Define the structure for a single turn in the conversation
const ConsultationTurnSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
  isReferral: z.boolean().optional().describe('Set to true if this is a referral message.'),
  referralReason: z.string().optional().describe('A short, clinical reason for the referral.'),
  consultationSummary: z.string().optional().describe("A detailed summary for the patient explaining the situation and recommendation."),
  soapNote: z.object({
      subjective: z.string(),
      objective: z.string(),
      assessment: z.string(),
      plan: z.string(),
  }).optional().describe("A detailed SOAP note (Subjective, Objective, Assessment, Plan) for a physician to review."),
  assessmentAndPlan: AssessmentAndPlanSchema.optional().describe("A detailed assessment and plan for the patient view."),
  retrievalSource: z.string().optional().describe('The source of the retrieved knowledge, if any.'),
});
export type ConsultationTurn = z.infer<typeof ConsultationTurnSchema>;

// The input for the flow will be the conversation history and latest user message
const ConsultationInputSchema = z.object({
    history: z.array(ConsultationTurnSchema),
    latestUserMessage: z.string(),
    retrievedKnowledge: z.string().optional(),
});
export type ConsultationInput = z.infer<typeof ConsultationInputSchema>;

// The output will be the AI's next turn
const ConsultationOutputSchema = ConsultationTurnSchema;
export type ConsultationOutput = z.infer<typeof ConsultationOutputSchema>;


// In a real app, you would use a proper retriever like one for Firestore or a vector database.
// For this example, we'll simulate it with a simple function.
function retrieveFromEncyclopedia(query: string): string | null {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('cancer')) {
        return "Cancer is a group of diseases involving abnormal cell growth with the potential to invade or spread to other parts of the body. These contrast with benign tumors, which do not spread. Treatment options may include chemotherapy, radiation therapy, and surgery.";
    }
    if (lowerQuery.includes("alzheimer's") || lowerQuery.includes('alzheimer')) {
        return "Alzheimer's disease is a chronic neurodegenerative disease that usually starts slowly and gradually worsens over time. It is the cause of 60–70% of cases of dementia. The most common early symptom is difficulty in remembering recent events.";
    }
    return null;
}


// Define the AI prompt
const consultationPrompt = ai.definePrompt({
  name: 'consultationPrompt',
  input: { schema: ConsultationInputSchema },
  output: { schema: ConsultationOutputSchema },
  
  prompt: `You are an empathetic and professional AI Doctor. Your goal is to assess a patient's symptoms and provide basic medical advice. You must communicate in the same language as the user (English or Arabic).

  {{#if retrievedKnowledge}}
  **IMPORTANT**: Use the following information from the Gale Encyclopedia of Medicine as your primary reference for this response.
  <Knowledge>
  {{{retrievedKnowledge}}}
  </Knowledge>
  {{/if}}
  
  Conversation History:
  {{#each history}}
  - {{role}}: {{content}}
  {{/each}}
  
  Medical Terminology Reference (both English and Arabic):
  - Chest Pain: ألم في الصدر (High-Risk)
  - Shortness of Breath: ضيق في التنفس (High-Risk)
  - Headache: صداع (General)
  - Fever: حمى (General)

  Your tasks:
  1.  Analyze the user's latest message for medical symptoms using the provided terminology list.
  2.  Ask clarifying questions to understand the symptom's severity, duration, and nature. (e.g., "I understand you have a headache. Is it severe or mild? When did it start?").
  3.  **Referral Rule:** If the user mentions any "High-Risk" symptom (like 'chest pain', 'shortness of breath'), you MUST immediately end the consultation and refer them to a human doctor. 
      - Your response MUST be a new model turn with 'isReferral' set to true.
      - The 'content' field should be a simple message like: "Based on the symptoms you've described, it's important to speak with a human doctor."
      - The 'referralReason' should be a short clinical reason (e.g., "Patient reported high-risk symptom: Chest Pain").
      - The 'consultationSummary' field must contain a detailed, patient-friendly summary of the situation and why seeing a doctor is important.
      - **Crucially, you MUST generate both a detailed SOAP Note and a detailed Assessment & Plan.**
        - The \`soapNote\` field must contain a clinical SOAP note (Subjective, Objective, Assessment, Plan) for another physician to review.
        - The \`assessmentAndPlan\` field must be fully populated with a differential diagnosis, a plan of action, and a conclusion.
  4.  Provide simple, safe, evidence-based advice for non-high-risk symptoms, referencing the retrieved knowledge if available.
  5.  Maintain a caring and professional tone.
  6.  Keep your standard (non-referral) responses concise.
  7.  If you used the retrieved knowledge, set the 'retrievalSource' field in your response to 'Gale Encyclopedia of Medicine'.
  8.  Return ONLY your single new response as a model turn. Do not return the whole history.
  `,
});


// Define the main flow
export const consultationFlow = ai.defineFlow(
  {
    name: 'consultationFlow',
    inputSchema: z.array(ConsultationTurnSchema),
    outputSchema: z.array(ConsultationTurnSchema),
  },
  async (history) => {
    // If history is empty, return the initial greeting
    if (history.length === 0) {
      const initialTurn: ConsultationTurn = {
          role: 'model',
          content: "Hello, I'm your AI Doctor. How can I help you today? Please describe your symptoms.",
        };
      return [initialTurn];
    }
    
    const latestUserMessage = history[history.length - 1]?.content || '';
    
    // Simulate knowledge retrieval
    const retrievedKnowledge = retrieveFromEncyclopedia(latestUserMessage);

    // Call the prompt. The prompt itself is responsible for checking for high-risk terms and deciding to refer.
    const { output } = await consultationPrompt({
        history,
        latestUserMessage,
        retrievedKnowledge: retrievedKnowledge || undefined,
    });

    if (output) {
      // If we used knowledge, ensure the source is set in the final output
      if (retrievedKnowledge && !output.retrievalSource) {
          output.retrievalSource = 'Gale Encyclopedia of Medicine';
      }
      return [...history, output];
    }

    // Fallback if the AI fails to generate a response
    return history;
  }
);
