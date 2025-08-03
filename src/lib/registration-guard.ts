import { getAIProviderData } from "./ai-provider";
import { auth } from "./firebase";
import { redirect } from "next/navigation";

export async function checkRegistrationProgress(requiredStep: number) {
  const user = auth.currentUser;
  if (!user) {
    redirect('/login');
  }

  const providerData = await getAIProviderData(user.uid);
  
  // If no data and not on step 1, redirect to step 1
  if (!providerData && requiredStep > 1) {
    redirect('/ai-provider-register/step-1');
  }
  
  // If user hasn't completed previous steps, redirect them
  if (providerData && providerData.registrationStep !== undefined) {
    if (requiredStep > providerData.registrationStep + 1) {
      redirect(`/ai-provider-register/step-${providerData.registrationStep + 1}`);
    }
  }

  return { user, providerData };
}
