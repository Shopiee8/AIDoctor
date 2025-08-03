import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getDoctorsBySpecialty, getSpecialtyById } from '@/data/ai-doctors';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Clock, Languages, ArrowLeft } from 'lucide-react';
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

interface PageProps {
  params: {
    specialty: string;
  };
}

async function SpecialtyDoctorsContent({ specialtyId }: { specialtyId: string }) {
  const specialty = getSpecialtyById(specialtyId);
  const doctors = getDoctorsBySpecialty(specialtyId);

  if (!specialty) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button 
          variant="ghost" 
          size="sm" 
          asChild 
          className="mb-2 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <Link href="/dashboard/ai-consultation">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Specialties
          </Link>
        </Button>
        <h2 className="text-2xl font-semibold tracking-tight">
          {specialty.name} AI Specialists
        </h2>
        <p className="text-sm text-muted-foreground">
          Select an AI doctor to begin your consultation
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {doctors.map((doctor) => (
          <Card key={doctor.id} className="group hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16 border-2 border-primary">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary">{getInitials(doctor.name)}</span>
                    </div>
                    <AvatarFallback>
                      {doctor.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{doctor.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="text-sm font-medium">
                        {doctor.rating} <span className="text-muted-foreground">({Math.floor(doctor.rating * 20)} reviews)</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center justify-end">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {doctor.experience} years experience
                    </div>
                    <div className="flex items-center justify-end mt-1">
                      <Languages className="h-3.5 w-3.5 mr-1" />
                      {doctor.languages.join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{doctor.description}</p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold">${doctor.consultationFee}</span>
                  <span className="text-sm text-muted-foreground"> / consultation</span>
                </div>
                <Button asChild>
                  <Link href={`/dashboard/consultation?doctorId=${doctor.id}`}>
                    Consult Now
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-6 bg-muted/30 rounded-lg border">
        <h3 className="text-lg font-medium mb-2">About {specialty.name} AI Specialists</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Our AI {specialty.name.toLowerCase()} specialists are trained on the latest medical research and guidelines. 
          They can help with preliminary assessments, answer questions, and provide general medical advice.
        </p>
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> AI doctors are not a replacement for emergency care. In case of a medical emergency, 
          please contact your local emergency services immediately.
        </p>
      </div>
    </div>
  );
}

function SpecialtyDoctorsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Skeleton className="h-10 w-40 mb-2" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="group hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default async function SpecialtyDoctorsPage({ params }: PageProps) {
  const { specialty: specialtyId } = params;
  
  // Validate the specialty ID
  const specialty = getSpecialtyById(specialtyId);
  if (!specialty) {
    notFound();
  }
  
  return (
    <Suspense fallback={<SpecialtyDoctorsSkeleton />}>
      <SpecialtyDoctorsContent specialtyId={specialtyId} />
    </Suspense>
  );
}
