import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReferralsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Referrals</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">A full list of incoming and outgoing patient referrals will be displayed here.</p>
      </CardContent>
    </Card>
  );
}
