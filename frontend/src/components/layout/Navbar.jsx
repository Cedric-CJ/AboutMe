import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../../components/ui/sheet";

const nav = [
  { to: "/", label: "Start" },
  { to: "/projects", label: "Projekte" },
  { to: "/skills", label: "Skills" },
  { to: "/experience", label: "Werdegang" },
  { to: "/contact", label: "Kontakt" },
];

export default function Navbar() {
  const { pathname } = useLocation();

  const LinkItem = ({ to, label, onClick }) => (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive || pathname === to
            ? "text-cyan-300"
            : "text-zinc-300 hover:text-white"
        }`
      }
    >
      {label}
    </NavLink>
  );

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-white/10 bg-zinc-900/50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400/30 to-teal-300/20 border border-white/10 shadow-[0_0_30px_-10px_rgba(45,212,191,.7)]" />
          <NavLink to="/" className="text-sm sm:text-base font-semibold tracking-wide text-white">
            BlackIce Portfolio
          </NavLink>
        </div>

        <nav className="hidden md:flex items-center gap-2">
          {nav.map((n) => (
            <LinkItem key={n.to} {...n} />
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <a href="#" aria-label="GitHub" className="text-zinc-300 hover:text-white">
              <Github size={18} />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href="#" aria-label="LinkedIn" className="text-zinc-300 hover:text-white">
              <Linkedin size={18} />
            </a>
          </Button>
          <Button asChild className="bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-200 border border-cyan-300/30">
            <NavLink to="/contact" className="flex items-center gap-2">
              <Mail size={16} />
              Schreiben
            </NavLink>
          </Button>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-zinc-300 hover:text-white">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-zinc-900/95 border-white/10">
              <SheetHeader>
                <SheetTitle className="text-left text-white">Navigation</SheetTitle>
              </SheetHeader>
              <div className="mt-4 flex flex-col gap-2">
                {nav.map((n) => (
                  <LinkItem key={n.to} {...n} />
                ))}
                <div className="pt-4 flex gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <a href="#" aria-label="GitHub" className="text-zinc-300 hover:text-white">
                      <Github size={18} />
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <a href="#" aria-label="LinkedIn" className="text-zinc-300 hover:text-white">
                      <Linkedin size={18} />
                    </a>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}