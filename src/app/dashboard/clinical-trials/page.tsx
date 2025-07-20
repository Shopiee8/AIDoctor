import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ClinicalTrialsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clinical Trials</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Information about relevant and upcoming clinical trials will be available here.</p>
      </CardContent>
    </Card>
  );
}
