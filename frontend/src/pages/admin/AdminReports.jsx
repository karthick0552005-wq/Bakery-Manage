import React from 'react';
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import { useBakery } from "@/store/BakeryContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, DollarSign, ShoppingCart, Users, Download, Calendar, Package } from "lucide-react";
import { exportToCSV } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminReports() {
  const { orders, purchases } = useBakery();
  const [dateRange, setDateRange] = React.useState("All Time");

  const filterByDate = (items) => {
    if (dateRange === "All Time") return items;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return items.filter(item => {
      const itemDateObj = new Date(item.createdAt || item.date || Date.now());
      const itemDate = new Date(itemDateObj.getFullYear(), itemDateObj.getMonth(), itemDateObj.getDate());
      
      const diffTime = itemDate.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      if (dateRange === "Today") return diffDays === 0;
      if (dateRange === "Yesterday") return diffDays === -1;
      if (dateRange === "Tomorrow") return diffDays === 1;
      if (dateRange === "Last 7 Days") return diffDays <= 0 && diffDays >= -7;
      if (dateRange === "This Month") return itemDateObj.getMonth() === now.getMonth() && itemDateObj.getFullYear() === now.getFullYear();
      
      return true;
    });
  };

  const filteredOrders = filterByDate(orders);
  const filteredPurchases = filterByDate(purchases);

  const totalRevenue = filteredOrders.reduce((s, o) => s + o.total, 0);
  const totalPurchaseCost = filteredPurchases.reduce((s, p) => s + (p.total || 0), 0);
  const completedOrders = filteredOrders.filter(o => o.status === "Completed" || o.status === "Delivered");
  const pendingOrders = filteredOrders.filter(o => o.status === "Pending");
  const uniqueCustomers = new Set(filteredOrders.map(o => o.customerName)).size;

  // Top selling items from all orders
  const itemSalesMap = {};
  filteredOrders.forEach(order => {
    order.items?.forEach(item => {
      if (!itemSalesMap[item.name]) itemSalesMap[item.name] = { qty: 0, revenue: 0 };
      itemSalesMap[item.name].qty += item.qty || 1;
      itemSalesMap[item.name].revenue += (item.price || 0) * (item.qty || 1);
    });
  });
  const topItems = Object.entries(itemSalesMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  const maxQty = topItems[0]?.qty || 1;

  // Order status breakdown
  const statusCounts = {
    Pending: filteredOrders.filter(o => o.status === "Pending").length,
    Preparing: filteredOrders.filter(o => o.status === "Preparing").length,
    Ready: filteredOrders.filter(o => o.status === "Ready").length,
    Completed: filteredOrders.filter(o => o.status === "Completed" || o.status === "Delivered").length,
  };

  const handleExport = () => {
    if (filteredOrders.length === 0) { toast.error("No data available to export"); return; }
    
    const exportData = filteredOrders.map(o => ({
      "Order ID": o.id,
      "Customer": o.customerName,
      "Total Revenue": `$${o.total.toFixed(2)}`,
      "Status": o.status,
      "Date": new Date(o.createdAt).toLocaleDateString(),
      "Time": new Date(o.createdAt).toLocaleTimeString(),
      "Items Count": o.items?.length || 0
    }));

    exportToCSV(exportData, `Bakery_Business_Report_${new Date().toISOString().split('T')[0]}`);
    toast.success("Business report exported to CSV");
  };

  const stats = [
    { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-leaf", bg: "bg-leaf" },
    { label: "Total Orders", value: filteredOrders.length, icon: ShoppingCart, color: "text-primary", bg: "bg-primary" },
    { label: "Unique Customers", value: uniqueCustomers, icon: Users, color: "text-accent", bg: "bg-accent" },
    { label: "Purchase Costs", value: `$${totalPurchaseCost.toFixed(2)}`, icon: Package, color: "text-berry", bg: "bg-berry" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Business Intelligence"
        subtitle="Real-time insights and analytics for your bakery performance."
        action={
          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-xl font-bold gap-2">
                  <Calendar className="w-4 h-4" /> {dateRange}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-xl p-2 min-w-[160px]">
                <DropdownMenuItem onClick={() => setDateRange("All Time")} className="rounded-lg font-bold">All Time</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange("Yesterday")} className="rounded-lg font-bold">Yesterday</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange("Today")} className="rounded-lg font-bold">Today</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange("Tomorrow")} className="rounded-lg font-bold">Tomorrow</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange("Last 7 Days")} className="rounded-lg font-bold">Last 7 Days</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange("This Month")} className="rounded-lg font-bold">This Month</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={handleExport} className="rounded-xl font-black gap-2 shadow-lg bg-primary text-white hover:bg-primary/90">
              <Download className="w-5 h-5" /> Export CSV
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <Card key={s.label} className="border-none shadow-card hover:-translate-y-1 transition-all rounded-[2rem] overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-muted/50 ${s.color}`}>
                  <s.icon className="h-6 w-6" />
                </div>
                <div className={`w-2 h-2 rounded-full ${s.bg} mt-2`} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{s.label}</p>
              <p className="font-display text-3xl font-black text-foreground mt-1">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Top Selling Items */}
        <Card className="border-none shadow-card rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="font-display font-black text-2xl">Top Selling Items</CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-2 space-y-5">
            {topItems.length === 0 ? (
              <div className="py-12 text-center">
                <BarChart3 className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground italic">No sales data yet. Place some orders to see analytics.</p>
              </div>
            ) : (
              topItems.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-primary bg-primary/10 w-5 h-5 rounded-full flex items-center justify-center">{idx + 1}</span>
                      <span className="font-bold text-sm">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-muted-foreground">{item.qty} pcs</span>
                      <span className="text-xs font-black text-leaf ml-2">${item.revenue.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-700"
                      style={{ width: `${(item.qty / maxQty) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Order Status Breakdown */}
        <Card className="border-none shadow-card rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="font-display font-black text-2xl">Order Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-2 space-y-5">
            {orders.length === 0 ? (
              <div className="py-12 text-center">
                <ShoppingCart className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground italic">No orders yet. Customers can place orders from the store.</p>
              </div>
            ) : (
              Object.entries(statusCounts).map(([status, count]) => {
                const colors = { Pending: "bg-amber-400", Preparing: "bg-primary", Ready: "bg-leaf", Completed: "bg-gray-400" };
                const total = orders.length || 1;
                return (
                  <div key={status} className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${colors[status] || 'bg-muted'}`} />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-bold">{status}</span>
                        <span className="text-sm font-black text-muted-foreground">{count} orders</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-700 ${colors[status] || 'bg-muted'}`}
                          style={{ width: `${(count / total) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {orders.length > 0 && (
              <div className="pt-4 border-t border-dashed mt-4">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-muted-foreground">Profit (Revenue - Costs)</span>
                  <span className={`font-black ${totalRevenue - totalPurchaseCost >= 0 ? 'text-leaf' : 'text-berry'}`}>
                    ${(totalRevenue - totalPurchaseCost).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
