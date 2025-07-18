
'use client';

import { SocialLinksCard } from "@/components/doctor/social-links-card";

export default function DoctorSocialMediaPage() {
    return (
        <div className="space-y-6">
             <div>
                <h1 className="text-3xl font-bold font-headline">Social Media</h1>
                <p className="text-muted-foreground">Manage your social media profile links.</p>
            </div>
            <SocialLinksCard />
             <div className="flex justify-end">
                <button className="bg-primary text-white px-4 py-2 rounded-lg">Save Changes</button>
            </div>
        </div>
    )
}
