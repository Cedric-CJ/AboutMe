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
import PaymentResultPage from "./pages/PaymentResult";

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

function ProjectsPage() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    return projects.filter(p =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.tech.some(t => t.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query]);

  return (
    <PageContainer>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-white text-2xl font-semibold">Projekte</h2>
        <div className="flex items-center gap-2">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filtern nach Titel/Tech" className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500" />
          <Button variant="outline" className="glass-btn-secondary"><Filter size={16} /></Button>
        </div>
      </div>
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <Card key={p.id} className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">{p.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-ice-dim">{p.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.tech.map((t) => (
                  <span key={t} className="text-[11px] px-2 py-1 rounded-full bg-ice-chip text-white border border-white/15">{t}</span>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Button asChild variant="ghost" className="text-accent hover:text-white">
                  <NavLink to={`/projects/${p.id}`}>Details</NavLink>
                </Button>
                {p.links.live && (
                  <Button asChild variant="ghost" className="text-accent hover:text-white">
                    <a href={p.links.live} target="_blank" rel="noreferrer">Live</a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}

function ProjectDetailPage() {
  const { id } = useParams();
  const p = projects.find((x) => x.id === id);
  if (!p) {
    return (
      <PageContainer>
        <h2 className="text-white text-2xl">Projekt nicht gefunden</h2>
      </PageContainer>
    );
  }
  return (
    <PageContainer>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-white text-2xl font-semibold">{p.title}</h2>
        <div className="flex gap-2">
          {p.links.repo && (
            <Button asChild variant="outline" className="glass-btn-secondary"><a href={p.links.repo}>GitHub</a></Button>
          )}
          {p.links.live && (
            <Button asChild className="glass-btn"><a href={p.links.live}>Live</a></Button>
          )}
        </div>
      </div>
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        <Card className="glass-card md:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Überblick</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-ice-dim space-y-3">
            <p>{p.overview}</p>
            <p className="text-zinc-400">Status: {p.status}</p>
            <div>
              <p className="text-white font-medium">Highlights</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {p.highlights.map((h, i) => (<li key={i}>{h}</li>))}
              </ul>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Tech-Stack</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {p.tech.map((t) => (
              <span key={t} className="text-[11px] px-2 py-1 rounded-full bg-ice-chip text-white border border-white/15">{t}</span>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        <Card className="glass-card md:col-span-3">
          <CardHeader>
            <CardTitle className="text-white">Screenshots & Galerie (Platzhalter)</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="h-28 rounded-lg bg-gradient-to-br from-accent/20 to-white/5 border border-white/10" />
            ))}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

function AboutPage() {
  return (
    <PageContainer>
      <h2 className="text-white text-2xl font-semibold">Hi, ich bin Cedric</h2>
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        <Card className="glass-card md:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Über mich</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-ice-dim space-y-3">
            <p>Student der Wirtschaftsinformatik an der HTW Berlin mit Interesse an Webentwicklung, Daten und Infrastruktur.</p>
            <p>Ich lerne am liebsten praxisnah – durch eigene Projekte und reale Einsätze.</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Mein Bild (Platzhalter)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40 rounded-xl bg-gradient-to-br from-accent/30 to-white/10 border border-white/10" />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Meine Fähigkeiten</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-3">
            {skills.flatMap((s) => s.items).map((it) => (
              <div key={it} className="px-4 py-2 rounded-md bg-white/5 border border-white/10 text-zinc-200">{it}</div>
            ))}
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Mein Lebenslauf</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-ice-dim">
            {timeline.map((t) => (
              <div key={t.year} className="p-3 rounded-md bg-white/5 border border-white/10">
                <div className="text-white font-medium">{t.year}: {t.title}</div>
                <div className="text-xs text-zinc-400">{t.org}</div>
                <div className="mt-1">{t.detail}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

function GalleryPage() {
  return (
    <PageContainer>
      <h2 className="text-white text-2xl font-semibold">Galerie</h2>
      <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {gallery.map((g) => (
          <div key={g.id} className="h-40 rounded-xl bg-gradient-to-br from-accent/25 to-white/10 border border-white/10 flex items-end p-3 text-sm text-white">
            {g.title}
          </div>
        ))}
      </div>
    </PageContainer>
  );
}

function BlogPage() {
  return (
    <PageContainer>
      <h2 className="text-white text-2xl font-semibold">Blog</h2>
      <div className="mt-6 grid sm:grid-cols-2 gap-6">
        {blogPosts.map((b) => (
          <Card key={b.id} className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">{b.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-ice-dim">
              <div className="text-[11px] inline-flex px-2 py-1 rounded-full bg-ice-chip text-white border border-white/15">{b.tag}</div>
              <p className="mt-2">{b.excerpt}</p>
              <Button variant="ghost" className="mt-3 text-accent hover:text-white">Weiterlesen (Platzhalter)</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}

function ContactPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({ topic: contactPreset.topics[0].value, name: "", email: "", message: "" });

  const onSubmit = (e) => {
    e.preventDefault();
    const prev = JSON.parse(localStorage.getItem("contact_messages") || "[]");
    const data = { ...form, id: Date.now() };
    localStorage.setItem("contact_messages", JSON.stringify([data, ...prev]));
    toast({ title: "Nachricht gespeichert (Mock)", description: "Deine Nachricht wurde lokal gespeichert. Backend folgt.", });
    setForm({ topic: contactPreset.topics[0].value, name: "", email: "", message: "" });
  };

  return (
    <PageContainer>
      <h2 className="text-white text-2xl font-semibold">Kontakt</h2>
      <form onSubmit={onSubmit} className="mt-6 grid md:grid-cols-2 gap-6">
        <Card className="glass-card md:col-span-1">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2"><Mail size={18} /> Schreib mir</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs text-zinc-400">Thema</label>
              <Select value={form.topic} onValueChange={(v) => setForm((f) => ({ ...f, topic: v }))}>
                <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Thema wählen" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                  {contactPreset.topics.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-zinc-400">Name</label>
              <Input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="mt-1 bg-white/5 border-white/10 text-white" />
            </div>
            <div>
              <label className="text-xs text-zinc-400">E-Mail</label>
              <Input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="mt-1 bg-white/5 border-white/10 text-white" />
            </div>
            <div>
              <label className="text-xs text-zinc-400">Nachricht</label>
              <Textarea required value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className="mt-1 bg-white/5 border-white/10 text-white min-h-[120px]" />
            </div>
            <Button type="submit" className="w-full glass-btn">Senden (Mock)</Button>
          </CardContent>
        </Card>
        <Card className="glass-card md:col-span-1">
          <CardHeader>
            <CardTitle className="text-white">Kontaktinfo</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-ice-dim space-y-2">
            <div><span className="text-zinc-400">E-Mail:</span> {profile.email}</div>
            <div><span className="text-zinc-400">Standort:</span> {profile.location}</div>
            <div className="pt-2">
              <Button asChild variant="ghost" className="text-accent hover:text-white">
                <a href="#">GitHub</a>
              </Button>
              <Button asChild variant="ghost" className="text-accent hover:text-white">
                <a href="#">LinkedIn</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </PageContainer>
  );
}

function LegalPage({ type }) {
  return (
    <PageContainer>
      <h2 className="text-white text-2xl font-semibold">{type === "impressum" ? "Impressum" : "Datenschutz"}</h2>
      <div className="mt-6 space-y-3 text-sm text-ice-dim">
        <p>Platzhalter-Text. Inhalte folgen.</p>
        <p>Kontakt siehe Kontaktseite. Dies ist eine Mock-Seite ohne Rechtsverbindlichkeit.</p>
      </div>
    </PageContainer>
  );
}

function EnglishPage() {
  return (
    <PageContainer>
      <h2 className="text-white text-2xl font-semibold">English</h2>
      <p className="mt-4 text-ice-dim">An English version of this portfolio will be available soon. Meanwhile, feel free to explore the German pages.</p>
    </PageContainer>
  );
}

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

  return (
    <Routes>
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/shop" element={<Layout><ShopPage /></Layout>} />
      <Route path="/projects" element={<Layout><ProjectsPage /></Layout>} />
      <Route path="/projects/:id" element={<Layout><ProjectDetailPage /></Layout>} />
      <Route path="/about" element={<Layout><AboutPage /></Layout>} />
      <Route path="/gallery" element={<Layout><GalleryPage /></Layout>} />
      <Route path="/blog" element={<Layout><BlogPage /></Layout>} />
      <Route path="/performance" element={<Layout><PerformancePage /></Layout>} />
      <Route path="/resume" element={<Layout><ResumePage /></Layout>} />
      <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
      <Route path="/payment/result" element={<Layout><PaymentResultPage /></Layout>} />
      <Route path="/impressum" element={<Layout><LegalPage type="impressum" /></Layout>} />
      <Route path="/datenschutz" element={<Layout><LegalPage type="datenschutz" /></Layout>} />
      <Route path="/en" element={<Layout><EnglishPage /></Layout>} />
      <Route path="*" element={<Layout><HomePage /></Layout>} />
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <ThemeProvider>
        <BrowserRouter>
          <RoutesWithTransitions />
        </BrowserRouter>
        <Toaster />
      </ThemeProvider>
    </div>
  );
}

export default App;