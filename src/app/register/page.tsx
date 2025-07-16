import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, User, Bot, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const userRoles = [
    {
      icon: User,
      title: "As a Patient",
      description: "Book appointments, manage your health, and consult with AI or human doctors.",
      href: "/patient-register/step-1",
    },
    {
      icon: Stethoscope,
      title: "As a Doctor",
      description: "Join our network of specialists, manage patients, and collaborate with AI.",
      href: "/doctor-register",
    },
    {
      icon: Bot,
      title: "As an AI Provider",
      description: "Deploy and manage your healthcare AI agents on our platform.",
      href: "/ai-provider-register",
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/50 p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4">
                <Stethoscope className="h-10 w-10 text-primary mx-auto" />
            </Link>
            <h1 className="text-3xl font-bold font-headline">Join AIDoctor</h1>
            <p className="text-muted-foreground">Choose your role to get started.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {userRoles.map((role) => (
            <Link key={role.href} href={role.href} className="block group">
                <Card className="h-full flex flex-col text-center hover:border-primary hover:shadow-lg transition-all">
                    <CardHeader className="flex-grow">
                        <role.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                        <CardTitle className="font-headline">{role.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>{role.description}</CardDescription>
                    </CardContent>
                    <div className="p-4">
                         <Button variant="ghost" className="w-full group-hover:text-primary">
                            Sign Up <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </Card>
            </Link>
          ))}
        </div>
         <div className="mt-8 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline font-semibold">
              Login
            </Link>
          </div>
      </div>
    </div>
  );
}
