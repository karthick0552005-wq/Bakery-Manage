import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PageHeader from "@/components/PageHeader";
import { useBakery } from "@/store/BakeryContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Clock, Truck, ChefHat, MapPin, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const steps = [
  { id: 'Pending', label: 'Order Received', icon: Clock, description: 'We have received your order and are confirming it with the kitchen.' },
  { id: 'Preparing', label: 'In the Oven', icon: ChefHat, description: 'Our bakers are working their magic. Your treats are being baked fresh.' },
  { id: 'Ready', label: 'Ready for Pickup', icon: Check, description: 'Hot and fresh! Your order is packed and waiting for the courier.' },
  { id: 'Delivering', label: 'On the Way', icon: Truck, description: 'Our delivery partner is zooming towards your location.' },
  { id: 'Delivered', label: 'Enjoy!', icon: MapPin, description: 'Order delivered. Time to dive into those delicious bakes!' },
];

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');
  const { orders } = useBakery();
  
  const order = orders.find(o => o.id === orderId) || orders[0];

  if (!order) return null;

  const currentStepIndex = steps.findIndex(s => s.id === order.status);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link to="/customer/orders">
        <Button variant="ghost" size="sm" className="rounded-xl font-bold gap-2 text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Button>
      </Link>

      <PageHeader 
        title={`Tracking #${order.id.slice(-5)}`} 
        subtitle="Stay updated as your order moves from the oven to your door."
      />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-card rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8">
              <div className="relative space-y-12">
                {/* Vertical Line */}
                <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-muted" />
                
                {steps.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  
                  return (
                    <div key={step.id} className={`relative flex gap-6 transition-all duration-500 ${isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                      <div className={`z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${
                        isCompleted ? 'bg-primary text-primary-foreground scale-110' : 'bg-muted text-muted-foreground'
                      }`}>
                        <step.icon className={`w-5 h-5 ${isCurrent ? 'animate-pulse' : ''}`} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className={`font-display font-black text-lg ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.label}
                        </h4>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-warm bg-primary text-primary-foreground rounded-3xl p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Estimated Arrival</p>
                  <p className="text-xl font-display font-black">15 - 20 Mins</p>
                </div>
              </div>
              <div className="h-px bg-white/20" />
              <div className="space-y-4">
                <p className="text-xs font-bold leading-relaxed opacity-90">
                  Your courier, <span className="font-black">Alex</span>, is currently picking up orders from the kitchen.
                </p>
                <Button 
                  className="w-full bg-white text-primary hover:bg-butter rounded-xl font-bold h-12"
                  onClick={() => {
                    toast.info("Connecting to Alex...");
                    setTimeout(() => {
                      window.location.href = "tel:+919876543210";
                    }, 800);
                  }}
                >
                  Call Courier
                </Button>
              </div>
            </div>
          </Card>

          <Card className="border-border/40 shadow-sm rounded-3xl p-6">
            <h4 className="font-display font-black mb-4">Order Summary</h4>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="font-bold text-muted-foreground">{item.qty}x {item.name}</span>
                  <span className="font-black">₹{item.price * item.qty}</span>
                </div>
              ))}
              <div className="border-t pt-3 flex justify-between">
                <span className="font-display font-black">Total Paid</span>
                <span className="font-display font-black text-primary">₹{order.total}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
