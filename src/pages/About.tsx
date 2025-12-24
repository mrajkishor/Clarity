import { Link } from 'react-router-dom';
import { ArrowLeft, Target, Users, ListChecks, BarChart3, RefreshCw, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const steps = [
  {
    icon: Target,
    title: 'Define Your Long-Term Goals',
    description: 'Start by writing down what truly matters to you — career, health, learning, personal growth.'
  },
  {
    icon: ListChecks,
    title: 'Break Goals into Tasks',
    description: 'Convert goals into small, achievable tasks you can act on daily.'
  },
  {
    icon: Sparkles,
    title: 'Plan Your Day',
    description: 'Focus on a few high-impact tasks instead of overloading yourself.'
  },
  {
    icon: BarChart3,
    title: 'Track Progress',
    description: 'Use built-in analytics to understand patterns, consistency, and momentum.'
  },
  {
    icon: RefreshCw,
    title: 'Review and Adjust',
    description: 'Reflect regularly and refine goals as your priorities evolve.'
  }
];

const philosophyPoints = [
  'Progress beats perfection',
  'Consistency matters more than intensity',
  'Calm focus leads to sustainable growth'
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 lg:py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild className="gap-2">
              <Link to="/">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to App</span>
              </Link>
            </Button>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-serif font-medium tracking-tight">
                About Clarity
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        {/* What is Clarity */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl font-serif font-medium mb-4 text-foreground">
            What is Clarity?
          </h2>
          <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
            Clarity is a personal productivity and focus app designed to help you set meaningful 
            long-term goals, break them into actionable tasks, track progress with calm analytics, 
            and build consistency over time — without burnout.
          </p>
        </section>

        {/* Who is this for */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl font-serif font-medium mb-4 text-foreground">
            Who is this app for?
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground text-sm sm:text-base">
                Professionals managing daily work and long-term ambitions
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground text-sm sm:text-base">
                Students preparing for exams or skill growth
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground text-sm sm:text-base">
                Anyone who wants structure without complexity
              </span>
            </li>
          </ul>
        </section>

        {/* How to Use */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl font-serif font-medium mb-6 text-foreground">
            How to Use Clarity
          </h2>
          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-foreground mb-1 text-sm sm:text-base">
                      {index + 1}. {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Philosophy */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl font-serif font-medium mb-4 text-foreground">
            Philosophy
          </h2>
          <p className="text-muted-foreground mb-4 text-sm sm:text-base">
            Clarity is built on the idea that:
          </p>
          <ul className="space-y-2">
            {philosophyPoints.map((point, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <span className="text-foreground text-sm sm:text-base font-medium">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Privacy & Simplicity */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl font-serif font-medium mb-4 text-foreground">
            Privacy & Simplicity
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground text-sm sm:text-base">
                Your data stays private — stored locally on your device
              </span>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground text-sm sm:text-base">
                No unnecessary notifications or interruptions
              </span>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground text-sm sm:text-base">
                Minimal design to reduce cognitive load
              </span>
            </div>
          </div>
        </section>

        {/* Back to App CTA */}
        <div className="pt-8 border-t border-border">
          <Button asChild className="w-full sm:w-auto">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Start Using Clarity
            </Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <p className="text-xs text-muted-foreground text-center">
            Focus on what matters. Reflect on what works.
          </p>
        </div>
      </footer>
    </div>
  );
}
