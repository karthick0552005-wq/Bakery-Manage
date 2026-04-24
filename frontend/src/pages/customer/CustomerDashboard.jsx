import React from 'react';
import PageHeader from "@/components/PageHeader";
import { useBakery } from "@/store/BakeryContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Star, Clock, ArrowRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import BakeryItemImage from "@/components/BakeryItemImage";

export default function CustomerDashboard() {
  const { menu, orders, addToCart } = useBakery();
  
  const featuredItems = menu.today.filter(item => item.published).slice(0, 3);
  const recentOrders = orders.slice(0, 2);

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-hero p-8 md:p-16 text-primary-foreground shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000')] bg-cover bg-center" />
        </div>
        <div className="relative z-10 space-y-6 max-w-2xl">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em]">Crafted with Love</span>
          <h1 className="text-4xl md:text-6xl font-display font-black leading-tight tracking-tight">
            Rise and Shine with <br /> <span className="text-butter">Fresh Bakes.</span>
          </h1>
          <p className="text-lg opacity-90 font-medium max-w-md">
            The scent of happiness is waiting for you. Explore today's special batches from our cloud kitchen.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Button size="lg" className="bg-white text-primary hover:bg-butter rounded-2xl font-black px-8 h-14 shadow-xl hover:-translate-y-1 transition-all" asChild>
              <Link to="/customer/menu">Browse Menu</Link>
            </Button>
            <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 rounded-2xl font-bold h-14" asChild>
              <Link to="/customer/orders">Track Orders</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Today's Special */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-black flex items-center gap-2">
              <Star className="w-6 h-6 text-accent" /> Today's Batch
            </h2>
            <Link to="/customer/menu" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {menu.today.slice(0, 3).map(item => (
              <Card key={item.id} className="group border-none shadow-card hover:shadow-warm transition-all rounded-[2.5rem] overflow-hidden bg-card">
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <div className="absolute top-4 right-4 z-10">
                    <Button size="icon" variant="secondary" className="rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className="w-4 h-4 text-berry" />
                    </Button>
                  </div>
                  <BakeryItemImage 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full" 
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-display font-black text-xl">{item.name}</h3>
                    <span className="font-display font-black text-lg text-primary">₹{item.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium mb-4">Warm, flaky, and baked fresh this morning.</p>
                  <Button 
                    className="w-full rounded-xl font-bold bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                    onClick={() => addToCart(item)}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-black flex items-center gap-2">
            <Clock className="w-6 h-6 text-primary" /> My Recent Orders
          </h2>
          
          {recentOrders.length === 0 ? (
            <Card className="border-dashed border-2 bg-muted/20 rounded-[2rem]">
              <CardContent className="p-10 text-center space-y-4">
                <ShoppingBag className="w-10 h-10 mx-auto text-muted-foreground/30" />
                <p className="text-sm font-medium text-muted-foreground">Hungry? Your first order is just a few clicks away!</p>
                <Link to="/customer/menu">
                  <Button size="sm" variant="outline" className="rounded-xl font-bold border-primary/20 text-primary hover:bg-primary/5">
                    Order Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {recentOrders.map(order => (
                <Card key={order.id} className="border-border/40 shadow-sm rounded-2xl overflow-hidden">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black">
                      #{order.id.slice(-3)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate text-sm">{order.items.map(i => i.name).join(', ')}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-leaf/10 text-leaf">
                          {order.status}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-bold">
                          ₹{order.total}
                        </span>
                      </div>
                    </div>
                    <Link to="/customer/orders">
                      <Button size="icon" variant="ghost" className="rounded-full h-8 w-8">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="p-6 rounded-[2rem] bg-accent/5 border border-accent/20 space-y-3">
            <div className="flex items-center gap-2 text-accent">
              <Star className="w-4 h-4 fill-current" />
              <p className="text-xs font-black uppercase tracking-widest">Member Perks</p>
            </div>
            <p className="text-sm font-medium leading-relaxed text-muted-foreground">
              Collect crumbs with every order! You're only 5 orders away from a free Cinnamon Roll.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
