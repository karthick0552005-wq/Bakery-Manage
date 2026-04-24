import React from 'react';
import PageHeader from "@/components/PageHeader";
import { useBakery } from "@/store/BakeryContext";
import { Card, CardContent } from "@/components/ui/card";
import { ChefHat, ClipboardList, Timer, CheckSquare, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function KitchenTodayMenu() {
  const { menu } = useBakery();
  const activeMenu = menu.today.filter(item => item.published);

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Today's Prep List" 
        subtitle="Operational view of the menu items being served from the kitchen today."
        action={
          <Button variant="outline" className="rounded-xl font-bold gap-2">
            <Printer className="w-4 h-4" /> Print Prep Sheet
          </Button>
        }
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeMenu.map(item => (
          <Card key={item.id} className="border-none shadow-card rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 bg-primary text-primary-foreground flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-display font-black text-xl">{item.name}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{item.category}</p>
                </div>
                <ChefHat className="w-6 h-6 opacity-30" />
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 p-3 rounded-2xl bg-muted/50 border border-border/50">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <ClipboardList className="w-3 h-3" />
                      <span className="text-[10px] font-black uppercase tracking-widest">In Stock</span>
                    </div>
                    <p className="text-xl font-display font-black text-foreground">{item.stock}</p>
                  </div>
                  <div className="space-y-1 p-3 rounded-2xl bg-muted/50 border border-border/50">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Timer className="w-3 h-3" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Est. Prep</span>
                    </div>
                    <p className="text-xl font-display font-black text-foreground">15m</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Prep Tasks</p>
                  <div className="space-y-2">
                    {['Check ingredient freshness', 'Monitor baking temperature', 'Quality check batch'].map((task, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm font-medium p-2 hover:bg-muted/30 rounded-lg transition-colors cursor-pointer group">
                        <CheckSquare className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span>{task}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full rounded-xl font-bold h-10 bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                  Update Stock Level
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
