import React, { useState } from 'react';
import PageHeader from "@/components/PageHeader";
import { useBakery } from "@/store/BakeryContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Search, Filter, Plus, Minus, Check, Sparkles, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddToCartConfirmation from "@/components/AddToCartConfirmation";
import BakeryItemImage from "@/components/BakeryItemImage";

export default function CustomerMenu() {
  const { menu, addToCart } = useBakery();
  const [searchTerm, setSearchTerm] = useState("");
  const [day, setDay] = useState("today");
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredMenu = (menu[day] || []).filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return item.published && matchesSearch;
  });

  const handleAddToCart = (item) => {
    addToCart(item);
    setSelectedItem(item);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* Menu Header Section */}
      <div className="relative text-center space-y-4 pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full border border-primary/20 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Crafted Daily</span>
        </div>
        <h1 className="text-6xl md:text-7xl font-display font-black tracking-tight text-foreground">
          The Menu <span className="text-primary italic text-5xl md:text-6xl font-serif">Book</span>
        </h1>
        <p className="text-muted-foreground font-medium max-w-2xl mx-auto text-lg italic">
          "From our oven to your hands, every crumb tells a story of passion and precision."
        </p>
      </div>

      {/* Filters & Navigation */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-card p-6 rounded-[2.5rem] border border-border/40 shadow-sm sticky top-4 z-40 backdrop-blur-md bg-card/80">
        <div className="relative w-full md:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="What are you craving today?" 
            className="pl-12 rounded-2xl bg-muted/30 border-none h-14 font-bold text-lg focus-visible:ring-primary shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Select value={day} onValueChange={setDay}>
            <SelectTrigger className="w-full md:w-[220px] h-14 rounded-2xl bg-primary text-primary-foreground border-none font-black text-lg shadow-xl hover:shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <SelectValue placeholder="Select Day" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl p-2 bg-white">
              <SelectItem value="today" className="rounded-xl font-black py-3 px-4 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <div className="flex flex-col">
                  <span className="text-sm">Today's Specials</span>
                  <span className="text-[10px] opacity-60 uppercase tracking-widest font-bold">Baked Fresh</span>
                </div>
              </SelectItem>
              <SelectItem value="tomorrow" className="rounded-xl font-black py-3 px-4 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <div className="flex flex-col">
                  <span className="text-sm">Tomorrow's Menu</span>
                  <span className="text-[10px] opacity-60 uppercase tracking-widest font-bold">Pre-Order Now</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Menu Grid */}
      {filteredMenu.length === 0 ? (
        <div className="p-32 text-center space-y-6 bg-muted/20 rounded-[3rem] border-4 border-dashed border-muted/50">
          <div className="w-20 h-20 bg-muted/40 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-display font-black">Nothing found in the oven</h3>
            <p className="text-muted-foreground font-medium italic">"Try searching for something else, or check our other days!"</p>
          </div>
          <Button variant="outline" className="rounded-2xl font-black h-12 px-8 border-2" onClick={() => setSearchTerm("")}>
            See All Items
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredMenu.map(item => (
            <Card key={item.id} className="group border-none shadow-none hover:shadow-2xl transition-all duration-500 rounded-[3rem] overflow-hidden bg-transparent flex flex-col">
              {/* Image Container with Elegant Frame */}
              <div className="aspect-[4/5] relative overflow-hidden rounded-[2.5rem] shadow-card group-hover:scale-[0.98] transition-transform duration-500">
                <BakeryItemImage 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full group-hover:scale-110 transition-transform duration-1000 ease-out" 
                />
                
                {/* Stock Status Badge */}
                {item.stock < 5 && item.stock > 0 && (
                  <div className="absolute top-6 left-6">
                    <span className="bg-berry text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-berry/30 animate-pulse">
                      Almost Gone!
                    </span>
                  </div>
                )}
                
                {/* Subtle Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                  <p className="text-white text-sm font-medium italic translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    Hand-crafted with the finest organic ingredients.
                  </p>
                </div>
              </div>

              {/* Menu Details - 'Book' Style */}
              <CardContent className="px-4 py-8 space-y-6 flex-1 flex flex-col">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-display font-black text-3xl tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
                      {item.name}
                    </h3>
                    <div className="h-px bg-border flex-1 border-dotted border-b-2 mt-4" />
                    <span className="font-display font-black text-3xl text-primary">
                      ₹{item.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground font-bold text-[10px] uppercase tracking-widest">
                    <div className={`w-2 h-2 rounded-full ${item.stock > 0 ? 'bg-leaf' : 'bg-berry'}`} />
                    <span>{item.stock > 0 ? `${item.stock} Pieces Available` : 'Fresh Batch Soon'}</span>
                  </div>
                </div>
                
                <div className="pt-2 mt-auto">
                  <Button 
                    className={`w-full rounded-[1.5rem] font-black h-16 text-lg gap-3 shadow-xl transition-all duration-300 ${
                      item.stock === 0 
                        ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                        : 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white shadow-primary/10'
                    }`}
                    onClick={() => handleAddToCart(item)}
                    disabled={item.stock === 0}
                  >
                    {item.stock === 0 ? (
                      "Out of Stock"
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Add to Order
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Confirmation Dialog Integration */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-sm">
          <div className="animate-in fade-in zoom-in duration-300">
            <Card className="rounded-[3rem] overflow-hidden border-none shadow-2xl bg-white">
              <AddToCartConfirmation 
                item={selectedItem} 
                onClose={() => setSelectedItem(null)} 
              />
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
