import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChefHat } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative">
          <div className="text-[12rem] font-display font-black text-muted/30 select-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-primary rounded-[2rem] flex items-center justify-center text-white shadow-warm animate-bounce">
              <ChefHat className="w-12 h-12" />
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-display font-black">Burnt Toast!</h1>
          <p className="text-muted-foreground font-medium">
            The page you are looking for has either been eaten or never existed in our oven.
          </p>
        </div>

        <Link to="/" className="inline-block">
          <Button className="rounded-xl font-black h-14 px-8 shadow-lg hover:-translate-y-1 transition-all gap-2">
            <ArrowLeft className="w-5 h-5" /> Back to Safety
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
