import React, { useState } from 'react';
import PageHeader from "@/components/PageHeader";
import { useBakery } from "@/store/BakeryContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, AlertTriangle, Plus, Search, Filter, History, ChefHat } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function KitchenInventory() {
  const { inventory, menu, addKitchenRequest, addInventoryItem, kitchenRequests } = useBakery();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [requestData, setRequestData] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItemData, setNewItemData] = useState({
    name: '',
    category: 'Raw Material',
    unit: 'kg',
    min: 10,
    location: 'Kitchen'
  });

  const handleDataChange = (id, field, value) => {
    setRequestData(prev => ({ 
      ...prev, 
      [id]: { ...(prev[id] || { qty: '', urgency: 'Normal' }), [field]: value } 
    }));
  };

  const allItems = [
    ...inventory.map(item => ({
      ...item,
      category: item.category || 'Raw Material',
      bakeryStock: item.bakeryStock || 0,
      kitchenStock: item.kitchenStock || (item.stock || 0)
    })),
    ...menu.today.map(item => ({
      ...item,
      id: `PROD${item.id}`,
      unit: "pcs",
      min: 5,
      category: 'Finished Product',
      bakeryStock: item.bakeryStock || (item.stock || 0),
      kitchenStock: item.kitchenStock || 0,
      isProduct: true
    }))
  ];

  const filteredItems = allItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const requestRestock = (item, locationTab) => {
    const data = requestData[item.id] || { qty: '5', urgency: 'Normal' };
    const finalNote = `REQ: ${data.qty}${item.unit} of ${item.name} for ${locationTab} | Urgency: ${data.urgency}`;
    
    addKitchenRequest("Restock", finalNote, {
      itemId: item.id,
      qty: data.qty
    });
    toast.success(`Restock request sent for ${item.name}`, {
      description: `Requested ${data.qty}${item.unit} (${data.urgency})`
    });
    setRequestData(prev => ({ ...prev, [item.id]: { qty: '', urgency: 'Normal' } }));
  };

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Kitchen Inventory" 
        subtitle="Monitor ingredients and finished product stock levels."
        action={
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl font-bold gap-2" onClick={() => setIsHistoryOpen(true)}>
              <History className="w-4 h-4" /> Request History
            </Button>
            <Button className="rounded-xl font-black gap-2 shadow-lg" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-5 h-5" /> Add New Item
            </Button>
          </div>
        }
      />

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search inventory..." 
            className="pl-10 rounded-xl bg-card border-border/40 h-12 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="bakery" className="w-full">
        <TabsList className="bg-muted/50 p-1 rounded-2xl h-14 mb-8 overflow-x-auto flex w-max max-w-full">
          <TabsTrigger value="bakery" className="rounded-xl font-black px-6 md:px-8 h-12 data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2 whitespace-nowrap">
            <Package className="w-4 h-4" /> Bakery Stock ({filteredItems.length})
          </TabsTrigger>
          <TabsTrigger value="kitchen" className="rounded-xl font-black px-6 md:px-8 h-12 data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2 whitespace-nowrap">
            <ChefHat className="w-4 h-4" /> Kitchen Stock ({filteredItems.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bakery" className="space-y-8">
          <div>
            <h3 className="text-lg font-black uppercase tracking-widest text-muted-foreground mb-4 pl-2 border-l-4 border-primary">Raw Materials</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.filter(item => item.category === 'Raw Material').map(item => {
              const currentStock = item.bakeryStock;
              const isLow = currentStock < item.min;
              return (
                <Card key={item.id} className={`group border-none shadow-card hover:shadow-warm transition-all rounded-[2rem] overflow-hidden ${isLow ? 'bg-berry/5' : ''}`}>
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-2xl ${isLow ? 'bg-berry/10 text-berry' : 'bg-primary/10 text-primary'}`}>
                        <Package className="w-6 h-6" />
                      </div>
                      {isLow && (
                        <div className="flex items-center gap-1 text-berry animate-pulse">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Low Stock</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-display font-black text-xl mb-1">{item.name}</h3>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-bold text-muted-foreground">Current Stock</span>
                        <span className={`text-2xl font-display font-black ${isLow ? 'text-berry' : 'text-foreground'}`}>
                          {currentStock} <span className="text-sm opacity-50">{item.unit}</span>
                        </span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${isLow ? 'bg-berry' : 'bg-leaf'}`} 
                          style={{ width: `${Math.min((currentStock / (item.min * 1.5)) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground">Min. Required: {item.min} {item.unit}</p>
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          className={`w-full rounded-xl font-bold h-12 gap-2 ${isLow ? 'bg-berry hover:bg-berry/90' : 'bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground'}`}
                        >
                          <Plus className="w-4 h-4" /> Request Restock
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-2xl font-display font-black text-berry">Request restock for {item.name}?</AlertDialogTitle>
                          <AlertDialogDescription className="text-muted-foreground font-medium">
                            This will send a priority restock request to the admin dashboard for {item.name}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="mt-4 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Quantity ({item.unit})</label>
                              <Input 
                                type="number"
                                placeholder="e.g. 10" 
                                value={requestData[item.id]?.qty || ''}
                                onChange={(e) => handleDataChange(item.id, 'qty', e.target.value)}
                                className="rounded-xl h-12 bg-muted/30 border-none focus-visible:ring-berry"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Urgency</label>
                              <select 
                                value={requestData[item.id]?.urgency || 'Normal'}
                                onChange={(e) => handleDataChange(item.id, 'urgency', e.target.value)}
                                className="w-full h-12 px-4 rounded-xl border-none bg-muted/40 text-sm font-bold appearance-none outline-none focus:ring-2 focus:ring-berry"
                              >
                                <option value="Normal">Normal</option>
                                <option value="Urgent">Urgent</option>
                                <option value="Critical">Critical</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <AlertDialogFooter className="mt-6 gap-3">
                          <AlertDialogCancel className="rounded-xl font-bold h-12 border-muted hover:bg-muted">Cancel</AlertDialogCancel>
                          <Button 
                            onClick={() => requestRestock(item, 'Bakery')} 
                            className={`w-full rounded-xl font-black h-12 shadow-md hover:-translate-y-1 transition-all gap-2 ${isLow ? 'bg-berry text-white hover:bg-berry/90' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                          >
                            Yes, Send Request
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardContent>
                </Card>
              );
            })}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-black uppercase tracking-widest text-muted-foreground mb-4 pl-2 border-l-4 border-primary">Finished Products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.filter(item => item.category === 'Finished Product').map(item => {
                const currentStock = item.bakeryStock;
                const isLow = currentStock < item.min;
                return (
                  <Card key={item.id} className={`group border-none shadow-card hover:shadow-warm transition-all rounded-[2rem] overflow-hidden ${isLow ? 'bg-berry/5' : ''}`}>
                    <CardContent className="p-6 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-2xl ${isLow ? 'bg-berry/10 text-berry' : 'bg-primary/10 text-primary'}`}>
                          <ChefHat className="w-6 h-6" />
                        </div>
                        {isLow && (
                          <div className="flex items-center gap-1 text-berry animate-pulse">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Low Stock</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="font-display font-black text-xl mb-1">{item.name}</h3>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-end">
                          <span className="text-sm font-bold text-muted-foreground">Current Stock</span>
                          <span className={`text-2xl font-display font-black ${isLow ? 'text-berry' : 'text-foreground'}`}>
                            {currentStock} <span className="text-sm opacity-50">{item.unit}</span>
                          </span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${isLow ? 'bg-berry' : 'bg-leaf'}`} 
                            style={{ width: `${Math.min((currentStock / (item.min * 1.5)) * 100, 100)}%` }}
                          />
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground">Min. Required: {item.min} {item.unit}</p>
                      </div>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            className={`w-full rounded-xl font-bold h-12 gap-2 ${isLow ? 'bg-berry hover:bg-berry/90' : 'bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground'}`}
                          >
                            <Plus className="w-4 h-4" /> Request Restock
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-2xl font-display font-black text-berry">Request restock for {item.name}?</AlertDialogTitle>
                            <AlertDialogDescription className="text-muted-foreground font-medium">
                              This will send a priority restock request to the admin dashboard for {item.name}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="mt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Quantity ({item.unit})</label>
                                <Input 
                                  type="number"
                                  placeholder="e.g. 10" 
                                  value={requestData[item.id]?.qty || ''}
                                  onChange={(e) => handleDataChange(item.id, 'qty', e.target.value)}
                                  className="rounded-xl h-12 bg-muted/30 border-none focus-visible:ring-berry"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Urgency</label>
                                <select 
                                  value={requestData[item.id]?.urgency || 'Normal'}
                                  onChange={(e) => handleDataChange(item.id, 'urgency', e.target.value)}
                                  className="w-full h-12 px-4 rounded-xl border-none bg-muted/40 text-sm font-bold appearance-none outline-none focus:ring-2 focus:ring-berry"
                                >
                                  <option value="Normal">Normal</option>
                                  <option value="Urgent">Urgent</option>
                                  <option value="Critical">Critical</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <AlertDialogFooter className="mt-6 gap-3">
                            <AlertDialogCancel className="rounded-xl font-bold h-12 border-muted hover:bg-muted">Cancel</AlertDialogCancel>
                            <Button 
                              onClick={() => requestRestock(item, 'Bakery')} 
                              className={`w-full rounded-xl font-black h-12 shadow-md hover:-translate-y-1 transition-all gap-2 ${isLow ? 'bg-berry text-white hover:bg-berry/90' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                            >
                              Yes, Send Request
                            </Button>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="kitchen" className="space-y-8">
          <div>
            <h3 className="text-lg font-black uppercase tracking-widest text-muted-foreground mb-4 pl-2 border-l-4 border-primary">Raw Materials</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.filter(item => item.category === 'Raw Material').map(item => {
                const currentStock = item.kitchenStock;
                const isLow = currentStock < item.min;
                return (
                  <Card key={item.id} className={`group border-none shadow-card hover:shadow-warm transition-all rounded-[2rem] overflow-hidden ${isLow ? 'bg-berry/5' : ''}`}>
                    <CardContent className="p-6 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-2xl ${isLow ? 'bg-berry/10 text-berry' : 'bg-primary/10 text-primary'}`}>
                          <Package className="w-6 h-6" />
                        </div>
                        {isLow && (
                          <div className="flex items-center gap-1 text-berry animate-pulse">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Low Stock</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="font-display font-black text-xl mb-1">{item.name}</h3>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-end">
                          <span className="text-sm font-bold text-muted-foreground">Current Stock</span>
                          <span className={`text-2xl font-display font-black ${isLow ? 'text-berry' : 'text-foreground'}`}>
                            {currentStock} <span className="text-sm opacity-50">{item.unit}</span>
                          </span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${isLow ? 'bg-berry' : 'bg-leaf'}`} 
                            style={{ width: `${Math.min((currentStock / (item.min * 1.5)) * 100, 100)}%` }}
                          />
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground">Min. Required: {item.min} {item.unit}</p>
                      </div>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            className={`w-full rounded-xl font-bold h-12 gap-2 ${isLow ? 'bg-berry hover:bg-berry/90' : 'bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground'}`}
                          >
                            <Plus className="w-4 h-4" /> Request Restock
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-2xl font-display font-black text-berry">Request restock for {item.name}?</AlertDialogTitle>
                            <AlertDialogDescription className="text-muted-foreground font-medium">
                              This will send a priority restock request to the admin dashboard for {item.name}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="mt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Quantity ({item.unit})</label>
                                <Input 
                                  type="number"
                                  placeholder="e.g. 10" 
                                  value={requestData[item.id]?.qty || ''}
                                  onChange={(e) => handleDataChange(item.id, 'qty', e.target.value)}
                                  className="rounded-xl h-12 bg-muted/30 border-none focus-visible:ring-berry"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Urgency</label>
                                <select 
                                  value={requestData[item.id]?.urgency || 'Normal'}
                                  onChange={(e) => handleDataChange(item.id, 'urgency', e.target.value)}
                                  className="w-full h-12 px-4 rounded-xl border-none bg-muted/40 text-sm font-bold appearance-none outline-none focus:ring-2 focus:ring-berry"
                                >
                                  <option value="Normal">Normal</option>
                                  <option value="Urgent">Urgent</option>
                                  <option value="Critical">Critical</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <AlertDialogFooter className="mt-6 gap-3">
                            <AlertDialogCancel className="rounded-xl font-bold h-12 border-muted hover:bg-muted">Cancel</AlertDialogCancel>
                            <Button 
                              onClick={() => requestRestock(item, 'Kitchen')} 
                              className={`w-full rounded-xl font-black h-12 shadow-md hover:-translate-y-1 transition-all gap-2 ${isLow ? 'bg-berry text-white hover:bg-berry/90' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                            >
                              Yes, Send Request
                            </Button>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-black uppercase tracking-widest text-muted-foreground mb-4 pl-2 border-l-4 border-primary">Finished Products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.filter(item => item.category === 'Finished Product').map(item => {
                const currentStock = item.kitchenStock;
                const isLow = currentStock < item.min;
                return (
                  <Card key={item.id} className={`group border-none shadow-card hover:shadow-warm transition-all rounded-[2rem] overflow-hidden ${isLow ? 'bg-berry/5' : ''}`}>
                    <CardContent className="p-6 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-2xl ${isLow ? 'bg-berry/10 text-berry' : 'bg-primary/10 text-primary'}`}>
                          <ChefHat className="w-6 h-6" />
                        </div>
                        {isLow && (
                          <div className="flex items-center gap-1 text-berry animate-pulse">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Low Stock</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="font-display font-black text-xl mb-1">{item.name}</h3>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-end">
                          <span className="text-sm font-bold text-muted-foreground">Current Stock</span>
                          <span className={`text-2xl font-display font-black ${isLow ? 'text-berry' : 'text-foreground'}`}>
                            {currentStock} <span className="text-sm opacity-50">{item.unit}</span>
                          </span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${isLow ? 'bg-berry' : 'bg-leaf'}`} 
                            style={{ width: `${Math.min((currentStock / (item.min * 1.5)) * 100, 100)}%` }}
                          />
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground">Min. Required: {item.min} {item.unit}</p>
                      </div>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            className={`w-full rounded-xl font-bold h-12 gap-2 ${isLow ? 'bg-berry hover:bg-berry/90' : 'bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground'}`}
                          >
                            <Plus className="w-4 h-4" /> Request Restock
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-2xl font-display font-black text-berry">Request restock for {item.name}?</AlertDialogTitle>
                            <AlertDialogDescription className="text-muted-foreground font-medium">
                              This will send a priority restock request to the admin dashboard for {item.name}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="mt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Quantity ({item.unit})</label>
                                <Input 
                                  type="number"
                                  placeholder="e.g. 10" 
                                  value={requestData[item.id]?.qty || ''}
                                  onChange={(e) => handleDataChange(item.id, 'qty', e.target.value)}
                                  className="rounded-xl h-12 bg-muted/30 border-none focus-visible:ring-berry"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Urgency</label>
                                <select 
                                  value={requestData[item.id]?.urgency || 'Normal'}
                                  onChange={(e) => handleDataChange(item.id, 'urgency', e.target.value)}
                                  className="w-full h-12 px-4 rounded-xl border-none bg-muted/40 text-sm font-bold appearance-none outline-none focus:ring-2 focus:ring-berry"
                                >
                                  <option value="Normal">Normal</option>
                                  <option value="Urgent">Urgent</option>
                                  <option value="Critical">Critical</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <AlertDialogFooter className="mt-6 gap-3">
                            <AlertDialogCancel className="rounded-xl font-bold h-12 border-muted hover:bg-muted">Cancel</AlertDialogCancel>
                            <Button 
                              onClick={() => requestRestock(item, 'Kitchen')} 
                              className={`w-full rounded-xl font-black h-12 shadow-md hover:-translate-y-1 transition-all gap-2 ${isLow ? 'bg-berry text-white hover:bg-berry/90' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                            >
                              Yes, Send Request
                            </Button>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add New Item Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] p-0 border-none shadow-2xl bg-white overflow-hidden">
          <div className="bg-primary p-8 text-primary-foreground">
            <DialogHeader>
              <DialogTitle className="text-3xl font-display font-black">Add New Item</DialogTitle>
              <p className="text-primary-foreground/70 font-medium text-sm mt-1">Register a new ingredient or material to the kitchen.</p>
            </DialogHeader>
          </div>
          
          <div className="p-8 space-y-5">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Item Name</Label>
              <Input 
                placeholder="e.g. Whole Wheat Flour" 
                value={newItemData.name}
                onChange={(e) => setNewItemData({...newItemData, name: e.target.value})}
                className="rounded-xl h-12 bg-muted/30 border-none font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-1">
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
              <div className="space-y-2 col-span-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Location</Label>
                <select 
                  value={newItemData.location}
                  onChange={(e) => setNewItemData({...newItemData, location: e.target.value})}
                  className="w-full h-12 px-4 rounded-xl border-none bg-muted/40 text-sm font-bold outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Kitchen">Kitchen</option>
                  <option value="Bakery">Bakery</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Minimum Alert Threshold</Label>
              <Input 
                type="number"
                placeholder="e.g. 10" 
                value={newItemData.min}
                onChange={(e) => setNewItemData({...newItemData, min: parseInt(e.target.value) || 0})}
                className="rounded-xl h-12 bg-muted/30 border-none font-bold"
              />
            </div>
          </div>

          <DialogFooter className="p-8 pt-0">
            <Button 
              onClick={() => {
                if(!newItemData.name) return toast.error("Please enter a name");
                addInventoryItem({ ...newItemData, category: 'Raw Material' });
                setIsAddModalOpen(false);
                setNewItemData({ name: '', category: 'Raw Material', unit: 'kg', min: 10, location: 'Kitchen' });
              }}
              className="w-full rounded-2xl font-black h-14 text-lg gap-2 shadow-xl bg-primary text-primary-foreground hover:-translate-y-1 transition-all"
            >
              <Plus className="w-5 h-5" /> Register Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Request History Modal */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-[2.5rem] p-0 border-none shadow-2xl bg-white overflow-hidden max-h-[85vh] flex flex-col">
          <div className="bg-muted p-8 text-foreground shrink-0 border-b">
            <DialogHeader>
              <DialogTitle className="text-3xl font-display font-black flex items-center gap-3">
                <History className="w-8 h-8 text-primary" />
                Restock History
              </DialogTitle>
              <p className="text-muted-foreground font-medium text-sm mt-1">Track your past material and stock requests sent to admin.</p>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
            {kitchenRequests.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <History className="w-12 h-12 text-muted-foreground/20 mx-auto" />
                <p className="text-muted-foreground font-medium italic">No request history found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {kitchenRequests.filter(r => r.type === "Restock").map((req) => (
                  <Card key={req.id} className="border-none bg-muted/30 rounded-2xl overflow-hidden">
                    <CardContent className="p-5 flex items-center justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded">#{req.id}</span>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                            req.status === 'Approved' ? 'bg-leaf/10 text-leaf' : 
                            req.status === 'Denied' ? 'bg-berry/10 text-berry' : 
                            'bg-amber-500/10 text-amber-600'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-foreground leading-relaxed">{req.note}</p>
                        <p className="text-[10px] text-muted-foreground font-medium">{new Date(req.createdAt).toLocaleString()}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter className="p-6 bg-muted/10 border-t shrink-0">
            <Button variant="ghost" onClick={() => setIsHistoryOpen(false)} className="w-full rounded-xl font-bold h-12">Close History</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
