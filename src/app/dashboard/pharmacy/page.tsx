import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PharmacyPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Pharmacy</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Your prescriptions, medication schedules, and refill options will be available here.</p>
      </CardContent>
    </Card>
  );
}
