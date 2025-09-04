import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useLocation, NavLink } from "react-router-dom";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function PaymentResultPage() {
  const q = useQuery();
  const resultCode = q.get("resultCode");
  const payload = q.get("payload") || q.get("redirectResult");

  return (
    <div className="max-w-3xl mx-auto px-4 pt-10 pb-20">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white">Zahlungsergebnis</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-ice-dim space-y-3">
          <div className="text-white">Status: {resultCode || "Unbekannt"}</div>
          {payload && (
            <div className="break-all">
              <span className="text-zinc-400">Payload/RedirectResult:</span> {payload}
            </div>
          )}
          <p className="text-zinc-400">Du kannst zu deinem Warenkorb zurückkehren.</p>
          <Button asChild className="glass-btn">
            <NavLink to="/shop">Zurück zum Shop</NavLink>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
