import React, { useState } from 'react';
import PageHeader from "@/components/PageHeader";
import { useBakery } from "@/store/BakeryContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import PlaceOrderConfirmation from "@/components/PlaceOrderConfirmation";
import BakeryItemImage from "@/components/BakeryItemImage";
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

export default function Cart() {
  const navigate = useNavigate();
  const { placeOrder, cart: cartItems, updateCartItemQty: updateQty, removeFromCart: removeItem, clearCart } = useBakery();
  const [isOrdered, setIsOrdered] = useState(false);
  const [lastOrderId, setLastOrderId] = useState(null);

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    const newOrder = placeOrder(cartItems);
    setLastOrderId(newOrder.id);
    clearCart();
    setIsOrdered(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHeader 
        title="Your Basket" 
        subtitle="Review your selection before we start baking."
      />

      {cartItems.length === 0 ? (
        <Card className="border-dashed border-2 bg-muted/20 rounded-[2.5rem] p-16 text-center space-y-6">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-display font-black">Your basket is empty</h3>
            <p className="text-muted-foreground font-medium">Looks like you haven't added any treats yet.</p>
          </div>
          <Button onClick={() => navigate('/customer/menu')} className="rounded-xl font-bold px-8 h-12 shadow-lg">
            Back to Menu
          </Button>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <Card key={item.id} className="border-border/40 shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-4 flex items-center gap-4">
                  <BakeryItemImage 
                    src={item.image || "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=100&auto=format&fit=crop"} 
                    alt={item.name} 
                    className="w-20 h-20 rounded-xl shrink-0" 
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold truncate">{item.name}</h4>
                    <p className="text-sm font-black text-primary">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => updateQty(item.id, -1)}>
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-black">{item.qty}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => updateQty(item.id, 1)}>
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-berry hover:bg-berry/5 rounded-xl h-10 w-10" onClick={() => removeItem(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-warm bg-card rounded-3xl overflow-hidden">
              <div className="bg-primary p-6 text-primary-foreground">
                <h3 className="font-display font-black text-xl">Order Summary</h3>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="text-leaf">FREE</span>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-end">
                    <span className="font-display font-bold">Total Amount</span>
                    <span className="text-2xl font-display font-black text-primary">₹{total.toFixed(2)}</span>
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="w-full h-14 rounded-2xl font-black text-lg shadow-xl hover:-translate-y-1 transition-all gap-2">
                      Checkout <ArrowRight className="w-5 h-5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-2xl font-display font-black text-primary">Place your order?</AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground font-medium">
                        Your total is <strong>₹{total.toFixed(2)}</strong>. Once placed, our bakers will start preparing your fresh treats!
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-6 gap-3">
                      <AlertDialogCancel className="rounded-xl font-bold h-12 border-muted hover:bg-muted">Review Basket</AlertDialogCancel>
                      <AlertDialogAction onClick={handleCheckout} className="rounded-xl font-bold h-12 bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20">
                        Yes, Place Order
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground pt-2">
                  <CreditCard className="w-3 h-3" /> Secure Payment Enabled
                </div>
              </CardContent>
            </Card>
            
            <p className="text-center text-[11px] text-muted-foreground font-medium px-4">
              By placing an order, you agree to our terms of fresh delivery. Orders placed after 8 PM will be delivered the next morning.
            </p>
          </div>
        </div>
      )}
      <Dialog open={isOrdered} onOpenChange={setIsOrdered}>
        <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-md">
          <Card className="rounded-[2.5rem] overflow-hidden border-none shadow-2xl">
            <PlaceOrderConfirmation 
              orderId={lastOrderId} 
              onClose={() => {
                setIsOrdered(false);
                navigate('/customer/orders');
              }} 
            />
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
}
