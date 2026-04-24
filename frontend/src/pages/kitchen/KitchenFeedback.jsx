import React from 'react';
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MessageSquare, ChefHat, Clock, ThumbsUp } from "lucide-react";

export default function KitchenFeedback() {
  const feedbacks = [
    { id: 1, item: "Sourdough Bread", rating: 5, comment: "Crispy crust and perfect crumb. Great batch today!", date: "1 hour ago" },
    { id: 2, item: "Chocolate Croissant", rating: 4, comment: "Delicious, but could use a bit more chocolate filling.", date: "4 hours ago" },
    { id: 3, item: "Cinnamon Roll", rating: 5, comment: "The glaze is amazing. Best rolls ever!", date: "Yesterday" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Kitchen Feedback" 
        subtitle="Direct feedback from customers about the items prepared in this kitchen."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-card bg-primary text-primary-foreground rounded-3xl p-6">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Kitchen Rating</p>
          <div className="flex items-end gap-2">
            <h3 className="text-4xl font-display font-black">4.9</h3>
            <Star className="w-6 h-6 fill-butter text-butter mb-2" />
          </div>
        </Card>
        <Card className="border-none shadow-card rounded-3xl p-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Top Rated Item</p>
          <h3 className="text-xl font-display font-black">Sourdough Bread</h3>
        </Card>
        <Card className="border-none shadow-card rounded-3xl p-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Recent Positives</p>
          <h3 className="text-4xl font-display font-black">+12</h3>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-display font-black flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" /> Live Feedback Feed
        </h3>
        {feedbacks.map((f) => (
          <Card key={f.id} className="border-border/40 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center overflow-hidden border border-border/40">
                    <img 
                      src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=100&auto=format&fit=crop" 
                      alt="Product" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-foreground">{f.item}</h4>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className={`w-3 h-3 ${s <= f.rating ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium italic">"{f.comment}"</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {f.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-leaf bg-leaf/10 px-3 py-1 rounded-full flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" /> Motivator
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="p-12 rounded-[2.5rem] bg-accent/5 border border-dashed border-accent/20 text-center space-y-4">
        <ChefHat className="w-12 h-12 mx-auto text-accent opacity-20" />
        <h4 className="font-display font-black text-xl text-accent">Chef's Corner</h4>
        <p className="text-sm text-muted-foreground font-medium max-w-md mx-auto">
          High ratings lead to monthly kitchen bonuses! Keep up the excellent work and maintain those high standards.
        </p>
      </div>
    </div>
  );
}
