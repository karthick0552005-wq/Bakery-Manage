import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { useBakery } from "@/store/BakeryContext";
import StatusBadge from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, ClipboardList, Boxes, AlertTriangle, Check, X, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminDashboard() {
  const { orders, inventory, menu, kitchenRequests, updateKitchenRequestStatus, resetSystem } = useBakery();
  const [confirmAction, setConfirmAction] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const total = orders.reduce((s, o) => s + o.total, 0);
  const lowStock = inventory.filter((i) => i.stock < i.min);
  const todayCount = menu.today.filter((m) => m.published).length;
  const pendingRequests = kitchenRequests.filter(r => r.status === "Pending");

  const stats = [
    { label: "Total Sales", value: `₹${total.toFixed(2)}`, icon: TrendingUp, color: "text-leaf" },
    { label: "Total Orders", value: orders.length, icon: ClipboardList, color: "text-primary" },
    { label: "Published Items", value: todayCount, icon: Boxes, color: "text-accent" },
    { label: "Low Stock Alerts", value: lowStock.length, icon: AlertTriangle, color: "text-berry" },
  ];

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <PageHeader title="Welcome back, Baker" subtitle="Here's what's rising in your kitchen today." />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowResetConfirm(true)}
          className="mt-6 border-berry/20 text-berry hover:bg-berry/5 font-bold rounded-xl"
        >
          Reset All Data
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((s) => (
          <Card key={s.label} className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-border/40 bg-card/60 backdrop-blur-sm">
            <div className={`absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity ${s.color.replace('text-', 'bg-')}`} />
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{s.label}</p>
                  <p className="font-display text-3xl font-black tracking-tight text-foreground">{s.value}</p>
                </div>
                <div className={`p-3 rounded-2xl bg-muted/50 transition-colors group-hover:bg-primary/5 ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 min-h-[1.5rem]">
                <TrendingUp className="h-3 w-3 text-leaf" />
                <span className="text-[10px] font-semibold text-leaf">Trending upwards</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="shadow-card">
          <CardHeader><CardTitle className="font-display">Recent Orders</CardTitle></CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet — switch to Customer to place one.</p>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 5).map((o) => (
                  <div key={o.id} className="flex items-center justify-between border-b last:border-0 pb-3 last:pb-0">
                    <div>
                      <p className="font-medium">#{o.id.slice(-5)} · {o.customerName}</p>
                      <p className="text-xs text-muted-foreground">{o.items.reduce((sum, i) => sum + i.qty, 0)} items · ₹{o.total.toFixed(2)}</p>
                    </div>
                    <StatusBadge status={o.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="font-display">Low Stock</CardTitle></CardHeader>
          <CardContent>
            {lowStock.length === 0 ? (
              <div className="flex flex-col items-center gap-2 text-center p-6 bg-leaf/5 rounded-2xl border border-leaf/10">
                <PartyPopper className="h-8 w-8 text-leaf" />
                <p className="text-sm text-leaf font-bold">All ingredients are well stocked!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {lowStock.map((i) => (
                  <div key={i.id} className="flex items-center justify-between p-3 rounded-lg bg-berry/10 border border-berry/20">
                    <span className="font-medium">{i.name}</span>
                    <span className="text-sm text-berry font-semibold">{i.stock} {i.unit} left</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Kitchen Requests Card */}
        <Card className="shadow-card">
          <CardHeader><CardTitle className="font-display flex items-center justify-between">Kitchen Requests {pendingRequests.length > 0 && <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">{pendingRequests.length}</span>}</CardTitle></CardHeader>
          <CardContent>
            {pendingRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground">All caught up! No pending requests.</p>
            ) : (
              <div className="space-y-3">
                {pendingRequests.slice(0, 4).map((r) => (
                  <div key={r.id} className="p-3 rounded-lg border border-border/50 bg-muted/20 space-y-2">
                    <span className="text-[10px] font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10 tracking-wider uppercase">{r.type}</span>
                    <p className="text-xs font-semibold leading-relaxed line-clamp-2">{r.note}</p>
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" className="h-7 text-xs bg-leaf hover:bg-leaf/90 flex-1 font-bold" onClick={() => setConfirmAction({ id: r.id, status: "Approved" })}>
                        <Check className="h-3 w-3 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs border-berry/40 text-berry hover:bg-berry/10 flex-1 font-bold" onClick={() => setConfirmAction({ id: r.id, status: "Rejected" })}>
                        <X className="h-3 w-3 mr-1" /> Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <AlertDialogContent className="rounded-[2.5rem] p-10 border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-3xl font-display font-black">Verify Action</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-medium text-lg">
              Are you absolutely sure you want to <strong>{confirmAction?.status === 'Approved' ? 'approve' : 'reject'}</strong> this kitchen request? 
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3">
            <AlertDialogCancel className="rounded-xl font-bold h-12 border-muted hover:bg-muted">Review Again</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (confirmAction) {
                  updateKitchenRequestStatus(confirmAction.id, confirmAction.status);
                  setConfirmAction(null);
                }
              }}
              className={`rounded-xl font-bold h-12 shadow-lg transition-all hover:-translate-y-0.5 ${
                confirmAction?.status === "Approved" 
                  ? "bg-leaf text-white hover:bg-leaf/90 shadow-leaf/20" 
                  : "bg-berry text-white hover:bg-berry/90 shadow-berry/20"
              }`}
            >
              Yes, {confirmAction?.status} Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <AlertDialogContent className="rounded-[2.5rem] p-10 border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-3xl font-display font-black text-berry">Reset Entire System?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-medium text-lg">
              This will <strong>permanently delete</strong> all orders, menu items, inventory, and feedback. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3">
            <AlertDialogCancel className="rounded-xl font-bold h-12 border-muted hover:bg-muted">Keep Data</AlertDialogCancel>
            <AlertDialogAction 
              onClick={resetSystem}
              className="rounded-xl font-bold h-12 bg-berry text-white hover:bg-berry/90 shadow-lg shadow-berry/20 transition-all hover:-translate-y-0.5"
            >
              Yes, Delete Everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
