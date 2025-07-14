import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MeetingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>MDT Meetings & Webinars</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Your schedule for MDT meetings and case discussion webinars will be available here.</p>
      </CardContent>
    </Card>
  );
}
