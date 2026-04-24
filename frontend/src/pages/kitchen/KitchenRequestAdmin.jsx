import React, { useState } from 'react';
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Send, MessageSquare, AlertTriangle, Tool, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function KitchenRequestAdmin() {
  const [request, setRequest] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!request) return;
    toast.success("Request sent to Admin dashboard.");
    setRequest("");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <PageHeader 
        title="Admin Request" 
        subtitle="Need help? Send operational requests or maintenance alerts directly to the admin."
      />

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="border-none shadow-warm rounded-[2.5rem] p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Button type="button" variant="outline" className="h-20 rounded-2xl flex flex-col gap-2 border-primary/20 hover:bg-primary/5">
                  <Package className="w-6 h-6 text-primary" />
                  <span className="text-[10px] font-black uppercase">Restock</span>
                </Button>
                <Button type="button" variant="outline" className="h-20 rounded-2xl flex flex-col gap-2 border-berry/20 hover:bg-berry/5">
                  <AlertTriangle className="w-6 h-6 text-berry" />
                  <span className="text-[10px] font-black uppercase">Urgent</span>
                </Button>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Describe Your Request</p>
                <Textarea 
                  placeholder="E.g. Need 50kg Flour, Oven #3 making clicking sound..."
                  className="min-h-[150px] rounded-2xl bg-muted/30 border-none p-4"
                  value={request}
                  onChange={(e) => setRequest(e.target.value)}
                />
              </div>

              <Button className="w-full h-14 rounded-2xl font-black text-lg shadow-xl gap-2">
                <Send className="w-5 h-5" /> Send Request
              </Button>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-primary text-primary-foreground space-y-4 shadow-lg">
            <h4 className="font-display font-black text-xl">Quick Tip</h4>
            <p className="text-sm opacity-80 leading-relaxed">
              Requests are usually answered within 15 minutes by the admin on duty.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
