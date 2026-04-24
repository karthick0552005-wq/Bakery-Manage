import React from 'react';
import PageHeader from "@/components/PageHeader";
import { useBakery } from "@/store/BakeryContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MapPin, Phone, Shield, Edit3, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import BakeryItemImage from "@/components/BakeryItemImage";

export default function CustomerProfile() {
  const { user, updateUser } = useBakery();
  const [formData, setFormData] = React.useState({ 
    name: user?.name || '', 
    email: user?.email || 'hello@bakeryhub.com', 
    phone: user?.phone || '+1 (555) 123-4567',
    location: user?.location || 'Cloud City, NY'
  });
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSave = () => {
    updateUser({ 
      ...user, 
      name: formData.name, 
      email: formData.email, 
      phone: formData.phone,
      location: formData.location 
    });
    setIsOpen(false);
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="relative h-48 bg-gradient-hero rounded-[2.5rem] shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000')] opacity-20 bg-cover bg-center" />
      </div>

      <div className="relative -mt-24 px-8 pb-10 space-y-8">
        <div className="flex flex-col md:flex-row items-end gap-6">
          <div className="w-32 h-32 rounded-[2rem] bg-white p-2 shadow-2xl">
            <div className="w-full h-full rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary">
              <User className="w-16 h-16" />
            </div>
          </div>
          <div className="flex-1 space-y-1 mb-2">
            <h1 className="text-4xl font-display font-black tracking-tight">{user?.name || "The Baker"}</h1>
            <p className="text-muted-foreground font-bold flex items-center gap-2">
              <MapPin className="w-4 h-4" /> {user?.location || 'Cloud City, NY'}
            </p>
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl font-bold gap-2 mb-2 px-6 h-12 shadow-lg">
                <Edit3 className="w-4 h-4" /> Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-display font-black">Edit Profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                  <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="rounded-xl h-12 bg-muted/30 border-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email</Label>
                  <Input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="rounded-xl h-12 bg-muted/30 border-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number</Label>
                  <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="rounded-xl h-12 bg-muted/30 border-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Location</Label>
                  <Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="rounded-xl h-12 bg-muted/30 border-none" />
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button onClick={handleSave} className="w-full rounded-xl font-black h-12 bg-primary text-white shadow-lg">Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card className="border-none shadow-card rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="font-display font-black text-xl flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" /> Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name</p>
                    <p className="font-bold">{user?.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Address</p>
                    <p className="font-bold">{user?.email || 'hello@bakeryhub.com'}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone Number</p>
                    </div>
                    <p className="font-bold">{user?.phone || '+1 (555) 123-4567'}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Location</p>
                    </div>
                    <p className="font-bold">{user?.location || 'Cloud City, NY'}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Shield className="w-3 h-3 text-muted-foreground" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Account Status</p>
                    </div>
                    <span className="bg-leaf/10 text-leaf text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Verified Member</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-card rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="font-display font-black text-xl flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" /> Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                  <div className="space-y-1">
                    <p className="font-bold text-sm">Order Notifications</p>
                    <p className="text-xs text-muted-foreground">Receive real-time updates on your bakes.</p>
                  </div>
                  <div className="w-12 h-6 bg-leaf rounded-full p-1 flex justify-end items-center">
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-warm bg-secondary rounded-[2rem] p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm overflow-hidden">
                <BakeryItemImage 
                  src="https://images.unsplash.com/photo-1533479093185-1036abc92df0?q=80&w=200&auto=format&fit=crop" 
                  alt="Rewards" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <h3 className="font-display font-black text-xl">Crumbs Rewards</h3>
              <div className="space-y-1">
                <p className="text-4xl font-display font-black text-primary">1,240</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Balance</p>
              </div>
              <Button 
                variant="outline" 
                className="w-full rounded-xl font-bold border-primary/20 text-primary hover:bg-primary/5"
                onClick={() => toast.success("Rewards Redeemed!", {
                  description: "1,000 points have been converted to a ₹100 discount voucher."
                })}
              >
                Redeem Rewards
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
