
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReviewsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">A list of patient reviews and ratings will be available here.</p>
      </CardContent>
    </Card>
  );
}
