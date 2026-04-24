import React from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import BakeryItemImage from "@/components/BakeryItemImage";

export default function AddToCartConfirmation({ item, onClose }) {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <BakeryItemImage 
          src={item?.image} 
          alt={item?.name} 
          className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl rotate-3 shrink-0" 
        />
        <div>
          <h3 className="font-display font-black text-xl">{item?.name}</h3>
          <p className="text-sm text-muted-foreground font-medium">Added to your shopping basket</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Link to="/customer/cart" onClick={onClose} className="w-full">
          <Button className="w-full h-14 rounded-2xl font-black gap-2 shadow-lg bg-leaf hover:bg-leaf/90">
            View Cart & Checkout <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
        <Button variant="ghost" onClick={onClose} className="w-full rounded-xl font-bold">
          Keep Browsing
        </Button>
      </div>
    </div>
  );
}
