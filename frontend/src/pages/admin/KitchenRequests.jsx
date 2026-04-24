import { useBakery } from "@/store/BakeryContext";
import PageHeader from "@/components/PageHeader";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Clock, MessageSquare, ChefHat, AlertCircle } from "lucide-react";
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

export default function KitchenRequests() {
  const { kitchenRequests, updateKitchenRequestStatus } = useBakery();
  const [confirmAction, setConfirmAction] = useState(null);

  const pending = kitchenRequests.filter(r => r.status === "Pending");
  const history = kitchenRequests.filter(r => r.status !== "Pending");

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Kitchen Requests" 
        subtitle="Manage restocking requests and operational help needed from the cloud kitchen."
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pending Requests */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-display text-lg font-bold flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" /> Pending Action ({pending.length})
          </h3>
          
          {pending.length === 0 ? (
            <Card className="border-dashed border-2 bg-muted/20">
              <CardContent className="flex flex-col items-center justify-center p-12 space-y-3">
                <ChefHat className="h-8 w-8 text-muted-foreground/30" />
                <p className="text-muted-foreground text-sm">No pending requests from the kitchen.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pending.map(r => (
                <Card key={r.id} className="border-border/40 shadow-sm overflow-hidden group">
                  <div className="h-1 w-full bg-amber-400" />
                  <CardContent className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            {r.type}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-bold italic">
                            {new Date(r.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="font-semibold text-foreground/90">{r.note}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          onClick={() => setConfirmAction({ id: r.id, status: "Approved" })}
                          size="sm" 
                          className="bg-leaf hover:bg-leaf/90 gap-1.5 font-bold"
                        >
                          <Check className="h-4 w-4" /> Approve
                        </Button>
                        <Button 
                          onClick={() => setConfirmAction({ id: r.id, status: "Rejected" })}
                          size="sm" 
                          variant="outline" 
                          className="border-berry text-berry hover:bg-berry/10 gap-1.5 font-bold"
                        >
                          <X className="h-4 w-4" /> Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* History / Recent Actions */}
        <div className="space-y-4">
          <h3 className="font-display text-lg font-bold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-accent" /> Recent Activity
          </h3>
          <Card className="border-border/40 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              {history.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-10">No history available.</p>
              ) : (
                <div className="divide-y divide-border/30">
                  {history.slice(0, 10).map(r => (
                    <div key={r.id} className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{r.type}</span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          r.status === "Approved" ? "bg-leaf/10 text-leaf" : "bg-berry/10 text-berry"
                        }`}>
                          {r.status}
                        </span>
                      </div>
                      <p className="text-xs text-foreground/70 line-clamp-2">{r.note}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <AlertCircle className="h-4 w-4" />
              <p className="text-xs font-bold uppercase tracking-wider">Quick Note</p>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              When you **Approve** a restock request, remember to manually update the inventory counts in the **Raw Materials** or **Inventory** section.
            </p>
          </div>
        </div>
      </div>

      <AlertDialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to <strong>{confirmAction?.status === 'Approved' ? 'approve' : 'reject'}</strong> this request? 
              {confirmAction?.status === 'Approved' && " Remember to manually adjust the inventory later!"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (confirmAction) {
                  updateKitchenRequestStatus(confirmAction.id, confirmAction.status);
                  setConfirmAction(null);
                }
              }}
              className={confirmAction?.status === "Approved" ? "bg-leaf text-white hover:bg-leaf/90" : "bg-berry text-white hover:bg-berry/90"}
            >
              Yes, {confirmAction?.status}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
