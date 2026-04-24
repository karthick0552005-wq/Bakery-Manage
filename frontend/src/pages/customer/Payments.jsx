import React from 'react';
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Plus, ShieldCheck, History, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Payments() {
  const cards = [
    { id: 1, type: "Visa", last4: "4242", expiry: "12/25", primary: true },
    { id: 2, type: "Mastercard", last4: "8888", expiry: "06/26", primary: false },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHeader 
        title="Payment Methods" 
        subtitle="Manage your saved cards and view your transaction history."
        action={
          <Button className="rounded-xl font-bold gap-2 shadow-lg">
            <Plus className="w-4 h-4" /> Add New Card
          </Button>
        }
      />

      <div className="grid md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <Card key={card.id} className={`border-none shadow-card rounded-[2rem] overflow-hidden relative ${card.primary ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
            <CardContent className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <CreditCard className="w-10 h-10 opacity-50" />
                {card.primary && <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-1 rounded">Primary</span>}
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Card Number</p>
                <p className="text-2xl font-display font-black tracking-widest">•••• •••• •••• {card.last4}</p>
              </div>
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Expiry</p>
                  <p className="font-bold">{card.expiry}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className={`rounded-lg ${card.primary ? 'text-white hover:bg-white/10' : ''}`}>Remove</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-card rounded-[2.5rem] border border-border/40 shadow-sm p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-leaf/10 rounded-2xl flex items-center justify-center text-leaf">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-display font-black text-xl">Secure Transactions</h3>
            <p className="text-sm text-muted-foreground font-medium">All payments are encrypted and processed securely via Stripe.</p>
          </div>
        </div>
        <Button variant="outline" className="rounded-xl font-bold h-12 px-8 border-primary/20 text-primary">
          <History className="w-4 h-4 mr-2" /> View Transactions
        </Button>
      </div>
    </div>
  );
}
