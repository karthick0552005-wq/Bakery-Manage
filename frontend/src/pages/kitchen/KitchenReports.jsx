import React from 'react';
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import { useBakery } from "@/store/BakeryContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, Timer, CheckCircle2, TrendingUp, Download, Printer, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function KitchenReports() {
  const { orders, productionLog, menu } = useBakery();

  const completedOrders = orders.filter(o => o.status === "Completed" || o.status === "Ready" || o.status === "Delivered");
  const pendingOrders = orders.filter(o => o.status === "Pending" || o.status === "Preparing");
  const totalProduced = productionLog.reduce((s, p) => s + (p.qty || 0), 0);
  const totalMenuItems = menu.today.length;

  const stats = [
    { label: "Orders Completed", value: completedOrders.length, icon: CheckCircle2, color: "text-leaf" },
    { label: "Orders In Queue", value: pendingOrders.length, icon: Timer, color: "text-primary" },
    { label: "Items Produced", value: totalProduced, icon: ChefHat, color: "text-accent" },
    { label: "Menu Items Today", value: totalMenuItems, icon: TrendingUp, color: "text-crust" },
  ];

  // Item-wise production count from productionLog
  const productionMap = {};
  productionLog.forEach(log => {
    if (!productionMap[log.itemName]) productionMap[log.itemName] = 0;
    productionMap[log.itemName] += log.qty || 0;
  });
  const productionItems = Object.entries(productionMap)
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty);

  const maxProd = productionItems[0]?.qty || 1;

  // Order count by item from completed orders
  const itemOrderMap = {};
  orders.forEach(order => {
    order.items?.forEach(item => {
      if (!itemOrderMap[item.name]) itemOrderMap[item.name] = 0;
      itemOrderMap[item.name] += item.qty || 1;
    });
  });
  const orderedItems = Object.entries(itemOrderMap)
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  const handleExport = () => {
    if (productionLog.length === 0 && orders.length === 0) {
      toast.error("No kitchen data to export yet");
      return;
    }
    const headers = ["Item", "Qty Produced", "Completed At"];
    const rows = productionLog.map(p => [
      p.itemName, p.qty, new Date(p.completedAt).toLocaleString()
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Kitchen_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success("Kitchen report downloaded!");
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Kitchen Performance"
        subtitle="Real-time data on orders completed, production output, and menu coverage."
        action={
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl font-bold gap-2" onClick={() => window.print()}>
              <Printer className="w-4 h-4" /> Print
            </Button>
            <Button className="rounded-xl font-black gap-2 shadow-lg" onClick={handleExport}>
              <Download className="w-5 h-5" /> Export Stats
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <Card key={s.label} className="border-none shadow-card rounded-[2rem] overflow-hidden group">
            <CardContent className="p-6 relative">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <s.icon className="h-24 w-24 -mr-12 -mt-12" />
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-2xl bg-muted/50 ${s.color}`}>
                  <s.icon className="h-6 w-6" />
                </div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{s.label}</p>
              <p className="font-display text-3xl font-black text-foreground mt-1">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Production Log */}
        <Card className="border-none shadow-card rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="font-display font-black text-2xl">Production Output</CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-2 space-y-5">
            {productionItems.length === 0 ? (
              <div className="py-12 text-center">
                <ChefHat className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground italic">No production batches completed yet.</p>
                <p className="text-xs text-muted-foreground mt-1">Complete a batch from Production page to see data here.</p>
              </div>
            ) : (
              productionItems.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-sm">{item.name}</span>
                    <span className="text-xs font-black text-leaf">{item.qty} pcs produced</span>
                  </div>
                  <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-leaf rounded-full transition-all duration-700"
                      style={{ width: `${(item.qty / maxProd) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Most Ordered Items */}
        <Card className="border-none shadow-card rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="font-display font-black text-2xl">Most Ordered Items</CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-2 space-y-5">
            {orderedItems.length === 0 ? (
              <div className="py-12 text-center">
                <ShoppingBag className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground italic">No customer orders yet.</p>
                <p className="text-xs text-muted-foreground mt-1">When customers place orders, demand data will appear here.</p>
              </div>
            ) : (
              orderedItems.map((item, idx) => {
                const maxOrd = orderedItems[0]?.qty || 1;
                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-primary bg-primary/10 w-5 h-5 rounded-full flex items-center justify-center">{idx + 1}</span>
                        <span className="font-bold text-sm">{item.name}</span>
                      </div>
                      <span className="text-xs font-black text-primary">{item.qty} ordered</span>
                    </div>
                    <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-700"
                        style={{ width: `${(item.qty / maxOrd) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Production Log Table */}
      {productionLog.length > 0 && (
        <Card className="border-none shadow-card rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="font-display font-black text-2xl">Recent Production Log</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/30 border-b">
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Item</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Qty Produced</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Completed At</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {productionLog.slice(0, 10).map((log, idx) => (
                    <tr key={idx} className="hover:bg-muted/20 transition-colors">
                      <td className="px-8 py-4 font-bold text-sm">{log.itemName}</td>
                      <td className="px-8 py-4">
                        <span className="font-black text-leaf">{log.qty} pcs</span>
                      </td>
                      <td className="px-8 py-4 text-xs text-muted-foreground font-medium">
                        {new Date(log.completedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
