import React from 'react';
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Info, AlertTriangle, ChefHat, Clock } from "lucide-react";

export default function KitchenNotifications() {
  const notifications = [
    { id: 1, type: "Urgent", title: "Expedited Order", message: "Order #9928 requires immediate attention (Customer Anniversary).", time: "5 mins ago" },
    { id: 2, type: "Stock", title: "Ingredient Restock", message: "100kg Flour has been delivered to the loading bay.", time: "40 mins ago" },
    { id: 3, type: "Admin", title: "Menu Change", message: "Admin added 'Cinnamon Swirl' to today's active menu.", time: "2 hours ago" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHeader 
        title="Kitchen Alerts" 
        subtitle="Stay in the loop with live updates from the admin and store."
      />

      <div className="space-y-4">
        {notifications.map((n) => (
          <Card key={n.id} className="border-none shadow-sm bg-card rounded-2xl overflow-hidden hover:translate-x-1 transition-transform">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className={`p-3 rounded-xl ${n.type === 'Urgent' ? 'bg-berry/10 text-berry' : 'bg-primary/10 text-primary'}`}>
                  {n.type === 'Urgent' ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-foreground">{n.title}</h4>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {n.time}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">{n.message}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
