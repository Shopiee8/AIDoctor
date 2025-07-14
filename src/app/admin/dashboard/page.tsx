import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bot, Activity, ShieldCheck } from "lucide-react";

const agentActivity = [
  { id: 1, agent: "Julia", task: "Post-Op Follow-Up", patient: "Alex Ray", outcome: "Escalated to Doctor", timestamp: "2 mins ago" },
  { id: 2, agent: "Sam", task: "Patient Intake", patient: "Samira Khan", outcome: "Completed", timestamp: "5 mins ago" },
  { id: 3, agent: "Nora", task: "Referral", patient: "Maria Garcia", outcome: "Completed", timestamp: "1 hour ago" },
  { id: 4, agent: "Ava", task: "Appointment Booking", patient: "John Doe", outcome: "Completed", timestamp: "3 hours ago" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">Monitor and manage the AIDoctor platform.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active AI Agents</CardTitle>
            <Bot className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Agents currently operational</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Consults Today</CardTitle>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+1,204</div>
            <p className="text-xs text-muted-foreground">+15% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <ShieldCheck className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Operational</div>
            <p className="text-xs text-muted-foreground">All systems are running smoothly</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Agent Activity</CardTitle>
          <CardDescription>A log of the most recent actions performed by AI agents.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agentActivity.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium flex items-center gap-2"><Bot className="w-4 h-4" /> {activity.agent}</TableCell>
                  <TableCell>{activity.task}</TableCell>
                  <TableCell>{activity.patient}</TableCell>
                  <TableCell>
                    <Badge variant={activity.outcome === "Escalated to Doctor" ? "secondary" : "default"}>
                      {activity.outcome}
                    </Badge>
                  </TableCell>
                  <TableCell>{activity.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
