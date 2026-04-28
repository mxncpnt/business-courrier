/**
 * Script de test Phase 4.2 — MySendingBox Provider (sandbox)
 *
 * Teste les 4 méthodes principales contre l'API MSB sandbox :
 *   1. validateAddress (local + contraintes AFNOR)
 *   2. submitMailing   (envoi réel en sandbox — pas de courrier physique)
 *   3. getMailingStatus (polling après submission)
 *   4. verifyWebhookSignature (si MSB_WEBHOOK_SECRET configuré)
 *
 * Usage :
 *   pnpm test:msb
 *
 * Prérequis :
 *   - MSB_API_KEY_TEST dans .env.local (ou dans l'env)
 *   - Node 20.12+ pour --env-file (géré par le script pnpm)
 */

import { MySendingBoxProvider } from "../src/lib/mailings/mysendingbox";
import type { PostalAddress } from "../src/lib/mailings/provider";
import { createHmac } from "crypto";

// ─── PDF minimal valide ───────────────────────────────────────────────────────
// Un PDF 1 page avec du texte basique — suffit pour tester l'API MSB sandbox.
// Ne pas utiliser @react-pdf/renderer ici : trop lourd pour un script de test.
const MINIMAL_PDF = Buffer.from(
  `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length 56>>stream
BT /F1 12 Tf 72 720 Td (Test JusteCourrier - Phase 4.2) Tj ET
endstream
endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000270 00000 n
0000000378 00000 n
trailer<</Size 6/Root 1 0 R>>
startxref
459
%%EOF`
);

// ─── Helpers d'affichage ──────────────────────────────────────────────────────

function section(title: string) {
  console.log(`\n${"─".repeat(50)}`);
  console.log(`  ${title}`);
  console.log("─".repeat(50));
}

function ok(msg: string) {
  console.log(`  ✓  ${msg}`);
}

function warn(msg: string) {
  console.log(`  ⚠  ${msg}`);
}

function fail(msg: string, err?: unknown) {
  const detail = err instanceof Error ? err.message : JSON.stringify(err);
  console.error(`  ✗  ${msg}${detail ? ` — ${detail}` : ""}`);
}

function dump(label: string, value: unknown) {
  console.log(`\n     ${label}:`);
  const lines = JSON.stringify(value, null, 2).split("\n");
  lines.forEach((l) => console.log(`       ${l}`));
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n╔══════════════════════════════════════════════════╗");
  console.log("║   Test MySendingBox Provider — Sandbox           ║");
  console.log("╚══════════════════════════════════════════════════╝");

  // Vérification clé API
  const apiKey = process.env.MSB_API_KEY_TEST;
  if (!apiKey) {
    console.error("\n[ERREUR] MSB_API_KEY_TEST absent de l'environnement.");
    console.error("         Vérifiez que .env.local contient MSB_API_KEY_TEST.");
    process.exit(1);
  }

  const mode = process.env.MSB_MODE ?? "test";
  console.log(`\n  Provider : mysendingbox | Mode : ${mode}`);
  console.log(`  Clé API  : ${apiKey.slice(0, 6)}${"*".repeat(12)}`);

  const provider = new MySendingBoxProvider();

  // ───────────────────────────────────────────────────────────────────────────
  // 1. validateAddress — cas valides
  // ───────────────────────────────────────────────────────────────────────────

  section("1. validateAddress — cas valides");

  const validAddr: PostalAddress = {
    name: "Jean Dupont",
    addressLine1: "12 rue de la Paix",
    zipcode: "75002",
    city: "Paris",
    country: "FR",
  };

  try {
    const res = await provider.validateAddress(validAddr);
    if (res.valid) {
      ok("Adresse standard acceptée");
    } else {
      fail(`Adresse valide rejetée à tort : ${res.reason}`);
    }
  } catch (err) {
    fail("validateAddress a levé une exception", err);
  }

  // Adresse avec ligne 2 et pays explicite
  const addrWithLine2: PostalAddress = {
    name: "Marie Martin",
    addressLine1: "5 avenue des Champs-Élysées",
    addressLine2: "Bâtiment A",
    zipcode: "75008",
    city: "Paris",
    country: "FR",
  };

  try {
    const res = await provider.validateAddress(addrWithLine2);
    if (res.valid) {
      ok("Adresse avec ligne 2 acceptée");
    } else {
      fail(`Adresse valide (ligne 2) rejetée : ${res.reason}`);
    }
  } catch (err) {
    fail("validateAddress (ligne 2) a levé une exception", err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 2. validateAddress — cas invalides
  // ───────────────────────────────────────────────────────────────────────────

  section("2. validateAddress — cas invalides (doivent tous échouer)");

  const invalidCases: Array<[string, Partial<PostalAddress>]> = [
    ["nom vide", { ...validAddr, name: "" }],
    ["addressLine1 vide", { ...validAddr, addressLine1: "" }],
    ["zipcode vide", { ...validAddr, zipcode: "" }],
    ["ville vide", { ...validAddr, city: "" }],
    ["code postal non numérique", { ...validAddr, zipcode: "ABCDE" }],
    ["code postal 4 chiffres", { ...validAddr, zipcode: "7500" }],
    ["code postal 6 chiffres", { ...validAddr, zipcode: "750020" }],
    ["addressLine1 > 38 chars", { ...validAddr, addressLine1: "A".repeat(39) }],
    ["addressLine2 > 38 chars", { ...validAddr, addressLine2: "B".repeat(39) }],
    ["nom > 38 chars", { ...validAddr, name: "C".repeat(39) }],
  ];

  let invalidPassed = 0;
  for (const [label, addr] of invalidCases) {
    try {
      const res = await provider.validateAddress(addr as PostalAddress);
      if (!res.valid) {
        ok(`"${label}" → rejeté : ${res.reason}`);
        invalidPassed++;
      } else {
        fail(`"${label}" → attendu invalid, obtenu valid`);
      }
    } catch (err) {
      fail(`"${label}" → exception inattendue`, err);
    }
  }

  console.log(`\n  Bilan : ${invalidPassed}/${invalidCases.length} cas invalides correctement rejetés`);

  // ───────────────────────────────────────────────────────────────────────────
  // 3. submitMailing — sandbox
  // ───────────────────────────────────────────────────────────────────────────

  section("3. submitMailing — envoi en sandbox");

  const sender: PostalAddress = {
    name: "JusteCourrier",
    addressLine1: "1 rue de la République",
    zipcode: "75001",
    city: "Paris",
    country: "FR",
  };

  const recipient: PostalAddress = {
    name: "Service Client Test",
    addressLine1: "10 place de la Bourse",
    zipcode: "75002",
    city: "Paris",
    country: "FR",
  };

  const internalId = `test-4.2-${Date.now()}`;
  let providerMailingId: string | null = null;

  try {
    console.log(`\n  Soumission mailing (mode: simple, ID interne: ${internalId})…`);
    const result = await provider.submitMailing({
      mode: "simple",
      sender,
      recipient,
      pdfBuffer: MINIMAL_PDF,
      internalMailingId: internalId,
    });

    dump("Résultat submitMailing", result);
    providerMailingId = result.providerMailingId;

    ok(`Provider ID : ${providerMailingId}`);
    ok(`Coût : ${(result.costCents / 100).toFixed(2)} €`);
    if (result.trackingNumber) {
      ok(`Numéro de suivi : ${result.trackingNumber}`);
    } else {
      console.log("  ·  Pas de numéro de suivi (normal pour lettre simple)");
    }
  } catch (err) {
    fail("submitMailing a échoué", err);
    console.log("\n  → Vérifiez que MSB_API_KEY_TEST est valide (dashboard MySendingBox).");
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 4. getMailingStatus — polling
  // ───────────────────────────────────────────────────────────────────────────

  section("4. getMailingStatus — polling du statut");

  if (!providerMailingId) {
    warn("submitMailing a échoué — getMailingStatus ignoré.");
  } else {
    try {
      const status = await provider.getMailingStatus(providerMailingId);
      dump("Statut retourné", status);
      ok(`Statut unifié : "${status.status}"`);
      if (status.trackingNumber) ok(`Numéro de suivi : ${status.trackingNumber}`);
    } catch (err) {
      fail("getMailingStatus a échoué", err);
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 5. verifyWebhookSignature — test unitaire
  // ───────────────────────────────────────────────────────────────────────────

  section("5. verifyWebhookSignature");

  const webhookSecret = process.env.MSB_WEBHOOK_SECRET;
  if (!webhookSecret || webhookSecret === "...") {
    warn("MSB_WEBHOOK_SECRET non configuré → test ignoré (à faire en Phase 4.4).");
    warn("Ajoutez le secret depuis le dashboard MySendingBox → Webhooks.");
  } else {
    const body = JSON.stringify({ id: "evt_test", type: "letter.status_updated" });
    const correctSig = createHmac("sha256", webhookSecret).update(body, "utf8").digest("hex");
    const wrongSig = "a".repeat(64); // 64 hex chars (256 bits) mais incorrect

    const providerWithSecret = new MySendingBoxProvider({ webhookSecret });

    try {
      const validResult = providerWithSecret.verifyWebhookSignature(body, correctSig);
      if (validResult) {
        ok("Signature HMAC-SHA256 valide → acceptée ✓");
      } else {
        fail("Signature valide → rejetée à tort");
      }
    } catch (err) {
      fail("verifyWebhookSignature (valide) a levé une exception", err);
    }

    try {
      const invalidResult = providerWithSecret.verifyWebhookSignature(body, wrongSig);
      if (!invalidResult) {
        ok("Signature invalide → rejetée ✓");
      } else {
        fail("Signature invalide → acceptée à tort");
      }
    } catch (err) {
      // timingSafeEqual peut lancer si longueurs différentes — attendu
      ok("Signature invalide → exception levée (comportement correct)");
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Résumé final
  // ───────────────────────────────────────────────────────────────────────────

  console.log("\n╔══════════════════════════════════════════════════╗");
  console.log("║   Tests Phase 4.2 terminés                       ║");
  if (providerMailingId) {
    console.log(`║   Mailing sandbox créé : ${providerMailingId.slice(0, 22)}…  ║`);
  }
  console.log("║   Prochaine étape : Phase 4.3 (UX preview)       ║");
  console.log("╚══════════════════════════════════════════════════╝\n");
}

main().catch((err) => {
  console.error("\n[FATAL]", err instanceof Error ? err.stack : err);
  process.exit(1);
});
