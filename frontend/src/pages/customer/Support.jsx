import React from 'react';
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageCircle, Phone, Mail, FileText, ChevronRight, MessageSquare } from "lucide-react";

export default function Support() {
  const faqs = [
    { q: "How long does delivery take?", a: "Standard delivery takes 30-45 minutes depending on your location from our cloud kitchen." },
    { q: "Are your bakes gluten-free?", a: "We have a specific section for gluten-free bakes. Please check the tags in our menu." },
    { q: "Can I cancel my order?", a: "Orders can be cancelled within 5 minutes of being placed, before the kitchen starts preparation." },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <PageHeader 
        title="Help & Support" 
        subtitle="We're here to help make your experience as smooth as a fresh glaze."
      />

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-none shadow-card hover:shadow-warm transition-all rounded-[2rem] p-8 text-center space-y-4">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
            <MessageCircle className="w-7 h-7" />
          </div>
          <h3 className="font-display font-black text-lg">Live Chat</h3>
          <p className="text-xs text-muted-foreground font-medium">Average response: 2 mins</p>
          <Button className="w-full rounded-xl font-bold h-10 shadow-md">Start Chat</Button>
        </Card>

        <Card className="border-none shadow-card hover:shadow-warm transition-all rounded-[2rem] p-8 text-center space-y-4">
          <div className="w-14 h-14 bg-leaf/10 rounded-2xl flex items-center justify-center mx-auto text-leaf">
            <Phone className="w-7 h-7" />
          </div>
          <h3 className="font-display font-black text-lg">Call Us</h3>
          <p className="text-xs text-muted-foreground font-medium">Mon-Sun, 8am-10pm</p>
          <Button variant="outline" className="w-full rounded-xl font-bold h-10 border-leaf/20 text-leaf hover:bg-leaf/5">Call Now</Button>
        </Card>

        <Card className="border-none shadow-card hover:shadow-warm transition-all rounded-[2rem] p-8 text-center space-y-4">
          <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto text-accent">
            <Mail className="w-7 h-7" />
          </div>
          <h3 className="font-display font-black text-lg">Email Support</h3>
          <p className="text-xs text-muted-foreground font-medium">Response within 24 hours</p>
          <Button variant="ghost" className="w-full rounded-xl font-bold h-10 hover:bg-accent/5 text-accent">Send Email</Button>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-display font-black flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-primary" /> Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <Card key={i} className="border-border/40 shadow-sm rounded-2xl overflow-hidden group">
              <CardContent className="p-6 cursor-pointer hover:bg-muted/20 transition-colors">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-bold text-foreground">{faq.q}</p>
                    <p className="text-sm text-muted-foreground font-medium hidden group-hover:block transition-all animate-in fade-in slide-in-from-top-1">
                      {faq.a}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:rotate-90 transition-transform" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="border-none shadow-warm bg-secondary rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-8">
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm">
          <FileText className="w-10 h-10 text-primary" />
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
          <h3 className="font-display font-black text-xl">Operational Guide</h3>
          <p className="text-sm text-muted-foreground font-medium">
            Learn more about our baking processes, quality standards, and delivery terms in our detailed guide.
          </p>
        </div>
        <Button className="rounded-xl font-bold px-8 h-12 shadow-lg">View Guide</Button>
      </Card>
    </div>
  );
}
