import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBakery } from '@/store/BakeryContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, User, ShieldCheck } from 'lucide-react';

export default function Login() {
  const { login } = useBakery();
  const navigate = useNavigate();

  const handleLogin = (role) => {
    login(role);
    if (role === 'admin') navigate('/admin');
    else if (role === 'kitchen') navigate('/kitchen');
    else navigate('/customer');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfcfb] p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:flex flex-col justify-center space-y-6">
          <div className="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center shadow-warm animate-float overflow-hidden border-4 border-white/20">
            <img 
              src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=200&auto=format&fit=crop" 
              alt="Artisanal Bread" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-5xl font-display font-black tracking-tight leading-tight">
            Freshly Baked <br /> 
            <span className="text-primary">Management.</span>
          </h1>
          <p className="text-lg text-muted-foreground font-medium max-w-sm">
            Access your dashboard to manage orders, inventory, and kitchen operations with ease.
          </p>
        </div>

        <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
          <CardHeader className="pt-10 pb-6 text-center">
            <CardTitle className="text-2xl font-display font-bold">Welcome Back</CardTitle>
            <CardDescription className="font-medium">Select your portal to continue</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-10 space-y-4">
            <Button 
              onClick={() => handleLogin('admin')}
              className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-start px-6 gap-4 group transition-all duration-300 hover:translate-x-1"
            >
              <div className="p-2 rounded-lg bg-white/10 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="font-bold">Admin Portal</p>
                <p className="text-[10px] opacity-70 uppercase tracking-widest font-black">Full Control</p>
              </div>
            </Button>

            <Button 
              onClick={() => handleLogin('kitchen')}
              variant="outline"
              className="w-full h-16 rounded-2xl border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 flex items-center justify-start px-6 gap-4 group transition-all duration-300 hover:translate-x-1"
            >
              <div className="p-2 rounded-lg bg-primary/10 group-hover:scale-110 transition-transform">
                <ChefHat className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-bold text-foreground">Kitchen Staff</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Order Queue & Stock</p>
              </div>
            </Button>

            <Button 
              onClick={() => handleLogin('customer')}
              variant="ghost"
              className="w-full h-16 rounded-2xl hover:bg-secondary flex items-center justify-start px-6 gap-4 group transition-all duration-300 hover:translate-x-1"
            >
              <div className="p-2 rounded-lg bg-secondary-foreground/10 group-hover:scale-110 transition-transform">
                <User className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div className="text-left">
                <p className="font-bold text-foreground">Customer Store</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Browse & Order</p>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
