import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BakeryProvider } from "./store/BakeryContext";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminFeedback from "./pages/admin/AdminFeedback";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminReports from "./pages/admin/AdminReports";
import ManageMenu from "./pages/admin/ManageMenu";
import MenuPlanning from "./pages/admin/MenuPlanning";
import PublishMenu from "./pages/admin/PublishMenu";
import Inventory from "./pages/admin/Inventory";
import RawMaterials from "./pages/admin/RawMaterials";
import PurchaseEntries from "./pages/admin/PurchaseEntries";
import KitchenRequests from "./pages/admin/KitchenRequests";
import MenuCardView from "./pages/admin/MenuCardView";

// Customer Pages
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerMenu from "./pages/customer/CustomerMenu";
import Cart from "./pages/customer/Cart";
import CustomerOrders from "./pages/customer/CustomerOrders";
import TrackOrder from "./pages/customer/TrackOrder";
import PreOrders from "./pages/customer/PreOrders";
import Payments from "./pages/customer/Payments";
import CustomerProfile from "./pages/customer/CustomerProfile";
import CustomerFeedback from "./pages/customer/CustomerFeedback";
import Support from "./pages/customer/Support";

// Kitchen Pages
import KitchenDashboard from "./pages/kitchen/KitchenDashboard";
import KitchenIncoming from "./pages/kitchen/KitchenIncoming";
import KitchenInventory from "./pages/kitchen/KitchenInventory";
import KitchenFeedback from "./pages/kitchen/KitchenFeedback";
import KitchenReports from "./pages/kitchen/KitchenReports";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BakeryProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />

            {/* Main Application Layout */}
            <Route element={<Layout />}>
              <Route path="/home" element={<Home />} />
              
              {/* Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/feedback" element={<AdminFeedback />} />
                <Route path="/admin/notifications" element={<AdminNotifications />} />
                <Route path="/admin/reports" element={<AdminReports />} />
                <Route path="/admin/menu" element={<ManageMenu />} />
                <Route path="/admin/menu-planning" element={<MenuPlanning />} />
                <Route path="/admin/publish-menu" element={<PublishMenu />} />
                <Route path="/admin/inventory" element={<Inventory />} />
                <Route path="/admin/raw-materials" element={<RawMaterials />} />
                <Route path="/admin/purchases" element={<PurchaseEntries />} />
                <Route path="/admin/kitchen-requests" element={<KitchenRequests />} />
                <Route path="/admin/menu-card" element={<MenuCardView />} />
              </Route>

              {/* Customer Routes */}
              <Route element={<ProtectedRoute allowedRoles={['customer', 'admin']} />}>
                <Route path="/customer" element={<CustomerDashboard />} />
                <Route path="/customer/menu" element={<CustomerMenu />} />
                <Route path="/customer/cart" element={<Cart />} />
                <Route path="/customer/orders" element={<CustomerOrders />} />
                <Route path="/customer/track-order" element={<TrackOrder />} />
                <Route path="/customer/pre-orders" element={<PreOrders />} />
                <Route path="/customer/payments" element={<Payments />} />
                <Route path="/customer/profile" element={<CustomerProfile />} />
                <Route path="/customer/feedback" element={<CustomerFeedback />} />
                <Route path="/customer/support" element={<Support />} />
              </Route>

              {/* Kitchen Routes */}
              <Route element={<ProtectedRoute allowedRoles={['kitchen', 'admin']} />}>
                <Route path="/kitchen" element={<KitchenDashboard />} />
                <Route path="/kitchen/incoming" element={<KitchenIncoming />} />
                <Route path="/kitchen/inventory" element={<KitchenInventory />} />
                <Route path="/kitchen/feedback" element={<KitchenFeedback />} />
                <Route path="/kitchen/reports" element={<KitchenReports />} />
              </Route>
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </BakeryProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
