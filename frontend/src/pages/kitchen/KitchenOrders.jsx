import React from 'react';
import PageHeader from "@/components/PageHeader";
import { useBakery } from "@/store/BakeryContext";
import StatusBadge from "@/components/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, History, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Printer } from "lucide-react";

export default function KitchenOrders() {
  const { orders } = useBakery();
  const [selectedOrder, setSelectedOrder] = React.useState(null);

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Kitchen Master Queue" 
        subtitle="Full history and current status of all orders assigned to this kitchen."
        action={
          <Button variant="outline" className="rounded-xl font-bold gap-2">
            <History className="w-4 h-4" /> Archive
          </Button>
        }
      />

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search orders..." 
            className="pl-10 rounded-xl bg-card border-border/40 h-12 font-medium"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="rounded-xl font-bold gap-2">
            <Filter className="w-4 h-4" /> All Stages
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-[2.5rem] border border-border/40 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 border-b">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order Ref</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Kitchen Load</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Time In</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-8 py-5">
                    <span className="font-bold text-sm">#{order.id.slice(-5)}</span>
                    <p className="text-[10px] text-muted-foreground font-medium">{order.customerName}</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {order.items.map((i, idx) => (
                        <span key={idx} className="bg-muted px-2 py-0.5 rounded text-[10px] font-bold">
                          {i.qty}x {i.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium">
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-8 py-5">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-8 py-5 text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full hover:bg-primary/10 hover:text-primary transition-all"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] p-0 border-none shadow-2xl bg-white overflow-hidden max-h-[95vh] flex flex-col">
          {selectedOrder && (
            <>
              {/* Fixed Header */}
              <div className="bg-primary p-8 text-primary-foreground relative shrink-0">
                <DialogHeader className="space-y-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
                      #{selectedOrder.id.slice(-5)}
                    </span>
                    <StatusBadge status={selectedOrder.status} />
                  </div>
                  <DialogTitle className="text-3xl font-display font-black leading-tight">
                    Order Master File
                  </DialogTitle>
                  <p className="text-primary-foreground/70 font-medium text-sm">
                    Time In: {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </DialogHeader>
              </div>

              {/* Scrollable Body */}
              <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground border-b pb-2">Customer</h4>
                  <p className="font-black text-xl">{selectedOrder.customerName}</p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground border-b pb-2">Batch Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-black text-primary">
                            {item.qty}x
                          </span>
                          <span className="font-bold">{item.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Fixed Footer */}
              <div className="p-8 pt-4 shrink-0 bg-muted/10">
                <Button onClick={() => toast.success("Kitchen slip printed")} className="w-full rounded-2xl font-black h-16 text-lg gap-2 shadow-xl hover:-translate-y-1 transition-all bg-primary text-primary-foreground">
                  <Printer className="w-5 h-5" /> Print Prep Slip
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
