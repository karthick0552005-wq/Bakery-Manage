import React from 'react';

const statusStyles = {
  Pending: "bg-amber-100 text-amber-700 border-amber-200",
  Preparing: "bg-crust/10 text-crust border-crust/20",
  Ready: "bg-leaf/10 text-leaf border-leaf/20",
  Delivering: "bg-blue-100 text-blue-700 border-blue-200",
  Delivered: "bg-muted text-muted-foreground border-border",
  Cancelled: "bg-berry/10 text-berry border-berry/20",
  Approved: "bg-leaf/10 text-leaf border-leaf/20",
  Rejected: "bg-berry/10 text-berry border-berry/20",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusStyles[status] || "bg-muted text-muted-foreground border-border"}`}>
      {status}
    </span>
  );
}
