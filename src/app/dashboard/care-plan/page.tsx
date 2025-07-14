import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CarePlanPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Care Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Your detailed, personalized care plan will be available here, including medication schedules, exercises, and recovery instructions.</p>
      </CardContent>
    </Card>
  );
}
