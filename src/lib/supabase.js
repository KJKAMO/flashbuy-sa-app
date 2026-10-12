import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import productsSeed from '../data/products';
import { supabase } from '../lib/supabase';

const StoreContext = createContext(null);

const CART_KEY = 'flashbuy-sa-cart';
const USER_KEY = 'flashbuy-sa-user';
const PRODUCTS_KEY = 'flashbuy-sa-products';

const formatOrderNumber = () => `FB-${Date.now().toString().slice(-6)}`;

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const stored = localStorage.getItem(PRODUCTS_KEY);
    return stored ? JSON.parse(stored) : productsSeed;
  });

  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const [orders, setOrders] = useState(() => {
    const stored = localStorage.getItem('flashbuy-sa-orders');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('flashbuy-sa-orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    const syncSupabaseSession = async () => {
      if (!supabase) return;

      const { data: { session } } = await supabase.auth.getSession();
      const profile = session?.user ?? null;

      if (profile) {
        setUser({
          id: profile.id,
          email: profile.email,
          name: profile.user_metadata?.full_name || 'Customer',
          role: profile.user_metadata?.role || 'customer'
        });
      }
    };

    syncSupabaseSession();
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))).sort(),
    [products]
  );

  const featuredProducts = useMemo(
    () => products.filter((product) => product.featured),
    [products]
  );

  const addToCart = (product, quantity = 1) => {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock || 999) }
            : item
        );
      }

      return [...currentCart, { ...product, quantity }];
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart((currentCart) =>
      currentCart
        .map((item) => {
          if (item.id !== productId) return item;
          const nextQuantity = Math.max(0, item.quantity + delta);
          return nextQuantity === 0 ? null : { ...item, quantity: nextQuantity };
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (productId) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? (subtotal >= 2500 ? 0 : 149) : 0;
  const total = subtotal + deliveryFee;

  const signUp = async (name, email, password) => {
    if (!supabase) {
      const customer = { id: crypto.randomUUID(), email, name, role: 'customer' };
      setUser(customer);
      return { success: true, user: customer };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, role: 'customer' } }
    });

    if (error) return { success: false, error: error.message };

    if (data.user) {
      setUser({ id: data.user.id, email: data.user.email, name, role: 'customer' });
    }

    return { success: true, user: data.user };
  };

  const signIn = async (email, password) => {
    if (!supabase) {
      const demoUser = { id: 'local-demo-user', email, name: 'FlashBuy Customer', role: 'customer' };
      setUser(demoUser);
      return { success: true, user: demoUser };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return { success: false, error: error.message };

    if (data.user) {
      setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.full_name || 'Customer',
        role: data.user.user_metadata?.role || 'customer'
      });
    }

    return { success: true, user: data.user };
  };

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  const addProduct = (newProduct) => {
    setProducts((currentProducts) => [{
      id: String(Date.now()),
      ...newProduct,
      featured: Boolean(newProduct.featured),
      rating: Number(newProduct.rating || 4.5)
    }, ...currentProducts]);
  };

  const updateProduct = (productId, updatedData) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === productId ? { ...product, ...updatedData } : product
      )
    );
  };

  const removeProduct = (productId) => {
    setProducts((currentProducts) => currentProducts.filter((product) => product.id !== productId));
    setCart((currentCart) => currentCart.filter((item) => item.id !== productId));
  };

  const placeOrder = (customerData) => {
    if (!cart.length) return { success: false, error: 'Your cart is empty.' };

    const orderId = formatOrderNumber();
    const order = {
      id: orderId,
      customer: {
        ...customerData,
        email: customerData.email || user?.email || 'guest@flashbuy.co.za'
      },
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image
      })),
      total,
      subtotal,
      deliveryFee,
      createdAt: new Date().toISOString(),
      paymentStatus: 'pending_payment',
      deliveryStatus: 'awaiting_dispatch'
    };

    setOrders((currentOrders) => [order, ...currentOrders]);
    setCart([]);
    return { success: true, order };
  };

  const value = {
    products,
    cart,
    subtotal,
    deliveryFee,
    total,
    categories,
    featuredProducts,
    user,
    orders,
    addToCart,
    updateQuantity,
    removeFromCart,
    signIn,
    signUp,
    signOut,
    addProduct,
    updateProduct,
    removeProduct,
    placeOrder,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used inside StoreProvider');
  return context;
}
