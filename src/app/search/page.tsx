import { LandingHeader } from "@/components/landing-header";
import { Footer } from "@/components/home/footer";
import { SearchFilters } from "@/components/search/search-filters";
import { SearchResults } from "@/components/search/search-results";

export default function SearchPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/50">
      <LandingHeader />
      <main className="flex-1 py-8">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3">
                <SearchFilters />
            </div>
            <div className="lg:col-span-9">
                <SearchResults />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
