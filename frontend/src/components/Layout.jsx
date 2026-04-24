import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, LogOut, LayoutDashboard, UtensilsCrossed, ShoppingBag, User, ClipboardList, Package, MessageSquare, Bell, BarChart3, HelpCircle, ShoppingCart, ChefHat, Calendar, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBakery } from '@/store/BakeryContext';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useBakery();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Live Orders', href: '/admin/orders', icon: ClipboardList },
    { name: 'Production Plan', href: '/admin/menu', icon: UtensilsCrossed },
    { name: 'Menu Card', href: '/admin/menu-card', icon: BookOpen },
    { name: 'Inventory', href: '/admin/inventory', icon: Package },
    { name: 'Purchase Logs', href: '/admin/purchases', icon: ShoppingCart },
    { name: 'Business Reports', href: '/admin/reports', icon: BarChart3 },
    { name: 'Kitchen Requests', href: '/admin/kitchen-requests', icon: ChefHat },
    { name: 'Customer Feedback', href: '/admin/feedback', icon: MessageSquare },
  ];

  const customerLinks = [
    { name: 'Home', href: '/customer', icon: LayoutDashboard },
    { name: 'Live Shop', href: '/customer/menu', icon: ShoppingBag },
    { name: 'My Orders', href: '/customer/orders', icon: ClipboardList },
    { name: 'Pre-Orders', href: '/customer/pre-orders', icon: Calendar },
    { name: 'My Profile', href: '/customer/profile', icon: User },
    { name: 'Give Feedback', href: '/customer/feedback', icon: MessageSquare },
  ];

  const kitchenLinks = [
    { name: 'Dashboard', href: '/kitchen', icon: LayoutDashboard },
    { name: 'Production', href: '/kitchen/incoming', icon: ChefHat },
    { name: 'Inventory', href: '/kitchen/inventory', icon: Package },
    { name: 'Baking Reports', href: '/kitchen/reports', icon: BarChart3 },
    { name: 'Feedback View', href: '/kitchen/feedback', icon: MessageSquare },
  ];

  let navLinks = [];
  if (location.pathname.startsWith('/admin')) navLinks = adminLinks;
  else if (location.pathname.startsWith('/customer')) navLinks = customerLinks;
  else if (location.pathname.startsWith('/kitchen')) navLinks = kitchenLinks;
  else {
    // Fallback to role-based if not in a specific section
    if (user?.role === 'admin') navLinks = adminLinks;
    else if (user?.role === 'customer') navLinks = customerLinks;
    else if (user?.role === 'kitchen') navLinks = kitchenLinks;
  }

  return (
    <div className='min-h-screen bg-background flex flex-col md:flex-row'>
      {/* Sidebar for Desktop */}
      <aside className='hidden md:flex w-64 flex-col border-r bg-card sticky top-0 h-screen'>
        <div className='p-6 flex items-center gap-3'>
          <div className='w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-warm animate-float overflow-hidden'>
            <img 
              src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=100&auto=format&fit=crop" 
              alt="Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className='font-display font-black text-xl tracking-tight'>Crumb & Co.</span>
        </div>

        <nav className='flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar'>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 group ${
                location.pathname === link.href
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <link.icon className={`w-5 h-5 ${location.pathname === link.href ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-primary'}`} />
              {link.name}
            </Link>
          ))}
        </nav>

        <div className='p-4 border-t'>
          <div className='flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50 mb-4'>
            <div className='w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center'>
              <User className='w-4 h-4 text-primary' />
            </div>
            <div className='flex-1 overflow-hidden'>
              <p className='text-xs font-bold truncate'>{user?.name}</p>
              <p className='text-[10px] text-muted-foreground uppercase tracking-widest'>{user?.role}</p>
            </div>
          </div>
          <div className="mb-4 px-4 py-2 bg-leaf text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-lg text-center animate-pulse shadow-lg shadow-leaf/20">
            System Active
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant='ghost' 
                className='w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl'
              >
                <LogOut className='w-5 h-5' />
                <span className='font-bold'>Logout</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-display font-black">Ready to leave?</AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground font-medium">
                  We'll miss you! Make sure you've saved all your bakery updates before logging out.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-6 gap-3">
                <AlertDialogCancel className="rounded-xl font-bold h-12 border-muted hover:bg-muted">Stay here</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout} className="rounded-xl font-bold h-12 bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/20">
                  Yes, Log out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </aside>

      {/* Header for Mobile */}
      <header className='md:hidden border-b bg-card/80 backdrop-blur-md sticky top-0 z-50'>
        <div className='flex items-center justify-between px-4 py-4'>
          <Link to='/' className='flex items-center gap-2'>
            <div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center overflow-hidden'>
              <img 
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=100&auto=format&fit=crop" 
                alt="Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className='font-display font-black text-lg tracking-tight'>Crumb & Co.</span>
          </Link>

          <div className='flex items-center gap-2'>
            {user?.role === 'customer' && (
              <Link to="/customer/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                </Button>
              </Link>
            )}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant='ghost' size='icon'>
                  <Menu className='w-6 h-6' />
                </Button>
              </SheetTrigger>
              <SheetContent side='left' className="w-72 p-0">
                <div className='p-6 flex items-center gap-3 border-b'>
                  <div className='w-10 h-10 bg-primary rounded-xl flex items-center justify-center overflow-hidden'>
                    <img 
                      src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=100&auto=format&fit=crop" 
                      alt="Logo" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className='font-display font-black text-xl tracking-tight'>Crumb & Co.</span>
                </div>
                <nav className='p-4 space-y-1'>
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        to={link.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                          location.pathname === link.href
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        <link.icon className='w-5 h-5' />
                        {link.name}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                <div className='absolute bottom-0 w-full p-4 border-t bg-card'>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant='ghost' 
                        className='w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl'
                      >
                        <LogOut className='w-5 h-5' />
                        <span className='font-bold'>Logout</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-[2rem] p-8 border-none shadow-2xl mx-4">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-display font-black">Exit Bakery?</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm font-medium">
                          Are you sure you want to log out of your session?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-4 gap-2">
                        <AlertDialogCancel className="rounded-lg font-bold border-muted">No</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLogout} className="rounded-lg font-bold bg-destructive text-white">Yes, Logout</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1 p-4 md:p-8 overflow-x-hidden'>
        <Outlet />
      </main>
    </div>
  );
}
