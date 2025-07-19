'use server';

/**
 * @fileOverview The logic for the AI GP Doctor "Dr. Dana".
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GpTurnSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type GpTurn = z.infer<typeof GpTurnSchema>;

const GpInputSchema = z.object({
  history: z.array(GpTurnSchema),
  question: z.string(),
});

const GpOutputSchema = GpTurnSchema;

const gpPrompt = ai.definePrompt({
  name: 'gpDoctorPrompt',
  input: { schema: GpInputSchema },
  output: { schema: GpOutputSchema },
  prompt: `You are Dr. Dana, an empathetic, knowledgeable, and friendly AI General Practitioner (GP). Your goal is to provide helpful, safe, and general medical information to users.

  IMPORTANT: You are not a replacement for a human doctor. You must never provide a definitive diagnosis or prescribe medication. If the user's query is serious, urgent, or requires a diagnosis, you must advise them to consult a human doctor immediately.

  Conversation History:
  {{#each history}}
  - {{role}}: {{content}}
  {{/each}}
  
  User's latest question: "{{question}}"

  Your tasks:
  1.  Analyze the user's question in the context of the conversation history.
  2.  Provide a clear, concise, and easy-to-understand response.
  3.  If the query involves potentially serious symptoms (e.g., chest pain, difficulty breathing, severe pain), immediately advise them to seek emergency medical care or speak to a human doctor.
  4.  Maintain a caring, professional, and reassuring tone.
  5.  Return ONLY your single new response as a model turn.
  `,
});

export const gpDoctorFlow = ai.defineFlow(
  {
    name: 'gpDoctorFlow',
    inputSchema: z.array(GpTurnSchema),
    outputSchema: z.array(GpTurnSchema),
  },
  async (history) => {
    // If history is empty, this should not be called. The frontend handles the initial state.
    if (history.length === 0) {
      return [];
    }
    
    const lastUserTurn = history[history.length - 1];
    if (lastUserTurn.role !== 'user') {
      return history; // Should not happen
    }

    const { output } = await gpPrompt({
        history: history.slice(0, -1), // History without the latest question
        question: lastUserTurn.content,
    });

    if (output) {
      return [...history, output];
    }

    // Fallback if the AI fails to generate a response
    return [...history, { role: 'model', content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment." }];
  }
);
