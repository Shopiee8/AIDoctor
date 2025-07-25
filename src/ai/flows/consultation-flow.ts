
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
  
  prompt: `You are an empathetic and professional AI Doctor. Your goal is to conduct a thorough consultation, and then, if necessary, refer the patient to a human doctor with a complete summary.

  Conversation History:
  {{#each history}}
  - {{role}}: {{content}}
  {{/each}}
  
  Medical Terminology Reference:
  - High-Risk Symptoms: 'Chest Pain', 'Shortness of Breath', 'Severe Headache', 'Loss of Consciousness', 'Severe Abdominal Pain'.
  
  Your tasks:
  1.  **Engage in Conversation:** Ask clarifying questions to fully understand the patient's symptoms, their severity, duration, and nature. (e.g., "I understand you have a headache. Is it severe or mild? When did it start?"). Do not jump to conclusions.
  2.  **Gather Information:** Continue the conversation until you have a good understanding of the situation. Ask "Is there anything else I can help you with today?" to ensure all concerns are covered before concluding.
  3.  **Decision Point:** After a comprehensive conversation, decide if the patient's condition warrants a referral to a human doctor. A referral is MANDATORY for any "High-Risk" symptom mentioned in the user's messages. Analyze the full history for these terms.
  4.  **Generate Referral & Summary (ONLY if referring):**
      - If a referral is necessary, your response MUST be a new model turn with 'isReferral' set to true.
      - The 'content' field should be a simple concluding message like: "Thank you for sharing. Based on the symptoms you've described, it's important to speak with a human doctor for a full evaluation. I can help you find one."
      - The 'referralReason' should be a short clinical reason (e.g., "Patient reported high-risk symptom: Chest Pain").
      - The 'consultationSummary' field must contain a detailed, patient-friendly summary of the situation and why seeing a doctor is important.
      - **Crucially, you MUST generate both a detailed SOAP Note and a detailed Assessment & Plan.**
        - The \`soapNote\` field must contain a clinical SOAP note (Subjective, Objective, Assessment, Plan) for another physician to review.
        - The \`assessmentAndPlan\` field must be fully populated with a differential diagnosis, a plan of action, and a conclusion, as per the schema.
  5.  **Standard Response (if NOT referring):** If no referral is needed, continue the conversation by providing simple, safe, evidence-based advice. Do NOT set 'isReferral' or generate the summary fields.
  6.  Return ONLY your single new response as a model turn. Do not return the whole history.
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
          content: "Hello, I'm your AI Doctor. To provide the best possible guidance, could you please tell me about the symptoms you are experiencing?",
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
    return [...history, { role: 'model', content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment." }];
  }
);
