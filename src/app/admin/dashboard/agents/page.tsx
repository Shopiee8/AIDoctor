import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AgentsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Agent Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">A dashboard for assigning AI agents to tasks, monitoring performance, and managing configurations will be available here.</p>
      </CardContent>
    </Card>
  );
}
