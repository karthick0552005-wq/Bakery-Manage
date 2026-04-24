import React from 'react';
import PageHeader from "@/components/PageHeader";
import { useBakery } from "@/store/BakeryContext";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MessageSquare } from "lucide-react";

export default function AdminFeedback() {
  const { feedbacks } = useBakery();

  const avgRating = feedbacks.length > 0
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : "0.0";

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: feedbacks.filter(f => f.rating === star).length
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Customer Voice"
        subtitle="Review feedback and ratings from your bakery customers."
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-card bg-primary text-primary-foreground rounded-3xl p-6">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Average Rating</p>
          <div className="flex items-end gap-2 mt-2">
            <h3 className="text-4xl font-display font-black">{avgRating}</h3>
            <div className="flex mb-2">
              {[1, 2, 3, 4, 5].map(s => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${s <= Math.round(parseFloat(avgRating)) ? 'fill-white text-white' : 'text-white/20'}`}
                />
              ))}
            </div>
          </div>
        </Card>
        <Card className="border-none shadow-card rounded-3xl p-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Reviews</p>
          <h3 className="text-4xl font-display font-black mt-2">{feedbacks.length}</h3>
        </Card>
        <Card className="border-none shadow-card rounded-3xl p-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">5-Star Reviews</p>
          <h3 className="text-4xl font-display font-black mt-2">
            {feedbacks.filter(f => f.rating === 5).length}
          </h3>
        </Card>
      </div>

      {/* Rating Breakdown */}
      {feedbacks.length > 0 && (
        <Card className="border-none shadow-card rounded-[2.5rem] p-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-5">Rating Breakdown</p>
          <div className="space-y-3">
            {ratingCounts.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-16 shrink-0">
                  <span className="text-sm font-black">{star}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>
                <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-700"
                    style={{ width: feedbacks.length > 0 ? `${(count / feedbacks.length) * 100}%` : '0%' }}
                  />
                </div>
                <span className="text-xs font-black text-muted-foreground w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Feedback List */}
      <div className="space-y-4">
        {feedbacks.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed rounded-[2.5rem] bg-muted/20">
            <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium text-lg italic">No customer feedback received yet.</p>
            <p className="text-sm text-muted-foreground mt-1">Customers can submit feedback from their portal.</p>
          </div>
        ) : (
          feedbacks.map((f, idx) => (
            <Card key={f.id || idx} className="border-none shadow-card rounded-[2rem] overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-lg font-black text-primary">
                        {(f.customer || "A")[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-black text-base">{f.customer || "Anonymous"}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{f.date || "Recently"}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 shrink-0">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${s <= f.rating ? 'fill-amber-400 text-amber-400' : 'text-muted fill-muted'}`}
                      />
                    ))}
                  </div>
                </div>
                {f.comment && (
                  <div className="mt-4 p-4 bg-muted/30 rounded-2xl">
                    <p className="text-sm font-medium leading-relaxed text-foreground/80">"{f.comment}"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
