import { PostOpForm } from "@/components/post-op-form";

export default function PostOpFollowUpPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold font-headline">Post-Operative Follow-Up</h1>
        <p className="text-muted-foreground">
          Let our AI agent, Julia, know how you're recovering.
        </p>
      </div>
      <PostOpForm />
    </div>
  );
}
