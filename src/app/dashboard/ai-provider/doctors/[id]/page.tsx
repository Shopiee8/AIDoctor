import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { getAIProvider, getAIDoctor } from '@/lib/firebase/providerService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, DollarSign, MessageSquare, Phone, Settings, Star, User, Users, X } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const aiDoctor = await getAIDoctor(params.id);
  
  return {
    title: aiDoctor ? `${aiDoctor.name} - AI Doctor` : 'AI Doctor Not Found',
    description: aiDoctor ? `Manage your ${aiDoctor.specialty} AI doctor` : 'AI Doctor not found',
  };
}

export default async function AIDoctorDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }

  const provider = await getAIProvider(user.id);
  
  if (!provider) {
    redirect('/dashboard/become-provider');
  }

  const aiDoctor = await getAIDoctor(params.id);
  
  if (!aiDoctor || aiDoctor.providerId !== provider.id) {
    notFound();
  }

  // Format consultation stats
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={aiDoctor.avatar} alt={aiDoctor.name} />
              <AvatarFallback>{aiDoctor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{aiDoctor.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-sm font-medium">
                  {aiDoctor.specialty}
                </Badge>
                <Badge variant={aiDoctor.isActive ? 'default' : 'secondary'} className="text-xs">
                  {aiDoctor.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/ai-provider/doctors/${aiDoctor.id}/edit`}>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Link href="/dashboard/ai-provider/doctors/new">
            <Button size="sm">
              <User className="h-4 w-4 mr-2" />
              New AI Doctor
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Consultations
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(aiDoctor.stats?.totalConsultations || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  All time consultations
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Rating
                </CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {aiDoctor.stats?.averageRating?.toFixed(1) || 'N/A'}
                  <span className="text-sm text-muted-foreground">/5</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Based on {aiDoctor.stats?.totalConsultations || 0} consultations
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Patients
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(aiDoctor.stats?.totalPatients || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Unique patients served
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Status
                </CardTitle>
                <div className={`h-2 w-2 rounded-full ${aiDoctor.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {aiDoctor.isActive ? 'Active' : 'Inactive'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {aiDoctor.isActive 
                    ? 'Available for consultations' 
                    : 'Not accepting new consultations'}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium">Description</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {aiDoctor.description || 'No description provided.'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium">Specialty</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {aiDoctor.specialty}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Consultation Fee</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        ${aiDoctor.settings.consultationFee.toFixed(2)} per session
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Availability</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {aiDoctor.settings.availability === '24/7' && '24/7'}
                        {aiDoctor.settings.availability === 'office-hours' && 'Office Hours (9AM-5PM)'}
                        {aiDoctor.settings.availability === 'custom' && 'Custom Schedule'}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Language</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {aiDoctor.settings.language.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Manage your AI doctor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    View Conversations
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Schedule
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <DollarSign className="h-4 w-4 mr-2" />
                    View Earnings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-destructive">
                    <X className="h-4 w-4 mr-2" />
                    Deactivate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Performance metrics for {aiDoctor.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
                <p className="text-muted-foreground">Analytics dashboard coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Conversations</CardTitle>
              <CardDescription>
                Past consultations with patients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
                <p className="text-muted-foreground">Conversation history coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Configure advanced options for {aiDoctor.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
                <p className="text-muted-foreground">Advanced settings coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
