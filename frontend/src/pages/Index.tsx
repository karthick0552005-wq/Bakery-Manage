import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, ShieldCheck, ShoppingBag, ChefHat, Clock } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-warm overflow-hidden border-2 border-white/20">
              <img 
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=100&auto=format&fit=crop" 
                alt="Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-display font-black text-2xl tracking-tight text-foreground">Crumb & Co.</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#portals" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Our Portals</a>
            <a href="#about" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">About</a>
            <Button variant="ghost" className="rounded-xl font-bold" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button className="rounded-full font-black px-8 shadow-lg" asChild>
              <Link to="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 min-h-[85vh] flex items-center">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
                <Star className="w-4 h-4 text-primary fill-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Premium Bakery Management OS</span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black tracking-tight leading-[0.95] text-foreground">
                One Hub. <br /> 
                <span className="text-primary italic">Every</span> <br /> 
                Batch.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Empower your bakery with specialized portals for Admins, Kitchen staff, and Customers. 
                Streamlined, artisanal, and perfectly baked.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Button size="lg" className="rounded-full font-black h-16 px-10 text-lg shadow-2xl hover:-translate-y-1 transition-all gap-2" asChild>
                  <Link to="/login">
                    Order Now <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
              <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden shadow-2xl animate-float relative group">
                <img 
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop" 
                  alt="Bakery Display" 
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 flex items-center justify-center p-12">
                  <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl rotate-3">
                    <img 
                      src="https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=500&auto=format&fit=crop" 
                      alt="Fresh Bread" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portals Section */}
      <section id="portals" className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-black text-foreground">Explore Our Portals</h2>
            <p className="text-muted-foreground font-medium max-w-xl mx-auto">
              A unified system designed specifically for the unique needs of every role in your bakery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Admin Portal", 
                desc: "Full oversight of sales, inventory, menu planning, and business reports.", 
                icon: ShieldCheck,
                color: "text-primary",
                bg: "bg-primary/10"
              },
              { 
                title: "Customer Portal", 
                desc: "Seamless ordering experience with live tracking and rewards for your treats.", 
                icon: ShoppingBag,
                color: "text-leaf",
                bg: "bg-leaf/10"
              },
              { 
                title: "Cloud Kitchen", 
                desc: "Live prep bench, production tracking, and instant restock requests for chefs.", 
                icon: ChefHat,
                color: "text-accent",
                bg: "bg-accent/10"
              }
            ].map((f, i) => (
              <Link key={i} to="/login" className="group">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-warm transition-all h-full space-y-6 flex flex-col items-center text-center md:items-start md:text-left border border-transparent hover:border-primary/20">
                  <div className={`w-14 h-14 ${f.bg} ${f.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <f.icon className="w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-display font-black text-foreground">{f.title}</h3>
                    <p className="text-muted-foreground font-medium text-sm leading-relaxed">{f.desc}</p>
                  </div>
                  <div className="pt-4 mt-auto">
                    <span className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                      Access Portal <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-border/40 bg-white">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center overflow-hidden border border-white/20">
              <img 
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=100&auto=format&fit=crop" 
                alt="Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-display font-black text-xl tracking-tight text-foreground">Crumb & Co.</span>
          </div>
          <p className="text-sm text-muted-foreground font-medium text-center">
            © 2024 Crumb & Co. Artisanal Bakery Hub. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary">Admin</Link>
            <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary">Kitchen</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
