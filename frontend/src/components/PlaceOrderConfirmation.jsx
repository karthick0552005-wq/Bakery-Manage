import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function PlaceOrderConfirmation({ orderId, onClose }) {
  return (
    <div className="p-8 text-center space-y-6">
      <div className="w-20 h-20 bg-leaf/10 rounded-full flex items-center justify-center mx-auto text-leaf animate-in zoom-in duration-500">
        <CheckCircle2 className="w-12 h-12" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-3xl font-display font-black text-foreground">Order Placed!</h2>
        <p className="text-muted-foreground font-medium">Your treats are being prepped in the oven.</p>
      </div>

      <div className="bg-muted/30 p-4 rounded-2xl border border-border/40">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Order Number</p>
        <p className="text-xl font-display font-black text-primary">#{orderId?.slice(-5)}</p>
      </div>

      <div className="flex flex-col gap-3">
        <Link to="/customer/track-order" onClick={onClose} className="w-full">
          <Button className="w-full h-14 rounded-2xl font-black gap-2 shadow-lg">
            Track Live Status <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
        <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold">
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}
