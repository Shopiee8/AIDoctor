import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SubscriptionsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Subscriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Manage your subscription plans and billing details here.</p>
      </CardContent>
    </Card>
  );
}
