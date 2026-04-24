import React from 'react';
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { ChefHat, Flame, Scale, Thermometer } from "lucide-react";

export default function KitchenProduction() {
  const batches = [
    { id: "B-201", name: "Morning Sourdough", stage: "Baking", temp: "220°C", load: "12 units" },
    { id: "B-202", name: "Artisanal Croissants", stage: "Proofing", temp: "28°C", load: "24 units" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Production Line" 
        subtitle="Live tracking of industrial baking batches and quality metrics."
      />

      <div className="grid md:grid-cols-2 gap-6">
        {batches.map(b => (
          <Card key={b.id} className="border-none shadow-card rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-lg">{b.name}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Batch ID: {b.id}</p>
                  </div>
                </div>
                <span className="bg-crust text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  {b.stage}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-muted/50 flex items-center gap-3">
                  <Thermometer className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Temp</p>
                    <p className="font-bold">{b.temp}</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-muted/50 flex items-center gap-3">
                  <Scale className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Load</p>
                    <p className="font-bold">{b.load}</p>
                  </div>
                </div>
              </div>

              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-2/3 animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
