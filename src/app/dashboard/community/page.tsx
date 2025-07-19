import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CommunityPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Hub</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Connect with other patients, join support groups, and find community resources here.</p>
      </CardContent>
    </Card>
  );
}
