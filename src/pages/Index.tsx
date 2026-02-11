import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackgroundOrbs, StaggerContainer, StaggerItem, HoverCard } from "@/components/layout/AnimatedLayout";
import {
  Code2, Building2, Brain, Target, Users, Zap, BookOpen,
  MessageSquare, ArrowRight, CheckCircle2, Trophy, Sparkles } from
"lucide-react";

const features = [
{ icon: Code2, title: "Interview-Style Problems", description: "Practice with real questions asked in TCS, Infosys, Zoho, Amazon, Google & more." },
{ icon: Building2, title: "Company-Wise Questions", description: "Filter problems by company with round-wise patterns and frequency indicators." },
{ icon: Brain, title: "AI Mentor", description: "Get hints, explanations, and interview simulation from our AI chatbot mentor." },
{ icon: Target, title: "Learning Paths", description: "Follow structured 30, 60, or 90-day plans for service and product companies." }];


const companies = [
{ name: "TCS", type: "service" }, { name: "Infosys", type: "service" },
{ name: "Wipro", type: "service" }, { name: "Zoho", type: "service" },
{ name: "Amazon", type: "product" }, { name: "Google", type: "product" },
{ name: "Microsoft", type: "product" }, { name: "Flipkart", type: "product" }];


const stats = [
{ value: "500+", label: "Interview Problems" }, { value: "50+", label: "Companies" },
{ value: "15+", label: "Topic Patterns" }, { value: "10K+", label: "Students" }];


export default function Index() {
  const location = useLocation();
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const state = location.state as {showLoginAnimation?: boolean;} | null;
    if (state?.showLoginAnimation) {
      setShowAnimation(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-background relative">
      <BackgroundOrbs />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--primary)/0.06)] via-transparent to-transparent" />

        <div className="container relative mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mx-auto max-w-4xl text-center">

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--primary)/0.3)] bg-[hsl(var(--primary)/0.08)] px-4 py-1.5 text-sm text-primary neon-border">

              <Sparkles className="h-4 w-4" />
              <span>v1.0 Now Live — Premium Placement Prep</span>
            </motion.div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Master Coding Interviews
              <br />
              With{" "}
              <span className="gradient-text">Real-Time Practice</span>.
            </h1>

            <p className="mb-10 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
              Prepare for service & product company interviews with interview-style problems, 
              company-wise questions, and AI-powered mentoring.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4">

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
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border/50 glass-panel">
        <div className="container mx-auto px-4">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8" delay={0.2}>
            {stats.map((stat) =>
            <StaggerItem key={stat.label}>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              </StaggerItem>
            )}
          </StaggerContainer>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16">

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why <span className="gradient-text">CodeCrack</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to prepare for your next technical interview in a single, integrated platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) =>
            <HoverCard key={feature.title}>
                <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="group relative rounded-xl border border-border/50 glass-card p-6 transition-all duration-300 hover:border-[hsl(var(--primary)/0.4)] hover:neon-glow">

                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(var(--primary)/0.1)] text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-semibold text-lg">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              </HoverCard>
            )}
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-20 md:py-32 glass-panel border-y border-border/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16">

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prepare for <span className="gradient-text">Top Companies</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Practice with questions from India's most sought-after tech employers.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {companies.map((company, i) =>
            <motion.div
              key={company.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}>

                <Link
                to={`/companies/${company.name.toLowerCase()}`}
                className="group flex items-center justify-center gap-3 rounded-xl border border-border/50 glass-card p-6 transition-all duration-300 hover:border-[hsl(var(--primary)/0.4)] hover:shadow-[var(--shadow-glow)]">

                  <Building2 className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="font-medium group-hover:text-primary transition-colors">{company.name}</span>
                </Link>
              </motion.div>
            )}
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16">

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How <span className="gradient-text">CodeCrack</span> Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A structured approach to crack your next coding interview.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
            { step: "01", icon: BookOpen, title: "Learn the Pattern", description: "Understand the thought process and approach before writing any code." },
            { step: "02", icon: Code2, title: "Practice Problems", description: "Solve interview-style problems with real-time feedback and hints." },
            { step: "03", icon: MessageSquare, title: "Get AI Mentoring", description: "Ask questions, get explanations, and simulate mock interviews." }].
            map((item, i) =>
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative">

                <div className="text-6xl font-bold gradient-text opacity-20 mb-4">{item.step}</div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(var(--primary)/0.1)] text-primary mb-4">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 border-t border-border/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--primary)/0.05)] to-transparent" />
        <div className="container relative mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>

            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to <span className="gradient-text">Crack</span> Your Interview?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-10">
              Join thousands of Indian students and freshers who are preparing smarter with CodeCrack.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup">
                Start Practicing Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>);

}