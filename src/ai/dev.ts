import { config } from 'dotenv';
config();

import '@/ai/flows/post-op-follow-up.ts';
import '@/ai/flows/automated-patient-intake.ts';
import '@/ai/flows/consultation-flow.ts';