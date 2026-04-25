// HeroLetter.tsx — Lettre fictive avec cachet JC pour le hero de la landing

export default function HeroLetter() {
  return (
    <div className="relative">
      {/* Lettre */}
      <div
        className="bg-jc-bg-elev border border-jc-line rounded-jc-sm relative"
        style={{
          padding: "28px 32px",
          fontSize: "13px",
          lineHeight: 1.65,
          boxShadow: "0 16px 48px rgba(20,30,50,0.08)",
        }}
      >
        {/* En-tête expéditeur + date */}
        <div
          className="flex justify-between text-jc-ink-muted mb-[18px]"
          style={{ fontSize: "11px" }}
        >
          <div>
            <div className="font-semibold text-jc-ink">Camille Durand</div>
            <div>14 rue des Lilas, 75011 Paris</div>
          </div>
          <div className="text-right">Paris, le 25 avril 2026</div>
        </div>

        {/* Destinataire */}
        <div className="text-jc-ink-soft mb-3.5" style={{ fontSize: "11px" }}>
          <div className="font-semibold text-jc-ink">
            Service Client — TélécoFrance
          </div>
          <div>BP 1042, 92076 Paris La Défense Cedex</div>
        </div>

        {/* Objet */}
        <div className="mb-3.5" style={{ fontSize: "11px" }}>
          <span className="underline">Objet</span>&nbsp;: Résiliation de mon
          abonnement n°FX-9824107
        </div>

        {/* Corps */}
        <p className="text-jc-ink mb-2.5" style={{ fontSize: "12px" }}>
          Madame, Monsieur,
        </p>
        <p className="text-jc-ink-soft mb-2" style={{ fontSize: "12px" }}>
          Par la présente, je vous notifie ma décision de résilier
          l&apos;abonnement référencé en objet, conformément aux dispositions de
          l&apos;article L.&nbsp;224-39 du Code de la consommation.
        </p>
        <p className="text-jc-ink-soft" style={{ fontSize: "12px" }}>
          Je vous prie de bien vouloir cesser tout prélèvement à compter de la
          date d&apos;effet de la présente résiliation et de me confirmer la
          prise en compte par retour…
        </p>
      </div>

      {/* Cachet / Stamp */}
      <div
        className="absolute"
        style={{ bottom: "-18px", right: "-10px", transform: "rotate(-12deg)" }}
      >
        <div
          className="inline-flex items-center justify-center border-2 border-jc-accent rounded-full text-jc-accent font-display relative"
          style={{
            width: "92px",
            height: "92px",
            fontSize: "12px",
            fontWeight: 600,
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {/* Cercle intérieur en pointillés */}
          <span
            className="absolute border border-dashed border-jc-accent rounded-full"
            style={{ inset: "5px" }}
          />
          <span className="relative z-10">
            Lettre
            <br />
            certifiée
            <br />
            JC
          </span>
        </div>
      </div>
    </div>
  );
}
