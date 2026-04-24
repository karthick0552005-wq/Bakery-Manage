import React from 'react';
import PageHeader from "@/components/PageHeader";
import { useBakery } from "@/store/BakeryContext";
import StatusBadge from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, Timer, CheckCircle2, AlertTriangle, ArrowRight, Package, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function KitchenDashboard() {
  const { orders, inventory, menu } = useBakery();
  
  const pendingOrders = orders.filter(o => o.status === "Pending" || o.status === "Preparing");
  const lowStock = inventory.filter(i => i.stock < i.min);
  const productionList = menu.today;

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Kitchen Hub" 
        subtitle="Manage live orders and monitor ingredient levels."
        action={
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full border border-primary/20">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Integrated View</span>
            </div>
            <Button className="rounded-xl font-bold gap-2" asChild>
              <Link to="/kitchen/incoming">
                View Order Queue <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary text-primary-foreground border-none shadow-warm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <ChefHat className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest opacity-80">Active Orders</p>
              <p className="text-4xl font-display font-black">{pendingOrders.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-leaf/10 rounded-xl text-leaf">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Ready for Pickup</p>
              <p className="text-4xl font-display font-black">{orders.filter(o => o.status === "Ready").length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-berry/10 rounded-xl text-berry">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Low Stock Items</p>
              <p className="text-4xl font-display font-black">{lowStock.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Daily Production List */}
        <Card className="border-border/40 shadow-sm overflow-hidden lg:col-span-2">
          <CardHeader className="border-b bg-primary/5">
            <CardTitle className="text-lg font-display flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> Today's Production List
              </div>
              <Button variant="ghost" size="sm" className="text-xs font-bold gap-1" asChild>
                <Link to="/kitchen/incoming">View All <ArrowRight className="w-3 h-3" /></Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {productionList.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <p className="font-bold">No items published for today.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 divide-x divide-y border-b">
                {productionList.map(item => (
                  <div key={item.id} className="p-6 space-y-4 hover:bg-muted/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-muted overflow-hidden shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary/40">
                            <ChefHat className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm leading-tight">{item.name}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.category}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span>Target: {item.stock} pcs</span>
                        <span className="text-primary">80% Ready</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full w-[80%]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Active Orders */}
        <Card className="border-border/40 shadow-sm overflow-hidden">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Timer className="w-5 h-5 text-primary" /> Active Queue
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {pendingOrders.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="font-bold">Queue is clear!</p>
                <p className="text-sm">New orders will appear here.</p>
              </div>
            ) : (
              <div className="divide-y">
                {pendingOrders.slice(0, 5).map(o => (
                  <div key={o.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm">#{o.id.slice(-5)}</span>
                        <StatusBadge status={o.status} />
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">
                        {o.items.map(i => `${i.qty}x ${i.name}`).join(', ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-muted-foreground uppercase">{new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inventory Watchlist */}
        <Card className="border-border/40 shadow-sm overflow-hidden">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Package className="w-5 h-5 text-accent" /> Stock Watchlist
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {inventory.slice(0, 6).map(item => (
                <div key={item.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.stock < item.min ? 'bg-berry animate-pulse' : 'bg-leaf'}`} />
                    <span className="font-bold text-sm">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-black ${item.stock < item.min ? 'text-berry' : 'text-muted-foreground'}`}>
                      {item.stock} / {item.min} {item.unit}
                    </span>
                    <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${item.stock < item.min ? 'bg-berry' : 'bg-leaf'}`} 
                        style={{ width: `${Math.min((item.stock / (item.min * 1.5)) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-muted/20 border-t">
              <Link to="/kitchen/inventory" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                Manage full inventory <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
