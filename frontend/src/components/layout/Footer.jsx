import React from "react";
import { Button } from "../../components/ui/button";
import { useTheme } from "../../context/ThemeContext";

export default function Footer() {
  const { accent, setAccent } = useTheme();

  const AccentBtn = ({ value, label }) => (
    <Button
      size="sm"
      variant={accent === value ? "default" : "outline"}
      className={accent === value ? "glass-btn text-white" : "glass-btn-secondary"}
      onClick={() => setAccent(value)}
    >
      {label}
    </Button>
  );

  return (
    <footer className="border-t border-white/10 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-zinc-400">
        <div>
          <p className="text-white font-medium">BlackIce Portfolio</p>
          <p className="mt-2">Eis-/Türkis-Hintergrund mit gläsernen UI-Elementen.</p>
          <div className="mt-3 space-y-2">
            <p className="text-zinc-300">Akzentfarbe wählen:</p>
            <div className="flex gap-2">
              <AccentBtn value="red" label="Rot" />
              <AccentBtn value="green" label="Grün" />
              <AccentBtn value="blue" label="Blau" />
            </div>
          </div>
        </div>
        <div>
          <p className="text-white font-medium">Seiten</p>
          <ul className="mt-2 space-y-1">
            <li><a href="/shop" className="hover:text-accent">Shop</a></li>
            <li><a href="/about" className="hover:text-accent">Über mich</a></li>
            <li><a href="/gallery" className="hover:text-accent">Galerie</a></li>
            <li><a href="/blog" className="hover:text-accent">Blog</a></li>
            <li><a href="/contact" className="hover:text-accent">Kontakt</a></li>
          </ul>
        </div>
        <div>
          <p className="text-white font-medium">Rechtliches</p>
          <ul className="mt-2 space-y-1">
            <li><a href="/impressum" className="hover:text-accent">Impressum</a></li>
            <li><a href="/datenschutz" className="hover:text-accent">Datenschutz</a></li>
          </ul>
        </div>
      </div>
      <div className="text-center px-4 pb-10 text-xs text-zinc-500">© 2025 – Mock-Frontend, Backend bereit. Zahlungen sind Demo bis ADYEN_* Keys hinterlegt sind.</div>
    </footer>
  );
}