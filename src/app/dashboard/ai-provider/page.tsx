import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/session';
import { getAIProvider, getAIDoctorsByProvider } from '@/lib/firebase/providerService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, Users, Activity, Star } from 'lucide-react';
import Link from 'next/link';

// Helper function to get initials from name
function getInitials(name: string) {
  return name
    .split(' ')
    .map(part => part[0] || '')
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export const metadata: Metadata = {
  title: 'AI Provider Dashboard',
  description: 'Manage your AI doctors and view analytics',
};

async function DashboardContent() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }

  try {
    const provider = await getAIProvider(user.id);
    
    if (!provider) {
      // Show a message and a button to become a provider
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
          <div className="max-w-md space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Welcome to AI Provider Dashboard</h1>
            <p className="text-muted-foreground">
              You're not registered as an AI provider yet. Click the button below to get started.
            </p>
            <Button asChild>
              <Link href="/dashboard/become-provider">
                Become an AI Provider
              </Link>
            </Button>
          </div>
        </div>
      );
    }

    const aiDoctors = await getAIDoctorsByProvider(provider.id);
    
    // Calculate total stats across all AI doctors
    const totalStats = aiDoctors.reduce(
      (acc, doctor) => {
        return {
          totalConsultations: acc.totalConsultations + (doctor.stats?.totalConsultations || 0),
          totalPatients: acc.totalPatients + (doctor.stats?.totalPatients || 0),
          totalRating: acc.totalRating + (doctor.stats?.averageRating || 0),
          activeDoctors: acc.activeDoctors + (doctor.isActive ? 1 : 0),
        };
      },
      { totalConsultations: 0, totalPatients: 0, totalRating: 0, activeDoctors: 0 }
    );

    const averageRating = aiDoctors.length > 0 
      ? (totalStats.totalRating / aiDoctors.length).toFixed(1) 
      : 0;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {provider.organizationName || 'Provider'}</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your AI doctors today.
          </p>
        </div>
        <Link href="/dashboard/ai-provider/doctors/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New AI Doctor
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active AI Doctors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.activeDoctors}</div>
            <p className="text-xs text-muted-foreground">
              {aiDoctors.length} total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Consultations</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalConsultations}</div>
            <p className="text-xs text-muted-foreground">
              All time consultations
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating}<span className="text-sm text-muted-foreground">/5</span></div>
            <p className="text-xs text-muted-foreground">
              Across all AI doctors
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">
              Unique patients served
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & AI Doctors List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Your AI Doctors</CardTitle>
            <CardDescription>
              {aiDoctors.length === 0 
                ? "You don't have any AI doctors yet. Create your first one!" 
                : `You have ${aiDoctors.length} AI doctors`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {aiDoctors.length > 0 ? (
              <div className="space-y-4">
                {aiDoctors.map((doctor) => (
                  <div key={doctor.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-semibold text-primary">{getInitials(doctor.name)}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{doctor.name}</h3>
                        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${doctor.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {doctor.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <Link href={`/dashboard/ai-provider/doctors/${doctor.id}`}>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-1">No AI doctors yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get started by creating your first AI doctor.
                </p>
                <Link href="/dashboard/ai-provider/doctors/new">
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New AI Doctor
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest consultations and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiDoctors.length > 0 ? (
                aiDoctors.slice(0, 3).map((doctor) => (
                  <div key={doctor.id} className="space-y-2">
                    <h4 className="text-sm font-medium">{doctor.name}</h4>
                    <div className="text-sm text-muted-foreground">
                      {doctor.stats?.lastActive ? (
                        <p>Last active: {new Date(doctor.stats.lastActive).toLocaleDateString()}</p>
                      ) : (
                        <p>No recent activity</p>
                      )}
                      <p>{doctor.stats?.totalConsultations || 0} total consultations</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No activity yet</p>
                  <p className="text-sm">Your AI doctors' activity will appear here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    );
  } catch (error) {
    console.error('Error loading dashboard:', error);
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-destructive p-4 text-destructive">
          <h2 className="text-lg font-semibold">Error Loading Dashboard</h2>
          <p>We couldn't load your dashboard. Please try refreshing the page.</p>
          <p className="text-sm mt-2">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </div>
    );
  }
}

// Loading skeleton component
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AIProviderDashboard() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
