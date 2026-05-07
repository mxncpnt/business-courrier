import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { claimOrphanedRecords } from "@/lib/auth/claim-orphans";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    let supabaseResponse = NextResponse.redirect(`${origin}${next}`);

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.redirect(`${origin}${next}`);
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Rattacher les enregistrements orphelins (user_id NULL) créés avant
      // que l'user soit connecté, sur tous les enregistrements business
      // partageant son email. Idempotent : si rien d'orphelin, no-op.
      // Bug observé prod 2026-05-07 (facture JC-2026-0041) : sans ce claim,
      // l'user paie en non-connecté puis ne peut plus confirmer l'envoi
      // ni voir son courrier dans le dashboard une fois connecté.
      if (data.user?.email && data.user?.id) {
        try {
          await claimOrphanedRecords(data.user.id, data.user.email);
        } catch (claimErr) {
          // Non-bloquant : la connexion réussit même si le claim échoue.
          // L'admin pourra rattacher manuellement via SQL si besoin.
          console.error("auth/callback: claimOrphanedRecords failed", claimErr);
        }
      }
      return supabaseResponse;
    }
  }

  // If no code or error, redirect to login with error
  return NextResponse.redirect(`${origin}/connexion?error=auth`);
}
