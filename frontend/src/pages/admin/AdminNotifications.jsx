import React from 'react';
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, BellRing, Clock, Info, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminNotifications() {
  const notifications = [
    { id: 1, type: "Alert", title: "Low Stock: Flour", message: "Kitchen is running low on Flour (only 15kg left).", time: "10 mins ago", unread: true },
    { id: 2, type: "Success", title: "Order #12345 Delivered", message: "Customer John Doe received their order successfully.", time: "1 hour ago", unread: false },
    { id: 3, type: "Info", title: "Kitchen Request", message: "Chef requested maintenance for Oven #2.", time: "3 hours ago", unread: true },
    { id: 4, type: "Alert", title: "New Feedback", message: "You received a 5-star review from Alice.", time: "Yesterday", unread: false },
  ];

  const getIcon = (type) => {
    switch(type) {
      case 'Alert': return <AlertCircle className="w-5 h-5 text-berry" />;
      case 'Success': return <CheckCircle2 className="w-5 h-5 text-leaf" />;
      case 'Info': return <Info className="w-5 h-5 text-primary" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHeader 
        title="Notifications" 
        subtitle="Stay updated with the latest activity from your bakery and kitchen."
        action={
          <Button variant="ghost" className="rounded-xl font-bold text-primary">
            Mark all as read
          </Button>
        }
      />

      <div className="space-y-4">
        {notifications.map((n) => (
          <Card key={n.id} className={`border-none shadow-sm transition-all rounded-2xl overflow-hidden ${n.unread ? 'bg-primary/5 border-l-4 border-l-primary' : 'bg-card opacity-80'}`}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className={`p-3 rounded-xl ${n.unread ? 'bg-white shadow-sm' : 'bg-muted/50'}`}>
                  {getIcon(n.type)}
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
                {n.unread && (
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="p-12 text-center space-y-4 opacity-30">
        <BellRing className="w-12 h-12 mx-auto" />
        <p className="text-sm font-medium">You're all caught up!</p>
      </div>
    </div>
  );
}
