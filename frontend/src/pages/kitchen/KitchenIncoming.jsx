import React, { useState } from 'react';
import PageHeader from "@/components/PageHeader";
import { useBakery } from "@/store/BakeryContext";
import StatusBadge from "@/components/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Clock, ChefHat, CheckCircle2, ArrowRight, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Printer, Sparkles, ShoppingBag, Calendar } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

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


export default function KitchenIncoming() {
  const { orders, menu, updateOrderStatus, completeProductionBatch, productionLog } = useBakery();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const incoming = orders.filter(o => o.status === "Pending" || o.status === "Preparing");
  const productionList = menu.today;
  const [produceQty, setProduceQty] = useState({});

  const getProduceQty = (id) => produceQty[id] || 5;
  const setItemQty = (id, val) => setProduceQty(prev => ({ ...prev, [id]: Math.max(1, val) }));

  const handleCompleteBatch = (itemId, itemName, dayContext) => {
    const qty = getProduceQty(itemId);
    completeProductionBatch(itemId, qty, dayContext);
    setProduceQty(prev => ({ ...prev, [itemId]: 5 }));
  };

  const getProducedTotal = (itemName) => {
    return productionLog
      ?.filter(p => p.itemName === itemName)
      .reduce((sum, p) => sum + p.qty, 0) || 0;
  };

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Production Queue" 
        subtitle="Manage daily baking batches and stock replenishment."
        action={
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full border border-primary/20">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Kitchen Control</span>
          </div>
        }
      />

      <Tabs defaultValue="today" className="w-full">
        <TabsList className="bg-muted/50 p-1 rounded-2xl h-16 w-full md:w-auto border border-border/40 mb-8">
          <TabsTrigger value="today" className="rounded-xl font-black px-10 h-14 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg gap-3 transition-all">
            <Sparkles className="w-5 h-5" />
            <div className="flex flex-col items-start leading-tight">
              <span className="text-sm">Today's Production</span>
              <span className="text-[9px] uppercase tracking-widest opacity-70">Live Shop Stock</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="tomorrow" className="rounded-xl font-black px-10 h-14 data-[state=active]:bg-leaf data-[state=active]:text-white data-[state=active]:shadow-lg gap-3 transition-all">
            <Calendar className="w-5 h-5" />
            <div className="flex flex-col items-start leading-tight">
              <span className="text-sm">Tomorrow's Prep</span>
              <span className="text-[9px] uppercase tracking-widest opacity-70">Admin Plan</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-6 p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <p className="text-xs font-bold text-primary uppercase tracking-widest">Active Batch: Producing for Today</p>
          </div>
          <MenuGrid items={menu.today} dayContext="today" />
        </TabsContent>

        <TabsContent value="tomorrow" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-6 p-4 bg-leaf/5 border border-leaf/10 rounded-2xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-leaf animate-pulse" />
            <p className="text-xs font-bold text-leaf uppercase tracking-widest">Pre-Production: Planning for Tomorrow</p>
          </div>
          <MenuGrid items={menu.tomorrow} dayContext="tomorrow" />
        </TabsContent>
      </Tabs>
    </div>
  );

  function MenuGrid({ items, dayContext }) {
    if (items.length === 0) {
      return (
        <div className="p-20 text-center space-y-4 bg-muted/20 rounded-[2.5rem] border-2 border-dashed">
          <Sparkles className="w-12 h-12 mx-auto text-muted-foreground/20" />
          <p className="text-muted-foreground font-medium">No items planned for {dayContext} yet.</p>
        </div>
      );
    }

    return (
      <div className="grid md:grid-cols-2 gap-6">
        {items.map(item => {
          const produced = getProducedTotal(item.name);
          return (
            <Card key={item.id} className="border-border/40 shadow-sm rounded-2xl overflow-hidden group">
              <div className={`h-1.5 w-full ${produced > 0 ? 'bg-leaf' : 'bg-primary'}`} />
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-5">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display font-black text-xl">{item.name}</h3>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Target Stock</p>
                          <p className="text-xl font-display font-black">{item.stock} <span className="text-sm opacity-50">pcs</span></p>
                        </div>
                        <div className="h-8 w-px bg-border" />
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Batch Produced</p>
                          <p className={`text-xl font-display font-black ${produced > 0 ? 'text-leaf' : 'text-muted-foreground'}`}>{produced} <span className="text-sm opacity-50">pcs</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg" onClick={() => setItemQty(item.id, getProduceQty(item.id) - 1)}>
                        <Minus className="w-3 h-3" />
                      </Button>
                      <Input 
                        type="number" 
                        value={getProduceQty(item.id)} 
                        onChange={(e) => setItemQty(item.id, parseInt(e.target.value) || 1)}
                        className="w-16 text-center font-black text-lg border-none bg-transparent h-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg" onClick={() => setItemQty(item.id, getProduceQty(item.id) + 1)}>
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="flex-1 h-12 rounded-xl font-black gap-2 shadow-lg bg-primary hover:bg-primary/90">
                          <ChefHat className="w-5 h-5" /> Start Batch {getProduceQty(item.id)}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-2xl font-display font-black text-primary">Log Production?</AlertDialogTitle>
                          <AlertDialogDescription className="text-muted-foreground font-medium">
                            Starting a batch of <strong>{getProduceQty(item.id)} {item.name}</strong>. This will update live stock for {dayContext}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-6 gap-3">
                          <AlertDialogCancel className="rounded-xl font-bold h-12 border-muted hover:bg-muted">Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleCompleteBatch(item.id, item.name, dayContext)} 
                            className="rounded-xl font-bold h-12 bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
                          >
                            Yes, Log Production
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }
}