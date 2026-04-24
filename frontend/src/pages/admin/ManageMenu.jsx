import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from "@/components/PageHeader";
import { useBakery } from "@/store/BakeryContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit3, Trash2, Power, Save, Image as ImageIcon, Upload, Calendar, Sparkles, ArrowRight, ArrowUpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

import BakeryItemImage from "@/components/BakeryItemImage";

export default function ManageMenu() {
  const { menu, addMenuItem, updateMenuItem, deleteMenuItem, moveMenuItemToDay } = useBakery();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [currentView, setCurrentView] = useState("today");
  const [formData, setFormData] = useState({ 
    name: '', 
    price: '', 
    category: 'Bread', 
    stock: '20', 
    image: '', 
    day: 'today' 
  });

  const getFilteredMenu = (day) => menu[day].filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (item = null, day = currentView) => {
    if (item) {
      setEditingItem(item);
      setFormData({ 
        name: item.name, 
        price: item.price, 
        category: item.category, 
        stock: item.stock, 
        image: item.image || '', 
        day: day 
      });
    } else {
      setEditingItem(null);
      setFormData({ 
        name: '', 
        price: '', 
        category: 'Bread', 
        stock: '20', 
        image: '', 
        day: day 
      });
    }
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.name) {
      toast.error("Please provide a product name.");
      return;
    }

    const payload = {
      name: formData.name,
      price: parseFloat(formData.price) || 0,
      category: formData.category,
      stock: parseInt(formData.stock) || 0,
      image: formData.image,
      published: true
    };

    if (editingItem) {
      updateMenuItem(editingItem.id, payload, formData.day);
    } else {
      addMenuItem(payload, formData.day);
    }
    setIsModalOpen(false);
  };

  const ProductionList = ({ day }) => (
    <div className="bg-card rounded-[2.5rem] border border-border/40 shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="w-[300px] h-14 font-black text-[10px] uppercase tracking-widest text-muted-foreground pl-8">Product Details</TableHead>
            <TableHead className="h-14 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-center">Target Batch</TableHead>
            <TableHead className="h-14 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-center">Live Status</TableHead>
            <TableHead className="h-14 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right pr-8">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {getFilteredMenu(day).map(item => (
            <TableRow key={item.id} className={`group hover:bg-muted/50 transition-colors border-border/20 ${!item.published ? 'opacity-60 grayscale-[0.5]' : ''}`}>
              <TableCell className="py-5 pl-8">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-display font-black text-base">{item.name}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.category}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black">
                  {item.stock} Units
                </span>
              </TableCell>
              <TableCell className="text-center">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className={`h-9 px-4 rounded-full font-bold text-[10px] uppercase tracking-widest gap-2 ${
                        item.published 
                          ? 'bg-leaf/10 text-leaf hover:bg-leaf/20' 
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${item.published ? 'bg-leaf animate-pulse' : 'bg-muted-foreground'}`} />
                      {item.published ? 'Visible' : 'Draft'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-2xl font-display font-black">
                        {item.published ? "Hide from Store?" : "Show in Store?"}
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground font-medium">
                        {item.published 
                          ? `This will hide ${item.name} from the public store. Kitchen production will remain scheduled.`
                          : `This will make ${item.name} visible in the public store for customers to order.`
                        }
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-6 gap-3">
                      <AlertDialogCancel className="rounded-xl font-bold h-12 border-muted hover:bg-muted">Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => updateMenuItem(item.id, { published: !item.published }, day)} 
                        className="rounded-xl font-bold h-12 bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
                      >
                        Yes, {item.published ? "Hide" : "Publish"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
              <TableCell className="text-right pr-8">
                <div className="flex items-center justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 rounded-xl text-muted-foreground hover:text-leaf hover:bg-leaf/5"
                    onClick={() => moveMenuItemToDay(item.id, day, day === 'today' ? 'tomorrow' : 'today')}
                    title={day === 'today' ? "Move to Tomorrow" : "Move to Today"}
                  >
                    <ArrowRight className={`w-4 h-4 ${day === 'today' ? '' : 'rotate-180'}`} />
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl font-bold gap-2 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all" onClick={() => handleOpenModal(item, day)}>
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground hover:text-berry hover:bg-berry/5">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-display font-black text-berry">Remove from Plan?</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground font-medium">
                          Are you sure you want to delete <strong>{item.name}</strong>? This will remove it from the schedule immediately.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-6 gap-3">
                        <AlertDialogCancel className="rounded-xl font-bold h-12 border-muted hover:bg-muted">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => deleteMenuItem(item.id, day)} 
                          className="rounded-xl font-bold h-12 bg-berry text-white hover:bg-berry/90 shadow-lg shadow-berry/20"
                        >
                          Delete Item
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {getFilteredMenu(day).length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="py-20 text-center">
                <div className="space-y-2">
                  <p className="text-muted-foreground font-medium italic">No items found in this production schedule.</p>
                  <Button variant="link" className="text-primary font-black" onClick={() => handleOpenModal(null, day)}>+ Start Planning</Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Kitchen Production Plan" 
        subtitle="Review and schedule artisanal batches for today and tomorrow."
        action={
          <div className="flex gap-4">
            <Link to="/admin/menu-card">
              <Button variant="outline" className="rounded-xl font-bold gap-2">
                <ImageIcon className="w-4 h-4" /> View Menu Card
              </Button>
            </Link>
            <Button className="rounded-xl font-black gap-2 shadow-lg" onClick={() => handleOpenModal()}>
              <Plus className="w-5 h-5" /> Add New Production Item
            </Button>
          </div>
        }
      />

      <Tabs defaultValue="today" className="w-full" onValueChange={setCurrentView}>
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-8">
          <TabsList className="bg-muted/50 p-1 rounded-2xl h-16 w-full md:w-auto border border-border/40">
            <TabsTrigger value="today" className="rounded-xl font-black px-10 h-14 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg gap-3 transition-all">
              <Sparkles className="w-5 h-5" />
              <div className="flex flex-col items-start leading-tight">
                <span className="text-sm">Today's Batch</span>
                <span className="text-[9px] uppercase tracking-widest opacity-70">Active Production</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="tomorrow" className="rounded-xl font-black px-10 h-14 data-[state=active]:bg-leaf data-[state=active]:text-white data-[state=active]:shadow-lg gap-3 transition-all">
              <Calendar className="w-5 h-5" />
              <div className="flex flex-col items-start leading-tight">
                <span className="text-sm">Tomorrow's Prep</span>
                <span className="text-[9px] uppercase tracking-widest opacity-70">Advance Schedule</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder={`Find items in ${currentView === 'today' ? "today's live menu" : "tomorrow's plan"}...`} 
              className="pl-12 rounded-2xl bg-card border-border/40 h-16 font-bold shadow-sm focus-visible:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="today" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-6 p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <p className="text-xs font-bold text-primary uppercase tracking-widest">Kitchen Status: Today's Production is LIVE</p>
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase">{menu.today.length} items scheduled</p>
          </div>
          <ProductionList day="today" />
        </TabsContent>
        <TabsContent value="tomorrow" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-6 p-4 bg-leaf/5 border border-leaf/10 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-leaf animate-pulse" />
              <p className="text-xs font-bold text-leaf uppercase tracking-widest">Kitchen Status: Tomorrow's Prep Schedule</p>
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase">{menu.tomorrow.length} items planned</p>
          </div>
          <ProductionList day="tomorrow" />
        </TabsContent>
      </Tabs>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] p-0 border-none shadow-2xl bg-white overflow-hidden max-h-[95vh] flex flex-col">
          {/* Fixed Header */}
          <div className="bg-primary p-8 text-primary-foreground relative shrink-0">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-3xl font-display font-black leading-tight">
                {editingItem ? 'Update Item' : 'New Creation'}
              </DialogTitle>
              <p className="text-primary-foreground/70 font-medium text-sm">
                Fill in the details to list this on your public store.
              </p>
            </DialogHeader>
          </div>
          
          {/* Scrollable Body */}
          <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Product Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Artisanal Sourdough" className="rounded-xl h-14 bg-muted/20 border-none focus-visible:ring-primary" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Target Batch Size</Label>
                <Input id="stock" type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} placeholder="20" className="rounded-xl h-14 bg-muted/20 border-none focus-visible:ring-primary" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="day" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Available For</Label>
                <div className="relative">
                  <select 
                    id="day" 
                    value={formData.day} 
                    onChange={(e) => setFormData({...formData, day: e.target.value})} 
                    className="w-full h-14 px-4 rounded-xl border-none bg-muted/40 text-sm font-black text-foreground appearance-none cursor-pointer focus:ring-2 focus:ring-primary transition-all outline-none"
                  >
                    <option value="today" className="text-foreground bg-white">Today</option>
                    <option value="tomorrow" className="text-foreground bg-white">Tomorrow</option>
                  </select>
                  <Calendar className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary" />
                </div>
              </div>
            </div>


          </div>

          {/* Fixed Footer */}
          <DialogFooter className="p-8 pt-4 shrink-0">
            <Button onClick={handleSave} className="w-full rounded-2xl font-black h-16 text-lg gap-2 shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all bg-primary text-primary-foreground">
              <Save className="w-5 h-5" /> {editingItem ? 'Update Schedule' : 'Launch Item'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
