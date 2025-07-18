
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ChangePasswordPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">A form to change your account password will be available here.</p>
      </CardContent>
    </Card>
  );
}
