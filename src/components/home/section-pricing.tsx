
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const premierFeatures = [
  "Save your chats",
  "Book a call with a human doctor",
  "Our most advanced medical models",
  "Remembers entire health history",
  "Personalized recommendations",
  "Greatly extended word limits",
  "Input labs, test results, and more",
];

const essentialFeatures = [
  "Save your chats",
  "Book a call with a human doctor",
  "Our standard medical model",
  "Remembers entire health history",
  "Personalized recommendations",
];

export function SectionPricing() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-6 md:px-8">
        <div className="section-header text-center mb-10">
          <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold font-headline mb-2">
            Pricing
          </span>
          <h2 className="text-2xl md:text-3xl font-bold font-headline">
            Choose Your Plan
          </h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="flex flex-col">
            <CardHeader className="text-center">
              <CardTitle className="font-headline">Essential</CardTitle>
              <CardDescription>
                Help as and when you need it
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-6 text-center">
              <p className="text-4xl font-bold">Free</p>
              <Button variant="outline" className="w-full">
                Join Free
              </Button>
              <ul className="space-y-3 text-sm text-left">
                {essentialFeatures.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="justify-center">
              <p className="text-xs text-muted-foreground">Always free. Forever.</p>
            </CardFooter>
          </Card>

          <Card className="flex flex-col border-primary ring-2 ring-primary">
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-primary">Premier</CardTitle>
              <CardDescription>
                The most advanced AI doctor
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-6 text-center">
              <div>
                <span className="text-4xl font-bold">$5</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <Button className="w-full">
                Join for $5/mo
              </Button>
              <ul className="space-y-3 text-sm text-left">
                {premierFeatures.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="justify-center">
              <p className="text-xs text-muted-foreground">Cancel anytime.</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
