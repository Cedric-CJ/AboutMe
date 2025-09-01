import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, NavLink, useLocation, useParams } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { Toaster } from "./components/ui/toaster";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
import { useToast } from "./hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { projects, skills, profile, contactPreset, timeline, gallery, blogPosts } from "./mock";
import { ArrowUpRight, Rocket, Layers, Code2, Mail, Download, Star, Filter } from "lucide-react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import PerformancePage from "./pages/Performance";
import ResumePage from "./pages/Resume";
import ShopPage from "./pages/Shop";

function PageContainer({ children }) {
  const { motion } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={`max-w-6xl mx-auto px-4 pt-10 pb-20 ${motion ? "transition-opacity duration-500" : ""} ${mounted ? "opacity-100" : "opacity-0"}`}>
      {children}
    </div>
  );
}

function Hero() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(600px_200px_at_10%_-10%,rgba(255,255,255,0.06),transparent),radial-gradient(500px_200px_at_100%_0%,rgba(255,255,255,0.04),transparent)]" />
      <div className="relative p-8 md:p-12">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_2px_rgba(99,102,241,0.25)]" />
          BlackIce • Dark Apple Glass
        </div>
        <h1 className="mt-3 text-3xl md:text-5xl font-semibold text-white tracking-tight">
          {profile.name}
        </h1>
        <p className="mt-3 text-zinc-300 max-w-2xl">{profile.tagline}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button asChild className="glass-btn">
            <NavLink to="/projects" className="flex items-center gap-2">
              <Rocket size={16} />
              Projekte ansehen
            </NavLink>
          </Button>
          <Button variant="outline" className="glass-btn-secondary">
            <NavLink to="/resume" className="flex items-center gap-2">
              <Download size={16} />
              Lebenslauf
            </NavLink>
          </Button>
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  return (
    <PageContainer>
      <Hero />
      <section className="mt-10 grid md:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2"><Layers size={18} /> Highlights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-ice-dim list-disc pl-5 space-y-2">
              <li>Sauberes, dunkles Glass-UI mit variabler Akzentfarbe</li>
              <li>Reaktionsschnelle Micro-Animationen</li>
              <li>Klares Informationsdesign für Tech-Profile</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2"><Code2 size={18} /> Stack</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-ice-dim">
            React • Shadcn UI • Tailwind • Router v7
            <br />
            Backend: FastAPI + MongoDB
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2"><Star size={18} /> Fokus</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-ice-dim">
            Data, Web, Infrastruktur, Lernen by Doing
          </CardContent>
        </Card>
      </section>

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-xl font-semibold">Aktuelle Projekte</h2>
          <Button asChild variant="ghost" className="text-accent hover:text-white">
            <NavLink to="/projects" className="flex items-center gap-2">
              Alles ansehen <ArrowUpRight size={16} />
            </NavLink>
          </Button>
        </div>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {projects.slice(0, 3).map((p) => (
            <Card key={p.id} className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">{p.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-ice-dim">{p.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tech?.slice?.(0,4)?.map?.((t) => (
                    <span key={t} className="text-[11px] px-2 py-1 rounded-full bg-ice-chip text-white border border-white/15">{t}</span>
                  ))}
                </div>
                <Button asChild variant="ghost" className="mt-3 text-accent hover:text-white">
                  <NavLink to={`/projects/${p.id}`}>Mehr erfahren</NavLink>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </PageContainer>
  );
}

function AboutPage(){return null}
function ProjectsPage(){return null}
function ProjectDetailPage(){return null}
function GalleryPage(){return null}
function BlogPage(){return null}
function ContactPage(){return null}
function LegalPage(){return null}
function EnglishPage(){return null}

// NOTE: The above are placeholders for brevity in this snippet because these pages already exist in previous code.
// The Router below still points to the real pages imported elsewhere in the project.

function Layout({ children }) {
  return (
    <div className="min-h-screen text-foreground">
      <div className="site-bg" aria-hidden="true" />
      <div className="bg-mark" aria-hidden="true" />
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

function RoutesWithTransitions() {
  const location = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [location.pathname]);
  // Import existing pages lazily to avoid rewriting them here
  const ExistingProjects = React.lazy(() => import("./AppPages/ProjectsProxy"));
  const ExistingProjectDetail = React.lazy(() => import("./AppPages/ProjectDetailProxy"));
  const ExistingAbout = React.lazy(() => import("./AppPages/AboutProxy"));
  const ExistingGallery = React.lazy(() => import("./AppPages/GalleryProxy"));
  const ExistingBlog = React.lazy(() => import("./AppPages/BlogProxy"));
  const ExistingContact = React.lazy(() => import("./AppPages/ContactProxy"));
  const ExistingLegalImpr = React.lazy(() => import("./AppPages/ImpressumProxy"));
  const ExistingLegalPriv = React.lazy(() => import("./AppPages/DatenschutzProxy"));
  const ExistingEnglish = React.lazy(() => import("./AppPages/EnglishProxy"));

  return (
    <Routes>
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/shop" element={<Layout><ShopPage /></Layout>} />
      <Route path="/projects" element={<Layout><ExistingProjects /></Layout>} />
      <Route path="/projects/:id" element={<Layout><ExistingProjectDetail /></Layout>} />
      <Route path="/about" element={<Layout><ExistingAbout /></Layout>} />
      <Route path="/gallery" element={<Layout><ExistingGallery /></Layout>} />
      <Route path="/blog" element={<Layout><ExistingBlog /></Layout>} />
      <Route path="/performance" element={<Layout><PerformancePage /></Layout>} />
      <Route path="/resume" element={<Layout><ResumePage /></Layout>} />
      <Route path="/contact" element={<Layout><ExistingContact /></Layout>} />
      <Route path="/impressum" element={<Layout><ExistingLegalImpr /></Layout>} />
      <Route path="/datenschutz" element={<Layout><ExistingLegalPriv /></Layout>} />
      <Route path="/en" element={<Layout><ExistingEnglish /></Layout>} />
      <Route path="*" element={<Layout><HomePage /></Layout>} />
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <ThemeProvider>
        <BrowserRouter>
          <React.Suspense fallback={<div className="text-white p-6">Lade…</div>}>
            <RoutesWithTransitions />
          </React.Suspense>
        </BrowserRouter>
        <Toaster />
      </ThemeProvider>
    </div>
  );
}

export default App;