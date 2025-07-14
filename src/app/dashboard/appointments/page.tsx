import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AppointmentsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">A full list of your past and upcoming appointments will be displayed here.</p>
      </CardContent>
    </Card>
  );
}
