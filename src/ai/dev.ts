import {config} from 'dotenv';
config({path: '.env'});

import '@/ai/flows/post-op-follow-up.ts';
import '@/ai/flows/automated-patient-intake.ts';
import '@/ai/flows/consultation-flow.ts';
import '@/ai/flows/scribe-flow.ts';
import '@/ai/flows/gp-doctor-flow.ts';
import '@/ai/flows/tts-flow.ts';
