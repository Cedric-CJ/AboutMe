import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { timeline, profile } from "../mock";
import { Download } from "lucide-react";

export default function ResumePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-10 pb-20">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-white text-2xl font-semibold">Lebenslauf</h2>
        <Button asChild className="bg-accent/20 hover:bg-accent/30 text-white border border-accent/30">
          <a href={profile.cvUrl || '#'} onClick={(e) => { if(!profile.cvUrl) e.preventDefault(); }}>
            <Download size={16} className="mr-2" /> Download (Platzhalter)
          </a>
        </Button>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Ausbildung &amp; Werdegang</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-zinc-300">
            {timeline.map((t) => (
              <div key={t.year} className="p-3 rounded-md bg-white/5 border border-white/10">
                <div className="text-white font-medium">{t.year}: {t.title}</div>
                <div className="text-xs text-zinc-400">{t.org}</div>
                <div className="mt-1">{t.detail}</div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Zertifikate (Platzhalter)</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-zinc-300">
            {["AWS Cloud Basics", "SQL Fundamentals", "Web Accessibility"].map((c) => (
              <div key={c} className="p-3 rounded-md bg-white/5 border border-white/10">{c}</div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}