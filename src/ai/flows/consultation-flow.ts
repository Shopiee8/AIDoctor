
'use server';

/**
 * @fileOverview The core logic for the AI Doctor consultation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { medicalTerms } from './medical-terms';

// Define the structure for a single turn in the conversation
const ConsultationTurnSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
  isReferral: z.boolean().optional().describe('Set to true if this is a referral message.'),
  referralReason: z.string().optional().describe('The reason for the referral.'),
});
export type ConsultationTurn = z.infer<typeof ConsultationTurnSchema>;

// The input for the flow will be the conversation history
const ConsultationInputSchema = z.object({
    history: z.array(ConsultationTurnSchema),
    terms: z.array(z.any()),
    retrievedKnowledge: z.string().optional().describe("Relevant information retrieved from the medical encyclopedia."),
});
export type ConsultationInput = z.infer<typeof ConsultationInputSchema>;

// The output will be the AI's next turn
const ConsultationOutputSchema = ConsultationTurnSchema;
export type ConsultationOutput = z.infer<typeof ConsultationOutputSchema>;

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
  {{#each terms}}
  - {{english}}: {{arabic}} ({{category}})
  {{/each}}

  Your tasks:
  1.  Analyze the user's latest message for medical symptoms using the provided terminology list.
  2.  Ask clarifying questions to understand the symptom's severity, duration, and nature. (e.g., "I understand you have a headache. Is it severe or mild? When did it start?").
  3.  **Referral Rule:** If the user mentions any "High-Risk" symptom (like 'chest pain', 'shortness of breath', 'severe headache', 'loss of consciousness'), you MUST immediately refer them to a human doctor. Your response must be ONLY a new model turn with the 'isReferral' flag set to true, and a 'referralReason'. The content should be something like: "Based on the symptoms you've described, it's important to speak with a human doctor immediately. I am connecting you now."
  4.  Provide simple, safe, evidence-based advice for non-high-risk symptoms, referencing the provided knowledge if available.
  5.  Maintain a caring and professional tone.
  6.  Keep your responses concise.
  7.  Return ONLY your single new response as a model turn. Do not return the whole history.
  `,
});

// Simulated function to search the encyclopedia.
// In a real implementation, this would involve vector search on your documents.
async function retrieveFromEncyclopedia(query: string): Promise<string | null> {
    console.log(`Searching encyclopedia for: ${query}`);
    // This is a simulation. If the user mentions "cancer", we return a mock article.
    if (query.toLowerCase().includes('cancer')) {
        return "Gale Encyclopedia of Medicine, on Cancer: Cancer is a group of diseases involving abnormal cell growth with the potential to invade or spread to other parts of the body. Treatment options often include chemotherapy, radiation therapy, and surgery. Early detection is key.";
    }
    if (query.toLowerCase().includes('alzheimer')) {
        return "Gale Encyclopedia of Medicine, on Alzheimer's: Alzheimer's is a progressive disease that destroys memory and other important mental functions. It is the most common cause of dementia. There is no cure, but medications and management strategies may temporarily improve symptoms.";
    }
    return null; // No relevant information found
}


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

    // *** RAG Step ***
    // 1. Retrieve knowledge from the encyclopedia based on the user's message.
    const retrievedKnowledge = await retrieveFromEncyclopedia(latestUserMessage);

    // 2. Augment the prompt with the retrieved knowledge.
    const { output } = await consultationPrompt({
        history,
        terms: medicalTerms,
        retrievedKnowledge: retrievedKnowledge || undefined, // Pass knowledge to the prompt
    });

    if (output) {
      return [...history, output];
    }

    // Fallback if the AI fails to generate a response
    return history;
  }
);
