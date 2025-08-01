"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot, query, orderBy, where } from "firebase/firestore";
import { db } from '@/lib/firebase';
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
import { Check, Star, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingPeriod: string; // 'monthly', 'yearly', 'one-time'
  features: string[];
  isPopular?: boolean;
  isActive?: boolean;
  buttonText?: string;
  buttonLink?: string;
  footerText?: string;
  order?: number;
  badge?: string;
  color?: string;
}

// Fallback pricing plans in case Firestore is empty
const fallbackPlans: PricingPlan[] = [
  {
    id: "essential",
    name: "Essential",
    description: "Help as and when you need it",
    price: 0,
    currency: "USD",
    billingPeriod: "monthly",
    features: [
      "Save your chats",
      "Book a call with a human doctor",
      "Our standard medical model",
      "Remembers entire health history",
      "Personalized recommendations",
      "Basic health insights",
      "Email support"
    ],
    isPopular: false,
    isActive: true,
    buttonText: "Join Free",
    buttonLink: "/register",
    footerText: "Always free. Forever.",
    order: 1,
    color: "default"
  },
  {
    id: "premier",
    name: "Premier",
    description: "The most advanced AI doctor",
    price: 5,
    currency: "USD",
    billingPeriod: "monthly",
    features: [
      "Save your chats",
      "Book a call with a human doctor",
      "Our most advanced medical models",
      "Remembers entire health history",
      "Personalized recommendations",
      "Greatly extended word limits",
      "Input labs, test results, and more",
      "Priority support",
      "Advanced health analytics",
      "Custom health reports"
    ],
    isPopular: true,
    isActive: true,
    buttonText: "Join for $5/mo",
    buttonLink: "/register?plan=premier",
    footerText: "Cancel anytime.",
    order: 2,
    badge: "Most Popular",
    color: "primary"
  },
  {
    id: "professional",
    name: "Professional",
    description: "For healthcare professionals",
    price: 25,
    currency: "USD",
    billingPeriod: "monthly",
    features: [
      "Everything in Premier",
      "Multi-patient management",
      "Advanced diagnostic tools",
      "Integration with EMR systems",
      "Bulk consultation features",
      "Professional dashboard",
      "API access",
      "White-label options",
      "Dedicated account manager",
      "Custom integrations"
    ],
    isPopular: false,
    isActive: true,
    buttonText: "Start Professional",
    buttonLink: "/register?plan=professional",
    footerText: "14-day free trial included.",
    order: 3,
    badge: "For Professionals",
    color: "secondary"
  }
];

export function SectionPricing() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const plansRef = collection(db, 'pricing_plans');
        const plansQuery = query(
          plansRef,
          where('isActive', '==', true),
          orderBy('order', 'asc')
        );
        const plansSnapshot = await getDocs(plansQuery);
        const fetchedPlans: PricingPlan[] = [];
        
        plansSnapshot.forEach((doc) => {
          fetchedPlans.push({ id: doc.id, ...doc.data() } as PricingPlan);
        });

        // Use fetched data or fallback
        setPlans(fetchedPlans.length > 0 ? fetchedPlans : fallbackPlans);

      } catch (error) {
        console.error("Error fetching pricing plans: ", error);
        // Use fallback data on error
        setPlans(fallbackPlans);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();

    // Set up real-time listener for live updates
    const plansRef = collection(db, 'pricing_plans');
    const plansQuery = query(
      plansRef,
      where('isActive', '==', true),
      orderBy('order', 'asc')
    );
    const unsubscribe = onSnapshot(plansQuery, (snapshot) => {
      const updatedPlans: PricingPlan[] = [];
      snapshot.forEach((doc) => {
        updatedPlans.push({ id: doc.id, ...doc.data() } as PricingPlan);
      });
      if (updatedPlans.length > 0) {
        setPlans(updatedPlans);
      }
    }, (error) => {
      console.error("Error in pricing plans real-time listener: ", error);
    });

    return () => unsubscribe();
  }, []);

  const formatPrice = (price: number, currency: string, billingPeriod: string) => {
    if (price === 0) return "Free";
    
    const currencySymbol = currency === "USD" ? "$" : currency;
    const periodSuffix = billingPeriod === "monthly" ? "/mo" : 
                        billingPeriod === "yearly" ? "/yr" : "";
    
    return `${currencySymbol}${price}${periodSuffix}`;
  };

  const getCardClassName = (plan: PricingPlan) => {
    const baseClass = "flex flex-col relative";
    if (plan.isPopular) {
      return `${baseClass} border-primary ring-2 ring-primary shadow-lg scale-105`;
    }
    return `${baseClass} hover:shadow-lg transition-shadow`;
  };

  const getButtonVariant = (plan: PricingPlan) => {
    if (plan.price === 0) return "outline";
    if (plan.isPopular) return "default";
    return "outline";
  };

  if (loading) {
    return (
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-6 md:px-8">
          <div className="section-header text-center mb-10">
            <Skeleton className="h-6 w-20 mx-auto mb-2" />
            <Skeleton className="h-8 w-64 mx-auto" />
          </div>
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader className="text-center">
                  <Skeleton className="h-6 w-24 mx-auto mb-2" />
                  <Skeleton className="h-4 w-32 mx-auto" />
                </CardHeader>
                <CardContent className="flex-grow space-y-6 text-center">
                  <Skeleton className="h-12 w-20 mx-auto" />
                  <Skeleton className="h-10 w-full" />
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

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
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Select the perfect plan for your healthcare needs. Upgrade or downgrade at any time.
          </p>
        </div>
        
        <div className={cn(
          "grid gap-8 max-w-6xl mx-auto",
          plans.length === 2 ? "lg:grid-cols-2 max-w-4xl" : 
          plans.length === 3 ? "lg:grid-cols-3" : 
          "lg:grid-cols-4"
        )}>
          {plans.map((plan) => (
            <Card key={plan.id} className={getCardClassName(plan)}>
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {plan.badge || "Most Popular"}
                  </span>
                </div>
              )}
              
              {plan.badge && !plan.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {plan.badge}
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className={cn(
                  "font-headline",
                  plan.isPopular ? "text-primary" : ""
                )}>
                  {plan.name}
                </CardTitle>
                <CardDescription>
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-grow space-y-6 text-center">
                <div>
                  <span className="text-4xl font-bold">
                    {formatPrice(plan.price, plan.currency, plan.billingPeriod)}
                  </span>
                  {plan.price > 0 && plan.billingPeriod === "yearly" && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Save 20% with yearly billing
                    </div>
                  )}
                </div>
                
                <Button 
                  variant={getButtonVariant(plan)} 
                  className="w-full"
                  asChild
                >
                  <Link href={plan.buttonLink || "/register"}>
                    {plan.buttonText || `Choose ${plan.name}`}
                  </Link>
                </Button>
                
                <ul className="space-y-3 text-sm text-left">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              {plan.footerText && (
                <CardFooter className="justify-center">
                  <p className="text-xs text-muted-foreground text-center">
                    {plan.footerText}
                  </p>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
        
        {/* Additional Information */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            All plans include 24/7 AI support and secure data encryption
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link href="/pricing">View Detailed Comparison</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/contact">Have Questions? Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}