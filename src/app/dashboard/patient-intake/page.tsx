import { PatientIntakeForm } from "@/components/patient-intake-form";

export default function PatientIntakePage() {
  return (
    <div className="space-y-4">
       <div>
        <h1 className="text-3xl font-bold font-headline">Automated Patient Intake</h1>
        <p className="text-muted-foreground">
          Fill out the form below to have our AI assistant, Sam, process your information.
        </p>
      </div>
      <PatientIntakeForm />
    </div>
  );
}
