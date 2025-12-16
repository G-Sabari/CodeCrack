import { useState } from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

const serviceCompanies = [
  {
    id: "tcs",
    name: "TCS",
    logo: "TCS",
    type: "Service",
    problems: 45,
    avgDifficulty: "Easy-Medium",
    rounds: ["Aptitude", "Coding", "Technical", "HR"],
    topTopics: ["Arrays", "Strings", "SQL", "OOPs"],
    readiness: 72,
  },
  {
    id: "infosys",
    name: "Infosys",
    logo: "INF",
    type: "Service",
    problems: 38,
    avgDifficulty: "Easy-Medium",
    rounds: ["Aptitude", "Pseudo Code", "Technical", "HR"],
    topTopics: ["Arrays", "Strings", "Patterns", "Logic"],
    readiness: 65,
  },
  {
    id: "wipro",
    name: "Wipro",
    logo: "WIP",
    type: "Service",
    problems: 32,
    avgDifficulty: "Easy",
    rounds: ["Aptitude", "Coding", "Technical", "HR"],
    topTopics: ["Arrays", "Strings", "Basic Math", "Patterns"],
    readiness: 80,
  },
  {
    id: "cognizant",
    name: "Cognizant",
    logo: "CTS",
    type: "Service",
    problems: 28,
    avgDifficulty: "Easy",
    rounds: ["Aptitude", "Coding", "Technical", "HR"],
    topTopics: ["Arrays", "Strings", "SQL", "OOPs"],
    readiness: 75,
  },
  {
    id: "accenture",
    name: "Accenture",
    logo: "ACC",
    type: "Service",
    problems: 30,
    avgDifficulty: "Easy-Medium",
    rounds: ["Cognitive", "Coding", "Communication"],
    topTopics: ["Arrays", "Strings", "Logic", "SQL"],
    readiness: 70,
  },
  {
    id: "zoho",
    name: "Zoho",
    logo: "ZHO",
    type: "Service",
    problems: 55,
    avgDifficulty: "Medium",
    rounds: ["Aptitude", "Coding (5 rounds)", "Technical", "HR"],
    topTopics: ["Arrays", "Strings", "Matrix", "Patterns"],
    readiness: 45,
  },
];

const productCompanies = [
  {
    id: "amazon",
    name: "Amazon",
    logo: "AMZ",
    type: "Product",
    problems: 85,
    avgDifficulty: "Medium-Hard",
    rounds: ["OA", "Phone Screen", "Onsite (4-5 rounds)"],
    topTopics: ["Arrays", "Trees", "Graphs", "DP", "System Design"],
    readiness: 35,
  },
  {
    id: "google",
    name: "Google",
    logo: "GOG",
    type: "Product",
    problems: 75,
    avgDifficulty: "Hard",
    rounds: ["Phone Screen", "Onsite (4-5 rounds)"],
    topTopics: ["Arrays", "Graphs", "DP", "Strings", "Math"],
    readiness: 25,
  },
  {
    id: "microsoft",
    name: "Microsoft",
    logo: "MST",
    type: "Product",
    problems: 70,
    avgDifficulty: "Medium-Hard",
    rounds: ["OA", "Phone Screen", "Onsite (3-4 rounds)"],
    topTopics: ["Arrays", "Trees", "Linked Lists", "DP"],
    readiness: 40,
  },
  {
    id: "flipkart",
    name: "Flipkart",
    logo: "FLK",
    type: "Product",
    problems: 50,
    avgDifficulty: "Medium-Hard",
    rounds: ["OA", "Phone Screen", "Onsite (3-4 rounds)"],
    topTopics: ["Arrays", "Trees", "Graphs", "System Design"],
    readiness: 38,
  },
  {
    id: "atlassian",
    name: "Atlassian",
    logo: "ATL",
    type: "Product",
    problems: 35,
    avgDifficulty: "Medium",
    rounds: ["OA", "Karat", "Onsite (3 rounds)"],
    topTopics: ["Arrays", "Strings", "Trees", "Design"],
    readiness: 50,
  },
  {
    id: "phonepe",
    name: "PhonePe",
    logo: "PHP",
    type: "Product",
    problems: 30,
    avgDifficulty: "Medium",
    rounds: ["OA", "Technical (2-3 rounds)", "HR"],
    topTopics: ["Arrays", "DP", "System Design", "SQL"],
    readiness: 55,
  },
];

function CompanyCard({ company }: { company: typeof serviceCompanies[0] }) {
  return (
    <Link
      to={`/companies/${company.id}`}
      className="group block rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            {company.logo}
          </div>
          <div>
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
              {company.name}
            </h3>
            <Badge variant="secondary" className="text-xs">
              {company.type}
            </Badge>
          </div>
        </div>
        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Problems</span>
          <span className="font-medium">{company.problems}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Difficulty</span>
          <span className="font-medium">{company.avgDifficulty}</span>
        </div>
        
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Your Readiness</span>
            <span className="font-medium text-primary">{company.readiness}%</span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${company.readiness}%` }}
            />
          </div>
        </div>

        <div className="pt-2">
          <div className="text-xs text-muted-foreground mb-2">Top Topics</div>
          <div className="flex flex-wrap gap-1">
            {company.topTopics.slice(0, 4).map((topic) => (
              <Badge key={topic} variant="outline" className="text-xs font-normal">
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Companies() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const allCompanies = [...serviceCompanies, ...productCompanies];

  const filteredCompanies = allCompanies.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "service" && company.type === "Service") ||
      (activeTab === "product" && company.type === "Product");
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Company-Wise Questions</h1>
            <p className="text-muted-foreground">
              Practice questions from specific companies and track your readiness
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-primary">{allCompanies.length}</div>
              <div className="text-sm text-muted-foreground">Companies</div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {allCompanies.reduce((acc, c) => acc + c.problems, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Questions</div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {serviceCompanies.length}
              </div>
              <div className="text-sm text-muted-foreground">Service Companies</div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {productCompanies.length}
              </div>
              <div className="text-sm text-muted-foreground">Product Companies</div>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>

          {filteredCompanies.length === 0 && (
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
