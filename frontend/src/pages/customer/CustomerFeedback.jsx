import React, { useState } from 'react';
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Send, Heart, Utensils, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

import { useBakery } from "@/store/BakeryContext";

export default function CustomerFeedback() {
  const { addFeedback } = useBakery();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    addFeedback(rating, comment);
    toast.success("Thank you for your feedback!", {
      description: "Our bakers love hearing from you."
    });
    setRating(0);
    setComment("");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <PageHeader 
        title="Share Your Thoughts" 
        subtitle="Did you love our bakes? Let us know how we can make your day sweeter."
      />

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="border-none shadow-warm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4 text-center">
                <p className="text-sm font-black uppercase tracking-widest text-primary">How was your order?</p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className="transition-all duration-200 hover:scale-125 outline-none"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                    >
                      <Star 
                        className={`w-10 h-10 ${
                          star <= (hover || rating) 
                            ? 'fill-amber-400 text-amber-400' 
                            : 'text-muted fill-muted'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Your Message</p>
                  <Textarea 
                    placeholder="Tell us about the taste, texture, and delivery..."
                    className="min-h-[150px] rounded-3xl bg-muted/30 border-none p-6 font-medium focus-visible:ring-primary/20"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
                <Button className="w-full h-14 rounded-2xl font-black text-lg gap-2 shadow-xl hover:-translate-y-1 transition-all">
                  <Send className="w-5 h-5" /> Submit Feedback
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Heart className="w-24 h-24 -mr-8 -mt-8" />
            </div>
            <h3 className="font-display font-black text-xl mb-4">Our Promise</h3>
            <p className="text-sm leading-relaxed opacity-90 font-medium">
              Every piece of feedback is read by our head baker. We strive for perfection in every batch.
            </p>
          </Card>

          <div className="p-6 rounded-3xl border-2 border-dashed border-muted flex flex-col items-center text-center space-y-3">
            <Utensils className="w-8 h-8 text-primary/30" />
            <p className="text-xs font-bold text-muted-foreground">Loved a specific item? Tag it in your comment!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
