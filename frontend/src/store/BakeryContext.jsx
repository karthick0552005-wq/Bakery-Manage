import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const BakeryContext = createContext(null);

export const BakeryProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem("bakery_inventory");
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [menu, setMenu] = useState(() => {
    const saved = localStorage.getItem("bakery_menu");
    if (saved) return JSON.parse(saved);
    return {
      today: [],
      tomorrow: []
    };
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("bakery_cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem("bakery_menu", JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    localStorage.setItem("bakery_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("bakery_cart", JSON.stringify(cart));
  }, [cart]);

  // Sync inventory with LocalStorage
  useEffect(() => {
    localStorage.setItem("bakery_inventory", JSON.stringify(inventory));
  }, [inventory]);

  // Listen for changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "bakery_menu") setMenu(JSON.parse(e.newValue));
      if (e.key === "bakery_orders") setOrders(JSON.parse(e.newValue));
      if (e.key === "bakery_cart") setCart(JSON.parse(e.newValue));
      if (e.key === "bakery_inventory") setInventory(JSON.parse(e.newValue));
      if (e.key === "bakery_kitchen_requests") setKitchenRequests(JSON.parse(e.newValue));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const [kitchenRequests, setKitchenRequests] = useState(() => {
    const saved = localStorage.getItem("bakery_kitchen_requests");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("bakery_kitchen_requests", JSON.stringify(kitchenRequests));
  }, [kitchenRequests]);

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("bakery_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (role) => {
    const userData = { role, name: role.charAt(0).toUpperCase() + role.slice(1) + " User" };
    setUser(userData);
    localStorage.setItem("bakery_user", JSON.stringify(userData));
    toast.success(`Logged in as ${userData.name}`);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("bakery_user");
    toast.info("Logged out successfully");
  };

  const updateUser = (updatedData) => {
    setUser(updatedData);
    localStorage.setItem("bakery_user", JSON.stringify(updatedData));
  };

  const addKitchenRequest = (type, note) => {
    const newRequest = {
      id: `REQ${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      type,
      note,
      status: "Pending",
      createdAt: new Date().toISOString()
    };
    setKitchenRequests([newRequest, ...kitchenRequests]);
  };

  const updateKitchenRequestStatus = (id, status) => {
    setKitchenRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    toast.success(`Request ${status}`);
  };

  const placeOrder = (items) => {
    // 1. Check if enough stock is available for all items
    for (const orderedItem of items) {
      const menuItem = menu.today.find(m => m.id === orderedItem.id);
      if (menuItem && menuItem.stock < orderedItem.qty) {
        toast.error(`Not enough stock for ${orderedItem.name}!`, {
          description: `Only ${menuItem.stock} pcs available.`
        });
        return null;
      }
    }

    // 2. Deduct stock from menu items
    setMenu(prev => ({
      ...prev,
      today: prev.today.map(menuItem => {
        const orderedItem = items.find(i => i.id === menuItem.id);
        if (orderedItem) {
          return { ...menuItem, stock: Math.max(0, menuItem.stock - orderedItem.qty) };
        }
        return menuItem;
      })
    }));

    // 3. Create the order
    const newOrder = {
      id: `ORD${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      customerName: user?.name || "Guest",
      items,
      total: items.reduce((sum, i) => sum + i.price * i.qty, 0),
      status: "Pending",
      createdAt: new Date().toISOString()
    };
    setOrders([...orders, newOrder]);
    toast.success("Order placed successfully!");
    return newOrder;
  };

  const updateOrderStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    toast.success(`Order #${id.slice(-5)} marked as ${status}`);
  };

  const addMenuItem = (item, day = 'today') => {
    const newItem = { ...item, id: Math.floor(Math.random() * 10000), published: true };
    setMenu(prev => ({
      ...prev,
      [day]: [...prev[day], newItem]
    }));
    toast.success(`${item.name} added to ${day} menu!`);
  };

  const updateMenuItem = (id, updatedItem, day = 'today') => {
    setMenu(prev => ({
      ...prev,
      [day]: prev[day].map(item => item.id === id ? { ...item, ...updatedItem } : item)
    }));
    toast.success(`${updatedItem.name} updated in ${day} menu!`);
  };

  const deleteMenuItem = (id, day = 'today') => {
    setMenu(prev => ({
      ...prev,
      [day]: prev[day].filter(item => item.id !== id)
    }));
    toast.success("Item removed from menu");
  };

  const [productionLog, setProductionLog] = useState([]);

  const [purchases, setPurchases] = useState(() => {
    const saved = localStorage.getItem("bakery_purchases");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("bakery_purchases", JSON.stringify(purchases));
  }, [purchases]);

  const addPurchaseEntry = (itemName, qty, unit, supplier, totalAmount = 0) => {
    const newEntry = {
      id: `PUR-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString(),
      supplier: supplier || "Manual Adjustment",
      items: unit === 'entry' ? String(itemName) : `${qty > 0 ? '+' : ''}${qty} ${unit} of ${itemName}`,
      total: totalAmount,
      status: "Received",
      type: unit === 'entry' ? "manual" : "stock_adjustment"
    };
    setPurchases(prev => [newEntry, ...prev]);
  };
  const [feedbacks, setFeedbacks] = useState(() => {
    const saved = localStorage.getItem("bakery_feedback");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("bakery_feedback", JSON.stringify(feedbacks));
  }, [feedbacks]);

  const addFeedback = (rating, comment) => {
    const newFeedback = {
      id: Date.now(),
      customer: user?.name || "Anonymous",
      rating,
      comment,
      date: "Just now",
      status: "New"
    };
    setFeedbacks([newFeedback, ...feedbacks]);
  };

  const completeProductionBatch = (itemId, producedQty) => {
    // 1. Add produced quantity to the menu item's stock
    setMenu(prev => {
      const todayMenu = prev.today.map(item => {
        if (item.id === itemId) {
          return { ...item, stock: item.stock + producedQty };
        }
        return item;
      });
      return { ...prev, today: todayMenu };
    });

    // 2. Deduct raw materials (simplified: each item uses some flour, butter, sugar)
    setInventory(prev => prev.map(inv => {
      if (inv.name === "Flour") return { ...inv, stock: Math.max(0, inv.stock - (producedQty * 0.5)) };
      if (inv.name === "Butter") return { ...inv, stock: Math.max(0, inv.stock - (producedQty * 0.2)) };
      if (inv.name === "Sugar") return { ...inv, stock: Math.max(0, inv.stock - (producedQty * 0.1)) };
      return inv;
    }));

    // 3. Log the production entry
    const item = menu.today.find(i => i.id === itemId);
    setProductionLog(prev => [...prev, {
      id: `PROD${Date.now()}`,
      itemName: item?.name || "Unknown",
      qty: producedQty,
      completedAt: new Date().toISOString(),
    }]);

    toast.success(`${producedQty} pcs produced!`, {
      description: `Stock updated & raw materials deducted.`,
    });
  };

  const addInventoryItem = (item) => {
    const newItem = {
      ...item,
      id: `INV${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      stock: 0,
      bakeryStock: 0,
      kitchenStock: 0,
    };
    setInventory(prev => [...prev, newItem]);
    toast.success(`${item.name} added to inventory!`);
  };

  const updateInventoryStock = (id, adjustAmount, supplier = '', totalAmount = 0, location = 'Kitchen') => {
    let itemName = '';
    let itemUnit = '';
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        itemName = item.name;
        itemUnit = item.unit;
        
        const currentBakeryStock = item.bakeryStock || 0;
        const currentKitchenStock = item.kitchenStock || (item.stock || 0); // migrate old stock to kitchen
        
        let newBakeryStock = currentBakeryStock;
        let newKitchenStock = currentKitchenStock;
        
        if (location === 'Bakery') {
          newBakeryStock = Math.max(0, currentBakeryStock + adjustAmount);
        } else {
          newKitchenStock = Math.max(0, currentKitchenStock + adjustAmount);
        }
        
        return { 
          ...item, 
          bakeryStock: newBakeryStock,
          kitchenStock: newKitchenStock,
          stock: newBakeryStock + newKitchenStock
        };
      }
      return item;
    }));
    if (adjustAmount > 0 && itemName) {
      addPurchaseEntry(itemName, adjustAmount, itemUnit, supplier, totalAmount);
    }
    toast.success(`${location} stock updated`);
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
    toast.success(`Added ${item.name} to cart!`);
  };

  const updateCartItemQty = (id, delta) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
    toast.info("Item removed from cart");
  };

  const clearCart = () => setCart([]);

  const resetSystem = () => {
    localStorage.clear();
    setOrders([]);
    setInventory([]);
    setMenu({ today: [], tomorrow: [] });
    setKitchenRequests([]);
    setFeedbacks([]);
    setCart([]);
    toast.success("System reset successfully! All data cleared.");
    window.location.href = "/login";
  };

  return (
    <BakeryContext.Provider
      value={{
        orders,
        inventory,
        menu,
        kitchenRequests,
        user,
        login,
        logout,
        updateKitchenRequestStatus,
        placeOrder,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        updateOrderStatus,
        completeProductionBatch,
        addKitchenRequest,
        cart,
        addToCart,
        updateCartItemQty,
        removeFromCart,
        clearCart,
        productionLog,
        purchases,
        addPurchaseEntry,
        updateInventoryStock,
        addInventoryItem,
        feedbacks,
        addFeedback,
        updateUser,
        resetSystem
      }}
    >
      {children}
    </BakeryContext.Provider>
  );
};

export const useBakery = () => {
  const context = useContext(BakeryContext);
  if (!context) {
    throw new Error("useBakery must be used within a BakeryProvider");
  }
  return context;
};
