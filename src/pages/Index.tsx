import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Code2,
  Building2,
  Brain,
  Target,
  Users,
  Zap,
  BookOpen,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "Interview-Style Problems",
    description: "Practice with real questions asked in TCS, Infosys, Zoho, Amazon, Google & more.",
  },
  {
    icon: Building2,
    title: "Company-Wise Questions",
    description: "Filter problems by company with round-wise patterns and frequency indicators.",
  },
  {
    icon: Brain,
    title: "AI Mentor",
    description: "Get hints, explanations, and interview simulation from our AI chatbot mentor.",
  },
  {
    icon: Target,
    title: "Learning Paths",
    description: "Follow structured 30, 60, or 90-day plans for service and product companies.",
  },
];

const companies = [
  { name: "TCS", type: "service" },
  { name: "Infosys", type: "service" },
  { name: "Wipro", type: "service" },
  { name: "Zoho", type: "service" },
  { name: "Amazon", type: "product" },
  { name: "Google", type: "product" },
  { name: "Microsoft", type: "product" },
  { name: "Flipkart", type: "product" },
];

const stats = [
  { value: "500+", label: "Interview Problems" },
  { value: "50+", label: "Companies" },
  { value: "15+", label: "Topic Patterns" },
  { value: "10K+", label: "Students" },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <Zap className="h-4 w-4" />
              <span>v1.0 Now Live</span>
            </div>

            {/* Headline */}
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Master Coding Interviews
              <br />
              With{" "}
              <span className="gradient-text">Real-Time Practice</span>.
            </h1>

            {/* Subheadline */}
            <p className="mb-10 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
              Prepare for service & product company interviews with interview-style problems, 
              company-wise questions, and AI-powered mentoring.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/problems">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/companies">
                  <Building2 className="mr-2 h-5 w-5" />
                  Browse Companies
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why <span className="gradient-text">CodeCrack</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to prepare for your next technical interview in a single, integrated platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold text-lg">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-20 md:py-32 bg-card/50 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prepare for Top Companies
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Practice with questions from India's most sought-after tech employers.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {companies.map((company) => (
              <Link
                key={company.name}
                to={`/companies/${company.name.toLowerCase()}`}
                className="group flex items-center justify-center gap-3 rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-md"
              >
                <Building2 className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="font-medium group-hover:text-primary transition-colors">{company.name}</span>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button variant="outline" size="lg" asChild>
              <Link to="/companies">
                View All Companies <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How CodeCrack Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A structured approach to crack your next coding interview.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                icon: BookOpen,
                title: "Learn the Pattern",
                description: "Understand the thought process and approach before writing any code.",
              },
              {
                step: "02",
                icon: Code2,
                title: "Practice Problems",
                description: "Solve interview-style problems with real-time feedback and hints.",
              },
              {
                step: "03",
                icon: MessageSquare,
                title: "Get AI Mentoring",
                description: "Ask questions, get explanations, and simulate mock interviews.",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-bold text-primary/10 mb-4">{item.step}</div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 border-t border-border bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Crack Your Interview?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-10">
            Join thousands of Indian students and freshers who are preparing smarter with CodeCrack.
          </p>
          <Button variant="hero" size="xl" asChild>
            <Link to="/signup">
              Start Practicing Free <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
