
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, User, Calendar, MessageSquareWarning, Check, X, Eye } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const aiConsults = [
  { id: 1, patient: "Alex Ray", date: "2024-08-02", agent: "Julia", status: "Needs Review", reason: "High pain level reported" },
  { id: 2, patient: "Samira Khan", date: "2024-08-02", agent: "Sam", status: "Approved", reason: "Standard intake" },
  { id: 3, patient: "John Doe", date: "2024-08-01", agent: "Julia", status: "Needs Review", reason: "Patient mentioned shortness of breath" },
  { id: 4, patient: "Maria Garcia", date: "2024-08-01", agent: "Nora", status: "Approved", reason: "Referral to Cardiology" },
];

const upcomingAppointments = [
    { id: 1, patient: 'Richard Wilson', patientId: 'PT001', image: 'https://placehold.co/40x40.png', imageHint: 'person portrait', date: '11 Nov 2023', time: '10:00 AM', purpose: 'General', type: 'New Patient', paid: 150 },
    { id: 2, patient: 'Charlene Reed', patientId: 'PT002', image: 'https://placehold.co/40x40.png', imageHint: 'person portrait', date: '3 Nov 2023', time: '11:00 AM', purpose: 'General', type: 'Old Patient', paid: 200 },
    { id: 3, patient: 'Travis Trimble', patientId: 'PT003', image: 'https://placehold.co/40x40.png', imageHint: 'person portrait', date: '1 Nov 2023', time: '01:00 PM', purpose: 'General', type: 'New Patient', paid: 75 },
    { id: 4, patient: 'Carl Kelly', patientId: 'PT0004', image: 'https://placehold.co/40x40.png', imageHint: 'person portrait', date: '30 Oct 2023', time: '09:00 AM', purpose: 'General', type: 'Old Patient', paid: 100 },
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

       <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Appointments</CardTitle>
                    <CardDescription>A list of patient appointments scheduled for today.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Patient Name</TableHead>
                                <TableHead>Appt Date</TableHead>
                                <TableHead>Purpose</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-center">Paid Amount</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {upcomingAppointments.map((appt) => (
                                <TableRow key={appt.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={appt.image} data-ai-hint={appt.imageHint} />
                                                <AvatarFallback>{appt.patient.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{appt.patient}</p>
                                                <p className="text-xs text-muted-foreground">{appt.patientId}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {appt.date}
                                        <span className="block text-primary text-xs">{appt.time}</span>
                                    </TableCell>
                                    <TableCell>{appt.purpose}</TableCell>
                                    <TableCell><Badge variant="outline">{appt.type}</Badge></TableCell>
                                    <TableCell className="text-center">${appt.paid.toFixed(2)}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="outline" size="sm" className="h-8"><Eye className="h-4 w-4 mr-1" /> View</Button>
                                        <Button variant="outline" size="sm" className="h-8 border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600"><Check className="h-4 w-4 mr-1" /> Accept</Button>
                                        <Button variant="outline" size="sm" className="h-8 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"><X className="h-4 w-4 mr-1" /> Cancel</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
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
                        <TableHead>Agent</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {aiConsults.map((consult) => (
                        <TableRow key={consult.id}>
                        <TableCell className="font-medium">{consult.patient}</TableCell>
                        <TableCell>{consult.agent}</TableCell>
                        <TableCell>
                            <Badge variant={consult.status === "Needs Review" ? "destructive" : "default"}>
                            {consult.status}
                            </Badge>
                        </TableCell>
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
    </div>
  );
}
