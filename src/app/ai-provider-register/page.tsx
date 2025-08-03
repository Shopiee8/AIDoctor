import { redirect } from 'next/navigation';

export default function AiProviderRegisterPage() {
  // Redirect to the first step of registration
  redirect('/ai-provider-register/step-1');
}
