import { medicalSpecialties } from "@/data/ai-doctors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AIConsultationPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">AI Doctor Consultation</h2>
        <p className="text-sm text-muted-foreground">
          Select a medical specialty to consult with our AI doctors
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {medicalSpecialties.map((specialty) => (
          <Link key={specialty.id} href={`/dashboard/ai-consultation/${specialty.id}`}>
            <Card className="h-full transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{specialty.icon}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                    AI Specialists
                  </span>
                </div>
                <CardTitle className="text-lg">{specialty.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{specialty.description}</p>
                <Button variant="link" className="p-0 mt-2 h-auto text-primary">
                  View AI Doctors →
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-6 bg-muted/30 rounded-lg border">
        <h3 className="text-lg font-medium mb-2">How It Works</h3>
        <ol className="space-y-2 text-sm text-muted-foreground">
          <li>1. Select a medical specialty that matches your health concern</li>
          <li>2. Choose from our AI doctors specialized in that field</li>
          <li>3. Start your consultation and get immediate medical advice</li>
        </ol>
      </div>
    </div>
  );
}
