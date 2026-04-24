"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        setError(`Erreur : ${authError.message}`);
        setLoading(false);
        return;
      }

      setSent(true);
    } catch (err) {
      console.error("Login error:", err);
      setError("Erreur de connexion au serveur. Réessayez plus tard.");
    }

    setLoading(false);
  }

  if (sent) {
    return (
      <div className="text-center py-4">
        <div className="text-4xl mb-4">📧</div>
        <p className="text-gray-900 font-medium mb-2">
          Lien envoyé !
        </p>
        <p className="text-gray-600 text-sm">
          Vérifiez votre boîte mail <strong>{email}</strong> et cliquez sur le
          lien de connexion. Pensez à vérifier vos spams.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Adresse email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vous@exemple.fr"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Envoi en cours…" : "Recevoir le lien de connexion"}
      </button>
    </form>
  );
}
