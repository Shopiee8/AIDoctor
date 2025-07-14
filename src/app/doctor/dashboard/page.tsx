import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, User, Calendar, MessageSquareWarning } from "lucide-react";
import Link from "next/link";

const aiConsults = [
  { id: 1, patient: "Alex Ray", date: "2024-08-02", agent: "Julia", status: "Needs Review", reason: "High pain level reported" },
  { id: 2, patient: "Samira Khan", date: "2024-08-02", agent: "Sam", status: "Approved", reason: "Standard intake" },
  { id: 3, patient: "John Doe", date: "2024-08-01", agent: "Julia", status: "Needs Review", reason: "Patient mentioned shortness of breath" },
  { id: 4, patient: "Maria Garcia", date: "2024-08-01", agent: "Nora", status: "Approved", reason: "Referral to Cardiology" },
];

export default function DoctorDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Doctor Dashboard</h1>
        <p className="text-muted-foreground">Review AI-handled consultations and manage patient care.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <MessageSquareWarning className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">AI consults need your attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New Referrals</CardTitle>
            <User className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Incoming patient referrals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Meetings</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">MDT meeting this week</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>AI Consultations for Review</CardTitle>
          <CardDescription>Review, approve, or escalate consultations handled by AI agents.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reason for Escalation</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aiConsults.map((consult) => (
                <TableRow key={consult.id}>
                  <TableCell className="font-medium">{consult.patient}</TableCell>
                  <TableCell>{consult.date}</TableCell>
                  <TableCell>{consult.agent}</TableCell>
                  <TableCell>
                    <Badge variant={consult.status === "Needs Review" ? "destructive" : "default"}>
                      {consult.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{consult.reason}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href="#">
                        Review <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
