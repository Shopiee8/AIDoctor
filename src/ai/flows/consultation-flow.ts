
'use server';

/**
 * @fileOverview The core logic for the AI Doctor consultation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { medicalTerms } from './medical-terms';
import {retriever} from '@genkit-ai/googleai/rag';

// Define the structure for a single turn in the conversation
const ConsultationTurnSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
  isReferral: z.boolean().optional().describe('Set to true if this is a referral message.'),
  referralReason: z.string().optional().describe('The reason for the referral.'),
  retrievalSource: z.string().optional().describe('The source of the retrieved knowledge, if any.'),
});
export type ConsultationTurn = z.infer<typeof ConsultationTurnSchema>;

// The input for the flow will be the conversation history and latest user message
const ConsultationInputSchema = z.object({
    history: z.array(ConsultationTurnSchema),
    latestUserMessage: z.string(),
});
export type ConsultationInput = z.infer<typeof ConsultationInputSchema>;

// The output will be the AI's next turn
const ConsultationOutputSchema = ConsultationTurnSchema;
export type ConsultationOutput = z.infer<typeof ConsultationOutputSchema>;


// Define a retriever that points to the RAG extension you would create in Firebase.
// The name 'aidoctor-medical-retriever' should match the name you give the index in the console.
const medicalBookRetriever = retriever({
  name: 'googleai/aidoctor-medical-retriever'
});

// Define the AI prompt
const consultationPrompt = ai.definePrompt({
  name: 'consultationPrompt',
  input: { schema: ConsultationInputSchema },
  output: { schema: ConsultationOutputSchema },

  // Add the retriever to the prompt configuration.
  // The `{{retrieve}}` helper in the prompt will automatically use this.
  retrievers: [medicalBookRetriever],
  
  prompt: `You are an empathetic and professional AI Doctor. Your goal is to assess a patient's symptoms and provide basic medical advice. You must communicate in the same language as the user (English or Arabic).

  **IMPORTANT**: Use the following information from the Gale Encyclopedia of Medicine as your primary reference for this response.
  <Knowledge>
  {{{retrieve "dialog"}}}
  </Knowledge>
  
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
  3.  **Referral Rule:** If the user mentions any "High-Risk" symptom (like 'chest pain', 'shortness of breath'), you MUST immediately refer them to a human doctor. Your response must be ONLY a new model turn with the 'isReferral' flag set to true, and a 'referralReason'. The content should be something like: "Based on the symptoms you've described, it's important to speak with a human doctor immediately. I am connecting you now."
  4.  Provide simple, safe, evidence-based advice for non-high-risk symptoms, referencing the retrieved knowledge.
  5.  Maintain a caring and professional tone.
  6.  Keep your responses concise.
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

    // Check for high-risk terms in the latest user message
    const highRiskTerms = medicalTerms.filter(t => t.category === 'High-Risk');

    for (const term of highRiskTerms) {
        if (latestUserMessage.toLowerCase().includes(term.english.toLowerCase()) || latestUserMessage.toLowerCase().includes(term.arabic)) {
            const referralTurn: ConsultationTurn = {
                role: 'model',
                content: `Symptoms like '${term.english}' can be serious. It is important to speak with a human doctor for a full evaluation. I will connect you now.`,
                isReferral: true,
                referralReason: `Patient reported high-risk symptom: ${term.english}. Immediate referral required.`,
            };
            return [...history, referralTurn];
        }
    }

    // Call the prompt. The retriever will automatically be invoked.
    const { output } = await consultationPrompt({
        history,
        latestUserMessage,
    });

    if (output) {
      return [...history, output];
    }

    // Fallback if the AI fails to generate a response
    return history;
  }
);
