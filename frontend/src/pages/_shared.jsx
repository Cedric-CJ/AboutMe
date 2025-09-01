import React from "react";

export function PageSection({ title, children, className = "" }) {
  return (
    <section className={`mt-8 ${className}`}>
      {title && <h3 className="text-white text-lg font-semibold">{title}</h3>}
      {children}
    </section>
  );
}