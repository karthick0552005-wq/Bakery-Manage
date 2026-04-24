import React, { useState } from 'react';
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, ShoppingCart, FileText, Calendar, ArrowRight, Download } from "lucide-react";
import { exportToCSV } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useBakery } from "@/store/BakeryContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Save } from "lucide-react";

export default function PurchaseEntries() {
  const { kitchenRequests, purchases, addPurchaseEntry } = useBakery();
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    supplier: '',
    items: '',
    total: ''
  });

  const handleSave = () => {
    if (!formData.supplier || !formData.items || !formData.total) {
      toast.error("Please fill all fields");
      return;
    }
    addPurchaseEntry(formData.items, formData.total, 'entry', formData.supplier, parseFloat(formData.total));
    setIsAddModalOpen(false);
    setFormData({ supplier: '', items: '', total: '' });
    toast.success("Purchase entry saved!");
  };

  const handleExport = () => {
    if (purchases.length === 0) {
      toast.error("No purchase data to export");
      return;
    }
    const exportData = purchases.map(p => ({
      "ID": p.id,
      "Date": p.date,
      "Supplier": p.supplier,
      "Items": p.items,
      "Total Amount": `$${p.total.toFixed(2)}`,
      "Status": p.status,
      "Type": p.type
    }));
    exportToCSV(exportData, `Bakery_Purchases_${new Date().toISOString().split('T')[0]}`);
    toast.success("Purchase entries exported to CSV");
  };

  const totalSpending = purchases.reduce((sum, p) => sum + p.total, 0);

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Purchase Entries" 
        subtitle="Record and track bulk ingredient purchases from your suppliers."
        action={
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl font-bold gap-2" onClick={handleExport}>
              <Download className="w-4 h-4" /> Export CSV
            </Button>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl font-black gap-2 shadow-lg">
                  <Plus className="w-5 h-5" /> New Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-[2.5rem] p-0 border-none shadow-2xl overflow-hidden bg-white">
                <div className="bg-primary p-8 text-white">
                  <DialogTitle className="text-3xl font-display font-black">New Purchase</DialogTitle>
                  <p className="opacity-70 text-sm font-medium mt-1">Record a new supply delivery.</p>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Supplier Name</Label>
                    <Input value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} placeholder="e.g. Global Flour Mill" className="rounded-xl h-12 bg-muted/30 border-none" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Items & Qty</Label>
                    <Input value={formData.items} onChange={e => setFormData({...formData, items: e.target.value})} placeholder="e.g. 50kg Flour, 10kg Yeast" className="rounded-xl h-12 bg-muted/30 border-none" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Total Amount ($)</Label>
                    <Input type="number" value={formData.total} onChange={e => setFormData({...formData, total: e.target.value})} placeholder="0.00" className="rounded-xl h-12 bg-muted/30 border-none" />
                  </div>
                </div>
                <DialogFooter className="p-8 pt-0">
                  <Button onClick={handleSave} className="w-full h-14 rounded-xl font-black text-lg gap-2 bg-primary text-white">
                    <Save className="w-5 h-5" /> Save Entry
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-card bg-primary text-primary-foreground rounded-[2rem] p-8">
          <div className="flex items-center justify-between mb-4">
            <ShoppingCart className="w-6 h-6 opacity-50" />
            <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-1 rounded">Overall</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Total Spending</p>
          <h3 className="text-4xl font-display font-black">${totalSpending.toFixed(2)}</h3>
        </Card>
        <Card className="border-none shadow-card rounded-[2rem] p-8">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-6 h-6 text-primary opacity-50" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Entries</p>
          <h3 className="text-4xl font-display font-black">{purchases.length}</h3>
        </Card>
        <Card className="border-none shadow-card rounded-[2rem] p-8">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-6 h-6 text-primary opacity-50" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Recent Kitchen Requests</p>
          <h3 className="text-xl font-display font-black">
            {kitchenRequests.filter(r => r.status === 'Pending').length} Pending
          </h3>
        </Card>
      </div>

      <div className="bg-card rounded-[2.5rem] border border-border/40 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 border-b">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Entry ID</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Supplier</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Items Ordered</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {purchases.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-muted-foreground font-medium italic">
                    No purchase entries recorded yet.
                  </td>
                </tr>
              ) : (
                purchases.map(entry => (
                  <tr key={entry.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{entry.id}</span>
                        {entry.type === 'stock_adjustment' && (
                          <span className="text-[9px] font-black uppercase tracking-widest bg-leaf/10 text-leaf px-2 py-0.5 rounded-full">Auto-Logged</span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground font-medium">{entry.date}</p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="font-bold text-sm">{entry.supplier}</p>
                    </td>
                    <td className="px-8 py-5 text-xs font-medium text-muted-foreground">
                      {entry.items}
                    </td>
                    <td className="px-8 py-5">
                      {entry.total > 0 
                        ? <span className="font-display font-black text-primary">${entry.total.toFixed(2)}</span>
                        : <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">—</span>
                      }
                    </td>
                    <td className="px-8 py-5 text-right">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedEntry(entry)}>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!selectedEntry} onOpenChange={(open) => !open && setSelectedEntry(null)}>
        <DialogContent className="rounded-[2.5rem] p-0 border-none shadow-2xl bg-white overflow-hidden max-h-[95vh] flex flex-col">
          {selectedEntry && (
            <>
              <div className="bg-primary p-8 text-white relative shrink-0">
                <DialogTitle className="text-3xl font-display font-black tracking-tight">Purchase Detail</DialogTitle>
                <p className="opacity-70 text-sm font-medium mt-1">ID: {selectedEntry.id} • {selectedEntry.date}</p>
              </div>
              <div className="p-8 space-y-6 flex-1">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Supplier</p>
                  <p className="font-black text-xl">{selectedEntry.supplier}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Items</p>
                  <div className="p-4 rounded-xl bg-muted/30 font-bold text-sm">{selectedEntry.items}</div>
                </div>
                <div className="pt-4 border-t border-dashed flex items-center justify-between">
                  <span className="text-lg font-black">Total Paid</span>
                  <span className="text-3xl font-display font-black text-primary">${selectedEntry.total.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
