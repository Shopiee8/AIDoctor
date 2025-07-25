
'use server';

/**
 * @fileOverview A flow for converting text to speech.
 */
import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';
import wav from 'wav';

const TtsOutputSchema = z.object({
  media: z.string().describe('The base64 encoded WAV audio data URI.'),
});
export type TtsOutput = z.infer<typeof TtsOutputSchema>;

export async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

export const ttsFlow = ai.defineFlow(
  {
    name: 'ttsFlow',
    inputSchema: z.string(),
    outputSchema: TtsOutputSchema,
  },
  async (query) => {
    // Return empty media if the query is empty or just whitespace
    if (!query || !query.trim()) {
      return { media: '' };
    }

    try {
      const { media } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-preview-tts'),
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Algenib' },
            },
          },
        },
        prompt: query,
      });
      if (!media) {
        throw new Error('no media returned');
      }
      const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
      );
      return {
        media: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
      };
    } catch (error: any) {
        // Check if the error is a rate limit error (429)
        if (error.message && error.message.includes('429')) {
            console.warn("TTS rate limit exceeded. Returning empty media.");
            return { media: '' }; // Return gracefully without audio
        }
        // For other errors, re-throw them
        console.error("An unexpected error occurred in TTS flow:", error);
        throw error;
    }
  }
);
