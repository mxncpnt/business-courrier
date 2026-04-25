"use client";

import { useState } from "react";

interface CheckoutButtonProps {
  letterId: string;
}

export default function CheckoutButton({ letterId }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ letterId }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erreur lors de la création du paiement. Réessayez.");
        setLoading(false);
      }
    } catch {
      alert("Erreur réseau. Réessayez.");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="px-8 py-3 bg-jc-primary text-white font-medium rounded-jc hover:bg-jc-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Redirection vers le paiement…" : "Télécharger le PDF — 4,90 €"}
    </button>
  );
}
