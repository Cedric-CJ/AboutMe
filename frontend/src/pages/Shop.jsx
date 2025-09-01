import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useToast } from "../hooks/use-toast";
import { Badge } from "../components/ui/badge";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const demoProducts = [
  { id: "ice-pack-1", title: "Frost Icon Set", description: "20 minimalistische Eis-/Türkis Icons (SVG)", price_cents: 900, currency: "EUR", tags: ["Design", "SVG"], active: true },
  { id: "ice-pack-2", title: "Glass UI Kit", description: "Komponenten für Glassmorphism (Figma + CSS)", price_cents: 1900, currency: "EUR", tags: ["UI", "Kit"], active: true },
  { id: "ice-pack-3", title: "Noise & Ice Textures", description: "12 Eis-/Rauschtexturen (AVIF/WebP)", price_cents: 1200, currency: "EUR", tags: ["Texture", "Assets"], active: true },
];

function centsToEUR(c) {
  return (c / 100).toFixed(2).replace(".", ",");
}

export default function ShopPage() {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState(demoProducts);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("ice_cart") || "[]"));

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await axios.get(`${API}/products`);
        if (!cancelled && Array.isArray(res.data) && res.data.length) {
          setProducts(res.data);
        }
      } catch (e) {
        // Fallback: demoProducts
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    localStorage.setItem("ice_cart", JSON.stringify(cart));
  }, [cart]);

  const filtered = useMemo(() => {
    return products.filter(p =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      (p.tags || []).some(t => t.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query, products]);

  const addToCart = (p) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === p.id);
      if (existing) {
        return prev.map((i) => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [{ id: p.id, title: p.title, price_cents: p.price_cents, currency: p.currency, qty: 1 }, ...prev];
    });
    toast({ title: "Zum Warenkorb hinzugefügt", description: `${p.title}` });
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  const totalCents = cart.reduce((s, i) => s + i.price_cents * i.qty, 0);

  const checkout = async (provider) => {
    try {
      const items = cart.map((i) => ({ product_id: i.id, qty: i.qty }));
      const res = await axios.post(`${API}/checkout/session`, { provider, items });
      if (res.data && res.data.order_id) {
        toast({ title: `Checkout: ${provider}`, description: res.data.message || "Session erstellt (Demo)." });
      } else {
        toast({ title: "Checkout fehlgeschlagen", description: "Unerwartete Antwort." });
      }
    } catch (e) {
      toast({ title: "Checkout nicht möglich", description: "Vermutlich fehlen ADYEN_* Keys. (Demo)" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pt-10 pb-20">
      <div className="ice-hero">
        <h2 className="text-white text-2xl font-semibold">Shop</h2>
        <p className="text-ice-dim mt-1">Gläserne UI-Bausteine und Assets im „Eis-/Türkis“-Look.</p>
        <div className="mt-4 flex gap-2 flex-wrap items-center">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Suchen nach Titel/Tag" className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 w-64" />
          <Badge className="bg-ice-chip border border-white/15 text-white">UI</Badge>
          <Badge className="bg-ice-chip border border-white/15 text-white">Assets</Badge>
          <Badge className="bg-ice-chip border border-white/15 text-white">Design</Badge>
        </div>
      </div>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <Card key={p.id} className="glass-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>{p.title}</span>
                <span className="text-ice">€ {centsToEUR(p.price_cents)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-ice-dim min-h-[40px]">{p.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(p.tags || []).map((t) => (
                  <span key={t} className="text-[11px] px-2 py-1 rounded-full bg-ice-chip text-white border border-white/15">{t}</span>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Button className="glass-btn" onClick={() => addToCart(p)}>In den Warenkorb</Button>
                <Button variant="outline" className="glass-btn-secondary" onClick={() => addToCart(p)}>Schnellkauf</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12">
        <h3 className="text-white text-lg font-semibold">Warenkorb</h3>
        <div className="mt-4 grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 glass-card">
            <CardContent className="pt-6">
              {cart.length === 0 ? (
                <div className="text-ice-dim">Noch keine Artikel im Warenkorb.</div>
              ) : (
                <div className="space-y-3">
                  {cart.map((i) => (
                    <div key={i.id} className="flex items-center justify-between text-sm text-white">
                      <div>
                        <div className="font-medium">{i.title}</div>
                        <div className="text-ice-dim">{i.qty} × € {centsToEUR(i.price_cents)}</div>
                      </div>
                      <Button variant="ghost" className="text-ice hover:text-white" onClick={() => removeFromCart(i.id)}>Entfernen</Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between text-white">
                <span>Zwischensumme</span>
                <span>€ {centsToEUR(totalCents)}</span>
              </div>
              <div className="mt-4 grid gap-2">
                <Button className="glass-btn" onClick={() => checkout("paypal")}>PayPal (Demo)</Button>
                <Button className="glass-btn" onClick={() => checkout("klarna")}>Klarna (Demo)</Button>
                <Button className="glass-btn" onClick={() => checkout("applepay")}>Apple Pay (Demo)</Button>
                <Button className="glass-btn" onClick={() => checkout("googlepay")}>Google Pay (Demo)</Button>
              </div>
              <p className="text-[12px] text-ice-dim mt-3">Zahlung ist Demo. Für Live-Zahlungen benötigen wir deine ADYEN_* Keys.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}