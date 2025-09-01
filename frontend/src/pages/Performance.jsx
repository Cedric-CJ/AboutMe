import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { PageSection } from "./_shared";
import { performanceData } from "../mock";

export default function PerformancePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-10 pb-20">
      <h2 className="text-white text-2xl font-semibold">Performance</h2>

      <PageSection className="mt-6 grid md:grid-cols-3 gap-6">
        {performanceData.skillScores.map((s) => (
          <Card key={s.name} className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">{s.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-zinc-400 mb-2">{s.note}</div>
              <Progress value={s.score} className="h-2 bg-white/10" />
              <div className="mt-2 text-xs text-zinc-400">{s.score}%</div>
            </CardContent>
          </Card>
        ))}
      </PageSection>

      <PageSection title="Core Web Vitals (Demo)">
        <div className="grid md:grid-cols-3 gap-6 mt-4">
          {performanceData.vitals.map((v) => (
            <Card key={v.label} className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">{v.label}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-zinc-300">
                <div className="text-3xl font-semibold text-white">{v.value}<span className="text-zinc-400 text-base ml-1">{v.unit}</span></div>
                <div className="mt-2 text-xs text-zinc-400">Ziel: {v.target}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection title="Aktivität (Mock)">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {["Commits", "Blog-Posts", "Lernstunden", "Issues", "PRs", "Meetups"].map((k, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-zinc-300">
              <div className="text-white font-medium">{k}</div>
              <div className="mt-2 text-3xl">{Math.round(10 + Math.random()*40)}</div>
            </div>
          ))}
        </div>
      </PageSection>
    </div>
  );
}