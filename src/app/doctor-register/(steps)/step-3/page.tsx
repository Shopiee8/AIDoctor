"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Stethoscope } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const countries = [
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    { value: "uk", label: "United Kingdom" },
    { value: "au", label: "Australia" },
    { value: "de", label: "Germany" },
    { value: "fr", label: "France" },
    { value: "it", label: "Italy" },
    { value: "es", label: "Spain" },
    { value: "nl", label: "Netherlands" },
    { value: "be", label: "Belgium" },
    { value: "ch", label: "Switzerland" },
    { value: "at", label: "Austria" },
    { value: "se", label: "Sweden" },
    { value: "no", label: "Norway" },
    { value: "dk", label: "Denmark" },
    { value: "fi", label: "Finland" },
    { value: "jp", label: "Japan" },
    { value: "kr", label: "South Korea" },
    { value: "sg", label: "Singapore" },
    { value: "nz", label: "New Zealand" },
    { value: "ie", label: "Ireland" },
    { value: "pt", label: "Portugal" },
    { value: "gr", label: "Greece" },
    { value: "pl", label: "Poland" },
    { value: "cz", label: "Czech Republic" },
    { value: "hu", label: "Hungary" },
    { value: "ro", label: "Romania" },
    { value: "bg", label: "Bulgaria" },
    { value: "hr", label: "Croatia" },
    { value: "si", label: "Slovenia" },
    { value: "sk", label: "Slovakia" },
    { value: "ee", label: "Estonia" },
    { value: "lv", label: "Latvia" },
    { value: "lt", label: "Lithuania" },
    { value: "lu", label: "Luxembourg" },
    { value: "mt", label: "Malta" },
    { value: "cy", label: "Cyprus" },
    { value: "is", label: "Iceland" },
    { value: "br", label: "Brazil" },
    { value: "ar", label: "Argentina" },
    { value: "cl", label: "Chile" },
    { value: "uy", label: "Uruguay" },
    { value: "mx", label: "Mexico" },
    { value: "in", label: "India" },
    { value: "cn", label: "China" },
    { value: "th", label: "Thailand" },
    { value: "my", label: "Malaysia" },
    { value: "ph", label: "Philippines" },
    { value: "id", label: "Indonesia" },
    { value: "vn", label: "Vietnam" },
    { value: "tw", label: "Taiwan" },
    { value: "hk", label: "Hong Kong" },
    { value: "il", label: "Israel" },
    { value: "ae", label: "United Arab Emirates" },
    { value: "sa", label: "Saudi Arabia" },
    { value: "qa", label: "Qatar" },
    { value: "kw", label: "Kuwait" },
    { value: "bh", label: "Bahrain" },
    { value: "om", label: "Oman" },
    { value: "jo", label: "Jordan" },
    { value: "lb", label: "Lebanon" },
    { value: "tr", label: "Turkey" },
    { value: "eg", label: "Egypt" },
    { value: "za", label: "South Africa" },
    { value: "ma", label: "Morocco" },
    { value: "tn", label: "Tunisia" }
];

const citiesByCountry = {
    us: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"],
    ca: ["Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa", "Winnipeg", "Quebec City", "Hamilton", "Kitchener"],
    uk: ["London", "Birmingham", "Manchester", "Glasgow", "Liverpool", "Leeds", "Sheffield", "Edinburgh", "Bristol", "Cardiff"],
    au: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Newcastle", "Canberra", "Sunshine Coast", "Wollongong"],
    de: ["Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart", "Düsseldorf", "Dortmund", "Essen", "Leipzig"],
    fr: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg", "Montpellier", "Bordeaux", "Lille"],
    it: ["Rome", "Milan", "Naples", "Turin", "Palermo", "Genoa", "Bologna", "Florence", "Bari", "Catania"],
    es: ["Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Málaga", "Murcia", "Palma", "Las Palmas", "Bilbao"],
    in: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat"],
    jp: ["Tokyo", "Yokohama", "Osaka", "Nagoya", "Sapporo", "Fukuoka", "Kobe", "Kawasaki", "Kyoto", "Saitama"]
};

const statesByCountry = {
    us: ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"],
    ca: ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon"],
    au: ["New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia", "Tasmania", "Australian Capital Territory", "Northern Territory"],
    de: ["Baden-Württemberg", "Bavaria", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hesse", "Lower Saxony", "Mecklenburg-Vorpommern", "North Rhine-Westphalia", "Rhineland-Palatinate", "Saarland", "Saxony", "Saxony-Anhalt", "Schleswig-Holstein", "Thuringia"],
    in: ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"]
};

export default function RegisterStepThree() {
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedState, setSelectedState] = useState("");

    const handleCountryChange = (value: string) => {
        setSelectedCountry(value);
        setSelectedState(""); // Reset state when country changes
    };

    const availableCities = selectedCountry ? citiesByCountry[selectedCountry as keyof typeof citiesByCountry] || [] : [];
    const availableStates = selectedCountry ? statesByCountry[selectedCountry as keyof typeof statesByCountry] || [] : [];

    return (
        <Card className="w-full">
            <CardHeader className="text-center">
                 <Link href="/" className="inline-block mb-4">
                    <Stethoscope className="h-8 w-8 text-primary mx-auto" />
                </Link>

                <div className="flex justify-center gap-2 my-4">
                    <Link href="/doctor-register/step-1" className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold">1</Link>
                    <Link href="/doctor-register/step-2" className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold">2</Link>
                    <Link href="/doctor-register/step-3" className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">3</Link>
                </div>

                <CardTitle className="text-2xl font-headline">Your Location</CardTitle>
            </CardHeader>
            <CardContent>
                <form action="/doctor/dashboard">
                    <div className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="country">Select Country</Label>
                            <Select onValueChange={handleCountryChange}>
                                <SelectTrigger id="country">
                                    <SelectValue placeholder="Select Your Country" />
                                </SelectTrigger>
                                <SelectContent className="bg-white/95 backdrop-blur-md border border-border shadow-lg">
                                    {countries.map((country) => (
                                        <SelectItem key={country.value} value={country.value} className="bg-white/90 hover:bg-white/100">
                                            {country.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="city">Select City</Label>
                            <Select disabled={!selectedCountry}>
                                <SelectTrigger id="city">
                                    <SelectValue placeholder={selectedCountry ? "Select Your City" : "Select Country First"} />
                                </SelectTrigger>
                                <SelectContent className="bg-white/95 backdrop-blur-md border border-border shadow-lg">
                                    {availableCities.map((city) => (
                                        <SelectItem key={city} value={city.toLowerCase().replace(/\s+/g, '-')} className="bg-white/90 hover:bg-white/100">
                                            {city}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="state">Select State</Label>
                             <Select disabled={!selectedCountry}>
                                <SelectTrigger id="state">
                                    <SelectValue placeholder={selectedCountry ? "Select Your State" : "Select Country First"} />
                                </SelectTrigger>
                                <SelectContent className="bg-white/95 backdrop-blur-md border border-border shadow-lg">
                                    {availableStates.map((state) => (
                                        <SelectItem key={state} value={state.toLowerCase().replace(/\s+/g, '-')} className="bg-white/90 hover:bg-white/100">
                                            {state}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="mt-8">
                        <Button type="submit" className="w-full">
                            Update & Complete
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}