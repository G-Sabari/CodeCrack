import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BackButton } from "@/components/ui/back-button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Building2,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Target,
  Briefcase,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface Company {
  id: string;
  name: string;
  category: string;
  description: string | null;
  hiring_pattern: string[] | null;
  difficulty_level: string | null;
  common_roles: string[] | null;
  interview_experience_count: number | null;
}

function CompanyCard({ company }: { company: Company }) {
  // Calculate a mock readiness score based on difficulty
  const getReadinessScore = (difficulty: string | null) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return Math.floor(Math.random() * 20) + 70; // 70-90
      case "medium":
        return Math.floor(Math.random() * 20) + 50; // 50-70
      case "hard":
        return Math.floor(Math.random() * 20) + 30; // 30-50
      default:
        return 60;
    }
  };

  const readiness = getReadinessScore(company.difficulty_level);
  const isService = company.category === "Service";

  return (
    <Link
      to={`/companies/${company.id}`}
      className="group block rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            {company.name.substring(0, 3).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
              {company.name}
            </h3>
            <Badge variant={isService ? "secondary" : "default"} className="text-xs">
              {company.category}
            </Badge>
          </div>
        </div>
        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Difficulty</span>
          <span className="font-medium">{company.difficulty_level || "Medium"}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Interview Experiences</span>
          <span className="font-medium">{company.interview_experience_count || 0}+</span>
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Your Readiness</span>
            <span className="font-medium text-primary">{readiness}%</span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${readiness}%` }}
            />
          </div>
        </div>

        {company.hiring_pattern && company.hiring_pattern.length > 0 && (
          <div className="pt-2">
            <div className="text-xs text-muted-foreground mb-2">Hiring Pattern</div>
            <div className="flex flex-wrap gap-1">
              {company.hiring_pattern.slice(0, 4).map((pattern) => (
                <Badge key={pattern} variant="outline" className="text-xs font-normal">
                  {pattern}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function Companies() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Fetch companies from Supabase
  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["companies-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as Company[];
    },
  });

  const serviceCompanies = companies.filter((c) => c.category === "Service");
  const productCompanies = companies.filter((c) => c.category === "Product" || c.category === "FAANG");

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "service" && company.category === "Service") ||
      (activeTab === "product" && (company.category === "Product" || company.category === "FAANG"));
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="mb-4">
            <BackButton />
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Company Database</h1>
            <p className="text-muted-foreground">
              Explore {companies.length}+ companies with interview patterns, hiring details, and preparation tips
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-primary">{companies.length}</div>
              <div className="text-sm text-muted-foreground">Companies</div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-primary">{serviceCompanies.length}</div>
              <div className="text-sm text-muted-foreground">Service Companies</div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-primary">{productCompanies.length}</div>
              <div className="text-sm text-muted-foreground">Product Companies</div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {companies.reduce((acc, c) => acc + (c.interview_experience_count || 0), 0)}+
              </div>
              <div className="text-sm text-muted-foreground">Interview Experiences</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="service">Service</TabsTrigger>
                <TabsTrigger value="product">Product</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Companies Grid */}
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading companies...
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          )}

          {!isLoading && filteredCompanies.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No companies found matching your search.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
