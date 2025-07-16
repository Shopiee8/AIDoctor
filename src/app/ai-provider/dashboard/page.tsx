import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AiProviderDashboardPage() {
  return (
    <DashboardLayout userRole="AI Provider">
        <Card>
            <CardHeader>
                <CardTitle>AI Provider Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    Coming Soon: A dedicated space to manage your AI agents, view performance analytics, and access API keys.
                </p>
            </CardContent>
        </Card>
    </DashboardLayout>
  );
}
