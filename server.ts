import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { Product, CartItem, Order } from "./src/types.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory "database"
  const products: Product[] = [
    { id: "1", name: "Heritage Tomatoes", price: 3.49, description: "Vine-ripened organic heritage tomatoes with deep flavor.", category: "Vegetables", unit: "kg", image: "https://images.unsplash.com/photo-1592924357228-91a4eaadcfea?q=80&w=800&auto=format&fit=crop" },
    { id: "2", name: "Premium Honeycrisp", price: 4.50, description: "Sweet, crunchy, and refreshing premium apples.", category: "Fruits", unit: "kg", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6bccb?q=80&w=800&auto=format&fit=crop" },
    { id: "3", name: "Farm Whole Milk", price: 3.20, description: "Organic farm-fresh milk from grass-fed cows.", category: "Dairy", unit: "1L", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=800&auto=format&fit=crop" },
    { id: "4", name: "Artisan Sourdough", price: 5.50, description: "Handcrafted sourdough with a perfect crust.", category: "Bakery", unit: "loaf", image: "https://images.unsplash.com/photo-1585478259715-876a6a81bce8?q=80&w=800&auto=format&fit=crop" },
    { id: "5", name: "Organic Chicken", price: 12.99, description: "Free-range, grain-fed organic chicken breast.", category: "Meat", unit: "kg", image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=800&auto=format&fit=crop" },
    { id: "6", name: "Hass Avocados", price: 1.80, description: "Buttery and perfectly ripe Hass avocados.", category: "Vegetables", unit: "unit", image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=800&auto=format&fit=crop" },
    { id: "7", name: "Organic Bananas", price: 1.20, description: "BPA-free organic fair-trade bananas.", category: "Fruits", unit: "kg", image: "https://images.unsplash.com/photo-1603833665858-e81b1c7dc4af?q=80&w=800&auto=format&fit=crop" },
    { id: "8", name: "Greek Style Yogurt", price: 4.25, description: "Traditional thick and creamy Greek yogurt.", category: "Dairy", unit: "500g", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=800&auto=format&fit=crop" },
    { id: "9", name: "Fresh Broccoli", price: 2.15, description: "Crisp organic broccoli heads.", category: "Vegetables", unit: "unit", image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bef?q=80&w=800&auto=format&fit=crop" },
    { id: "10", name: "Wild Blueberries", price: 5.95, description: "Freshly harvested organic blueberries.", category: "Fruits", unit: "250g", image: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?q=80&w=800&auto=format&fit=crop" },
    { id: "11", name: "Free Range Eggs", price: 6.50, description: "One dozen large organic free-range eggs.", category: "Dairy", unit: "dozen", image: "https://images.unsplash.com/photo-1516746927161-518296a84126?q=80&w=800&auto=format&fit=crop" },
    { id: "12", name: "Cold Pressed Orange", price: 4.99, description: "100% pure cold-pressed orange juice.", category: "Beverages", unit: "1L", image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=800&auto=format&fit=crop" },
  ];

  let cart: CartItem[] = [];
  const orders: Order[] = [];

  // API Routes
  app.get("/api/products", (req, res) => {
    res.json(products);
  });

  app.get("/api/cart", (req, res) => {
    res.json(cart);
  });

  app.post("/api/cart/add", (req, res) => {
    const { productId, quantity } = req.body;
    const existingIndex = cart.findIndex(item => item.productId === productId);
    
    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ id: productId, productId, quantity });
    }
    res.json({ success: true, cart });
  });

  app.post("/api/cart/update", (req, res) => {
    const { productId, quantity } = req.body;
    if (quantity <= 0) {
      cart = cart.filter(item => item.productId !== productId);
    } else {
      const item = cart.find(item => item.productId === productId);
      if (item) item.quantity = quantity;
    }
    res.json({ success: true, cart });
  });

  app.post("/api/cart/clear", (req, res) => {
    cart = [];
    res.json({ success: true, cart });
  });

  app.post("/api/orders", (req, res) => {
    const { customer } = req.body;
    const orderItems = cart.map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return null;
      return { ...item, product };
    }).filter((item): item is (CartItem & { product: Product }) => item !== null);

    const total = orderItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    const newOrder: Order = {
      id: Math.random().toString(36).substring(2, 11).toUpperCase(),
      items: orderItems,
      total,
      status: "pending",
      customer,
      createdAt: new Date().toISOString()
    };

    orders.push(newOrder);
    cart = []; // Clear cart after order
    res.json({ success: true, order: newOrder });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
