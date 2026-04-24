import React from 'react';
import PageHeader from "@/components/PageHeader";
import { useBakery } from "@/store/BakeryContext";
import { Card, CardContent } from "@/components/ui/card";
import { Send, CheckCircle2, Globe, Eye, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PublishMenu() {
  const { menu } = useBakery();
  
  const handlePublish = (day) => {
    toast.success(`${day} Menu published!`, {
      description: `Customers can now see the ${day.toLowerCase()} updates in the store.`
    });
  };

  const DayCard = ({ day, items, icon: Icon }) => {
    const draftCount = items.filter(m => !m.published).length;
    
    return (
      <Card className="border-none shadow-card rounded-[2.5rem] overflow-hidden bg-card border border-border/40">
        <div className="p-8 border-b border-border/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-black text-2xl">{day}</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{items.length} Items Total</p>
            </div>
          </div>
          {draftCount > 0 ? (
            <span className="bg-berry/10 text-berry text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              {draftCount} Drafts
            </span>
          ) : (
            <span className="bg-leaf/10 text-leaf text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              All Live
            </span>
          )}
        </div>
        <CardContent className="p-8 space-y-6">
          <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                <span className="text-sm font-bold">{item.name}</span>
                {item.published ? (
                  <CheckCircle2 className="w-4 h-4 text-leaf" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-berry animate-pulse" />
                )}
              </div>
            ))}
          </div>
          <Button 
            onClick={() => handlePublish(day)} 
            disabled={draftCount === 0}
            className="w-full h-14 rounded-2xl font-black gap-2 shadow-lg disabled:opacity-50"
          >
            <Send className="w-4 h-4" /> {draftCount > 0 ? `Publish ${day} Menu` : 'Nothing to Publish'}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <PageHeader 
        title="Sync Store" 
        subtitle="Finalize your plans and update the public menu."
      />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-10 bg-muted/50 p-1 rounded-2xl h-14">
          <TabsTrigger value="overview" className="rounded-xl font-black text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="preview" className="rounded-xl font-black text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Store Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <DayCard day="Today" items={menu.today} icon={Sparkles} />
            <DayCard day="Tomorrow" items={menu.tomorrow} icon={Calendar} />
          </div>

          <Card className="border-none shadow-warm bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] text-white rounded-[2.5rem] p-8 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-display font-black">Global Store Status</h3>
                <p className="text-sm text-white/60 font-medium">Your bakery is visible to customers across the region.</p>
              </div>
            </div>
            <Button variant="ghost" className="text-white hover:bg-white/10 rounded-xl font-bold gap-2">
              <Eye className="w-4 h-4" /> Live View
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="text-center py-20 bg-muted/20 rounded-[2.5rem] border-2 border-dashed">
          <Eye className="w-12 h-12 mx-auto text-muted-foreground/20 mb-4" />
          <h3 className="text-xl font-display font-black mb-2">Live Preview Pending</h3>
          <p className="text-muted-foreground font-medium max-w-sm mx-auto">
            This will show exactly how your customers see the menu on their mobile devices.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
