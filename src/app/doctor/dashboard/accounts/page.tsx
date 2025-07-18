
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AccountsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Accounts</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Your account statements and financial details will be available here.</p>
      </CardContent>
    </Card>
  );
}
