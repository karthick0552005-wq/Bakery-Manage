import React from 'react';
import PageHeader from "@/components/PageHeader";
import { useBakery } from "@/store/BakeryContext";
import StatusBadge from "@/components/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight, MapPin, PackageCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function CustomerOrders() {
  const { orders } = useBakery();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <PageHeader 
        title="My Orders" 
        subtitle="Track your current treats and view your baking history."
      />

      {orders.length === 0 ? (
        <Card className="border-dashed border-2 bg-muted/20 rounded-[2.5rem] p-20 text-center space-y-6">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-display font-black">No orders yet</h3>
            <p className="text-muted-foreground font-medium">Your delicious journey starts with your first order.</p>
          </div>
          <Link to="/customer/menu">
            <Button className="rounded-xl font-bold px-8 h-12 shadow-lg">
              Explore Menu
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <Card key={order.id} className="border-border/40 shadow-sm hover:shadow-md transition-shadow rounded-[2rem] overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="p-6 md:w-2/3 space-y-6">
                    <div className="flex flex-wrap items-center gap-4 justify-between">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order ID</p>
                        <h4 className="font-display font-black text-xl">#{order.id.slice(-5)}</h4>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Placed On</p>
                        <p className="text-sm font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</p>
                        <StatusBadge status={order.status} />
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-dashed">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-md bg-muted flex items-center justify-center text-xs font-black">{item.qty}x</span>
                            <span className="font-bold text-sm">{item.name}</span>
                          </div>
                          <span className="text-sm font-black">${item.price * item.qty}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-muted/30 p-6 md:w-1/3 flex flex-col justify-between gap-6 border-t md:border-t-0 md:border-l">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-primary mt-1" />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Delivery Address</p>
                          <p className="text-xs font-bold leading-relaxed">123 Baker Street, Apt 4B, Cloud City</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <PackageCheck className="w-4 h-4 text-leaf mt-1" />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Paid</p>
                          <p className="text-lg font-display font-black text-primary">${order.total.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    <Link to={`/customer/track-order?id=${order.id}`}>
                      <Button className="w-full rounded-xl font-bold gap-2">
                        Track Live <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
