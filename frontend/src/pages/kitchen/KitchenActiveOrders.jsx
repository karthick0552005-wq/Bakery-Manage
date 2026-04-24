import React from 'react';
import PageHeader from "@/components/PageHeader";
import { useBakery } from "@/store/BakeryContext";
import StatusBadge from "@/components/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { ChefHat, Timer, CheckCircle2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function KitchenActiveOrders() {
  const { orders, updateOrderStatus } = useBakery();
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const active = orders.filter(o => o.status === "Preparing");

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Live Prep Bench" 
        subtitle="Current batches actively being worked on by the kitchen team."
      />

      {active.length === 0 ? (
        <div className="p-20 text-center space-y-4 bg-muted/20 rounded-[2.5rem] border-2 border-dashed">
          <ChefHat className="w-12 h-12 mx-auto text-muted-foreground/20" />
          <p className="text-muted-foreground font-medium">Prep bench is clear. Check the incoming queue for new orders.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {active.map(order => (
            <Card key={order.id} className="border-none shadow-card rounded-[2.5rem] overflow-hidden border-l-8 border-l-crust">
              <CardContent className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-display font-black">#{order.id.slice(-5)}</h3>
                    <p className="text-sm font-bold text-muted-foreground">{order.customerName}</p>
                  </div>
                  <div className="flex items-center gap-2 text-primary">
                    <Timer className="w-4 h-4 animate-spin-slow" />
                    <span className="text-xs font-black uppercase tracking-widest">In Progress</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {order.items.map((i, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                      <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-xs font-black">{i.qty}x</span>
                      <span className="font-bold text-sm">{i.name}</span>
                    </div>
                  ))}
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="w-full h-14 rounded-2xl font-black bg-leaf hover:bg-leaf/90 gap-2 shadow-lg">
                      <CheckCircle2 className="w-5 h-5" /> Mark Ready
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-2xl font-display font-black text-leaf">Order ready for pickup?</AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground font-medium">
                        This will notify the customer that their order #{order.id.slice(-5)} is ready.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-6 gap-3">
                      <AlertDialogCancel className="rounded-xl font-bold h-12 border-muted hover:bg-muted">Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => updateOrderStatus(order.id, "Ready")} className="rounded-xl font-bold h-12 bg-leaf text-white hover:bg-leaf/90 shadow-lg shadow-leaf/20">
                        Yes, Mark Ready
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button 
                  variant="ghost" 
                  className="w-full rounded-xl font-bold text-muted-foreground hover:text-foreground mt-2"
                  onClick={() => setSelectedOrder(order)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] p-0 border-none shadow-2xl bg-white overflow-hidden max-h-[95vh] flex flex-col">
          {selectedOrder && (
            <>
              {/* Fixed Header */}
              <div className="bg-primary p-8 pb-10 text-primary-foreground relative shrink-0">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                    #{selectedOrder.id.slice(-5)}
                  </span>
                  <StatusBadge status={selectedOrder.status} />
                </div>
                <DialogHeader className="space-y-1">
                  <DialogTitle className="text-4xl font-display font-black leading-tight tracking-tight">
                    Order Details
                  </DialogTitle>
                  <p className="text-primary-foreground/60 font-medium text-sm">
                    Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </DialogHeader>
              </div>

              {/* Scrollable Body */}
              <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground border-b pb-2">Customer Info</h4>
                  <div>
                    <p className="font-black text-xl">{selectedOrder.customerName}</p>
                    <p className="text-sm text-muted-foreground font-medium mt-1">Delivery Address: 123 Bakery Lane, Sweet City</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground border-b pb-2">Items Ordered</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center font-black text-primary">
                            {item.qty}x
                          </div>
                          <span className="font-bold">{item.name}</span>
                        </div>
                        <span className="font-display font-black text-primary">${item.price * item.qty}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-dashed flex items-center justify-between">
                  <span className="text-lg font-black">Total Amount</span>
                  <span className="text-3xl font-display font-black text-primary">${selectedOrder.total}</span>
                </div>
              </div>

              {/* Fixed Footer */}
              <div className="p-8 pt-4 shrink-0 bg-muted/10">
                <Button onClick={() => toast.success("Invoice sent to printer")} className="w-full rounded-2xl font-black h-16 text-lg gap-2 shadow-xl hover:-translate-y-1 transition-all bg-primary text-primary-foreground">
                  <Printer className="w-5 h-5" /> Print Order Invoice
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
