import React from 'react';
import PageHeader from "@/components/PageHeader";
import { useBakery } from "@/store/BakeryContext";
import StatusBadge from "@/components/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, History, PackageCheck } from "lucide-react";

export default function KitchenCompleted() {
  const { orders } = useBakery();
  const completed = orders.filter(o => o.status === "Ready" || o.status === "Delivered");

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Completed Batches" 
        subtitle="Historical log of orders that have been successfully baked and packed."
      />

      <div className="bg-card rounded-[2.5rem] border border-border/40 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 border-b">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order Ref</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Finished Items</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Time Completed</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {completed.map(order => (
                <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-8 py-5">
                    <span className="font-bold text-sm">#{order.id.slice(-5)}</span>
                    <p className="text-[10px] text-muted-foreground font-medium">{order.customerName}</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-wrap gap-1">
                      {order.items.map((i, idx) => (
                        <span key={idx} className="bg-leaf/10 text-leaf px-2 py-0.5 rounded text-[10px] font-bold">
                          {i.qty}x {i.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium opacity-60">
                    Today, {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-leaf">
                      <PackageCheck className="w-4 h-4" />
                      <span className="text-xs font-black uppercase tracking-widest">{order.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
