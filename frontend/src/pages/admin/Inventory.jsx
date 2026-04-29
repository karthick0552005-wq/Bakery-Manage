import React, { useState } from 'react';
import PageHeader from "@/components/PageHeader";
import { useBakery } from "@/store/BakeryContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, ArrowUpRight, ArrowDownRight, Boxes, History, Save, Minus, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { exportToCSV } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function Inventory() {
  const { inventory, menu, updateInventoryStock, addInventoryItem } = useBakery();
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [adjustingItem, setAdjustingItem] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState(0);
  const [adjustSupplier, setAdjustSupplier] = useState('');
  const [adjustCost, setAdjustCost] = useState('');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItemData, setNewItemData] = useState({
    name: '',
    category: 'Raw Material',
    unit: 'kg',
    min: 10,
    location: 'Bakery'
  });

  // Combine raw materials and menu products for a complete inventory view
  const allInventory = [
    ...inventory.map(item => ({
      ...item,
      category: item.category || "Raw Material",
      bakeryStock: item.bakeryStock || 0,
      kitchenStock: item.kitchenStock || (item.stock || 0)
    })),
    ...menu.today.map(item => ({
      ...item,
      id: `PROD${item.id}`,
      unit: "pcs",
      min: 5,
      category: "Finished Product",
      bakeryStock: item.bakeryStock || (item.stock || 0),
      kitchenStock: item.kitchenStock || 0,
      isProduct: true
    })),
    ...menu.tomorrow.map(item => ({
      ...item,
      id: `PROD-TOM-${item.id}`,
      unit: "pcs",
      min: 5,
      category: "Finished Product",
      bakeryStock: 0,
      kitchenStock: 0,
      isProduct: true,
      isTomorrow: true
    }))
  ];

  const categories = ["Bakery Stock", "Kitchen Stock"]; // Removed 'All' as per user screenshot
  const filteredInventory = allInventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const [adjustLocation, setAdjustLocation] = useState('');

  const handleAdjustStock = () => {
    if (!adjustingItem) return;
    updateInventoryStock(
      adjustingItem.id, 
      adjustAmount, 
      adjustSupplier, 
      parseFloat(adjustCost) || 0, 
      adjustLocation || activeTab.split(" ")[0] // Default to active tab location
    );
    setAdjustingItem(null);
    setAdjustAmount(0);
    setAdjustSupplier('');
    setAdjustCost('');
    setAdjustLocation('');
  };

  const handleExport = () => {
    const exportData = allInventory.map(item => ({
      ID: item.id,
      Name: item.name,
      Category: item.category,
      Total_Stock: item.stock,
      Bakery_Stock: item.bakeryStock,
      Kitchen_Stock: item.kitchenStock,
      Unit: item.unit,
      Min_Threshold: item.min,
      Status: item.stock < item.min ? "Low Stock" : "Optimal"
    }));
    
    exportToCSV(exportData, `Bakery_Full_Inventory_${new Date().toISOString().split('T')[0]}`);
    toast.success("Full inventory exported to CSV");
  };

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Inventory Overview" 
        subtitle="Manage stock levels for raw ingredients and baked goods."
        action={
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl font-bold gap-2" onClick={handleExport}>
              <History className="w-4 h-4" /> Export CSV
            </Button>
            <Button className="rounded-xl font-black gap-2 shadow-lg" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-5 h-5" /> Add Stock Item
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-card bg-primary text-primary-foreground rounded-[2.5rem]">
          <CardContent className="p-8 space-y-2">
            <div className="p-3 bg-white/20 w-fit rounded-2xl mb-2">
              <Boxes className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Total Stock Items</p>
            <h3 className="text-4xl font-display font-black">{allInventory.length}</h3>
            <p className="text-xs font-medium opacity-80">Raw + Finished Goods</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-card bg-leaf text-white rounded-[2.5rem]">
          <CardContent className="p-8 space-y-2">
            <div className="p-3 bg-white/20 w-fit rounded-2xl mb-2">
              <ArrowUpRight className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Healthy Stock</p>
            <h3 className="text-4xl font-display font-black">{allInventory.filter(i => i.stock >= i.min).length}</h3>
            <p className="text-xs font-medium opacity-80">{((allInventory.filter(i => i.stock >= i.min).length / allInventory.length) * 100).toFixed(0)}% Stability Rate</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-card bg-berry text-white rounded-[2.5rem]">
          <CardContent className="p-8 space-y-2">
            <div className="p-3 bg-white/20 w-fit rounded-2xl mb-2">
              <ArrowDownRight className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Low Stock Alerts</p>
            <h3 className="text-4xl font-display font-black">{allInventory.filter(i => i.stock < i.min).length}</h3>
            <p className="text-xs font-medium opacity-80">Immediate Restock Required</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-card bg-[#8B4513] text-white rounded-[2.5rem]">
          <CardContent className="p-8 space-y-2">
            <div className="p-3 bg-white/20 w-fit rounded-2xl mb-2">
              <Boxes className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Bakery vs Kitchen</p>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-display font-black">
                {((allInventory.reduce((s, i) => s + (i.bakeryStock || 0), 0) / (allInventory.reduce((s, i) => s + (i.stock || 0), 0) || 1)) * 100).toFixed(0)}%
              </h3>
              <p className="text-[10px] font-black mb-1.5 opacity-70">IN FRONT</p>
            </div>
            <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-white h-full transition-all duration-1000" 
                style={{ width: `${((allInventory.reduce((s, i) => s + (i.bakeryStock || 0), 0) / (allInventory.reduce((s, i) => s + (i.stock || 0), 0) || 1)) * 100)}%` }} 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-card p-4 rounded-[2rem] border border-border/40 shadow-sm">
        <div className="flex p-1 bg-muted rounded-xl w-full md:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-black transition-all ${
                activeTab === cat ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search items..." 
            className="pl-10 rounded-xl bg-muted/50 border-none h-11" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card rounded-[2.5rem] border border-border/40 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 border-b">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Item Details</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Stock</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {/* Raw Materials Section */}
              {filteredInventory.filter(item => item.category === 'Raw Material').length > 0 && (
                <tr className="bg-primary/5">
                  <td colSpan="5" className="px-8 py-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-primary">Raw Materials</h3>
                  </td>
                </tr>
              )}
              {filteredInventory.filter(item => item.category === 'Raw Material').map(item => {
                const isLow = item.stock < item.min;
                return (
                  <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-8 py-5">
                      <p className="font-bold text-sm">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground font-medium">ID: {item.id}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-muted text-muted-foreground">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <p className={`font-display font-black text-lg ${isLow ? 'text-berry' : 'text-foreground'}`}>
                        {activeTab === 'Bakery Stock' ? item.bakeryStock : item.kitchenStock} <span className="text-xs opacity-50 font-sans">{item.unit}</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium">Min: {item.min} {item.unit} (Total: {item.stock})</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className={`flex items-center gap-2 ${isLow ? 'text-berry' : 'text-leaf'}`}>
                        <div className={`w-2 h-2 rounded-full ${isLow ? 'bg-berry animate-pulse' : 'bg-leaf'}`} />
                        <span className="text-xs font-bold uppercase tracking-widest">{isLow ? 'Low Stock' : 'Optimal'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <Button variant="outline" size="sm" className="rounded-xl font-bold h-9" onClick={() => setAdjustingItem(item)}>Update</Button>
                    </td>
                  </tr>
                );
              })}

              {/* Finished Products Section */}
              {filteredInventory.filter(item => item.category === 'Finished Product').length > 0 && (
                <tr className="bg-primary/5">
                  <td colSpan="5" className="px-8 py-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-primary">Finished Products</h3>
                  </td>
                </tr>
              )}
              {filteredInventory.filter(item => item.category === 'Finished Product').map(item => {
                const isLow = item.stock < item.min;
                return (
                  <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm">{item.name}</p>
                        {item.isTomorrow && (
                          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-leaf/10 text-leaf border border-leaf/20">
                            Tomorrow
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground font-medium">ID: {item.id}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-primary/10 text-primary">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <p className={`font-display font-black text-lg ${isLow ? 'text-berry' : 'text-foreground'}`}>
                        {activeTab === 'Bakery Stock' ? item.bakeryStock : item.kitchenStock} <span className="text-xs opacity-50 font-sans">{item.unit}</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium">Min: {item.min} {item.unit} (Total: {item.stock})</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className={`flex items-center gap-2 ${isLow ? 'text-berry' : 'text-leaf'}`}>
                        <div className={`w-2 h-2 rounded-full ${isLow ? 'bg-berry animate-pulse' : 'bg-leaf'}`} />
                        <span className="text-xs font-bold uppercase tracking-widest">{isLow ? 'Low Stock' : 'Optimal'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <Button variant="outline" size="sm" className="rounded-xl font-bold h-9" onClick={() => setAdjustingItem(item)}>Update</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      <Dialog open={!!adjustingItem} onOpenChange={(open) => !open && setAdjustingItem(null)}>
        <DialogContent className="sm:max-w-[400px] max-h-[90vh] flex flex-col rounded-[2.5rem] p-0 border-none shadow-2xl bg-white overflow-hidden">
          {adjustingItem && (
            <>
              <div className="bg-primary p-8 text-primary-foreground relative shrink-0">
                <DialogHeader className="space-y-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
                      ID: {adjustingItem.id}
                    </span>
                  </div>
                  <DialogTitle className="text-3xl font-display font-black leading-tight">
                    Adjust Stock
                  </DialogTitle>
                  <p className="text-primary-foreground/70 font-medium text-sm">
                    Manually update levels for <strong>{adjustingItem.name}</strong>
                  </p>
                </DialogHeader>
              </div>

              <div className="p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current ({activeTab})</p>
                    <p className="text-2xl font-display font-black">
                      {activeTab === 'Bakery Stock' ? adjustingItem.bakeryStock : adjustingItem.kitchenStock} {adjustingItem.unit}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground/30" />
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">New Total</p>
                    <p className="text-2xl font-display font-black text-primary">
                      {(activeTab === 'Bakery Stock' ? adjustingItem.bakeryStock : adjustingItem.kitchenStock) + adjustAmount} {adjustingItem.unit}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Adjustment Amount</Label>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl" onClick={() => setAdjustAmount(prev => prev - 1)}>
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input 
                      type="number" 
                      value={adjustAmount} 
                      onChange={(e) => setAdjustAmount(parseInt(e.target.value) || 0)}
                      className="h-12 text-center font-black text-lg rounded-xl bg-muted/20 border-none"
                    />
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl" onClick={() => setAdjustAmount(prev => prev + 1)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-[10px] text-center text-muted-foreground font-medium italic">Use negative numbers to decrease stock</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Supplier / Source <span className="text-muted-foreground/40 normal-case tracking-normal font-normal">(opt)</span></Label>
                    <Input
                      placeholder="e.g. Global Flour Mill"
                      value={adjustSupplier}
                      onChange={(e) => setAdjustSupplier(e.target.value)}
                      className="h-12 rounded-xl bg-muted/20 border-none font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Amount Paid <span className="text-muted-foreground/40 normal-case tracking-normal font-normal">(opt)</span></Label>
                    <Input
                      type="number"
                      placeholder="e.g. 500"
                      value={adjustCost}
                      onChange={(e) => setAdjustCost(e.target.value)}
                      className="h-12 rounded-xl bg-muted/20 border-none font-bold"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Add to Location</Label>
                  <select 
                    value={adjustLocation || activeTab.split(" ")[0]} 
                    onChange={e => setAdjustLocation(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border-none bg-muted/40 text-sm font-bold appearance-none outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Bakery">Bakery (Storefront)</option>
                    <option value="Kitchen">Kitchen (Back of House)</option>
                  </select>
                </div>

                <p className="text-[10px] text-muted-foreground font-medium italic ml-1">If stock is added (+), this will be logged in Purchase Entries with the amount.</p>
              </div>

              <DialogFooter className="p-8 pt-0 shrink-0">
                <Button onClick={handleAdjustStock} className="w-full rounded-2xl font-black h-16 text-lg gap-2 shadow-xl hover:-translate-y-1 transition-all bg-primary text-primary-foreground">
                  <Save className="w-5 h-5" /> Confirm Adjustment
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add New Item Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[450px] max-h-[90vh] flex flex-col rounded-[2.5rem] p-0 border-none shadow-2xl bg-white overflow-hidden">
          <div className="bg-primary p-8 text-primary-foreground shrink-0">
            <DialogHeader>
              <DialogTitle className="text-3xl font-display font-black">Add New Stock</DialogTitle>
              <p className="text-primary-foreground/70 font-medium text-sm mt-1">Register a new item to Bakery or Kitchen.</p>
            </DialogHeader>
          </div>
          
          <div className="p-8 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Item Name</Label>
              <Input 
                placeholder="e.g. Sugar, Chicken Rice" 
                value={newItemData.name}
                onChange={(e) => setNewItemData({...newItemData, name: e.target.value})}
                className="rounded-xl h-12 bg-muted/30 border-none font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Category</Label>
                <select 
                  value={newItemData.category}
                  onChange={(e) => setNewItemData({...newItemData, category: e.target.value})}
                  className="w-full h-12 px-4 rounded-xl border-none bg-muted/40 text-sm font-bold outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Raw Material">Raw Material</option>
                  <option value="Finished Product">Finished Product</option>
                </select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Unit</Label>
                <select 
                  value={newItemData.unit}
                  onChange={(e) => setNewItemData({...newItemData, unit: e.target.value})}
                  className="w-full h-12 px-4 rounded-xl border-none bg-muted/40 text-sm font-bold outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="ltr">Liter (ltr)</option>
                  <option value="pcs">Pieces (pcs)</option>
                  <option value="gm">Grams (gm)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Min Threshold</Label>
                <Input 
                  type="number"
                  placeholder="e.g. 10" 
                  value={newItemData.min}
                  onChange={(e) => setNewItemData({...newItemData, min: parseInt(e.target.value) || 0})}
                  className="rounded-xl h-12 bg-muted/30 border-none font-bold"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="p-8 pt-0 shrink-0">
            <Button 
              onClick={() => {
                if(!newItemData.name) return toast.error("Please enter a name");
                addInventoryItem(newItemData);
                setIsAddModalOpen(false);
                setNewItemData({
                  name: '',
                  category: 'Raw Material',
                  unit: 'kg',
                  min: 10,
                  location: 'Bakery'
                });
              }}
              className="w-full rounded-2xl font-black h-14 text-lg gap-2 shadow-xl bg-primary text-primary-foreground hover:-translate-y-1 transition-all"
              id="add-stock-btn"
            >
              <Plus className="w-5 h-5" /> Add Stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
