"use client";

import { useState } from "react";
import { IconLock } from "@/components/Icons";

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
      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-jc-primary text-white font-medium rounded-jc hover:bg-jc-primary-hover transition-colors text-base disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Redirection vers le paiement…
        </span>
      ) : (
        <>
          <IconLock /> Payer 4,90 € et télécharger
        </>
      )}
    </button>
  );
}
