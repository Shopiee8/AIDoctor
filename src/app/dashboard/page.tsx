import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpRight, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Waveform } from "@/components/waveform";

const appointments = [
  { id: 1, doctor: "Dr. Evelyn Reed", specialty: "Cardiology", date: "2024-08-15", time: "10:30 AM", type: "AI Follow-up" },
  { id: 2, doctor: "Dr. Ben Carter", specialty: "Orthopedics", date: "2024-08-22", time: "02:00 PM", type: "Human" },
];

const summaries = [
  { id: 1, title: "Post-Op Check-in (Julia)", date: "2024-07-30", details: "Pain level: 3/10. Nausea: Low." },
  { id: 2, title: "Initial Intake (Sam)", date: "2024-07-28", details: "Chief complaint: Knee pain." },
];

export default function PatientDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Welcome back, Alex</h1>
        <p className="text-muted-foreground">Here's a summary of your health and upcoming appointments.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Appointments</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/appointments">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appt) => (
                  <TableRow key={appt.id}>
                    <TableCell>
                      <div className="font-medium">{appt.doctor}</div>
                      <div className="text-sm text-muted-foreground">{appt.specialty}</div>
                    </TableCell>
                    <TableCell>{appt.date} at {appt.time}</TableCell>
                    <TableCell>
                      <Badge variant={appt.type.startsWith("AI") ? "default" : "secondary"}>{appt.type}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Start a Consultation</CardTitle>
            <CardDescription>Begin a new consultation with one of our AI agents.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                    <h3 className="font-semibold">AI Voice Call</h3>
                    <p className="text-sm text-muted-foreground">Active session</p>
                </div>
                <Waveform />
             </div>
             <Button className="w-full" asChild>
                <Link href="/dashboard/patient-intake"><PlusCircle className="mr-2 h-4 w-4" /> New Text Intake</Link>
             </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Summaries</CardTitle>
             <Button asChild variant="ghost" size="sm">
              <Link href="#">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {summaries.map((summary) => (
              <div key={summary.id} className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">{summary.title}</h4>
                  <p className="text-sm text-muted-foreground">{summary.date} - {summary.details}</p>
                </div>
                <Button variant="outline" size="icon" asChild>
                  <Link href="#"><ArrowUpRight className="h-4 w-4" /></Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personalized Care Plan</CardTitle>
            <CardDescription>Follow these steps for your recovery.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
             <div className="flex items-center space-x-2">
                <Checkbox id="task1" defaultChecked />
                <label htmlFor="task1" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Take medication at 8 AM and 8 PM
                </label>
            </div>
             <div className="flex items-center space-x-2">
                <Checkbox id="task2" />
                <label htmlFor="task2" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Daily walk for 15 minutes
                </label>
            </div>
             <div className="flex items-center space-x-2">
                <Checkbox id="task3" />
                <label htmlFor="task3" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Check wound dressing
                </label>
            </div>
          </CardContent>
           <CardFooter>
            <Button asChild variant="link" className="p-0">
              <Link href="/dashboard/care-plan">Go to full care plan</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
