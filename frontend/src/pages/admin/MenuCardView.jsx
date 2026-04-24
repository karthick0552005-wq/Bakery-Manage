import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageHeader from "@/components/PageHeader";
import { useBakery } from "@/store/BakeryContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Sparkles, Calendar, BookOpen, Plus, Save, Upload, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BakeryItemImage from "@/components/BakeryItemImage";

export default function MenuCardView() {
  const navigate = useNavigate();
  const { menu, addMenuItem, updateMenuItem, deleteMenuItem } = useBakery();
  const [searchTerm, setSearchTerm] = useState("");
  const [day, setDay] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', category: 'Bread', stock: '20', image: '', day: 'today' });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, image: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.price) { return; }
    const itemData = { 
      name: formData.name, 
      price: parseFloat(formData.price), 
      category: formData.category, 
      stock: parseInt(formData.stock) || 0, 
      image: formData.image, 
      published: true 
    };

    if (editingItem) {
      updateMenuItem(editingItem.id, itemData, formData.day);
    } else {
      addMenuItem(itemData, formData.day);
    }
    
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({ name: '', price: '', category: 'Bread', stock: '20', image: '', day: 'today' });
  };

  const openEditModal = (item, itemDay) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      category: item.category || 'Bread',
      stock: item.stock.toString(),
      image: item.image || '',
      day: itemDay
    });
    setIsModalOpen(true);
  };

  const confirmDelete = (item, itemDay) => {
    setItemToDelete({ ...item, day: itemDay });
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (itemToDelete) {
      deleteMenuItem(itemToDelete.id, itemToDelete.day);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const filteredMenu = (() => {
    let items = [];
    if (day === "all") {
      items = [
        ...(menu.today || []).map(item => ({ ...item, dayContext: 'today' })), 
        ...(menu.tomorrow || []).map(item => ({ ...item, dayContext: 'tomorrow' }))
      ];
    } else {
      items = (menu[day] || []).map(item => ({ ...item, dayContext: day }));
    }
    
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      return item.published && matchesSearch;
    });
  })();

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <PageHeader 
        title="Digital Menu Card" 
        subtitle="Preview how your menu book looks to customers."
        action={
          <div className="flex gap-3">
            <Button onClick={() => setIsModalOpen(true)} className="rounded-xl font-black gap-2 shadow-lg">
              <Plus className="w-5 h-5" /> Add New Item
            </Button>
          </div>
        }
      />

      {/* Preview Frame */}
      <div className="relative group">
        {/* Book Spine Decoration */}
        <div className="absolute -left-6 top-10 bottom-10 w-12 bg-primary rounded-l-3xl shadow-2xl z-0" />
        
        <div className="relative z-10 border-[16px] border-card bg-[#fdfaf3] rounded-[4rem] shadow-2xl overflow-hidden p-8 md:p-16 min-h-[900px] border-double outline outline-1 outline-primary/20">
          {/* Subtle Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
          
          <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />
          
          {/* Internal Header */}
          <div className="relative text-center space-y-6 pt-8 mb-16">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/10 text-primary rounded-full border border-primary/30 mb-2">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-[0.3em]">Artisanal Selection</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-display font-black tracking-tight text-foreground">
              The Menu <span className="text-primary italic text-5xl md:text-6xl font-serif">Book</span>
            </h1>
            <p className="text-muted-foreground font-medium max-w-xl mx-auto text-base italic">
              "From our oven to your hands, every crumb tells a story of passion and precision."
            </p>
          </div>

          {/* Controls inside Preview */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-12 bg-white/50 p-4 rounded-3xl border border-border/40">
            <div className="relative w-full md:max-w-xs group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search items..." 
                className="pl-12 rounded-2xl bg-white border-none h-12 font-bold shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={day} onValueChange={setDay}>
              <SelectTrigger className="w-full md:w-[200px] h-12 rounded-2xl bg-white border-none font-black shadow-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <SelectValue placeholder="Select Day" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl">
                <SelectItem value="all" className="font-bold">Full Catalog</SelectItem>
                <SelectItem value="today" className="font-bold">Today's Specials</SelectItem>
                <SelectItem value="tomorrow" className="font-bold">Tomorrow's Menu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Menu Grid */}
          {filteredMenu.length === 0 ? (
            <div className="p-20 text-center space-y-4 bg-muted/20 rounded-[3rem] border-2 border-dashed">
              <Search className="w-12 h-12 mx-auto text-muted-foreground/20" />
              <p className="text-muted-foreground font-medium italic">No items found in this section.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMenu.map(item => (
                <Card key={item.id} className="group border-none shadow-none hover:shadow-xl transition-all duration-500 rounded-[2.5rem] overflow-hidden bg-transparent">
                  <div className="aspect-[4/5] relative overflow-hidden rounded-[2rem] shadow-card group-hover:scale-[0.98] transition-transform duration-500">
                    <BakeryItemImage src={item.image} alt={item.name} className="w-full h-full group-hover:scale-110 transition-transform duration-1000 ease-out" />
                    {item.stock < 5 && item.stock > 0 && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-berry text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg animate-pulse">Almost Gone!</span>
                      </div>
                    )}
                    {menu.tomorrow.some(t => t.id === item.id) && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-leaf text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">Tomorrow's Prep</span>
                      </div>
                    )}
                  </div>

                  <CardContent className="px-2 py-6 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display font-black text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">{item.name}</h3>
                        <div className="h-px bg-border flex-1 border-dotted border-b-2 mt-3" />
                        <span className="font-display font-black text-xl text-primary">₹{item.price.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground font-bold text-[9px] uppercase tracking-widest">
                        <div className={`w-1.5 h-1.5 rounded-full ${item.stock > 0 ? 'bg-leaf' : 'bg-berry'}`} />
                        <span>{item.stock > 0 ? `${item.stock} Available` : 'Sold Out'}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 rounded-xl h-9 text-[10px] font-black uppercase tracking-widest border-primary/20 text-primary hover:bg-primary/5"
                        onClick={() => openEditModal(item, item.dayContext)}
                      >
                        Edit Item
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-xl h-9 w-9 p-0 border-berry/20 text-berry hover:bg-berry/5"
                        onClick={() => confirmDelete(item, item.dayContext)}
                      >
                        <Plus className="w-4 h-4 rotate-45" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Item Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-[480px] rounded-[2.5rem] p-0 border-none shadow-2xl bg-white overflow-hidden max-h-[95vh] flex flex-col">
          <div className="bg-primary p-8 text-primary-foreground shrink-0">
            <DialogHeader>
              <DialogTitle className="text-3xl font-display font-black">
                {editingItem ? 'Refine Creation' : 'New Creation'}
              </DialogTitle>
              <p className="text-primary-foreground/70 font-medium text-sm mt-1">
                {editingItem ? 'Update the details of your artisanal product.' : 'Add a new item to your menu.'}
              </p>
            </DialogHeader>
          </div>
          <div className="p-8 space-y-5 overflow-y-auto flex-1">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Product Name *</Label>
              <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Chocolate Croissant" className="rounded-xl h-12 bg-muted/20 border-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Price (₹) *</Label>
                <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="6.00" className="rounded-xl h-12 bg-muted/20 border-none" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Batch Size</Label>
                <Input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} placeholder="20" className="rounded-xl h-12 bg-muted/20 border-none" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Schedule For</Label>
              <select value={formData.day} onChange={e => setFormData({...formData, day: e.target.value})} className="w-full h-12 px-4 rounded-xl border-none bg-muted/40 text-sm font-black outline-none focus:ring-2 focus:ring-primary">
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Product Image</Label>
              <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-2xl border-2 border-dashed">
                <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center overflow-hidden border">
                  {formData.image ? <img src={formData.image} alt="Preview" className="w-full h-full object-cover" /> : <ImageIcon className="w-5 h-5 text-muted-foreground/30" />}
                </div>
                <div>
                  <Input type="file" accept="image/*" className="hidden" id="mc-image-upload" onChange={handleImageChange} />
                  <Label htmlFor="mc-image-upload" className="flex items-center gap-2 px-4 py-2 bg-white border shadow-sm rounded-xl cursor-pointer hover:bg-muted text-[10px] font-black uppercase tracking-widest">
                    <Upload className="w-3.5 h-3.5 text-primary" /> Choose Photo
                  </Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="p-8 pt-0 shrink-0">
            <Button onClick={handleSave} className="w-full rounded-2xl font-black h-14 text-lg gap-2 shadow-xl hover:-translate-y-1 transition-all bg-primary text-primary-foreground">
              <Save className="w-5 h-5" /> {editingItem ? 'Update Item' : 'Launch Item'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-[2.5rem] p-0 border-none shadow-2xl bg-white overflow-hidden">
          <div className="bg-berry p-8 text-white shrink-0">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display font-black">Remove Item?</DialogTitle>
              <p className="text-white/70 font-medium text-sm mt-1">This action cannot be undone.</p>
            </DialogHeader>
          </div>
          <div className="p-8 space-y-4">
            <p className="font-medium text-muted-foreground text-center">
              Are you sure you want to remove <strong className="text-foreground">{itemToDelete?.name}</strong> from the menu?
            </p>
            <div className="flex gap-3 mt-4">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="flex-1 rounded-2xl font-bold h-12">
                Cancel
              </Button>
              <Button onClick={handleDelete} className="flex-1 rounded-2xl font-black h-12 bg-berry text-white hover:bg-berry/90">
                Yes, Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
