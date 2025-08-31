import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, NavLink, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { Toaster } from "./components/ui/toaster";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
import { useToast } from "./hooks/use-toast";
import { projects, skills, experience, profile, contactPreset } from "./mock";
import { ArrowUpRight, Rocket, Layers, Code2, Mail, Download, Star, Filter } from "lucide-react";

// Simple page container with mount transition
function PageContainer({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={`max-w-6xl mx-auto px-4 pt-10 pb-20 transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}>
      {children}
    </div>
  );
}

function Hero() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[inset_0_0_0_1px_rgba(255,255,255,.03),0_20px_70px_-30px_rgba(34,211,238,.35)]">
      <div className="absolute inset-0 bg-[radial-gradient(600px_200px_at_10%_-10%,rgba(34,211,238,0.15),transparent),radial-gradient(500px_200px_at_100%_0%,rgba(20,184,166,0.12),transparent)]" />
      <div className="relative p-8 md:p-12">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_2px_rgba(103,232,249,0.6)]" />
          BlackIce • Dark Apple Glass
        </div>
        <h1 className="mt-3 text-3xl md:text-5xl font-semibold text-white tracking-tight">
          {profile.name}
        </h1>
        <p className="mt-3 text-zinc-300 max-w-2xl">{profile.tagline}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button asChild className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-100 border border-cyan-400/30">
            <NavLink to="/projects" className="flex items-center gap-2">
              <Rocket size={16} />
              Projekte ansehen
            </NavLink>
          </Button>
          <Button variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10">
            <NavLink to="#" onClick={(e) => { e.preventDefault(); }} className="flex items-center gap-2">
              <Download size={16} />
              Lebenslauf (bald)
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
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2"><Layers size={18} /> Highlights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-zinc-300 list-disc pl-5 space-y-2">
              <li>Sauberes, dunkles Glass-UI mit Arctic-Cyan Akzenten</li>
              <li>Reaktionsschnelle Micro-Animationen</li>
              <li>Klares Informationsdesign für Tech-Profile</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2"><Code2 size={18} /> Stack</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-zinc-300">
            React • Shadcn UI • Tailwind • Router v7
            <br />
            Backend folgt: FastAPI + MongoDB
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2"><Star size={18} /> Fokus</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-zinc-300">
            Daten, KI-Grundlagen, Web-Architektur, ETL
          </CardContent>
        </Card>
      </section>

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-xl font-semibold">Aktuelle Projekte</h2>
          <Button asChild variant="ghost" className="text-cyan-200 hover:text-white">
            <NavLink to="/projects" className="flex items-center gap-2">
              Alles ansehen <ArrowUpRight size={16} />
            </NavLink>
          </Button>
        </div>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {projects.slice(0, 3).map((p) => (
            <Card key={p.id} className="bg-white/5 border-white/10 hover:border-cyan-300/30 hover:shadow-[0_0_40px_-20px_rgba(103,232,249,.6)] transition-colors">
              <CardHeader>
                <CardTitle className="text-white">{p.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-300">{p.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="text-[11px] px-2 py-1 rounded-full bg-cyan-400/10 text-cyan-200 border border-cyan-300/20">{t}</span>
                  ))}
                </div>
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
      p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query]);

  return (
    <PageContainer>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-white text-2xl font-semibold">Projekte</h2>
        <div className="flex items-center gap-2">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filtern nach Titel/Tag" className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500" />
          <Button variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10"><Filter size={16} /></Button>
        </div>
      </div>
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <Card key={p.id} className="bg-white/5 border-white/10 hover:border-cyan-300/30 transition-colors">
            <CardHeader>
              <CardTitle className="text-white">{p.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-300">{p.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span key={t} className="text-[11px] px-2 py-1 rounded-full bg-cyan-400/10 text-cyan-200 border border-cyan-300/20">{t}</span>
                ))}
              </div>
              <Button asChild variant="ghost" className="mt-4 text-cyan-200 hover:text-white">
                <a href={p.link}>Details</a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}

function SkillsPage() {
  return (
    <PageContainer>
      <h2 className="text-white text-2xl font-semibold">Skills</h2>
      <Tabs defaultValue={skills[0]?.category} className="mt-6">
        <TabsList className="bg-white/5 border border-white/10">
          {skills.map((s) => (
            <TabsTrigger key={s.category} value={s.category} className="text-white data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-100">
              {s.category}
            </TabsTrigger>
          ))}
        </TabsList>
        {skills.map((s) => (
          <TabsContent key={s.category} value={s.category} className="mt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {s.items.map((it) => (
                <div key={it} className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-zinc-200">{it}</div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </PageContainer>
  );
}

function ExperiencePage() {
  return (
    <PageContainer>
      <h2 className="text-white text-2xl font-semibold">Werdegang</h2>
      <div className="mt-6 space-y-6">
        {experience.map((e) => (
          <div key={e.id} className="relative p-5 rounded-xl bg-white/5 border border-white/10">
            <div className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-cyan-300/60 to-teal-300/40 rounded" />
            <div className="pl-3">
              <div className="text-white font-medium">{e.role} • {e.company}</div>
              <div className="text-xs text-zinc-400">{e.start} – {e.end}</div>
              <ul className="mt-3 list-disc pl-5 text-sm text-zinc-300 space-y-1">
                {e.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          </div>
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
        <Card className="bg-white/5 border-white/10 md:col-span-1">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2"><Mail size={18} /> Schreib mir</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs text-zinc-400">Thema</label>
              <select
                className="mt-1 w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white"
                value={form.topic}
                onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
              >
                {contactPreset.topics.map((t) => (
                  <option key={t.value} value={t.value} className="bg-zinc-900">{t.label}</option>
                ))}
              </select>
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
            <Button type="submit" className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-100 border border-cyan-400/30">Senden (Mock)</Button>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 md:col-span-1">
          <CardHeader>
            <CardTitle className="text-white">Kontaktinfo</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-zinc-300 space-y-2">
            <div><span className="text-zinc-400">E-Mail:</span> {profile.email}</div>
            <div><span className="text-zinc-400">Standort:</span> {profile.location}</div>
            <div className="pt-2">
              <Button asChild variant="ghost" className="text-cyan-200 hover:text-white">
                <a href="#">GitHub</a>
              </Button>
              <Button asChild variant="ghost" className="text-cyan-200 hover:text-white">
                <a href="#">LinkedIn</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </PageContainer>
  );
}

function Layout({ children }) {
  return (
    <div className="min-h-screen text-foreground">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

function RoutesWithTransitions() {
  const location = useLocation();
  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/projects" element={<Layout><ProjectsPage /></Layout>} />
      <Route path="/skills" element={<Layout><SkillsPage /></Layout>} />
      <Route path="/experience" element={<Layout><ExperiencePage /></Layout>} />
      <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
      <Route path="*" element={<Layout><HomePage /></Layout>} />
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <RoutesWithTransitions />
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;