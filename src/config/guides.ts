export interface Guide {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  /** Slug du letterType lié (pour le CTA) */
  relatedLetterSlug: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  sections: { heading: string; body: string }[];
}

export const guides: Guide[] = [
  // ─── Guide 1 : Résiliation salle de sport ───
  {
    slug: "resilier-salle-de-sport",
    title: "Comment résilier son abonnement en salle de sport",
    metaTitle: "Résilier sa salle de sport — Modèle de lettre gratuit",
    description:
      "Guide complet pour résilier votre abonnement en salle de sport (Basic-Fit, Fitness Park, Neoness…). Délais, motifs légitimes, modèle de lettre.",
    relatedLetterSlug: "resiliation-abonnement",
    publishedAt: "2026-04-25",
    updatedAt: "2026-04-25",
    readingTime: "4 min",
    sections: [
      {
        heading: "Ai-je le droit de résilier ?",
        body: `En France, la loi encadre strictement les contrats d'abonnement en salle de sport. Depuis la loi Hamon de 2014 et le décret du 28 novembre 2014, vous pouvez résilier votre abonnement à tout moment après la première année d'engagement, moyennant un préavis d'un mois maximum.

Si votre contrat est sans engagement, vous pouvez résilier quand vous le souhaitez en respectant le préavis prévu au contrat (généralement 1 mois).

Pendant la période d'engagement (souvent 12 mois), la résiliation n'est possible que pour un motif légitime : déménagement à plus de 30 km, maladie longue durée, accident rendant la pratique impossible, ou licenciement.`,
      },
      {
        heading: "Les motifs légitimes de résiliation anticipée",
        body: `Même pendant votre période d'engagement, vous pouvez résilier sans frais si vous justifiez d'un motif légitime. Les principaux motifs reconnus par la jurisprudence sont les suivants.

Le déménagement à plus de 30 km de la salle est le motif le plus fréquent. Vous devez fournir un justificatif de domicile au nouveau lieu de résidence (facture, attestation d'hébergement, bail).

Une maladie ou un accident empêchant durablement la pratique sportive constitue également un motif légitime. Un certificat médical mentionnant l'incapacité de pratiquer une activité sportive suffit.

Un licenciement économique ou une mutation professionnelle sont aussi des motifs recevables. Joignez la lettre de licenciement ou l'ordre de mutation à votre courrier.`,
      },
      {
        heading: "Comment envoyer votre lettre de résiliation",
        body: `La résiliation doit impérativement être faite par écrit. L'envoi en lettre recommandée avec accusé de réception (LRAR) est fortement conseillé : c'est la seule preuve opposable en cas de litige.

Votre courrier doit contenir votre identité complète, votre numéro d'abonné ou de contrat, la date de souscription, le motif de résiliation, et la date de prise d'effet souhaitée.

Le préavis court à compter de la réception du courrier par la salle. Pensez donc à envoyer votre lettre suffisamment tôt. Pendant le préavis, vous pouvez continuer à utiliser la salle et les prélèvements restent dus.`,
      },
      {
        heading: "Que faire si la salle refuse votre résiliation ?",
        body: `Si la salle ne donne pas suite à votre courrier dans un délai raisonnable (15 jours), envoyez une mise en demeure par LRAR en rappelant les références légales : articles L. 215-1 à L. 215-3 du Code de la consommation pour les contrats tacitement reconductibles.

Si le blocage persiste, vous pouvez saisir le médiateur de la consommation dont dépend la salle (ses coordonnées doivent figurer sur le contrat ou le site web de la salle). La médiation est gratuite pour le consommateur.

En dernier recours, vous pouvez faire opposition aux prélèvements bancaires auprès de votre banque et saisir le juge de proximité pour les litiges inférieurs à 5 000 euros.`,
      },
    ],
  },

  // ─── Guide 2 : Contestation facture énergie ───
  {
    slug: "contester-facture-energie",
    title: "Comment contester une facture d'énergie trop élevée",
    metaTitle: "Contester une facture EDF / Engie — Lettre type et démarches",
    description:
      "Votre facture d'électricité ou de gaz est anormalement élevée ? Guide complet : vérifications, démarches auprès du fournisseur, recours, modèle de lettre.",
    relatedLetterSlug: "contestation-facture",
    publishedAt: "2026-04-25",
    updatedAt: "2026-04-25",
    readingTime: "5 min",
    sections: [
      {
        heading: "Vérifier avant de contester",
        body: `Avant d'envoyer un courrier, commencez par vérifier si l'augmentation est justifiée. Plusieurs causes fréquentes expliquent une facture anormalement haute.

Une facture de régularisation corrige l'écart entre vos mensualités estimées et votre consommation réelle. Elle peut être salée si le compteur n'a pas été relevé depuis longtemps. Comparez l'index relevé avec celui que vous pouvez lire sur votre compteur.

Un changement de tarif réglementé peut aussi expliquer la hausse. Vérifiez les dates d'application des nouveaux tarifs sur le site de la Commission de régulation de l'énergie (CRE).

Un dysfonctionnement du compteur est plus rare mais possible. Si vous suspectez un problème, vous pouvez demander un contrôle au gestionnaire de réseau (Enedis pour l'électricité, GRDF pour le gaz). Attention : si le compteur est conforme, le contrôle vous sera facturé (environ 50 euros).`,
      },
      {
        heading: "La procédure de contestation étape par étape",
        body: `La première étape est de contacter le service client de votre fournisseur (EDF, Engie, TotalEnergies, Eni…) par téléphone ou via l'espace client. Notez la date, le nom de l'interlocuteur et le numéro de dossier.

Si la réponse ne vous satisfait pas, passez à l'écrit. Envoyez une lettre recommandée avec accusé de réception au service réclamation du fournisseur. Votre courrier doit mentionner votre numéro de client, la référence de la facture contestée, le montant en cause, et les raisons précises de votre contestation.

Le fournisseur dispose de deux mois pour vous répondre. En l'absence de réponse ou si la réponse ne vous convient pas, vous pouvez saisir le Médiateur national de l'énergie (MNE), autorité publique indépendante, via energie-mediateur.fr.`,
      },
      {
        heading: "Les références légales à connaître",
        body: `Plusieurs textes protègent le consommateur en matière de facturation d'énergie.

L'article L. 224-11 du Code de la consommation prévoit que le fournisseur doit émettre une facture au moins une fois par an sur la base de la consommation réelle. Toute facture de régularisation portant sur plus de 14 mois de consommation est contestable sur la période excédentaire.

L'article R. 224-20 fixe un délai de prescription de 14 mois pour les factures de régularisation : le fournisseur ne peut pas vous réclamer un rattrapage de consommation au-delà de 14 mois, sauf si le défaut de relevé vous est imputable (compteur inaccessible).

Enfin, si vous êtes en difficulté de paiement, l'article L. 115-3 du Code de l'action sociale interdit toute coupure d'énergie pendant la trêve hivernale (1er novembre au 31 mars).`,
      },
      {
        heading: "Le Médiateur national de l'énergie : votre recours gratuit",
        body: `Le Médiateur national de l'énergie (MNE) est compétent pour tous les litiges liés à l'exécution d'un contrat d'énergie (électricité, gaz, fioul, bois, réseaux de chaleur). La saisine est gratuite et se fait en ligne sur energie-mediateur.fr.

Conditions de saisine : vous devez avoir d'abord adressé une réclamation écrite à votre fournisseur et n'avoir pas obtenu de réponse satisfaisante dans un délai de deux mois.

Le médiateur rend un avis dans un délai de 90 jours. Cet avis n'est pas contraignant, mais dans la pratique les fournisseurs le suivent dans plus de 85 % des cas. Si le fournisseur refuse, vous conservez le droit de saisir le tribunal.`,
      },
    ],
  },

  // ─── Guide 3 : Mise en demeure loyer impayé ───
  {
    slug: "mise-en-demeure-loyer-impaye",
    title: "Mise en demeure pour loyer impayé : guide du propriétaire",
    metaTitle: "Mise en demeure loyer impayé — Modèle et procédure",
    description:
      "Votre locataire ne paie plus son loyer ? Guide complet : mise en demeure, délais, commandement de payer, procédure d'expulsion. Modèle de lettre inclus.",
    relatedLetterSlug: "mise-en-demeure-payer",
    publishedAt: "2026-04-25",
    updatedAt: "2026-04-25",
    readingTime: "5 min",
    sections: [
      {
        heading: "Quand envoyer une mise en demeure ?",
        body: `La mise en demeure est la première étape formelle en cas de loyer impayé. Elle doit être envoyée dès que le retard de paiement est avéré et que les relances amiables (appel, SMS, email) n'ont pas abouti.

En pratique, la plupart des propriétaires envoient une mise en demeure après 15 à 30 jours de retard. Il n'y a pas de délai légal minimum, mais agir trop vite (avant l'échéance du mois) serait prématuré, et attendre trop longtemps affaiblirait votre position.

La mise en demeure a une double fonction : elle formalise votre demande de paiement avec une date certaine, et elle constitue une preuve indispensable si vous devez ensuite engager une procédure judiciaire. Sans mise en demeure préalable, un juge pourrait considérer que vous n'avez pas cherché de solution amiable.`,
      },
      {
        heading: "Que doit contenir la mise en demeure ?",
        body: `Pour avoir une valeur juridique, votre mise en demeure doit contenir plusieurs éléments obligatoires.

L'identification complète des parties (propriétaire et locataire), l'adresse du bien loué, et la référence du contrat de bail. Le décompte précis des sommes dues : loyers impayés mois par mois, charges, et éventuellement pénalités de retard si le bail le prévoit.

Un délai de paiement raisonnable (8 à 15 jours est la norme), et la mention explicite qu'à défaut de règlement dans ce délai, vous vous réserverez le droit d'engager les poursuites judiciaires appropriées.

L'envoi doit impérativement se faire par lettre recommandée avec accusé de réception. C'est la preuve de la date de réception qui fait courir le délai que vous accordez.`,
      },
      {
        heading: "Si le locataire ne paie toujours pas",
        body: `Si le locataire ne réagit pas à votre mise en demeure dans le délai imparti, l'étape suivante dépend de ce que prévoit votre bail.

Si le bail contient une clause résolutoire (c'est le cas de la quasi-totalité des baux d'habitation), vous pouvez faire délivrer un commandement de payer par un commissaire de justice (ex-huissier). Le locataire dispose alors de 6 semaines pour régler sa dette. Passé ce délai, la clause résolutoire est acquise et le bail est résilié de plein droit.

Si le bail ne contient pas de clause résolutoire, vous devez saisir le tribunal judiciaire pour demander la résiliation du bail et l'expulsion. La procédure est plus longue.

Dans tous les cas, vous devez signaler l'impayé à la CAF si le locataire perçoit une aide au logement (APL/ALF/ALS). La CAF peut déclencher un protocole d'aide au maintien dans le logement.`,
      },
      {
        heading: "Les aides et protections à connaître",
        body: `Avant d'engager une procédure coûteuse, explorez les dispositifs d'aide existants.

La garantie Visale (Action Logement) couvre les impayés de loyer jusqu'à 36 mois pour les baux qu'elle garantit. Si votre locataire en bénéficie, contactez Action Logement pour activer la garantie.

Si vous avez souscrit une assurance loyers impayés (GLI), déclarez le sinistre dès le premier impayé. L'assureur prendra en charge les démarches et les frais de procédure.

Côté locataire, le Fonds de solidarité pour le logement (FSL) peut accorder une aide d'urgence. Vous pouvez orienter votre locataire vers l'ADIL (Agence départementale d'information sur le logement) de votre département pour qu'il soit accompagné.

Enfin, rappelons que la trêve hivernale (1er novembre au 31 mars) interdit toute expulsion effective, mais n'empêche pas d'engager ou de poursuivre la procédure judiciaire pendant cette période.`,
      },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
