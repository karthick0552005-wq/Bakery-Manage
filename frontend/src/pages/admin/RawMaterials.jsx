import React from 'react';
import PageHeader from "@/components/PageHeader";
import { useBakery } from "@/store/BakeryContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package, AlertTriangle, Truck, History } from "lucide-react";
import { toast } from "sonner";

export default function RawMaterials() {
  const { inventory } = useBakery();
  const materials = inventory.filter(i => i.category === "Raw Material");

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Raw Materials" 
        subtitle="Manage your bakery ingredients and supplier stock."
        action={
          <Button className="rounded-xl font-black gap-2 shadow-lg" onClick={() => toast.info("Supplier order form coming soon")}>
            <Plus className="w-5 h-5" /> New Purchase
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {materials.map(item => {
          const isLow = item.stock < item.min;
          return (
            <Card key={item.id} className={`group border-none shadow-card hover:shadow-warm transition-all rounded-[2rem] overflow-hidden ${isLow ? 'bg-berry/5 border-berry/20 border-2' : ''}`}>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-2xl ${isLow ? 'bg-berry/10 text-berry' : 'bg-primary/10 text-primary'}`}>
                    <Package className="w-6 h-6" />
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground hover:bg-muted">
                    <History className="w-4 h-4" />
                  </Button>
                </div>

                <div>
                  <h3 className="font-display font-black text-lg">{item.name}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.unit} based supply</p>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold text-muted-foreground">In Stock</span>
                    <span className={`text-xl font-display font-black ${isLow ? 'text-berry' : 'text-foreground'}`}>
                      {item.stock} {item.unit}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${isLow ? 'bg-berry' : 'bg-leaf'}`} 
                      style={{ width: `${Math.min((item.stock / (item.min * 2)) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {isLow ? (
                  <Button className="w-full rounded-xl font-bold bg-berry hover:bg-berry/90 h-10 gap-2" onClick={() => toast.success(`Restock request sent for ${item.name}`)}>
                    <Truck className="w-4 h-4" /> Order More
                  </Button>
                ) : (
                  <Button variant="secondary" className="w-full rounded-xl font-bold h-10" onClick={() => toast.info(`Please use the Inventory section to update ${item.name} count`)}>
                    Update Count
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-none shadow-card rounded-[2.5rem] bg-muted/20 p-12 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <AlertTriangle className="w-12 h-12 mx-auto text-amber-500 opacity-20" />
          <h3 className="font-display font-black text-xl">Ingredient Wastage Tracking</h3>
          <p className="text-sm text-muted-foreground font-medium">
            Remember to log daily wastage to maintain accurate inventory levels. 
            Accurate counts help reduce cost and improve profit margins.
          </p>
          <Button variant="outline" className="rounded-xl font-bold border-primary/20 text-primary hover:bg-primary/5">
            Log Daily Wastage
          </Button>
        </div>
      </Card>
    </div>
  );
}
