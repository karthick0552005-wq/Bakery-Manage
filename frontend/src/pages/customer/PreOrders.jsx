import React, { useState } from 'react';
import PageHeader from "@/components/PageHeader";
import { useBakery } from "@/store/BakeryContext";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Gift, Info, Plus, Minus, ShoppingBag, ArrowRight, Sunrise } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import BakeryItemImage from "@/components/BakeryItemImage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function PreOrders() {
  const { menu, placeOrder } = useBakery();
  const [selectedItem, setSelectedItem] = useState(null);
  const [qty, setQty] = useState(1);
  const [deliveryTime, setDeliveryTime] = useState("8:00 AM");
  const [note, setNote] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const tomorrowItems = menu.tomorrow || [];

  const handlePreOrder = () => {
    if (!selectedItem) return;
    
    const preOrderItems = [{
      ...selectedItem,
      qty,
      note,
      deliveryTime,
      isPreOrder: true,
    }];

    placeOrder(preOrderItems);
    toast.success(`Pre-order placed for ${selectedItem.name}!`, {
      description: `${qty}x will be ready by ${deliveryTime} tomorrow.`,
    });

    setSelectedItem(null);
    setQty(1);
    setNote("");
    setConfirmOpen(false);
  };

  const total = selectedItem ? selectedItem.price * qty : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <PageHeader 
        title="Pre-Order for Tomorrow" 
        subtitle="Browse tomorrow's menu and book your favorites in advance."
        action={
          <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full border border-accent/20">
            <Sunrise className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">Tomorrow's Menu</span>
          </div>
        }
      />

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm rounded-2xl p-5 flex gap-4 items-center bg-primary/5 border border-primary/10">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Order Before 8 PM</h4>
            <p className="text-[11px] text-muted-foreground font-medium">Fresh 8 AM delivery tomorrow.</p>
          </div>
        </Card>

        <Card className="border-none shadow-sm rounded-2xl p-5 flex gap-4 items-center bg-leaf/5 border border-leaf/10">
          <div className="w-10 h-10 bg-leaf/10 rounded-xl flex items-center justify-center text-leaf shrink-0">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Bulk Discount</h4>
            <p className="text-[11px] text-muted-foreground font-medium">15% off on 50+ items.</p>
          </div>
        </Card>

        <Card className="border-none shadow-sm rounded-2xl p-5 flex gap-4 items-center bg-accent/5 border border-accent/10">
          <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Free Cancellation</h4>
            <p className="text-[11px] text-muted-foreground font-medium">Cancel up to 12 hours before.</p>
          </div>
        </Card>
      </div>

      {/* Tomorrow's Menu Grid */}
      {tomorrowItems.length === 0 ? (
        <Card className="border-dashed border-2 bg-muted/20 rounded-[2.5rem] p-16 text-center space-y-6">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-display font-black">Tomorrow's menu isn't ready yet</h3>
            <p className="text-muted-foreground font-medium">The admin hasn't published the menu for tomorrow. Check back later!</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tomorrowItems.map(item => (
            <Card key={item.id} className="group border-none shadow-card hover:shadow-warm transition-all rounded-[2rem] overflow-hidden">
              <div className="aspect-square relative overflow-hidden">
                <BakeryItemImage 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full" 
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-accent/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white">
                    {item.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-primary">
                    Tomorrow
                  </span>
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display font-black text-lg group-hover:text-primary transition-colors">{item.name}</h3>
                    <p className="text-xs text-muted-foreground font-medium">Pre-order available</p>
                  </div>
                  <span className="font-display font-black text-lg text-foreground">${item.price}</span>
                </div>
                
                <Button 
                  className="w-full rounded-xl font-bold h-12 gap-2 bg-accent hover:bg-accent/90 text-white"
                  onClick={() => {
                    setSelectedItem(item);
                    setQty(1);
                    setNote("");
                  }}
                >
                  <Calendar className="w-4 h-4" /> Pre-Order Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pre-Order Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="sm:max-w-[480px] rounded-[2.5rem] p-0 border-none shadow-2xl bg-white overflow-hidden">
          {selectedItem && (
            <>
              <div className="bg-accent p-8 text-white relative">
                <DialogHeader className="space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                      Pre-Order
                    </span>
                  </div>
                  <DialogTitle className="text-3xl font-display font-black leading-tight tracking-tight">
                    {selectedItem.name}
                  </DialogTitle>
                  <p className="text-white/70 font-medium text-sm">
                    Schedule for tomorrow's delivery
                  </p>
                </DialogHeader>
              </div>

              <div className="p-8 space-y-6">
                {/* Quantity */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Quantity</label>
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-xl h-12 w-12"
                      onClick={() => setQty(Math.max(1, qty - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-16 text-center text-2xl font-display font-black">{qty}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-xl h-12 w-12"
                      onClick={() => setQty(qty + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <div className="flex-1 text-right">
                      <p className="text-2xl font-display font-black text-primary">${total}</p>
                      <p className="text-[10px] text-muted-foreground font-bold">${selectedItem.price} each</p>
                    </div>
                  </div>
                </div>

                {/* Delivery Time */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Preferred Delivery Time</label>
                  <Select value={deliveryTime} onValueChange={setDeliveryTime}>
                    <SelectTrigger className="rounded-xl h-12 bg-muted/30 border-none font-bold">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl">
                      <SelectItem value="7:00 AM" className="rounded-lg font-bold">7:00 AM — Early Bird</SelectItem>
                      <SelectItem value="8:00 AM" className="rounded-lg font-bold">8:00 AM — Morning Fresh</SelectItem>
                      <SelectItem value="10:00 AM" className="rounded-lg font-bold">10:00 AM — Mid-Morning</SelectItem>
                      <SelectItem value="12:00 PM" className="rounded-lg font-bold">12:00 PM — Lunch Batch</SelectItem>
                      <SelectItem value="4:00 PM" className="rounded-lg font-bold">4:00 PM — Afternoon Tea</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Special Note */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Special Instructions (Optional)</label>
                  <Input 
                    placeholder="e.g. Extra glaze, no nuts, cut into pieces..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="rounded-xl h-12 bg-muted/30 border-none font-medium"
                  />
                </div>

                {/* Confirm Button */}
                <Button 
                  className="w-full rounded-2xl font-black h-14 text-lg gap-2 shadow-xl hover:-translate-y-1 transition-all bg-accent hover:bg-accent/90 text-white"
                  onClick={() => setConfirmOpen(true)}
                >
                  Place Pre-Order <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-display font-black text-accent">Confirm Pre-Order?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-medium space-y-2">
              <span className="block">You're ordering <strong>{qty}x {selectedItem?.name}</strong> for tomorrow.</span>
              <span className="block">Delivery by <strong>{deliveryTime}</strong>.</span>
              <span className="block text-lg font-display font-black text-foreground mt-2">Total: ${total.toFixed(2)}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel className="rounded-xl font-bold h-12 border-muted hover:bg-muted">Go Back</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handlePreOrder} 
              className="rounded-xl font-bold h-12 bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/20"
            >
              Yes, Confirm Pre-Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Note */}
      <div className="p-6 rounded-[2rem] bg-muted/20 border border-dashed border-border flex items-start gap-4">
        <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
        <div className="space-y-1">
          <p className="text-sm font-bold">Important Note</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Pre-orders require a minimum of 24 hours notice for custom batches. 
            Cancellations are allowed up to 12 hours before the scheduled preparation time.
            All pre-orders will be baked fresh on the delivery date.
          </p>
        </div>
      </div>
    </div>
  );
}
