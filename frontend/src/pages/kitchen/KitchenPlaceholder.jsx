import React from 'react';
import PageHeader from "@/components/PageHeader";
import { ChefHat } from "lucide-react";

export default function KitchenPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="w-24 h-24 bg-muted rounded-[2.5rem] flex items-center justify-center text-muted-foreground animate-pulse">
        <ChefHat className="w-12 h-12" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-display font-black">Kitchen Module Under Prep</h2>
        <p className="text-muted-foreground max-w-sm mx-auto font-medium">
          This specific kitchen sub-module is being calibrated for optimal performance. 
          Please check back shortly.
        </p>
      </div>
    </div>
  );
}
