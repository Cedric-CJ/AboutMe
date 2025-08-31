import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-zinc-400">
        <div>
          <p className="text-white font-medium">BlackIce Portfolio</p>
          <p className="mt-2">Dunkles Apple-Glass Design mit leichten Arctic-Cyan Akzenten.</p>
        </div>
        <div>
          <p className="text-white font-medium">Links</p>
          <ul className="mt-2 space-y-1">
            <li><a href="/projects" className="hover:text-cyan-300">Projekte</a></li>
            <li><a href="/skills" className="hover:text-cyan-300">Skills</a></li>
            <li><a href="/experience" className="hover:text-cyan-300">Werdegang</a></li>
          </ul>
        </div>
        <div>
          <p className="text-white font-medium">Rechtliches</p>
          <ul className="mt-2 space-y-1">
            <li>Impressum (Platzhalter)</li>
            <li>Datenschutz (Platzhalter)</li>
          </ul>
        </div>
      </div>
      <div className="text-center px-4 pb-10 text-xs text-zinc-500">© {new Date().getFullYear()} – Mock-Frontend, Backend folgt.</div>
    </footer>
  );
}