import React from 'react';
import PageHeader from "@/components/PageHeader";
import { useBakery } from "@/store/BakeryContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Plus, Clock, ChefHat, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function MenuPlanning() {
  const { menu, rolloverTomorrowToToday } = useBakery();

  const dayPlans = [
    { label: "Today", items: menu.today, status: "Active", date: "April 22, 2026", color: "text-primary", bg: "bg-primary/5" },
    { label: "Tomorrow", items: menu.tomorrow, status: "Planned", date: "April 23, 2026", color: "text-leaf", bg: "bg-leaf/5" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Production Planning" 
        subtitle="Manage what's baking today and what's rising for tomorrow."
        action={
          <div className="flex gap-4">
            <Button 
              onClick={rolloverTomorrowToToday} 
              variant="outline" 
              className="rounded-xl font-bold gap-2 border-leaf/30 text-leaf hover:bg-leaf hover:text-white"
            >
              <CheckCircle2 className="w-4 h-4" /> Start New Day
            </Button>
            <Link to="/admin/menu">
              <Button className="rounded-xl font-bold gap-2 shadow-lg">
                <Plus className="w-4 h-4" /> Manage Full Menu
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid lg:grid-cols-2 gap-8">
        {dayPlans.map((plan) => (
          <Card key={plan.label} className="border-none shadow-card rounded-[2.5rem] overflow-hidden group">
            <div className={`p-8 ${plan.bg} border-b border-white/20 flex items-center justify-between`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className={`font-display font-black text-3xl ${plan.color}`}>{plan.label}</h3>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white shadow-sm ${plan.color}`}>
                    {plan.status}
                  </span>
                </div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {plan.date}
                </p>
              </div>
              <div className={`w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center ${plan.color}`}>
                <ChefHat className="w-8 h-8" />
              </div>
            </div>
            
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Product List</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</p>
                </div>
                {plan.items.map(item => (
                  <div key={item.id} className="flex items-center justify-between group/item">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center overflow-hidden border border-border/40">
                        <img 
                          src={item.category === "Bread" 
                            ? "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=100&auto=format&fit=crop" 
                            : "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=100&auto=format&fit=crop"
                          } 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-bold text-foreground group-hover/item:text-primary transition-colors">{item.name}</span>
                    </div>
                    {item.published ? (
                      <span className="flex items-center gap-1 text-[10px] font-black text-leaf uppercase">
                        <CheckCircle2 className="w-3 h-3" /> Published
                      </span>
                    ) : (
                      <span className="text-[10px] font-black text-muted-foreground uppercase">Draft</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link to="/admin/publish-menu">
                  <Button variant="secondary" className="w-full rounded-2xl font-black h-14 group-hover:bg-primary group-hover:text-primary-foreground transition-all gap-2 shadow-sm">
                    Review & Publish Plan <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
