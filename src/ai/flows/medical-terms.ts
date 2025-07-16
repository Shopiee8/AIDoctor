
'use server';

/**
 * @fileOverview A list of medical terms for the AI to reference.
 */

export const medicalTerms = [
  // High-Risk Symptoms - These trigger an automatic referral
  { english: 'Chest Pain', arabic: 'ألم في الصدر', category: 'High-Risk' },
  { english: 'Shortness of Breath', arabic: 'ضيق في التنفس', category: 'High-Risk' },
  { english: 'Severe Headache', arabic: 'صداع شديد', category: 'High-Risk' },
  { english: 'Loss of Consciousness', arabic: 'فقدان الوعي', category: 'High-Risk' },
  { english: 'Severe Abdominal Pain', arabic: 'ألم شديد في البطن', category: 'High-Risk' },

  // General Symptoms
  { english: 'Headache', arabic: 'صداع', category: 'General' },
  { english: 'Fever', arabic: 'حمى', category: 'General' },
  { english: 'Cough', arabic: 'سعال', category: 'General' },
  { english: 'Dizziness', arabic: 'دوخة', category: 'General' },
  { english: 'Nausea', arabic: 'غثيان', category: 'General' },
  { english: 'Vomiting', arabic: 'قيء', category: 'Gastrointestinal' },
  { english: 'Diarrhea', arabic: 'إسهال', category: 'Gastrointestinal' },
  { english: 'Constipation', arabic: 'إمساك', category: 'Gastrointestinal' },
  { english: 'Insomnia', arabic: 'أرق', category: 'Neurological' },
  { english: 'Abdominal Pain', arabic: 'ألم في البطن', category: 'Gastrointestinal' },
  
  // Body Parts
  { english: 'Head', arabic: 'رأس', category: 'Body Part' },
  { english: 'Chest', arabic: 'صدر', category: 'Body Part' },
  { english: 'Abdomen', arabic: 'بطن', category: 'Body Part' },
  { english: 'Back', arabic: 'ظهر', category: 'Body Part' },
  { english: 'Hand', arabic: 'يد', category: 'Body Part' },
  { english: 'Leg', arabic: 'رجل', category: 'Body Part' },
  { english: 'Eye', arabic: 'عين', category: 'Body Part' },
  { english: 'Ear', arabic: 'أذن', category: 'Body Part' },
  { english: 'Nose', arabic: 'أنف', category: 'Body Part' },
  { english: 'Mouth', arabic: 'فم', category: 'Body Part' },

  // Time Expressions
  { english: 'since an hour ago', arabic: 'منذ ساعة', category: 'Time' },
  { english: 'since yesterday', arabic: 'منذ يوم', category: 'Time' },
  { english: 'since a week ago', arabic: 'منذ أسبوع', category: 'Time' },
  { english: 'now', arabic: 'الآن', category: 'Time' },
  { english: 'this morning', arabic: 'صباح اليوم', category: 'Time' },
];
