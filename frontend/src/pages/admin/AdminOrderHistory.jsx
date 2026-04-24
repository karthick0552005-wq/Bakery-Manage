import React from 'react';
import PageHeader from "@/components/PageHeader";
import { useBakery } from "@/store/BakeryContext";
import StatusBadge from "@/components/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Filter, Download, MoreVertical, Eye, CheckCircle2, XCircle, Printer, Truck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { exportToCSV } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useBakery();
  const [selectedOrder, setSelectedOrder] = React.useState(null);

  const handleExport = () => {
    const exportData = orders.map(order => ({
      ID: order.id,
      Customer: order.customerName,
      Items: order.items.map(i => `${i.qty}x ${i.name}`).join('; '),
      Total: order.total,
      Status: order.status,
      Date: new Date(order.createdAt).toLocaleString()
    }));
    
    exportToCSV(exportData, `Bakery_Orders_${new Date().toISOString().split('T')[0]}`);
    toast.success("Orders exported to CSV");
  };

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Order Management" 
        subtitle="Track and manage all customer orders across the platform."
      />

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search orders by ID or customer..." 
            className="pl-10 rounded-xl bg-card border-border/40 h-12 font-medium"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="rounded-xl font-bold gap-2" onClick={() => toast.info("Filter options coming soon")}>
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-[2.5rem] border border-border/40 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 border-b">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order ID</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Customer</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Items</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-muted/20 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-bold text-sm">#{order.id.slice(-5)}</span>
                    <p className="text-[10px] text-muted-foreground font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-sm">{order.customerName}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">Standard Delivery</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">{order.items.length} items</p>
                    <p className="text-[10px] text-muted-foreground truncate max-w-[150px]">
                      {order.items.map(i => i.name).join(', ')}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-display font-black text-primary">₹{order.total}</span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="rounded-lg hover:bg-primary/10 hover:text-primary" onClick={() => setSelectedOrder(order)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-lg">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 shadow-xl border-border/40">
                          <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground p-2">Order Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="rounded-lg font-bold gap-2 py-2.5">
                                <Truck className="w-4 h-4 text-primary" /> Start Preparing
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-2xl font-display font-black text-primary">Start preparing order?</AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground font-medium">
                                  This will mark Order #{order.id.slice(-5)} as in-progress.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="mt-6 gap-3">
                                <AlertDialogCancel className="rounded-xl font-bold h-12 border-muted hover:bg-muted">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => updateOrderStatus(order.id, "Preparing")} className="rounded-xl font-bold h-12 bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20">
                                  Yes, Start Prep
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="rounded-lg font-bold gap-2 py-2.5">
                                <CheckCircle2 className="w-4 h-4 text-leaf" /> Mark as Ready
                              </DropdownMenuItem>
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

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="rounded-lg font-bold gap-2 py-2.5">
                                <Truck className="w-4 h-4 text-blue-500" /> Send for Delivery
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-2xl font-display font-black text-blue-600">Send order for delivery?</AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground font-medium">
                                  Order #{order.id.slice(-5)} will be handed to the delivery partner. The customer will be notified.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="mt-6 gap-3">
                                <AlertDialogCancel className="rounded-xl font-bold h-12 border-muted hover:bg-muted">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => updateOrderStatus(order.id, "Delivering")} className="rounded-xl font-bold h-12 bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20">
                                  Yes, Send for Delivery
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="rounded-lg font-bold gap-2 py-2.5">
                                <CheckCircle2 className="w-4 h-4 text-leaf" /> Mark Delivered
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-2xl font-display font-black text-leaf">Order delivered?</AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground font-medium">
                                  Confirm that Order #{order.id.slice(-5)} has been successfully delivered to the customer.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="mt-6 gap-3">
                                <AlertDialogCancel className="rounded-xl font-bold h-12 border-muted hover:bg-muted">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => updateOrderStatus(order.id, "Delivered")} className="rounded-xl font-bold h-12 bg-leaf text-white hover:bg-leaf/90 shadow-lg shadow-leaf/20">
                                  Yes, Mark Delivered
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <DropdownMenuItem onClick={() => toast.success("Invoice sent to printer")} className="rounded-lg font-bold gap-2 py-2.5">
                            <Printer className="w-4 h-4 text-muted-foreground" /> Print Invoice
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="rounded-lg font-bold gap-2 py-2.5 text-berry focus:text-berry focus:bg-berry/5">
                                <XCircle className="w-4 h-4" /> Cancel Order
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-2xl font-display font-black text-berry">Cancel this order?</AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground font-medium">
                                  This will notify the customer that their order has been voided. This action cannot be reversed.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="mt-6 gap-3">
                                <AlertDialogCancel className="rounded-xl font-bold h-12 border-muted hover:bg-muted">Keep Order</AlertDialogCancel>
                                <AlertDialogAction onClick={() => updateOrderStatus(order.id, "Cancelled")} className="rounded-xl font-bold h-12 bg-berry text-white hover:bg-berry/90 shadow-lg shadow-berry/20">
                                  Yes, Cancel Order
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
                        <span className="font-display font-black text-primary">₹{item.price * item.qty}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-dashed flex items-center justify-between">
                  <span className="text-lg font-black">Total Amount</span>
                  <span className="text-3xl font-display font-black text-primary">₹{selectedOrder.total}</span>
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
