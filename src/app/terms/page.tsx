"use client";

import Header from "@/components/Header";
import Reveal from "@/components/Reveal";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 font-outfit pb-20">
      <Header />
      
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <h1 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">
              Terms of <span className="gradient-text">Service</span>
            </h1>
            <p className="text-muted-foreground mb-12 italic">Last Updated: April 4, 2026</p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-xl font-bold mb-4">1. Acceptance of Terms</h2>
                <p>Welcome to BuzzThrills. By accessing our website and using our services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our platform.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">2. Service Description</h2>
                <p>BuzzThrills provides a platform for booking surprise phone calls, digital letters, and other personalized experiences. We act as a service provider using professional agents to deliver these surprises.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">3. User Conduct</h2>
                <p>You agree not to use our services for any unlawful purpose or to solicit the performance of any illegal activity. Prank calls must be conducted in good faith and must not constitute harassment or intimidation of any individual. If you have concerns, please contact our Support Team.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">4. Payment & Refunds</h2>
                <p>All payments are processed securely through our partners. We offer full refunds if our professional agents are unable to initiate a call within the specified time slot for reasons within our control.</p>
              </section>

              <section className="p-8 rounded-3xl glass border border-secondary/20 bg-secondary/5">
                <h2 className="text-xl font-bold mb-4 text-secondary">5. Limitation of Liability</h2>
                <p className="mb-0">BuzzThrills is not liable for any indirect, incidental, or consequential damages resulting from the use of our service or the content of the calls/letters provided.</p>
              </section>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
