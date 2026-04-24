import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  onClick?: () => void;
}

const NavLink = ({ href, icon: Icon, children, onClick }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link
      to={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 group",
        isActive 
          ? "bg-primary text-primary-foreground shadow-md" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className={cn(
        "w-5 h-5 transition-colors",
        isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
      )} />
      {children}
    </Link>
  );
};

export default NavLink;
