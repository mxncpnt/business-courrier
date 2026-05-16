/**
 * Catégorie thématique d'un guide — distincte du `letterType` (type de courrier).
 * Le découpage par domaine de vie (logement, banque, conso, énergie, admin,
 * travail) est plus didactique pour l'utilisateur et meilleur pour le SEO
 * (topical authority par domaine plutôt que par type de lettre).
 *
 * Source de vérité unique pour les chips de filtrage sur /guides, le
 * groupement de la page liste, et les futures pages catégorie dédiées
 * (`/guides/logement-bail`, etc. — Phase 2 quand on dépassera 50 guides).
 */
export type GuideCategory =
  | "logement-bail"
  | "banque-assurance"
  | "consommation"
  | "energie"
  | "administrations"
  | "travail";

export const GUIDE_CATEGORIES: {
  slug: GuideCategory;
  label: string;
  icon: string;
  description: string;
}[] = [
  {
    slug: "logement-bail",
    label: "Logement & Bail",
    icon: "🏠",
    description:
      "Locataire, propriétaire, copropriété, voisinage, travaux dans le logement.",
  },
  {
    slug: "banque-assurance",
    label: "Banque, Assurance & Crédit",
    icon: "🏦",
    description:
      "Frais bancaires, prélèvements, assurance auto, santé, emprunteur et indemnisations.",
  },
  {
    slug: "consommation",
    label: "Consommation & Abonnements",
    icon: "🛒",
    description:
      "Salle de sport, télécom, mutuelle, e-commerce, transports : faire valoir vos droits de consommateur.",
  },
  {
    slug: "energie",
    label: "Énergie",
    icon: "⚡",
    description:
      "Contester une facture EDF, Engie ou tout fournisseur d'énergie.",
  },
  {
    slug: "administrations",
    label: "Administrations & Services Publics",
    icon: "🏛️",
    description:
      "CAF, France Travail, CPAM, mairies, préfectures : recours et réclamations.",
  },
  {
    slug: "travail",
    label: "Travail & Emploi",
    icon: "💼",
    description:
      "Heures supplémentaires, CDD, solde de tout compte, rupture conventionnelle.",
  },
];

export interface Guide {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  /** Slug du letterType lié (pour le CTA) */
  relatedLetterSlug: string;
  /** Catégorie thématique du guide (domaine de vie) — voir GuideCategory */
  category: GuideCategory;
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  sections: { heading: string; body: string }[];
  /**
   * Questions/réponses fréquentes — alimente le JSON-LD FAQPage et permet
   * potentiellement le rich snippet "Personnes ont aussi posé ces questions"
   * en SERP. Recommandé : 4-6 Q/R, réponses 80-200 mots, jamais de promo
   * commerciale dans la réponse (Google peut considérer ça comme spam).
   */
  faq?: { q: string; a: string }[];
}

export const guides: Guide[] = [
  // ─── Guide 1 : Résiliation salle de sport ───
  {
    slug: "resilier-salle-de-sport",
    category: "consommation",
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
    faq: [
      {
        q: "Puis-je résilier ma salle de sport sans préavis ?",
        a: "Oui, dans deux cas : si vous justifiez d'un motif légitime (déménagement à plus de 30 km, maladie ou accident empêchant la pratique sportive, licenciement, mutation), ou si la salle ne respecte pas ses obligations (équipements défaillants, fermeture prolongée, hausse tarifaire non prévue au contrat). Dans ces situations, le préavis contractuel ne s'applique pas. En revanche, hors motif légitime et hors période d'engagement, le préavis prévu au contrat (généralement 1 mois) s'impose. Joignez systématiquement les justificatifs à votre courrier.",
      },
      {
        q: "Quel est le délai de préavis pour résilier une salle de sport ?",
        a: "La loi ne fixe pas de délai universel : c'est le contrat qui le prévoit. Dans la grande majorité des cas, le préavis est d'1 mois à compter de la réception de votre lettre par la salle. Certains contrats imposent 2 mois, ce qui est légal tant que c'est mentionné aux conditions générales. Pendant le préavis, vous pouvez continuer à utiliser la salle et les prélèvements restent dus. Le préavis ne court pas tant que la salle n'a pas reçu votre courrier — d'où l'importance de l'envoyer en recommandé avec AR pour avoir une date certaine.",
      },
      {
        q: "Que se passe-t-il si je suis en période d'engagement ?",
        a: "Pendant la période d'engagement (souvent 12 mois), la résiliation hors motif légitime n'est pas possible : vous restez tenu de payer jusqu'à la fin de la période, même si vous n'allez plus à la salle. La loi Hamon (2014) impose toutefois que la salle vous informe avant la reconduction tacite, et vous donne la possibilité de résilier à tout moment après la première année moyennant le préavis. Si vous êtes en période d'engagement et avez un motif légitime, joignez les justificatifs (avis de mutation, certificat médical, justificatif de déménagement) : la résiliation est alors gratuite et immédiate après préavis.",
      },
      {
        q: "Comment prouver que j'ai bien envoyé ma résiliation ?",
        a: "Seul l'envoi en lettre recommandée avec accusé de réception (LRAR) constitue une preuve opposable en cas de litige. L'AR signé par la salle (ou la mention « pli avisé non réclamé ») fait foi devant un juge. Conservez précieusement le récépissé de dépôt remis par La Poste, ainsi que l'AR retourné. Un email ou un courrier simple ne sont PAS des preuves recevables : la salle peut prétendre ne jamais les avoir reçus. Le passage à l'accueil avec signature d'un formulaire est valide uniquement si on vous remet un double signé et daté.",
      },
      {
        q: "La salle peut-elle me prélever après ma résiliation ?",
        a: "Pendant le préavis (1 ou 2 mois après réception de votre lettre), oui : les prélèvements restent dus contractuellement. Après le préavis, tout prélèvement est indu et constitue une infraction. Si la salle continue à prélever, faites opposition à votre banque (sans frais avec la directive DSP2) et envoyez une mise en demeure par LRAR demandant le remboursement sous 8 jours. En cas de refus, saisissez le médiateur de la consommation puis le juge de proximité (compétent jusqu'à 5 000 €).",
      },
      {
        q: "Que faire si la salle ne répond pas à ma lettre ?",
        a: "Attendez 15 jours après réception de votre LRAR. Sans réponse, votre résiliation est juridiquement effective : à la fin du préavis, le contrat prend fin de plein droit. Pour formaliser, envoyez une seconde lettre rappelant la date de votre première résiliation et exigeant l'arrêt des prélèvements. Si les prélèvements continuent, faites opposition. Vous pouvez aussi saisir gratuitement le médiateur de la consommation dont dépend la salle (ses coordonnées figurent au contrat ou en pied de site web).",
      },
    ],
  },

  // ─── Guide 2 : Contestation facture énergie ───
  {
    slug: "contester-facture-energie",
    category: "energie",
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
    faq: [
      {
        q: "Quel est le délai pour contester une facture EDF ou Engie ?",
        a: "Vous disposez de 5 ans pour contester une facture d'énergie. Ce délai de prescription court à partir de la date d'émission de la facture (article L.218-2 du Code de la consommation). Cependant, plus vous agissez vite, plus le dossier est facile à instruire : les relevés de compteur, données de consommation et justificatifs sont plus accessibles dans les premiers mois. En pratique, contestez dès réception de la facture si elle vous semble anormale, et au plus tard dans les 60 jours pour éviter les pénalités de retard. Pendant la contestation, vous pouvez payer la part non contestée et bloquer la part contestée.",
      },
      {
        q: "Puis-je refuser de payer pendant que je conteste ?",
        a: "Vous pouvez bloquer le paiement de la part contestée, mais vous devez continuer à payer la part non contestée (souvent : votre consommation moyenne historique). Refuser de payer la totalité expose à des pénalités, à une suspension de fourniture (avec des règles de protection en hiver pour les ménages précaires), et à une procédure de recouvrement. Le bon réflexe : envoyer votre contestation par LRAR avec un chèque ou un virement de la part non contestée, en précisant clairement « paiement partiel sous contestation de la somme de X € ». Cela montre votre bonne foi tout en préservant vos droits.",
      },
      {
        q: "Que faire si mon compteur Linky semble fausser les relevés ?",
        a: "Demandez à Enedis (gestionnaire du réseau, distinct de votre fournisseur) une vérification métrologique de votre compteur. Cette intervention est gratuite si l'écart constaté dépasse les tolérances réglementaires (±2 % en moyenne), sinon elle vous est facturée environ 60 €. Vous pouvez aussi exiger un retour à l'ancien compteur électromécanique : Enedis le refuse souvent mais la jurisprudence vous donne raison si vous justifiez un motif sérieux (problème de santé, défaillance répétée). En attendant la vérification, demandez une facturation sur estimation basée sur votre historique de consommation.",
      },
      {
        q: "Mon fournisseur peut-il me couper l'énergie pendant un litige ?",
        a: "Hors trêve hivernale (1er novembre - 31 mars), votre fournisseur peut suspendre la fourniture en cas d'impayé après un préavis de 14 jours. Pendant la trêve hivernale, la coupure est interdite pour les particuliers, mais la puissance peut être réduite. Si vous êtes en contestation formelle (LRAR envoyée, médiateur saisi), la coupure est juridiquement contestable. Saisissez en urgence le médiateur national de l'énergie et signalez la situation à votre département (services sociaux) qui peut activer le Fonds de solidarité pour le logement (FSL) ou le Chèque énergie.",
      },
      {
        q: "Quand saisir le médiateur national de l'énergie ?",
        a: "Vous pouvez saisir le médiateur après avoir adressé une réclamation écrite à votre fournisseur et n'avoir pas obtenu de réponse satisfaisante dans les 2 mois. La saisine est gratuite et se fait en ligne sur energie-mediateur.fr ou par courrier. Le médiateur rend un avis dans un délai de 90 jours. Cet avis n'est pas contraignant, mais dans 85 % des cas le fournisseur le suit. Pendant l'instruction, le fournisseur ne peut pas engager de procédure de recouvrement sur la somme contestée. Si l'avis vous est défavorable ou si le fournisseur refuse, vous gardez la possibilité de saisir le tribunal judiciaire.",
      },
      {
        q: "Quels documents fournir à l'appui de ma contestation ?",
        a: "Joignez les éléments objectifs qui étayent votre contestation : copie de la facture contestée, historique de consommation des 12 derniers mois (disponible sur votre espace client), photos datées du compteur si l'index facturé diffère, copies des courriers ou emails échangés avec le fournisseur, et toute pièce contextuelle (justificatif de déménagement, attestation d'absence prolongée, etc.). Plus votre dossier est documenté, plus il a de chances d'être traité sans contestation par le fournisseur. Évitez les arguments subjectifs (« la facture est trop élevée ») au profit de faits chiffrés et de pièces.",
      },
    ],
  },

  // ─── Guide 3 : Mise en demeure loyer impayé ───
  {
    slug: "mise-en-demeure-loyer-impaye",
    category: "logement-bail",
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
    faq: [
      {
        q: "Combien de temps attendre avant d'envoyer une mise en demeure pour loyer impayé ?",
        a: "La loi ne fixe pas de délai obligatoire. En pratique, la plupart des propriétaires envoient une mise en demeure entre 15 et 30 jours après l'échéance impayée. Avant cela, privilégiez les relances amiables (appel, SMS, email) qui suffisent souvent. Agir trop tôt (avant l'échéance complète du mois) serait prématuré et fragiliserait votre position. Attendre plus de 60 jours, à l'inverse, peut être interprété par un juge comme une tolérance qui rend votre demande moins légitime. La mise en demeure est l'étape clé qui formalise votre démarche : sans elle, aucune procédure judiciaire ne pourra aboutir efficacement.",
      },
      {
        q: "Quel délai accorder dans la mise en demeure ?",
        a: "Le délai usuel est de 8 à 15 jours, à compter de la réception du courrier (date de l'AR signé). C'est suffisant pour permettre un règlement de bonne foi tout en restant raisonnable juridiquement. Un délai plus court (moins de 8 jours) pourrait être jugé abusif. Un délai trop long (plus de 30 jours) affaiblit votre démarche et retarde la procédure. Mentionnez explicitement la date butoir dans votre courrier (« vous disposez de 15 jours à compter de la réception de la présente pour régulariser, soit avant le [date] »). Cette précision facilite la preuve devant un juge.",
      },
      {
        q: "Que se passe-t-il si le locataire ne paie pas après la mise en demeure ?",
        a: "Si le bail contient une clause résolutoire (cas standard pour les baux d'habitation), vous pouvez faire délivrer un commandement de payer par un commissaire de justice (ex-huissier). Le coût est de l'ordre de 80 à 150 €. Le locataire dispose alors de 6 semaines pour régler. Passé ce délai, la clause résolutoire est acquise : le bail est résilié de plein droit et vous pouvez saisir le tribunal pour faire constater la résiliation et demander l'expulsion. Sans clause résolutoire, vous devez assigner directement au tribunal judiciaire — la procédure est plus longue (6-12 mois en moyenne).",
      },
      {
        q: "Peut-on expulser un locataire pendant la trêve hivernale ?",
        a: "Non, l'expulsion physique d'un locataire est interdite entre le 1er novembre et le 31 mars (article L.412-6 du Code des procédures civiles d'exécution). Mais la procédure judiciaire peut continuer pendant cette période : commandement de payer, audience, jugement d'expulsion. Seule l'exécution effective (intervention du commissaire de justice avec la force publique) est suspendue. La trêve ne s'applique pas aux squatteurs ni aux occupants sans droit ni titre depuis le début. Conséquence pratique : engagez la procédure dès maintenant même en hiver, vous gagnerez 4 à 5 mois.",
      },
      {
        q: "La garantie Visale peut-elle prendre en charge les impayés ?",
        a: "Oui, si votre locataire a souscrit Visale (garantie gratuite Action Logement réservée aux moins de 30 ans, salariés précaires et étudiants). Visale couvre jusqu'à 36 mois d'impayés sur la durée du bail, dans la limite des plafonds de loyer. En cas d'impayé, contactez Action Logement dès le premier mois pour activer la garantie. Action Logement vous indemnise et se retourne ensuite contre le locataire. Si vous avez souscrit une assurance loyers impayés (GLI) à titre privé (1,5 à 4 % du loyer annuel), déclarez le sinistre dès le premier impayé : l'assureur prend en charge les démarches et les frais.",
      },
      {
        q: "Faut-il signaler l'impayé à la CAF ?",
        a: "Oui, c'est obligatoire si votre locataire perçoit une aide au logement (APL, ALF, ALS). La déclaration doit être faite dans les 2 mois suivant la constatation de l'impayé, via le formulaire CAF dédié (ou directement par votre espace bailleur en ligne). Sans signalement dans les délais, vous perdez le bénéfice du tiers payant et ne pouvez plus encaisser directement l'aide. La CAF peut alors déclencher un protocole d'aide au maintien dans le logement avec le locataire (plan d'apurement de la dette), qui suspend la procédure d'expulsion mais protège votre créance. C'est une démarche dans votre intérêt, pas une formalité administrative.",
      },
    ],
  },

  // ─── Guide 4 : Résiliation Free Mobile (loi Chatel) ───
  {
    slug: "resilier-free-mobile-loi-chatel",
    category: "consommation",
    title: "Résilier son forfait Free Mobile : guide complet",
    metaTitle: "Résilier Free Mobile (loi Chatel) — Procédure et modèle de lettre",
    description:
      "Comment résilier votre forfait Free Mobile : loi Chatel, délais, frais, portabilité du numéro (RIO), motifs légitimes, modèle de lettre recommandée.",
    relatedLetterSlug: "resiliation-abonnement",
    publishedAt: "2026-05-04",
    updatedAt: "2026-05-04",
    readingTime: "5 min",
    sections: [
      {
        heading: "Ce que la loi Chatel change pour votre résiliation",
        body: `La loi Chatel du 3 janvier 2008 (codifiée aux articles L.224-28 et suivants du Code de la consommation) protège les consommateurs des contrats à reconduction tacite. Elle s'applique pleinement aux forfaits Free Mobile.

Concrètement, Free doit vous informer par écrit, entre 3 mois et 1 mois avant la date de reconduction de votre engagement, de votre droit à ne pas reconduire le contrat. Si Free ne respecte pas ce délai d'information, vous pouvez résilier à tout moment et sans frais à compter de la date de reconduction tacite.

Pour les forfaits avec engagement de 12 ou 24 mois, la loi Chatel s'applique également pendant l'engagement initial. Au-delà de la moitié de l'engagement (mois 13 pour un engagement 24 mois), vous pouvez résilier en ne payant que 25 % des mensualités restantes (article L.224-39 du Code de la consommation, dit "loi Chatel-Hamon").

Pour les forfaits Free sans engagement (le cas le plus courant chez Free Mobile), vous pouvez résilier à tout moment moyennant un préavis de 10 jours, sans frais, conformément à l'article L.224-33 du Code de la consommation.`,
      },
      {
        heading: "Les motifs légitimes de résiliation anticipée",
        body: `Si vous êtes encore engagé, certains motifs vous permettent de résilier sans pénalités, même hors période Chatel-Hamon.

Le déménagement à l'étranger ou dans une zone non couverte par Free Mobile (4G/5G) est un motif légitime, à condition de le prouver par un justificatif de domicile. Pour vérifier la couverture, utilisez la carte de couverture officielle de l'Arcep (monreseaumobile.arcep.fr).

Le surendettement avéré, constaté par une décision de la commission de surendettement, ouvre droit à la résiliation sans frais (article L.224-39-1).

L'invalidité ou la perte d'autonomie certifiée par un médecin permet également de mettre fin au contrat. Joignez un certificat médical détaillant l'incapacité d'utiliser un téléphone mobile.

Le décès du titulaire libère les ayants droit de l'engagement sur présentation de l'acte de décès. La résiliation doit être demandée dans les 6 mois.

Une hausse tarifaire non prévue au contrat ouvre droit à résiliation sans frais dans un délai de 4 mois après notification, conformément à l'article L.224-33. Free doit vous informer par écrit au moins 1 mois avant l'application de la hausse.`,
      },
      {
        heading: "La procédure pas-à-pas pour résilier",
        body: `La résiliation doit être faite par écrit. La voie la plus sûre est le courrier recommandé avec accusé de réception adressé au service client Free Mobile (Service Résiliation, 75371 Paris CEDEX 08).

Avant d'envoyer, récupérez votre code RIO (Relevé d'Identité Opérateur) en composant le 3179 gratuitement depuis votre ligne Free. Ce code à 12 caractères vous permet de conserver votre numéro chez le nouvel opérateur grâce à la portabilité. Sans RIO, vous perdez votre numéro.

Votre courrier doit contenir vos identifiants client Free, votre numéro de ligne, la date de souscription et le motif de résiliation (sans frais ou avec engagement). Précisez si vous demandez la portabilité du numéro et indiquez votre code RIO.

Le délai de préavis est de 10 jours à compter de la réception du courrier par Free, ou de la date de portabilité demandée par le nouvel opérateur (si vous portez votre numéro, c'est lui qui déclenche la résiliation auprès de Free).

Une fois la résiliation effective, Free dispose de 10 jours pour vous restituer tout solde créditeur (avance, dépôt de garantie). Vous recevrez une dernière facture incluant le pro rata du dernier mois et, le cas échéant, les frais de résiliation anticipée.`,
      },
      {
        heading: "Que faire si Free refuse ou facture des frais indus ?",
        body: `Si Free refuse votre résiliation ou facture des frais que vous estimez injustifiés, contestez par écrit dans les 30 jours.

Première étape : envoyez une mise en demeure par LRAR au service client en rappelant les références légales applicables (loi Chatel, articles L.224-28 et suivants du Code de la consommation, ou loi Chatel-Hamon pour les engagements). Demandez le remboursement et un délai de 15 jours pour régulariser.

Si Free ne répond pas, saisissez le médiateur des communications électroniques (mediateur-telecom.fr). La saisine est gratuite, en ligne, et le médiateur rend un avis dans les 3 mois. Free suit l'avis dans 80 % des cas environ.

En cas d'échec de la médiation, vous pouvez saisir le juge des contentieux de la protection (compétent jusqu'à 10 000 €). La procédure est rapide (3-6 mois) et vous pouvez être assisté gratuitement par une association de consommateurs (UFC-Que Choisir, CLCV, AFOC).

Si Free continue à prélever après la résiliation effective, faites opposition à votre banque. La directive DSP2 vous permet de récupérer les sommes indûment prélevées dans les 8 semaines suivant le débit, sans frais.`,
      },
    ],
    faq: [
      {
        q: "Quel est le délai de préavis pour résilier Free Mobile ?",
        a: "Pour un forfait Free Mobile sans engagement (cas le plus courant), le préavis est de 10 jours à compter de la réception de votre lettre par Free. Si vous portez votre numéro chez un autre opérateur, c'est ce dernier qui déclenche la résiliation auprès de Free et le délai dépend de la portabilité (3 jours ouvrés en pratique). Pour un forfait avec engagement, la résiliation prend effet à la fin de la période d'engagement, sauf motif légitime ou loi Chatel-Hamon (résiliation au-delà de la moitié de l'engagement avec 25 % des mensualités restantes à payer).",
      },
      {
        q: "Free peut-il me facturer des frais de résiliation ?",
        a: "Pour un forfait sans engagement, aucun frais de résiliation n'est dû — c'est interdit par la loi (article L.224-33 du Code de la consommation). Pour un forfait avec engagement, Free peut facturer les mensualités restantes jusqu'à la fin de l'engagement, ou 25 % de ces mensualités si vous résiliez après la moitié de la période (loi Chatel-Hamon). En cas de motif légitime (déménagement à l'étranger, invalidité, surendettement, hausse tarifaire non prévue), aucun frais n'est dû. Toute facturation hors de ce cadre est contestable.",
      },
      {
        q: "Comment conserver mon numéro Free quand je change d'opérateur ?",
        a: "Demandez votre code RIO (Relevé d'Identité Opérateur) en composant le 3179 gratuitement depuis votre ligne Free. Vous recevez le code par SMS instantanément. Communiquez ce code à votre nouvel opérateur lors de la souscription : il s'occupe de la portabilité auprès de Free et déclenche la résiliation. Le numéro est porté en 1 à 3 jours ouvrés. Pendant ce délai, votre ligne Free reste active. La portabilité est gratuite et sans coupure de service. N'envoyez PAS de lettre de résiliation à Free dans ce cas : la portabilité tient lieu de résiliation automatique.",
      },
      {
        q: "Free a augmenté le tarif de mon forfait, puis-je résilier sans frais ?",
        a: "Oui, à condition que la hausse n'ait pas été prévue au contrat (clause d'indexation par exemple). Free doit vous notifier la hausse au moins 1 mois avant son application, par tout support durable (email, SMS, courrier). Vous disposez alors de 4 mois après cette notification pour résilier sans frais et sans pénalité, même si vous êtes encore en période d'engagement (article L.224-33 du Code de la consommation). Mentionnez explicitement ce motif dans votre lettre et joignez la copie de la notification de hausse reçue de Free.",
      },
      {
        q: "Que faire si Free continue à me prélever après ma résiliation ?",
        a: "Premier réflexe : faites opposition au prélèvement auprès de votre banque (gratuit depuis la directive DSP2). Vous pouvez demander le remboursement des sommes prélevées indûment dans les 8 semaines suivant le débit. Parallèlement, envoyez une mise en demeure par LRAR à Free demandant la cessation immédiate des prélèvements et le remboursement des sommes indues, avec un délai de 15 jours. Si Free ne s'exécute pas, saisissez le médiateur des communications électroniques (mediateur-telecom.fr), gratuit, qui rend un avis sous 3 mois. En cas de blocage persistant, le juge des contentieux de la protection est compétent jusqu'à 10 000 €.",
      },
      {
        q: "Quelle différence entre résilier Free Mobile et résilier la Freebox ?",
        a: "Free Mobile (forfait téléphonique) et Freebox (offre internet/TV/téléphone fixe) sont deux abonnements distincts, gérés par deux services différents chez Free. Résilier l'un n'entraîne pas la résiliation de l'autre. Pour la Freebox, l'adresse est différente (Free, 75371 Paris CEDEX 16) et les frais peuvent inclure la restitution du matériel (Freebox, télécommande, câbles). Le délai de préavis Freebox est aussi de 10 jours. Si vous résiliez les deux, envoyez deux courriers séparés en LRAR pour avoir des preuves distinctes.",
      },
    ],
  },

  // ─── Guide 5 : Mise en demeure travaux artisan ───
  {
    slug: "mise-en-demeure-travaux-artisan",
    category: "logement-bail",
    title: "Mise en demeure d'un artisan pour travaux non terminés",
    metaTitle: "Mise en demeure travaux artisan — Lettre type et procédure",
    description:
      "Votre artisan ne finit pas le chantier ou bâcle les travaux ? Guide complet : cadre juridique (article 1217 du Code civil), mise en demeure, délais, recours.",
    relatedLetterSlug: "mise-en-demeure-executer",
    publishedAt: "2026-05-04",
    updatedAt: "2026-05-04",
    readingTime: "6 min",
    sections: [
      {
        heading: "Quand peut-on mettre en demeure un artisan ?",
        body: `La mise en demeure est l'étape formelle qui transforme un retard ou une malfaçon en faute contractuelle ouvrant droit à des recours. Elle doit être envoyée dès que les délais convenus sont dépassés ou que les travaux livrés ne correspondent pas à ce qui a été commandé.

Trois situations classiques justifient une mise en demeure d'artisan : abandon de chantier (l'artisan ne revient plus malgré ses promesses), travaux inachevés malgré un acompte ou paiement intégral versé, et malfaçons identifiables (carrelage mal posé, fuites, défauts visibles à la livraison).

Avant d'envoyer la mise en demeure, vérifiez que les délais convenus sont bien dépassés. Un devis signé mentionne généralement une date de fin de chantier (ou un délai de réalisation). Sans date précise, la jurisprudence retient un délai "raisonnable" qui dépend de la nature des travaux : quelques semaines pour de la peinture, plusieurs mois pour une rénovation lourde.

La mise en demeure doit être précédée d'au moins une relance amiable (appel, email, SMS). Sans cette relance, un juge peut considérer que vous n'avez pas cherché de solution amiable. Conservez les preuves : captures d'écran de SMS, copies d'emails, journal d'appels.`,
      },
      {
        heading: "Le cadre juridique applicable",
        body: `L'article 1217 du Code civil, depuis la réforme de 2016, vous offre cinq options en cas de manquement contractuel d'un prestataire : refuser ou suspendre l'exécution de votre paiement, exiger l'exécution forcée (forcer l'artisan à terminer), obtenir une réduction du prix, demander la résolution du contrat (annulation), ou demander des dommages-intérêts en réparation du préjudice.

Pour la plupart des litiges artisans, l'option la plus adaptée est l'exécution forcée (article 1221) ou la résolution du contrat avec restitution des sommes versées (article 1224). Le choix dépend de l'avancement des travaux, de la confiance encore accordée à l'artisan, et de l'urgence à finir.

Si les travaux sont déjà partiellement payés et que l'artisan a abandonné, vous pouvez aussi demander la résolution unilatérale du contrat (article 1226). Cette résolution se fait par notification écrite à l'artisan, après une mise en demeure infructueuse, et vous libère du contrat sans avoir à saisir un juge — mais vous risquez une contestation devant le tribunal si l'artisan refuse.

Pour les chantiers de gros œuvre (extension, surélévation, structure), la garantie décennale (article 1792 du Code civil) couvre pendant 10 ans les désordres compromettant la solidité ou rendant l'ouvrage impropre à sa destination. L'artisan doit en avoir une attestation valide à la date du chantier.`,
      },
      {
        heading: "Que doit contenir votre mise en demeure",
        body: `Pour avoir une valeur juridique opposable, la mise en demeure doit être complète et précise.

Identifiez clairement les parties (vos coordonnées, celles de l'artisan avec son SIRET et son adresse de siège), faites référence au contrat ou au devis signé (numéro, date, montant), et résumez les faits chronologiquement (date de signature, échéances convenues, paiements effectués, événements de chantier).

Décrivez précisément les manquements constatés : travaux non commencés, partiellement réalisés, mal exécutés. Soyez factuel : "le carrelage de la salle de bains présente 3 fissures visibles à hauteur d'homme" est plus solide que "le carrelage est mal posé". Joignez si possible des photos datées.

Exigez explicitement l'exécution des prestations manquantes ou la correction des malfaçons, en fixant un délai raisonnable. Pour des travaux mineurs (1 jour de pose), 8 à 15 jours suffisent. Pour reprendre un chantier abandonné, 15 à 30 jours sont défendables. Mentionnez la date butoir précise ("avant le [date] inclus").

Annoncez les conséquences en cas d'inaction : saisine de la juridiction compétente, demande de résolution du contrat, dommages-intérêts pour le préjudice subi (frais de second artisan, retard d'emménagement, surcoûts). L'envoi doit obligatoirement se faire en lettre recommandée avec accusé de réception.`,
      },
      {
        heading: "Si l'artisan ne réagit pas : recours pratiques",
        body: `Sans réponse satisfaisante au délai imparti, plusieurs voies s'ouvrent à vous selon le montant du litige et la complexité des malfaçons.

Pour un litige inférieur à 5 000 €, la conciliation est obligatoire avant toute saisine du juge depuis le décret n° 2019-1333 (sauf exceptions). Le conciliateur de justice (gratuit, présent dans toutes les communes) peut être saisi en ligne sur conciliateurs.fr. Il rapproche les parties dans un délai de 3 mois.

Pour un litige entre 5 000 € et 10 000 €, le juge des contentieux de la protection est compétent. Vous pouvez vous représenter seul (ministère d'avocat non obligatoire) ou être assisté gratuitement par une association de consommateurs (UFC-Que Choisir, CLCV).

Au-delà de 10 000 €, le tribunal judiciaire est compétent et l'avocat est obligatoire au-delà de 10 000 € en première instance. Avant la saisine, une expertise judiciaire (référé-expertise) est souvent demandée pour faire constater les malfaçons par un expert assermenté. Coût : 1 500 à 4 000 € avancés par le demandeur, remboursés par la partie perdante.

Pour les artisans inscrits à la Chambre de Métiers et de l'Artisanat (CMA), vous pouvez aussi saisir le service de médiation de la CMA — gratuit, plus rapide que le tribunal, mais l'avis n'est pas contraignant.

Si l'artisan a une assurance responsabilité civile professionnelle (obligatoire) ou une garantie décennale, vous pouvez actionner l'assurance directement. L'attestation d'assurance doit avoir été remise au début du chantier ; sans elle, c'est une faute de l'artisan en soi.`,
      },
    ],
    faq: [
      {
        q: "Combien de temps attendre avant d'envoyer la mise en demeure ?",
        a: "Tout dépend de ce qui était convenu. Si le devis fixe une date de fin précise, vous pouvez envoyer la mise en demeure dès le lendemain du dépassement. Si le devis fixe seulement un délai approximatif (« sous 4 semaines »), attendez 1 à 2 semaines après l'échéance pour laisser une marge. Sans délai écrit, la jurisprudence retient un délai « raisonnable » qui varie : quelques semaines pour des travaux courts, plusieurs mois pour une rénovation lourde. Avant la mise en demeure formelle, prévoyez toujours au moins une relance amiable (email ou SMS), conservée comme preuve : sans cela un juge peut vous reprocher de ne pas avoir cherché de solution amiable.",
      },
      {
        q: "Quel délai accorder à l'artisan dans la mise en demeure ?",
        a: "Le délai doit être proportionné aux travaux à reprendre. Pour des finitions mineures (joints, peinture, ajustement), 8 à 15 jours sont suffisants. Pour reprendre un chantier abandonné nécessitant plusieurs jours de présence, accordez 15 à 30 jours. Pour des malfaçons techniques nécessitant le retour d'un sous-traitant ou la commande de matériaux, 30 à 60 jours peuvent se justifier. Mentionnez explicitement la date butoir (« avant le [date] inclus »). Un délai trop court (< 8 jours) peut être jugé abusif et fragiliser votre démarche. Un délai trop long (> 90 jours) affaiblit l'effet de la mise en demeure.",
      },
      {
        q: "Que faire si l'artisan refuse de venir terminer les travaux ?",
        a: "S'il refuse explicitement (par écrit ou en présence de témoins), vous pouvez prononcer la résolution du contrat par notification écrite (article 1226 du Code civil) : le contrat est éteint, l'artisan doit restituer les sommes versées, et vous êtes libre de faire intervenir un autre artisan. La résolution unilatérale est possible « aux risques et périls » du créancier — l'artisan peut la contester devant le juge. Pour sécuriser, faites constater l'abandon par huissier (procès-verbal de constat, environ 200-400 €). Vous pouvez ensuite engager un autre artisan et demander en justice la différence de prix au premier, plus les éventuels surcoûts (article 1222).",
      },
      {
        q: "L'artisan peut-il refacturer plus pour terminer les travaux ?",
        a: "Non. Le devis signé fait foi sur le prix total convenu : l'artisan doit terminer les travaux pour ce prix, sauf si un avenant écrit a été signé pour des prestations supplémentaires. Toute facturation hors devis sans accord préalable est contestable. Si l'artisan invoque une erreur d'estimation pour exiger un supplément, c'est sa responsabilité contractuelle : un professionnel est tenu d'un devoir de conseil et d'une obligation d'estimer correctement. En revanche, si vous demandez vous-même des modifications en cours de chantier (changement de matériau, ajout de prestations), un avenant est nécessaire et le supplément est légitime.",
      },
      {
        q: "Comment prouver que les travaux ne sont pas conformes ?",
        a: "Plusieurs niveaux de preuve, par ordre de force croissante. Niveau 1 : photos datées des malfaçons, prises sous différents angles, avec si possible une référence d'échelle (mètre, pièce reconnaissable). Niveau 2 : devis ou diagnostic d'un autre artisan qualifié constatant les défauts et chiffrant la reprise — coût 100-300 €, puissant pour la négociation amiable. Niveau 3 : constat d'huissier (procès-verbal officiel, force probante devant le juge), 200-400 €. Niveau 4 : expertise judiciaire ordonnée par le juge en référé, 1 500-4 000 € (avancés puis remboursés par la partie perdante). Pour des défauts techniques majeurs (étanchéité, structure), passez directement au niveau 3 ou 4.",
      },
      {
        q: "Quand engager une expertise judiciaire ?",
        a: "L'expertise judiciaire est utile quand les malfaçons sont techniques (humidité, étanchéité, structure, chauffage), contestées par l'artisan, et que le coût de réparation est supérieur à 5 000 €. Procédure : saisir le juge des référés du tribunal judiciaire (« référé-expertise », article 145 du Code de procédure civile). Le juge nomme un expert assermenté qui examine le chantier en présence des parties. L'expertise dure 4 à 8 mois et coûte 1 500 à 4 000 € avancés par le demandeur (puis remboursés par la partie perdante). Le rapport d'expert a une force probante très élevée devant le juge du fond et règle souvent le litige sans procès. Pour des litiges < 5 000 €, c'est disproportionné : préférez un constat d'huissier ou un diagnostic d'artisan.",
      },
    ],
  },

  // ─── Guide 6 : Mise en demeure restitution caution location ───
  {
    slug: "mise-en-demeure-restitution-caution-location",
    category: "logement-bail",
    title: "Mise en demeure pour restitution du dépôt de garantie",
    metaTitle: "Caution non rendue — Mise en demeure du propriétaire (modèle 2026)",
    description:
      "Votre propriétaire ne vous a pas rendu le dépôt de garantie ? Délais légaux, intérêts de retard 10 %, mise en demeure, recours. Modèle de lettre LRAR.",
    relatedLetterSlug: "mise-en-demeure-payer",
    publishedAt: "2026-05-05",
    updatedAt: "2026-05-05",
    readingTime: "5 min",
    sections: [
      {
        heading: "Les délais légaux de restitution du dépôt de garantie",
        body: `Le dépôt de garantie (souvent appelé « caution » à tort) doit être restitué au locataire dans des délais fixés par la loi du 6 juillet 1989 (article 22).

Si l'état des lieux de sortie est conforme à l'état des lieux d'entrée (aucune dégradation), le délai de restitution est de **1 mois** à compter de la remise des clés. Si l'état des lieux de sortie fait apparaître des différences (dégradations imputables au locataire, impayés), le délai passe à **2 mois**.

Pour les locations en copropriété, le propriétaire peut conserver une provision équivalente à 20 % du dépôt en attendant l'arrêté annuel des comptes de copropriété, mais doit restituer le solde dans le délai de 2 mois et le reste maximum un mois après l'arrêté des comptes.

Ces délais courent à partir de la **remise des clés**, pas de la date d'état des lieux de sortie. Conservez la preuve de la remise (reçu signé par le bailleur ou son mandataire, ou envoi en LRAR si remise impossible). Sans preuve de remise, le délai ne démarre pas et le propriétaire peut prétendre que vous occupiez encore les lieux.`,
      },
      {
        heading: "Les intérêts de retard automatiques (10 % du loyer mensuel)",
        body: `Sanction prévue par l'article 22 de la loi de 1989 : passé le délai légal, le propriétaire vous doit **10 % du loyer mensuel hors charges par mois de retard entamé**, automatiquement et sans formalité.

Exemple concret : loyer hors charges 800 €. Restitution due 2 mois après la remise des clés. Le propriétaire restitue avec 3 mois de retard. Vous avez droit à 800 × 10 % × 3 = 240 € d'intérêts de retard, en plus du dépôt de garantie initial.

Cette pénalité s'applique **dès le premier jour de retard**, pas à compter d'une mise en demeure. Mais en pratique, sans mise en demeure formelle, le propriétaire ignore généralement cette pénalité — d'où l'importance de la lettre.

Attention : la pénalité ne s'applique pas si le retard est imputable au locataire (par exemple si vous n'avez pas communiqué votre nouvelle adresse au propriétaire). Communiquez toujours votre adresse de réexpédition par écrit le jour de la remise des clés, dans le procès-verbal d'état des lieux ou par LRAR.`,
      },
      {
        heading: "Que doit contenir votre mise en demeure",
        body: `Votre courrier doit être précis et chiffré pour avoir une force juridique opposable.

Mentionnez vos coordonnées complètes, l'adresse du logement loué, la référence du bail (date de signature, durée), la date de l'état des lieux de sortie et la date de remise des clés (preuve à l'appui si contestée).

Indiquez le montant du dépôt de garantie initial, les éventuelles retenues légitimes que vous acceptez (en vous basant sur l'état des lieux de sortie), et le solde dû. Ajoutez le calcul des intérêts de retard 10 % du loyer hors charges par mois entamé depuis la fin du délai légal.

Citez les textes : article 22 de la loi du 6 juillet 1989, et article 1342 du Code civil pour la mise en demeure de payer une dette.

Fixez un délai de paiement de 15 jours à compter de la réception. Annoncez les conséquences en cas de non-paiement : saisine du juge des contentieux de la protection (procédure simplifiée jusqu'à 10 000 €), commandement de payer par commissaire de justice, et publication éventuelle de l'incident sur des plateformes spécialisées.

L'envoi se fait obligatoirement en lettre recommandée avec accusé de réception.`,
      },
      {
        heading: "Les recours si le propriétaire ne paie toujours pas",
        body: `Sans réponse au délai imparti, plusieurs voies sont ouvertes selon votre situation et le montant en jeu.

**Conciliation** (obligatoire pour les litiges inférieurs à 5 000 € depuis le décret n° 2019-1333) : saisir un conciliateur de justice via conciliateurs.fr. Gratuit, délai de traitement 1-3 mois. Le conciliateur écoute les deux parties et propose un accord. Sans accord, il délivre un constat d'échec qui ouvre la saisine judiciaire.

**Saisine du juge des contentieux de la protection** : compétent jusqu'à 10 000 €. Vous pouvez vous représenter seul (avocat non obligatoire) ou être assisté gratuitement par une association de consommateurs (CLCV, ADIL, AFOC). Procédure 4-8 mois, coût modeste.

**Tribunal judiciaire** au-delà de 10 000 € : avocat obligatoire en première instance, procédure 6-18 mois. À ce stade, c'est rare pour une caution standard sauf si le bail prévoit un dépôt de 2-3 mois de loyer pour un logement très onéreux.

**ADIL (Agence départementale d'information sur le logement)** : présente dans chaque département, gratuite, fournit conseil juridique et modèles de courriers spécialisés. Excellent réflexe avant d'engager toute procédure.

Si le propriétaire est en faillite ou insolvable, la dette devient compliquée à recouvrer. Vérifiez sur infogreffe.fr ou societe.com s'il s'agit d'une SCI ou d'un investisseur en société. En cas de personne physique, un commandement de payer par commissaire de justice peut être suivi d'une saisie sur salaire ou compte bancaire après jugement.`,
      },
    ],
    faq: [
      {
        q: "Sous quel délai le propriétaire doit-il rendre la caution ?",
        a: "1 mois si l'état des lieux de sortie est conforme à celui d'entrée, 2 mois s'il y a des différences (dégradations, retenues sur charges). Délai à compter de la remise des clés, pas de la signature de l'état des lieux. Pour les copropriétés, 20 % maximum peut être conservé jusqu'à l'arrêté annuel des comptes. Article 22 de la loi du 6 juillet 1989. Au-delà du délai, la pénalité de 10 % du loyer hors charges par mois entamé s'applique automatiquement.",
      },
      {
        q: "Le propriétaire peut-il garder la caution sans justification ?",
        a: "Non. Toute retenue sur le dépôt de garantie doit être justifiée par des pièces (devis de réparation, factures de remise en état, justificatifs d'impayés). Sans justificatif, le propriétaire doit restituer la totalité. Le devis ou la facture doit correspondre à des dégradations constatées dans l'état des lieux de sortie ET non présentes à l'état des lieux d'entrée — la vétusté normale ne justifie aucune retenue (article 7 d) de la loi de 1989). Si le propriétaire produit des justificatifs douteux (facture sans détail, devis non accepté), contestez-les point par point dans votre mise en demeure.",
      },
      {
        q: "Combien d'intérêts de retard puis-je réclamer ?",
        a: "10 % du loyer mensuel hors charges par mois de retard entamé, automatiquement, sans démarche préalable. Exemple : loyer 700 €, restitution due au 1er février, payée le 20 avril → 3 mois de retard entamés (février, mars, avril) → 700 × 10 % × 3 = 210 €. Cette pénalité s'ajoute au dépôt de garantie. Elle ne s'applique pas si le retard est imputable au locataire (adresse de réexpédition non communiquée par exemple). Article 22 alinéa 4 de la loi du 6 juillet 1989, modifié par la loi ALUR de 2014.",
      },
      {
        q: "Que faire si le propriétaire conteste l'état des lieux de sortie ?",
        a: "Si vous n'avez pas signé l'état des lieux de sortie ou s'il a été établi sans vous, demandez par LRAR un état des lieux contradictoire ou un constat d'huissier. Si l'état des lieux de sortie a été signé sous pression ou avec des réserves, mentionnez ces réserves dans votre mise en demeure. En cas de désaccord persistant, le juge tranche au vu des pièces (photos datées, témoignages, état des lieux d'entrée). Conseil : prenez systématiquement des photos datées de chaque pièce le jour de la sortie, et demandez à un proche d'être témoin de l'état des lieux.",
      },
      {
        q: "Que faire si le propriétaire est une SCI ou une société ?",
        a: "La procédure est la même mais la mise en demeure doit être adressée au siège social de la société (et non à l'adresse du propriétaire personne physique si différente). Identifiez la société via son numéro SIREN sur infogreffe.fr ou societe.com. Si la SCI est en liquidation, déclarez votre créance dans les 2 mois suivant la publication au BODACC. Si la société est en règlement amiable, contactez le mandataire judiciaire. Dans tous les cas, le dépôt de garantie est une dette personnelle de la société, pas du gérant — sauf en cas de faute de gestion caractérisée (article L.223-22 Code de commerce pour les SARL).",
      },
      {
        q: "L'agence immobilière peut-elle conserver mon dépôt ?",
        a: "Non. L'agence agit comme mandataire du propriétaire. Elle doit transférer le dépôt au propriétaire (ou le restituer au locataire selon le mandat). Si l'agence fait obstacle à la restitution, la responsabilité revient au propriétaire bailleur — c'est lui que vous devez mettre en demeure. Vous pouvez en parallèle alerter la chambre des huissiers ou la FNAIM si l'agence est adhérente. Pour les agences gérant un compte séquestre, demandez le relevé du compte avec dates de mouvement : c'est votre preuve que les fonds sont disponibles et indûment retenus.",
      },
    ],
  },

  // ─── Guide 7 : Réclamation vol annulé règlement 261/2004 ───
  {
    slug: "reclamation-vol-annule-reglement-261-2004",
    category: "consommation",
    title: "Vol annulé ou retardé : votre indemnisation jusqu'à 600 €",
    metaTitle: "Indemnisation vol annulé — Règlement européen 261/2004 (2026)",
    description:
      "Votre vol a été annulé ou retardé de plus de 3 heures ? Le règlement européen 261/2004 prévoit jusqu'à 600 € d'indemnité. Procédure, délais, modèle de lettre.",
    relatedLetterSlug: "reclamation-service-client",
    publishedAt: "2026-05-05",
    updatedAt: "2026-05-05",
    readingTime: "6 min",
    sections: [
      {
        heading: "Quand le règlement 261/2004 s'applique",
        body: `Le règlement européen n° 261/2004 protège les passagers aériens en cas d'annulation, de retard important ou de surréservation (refus d'embarquement). Il s'applique à tous les vols au départ d'un aéroport de l'Union européenne, et aux vols à l'arrivée dans l'UE opérés par une compagnie européenne.

Concrètement : un vol Paris-New York opéré par Air France entre dans le règlement (départ UE). Un vol New York-Paris opéré par Delta n'y entre pas (compagnie hors UE, vol vers l'UE — règle inversée). Un Paris-New York opéré par Delta entre dans le règlement (départ UE quelle que soit la compagnie).

Trois situations ouvrent droit à indemnisation :
- **Annulation du vol** sans information du passager au moins 14 jours avant la date prévue
- **Retard à l'arrivée de plus de 3 heures** (et non au départ)
- **Refus d'embarquement involontaire** (surbooking)

Le retard se mesure à l'arrivée en porte (pas l'atterrissage). Si vous arrivez 2h59 après l'heure prévue, vous n'avez droit à rien. À 3h00, vous avez droit à l'indemnisation forfaitaire pleine. C'est binaire.`,
      },
      {
        heading: "Le montant de votre indemnité",
        body: `L'indemnisation est forfaitaire et dépend de la distance du vol, calculée selon la méthode dite de la grande orthodromique entre les deux aéroports.

**250 €** : vol intra-européen ≤ 1 500 km (ex: Paris-Madrid, Paris-Berlin, Lyon-Rome).

**400 €** : vol intra-européen > 1 500 km (ex: Paris-Athènes, Paris-Helsinki) ou vol UE↔non-UE entre 1 500 et 3 500 km (ex: Paris-Tunis, Paris-Casablanca).

**600 €** : vol UE↔non-UE > 3 500 km (ex: Paris-New York, Paris-Pékin, Paris-Dubaï).

Pour les retards de 3h-4h sur les vols longs (3 500 km +), l'indemnité peut être réduite de 50 % à 300 € (article 7 §2). Au-delà de 4h, plein tarif.

L'indemnisation est due **par passager**, indépendamment du prix du billet payé. Une famille de 4 personnes sur un Paris-New York annulé peut prétendre à 4 × 600 = 2 400 €.

Cette indemnité s'ajoute au remboursement du billet ou au réacheminement (article 8) et à la prise en charge des repas et hébergement pendant l'attente (article 9). Ne confondez pas indemnité forfaitaire et remboursement.`,
      },
      {
        heading: "Les exceptions : circonstances extraordinaires",
        body: `La compagnie peut refuser l'indemnisation en invoquant des circonstances extraordinaires, mais celles-ci sont strictement encadrées par la jurisprudence.

**Sont des circonstances extraordinaires** : terrorisme, conditions météorologiques rendant le vol impossible (orages violents, neige bloquant la piste), grève du contrôle aérien (externe à la compagnie), instabilité politique, problème de sécurité avéré.

**Ne sont PAS des circonstances extraordinaires** (la jurisprudence est claire) : panne technique de l'avion (arrêt CJUE Wallentin-Hermann, 2008), grève du personnel propre à la compagnie (arrêt Krüsemann, 2018), retard en cascade dû à un vol précédent retardé, oiseau aspiré dans le réacteur si lié à un défaut de maintenance.

Si la compagnie invoque des circonstances extraordinaires, exigez par écrit la justification précise et conservez tous les documents (notamment les communications de la compagnie pendant l'événement). Une grève annoncée 7 jours à l'avance n'est plus considérée comme extraordinaire car la compagnie a le temps de réorganiser ses opérations.

Conseil pratique : avant d'envoyer votre réclamation, vérifiez le statut du vol sur Flightradar24 pour voir si les autres vols ont décollé normalement le même jour. Si oui, l'argument "météo" tombe.`,
      },
      {
        heading: "La procédure pour obtenir votre indemnité",
        body: `Étape 1 — Réclamation à la compagnie. Adressez votre demande directement à la compagnie aérienne par LRAR (ou via le formulaire en ligne dédié + email confirmation). Joignez : copie de la carte d'embarquement ou de la confirmation de réservation, justificatif de l'annulation/retard, calcul de l'indemnité due. Donnez un délai de 30 jours.

Étape 2 — Saisine de l'autorité de tutelle si refus. En France, c'est la **DGAC** (Direction générale de l'aviation civile) via passager.aviation.gouv.fr. Gratuit, traitement 2-4 mois. La DGAC peut exiger l'indemnisation et, en cas de manquement, sanctionner la compagnie. Pour les vols au départ d'un autre pays UE, saisissez l'autorité du pays concerné (la liste est sur le site de la Commission européenne).

Étape 3 — Saisine du juge si nécessaire. Compétence du juge des contentieux de la protection jusqu'à 10 000 € (vous pouvez vous représenter seul). La prescription est de **5 ans** en France pour ce type de créance (article L.110-4 du Code de commerce).

Alternative : les sites spécialisés (AirHelp, Flightright, RefundMyTicket) prennent 25-30 % d'indemnité comme commission. Utiles si vous voulez zéro effort, mais vous perdez ¼ de l'indemnité. Avec un courrier de mise en demeure et la DGAC, la procédure est gratuite et fonctionne dans 80 % des cas.

Conservez vos preuves jusqu'à obtention du paiement : carte d'embarquement, communications de la compagnie, photos de l'écran d'affichage à l'aéroport, témoignages d'autres passagers.`,
      },
    ],
    faq: [
      {
        q: "Combien de temps puis-je réclamer après le vol ?",
        a: "5 ans en France, à compter de la date prévue du vol (article L.110-4 du Code de commerce, applicable aux créances commerciales). Cette prescription est plus longue que ce que prétendent souvent les compagnies aériennes (qui parlent de 2 ans pour décourager les réclamations tardives). Plus vite vous agissez, plus vous avez de chances d'obtenir gain de cause : les preuves (cartes d'embarquement, communications) sont plus accessibles dans les premiers mois. En pratique, agissez dans les 6 mois pour maximiser vos chances.",
      },
      {
        q: "La compagnie m'a proposé un bon d'achat, dois-je accepter ?",
        a: "Non, sauf si le bon d'achat est explicitement présenté en plus de l'indemnité forfaitaire. Le règlement 261/2004 prévoit une indemnité en numéraire (article 7 §3) : la compagnie ne peut pas vous imposer un avoir à la place. Si on vous propose un bon de 250-600 €, demandez par écrit si c'est en remplacement de l'indemnité forfaitaire — si oui, refusez et exigez le paiement en argent. Si la compagnie persiste, saisissez la DGAC qui rappellera à l'ordre. Acceptez les bons d'achat uniquement s'ils sont en plus de l'indemnité, en compensation des désagréments supplémentaires.",
      },
      {
        q: "Mon vol était en correspondance, suis-je couvert ?",
        a: "Oui, à condition que les deux vols aient été achetés dans une seule réservation (même billet). Si vol Paris-Doha-Singapour acheté en un seul billet, et que vous arrivez à Singapour avec 4h de retard à cause d'une annulation à Doha, l'indemnité s'applique sur la distance totale Paris-Singapour (donc 600 €). Si les vols sont achetés séparément (billet 1 Paris-Doha + billet 2 Doha-Singapour), chaque vol est traité indépendamment et seul le tronçon UE est couvert. Achetez toujours les correspondances en un seul billet pour bénéficier de la couverture complète.",
      },
      {
        q: "Que faire si la compagnie me dit que c'est de la météo ?",
        a: "Vérifiez d'abord sur Flightradar24 ou FlightStats si d'autres vols ont décollé normalement le même jour à la même heure. Si oui, l'argument météo tombe. Demandez ensuite à la compagnie une justification écrite précise (type d'événement météo, période exacte, mesures prises). Sans justification documentée, refusez. Saisissez la DGAC qui dispose des historiques météo officiels. La jurisprudence retient que seules les conditions météo rendant le vol impossible (et non simplement gênant) constituent des circonstances extraordinaires. Un orage de 30 minutes qui retarde un vol de 4h ne suffit pas si les autres avions ont décollé.",
      },
      {
        q: "Puis-je cumuler indemnité et remboursement du billet ?",
        a: "Oui pour une annulation. L'indemnité forfaitaire (250/400/600 €) est indépendante du remboursement du billet (article 8) ou du réacheminement. Si votre vol est annulé, vous avez droit au remboursement intégral du billet OU au réacheminement vers la destination (article 8 §1) ET à l'indemnité forfaitaire (article 7) ET à la prise en charge des repas et hébergement pendant l'attente (article 9). Trois compensations cumulatives. Pour un retard simple, seules l'indemnité et la prise en charge s'appliquent (vous arrivez quand même à destination).",
      },
      {
        q: "Et pour les bagages perdus ou endommagés ?",
        a: "Le règlement 261/2004 ne couvre pas les bagages. C'est la Convention de Montréal de 1999 qui s'applique : indemnisation jusqu'à environ 1 600 € par passager (1 288 droits de tirage spéciaux DTS, valeur révisée tous les 5 ans). Délais : déclaration immédiate à l'arrivée auprès du comptoir bagages de la compagnie (PIR, Property Irregularity Report) ; réclamation écrite dans les 7 jours pour bagages endommagés, 21 jours pour bagages retardés ou perdus. Conservez le PIR, les billets et les justificatifs des achats de remplacement. Sans PIR fait sur place, l'indemnisation est presque impossible à obtenir.",
      },
    ],
  },

  // ─── Guide 8 : Résiliation bail locataire zone tendue ───
  {
    slug: "resilier-bail-locataire-zone-tendue",
    category: "logement-bail",
    title: "Résilier son bail en zone tendue : préavis 1 mois",
    metaTitle: "Résiliation bail zone tendue — Préavis 1 mois locataire (2026)",
    description:
      "En zone tendue, le préavis du locataire est réduit à 1 mois. Liste des communes concernées, motifs, procédure, modèle de lettre LRAR.",
    relatedLetterSlug: "resiliation-bail",
    publishedAt: "2026-05-05",
    updatedAt: "2026-05-05",
    readingTime: "5 min",
    sections: [
      {
        heading: "Qu'est-ce qu'une « zone tendue » et pourquoi ça change tout",
        body: `La zone tendue est un statut réglementaire défini par le décret n° 2013-392 du 10 mai 2013, modifié plusieurs fois depuis. Elle vise les communes où la demande de logement est largement supérieure à l'offre, créant des tensions sur les loyers et la disponibilité.

Conséquence pratique pour le locataire : en zone tendue, le préavis de départ est réduit de 3 mois (régime classique) à **1 mois** (article 15-I de la loi du 6 juillet 1989), sans avoir à justifier d'un motif particulier. C'est un droit automatique pour tout locataire d'un logement vide situé dans une commune classée.

Pour les locations meublées, le préavis est de 1 mois en zone tendue ET hors zone tendue — la zone tendue n'a pas d'effet supplémentaire.

Pour les locations vides, l'écart est massif : avec un préavis de 3 mois sur un loyer de 1 000 €, vous payez 3 000 € pour un logement que vous quittez. Avec 1 mois, c'est 1 000 €. Économie typique de 2 000 € pour un déménagement.

La zone tendue concerne aujourd'hui 28 agglomérations principales de plus de 50 000 habitants : Paris et toute l'Île-de-France, Lyon, Marseille, Toulouse, Bordeaux, Lille, Nice, Strasbourg, Nantes, Rennes, Montpellier, Grenoble, Annecy, Toulon, Aix-en-Provence, etc. La liste exacte est consultable sur service-public.fr et change avec les décrets de révision.`,
      },
      {
        heading: "Comment vérifier que votre logement est en zone tendue",
        body: `La vérification se fait commune par commune. Le simulateur officiel est sur service-public.fr (« Mon logement est-il situé en zone tendue ? »). Vous saisissez le code postal et la commune, et le résultat est immédiat et opposable.

Attention : la zone tendue se mesure au niveau de la commune, pas du quartier ou de l'arrondissement. Tout Paris est en zone tendue, mais Marne-la-Vallée peut l'être ou pas selon les communes membres. Vérifiez précisément la commune où se situe le logement loué.

Si la commune est classée, joignez la copie d'écran du simulateur service-public.fr à votre courrier de résiliation comme preuve. Le propriétaire ne peut pas contester la qualification, c'est un statut légal et public.

Si la commune n'est pas classée mais que vous remplissez l'un des motifs de réduction de préavis (mutation professionnelle à plus de 70 km, perte d'emploi, premier emploi, attribution de logement social, état de santé justifiant un changement de logement), le préavis tombe aussi à 1 mois, mais sur justificatif (article 15-I de la loi de 1989).`,
      },
      {
        heading: "Le contenu et l'envoi de votre lettre de résiliation",
        body: `Votre lettre doit clairement énoncer votre intention de résilier, mentionner explicitement la zone tendue comme fondement du préavis 1 mois, et identifier la date de prise d'effet.

Coordonnées complètes (vous et le bailleur ou son mandataire), adresse précise du logement loué, références du bail (date de signature, durée), et date de remise prévue des clés.

Phrase clé à inclure : « Je vous informe de mon intention de résilier le bail signé le [date] pour le logement situé [adresse]. Conformément à l'article 15-I de la loi du 6 juillet 1989, le préavis applicable est réduit à 1 mois, ce logement étant situé dans la commune de [nom], classée en zone tendue par le décret n° 2013-392 du 10 mai 2013 modifié. La résiliation prendra effet le [date de réception + 1 mois]. »

Joignez la capture d'écran du simulateur service-public.fr en pièce jointe. C'est facultatif mais ça évite toute discussion.

Envoi obligatoirement en lettre recommandée avec accusé de réception OU remise en main propre contre récépissé daté et signé par le bailleur. L'envoi par email simple ou SMS n'est pas valide juridiquement (sauf clause contraire au bail, rare).

Le préavis court à partir de la réception du courrier par le bailleur (date de l'AR signé). Pas de la date d'envoi. Si l'AR met 5 jours à être réceptionné, vous avez 5 jours de préavis en plus à payer.`,
      },
      {
        heading: "Les pièges fréquents et leurs solutions",
        body: `**Le bailleur conteste la zone tendue.** Sans fondement : la qualification est légale et opposable. Renvoyez la capture du simulateur officiel et rappelez l'article 15-I de la loi de 1989. En cas de blocage, saisissez l'ADIL de votre département (gratuit) qui contactera le bailleur pour rappeler la règle.

**Le bailleur exige le paiement de 3 mois.** Refusez et payez uniquement le mois de préavis dû. Si le bailleur retient sur le dépôt de garantie les 2 mois de loyer supplémentaires qu'il prétendait dus, c'est une retenue abusive. Mettez en demeure pour restitution intégrale du dépôt + 10 % de pénalité par mois de retard (article 22 de la loi de 1989).

**Le bailleur refuse de faire l'état des lieux dans le délai du préavis.** L'état des lieux doit avoir lieu le jour de la remise des clés, au plus tard. Si le bailleur tarde, fixez un rendez-vous par LRAR ou faites établir un état des lieux par huissier (200-400 €, refacturable au bailleur si retenue contestée). À défaut d'état des lieux contradictoire, le logement est présumé restitué en bon état.

**Vous voulez partir avant la fin du préavis.** Possible si vous trouvez un nouveau locataire que le bailleur accepte (la « convention de cession de bail »), ou si vous payez le solde du préavis tout en remettant les clés plus tôt. Le bailleur ne peut pas vous obliger à occuper le logement pendant le préavis.

**Le bail prévoit un préavis de 3 mois en zone tendue.** Cette clause est nulle (article 4 de la loi de 1989) : aucune clause du bail ne peut déroger aux règles légales protectrices du locataire. Ignorez la clause et invoquez la loi.`,
      },
    ],
    faq: [
      {
        q: "Comment savoir si ma commune est en zone tendue ?",
        a: "Utilisez le simulateur officiel sur service-public.fr (« Mon logement est-il situé en zone tendue ? »). Saisissez le code postal et la commune, le résultat est immédiat. La liste actuelle couvre 28 agglomérations principales : Paris et l'Île-de-France entière, Lyon, Marseille, Toulouse, Bordeaux, Lille, Nice, Strasbourg, Nantes, Rennes, Montpellier, Grenoble, Annecy, Toulon, Aix-en-Provence et leurs communes périphériques. La qualification est commune par commune (pas quartier par quartier), et elle évolue avec les décrets de révision. Imprimez ou capturez la page de résultat comme preuve à joindre à votre lettre.",
      },
      {
        q: "Le préavis 1 mois est-il automatique ou faut-il un motif ?",
        a: "Automatique en zone tendue. Vous n'avez aucun motif à fournir, contrairement aux cas hors zone tendue qui exigent un justificatif (mutation, perte d'emploi, état de santé, etc.). Le simple fait que la commune soit classée suffit. Indiquez-le clairement dans votre lettre en citant l'article 15-I de la loi du 6 juillet 1989 et le décret n° 2013-392 du 10 mai 2013 modifié. Si le bail prévoit un préavis plus long (3 mois par exemple), cette clause est nulle et inopposable — la loi prévaut.",
      },
      {
        q: "À partir de quand court le délai de préavis ?",
        a: "À partir de la réception du courrier par le bailleur, pas de l'envoi. Pour un envoi en LRAR, c'est la date de l'accusé de réception signé qui fait foi. Si vous remettez le courrier en main propre contre récépissé, c'est la date du récépissé. Si vous envoyez en LRAR un lundi mais que le bailleur signe l'AR le vendredi suivant, le préavis démarre le vendredi. Conséquence : vous payez 5 jours de loyer supplémentaires. Pour minimiser ce risque, envoyez tôt dans la semaine et au début du mois si possible.",
      },
      {
        q: "Puis-je partir avant la fin du préavis ?",
        a: "Oui, mais vous devez payer le solde du préavis sauf accord du bailleur ou présentation d'un nouveau locataire qu'il accepte. Concrètement, vous pouvez remettre les clés à tout moment pendant le préavis sans avancer la fin du paiement. Si vous trouvez un remplaçant, demandez au bailleur de signer une « convention de cession de bail » qui transfère la location et libère votre engagement. Le bailleur n'est pas obligé d'accepter mais c'est dans son intérêt (pas d'interruption de loyer). Sans accord, vous payez jusqu'à la fin du préavis.",
      },
      {
        q: "Que faire si le bailleur prétend que mon logement n'est pas en zone tendue ?",
        a: "Imprimez la page du simulateur officiel service-public.fr montrant le statut « zone tendue » de votre commune. Renvoyez par LRAR au bailleur en citant l'article 15-I de la loi du 6 juillet 1989 et le décret n° 2013-392 du 10 mai 2013. Si le bailleur persiste, saisissez gratuitement l'ADIL (Agence départementale d'information sur le logement) de votre département. L'ADIL est neutre, gratuite, et son intervention suffit dans 90 % des cas à régler le différend. En dernier recours, le juge des contentieux de la protection (gratuit pour les litiges < 5 000 €) tranchera.",
      },
      {
        q: "Le préavis 1 mois s'applique-t-il aussi en location meublée ?",
        a: "Le préavis de 1 mois s'applique aux locations meublées partout en France, zone tendue ou pas (article 25-8 de la loi de 1989, régime spécifique aux meublés). La zone tendue n'apporte donc aucun avantage supplémentaire en meublé. Le préavis 3 mois ne concerne que les locations vides hors zone tendue. Pour les meublés étudiants (baux de 9 mois non reconductibles), il n'y a pas de préavis : le bail prend fin automatiquement à l'échéance prévue. Vérifiez bien la nature de votre contrat (vide, meublé, meublé étudiant) avant de calculer votre préavis.",
      },
    ],
  },

  // ─── Guide 9 : Mise en demeure livraison non effectuée e-commerce ───
  {
    slug: "mise-en-demeure-livraison-non-effectuee-ecommerce",
    category: "consommation",
    title: "Commande non livrée : mise en demeure du vendeur",
    metaTitle: "Livraison non effectuée — Mise en demeure et remboursement (2026)",
    description:
      "Votre commande n'a pas été livrée dans les délais ? Article L.216-1 du Code de la consommation, mise en demeure, remboursement, recours.",
    relatedLetterSlug: "mise-en-demeure-executer",
    publishedAt: "2026-05-05",
    updatedAt: "2026-05-05",
    readingTime: "5 min",
    sections: [
      {
        heading: "Vos droits en cas de retard de livraison",
        body: `L'article L.216-1 du Code de la consommation impose au vendeur professionnel de livrer le bien dans le délai indiqué, et à défaut de mention, dans un délai maximum de 30 jours après la conclusion du contrat.

Si le vendeur n'a pas livré dans le délai annoncé, vous avez le droit de :
- **Lui enjoindre de livrer dans un délai supplémentaire raisonnable** (généralement 15 jours)
- **Si la livraison n'intervient pas dans ce nouveau délai, résilier le contrat unilatéralement** par lettre recommandée (article L.216-2)
- **Exiger le remboursement intégral des sommes versées** (article L.216-3) sous 14 jours à compter de la dénonciation, avec **intérêts de retard automatiques** au taux légal majoré au-delà.

Important : la résiliation est de droit, sans intervention du juge. Le vendeur ne peut pas s'y opposer si la procédure est correctement suivie (mise en demeure préalable + délai supplémentaire respecté).

Cas particulier : si vous avez précisé que la date de livraison était une condition essentielle (cadeau anniversaire, robe de mariée, événement précis), la résiliation peut être demandée immédiatement sans mise en demeure préalable (article L.216-2 §2). Conservez une preuve écrite de cette mention au moment de la commande.`,
      },
      {
        heading: "La mise en demeure : étape clé",
        body: `Pour activer vos droits, vous devez d'abord mettre le vendeur en demeure de livrer dans un délai supplémentaire raisonnable. Sans cette étape formelle, la résiliation unilatérale n'est pas valable.

Votre courrier doit contenir :
- L'identification de la commande (numéro, date, montant total payé)
- Le rappel du délai de livraison initial annoncé et de son dépassement
- L'enjonction explicite de livrer dans un nouveau délai (8 à 15 jours selon la nature du bien — 15 jours pour un meuble, 8 jours pour un bien standard)
- La mention que, à défaut, vous résilierez le contrat et exigerez le remboursement intégral
- La date butoir précise (« avant le [date] inclus »)
- La référence aux articles L.216-1 à L.216-3 du Code de la consommation

L'envoi se fait obligatoirement en lettre recommandée avec accusé de réception. Un email peut être valide si le vendeur l'a expressément accepté comme moyen de communication formel (rare en pratique).

Conseil pratique : envoyez aussi une copie au service client par email pour accélérer une éventuelle réponse, mais l'envoi LRAR reste seul opposable juridiquement.

Si la commande a été passée via une plateforme (Amazon, Cdiscount, FNAC marketplace), envoyez la mise en demeure au **vendeur direct** (lisible sur la facture), pas à la plateforme. La plateforme est intermédiaire, pas vendeur, sauf en marketplace gérée intégralement par elle.`,
      },
      {
        heading: "Si le vendeur ne répond pas : la résiliation unilatérale",
        body: `Sans livraison ni réponse à la fin du délai supplémentaire, envoyez une seconde lettre LRAR notifiant la résiliation du contrat et l'exigence de remboursement.

Le vendeur dispose alors de **14 jours** à compter de la réception de cette dénonciation pour rembourser intégralement (article L.216-3). Au-delà, des intérêts de retard sont dus au taux légal majoré : taux légal × 1,5 entre J+1 et J+10, taux légal × 2 entre J+11 et J+30, taux légal × 5 au-delà de J+30 (article L.216-3 alinéa 3).

Le remboursement doit se faire par le **même moyen de paiement** que l'achat initial (carte bancaire si vous avez payé par carte, virement si virement, etc.), sauf accord contraire. Le vendeur ne peut pas vous imposer un avoir à la place du remboursement en numéraire.

Si vous avez payé par carte bancaire, en parallèle de la procédure, demandez à votre banque une **rétrofacturation** (chargeback). C'est un droit prévu par les contrats Visa et Mastercard. Délai pour réclamer : généralement 120 jours après la date de transaction. La banque enquête, et si la livraison n'a effectivement pas eu lieu, elle vous rembourse en débitant le commerçant.

Si le vendeur conteste la résiliation et refuse de rembourser, saisissez le tribunal compétent (juge des contentieux de la protection jusqu'à 10 000 €, gratuit, sans avocat obligatoire).`,
      },
      {
        heading: "Les autres recours et alternatives",
        body: `**Médiateur de la consommation.** Tout vendeur professionnel doit adhérer à un médiateur de consommation et indiquer ses coordonnées dans ses CGV. La saisine est gratuite, en ligne, et le médiateur rend un avis dans 90 jours. Cet avis n'est pas contraignant mais suivi dans 80 % des cas. Avant de saisir le médiateur, vous devez avoir tenté de régler le litige directement avec le vendeur (votre LRAR fait office de tentative).

**SignalConso (DGCCRF).** Plateforme officielle pour signaler une pratique commerciale problématique. Pas un service de recouvrement individuel mais utile pour alerter l'administration et déclencher une éventuelle enquête. Plus le commerçant cumule de signalements, plus il a de chances d'être sanctionné. URL : signal.conso.gouv.fr.

**Centre européen des consommateurs France (CEC).** Si le vendeur est basé dans un autre pays de l'UE (achat sur un site allemand, italien, etc.), le CEC France vous accompagne gratuitement et peut intervenir avec son homologue dans le pays du vendeur. URL : europe-consommateurs.eu/fr.

**Tribunal compétent.** Pour les litiges < 5 000 €, conciliation préalable obligatoire (gratuite, conciliateur de justice). Au-delà, juge des contentieux de la protection (jusqu'à 10 000 €) ou tribunal judiciaire (au-delà).

**Pour les achats sur AliExpress, Amazon Marketplace, Etsy, etc.** : utilisez d'abord la procédure de protection acheteur de la plateforme (souvent efficace pour les petits montants). En parallèle, gardez la mise en demeure et la procédure légale en réserve si la plateforme rejette votre demande.`,
      },
    ],
    faq: [
      {
        q: "Quel est le délai légal de livraison en e-commerce ?",
        a: "Le délai annoncé sur le site lors de la commande, ou à défaut, 30 jours maximum à compter de la conclusion du contrat (article L.216-1 du Code de la consommation). Si le vendeur indique « livraison sous 5 jours », c'est ce délai qui s'applique. S'il n'indique aucun délai précis (« sous quelques semaines »), c'est 30 jours par défaut. Pour les commandes en pré-commande ou sur stock fournisseur, le délai annoncé peut être plus long mais doit être explicite et accepté avant la commande.",
      },
      {
        q: "Combien de temps attendre avant d'envoyer une mise en demeure ?",
        a: "Dès le lendemain du dépassement du délai de livraison annoncé. Vous pouvez envoyer la mise en demeure tout de suite, ou laisser quelques jours (3-7 jours) au vendeur pour s'expliquer après une relance amiable. Au-delà de 15 jours de retard, n'attendez plus : envoyez la mise en demeure formelle avec délai supplémentaire de 8-15 jours. Plus vous laissez traîner, plus le vendeur peut prétendre que vous avez tacitement accepté le retard.",
      },
      {
        q: "Puis-je obtenir un remboursement même si le bien arrive plus tard ?",
        a: "Oui, à condition de l'avoir formellement annoncé dans votre mise en demeure et que le délai supplémentaire que vous avez fixé soit dépassé sans livraison. Si le bien arrive après votre dénonciation de résiliation, vous pouvez le refuser à la livraison (refus de prendre possession du colis) et exiger le remboursement intégral plus les frais éventuels. Si vous l'acceptez par mégarde, vous risquez de perdre votre droit de résilier — d'où l'importance de surveiller les livraisons après la dénonciation.",
      },
      {
        q: "Le vendeur peut-il imposer un avoir à la place du remboursement ?",
        a: "Non. L'article L.216-3 impose un remboursement par le même moyen de paiement que l'achat initial. Le vendeur ne peut pas vous imposer un avoir, un bon d'achat ou une carte cadeau. Vous pouvez accepter un avoir si cela vous arrange, mais c'est votre choix. En cas de tentative d'imposition, refusez par écrit et exigez le remboursement en numéraire. Si le vendeur persiste, saisissez le médiateur ou directement le juge — c'est une infraction au Code de la consommation passible d'amende administrative.",
      },
      {
        q: "Que faire si le vendeur est à l'étranger (UE ou hors UE) ?",
        a: "Pour un vendeur dans l'UE, contactez gratuitement le Centre européen des consommateurs France (europe-consommateurs.eu/fr). Le CEC traite avec son homologue dans le pays du vendeur et obtient souvent une résolution amiable. Pour un vendeur hors UE (Chine, États-Unis, etc.), les recours juridiques sont compliqués : privilégiez la rétrofacturation auprès de votre banque (carte bancaire) ou la procédure de protection acheteur de la plateforme (PayPal, AliExpress, Amazon). Pour les achats > 100 €, vérifiez avant la commande si le vendeur a une représentation en Europe — sinon, considérez le risque comme élevé.",
      },
      {
        q: "Et si la commande arrive endommagée ou non conforme ?",
        a: "C'est un cas différent du retard de livraison. Vous bénéficiez de la garantie légale de conformité (article L.217-3 du Code de la consommation) : 2 ans à compter de la réception. Vous pouvez exiger la réparation, le remplacement, ou en cas d'impossibilité, le remboursement intégral. Refusez la livraison si possible ou émettez des réserves écrites détaillées sur le bordereau de livraison (auprès du transporteur). Photographiez le colis et le contenu dès l'ouverture. Envoyez une mise en demeure dans les 15 jours en exigeant la solution choisie. La charge de la preuve incombe au vendeur les 24 premiers mois (présomption d'antériorité du défaut).",
      },
    ],
  },

  // ─── Guide 10 : Contestation décision CAF ───
  {
    slug: "contestation-decision-caf",
    category: "administrations",
    title: "Contester une décision CAF : RAPO et délais",
    metaTitle: "Contester décision CAF — Recours amiable obligatoire (2026)",
    description:
      "Refus d'aide, indu CAF, prime d'activité contestée ? Procédure du recours administratif préalable obligatoire (RAPO), délais, modèle de lettre.",
    relatedLetterSlug: "contestation-decision",
    publishedAt: "2026-05-05",
    updatedAt: "2026-05-05",
    readingTime: "6 min",
    sections: [
      {
        heading: "Quels types de décisions CAF peut-on contester",
        body: `La Caisse d'allocations familiales (CAF) prend chaque jour des milliers de décisions concernant les prestations sociales : RSA, prime d'activité, APL/ALF/ALS, allocations familiales, complément familial, prestation d'accueil du jeune enfant (PAJE), allocation de soutien familial (ASF), etc.

Toute décision défavorable peut être contestée :
- **Refus d'attribution** d'une aide demandée
- **Réduction du montant** par rapport à votre droit calculé
- **Suspension** ou interruption d'une aide en cours
- **Demande de remboursement d'indu** (somme jugée trop perçue)
- **Sanction** pour fraude ou fausse déclaration
- **Calcul de quotient familial** ou ressources contesté

La CAF est tenue de motiver sa décision par écrit (article L.211-2 du Code des relations entre le public et l'administration). Si vous recevez une notification sans explication ou avec une motivation vague (« vos ressources dépassent le plafond »), exigez la motivation détaillée. C'est un droit.

Conservez systématiquement toutes les notifications CAF, courriers, captures d'écran de votre espace personnel caf.fr. Ces pièces sont la base de votre dossier de contestation.`,
      },
      {
        heading: "Le RAPO : recours préalable obligatoire",
        body: `Avant de saisir le juge, vous devez impérativement passer par le **Recours Administratif Préalable Obligatoire** (RAPO) auprès de la CAF. C'est obligatoire pour toutes les décisions CAF (article L.142-4 du Code de la sécurité sociale).

**Délai pour exercer le RAPO** : **2 mois** à compter de la notification de la décision contestée. Au-delà, la décision devient définitive et vous perdez tout recours. Le délai court à compter de la date de réception affichée sur la lettre, pas de sa date d'envoi.

**Forme** : lettre recommandée avec accusé de réception adressée au directeur de la CAF de votre département (l'adresse figure sur la décision contestée). Vous pouvez aussi déposer le recours via votre espace personnel caf.fr (rubrique « Mes démarches » → « Contester une décision »), mais le LRAR reste recommandé pour preuve.

**Contenu** :
- Vos coordonnées (nom, prénom, numéro allocataire à 7 chiffres)
- Référence de la décision contestée (date, type de prestation, numéro de dossier si fourni)
- Motifs de contestation détaillés et chiffrés (« vous avez retenu un revenu de X €, alors que mon avis fiscal montre Y €, soit une différence de Z € qui me fait basculer en dessous du plafond »)
- Pièces justificatives (avis d'imposition, fiches de paie, certificats médicaux, contrat de bail, etc.)
- Demande explicite (révision de la décision, paiement de l'indu inversé, restitution des sommes prélevées)

La CAF a **2 mois pour répondre** au RAPO (article L.142-4-1). Sans réponse à 2 mois, c'est un rejet implicite — vous pouvez alors saisir le juge.`,
      },
      {
        heading: "Cas spécifique : la contestation d'indu",
        body: `Un indu CAF est une somme que la CAF estime vous avoir versée à tort et qu'elle réclame en remboursement. Les indus sont fréquents : changement de situation non déclaré, erreur de saisie, recalcul rétroactif après réception de l'avis fiscal de l'année précédente.

**La contestation suspend-elle le recouvrement ?** Non, par principe. La CAF peut commencer à prélever sur vos prestations en cours dès la notification de l'indu, même si vous contestez. Pour suspendre le recouvrement, vous devez **expressément demander le sursis à exécution** dans votre RAPO et apporter des éléments crédibles de bonne foi.

**Pouvez-vous demander la remise ou la réduction de l'indu ?** Oui, en plus de la contestation au fond. Si l'indu est vraiment dû mais que vous êtes en situation financière difficile, demandez une **remise gracieuse** (totale) ou une **réduction** (partielle). La CAF examine au cas par cas selon vos ressources et charges. Joignez votre avis d'imposition, vos quittances de loyer, vos factures fixes.

**Plan d'apurement** : si la dette est due et que vous ne pouvez pas la rembourser en une fois, demandez un échéancier de paiement (24 mois maximum en règle générale, jusqu'à 60 mois en cas de difficultés graves). La demande se fait en parallèle du RAPO ou indépendamment.

**Indu et fraude** : si la CAF qualifie l'indu de fraude (déclaration incomplète volontaire), des pénalités s'ajoutent (article L.114-17 du Code de la sécurité sociale) et le recouvrement peut aller jusqu'au pénal. Contestez fermement la qualification de fraude si l'erreur est de bonne foi (oubli, malentendu, complexité administrative).`,
      },
      {
        heading: "Si le RAPO échoue : saisir le juge",
        body: `Si la CAF rejette votre RAPO (rejet explicite ou rejet implicite à 2 mois sans réponse), vous pouvez saisir le **pôle social du tribunal judiciaire** dans les **2 mois** suivant la notification du rejet (ou la fin du délai de réponse si rejet implicite).

**Procédure** : gratuite, sans avocat obligatoire. Vous remplissez un formulaire CERFA (n° 16001) ou rédigez librement votre requête. La saisine peut se faire par courrier au greffe du tribunal compétent (votre département de résidence) ou en ligne.

**Pièces à joindre** : copie de la décision CAF contestée, copie du RAPO, copie de la réponse CAF (ou preuve d'absence de réponse), tous les justificatifs au fond.

**Délai d'audience** : 6 à 12 mois en moyenne. Vous pouvez être assisté gratuitement par un défenseur des droits, une association de défense des allocataires (AC ! Agir contre le chômage, ATD Quart Monde, Secours Catholique), ou un avocat (aide juridictionnelle possible selon ressources).

**Décision du juge** : confirme ou annule la décision CAF. Si annulation, la CAF doit recalculer et vous verser les sommes dues, voire les intérêts de retard. Vous pouvez aussi demander des dommages-intérêts si la décision a causé un préjudice (impayés de loyer entraînant procédure d'expulsion par exemple).

**Appel** : possible dans le mois suivant la décision du tribunal. La cour d'appel statue en dernier ressort sur le fond. Pour les questions de pur droit, un pourvoi en cassation reste possible.

**Médiateur de la CAF** : alternative au juge dans certains cas. Chaque CAF dispose d'un médiateur saisissable gratuitement quand le RAPO a échoué et avant le tribunal. Ses avis ne sont pas contraignants mais souvent suivis. Démarche utile pour les litiges modestes ou les situations humainement complexes.`,
      },
    ],
    faq: [
      {
        q: "Quel est le délai pour contester une décision CAF ?",
        a: "2 mois à compter de la notification de la décision (article L.142-4 du Code de la sécurité sociale). Le délai court à partir de la date de réception du courrier, pas de son envoi. Au-delà, la décision devient définitive et le recours est irrecevable. Pour les notifications par voie électronique sur caf.fr, le délai démarre à la date de mise à disposition du document dans votre espace personnel. Conservez l'enveloppe ou la capture d'écran de la notification — la date est essentielle pour calculer le délai. Si vous êtes hospitalisé ou empêché de recevoir le courrier, le délai peut être prolongé sur preuve.",
      },
      {
        q: "Le RAPO est-il vraiment obligatoire ?",
        a: "Oui, pour toute contestation d'une décision CAF. Si vous saisissez directement le juge sans avoir fait de RAPO préalable, votre requête sera déclarée irrecevable. Le RAPO est une étape de filtrage qui permet à la CAF de revoir sa position avant un contentieux. Statistiquement, environ 40 % des RAPO aboutissent à une révision favorable, ce qui évite le recours au juge. Faites-le sérieusement avec tous les arguments et pièces — c'est souvent le seul tour pour résoudre votre litige rapidement et gratuitement.",
      },
      {
        q: "La CAF peut-elle continuer à me prélever pendant la contestation ?",
        a: "Oui, par défaut. Le RAPO ne suspend pas automatiquement le recouvrement de l'indu. Pour obtenir un sursis, demandez explicitement le « sursis à exécution » dans votre lettre de RAPO en exposant des arguments de fond crédibles (la CAF ne l'accorde que si vos arguments paraissent sérieux et que le préjudice du recouvrement immédiat serait disproportionné). En cas de refus de sursis, vous pouvez demander un échéancier de paiement parallèlement à la contestation au fond, pour étaler la dette sur 24-60 mois. Conservez vos prestations courantes en parallèle.",
      },
      {
        q: "Que faire si la CAF ne répond pas à mon RAPO ?",
        a: "L'absence de réponse à 2 mois vaut rejet implicite (article L.142-4-1 du Code de la sécurité sociale). Vous pouvez alors saisir le pôle social du tribunal judiciaire dans les 2 mois suivants. Comptez le délai à partir du jour suivant l'expiration des 2 mois de la CAF. Conservez votre AR du RAPO comme preuve de la date de saisine. La CAF peut vous répondre tardivement entre-temps : si la réponse est défavorable, le délai pour saisir le juge repart à compter de la nouvelle notification (et non du rejet implicite antérieur). En cas de doute sur le délai, saisissez le juge dès la fin du délai de 2 mois pour ne pas être hors délai.",
      },
      {
        q: "Comment demander une remise gracieuse d'indu ?",
        a: "La remise gracieuse (totale ou partielle) est différente de la contestation au fond. Vous reconnaissez devoir l'indu mais demandez à la CAF de l'effacer ou de le réduire en raison de votre situation financière. Argumentez avec : avis d'imposition, quittances de loyer, charges fixes, situation familiale (enfants à charge, parent isolé, etc.). La CAF examine au cas par cas. Critères favorables : revenus très modestes, dettes par ailleurs, événement familial difficile (séparation, décès), erreur initiale partagée avec la CAF (mauvaise information donnée par un agent par exemple). Les remises gracieuses sont accordées dans environ 25 % des demandes correctement étayées.",
      },
      {
        q: "Puis-je me faire aider gratuitement pour contester ?",
        a: "Oui, plusieurs options gratuites. **Le défenseur des droits** (defenseurdesdroits.fr) traite les litiges avec les administrations dont la CAF — saisine en ligne, pas de RAPO préalable nécessaire pour le défenseur des droits. **Les associations de lutte contre la précarité** (Secours Catholique, ATD Quart Monde, Restos du Cœur) ont souvent des juristes bénévoles. **Les permanences juridiques gratuites** en mairie ou maison de justice et du droit (MJD) — informations en mairie. **L'aide juridictionnelle** pour saisir le juge, si vos ressources sont inférieures aux plafonds (environ 1 200 €/mois pour une personne seule). Demande à faire au tribunal judiciaire avec le formulaire CERFA n° 16146.",
      },
    ],
  },

  // ─── Guide 11 : Contester un PV de stationnement ───
  {
    slug: "contester-pv-stationnement",
    category: "administrations",
    title: "Contester un PV de stationnement : procédure complète",
    metaTitle: "Contester un PV de stationnement — Procédure et lettre type",
    description:
      "Délai 45 jours, OMP, FPS, CCSP : procédure complète pour contester un PV de stationnement. Motifs valables, lettre recommandée, recours.",
    relatedLetterSlug: "contestation-amende",
    publishedAt: "2026-05-15",
    updatedAt: "2026-05-15",
    readingTime: "6 min",
    sections: [
      {
        heading: "PV classique ou FPS : deux régimes différents",
        body: `Avant de contester, identifiez le type d'amende reçue. Depuis la dépénalisation du stationnement payant en 2018, deux régimes coexistent et leurs procédures de contestation sont radicalement différentes.

**Le PV classique** (amende forfaitaire, 35 €) concerne les infractions au stationnement gênant, dangereux, abusif ou interdit (zone bleue, livraison, handicapé, trottoir, passage piéton). Il relève du Code de la route et se conteste auprès de **l'Officier du Ministère Public (OMP)** dans un délai de **45 jours** à compter de l'envoi de l'avis ou de l'apposition sur le pare-brise.

**Le FPS** (Forfait Post-Stationnement, 17 à 75 € selon les villes) concerne le défaut ou l'insuffisance de paiement du stationnement payant. Il est émis par la commune ou son délégataire (Streeteo, Indigo, etc.) et relève du Code général des collectivités territoriales. Le recours se fait en deux étapes : **RAPO** (Recours Administratif Préalable Obligatoire) auprès de la commune dans un délai de **1 mois**, puis si rejet, saisine de la **Commission du Contentieux du Stationnement Payant (CCSP)** à Limoges.

Le numéro d'amende et le formulaire de contestation joint au PV indiquent toujours quel régime s'applique. En cas de doute, regardez si l'amende est libellée "Forfait post-stationnement" (= FPS) ou "Amende forfaitaire" (= PV classique).`,
      },
      {
        heading: "Les motifs recevables pour contester",
        body: `Tous les motifs ne sont pas recevables. La jurisprudence a fixé une liste limitative des arguments qui peuvent annuler une amende.

**Motifs valables couramment retenus** :
- **Erreur de plaque d'immatriculation** sur le PV (faute de saisie de l'agent)
- **Vol ou cession du véhicule** au moment des faits, justifié par le récépissé de plainte ou le certificat de cession
- **Défaut de signalisation** : signalisation absente, illisible ou contradictoire (panneaux à vérifier sur place et à photographier)
- **Force majeure** : panne mécanique attestée par dépanneur, urgence médicale attestée par hospitalisation
- **Erreur sur le lieu** mentionné sur le PV (rue inexistante, numéro qui n'existe pas)
- **Stationnement régulier non détecté** : ticket horodateur valide non vu par l'agent, abonnement résident en cours

**Motifs systématiquement rejetés** :
- "Je n'ai pas vu le panneau" (vous êtes responsable de votre véhicule)
- "C'était juste 5 minutes" (la durée n'a pas d'incidence)
- "Quelqu'un d'autre conduisait" (sauf cession formelle ou vol)
- "L'horodateur ne fonctionnait pas" (sauf preuve photo + appel signalé)
- Motifs financiers ("je n'ai pas les moyens")

Joignez systématiquement vos preuves : photos datées du panneau, du véhicule, du ticket, du contexte. Sans preuve photographique, votre contestation a peu de chances d'aboutir.`,
      },
      {
        heading: "La procédure pas-à-pas pour contester",
        body: `**Pour un PV classique (amende forfaitaire)** :

1. Récupérez le numéro de l'avis (en haut du PV) et l'avis d'amende (envoyé par courrier 5 à 10 jours après les faits).
2. Rédigez votre **requête en exonération** ou **requête en annulation** sur formulaire bleu joint au PV, ou par courrier libre adressé à l'**OMP** (adresse au verso du PV).
3. Important : **ne payez pas avant de contester**. Le paiement vaut reconnaissance et éteint le droit de contester (article 529-2 du Code de procédure pénale).
4. Envoyez le tout en **lettre recommandée avec accusé de réception** dans le délai de 45 jours. Joignez vos pièces justificatives (photos, preuves) en copies.
5. L'OMP a 1 an pour répondre. Trois issues : classement (annulation), maintien de l'amende, ou transmission au tribunal de police pour jugement.

**Pour un FPS** (procédure plus complexe) :

1. **Étape 1** : déposer un **RAPO** auprès de l'autorité émettrice (commune ou délégataire) dans le mois suivant l'avis. Souvent en ligne sur ant.gouv.fr ou directement sur le site de la mairie. Joindre le formulaire fourni avec le FPS et les justificatifs.
2. **Étape 2** : si rejet ou silence pendant 1 mois (= rejet implicite), saisine de la **CCSP** à Limoges (https://www.ccsp.fr) dans un mois supplémentaire. **Attention** : il faut **payer le FPS d'abord** ou justifier d'une demande de remise gracieuse acceptée pour que la CCSP examine le dossier (article R.2333-120-15 CGCT). Cette obligation de paiement préalable a été contestée mais reste en vigueur.
3. La CCSP rend une décision dans 6 à 12 mois. Si vous gagnez, le FPS est remboursé.`,
      },
      {
        heading: "Les pièges courants et les recours en cas d'échec",
        body: `**Piège 1 — Le délai de 45 jours qui court depuis l'envoi**, pas depuis la réception. Si l'avis met 10 jours à arriver chez vous, vous avez en réalité 35 jours pour contester. Agissez vite. La date qui fait foi est la date de l'enveloppe ou du cachet de la Poste.

**Piège 2 — La majoration automatique en cas de retard**. Sans contestation ni paiement à 45 jours, l'amende passe à **75 €** (forfait majoré). Au-delà de 60 jours, la procédure de recouvrement par le Trésor public démarre, avec frais supplémentaires.

**Piège 3 — La saisie sur compte bancaire** sans préavis. À défaut de paiement, le Trésor public peut saisir directement votre compte au bout de quelques mois (avis à tiers détenteur, ATD). Pour bloquer cette saisie, il faut contester en référé devant le juge de l'exécution.

**Recours après échec de la première contestation** :
- Pour un PV classique : si l'OMP rejette, le dossier est transmis au **tribunal de police** qui jugera en audience publique. Vous pouvez vous y présenter seul ou avec un avocat (non obligatoire). Le juge peut classer, condamner à l'amende initiale, ou aggraver jusqu'à 750 €.
- Pour un FPS : si la CCSP rejette, vous pouvez faire un **pourvoi en cassation** auprès du Conseil d'État dans les 2 mois. Procédure réservée aux questions de droit, avocat au Conseil d'État obligatoire (3 000 à 8 000 €). Disproportionné pour la plupart des FPS.

En dernier recours, **le défenseur des droits** peut être saisi gratuitement (defenseurdesdroits.fr) pour les litiges avec une administration. Son intervention est non contraignante mais peut débloquer un dossier en 3-6 mois.`,
      },
    ],
    faq: [
      {
        q: "Quel est le délai pour contester un PV ?",
        a: "**45 jours** pour un PV classique (amende forfaitaire) à compter de l'envoi de l'avis ou de l'apposition sur le pare-brise (article 529-2 du Code de procédure pénale). **1 mois** pour un FPS (forfait post-stationnement) à compter de la notification, pour déposer le RAPO. Au-delà, l'amende devient définitive et fait l'objet d'une majoration (75 € pour le PV classique). Calculez le délai sur la date d'envoi figurant sur l'enveloppe ou la date d'apposition mentionnée sur le PV, pas sur la date de réception. Pour gagner du temps, déposez votre contestation en ligne via ant.gouv.fr (PV classique) ou sur le portail de la commune (FPS).",
      },
      {
        q: "Faut-il payer l'amende avant de contester ?",
        a: "**PV classique : NON, surtout pas.** Le paiement éteint votre droit de contester (article 529-2 du Code de procédure pénale). Une fois payé, l'amende est purgée et toute contestation devient irrecevable. Les sites officiels affichent souvent un encart \"contester\" à côté du paiement, suivez ce lien. **FPS : OUI, malheureusement.** Le paiement préalable est obligatoire pour saisir la CCSP au stade 2 (article R.2333-120-15 CGCT). Au stade 1 (RAPO auprès de la commune), pas de paiement préalable. C'est une particularité critiquée du FPS : vous devez avancer la somme même en contestation.",
      },
      {
        q: "Mon véhicule a été volé : comment éviter le PV ?",
        a: "Joignez à votre contestation une copie du **récépissé de plainte pour vol** déposée à la gendarmerie ou au commissariat. La date de la plainte doit être antérieure ou contemporaine aux faits du PV. Si la plainte est déposée après les faits, ajoutez tout élément qui établit que vous n'aviez plus le contrôle du véhicule au moment des faits (témoins, traceur GPS, etc.). L'OMP classe systématiquement le dossier dans ce cas. Si le voleur a pris d'autres PV, contestez chacun d'eux avec la même preuve, en mentionnant chaque numéro d'amende dans une lettre groupée par LRAR.",
      },
      {
        q: "J'ai vendu ma voiture mais reçois encore des PV : que faire ?",
        a: "Joignez à votre contestation la **déclaration de cession** (CERFA 15776) signée par les deux parties et la copie du certificat de cession remis à l'ANTS dans les 15 jours suivant la vente (article R.322-4 du Code de la route). Si vous n'avez pas fait cette déclaration dans les délais, vous restez juridiquement responsable, mais l'OMP accepte généralement la contestation si vous prouvez la cession effective (chèque, témoins, contrat). Conseil pour le futur : faites toujours la cession en ligne sur ants.gouv.fr le jour même de la vente. Conservez la confirmation par email pendant 5 ans.",
      },
      {
        q: "Que faire si la signalisation était illisible ou inexistante ?",
        a: "**Photographiez immédiatement** la signalisation litigieuse sous plusieurs angles, avec horodatage (smartphone par défaut). Notez l'heure, la météo, la luminosité (si en panneau effacé/dégradé). Joignez ces photos à votre contestation. Argumentez en citant l'article R.411-25 du Code de la route qui impose une signalisation conforme aux normes (instruction interministérielle sur la signalisation routière, IISR). Si possible, repassez sur les lieux 24-48 h plus tard pour constater que la signalisation est effectivement défaillante (à dater aussi). La preuve photo précoce et datée est décisive : sans elle, l'OMP rejette systématiquement.",
      },
      {
        q: "Si la CCSP me donne raison, comment récupérer mon argent ?",
        a: "Le remboursement est automatique mais lent. Après décision favorable de la CCSP, la commune ou son délégataire dispose de **2 mois** pour vous rembourser. Le virement arrive sur le compte que vous avez utilisé pour payer le FPS, ou sur un IBAN que la CCSP vous demandera. Si vous ne recevez rien après 3 mois, relancez la commune par LRAR avec copie de la décision CCSP. En l'absence de paiement à 6 mois, vous pouvez saisir le tribunal administratif pour faire exécuter la décision (demande d'astreinte). Le coût n'est pas remboursable.",
      },
    ],
  },

  // ─── Guide 12 : Réclamation France Travail / indu ───
  {
    slug: "reclamation-france-travail-indu",
    category: "administrations",
    title: "Réclamation France Travail : indu, suspension, refus",
    metaTitle: "Réclamation France Travail (Pôle emploi) — Indu et suspension",
    description:
      "Contester un indu, une suspension ou un refus France Travail (Pôle emploi) : médiateur, délai 2 mois, recours. Modèle de lettre 2026.",
    relatedLetterSlug: "reclamation-administration",
    publishedAt: "2026-05-15",
    updatedAt: "2026-05-15",
    readingTime: "5 min",
    sections: [
      {
        heading: "Quand contester une décision France Travail",
        body: `Depuis le 1er janvier 2024, Pôle emploi est devenu **France Travail** suite à la loi du 18 décembre 2023. Les procédures de recours restent largement inchangées mais les coordonnées et formulaires ont évolué.

Vous pouvez contester toute décision défavorable :
- **Notification d'indu** : France Travail vous réclame le remboursement d'allocations jugées trop perçues
- **Suspension d'allocation** : interruption pour absence à un rendez-vous, défaut de réponse à une convocation, ou radiation
- **Refus d'inscription** ou **refus d'ouverture de droits** : motif d'inéligibilité contesté
- **Calcul d'allocation contesté** : montant inférieur à votre droit calculé
- **Refus de formation** ou de prestation
- **Sanction pour manquement** (radiation 1 à 4 mois selon la gravité)

Les indus sont la cause de réclamation la plus fréquente. Causes courantes : changement de situation non déclaré ou déclaré tardivement (reprise d'activité, déménagement, modification du foyer), erreur de saisie de France Travail, recalcul rétroactif suite à une régularisation fiscale.

**Avant toute contestation formelle**, vérifiez la motivation de la décision dans la notification écrite (l'agent doit motiver, article L.211-2 du Code des relations entre le public et l'administration). Si la motivation est vague ou absente, exigez-la par écrit avant d'argumenter sur le fond.`,
      },
      {
        heading: "Le recours gracieux interne (étape obligatoire)",
        body: `Avant de saisir un juge, vous devez d'abord exercer un **recours gracieux** auprès du directeur de votre agence France Travail. C'est la procédure de réclamation interne.

**Délai** : 2 mois à compter de la notification de la décision contestée. Au-delà, la décision devient définitive.

**Forme** : courrier libre par lettre recommandée avec accusé de réception adressé au directeur de l'agence France Travail mentionnée sur la décision (l'adresse figure sur la notification). Vous pouvez aussi déposer le recours dans votre espace personnel sur france-travail.fr (rubrique "Mes échanges" → "Faire une réclamation"), mais le LRAR reste recommandé pour preuve opposable.

**Contenu** :
- Vos coordonnées complètes (nom, prénom, identifiant France Travail à 7 chiffres)
- Référence et date de la décision contestée
- Motifs détaillés de contestation, pièce par pièce
- Chiffrage du préjudice (montant de l'indu contesté, journées d'allocation suspendues)
- Pièces justificatives en copies (avis fiscal, fiches de paie, certificats médicaux, justificatifs déménagement, etc.)
- Demande explicite (annulation de l'indu, remise gracieuse, restitution des sommes, recalcul)

France Travail a **2 mois pour répondre**. Sans réponse à 2 mois, c'est un rejet implicite et le délai pour saisir le médiateur ou le juge démarre.`,
      },
      {
        heading: "Le médiateur de France Travail",
        body: `Si le recours gracieux est rejeté ou sans réponse, vous pouvez saisir le **médiateur de France Travail** avant d'aller en justice. C'est une étape facultative mais souvent efficace.

**Quand saisir** : dans les 2 mois suivant la réponse défavorable au recours gracieux, ou après expiration du délai de 2 mois sans réponse.

**Comment saisir** : via le formulaire en ligne sur france-travail.fr (rubrique "Aide & contact" → "Le médiateur"), ou par courrier au médiateur de la région concernée. Saisine gratuite et sans formalisme particulier.

**Délai de traitement** : 60 à 90 jours en moyenne. Le médiateur instruit le dossier de manière indépendante de l'agence et peut proposer une solution amiable. Son avis n'est pas contraignant mais France Travail le suit dans environ 70 % des cas.

**Spécificité indu** : le médiateur peut proposer une **remise gracieuse** (totale ou partielle) si l'indu est dû mais que vous êtes en situation financière difficile. Joignez votre avis d'imposition, votre quittance de loyer, vos charges fixes pour étayer.

Pendant la médiation, le **recouvrement de l'indu n'est pas suspendu** automatiquement. Vous pouvez demander un sursis exceptionnel mais il n'est pas garanti. À défaut, vous pouvez demander un échéancier de paiement (24 à 60 mois) en parallèle de la médiation pour éviter une saisie.`,
      },
      {
        heading: "Le tribunal administratif et le défenseur des droits",
        body: `Si le médiateur échoue ou si vous voulez aller plus vite, deux voies restent ouvertes : la justice administrative et le défenseur des droits.

**Tribunal administratif** : compétent pour la plupart des décisions France Travail. Saisine dans les 2 mois suivant la décision défavorable (ou rejet du recours gracieux si exercé). Procédure gratuite, avocat non obligatoire en première instance pour les litiges de droit social. Délai d'audience : 8 à 18 mois en moyenne.

Pour les **litiges relatifs au montant de l'allocation** ou à la durée d'indemnisation (et non au principe), c'est le **conseil des prud'hommes** qui est compétent, et non le tribunal administratif. Vérifiez la voie de recours indiquée sur votre notification — c'est obligatoire pour France Travail (article R.421-5 du Code de justice administrative).

**Aide juridictionnelle** : si vos ressources sont inférieures aux plafonds (~1 200 €/mois pour une personne seule en 2026), vous pouvez bénéficier de l'aide juridictionnelle totale ou partielle pour être assisté gratuitement par un avocat. Demande sur le formulaire CERFA 16146.

**Défenseur des droits** : alternative gratuite et plus rapide. Saisine en ligne sur defenseurdesdroits.fr, sans recours préalable obligatoire. Le défenseur enquête, contacte France Travail et peut obtenir une révision en 3-6 mois. Son avis n'est pas contraignant mais France Travail collabore généralement.

**Associations spécialisées** : APEIS (Association pour l'Emploi, l'Information et la Solidarité), Solidaires, AC ! Agir contre le chômage. Conseil juridique gratuit et accompagnement dans la procédure.`,
      },
    ],
    faq: [
      {
        q: "Quel est le délai pour contester une décision France Travail ?",
        a: "**2 mois** à compter de la notification de la décision pour exercer le recours gracieux auprès du directeur d'agence (article R.421-1 du Code de justice administrative). Au-delà, la décision devient définitive et toute contestation est irrecevable. Pour saisir ensuite le tribunal administratif ou le défenseur des droits, vous avez à nouveau **2 mois** à compter du rejet (explicite ou implicite après 2 mois de silence). Le délai court à partir de la date de réception du courrier, pas de son envoi. Conservez l'enveloppe ou la capture d'écran de la notification pour prouver la date.",
      },
      {
        q: "Le recours gracieux suspend-il le recouvrement de l'indu ?",
        a: "Non, par défaut. France Travail peut commencer à prélever sur vos allocations en cours dès la notification de l'indu, même si vous contestez. Pour suspendre le recouvrement, vous devez **demander expressément le sursis à exécution** dans votre lettre de recours et apporter des éléments crédibles (situation financière difficile, arguments de fond solides). En parallèle, vous pouvez demander un **plan d'apurement** (échéancier de 24 à 60 mois) pour étaler la dette et éviter une saisie sur compte. Les deux demandes peuvent se cumuler.",
      },
      {
        q: "Comment demander une remise gracieuse de l'indu ?",
        a: "La remise gracieuse est différente de la contestation au fond : vous reconnaissez devoir l'indu mais demandez à France Travail de l'effacer ou de le réduire en raison de votre situation. Critères favorables : revenus très faibles, dettes par ailleurs, événement difficile (séparation, deuil), erreur initiale partagée avec France Travail (mauvaise information donnée par un agent). Joignez votre avis d'imposition, vos quittances de loyer, vos relevés bancaires des 3 derniers mois. Le médiateur de France Travail est plus favorable aux remises que le directeur d'agence — saisissez-le après un premier rejet.",
      },
      {
        q: "France Travail prétend que je n'ai pas justifié ma recherche d'emploi : que faire ?",
        a: "Conservez **toutes vos preuves** de recherche : captures d'écran d'envoi de candidatures, accusés de réception d'emails, lettres de motivation envoyées, attestations de visite chez des employeurs, captures de votre tableau de bord France Travail. La sanction pour manquement (radiation 1 à 4 mois selon la gravité, article L.5412-1 du Code du travail) doit être motivée précisément. Si la motivation est vague (\"recherche insuffisante\"), exigez par écrit le détail des manquements reprochés. Le défenseur des droits a fait jurisprudence pour rappeler que France Travail doit motiver concrètement, pas juste invoquer une formule type.",
      },
      {
        q: "Puis-je continuer à toucher mes allocations pendant la contestation ?",
        a: "**Indu** : oui, vos allocations en cours continuent, mais France Travail peut prélever 30 à 100 % sur celles-ci pour récupérer l'indu (article L.5422-5 du Code du travail). Vous pouvez demander un plafonnement de la retenue à 30 % via le médiateur. **Suspension** : non, la suspension prend effet immédiatement à la notification. Vous devez attendre l'issue de la contestation pour récupérer les sommes (rétroactivement si la suspension est annulée). **Radiation** : idem, effet immédiat. Pour limiter le préjudice, sollicitez en parallèle le RSA (CAF) pour la durée de la suspension/radiation, ainsi que le FSL (fonds de solidarité logement) si vous risquez un impayé.",
      },
      {
        q: "Si le médiateur me donne raison mais France Travail refuse, que faire ?",
        a: "L'avis du médiateur n'est pas contraignant. Si France Travail rejette malgré tout, deux options : saisir le **tribunal administratif** dans les 2 mois (en joignant l'avis du médiateur comme pièce maîtresse — il a une force probante élevée pour le juge), ou saisir le **défenseur des droits** qui peut intervenir directement auprès de la direction nationale de France Travail. Le défenseur a obtenu plusieurs revirements dans des dossiers où le médiateur avait été ignoré. Saisine gratuite en ligne sur defenseurdesdroits.fr, accompagnée des copies de toutes les pièces (décision contestée, recours gracieux, réponse, avis du médiateur, refus).",
      },
    ],
  },

  // ─── Guide 13 : Mise en demeure assurance refus indemnisation ───
  {
    slug: "mise-en-demeure-assurance-refus-indemnisation",
    category: "banque-assurance",
    title: "Mise en demeure d'une assurance qui refuse d'indemniser",
    metaTitle: "Mise en demeure assurance — Refus d'indemniser sinistre (2026)",
    description:
      "Votre assurance refuse d'indemniser ou tarde sur un sinistre ? Mise en demeure, délai 15 jours, médiateur, prescription 2 ans. Modèle de lettre.",
    relatedLetterSlug: "mise-en-demeure-executer",
    publishedAt: "2026-05-15",
    updatedAt: "2026-05-15",
    readingTime: "6 min",
    sections: [
      {
        heading: "Les motifs de refus d'indemnisation et leur légalité",
        body: `Toute assurance peut refuser d'indemniser un sinistre, mais le refus doit être motivé et juridiquement fondé. Tous les motifs ne sont pas légaux.

**Motifs légalement valables** :
- **Exclusion contractuelle** clairement stipulée dans la police (ex: exclusion catastrophes naturelles non décrétées, exclusion vol sans effraction)
- **Fausse déclaration intentionnelle** au moment de la souscription (article L.113-8 du Code des assurances) — entraîne la nullité du contrat
- **Aggravation de risque non déclarée** (article L.113-2 alinéa 3) — peut entraîner réduction proportionnelle de l'indemnité
- **Prescription du sinistre** (2 ans depuis l'événement, article L.114-1)
- **Défaut de paiement de prime** au moment du sinistre (article L.113-3)
- **Faute intentionnelle ou dolosive** de l'assuré (article L.113-1 alinéa 2)

**Motifs souvent invoqués mais juridiquement contestables** :
- **Clause d'exclusion non lisible ou rédigée en petits caractères** : nulle si pas en caractères très apparents (article L.112-4)
- **Exclusion par renvoi à un document non joint** : inopposable si l'assuré n'a pas eu connaissance du document
- **Délai de déclaration dépassé** (5 jours pour vol, 10 jours pour catastrophe naturelle) : la perte du droit n'est encourue que si l'assureur prouve un préjudice du fait du retard (article L.113-2)
- **Refus pour "absence de causalité"** sans expertise contradictoire

Avant de contester, **demandez le motif détaillé par écrit** si la lettre de refus est vague. C'est un droit (article L.113-12-2 du Code des assurances pour les contrats d'assurance vie, applicable par analogie).`,
      },
      {
        heading: "La réclamation interne préalable obligatoire",
        body: `La plupart des contrats d'assurance imposent une procédure de réclamation interne avant toute action contentieuse. Cette étape est cruciale et permet souvent de débloquer la situation sans procédure.

**Identifiez le service réclamation** : ses coordonnées doivent figurer dans votre contrat ou sur le site de l'assureur (souvent rubrique "Réclamation" ou "Médiation"). Pour les grands groupes (AXA, Generali, Macif, MAIF...), une adresse email dédiée existe.

**Contenu de votre réclamation** :
- Identification complète (numéro de contrat, numéro de sinistre)
- Rappel chronologique des faits
- Reprise du motif de refus de l'assureur
- Réfutation point par point avec arguments juridiques (citez les articles du Code des assurances)
- Pièces justificatives (constat amiable, devis, factures, photos, témoignages, certificats médicaux)
- Demande chiffrée et précise (indemnisation X €, expertise contradictoire, etc.)
- Délai imparti (15 à 30 jours raisonnable)

**Forme** : lettre recommandée avec accusé de réception au siège social de l'assureur OU au service réclamation indiqué au contrat. Le siège social est souvent plus efficace car la lettre remonte directement à la direction. Doublure email à l'agent gestionnaire pour traçabilité interne.

L'assureur a **10 jours pour accuser réception** et **2 mois maximum pour répondre** sur le fond (engagement déontologique de la profession, article 101 du Code de bonne conduite FFA). Sans réponse à 2 mois, vous pouvez saisir le médiateur.`,
      },
      {
        heading: "Le médiateur de l'assurance",
        body: `Si la réclamation interne échoue ou reste sans réponse pendant 2 mois, vous pouvez saisir gratuitement la **Médiation de l'Assurance** (médiateur indépendant agréé).

**URL** : mediation-assurance.org. Saisine en ligne via formulaire ou par courrier postal (12 rue de Saint-Pétersbourg 75008 Paris).

**Conditions de recevabilité** :
- Vous avez exercé une réclamation préalable auprès de l'assureur
- Réponse défavorable ou silence de plus de 2 mois
- Litige inférieur à un certain plafond (variable selon l'assureur, souvent 250 000 €)
- Pas de procédure judiciaire en cours sur le même litige

**Pièces à fournir** : copies de la police d'assurance, déclaration de sinistre, lettres de refus de l'assureur, votre réclamation préalable et la réponse, devis et factures, photos, expertises éventuelles.

**Délai de traitement** : **3 mois** en moyenne, jusqu'à 6 mois pour les dossiers complexes. Le médiateur instruit le dossier de manière indépendante, peut demander des compléments aux deux parties, et rend un **avis motivé**.

**Force de l'avis** : l'avis n'est pas contraignant juridiquement, mais les assureurs membres de la médiation s'engagent à le suivre dans la majorité des cas. Statistiquement, **70 % des avis favorables à l'assuré sont appliqués** par l'assureur. Si l'assureur refuse l'avis, le médiateur informe la profession et l'assuré peut saisir le juge avec l'avis comme pièce favorable.

Pendant la médiation, **la prescription est suspendue** (article L.114-2 du Code des assurances). Cela vous protège du risque de forclusion pendant les 6 mois d'instruction.`,
      },
      {
        heading: "Le tribunal et l'expertise judiciaire",
        body: `Si la médiation échoue ou si vous voulez aller plus vite, le recours au juge est la dernière étape.

**Tribunal compétent** :
- Litige inférieur à 5 000 € → conciliation préalable obligatoire (gratuite, conciliateur de justice)
- Litige entre 5 000 € et 10 000 € → juge des contentieux de la protection (TJ), gratuit, avocat non obligatoire
- Litige supérieur à 10 000 € → tribunal judiciaire, avocat obligatoire en première instance

**Prescription** : votre action contre l'assureur se prescrit par **2 ans** à compter du sinistre (article L.114-1 du Code des assurances). C'est un délai très court par rapport aux autres litiges civils. La prescription est suspendue pendant la médiation et interrompue par toute mise en demeure, lettre recommandée d'objection, ou citation en justice.

**L'expertise contradictoire** : si l'assureur conteste l'origine ou le montant du sinistre, demandez une **expertise contradictoire** où votre expert et celui de l'assureur examinent ensemble le dossier. Si désaccord persistant, le juge peut nommer un **tiers expert** ou ordonner une **expertise judiciaire** en référé.

L'expertise judiciaire (référé-expertise) coûte 2 000 à 5 000 € avancés par le demandeur (puis remboursés par la partie perdante), mais son rapport a une force probante très élevée et règle souvent le litige sans procès au fond.

**Contre-expertise privée** : à 500-1 500 €, faire intervenir un expert indépendant que vous payez vous-même. Utile pour étayer votre dossier en réclamation interne et médiation, sans aller au tribunal. Beaucoup de cabinets d'expertise (cabinets ALP, BCA, etc.) acceptent ce type de mission.`,
      },
    ],
    faq: [
      {
        q: "Mon assurance refuse de me rembourser : combien de temps pour contester ?",
        a: "**2 ans** à compter du jour où vous avez eu connaissance du refus, conformément à l'article L.114-1 du Code des assurances. C'est un délai court qui peut surprendre : pour les autres litiges civils, le délai est de 5 ans. Cette prescription biennale est interrompue par toute mise en demeure (lettre recommandée), saisine du médiateur, ou action en justice. Elle est suspendue pendant la médiation. Plus vite vous agissez, plus vous avez de chances de réunir les preuves (constats, témoins, devis). Au-delà de 2 ans, vous perdez tout droit, même si l'assureur a tort sur le fond.",
      },
      {
        q: "L'assureur invoque une exclusion : peut-il toujours s'en prévaloir ?",
        a: "Non, pas toujours. L'article L.112-4 du Code des assurances impose que les **clauses d'exclusion soient rédigées en caractères très apparents** (gras, encadrés, taille supérieure au reste du contrat). À défaut, la clause est inopposable à l'assuré. De même, une clause par renvoi à un document non joint au contrat est nulle si l'assuré n'a pas eu connaissance du document (article L.112-2). Lisez votre contrat à la loupe : la clause invoquée respecte-t-elle ces critères ? Si non, citez l'article L.112-4 dans votre contestation. Cas typique : exclusions des conditions générales en petits caractères, ou exclusions imprimées dans le bas de la page sans mise en évidence.",
      },
      {
        q: "Combien de temps l'assureur a-t-il pour me répondre ?",
        a: "Pas de délai légal universel, mais des engagements déontologiques. Pour la **réclamation interne**, les engagements de la profession (Charte FFSA / France Assureurs) imposent un accusé de réception sous 10 jours et une réponse au fond sous **2 mois**. Pour le **traitement du sinistre** lui-même, l'article L.113-5 du Code des assurances impose à l'assureur d'exécuter ses obligations dans le délai prévu au contrat ou \"sans délai injustifié\". En pratique, après votre déclaration de sinistre, l'assureur a 30 jours pour proposer une indemnisation chiffrée ou demander des éléments complémentaires. Au-delà, votre mise en demeure peut faire courir des intérêts moratoires.",
      },
      {
        q: "L'expertise contradictoire est-elle obligatoire ?",
        a: "Non, mais fortement recommandée en cas de désaccord chiffré. La plupart des contrats prévoient cette clause. Vous nommez votre expert (cabinet ALP, BCA Expertises, ou expert d'assuré indépendant), l'assureur nomme le sien. Les deux examinent ensemble le sinistre et tentent de s'entendre sur le montant. **Si désaccord** : un tiers expert peut être désigné d'un commun accord (souvent par tirage au sort sur une liste de cabinets agréés), ou le juge peut ordonner une expertise judiciaire. **Coût** : votre expert est à votre charge (500-1 500 €), parfois remboursable si la garantie \"frais d'expertise\" est incluse au contrat (vérifiez vos conditions générales section \"Garanties annexes\").",
      },
      {
        q: "Que faire si la médiation échoue ?",
        a: "Vous gardez deux voies. **1. Saisir le juge** : la voie classique. Tribunal compétent selon le montant : conciliateur de justice (< 5 000 €), juge des contentieux de la protection (5 000 € - 10 000 €), tribunal judiciaire (au-delà). Joignez l'avis du médiateur comme pièce maîtresse — un avis favorable a une force probante élevée devant le juge. **2. Saisir l'ACPR** (Autorité de contrôle prudentiel et de résolution) si vous estimez que l'assureur a violé ses obligations professionnelles. L'ACPR ne tranche pas votre litige individuel mais peut sanctionner l'assureur si elle constate un manquement systémique. Saisine gratuite sur le site de la Banque de France.",
      },
      {
        q: "Puis-je résilier mon contrat à cause du refus d'indemnisation ?",
        a: "Oui, et dans certains cas avec remboursement de la prime. **Cas 1 — Manquement grave de l'assureur** : si l'assureur a manqué à ses obligations contractuelles (refus injustifié, mauvaise foi caractérisée), vous pouvez résilier pour faute en lettre recommandée avec mise en demeure préalable de 15 jours. Précédent jurisprudentiel : Cass. civ. 2e, 18 mars 2010 n° 09-65.165. **Cas 2 — Hausse tarifaire après sinistre** : si l'assureur augmente la prime suite à votre sinistre, vous pouvez résilier dans les 30 jours après notification (article L.113-4 du Code des assurances). **Cas 3 — Résiliation à échéance** : possible 2 mois avant l'échéance annuelle, ou à tout moment après 1 an d'adhésion (loi Hamon, article L.113-15-2). Dans tous les cas, formalisez par LRAR et conservez la preuve d'envoi.",
      },
    ],
  },

  // ─── Guide 14 : Résilier sa mutuelle santé (loi 2019) ───
  {
    slug: "resilier-mutuelle-sante-loi-2019",
    category: "banque-assurance",
    title: "Résilier sa mutuelle santé à tout moment (loi 14/07/2019)",
    metaTitle: "Résilier sa mutuelle santé — Loi 2019, après 1 an, sans frais",
    description:
      "Depuis la loi du 14 juillet 2019, vous pouvez résilier votre mutuelle santé après 1 an d'adhésion, à tout moment et sans frais. Procédure, modèle.",
    relatedLetterSlug: "resiliation-abonnement",
    publishedAt: "2026-05-15",
    updatedAt: "2026-05-15",
    readingTime: "5 min",
    sections: [
      {
        heading: "Ce que la loi du 14 juillet 2019 a changé",
        body: `La loi n° 2019-733 du 14 juillet 2019 (dite \"loi Bourquin santé\" ou \"résiliation infra-annuelle\") a profondément modifié les règles de résiliation des contrats de complémentaire santé.

**Avant la loi** : pour résilier, il fallait respecter une fenêtre de 2 mois avant la date d'échéance annuelle, sans quoi le contrat se reconduisait tacitement pour un an. Si vous ratiez la fenêtre, vous étiez prisonnier 12 mois de plus.

**Depuis la loi** (entrée en vigueur le 1er décembre 2020) : tout assuré peut résilier son contrat de complémentaire santé **à tout moment, sans frais ni pénalité, après la première année d'adhésion**. La règle est codifiée à l'article L.113-15-2 du Code des assurances.

Conditions cumulatives à respecter :
- **12 mois d'ancienneté minimum** sur votre contrat actuel (compté de date à date depuis la prise d'effet)
- Lettre recommandée ou notification équivalente (recommandé électronique, déclaration via espace personnel si l'assureur l'autorise)
- **Préavis de 1 mois** : la résiliation prend effet 1 mois après la réception de votre demande par l'assureur

Le préavis ne peut pas être réduit conventionnellement à votre désavantage. Une clause au contrat imposant un préavis plus long que 1 mois est nulle (article L.113-15-2 alinéa 2).

**Ce qui n'est PAS concerné par cette loi** : les contrats collectifs obligatoires d'entreprise (votre adhésion via votre employeur), les contrats Madelin pour TNS, les contrats responsables encadrés. Pour ces cas, les règles classiques s'appliquent (résiliation à échéance annuelle).`,
      },
      {
        heading: "Vérifier que vous remplissez les conditions",
        body: `Avant d'envoyer votre lettre, vérifiez méthodiquement que vous êtes bien éligible.

**Date d'ancienneté** : prenez votre contrat ou votre dernière facture/échéancier. La date à retenir est celle de **prise d'effet** du contrat, pas celle de la signature ou de la dernière échéance annuelle. Si vous avez changé de niveau de garantie en cours de contrat (passage d'une formule à l'autre chez le même assureur), l'ancienneté part en général de la prise d'effet initiale, sauf si l'assureur considère le changement comme un nouveau contrat (cas rare, à vérifier).

**Type de contrat** :
- **Contrat individuel** (vous l'avez souscrit vous-même) → loi 2019 applicable ✅
- **Contrat collectif facultatif** (ex: groupement professionnel auquel vous adhérez librement) → loi 2019 applicable ✅
- **Contrat collectif obligatoire** (mutuelle d'entreprise) → loi 2019 PAS applicable ❌
- **Contrat Madelin** (TNS, indépendants) → loi 2019 PAS applicable ❌

Si vous bénéficiez d'une mutuelle d'entreprise obligatoire et souhaitez résilier votre mutuelle individuelle (que vous aviez en plus), c'est un **motif légitime** de résiliation à tout moment, indépendamment de la loi 2019, sur preuve de l'adhésion à la mutuelle d'entreprise (article L.113-12 du Code des assurances). Joignez votre attestation employeur.

**Préparation du nouveau contrat** : si vous résiliez pour changer d'assureur, le nouveau contrat doit prendre effet **dès le lendemain de la fin de l'ancien** pour éviter une rupture de couverture. Demandez à votre nouvel assureur de gérer la résiliation à votre place — c'est un service prévu par la loi (le nouvel assureur effectue les démarches en votre nom).`,
      },
      {
        heading: "La procédure pas-à-pas",
        body: `Trois manières de résilier, par ordre de sécurité juridique :

**1. Lettre recommandée avec accusé de réception** (méthode la plus sûre)

Adressez votre lettre au siège social de votre mutuelle (adresse au verso de votre carte de tiers payant ou sur le site). Contenu obligatoire :
- Vos coordonnées complètes
- Numéro de contrat ou d'adhérent
- Date de prise d'effet du contrat
- Demande explicite de résiliation
- Référence à l'article L.113-15-2 du Code des assurances
- Date de prise d'effet souhaitée (au minimum 1 mois après la réception)

Conservez l'AR signé. Le préavis court à compter de cette date.

**2. Notification via votre nouvel assureur** (méthode déléguée)

Si vous changez d'assureur, signez votre nouveau contrat et demandez au nouvel assureur de gérer la résiliation. Il transmet la demande au siège de l'ancien assureur, fournit les documents nécessaires, et coordonne la prise d'effet pour éviter la rupture de garantie. Service gratuit prévu par la loi.

**3. Recommandé électronique ou espace personnel** (méthode rapide mais moins sûre)

Certaines mutuelles (Harmonie, Macif, MAIF) permettent la résiliation directement depuis votre espace en ligne via un formulaire dédié. Conservez la confirmation par email. Le recommandé électronique (AR24, MerciFacteur) a la même valeur juridique que le LRAR papier (article 1369 du Code civil).

**Délai et fin du contrat** : le contrat prend fin **1 mois après la réception** de votre demande. La mutuelle vous rembourse au prorata les cotisations versées d'avance (si vous payez à l'année). En cas de prélèvements indus après la fin du contrat, vous pouvez faire opposition à votre banque sans frais (directive DSP2).`,
      },
      {
        heading: "Les pièges fréquents et les recours",
        body: `**Piège 1 — La mutuelle prétend que vous n'avez pas 12 mois d'ancienneté**. Vérifiez la date sur votre tableau de garanties initial. Si l'argument est faux, renvoyez une LRAR avec preuve datée. La mauvaise foi de la mutuelle est sanctionnable.

**Piège 2 — La mutuelle exige un \"motif légitime\"**. Faux. Depuis la loi 2019, aucun motif n'est requis après 12 mois. Toute exigence de motif est illégale. Citez l'article L.113-15-2.

**Piège 3 — Frais de dossier ou pénalités**. Interdits par la loi (article L.113-15-2 alinéa 3 : \"sans frais ni pénalités\"). Si la mutuelle prétend en facturer, ils sont nuls. Demandez le remboursement par LRAR.

**Piège 4 — La mutuelle continue de prélever après la fin**. Faites opposition à votre banque (gratuit, directive DSP2) et demandez le remboursement par LRAR avec mise en demeure de 15 jours. Sans réponse, saisissez le médiateur de l'assurance (mediation-assurance.org).

**Piège 5 — Augmentation tarifaire en cours d'année**. Si la mutuelle augmente votre cotisation hors indexation contractuelle, c'est un motif de résiliation supplémentaire **à tout moment dans les 30 jours suivant la notification**, indépendamment de la loi 2019 (article L.113-4 du Code des assurances). Conservez la notification de hausse et joignez-la à votre lettre.

**Recours en cas de blocage** :
1. **Médiateur de l'assurance** (gratuit, mediation-assurance.org). Délai 3-6 mois. Avis non contraignant mais souvent suivi.
2. **ACPR** (Autorité de contrôle prudentiel) pour signaler un comportement irrégulier de l'assureur. Pas un recours individuel mais peut déclencher une enquête.
3. **Tribunal** : conciliateur de justice gratuit pour les petits litiges, juge des contentieux de la protection au-delà.`,
      },
    ],
    faq: [
      {
        q: "Combien de temps après mon adhésion puis-je résilier ?",
        a: "**Après 12 mois pleins d'ancienneté** sur votre contrat de complémentaire santé. Le décompte se fait de date à date, à partir de la prise d'effet initiale (pas de la signature, ni du dernier renouvellement). Avant 12 mois, la résiliation reste possible uniquement à la date d'échéance annuelle (avec préavis de 2 mois) ou pour motif légitime (changement de situation : mariage, déménagement, retraite, adhésion à une mutuelle d'entreprise obligatoire). La loi du 14 juillet 2019 ne s'applique qu'aux contrats individuels et collectifs facultatifs ; les mutuelles d'entreprise obligatoires et les contrats Madelin restent soumis aux règles classiques.",
      },
      {
        q: "Quel est le préavis pour résilier après la loi 2019 ?",
        a: "**1 mois** à compter de la réception de votre lettre par l'assureur (article L.113-15-2 alinéa 2 du Code des assurances). Ce préavis est un **plafond légal** : aucune clause contractuelle ne peut imposer un préavis plus long. La date qui fait foi est celle de l'AR signé par la mutuelle (ou la date de réception électronique si vous utilisez un canal en ligne). Si vous voulez que la résiliation soit effective au 30 juin par exemple, envoyez votre lettre avant le 25 mai pour tenir compte des délais postaux. Pendant le préavis, vous restez couvert et payez normalement la cotisation.",
      },
      {
        q: "Y a-t-il des frais ou pénalités à la résiliation ?",
        a: "Non, aucun. La loi 2019 prévoit explicitement que la résiliation se fait \"sans frais ni pénalités\" (article L.113-15-2 alinéa 3). Toute facturation de frais de dossier, de pénalités forfaitaires, ou de retenue sur cotisations est illégale et nulle de plein droit. Si votre mutuelle vous facture des frais, demandez par LRAR le remboursement intégral en citant cet article. La mutuelle doit aussi vous rembourser au **prorata temporis** les cotisations payées d'avance pour la période postérieure à la résiliation effective (article L.113-15-2 alinéa 4).",
      },
      {
        q: "Comment éviter une rupture de couverture santé ?",
        a: "Souscrivez votre nouveau contrat **avant** d'envoyer la résiliation, et faites en sorte que le nouvel assureur prenne effet le lendemain de la fin de l'ancien. Idéalement, **demandez au nouvel assureur de gérer la résiliation à votre place** : il transmet la demande au siège de l'ancien assureur et coordonne les dates pour éviter le trou de couverture. Service gratuit prévu par la loi 2019. À défaut, calculez : si votre lettre est reçue le 5 mai par exemple, la résiliation prend effet le 5 juin. Le nouveau contrat doit donc démarrer le 6 juin au plus tard. Évitez tout chevauchement (vous paieriez 2 cotisations) et tout trou (vous seriez sans couverture).",
      },
      {
        q: "Que faire si ma mutuelle refuse de résilier ou tarde à répondre ?",
        a: "**Première étape** : renvoyez une seconde LRAR avec mise en demeure de 15 jours et menace de saisir le médiateur. Mentionnez l'article L.113-15-2 et le préavis de 1 mois qui court depuis votre première lettre. **Deuxième étape** si pas de retour** : saisir le médiateur de l'assurance (mediation-assurance.org), gratuit, délai 3-6 mois. Avis non contraignant mais suivi dans 70 % des cas. **Troisième étape** : opposition aux prélèvements via votre banque (gratuit depuis la directive DSP2, recevable sur 8 semaines) et action devant le juge des contentieux de la protection. Conservez tous les courriers et AR comme preuves.",
      },
      {
        q: "Puis-je résilier ma mutuelle d'entreprise obligatoire ?",
        a: "Non, en règle générale. La mutuelle d'entreprise obligatoire (article L.911-7 du Code de la sécurité sociale) est imposée aux salariés du secteur privé et n'est pas soumise à la loi du 14 juillet 2019. **Cas où la résiliation devient possible** : départ de l'entreprise (démission, licenciement, retraite — vous bénéficiez alors de la portabilité jusqu'à 12 mois), conjoint déjà couvert par une mutuelle d'entreprise obligatoire (dispense possible sur justificatif), passage à temps très partiel, ou bénéficiaire de la CSS (Complémentaire Santé Solidaire). En revanche, vous pouvez résilier votre **mutuelle individuelle complémentaire** (que vous aviez gardée en plus) à tout moment sur preuve d'adhésion à la mutuelle d'entreprise (motif légitime, article L.113-12).",
      },
    ],
  },

  // ─── Guide 15 : Opposition à prélèvement bancaire non autorisé ───
  {
    slug: "opposition-prelevement-bancaire-non-autorise",
    category: "banque-assurance",
    title: "Opposition à prélèvement bancaire : remboursement et procédure",
    metaTitle: "Opposition prélèvement bancaire — Remboursement non autorisé",
    description:
      "Prélèvement non autorisé sur votre compte ? Article L.133-18 Code monétaire : remboursement sous 1 jour ouvré. Procédure, recours, modèle.",
    relatedLetterSlug: "demande-remboursement",
    publishedAt: "2026-05-15",
    updatedAt: "2026-05-15",
    readingTime: "5 min",
    sections: [
      {
        heading: "Les types d'opposition à connaître",
        body: `Tous les prélèvements ne se contestent pas de la même manière. Avant d'agir, identifiez précisément votre situation.

**Prélèvement futur à bloquer (avant qu'il soit débité)** :
- **Révocation du mandat SEPA** : vous retirez l'autorisation donnée au créancier de prélever. Démarche auprès du créancier directement (LRAR) **et** auprès de votre banque. Effet à compter de la prochaine échéance.
- **Refus de prélèvement** : vous refusez un prélèvement annoncé mais pas encore présenté. Banque et créancier doivent être informés au moins 1 jour ouvré avant l'échéance.

**Prélèvement déjà débité à se faire rembourser** (cas le plus fréquent) :
- **Prélèvement non autorisé** : vous n'avez jamais signé de mandat avec ce créancier. Remboursement intégral immédiat (article L.133-18 du Code monétaire et financier). Délai pour réclamer : 13 mois après la date de débit.
- **Prélèvement autorisé mais contesté** : vous aviez un mandat mais le montant ou la cause sont incorrects (résiliation antérieure non prise en compte, changement de tarif non notifié, double prélèvement). Remboursement sous 8 semaines (article L.133-25). Délai pour réclamer : 8 semaines après la date de débit.
- **Prélèvement frauduleux** : utilisation détournée de votre IBAN par un tiers malveillant. Procédure d'opposition + plainte à la police + déclaration à votre banque dans les 13 mois.

Ces trois cas ont des **régimes juridiques différents** et il est crucial de bien qualifier votre situation pour utiliser la bonne procédure et le bon délai.`,
      },
      {
        heading: "Le remboursement légal sous J+1",
        body: `Pour un **prélèvement non autorisé** (vous n'avez jamais signé de mandat ou le mandat a été révoqué avant le prélèvement), l'article L.133-18 du Code monétaire et financier est très protecteur : votre banque doit vous **rembourser immédiatement, au plus tard à la fin du jour ouvré suivant votre signalement**.

**Délai pour signaler à votre banque** :
- Prélèvement non autorisé : **13 mois maximum** après la date de débit (article L.133-24)
- Prélèvement autorisé mais contesté : **8 semaines** maximum après la date de débit (article L.133-25)

**Forme du signalement** :
- Idéalement par LRAR au siège de votre banque + email à votre conseiller
- Ou directement dans votre application mobile (rubrique \"Contester un prélèvement\" / \"Opposition\")

**Effet du remboursement** :
- Banque vous recrédite immédiatement le montant
- Banque se retourne contre le créancier pour récupérer la somme
- Si le créancier prouve que le mandat était valide, la banque peut éventuellement vous rétracter le remboursement et engager une procédure (cas rare)

**Pas de frais ni pénalités** : la directive DSP2 (Directive Services de Paiement 2) interdit toute facturation de frais d'opposition, frais de dossier ou pénalités sur ces opérations. Les frais éventuels de découvert résultant du prélèvement contesté doivent aussi être remboursés.

**Cas particulier des prélèvements professionnels (B2B)** : pour les comptes professionnels avec mandat B2B (relations commerciales), les délais sont raccourcis et la contestation est plus difficile. Vérifiez votre convention de compte pro.`,
      },
      {
        heading: "Comment formaliser la demande",
        body: `**Étape 1 — Signalement à la banque (priorité absolue)**

Contactez votre banque immédiatement après avoir constaté le prélèvement contesté. Trois canaux possibles :

- **Application mobile** : rubrique \"Opposition\" ou \"Contester un prélèvement\". Le plus rapide. Fournit un horodatage immédiat.
- **Conseiller en agence** : signalement de visu, demandez un récépissé daté. Utile pour les dossiers complexes.
- **LRAR au siège de la banque** : la voie la plus formelle. Indispensable si la banque tarde ou refuse les autres canaux.

Contenu du signalement :
- Date et montant exact du prélèvement contesté
- Nom du créancier (figurant sur votre relevé)
- Référence du mandat SEPA si visible
- Motif clair : \"prélèvement non autorisé\" ou \"prélèvement contesté car [raison]\"
- Demande explicite de remboursement immédiat (article L.133-18)
- Pièces : copie du relevé de compte mentionnant le prélèvement, copie du mandat révoqué si applicable

**Étape 2 — Lettre au créancier en parallèle**

Important : votre banque vous remboursera, mais le créancier peut continuer à prélever si vous n'agissez pas en parallèle. Envoyez-lui une **LRAR de mise en demeure** :
- Demande de cessation immédiate des prélèvements
- Révocation du mandat SEPA
- Demande de remboursement des sommes indument prélevées (s'il en reste)
- Délai de 15 jours
- Mention de l'article 1343-5 du Code civil (mise en demeure)

**Étape 3 — Conservation des preuves**

Gardez précieusement : les relevés bancaires faisant apparaître les prélèvements, les copies de tous les courriers échangés, les confirmations de virement de remboursement, et toute communication avec le créancier (emails, captures SMS, journaux d'appels).`,
      },
      {
        heading: "Si la banque refuse : recours",
        body: `Très rare mais possible. La banque peut refuser le remboursement si elle considère que le mandat était valide. Dans ce cas :

**Recours 1 — Service réclamation de la banque**

Adressez une réclamation écrite au service réclamation (coordonnées dans la convention de compte ou sur le site de la banque). Délai de réponse imposé par la directive DSP2 : **15 jours ouvrables** (réponse rapide) ou **35 jours** (cas complexe avec justification). Sans réponse satisfaisante, passez au recours suivant.

**Recours 2 — Médiateur bancaire**

Tout établissement bancaire en France a un médiateur indépendant. Saisine gratuite, en ligne, après avoir épuisé le recours interne. Délai : **90 jours**. L'avis n'est pas contraignant mais les banques le suivent à environ 80 %.

Médiateurs principaux :
- Médiateur de la Fédération bancaire française (banques privées) : lemediateur.fbf.fr
- Médiateur de l'AFB (Association française des banques) : afb.fr
- Médiateurs spécifiques : LCL, BNP Paribas, Société Générale, Crédit Agricole, Crédit Mutuel ont chacun leur médiateur dédié

Pendant la médiation, **la prescription est suspendue** et vous ne pouvez pas agir en justice sur le même litige.

**Recours 3 — ACPR**

L'Autorité de contrôle prudentiel et de résolution surveille les banques. Si vous estimez que votre banque viole systématiquement la directive DSP2 ou le Code monétaire, signalez-le sur acpr.banque-france.fr. L'ACPR ne tranche pas votre litige individuel mais peut sanctionner la banque (jusqu'à plusieurs millions d'euros) et créer un précédent.

**Recours 4 — Juge**

En dernier recours : juge des contentieux de la protection (litiges < 10 000 €), gratuit, sans avocat obligatoire. Joignez tous vos courriers, l'avis du médiateur, et chiffrez votre préjudice. Les banques perdent généralement quand elles refusent un remboursement dû.`,
      },
    ],
    faq: [
      {
        q: "Combien de temps puis-je contester un prélèvement après le débit ?",
        a: "**13 mois** pour un prélèvement non autorisé (vous n'avez jamais signé de mandat avec ce créancier), conformément à l'article L.133-24 du Code monétaire et financier. **8 semaines** pour un prélèvement autorisé mais contesté (vous aviez un mandat mais le montant ou la cause sont incorrects), article L.133-25. Au-delà de ces délais, votre banque peut refuser le remboursement et vous devrez vous adresser directement au créancier en procédure classique de remboursement. Conseil : consultez votre relevé chaque mois pour repérer rapidement tout prélèvement anormal et agir dans les délais courts.",
      },
      {
        q: "La banque peut-elle refuser le remboursement ?",
        a: "Pour un prélèvement **non autorisé**, le remboursement est de droit et immédiat (article L.133-18). La banque ne peut refuser que si elle prouve que vous avez signé un mandat valide ou que vous avez agi de manière frauduleuse. Pour un prélèvement **autorisé mais contesté**, le remboursement n'est pas automatique : la banque examine le dossier et peut le refuser si elle estime que les conditions du mandat étaient respectées. Dans les deux cas, en cas de refus, vous pouvez saisir le service réclamation interne (15 jours), puis le médiateur bancaire (90 jours), puis le juge des contentieux de la protection. Un refus injustifié de remboursement engage la responsabilité civile de la banque.",
      },
      {
        q: "Comment révoquer un mandat de prélèvement SEPA ?",
        a: "**Deux étapes simultanées et obligatoires** : 1) **Auprès du créancier** par LRAR (révocation du mandat). Délai : la révocation prend effet à la prochaine échéance non encore présentée. 2) **Auprès de votre banque** par signalement écrit ou via votre application (rubrique \"Mandats de prélèvement\" → \"Révoquer\"). La banque bloque automatiquement les prélèvements futurs de ce créancier. Conseil : agissez au moins 1 jour ouvré avant la prochaine échéance pour que la révocation soit effective. Conservez l'AR du LRAR au créancier comme preuve. Si le créancier prélève quand même après la révocation, le prélèvement est non autorisé et vous bénéficiez du remboursement sous J+1.",
      },
      {
        q: "Y a-t-il des frais d'opposition à payer ?",
        a: "Non. La directive européenne DSP2 (Directive Services de Paiement 2), transposée en droit français en 2017, interdit explicitement toute facturation de frais d'opposition, frais de dossier ou pénalités sur les contestations de prélèvement. Si votre banque vous facture des frais à ce titre, c'est illégal et nul de plein droit. Demandez le remboursement par LRAR en citant l'article L.314-7 du Code monétaire et financier. Les frais de découvert éventuels résultant du prélèvement contesté doivent aussi être annulés/remboursés (article L.133-18 alinéa 2).",
      },
      {
        q: "Mon créancier prétend que le mandat était valide : que faire ?",
        a: "Demandez-lui par LRAR la **copie du mandat signé** que vous lui avez donné. Le mandat doit comporter votre signature manuscrite (ou électronique horodatée pour les mandats e-mandate), votre IBAN, le RUM (Référence Unique de Mandat), et la date. Si le créancier ne produit pas le mandat dans 8 jours, le prélèvement est juridiquement non autorisé et la banque doit rembourser. Si le créancier produit un mandat que vous contestez (signature falsifiée, conditions modifiées sans accord, etc.), faites appel à un expert graphologue pour signature contestée, et déposez plainte pour faux ou escroquerie. Conservez tout pour la procédure judiciaire éventuelle.",
      },
      {
        q: "Puis-je faire opposition pour un abonnement résilié qui prélève quand même ?",
        a: "Oui, et c'est l'un des cas les plus fréquents. Procédure : 1) **Vérifier la résiliation** auprès du créancier (relire la lettre de résiliation envoyée et l'accusé de réception). Si la résiliation est valide, le créancier n'a plus le droit de prélever. 2) **Faire opposition à votre banque** en qualifiant le prélèvement de \"non autorisé après résiliation\". Joignez la copie de votre lettre de résiliation et son AR. La banque doit rembourser sous J+1. 3) **Mise en demeure du créancier** par LRAR exigeant remboursement de tous les prélèvements postérieurs à la résiliation, citation de l'article 1343-5 du Code civil et mention que vous avez fait opposition à la banque. 4) Si le créancier refuse, saisir le médiateur compétent (médiateur de la consommation pour les services courants, médiateur des télécoms pour les opérateurs, médiateur de l'énergie pour EDF/Engie).",
      },
    ],
  },

  // ─── Guide 16 : Résilier assurance habitation ou auto (loi Hamon) ───
  {
    slug: "resilier-assurance-habitation-auto-loi-hamon",
    category: "banque-assurance",
    title: "Résilier son assurance habitation ou auto (loi Hamon)",
    metaTitle: "Résilier assurance auto ou habitation — Loi Hamon, après 1 an",
    description:
      "Loi Hamon : résiliez votre assurance auto ou habitation à tout moment après 1 an, sans frais ni motif. Procédure, délai, modèle de lettre.",
    relatedLetterSlug: "resiliation-abonnement",
    publishedAt: "2026-05-15",
    updatedAt: "2026-05-15",
    readingTime: "5 min",
    sections: [
      {
        heading: "Ce que la loi Hamon a changé",
        body: `La loi n° 2014-344 du 17 mars 2014, dite **loi Hamon** ou **loi consommation**, a profondément simplifié la résiliation des contrats d'assurance. Avant elle, il fallait guetter une fenêtre de 2 mois avant l'échéance annuelle, sous peine de reconduction tacite pour un an.

Depuis le 1er janvier 2015, vous pouvez **résilier à tout moment, après la première année de contrat, sans frais ni pénalité et sans avoir à justifier d'un motif**. La règle est codifiée à l'article L.113-15-2 du Code des assurances.

Contrats concernés par la résiliation Hamon :
- **Assurance auto et moto** (obligatoire)
- **Assurance habitation** (obligatoire pour les locataires)
- **Assurances affinitaires** : extensions de garantie, assurances de produits (téléphone, électroménager...)

Contrats **non concernés** par la loi Hamon : assurance-vie, assurance emprunteur (régie par la loi Lemoine de 2022, autre régime), garanties accidents de la vie, complémentaire santé (régie par la loi du 14 juillet 2019).

**Le grand avantage** : pour l'assurance auto et l'assurance habitation du locataire, **le nouvel assureur effectue les démarches de résiliation à votre place**. Vous signez le nouveau contrat, le nouvel assureur résilie l'ancien et coordonne les dates. Aucune rupture de couverture, aucune lettre à rédiger vous-même dans ce cas.`,
      },
      {
        heading: "Les conditions et les cas particuliers",
        body: `**Condition unique pour la résiliation Hamon** : votre contrat doit avoir **au moins 12 mois d'ancienneté**, comptés de date à date depuis la prise d'effet initiale (pas depuis le dernier renouvellement).

Avant 12 mois, la résiliation reste possible uniquement :
- à la date d'échéance annuelle, avec préavis de 2 mois (loi Chatel : l'assureur doit vous rappeler la date limite, sinon vous pouvez résilier après)
- ou pour **motif légitime** (article L.113-16 du Code des assurances) : déménagement, changement de situation matrimoniale, changement de profession, départ à la retraite, cessation d'activité. La résiliation prend alors effet 1 mois après notification, sur justificatif.

**Cas spécifiques** :
- **Vente du véhicule** : le contrat auto est suspendu de plein droit le lendemain de la cession. Vous notifiez l'assureur avec le certificat de cession ; il rembourse la portion de prime non courue.
- **Déménagement** : motif légitime de résiliation de l'assurance habitation à tout moment, même avant 1 an, sur justificatif (nouveau bail, acte de vente).
- **Hausse de tarif hors indexation contractuelle** : ouvre un droit de résiliation dans les 15 à 30 jours suivant la notification (article L.113-4), à vérifier dans vos conditions générales.
- **Double assurance** : si vous découvrez être couvert deux fois pour le même risque, vous pouvez résilier le contrat le plus récent (article L.121-4).

Pour l'assurance habitation, attention : si vous êtes **locataire**, l'assurance est **obligatoire**. Vous ne pouvez pas simplement résilier sans souscrire un nouveau contrat — vous risquez la résiliation de votre bail. Enchaînez toujours résiliation + nouveau contrat le même jour.`,
      },
      {
        heading: "La procédure pas-à-pas",
        body: `**Méthode 1 — Vous changez d'assureur (recommandée)**

Pour l'assurance **auto** et l'assurance **habitation du locataire**, laissez le nouvel assureur tout gérer :
1. Souscrivez le nouveau contrat chez le nouvel assureur, avec une date d'effet précise.
2. Le nouvel assureur envoie lui-même la demande de résiliation à votre ancien assureur et coordonne les dates.
3. L'ancien contrat prend fin 1 mois après réception de la demande ; le nouveau démarre sans rupture de couverture.
4. L'ancien assureur vous rembourse la portion de prime non courue (au prorata).

Service gratuit et prévu par la loi. Aucune lettre à rédiger.

**Méthode 2 — Vous résiliez sans repreneur immédiat** (ex : assurance affinitaire, ou vous gérez vous-même)

1. Lettre recommandée avec accusé de réception au siège de votre assureur (ou recommandé électronique, même valeur juridique).
2. Contenu : vos coordonnées, numéro de contrat, date de prise d'effet du contrat, demande de résiliation au titre de l'article L.113-15-2 du Code des assurances (loi Hamon).
3. La résiliation prend effet **1 mois après réception** de votre demande.
4. L'assureur rembourse la prime trop perçue dans les 30 jours.

Conservez l'accusé de réception : le préavis de 1 mois court à compter de cette date.

**Continuité de couverture** : pour l'auto et l'habitation locataire (obligatoires), ne résiliez jamais sans avoir le nouveau contrat prêt à prendre le relais. Pour les assurances facultatives (affinitaires), pas de contrainte.`,
      },
      {
        heading: "Les pièges et les recours",
        body: `**Piège 1 — L'assureur exige un motif**. Faux après 12 mois d'ancienneté : la loi Hamon n'impose aucun motif. Toute exigence de justification est illégale. Citez l'article L.113-15-2.

**Piège 2 — Frais de résiliation facturés**. Interdits par la loi (résiliation "sans frais ni pénalités"). Si l'assureur en facture, demandez le remboursement par LRAR.

**Piège 3 — L'assureur prétend que vous n'avez pas 12 mois**. Vérifiez la date de prise d'effet sur votre contrat ou échéancier. Si l'assureur a tort, renvoyez une LRAR avec la preuve datée.

**Piège 4 — Prélèvements après la résiliation**. Faites opposition à votre banque (gratuit, directive DSP2) et réclamez le remboursement par LRAR. Sans réponse à 15 jours, saisissez le médiateur.

**Piège 5 — Non-remboursement de la prime non courue**. L'assureur doit vous rembourser la part de cotisation correspondant à la période postérieure à la résiliation (article L.113-15-2 alinéa 4). Délai usuel : 30 jours. Au-delà, mise en demeure.

**Recours en cas de blocage** :
1. **Service réclamation de l'assureur** : réponse sous 2 mois (engagement déontologique de la profession).
2. **Médiateur de l'assurance** : gratuit, mediation-assurance.org, délai 3-6 mois, avis suivi dans environ 70 % des cas.
3. **ACPR** : pour signaler un comportement irrégulier systémique de l'assureur (ne tranche pas votre litige individuel mais peut sanctionner).
4. **Juge** : conciliateur de justice gratuit pour les petits litiges, juge des contentieux de la protection au-delà.

Pendant la médiation, la prescription est suspendue (article L.114-2 du Code des assurances) — vous ne risquez pas la forclusion.`,
      },
    ],
    faq: [
      {
        q: "Quand puis-je résilier mon assurance auto ou habitation avec la loi Hamon ?",
        a: "Après **12 mois d'ancienneté** sur votre contrat, comptés de date à date depuis la prise d'effet initiale (pas depuis le dernier renouvellement). À partir de ce moment, vous résiliez à tout moment, sans frais, sans pénalité et sans motif à fournir (article L.113-15-2 du Code des assurances). Avant 12 mois, la résiliation n'est possible qu'à l'échéance annuelle (préavis 2 mois) ou pour motif légitime : déménagement, changement de situation professionnelle ou matrimoniale, départ à la retraite (article L.113-16). La résiliation prend effet 1 mois après réception de votre demande par l'assureur.",
      },
      {
        q: "Dois-je rédiger la lettre moi-même ?",
        a: "Pas forcément. Pour l'assurance **auto** et l'assurance **habitation du locataire**, le nouvel assureur effectue gratuitement les démarches de résiliation à votre place : vous signez le nouveau contrat, il résilie l'ancien et coordonne les dates pour éviter toute rupture de couverture. Vous n'avez aucune lettre à écrire. En revanche, si vous résiliez une assurance affinitaire (extension de garantie, assurance produit) ou si vous voulez gérer vous-même, vous envoyez une lettre recommandée avec accusé de réception au siège de l'assureur en citant l'article L.113-15-2.",
      },
      {
        q: "Y a-t-il des frais à payer pour résilier ?",
        a: "Non, aucun. La loi Hamon prévoit explicitement une résiliation \"sans frais ni pénalités\" après 12 mois d'ancienneté. Toute facturation de frais de dossier, de pénalité ou de retenue sur cotisation est illégale et nulle de plein droit. Si votre assureur vous facture des frais, réclamez le remboursement par lettre recommandée en citant l'article L.113-15-2 du Code des assurances. L'assureur doit aussi vous rembourser la part de prime correspondant à la période postérieure à la résiliation effective (prorata temporis), dans un délai usuel de 30 jours.",
      },
      {
        q: "Puis-je résilier mon assurance habitation si je suis locataire ?",
        a: "Oui, mais l'assurance habitation est **obligatoire** pour les locataires. Vous ne pouvez pas rester sans assurance : un défaut d'assurance peut justifier la résiliation de votre bail par le propriétaire. La règle d'or : ne résiliez jamais l'ancien contrat sans avoir souscrit le nouveau, et faites en sorte que le nouveau prenne effet le jour même où l'ancien prend fin. Le plus simple est de laisser le nouvel assureur gérer la résiliation Hamon : il coordonne les dates pour qu'il n'y ait aucun jour sans couverture. Pour les propriétaires occupants, l'assurance habitation n'est pas légalement obligatoire (sauf copropriété), mais reste vivement recommandée.",
      },
      {
        q: "Mon assureur a augmenté ma cotisation : puis-je résilier immédiatement ?",
        a: "Cela dépend de l'origine de la hausse. Si l'augmentation résulte d'une **clause d'indexation prévue au contrat** (révision annuelle indexée sur un indice), elle est contractuelle et n'ouvre pas de droit spécifique. Si l'augmentation est **décidée unilatéralement par l'assureur hors indexation**, vous pouvez résilier dans un délai généralement de 15 à 30 jours après la notification de la hausse (article L.113-4 du Code des assurances), à vérifier dans vos conditions générales. Dans ce cas, conservez la notification de hausse et joignez-la à votre lettre. Et si vous avez plus de 12 mois d'ancienneté, la loi Hamon vous permet de toute façon de partir à tout moment, hausse ou pas.",
      },
      {
        q: "Que faire si mon assureur continue de me prélever après la résiliation ?",
        a: "Premier réflexe : faites **opposition au prélèvement** auprès de votre banque (gratuit depuis la directive DSP2, vous pouvez réclamer le remboursement sous 8 semaines). En parallèle, envoyez une **mise en demeure** par lettre recommandée à l'assureur, exigeant la cessation des prélèvements et le remboursement des sommes indûment prélevées, avec un délai de 15 jours et citation de l'article 1343-5 du Code civil. Sans réponse, saisissez le **médiateur de l'assurance** (mediation-assurance.org, gratuit, délai 3-6 mois). En dernier recours, le juge des contentieux de la protection (gratuit, sans avocat obligatoire pour les litiges inférieurs à 10 000 €).",
      },
    ],
  },

  // ─── Guide 17 : Contester des frais bancaires abusifs ───
  {
    slug: "contester-frais-bancaires-abusifs",
    category: "banque-assurance",
    title: "Contester des frais bancaires abusifs : plafonds et recours",
    metaTitle: "Contester des frais bancaires abusifs — Plafonds et lettre type",
    description:
      "Commission d'intervention, frais de rejet, frais de tenue de compte : plafonds légaux et procédure pour contester des frais bancaires abusifs.",
    relatedLetterSlug: "contestation-facture",
    publishedAt: "2026-05-15",
    updatedAt: "2026-05-15",
    readingTime: "6 min",
    sections: [
      {
        heading: "Les types de frais bancaires et leurs plafonds légaux",
        body: `Avant de contester, identifiez le type de frais prélevé sur votre relevé. La loi encadre strictement plusieurs d'entre eux.

**Commission d'intervention** : facturée quand la banque traite une opération qui dépasse votre découvert autorisé. Plafonnée par la loi (article L.312-1-3 du Code monétaire et financier et arrêté du 5 novembre 2013) à **8 € par opération et 80 € par mois**. Pour les clients en situation de **fragilité financière**, le plafond tombe à **4 € par opération et 20 € par mois**.

**Frais de rejet** :
- Rejet de prélèvement ou de virement pour provision insuffisante : plafonné à **20 €** (peut être inférieur au montant de l'opération rejetée).
- Rejet de chèque : plafonné à **30 €** pour un chèque inférieur ou égal à 50 €, **50 €** pour un chèque supérieur à 50 €.

**Plafond global pour les clients fragiles** : depuis 2019, l'ensemble des frais d'incident est plafonné à **25 € par mois** pour les personnes en situation de fragilité financière, et à **20 € par mois** (plus une offre client spécifique à 3 €/mois) pour celles qui souscrivent l'offre dédiée.

**Frais de tenue de compte, frais de carte, frais d'inactivité** : non plafonnés par la loi, mais doivent figurer dans la convention de compte signée. S'ils n'y figurent pas ou s'ils ont augmenté sans notification préalable de 2 mois, ils sont contestables.

**Frais pour opérations à l'étranger, commissions de change** : encadrés pour les paiements en euros dans l'UE (règlement européen 2019/518), libres hors zone euro mais doivent être transparents.

Première action : récupérez vos 12 derniers relevés et listez chaque ligne de frais. Beaucoup de banques dépassent les plafonds par erreur de paramétrage.`,
      },
      {
        heading: "Quand les frais sont contestables",
        body: `Tous les frais ne sont pas contestables, mais plusieurs situations ouvrent un droit clair à remboursement.

**Frais dépassant les plafonds légaux** : si votre banque facture une commission d'intervention à 10 € au lieu de 8 €, ou dépasse 80 €/mois, le surplus est récupérable de plein droit. C'est l'erreur la plus fréquente et la plus simple à prouver (le relevé fait foi).

**Frais non prévus à la convention de compte** : la banque ne peut facturer que les frais explicitement mentionnés dans la convention que vous avez signée. Un frais "surprise" non listé est contestable.

**Frais augmentés sans notification** : toute modification tarifaire doit vous être notifiée **au moins 2 mois avant son entrée en vigueur** (article L.312-1-1 du Code monétaire et financier). Sans notification, la hausse est inopposable.

**Frais en cascade abusifs** : un seul incident qui génère une avalanche de frais (rejet → commission → nouveau rejet → nouvelle commission) peut être contesté pour disproportion, surtout si la banque aurait pu vous alerter avant.

**Frais facturés à un client fragile sans application du plafonnement** : si vous remplissez les critères de fragilité financière (inscription au FICP, surendettement, ou détection par la banque selon ses propres critères) et que la banque ne vous a pas appliqué le plafond de 25 €/mois, vous pouvez réclamer.

**Frais sur un compte clôturé ou inactif non signalé** : la banque doit vous prévenir avant de facturer des frais d'inactivité, et la clôture de compte est gratuite (article L.312-1-7).

En revanche, des frais correctement plafonnés, prévus au contrat et notifiés ne sont pas "abusifs" au sens juridique — même s'ils sont élevés. Dans ce cas, le levier est la négociation commerciale ou le changement de banque, pas la contestation.`,
      },
      {
        heading: "La procédure de contestation",
        body: `**Étape 1 — Réclamation écrite à votre agence**

Adressez un courrier (recommandé avec accusé de réception de préférence) à votre conseiller ou au directeur d'agence. Contenu :
- Identification (numéro de compte)
- Liste précise et datée des frais contestés, ligne par ligne
- Motif de contestation pour chaque frais (dépassement de plafond, absence de notification, frais non prévu...)
- Référence des textes : article L.312-1-3 du Code monétaire et financier pour les plafonds, arrêté du 5 novembre 2013
- Demande de remboursement chiffrée
- Délai de réponse souhaité (15 jours)

Beaucoup de litiges se règlent à ce stade : les conseillers ont une marge de geste commercial et préfèrent rembourser plutôt que perdre un client.

**Étape 2 — Service réclamation du siège**

Si l'agence ne répond pas ou refuse, saisissez le **service réclamation** de la banque (coordonnées dans la convention de compte ou sur le site). Délai de réponse imposé par la réglementation : **15 jours ouvrables**, ou jusqu'à 35 jours pour les cas complexes (avec justification).

**Étape 3 — Médiateur bancaire**

Sans réponse satisfaisante, saisissez gratuitement le **médiateur de votre banque** (chaque établissement en a un, indépendant). Saisine en ligne après épuisement du recours interne. Délai : **90 jours**. L'avis n'est pas contraignant mais les banques le suivent dans environ 80 % des cas.

Coordonnées des principaux médiateurs : Médiateur de la FBF (lemediateur.fbf.fr) pour les banques privées, ou médiateurs dédiés (BNP Paribas, Société Générale, Crédit Agricole, LCL, Crédit Mutuel, La Banque Postale ont chacun le leur).

**Étape 4 — Juge ou signalement**

En dernier recours : juge des contentieux de la protection (gratuit, sans avocat, litiges < 10 000 €). En parallèle, signalez les pratiques abusives à l'**ACPR** (acpr.banque-france.fr) : elle ne tranche pas votre litige individuel mais peut sanctionner la banque.`,
      },
      {
        heading: "Changer de banque : le vrai levier de négociation",
        body: `La contestation règle le passé. Pour l'avenir, le levier le plus efficace contre les frais abusifs est la **menace crédible de départ** — et le passage à l'acte si nécessaire.

**Le mandat de mobilité bancaire** (loi Macron, article L.312-1-7 du Code monétaire et financier) : depuis 2017, changer de banque est devenu très simple. Votre nouvelle banque s'occupe gratuitement de tout :
- Transfert automatique de tous vos virements et prélèvements récurrents
- Information de vos créanciers et débiteurs (employeur, organismes)
- Le tout en **22 jours ouvrés** maximum

La clôture de l'ancien compte est **gratuite et sans frais** (article L.312-1-7). La banque ne peut pas vous facturer la fermeture.

**Avant de partir, négociez** : prenez rendez-vous avec votre conseiller, listez les frais que vous jugez excessifs, et annoncez clairement que vous comparez avec d'autres banques (notamment les banques en ligne qui ont souvent zéro frais de tenue de compte). Les banques traditionnelles ont des marges de geste commercial importantes pour retenir un client rentable.

**Les banques en ligne et néobanques** : pour un profil sans besoin de conseil physique, elles éliminent l'essentiel des frais (tenue de compte, carte, virements). Comparez sur les comparateurs indépendants en regardant le coût annuel total, pas juste la prime de bienvenue.

**Cas du client fragile** : si vous êtes en situation de fragilité financière, vous avez droit à l'**offre client fragile** (anciennement "offre spécifique") à 3 €/mois maximum, qui plafonne les frais d'incident et inclut des moyens de paiement adaptés. La banque doit vous la proposer activement ; si elle ne le fait pas, exigez-la par écrit.

Conserver les preuves : convention de compte signée, relevés, courriers échangés. En cas de changement de banque, gardez l'accès aux relevés de l'ancien compte pendant au moins 5 ans.`,
      },
    ],
    faq: [
      {
        q: "Quel est le plafond légal des frais bancaires ?",
        a: "Plusieurs plafonds existent. La **commission d'intervention** est plafonnée à 8 € par opération et 80 € par mois (4 € et 20 € pour les clients en situation de fragilité financière), selon l'arrêté du 5 novembre 2013. Les **frais de rejet** de prélèvement sont plafonnés à 20 €, les frais de rejet de chèque à 30 € (chèque ≤ 50 €) ou 50 € (chèque > 50 €). Pour les clients en fragilité financière, l'ensemble des frais d'incident est plafonné à 25 € par mois. Les frais de tenue de compte et de carte ne sont pas plafonnés par la loi, mais doivent figurer dans votre convention de compte et toute hausse doit être notifiée 2 mois à l'avance.",
      },
      {
        q: "Comment savoir si je suis considéré comme \"client fragile\" ?",
        a: "La fragilité financière est appréciée par votre banque selon des critères réglementaires et ses propres indicateurs (article R.312-4-3 du Code monétaire et financier). Sont notamment concernés : les personnes inscrites au FICP (Fichier des Incidents de remboursement des Crédits aux Particuliers), celles ayant déposé un dossier de surendettement, ou celles qui cumulent au moins 5 irrégularités de fonctionnement ou incidents de paiement sur un même mois. Si vous remplissez ces critères, la banque doit vous appliquer le plafonnement à 25 €/mois et vous proposer l'offre client fragile à 3 €/mois maximum. Si elle ne le fait pas spontanément, exigez-le par écrit en citant l'article L.312-1-3.",
      },
      {
        q: "Sur combien de temps puis-je réclamer des frais déjà prélevés ?",
        a: "Le délai de prescription pour réclamer des frais bancaires indûment prélevés est de **5 ans** (article 2224 du Code civil, prescription de droit commun). Vous pouvez donc remonter jusqu'à 5 ans en arrière. En pratique, concentrez-vous sur les 12-24 derniers mois : les preuves sont plus accessibles et le dossier plus simple à instruire. Récupérez vos relevés (la banque doit les conserver et vous les fournir gratuitement) et listez chaque ligne de frais contestée avec sa date. Plus votre réclamation est précise et chiffrée, plus elle a de chances d'aboutir rapidement.",
      },
      {
        q: "La banque peut-elle augmenter ses frais sans me prévenir ?",
        a: "Non. Toute modification du tarif de vos frais bancaires doit vous être communiquée par écrit (courrier ou support durable) **au moins 2 mois avant son entrée en vigueur** (article L.312-1-1 du Code monétaire et financier). Sans cette notification préalable, la hausse est inopposable et vous pouvez en demander le remboursement. La notification doit aussi vous rappeler que vous disposez d'un droit de résiliation sans frais si vous refusez la nouvelle tarification. Si vous ne réagissez pas dans les 2 mois, vous êtes réputé avoir accepté. Conservez toujours les courriers d'information tarifaire que la banque vous envoie.",
      },
      {
        q: "Que faire si la banque refuse de me rembourser ?",
        a: "Suivez la procédure par étapes. **1.** Réclamation écrite à l'agence (recommandé avec AR), délai 15 jours. **2.** Si refus, saisine du service réclamation du siège — la réglementation impose une réponse sous 15 jours ouvrables (35 jours pour les cas complexes). **3.** Si toujours pas satisfait, saisine gratuite du médiateur bancaire de votre établissement (chaque banque a le sien, indépendant), délai 90 jours, avis suivi dans ~80 % des cas. **4.** En dernier recours, le juge des contentieux de la protection (gratuit, sans avocat obligatoire, litiges < 10 000 €). Signalez en parallèle les pratiques à l'ACPR (acpr.banque-france.fr) qui peut sanctionner la banque même si elle ne tranche pas votre cas individuel.",
      },
      {
        q: "Changer de banque est-il vraiment gratuit et simple ?",
        a: "Oui. Depuis la loi Macron de 2015 (entrée en vigueur 2017), le **mandat de mobilité bancaire** rend le changement quasi automatique : votre nouvelle banque s'occupe gratuitement de transférer tous vos virements et prélèvements récurrents et d'informer vos créanciers et débiteurs, en 22 jours ouvrés maximum (article L.312-1-7 du Code monétaire et financier). La clôture de l'ancien compte est gratuite — aucune banque ne peut facturer la fermeture. C'est votre meilleur levier de négociation : annoncer à votre conseiller que vous comparez avec la concurrence pousse souvent la banque à faire un geste sur les frais. Si le geste n'est pas suffisant, le passage à l'acte est réellement simple aujourd'hui.",
      },
    ],
  },

  // ─── Guide 18 : Mise en demeure trouble de voisinage ───
  {
    slug: "mise-en-demeure-trouble-voisinage",
    category: "logement-bail",
    title: "Mise en demeure d'un voisin : trouble de voisinage",
    metaTitle: "Mise en demeure voisin — Trouble de voisinage, procédure 2026",
    description:
      "Bruit, nuisances, empiètement : comment mettre en demeure un voisin. Trouble anormal de voisinage, conciliation obligatoire, recours, modèle de lettre.",
    relatedLetterSlug: "mise-en-demeure-executer",
    publishedAt: "2026-05-15",
    updatedAt: "2026-05-15",
    readingTime: "6 min",
    sections: [
      {
        heading: "Qu'est-ce qu'un trouble anormal de voisinage",
        body: `Le **trouble anormal de voisinage** est une notion construite par la jurisprudence, désormais consacrée par la loi du 15 avril 2024 qui l'a inscrite à l'article 1253 du Code civil. Le principe : nul ne doit causer à autrui un trouble qui excède les **inconvénients normaux du voisinage**.

La clé est le mot **"anormal"**. Tout désagrément de voisinage n'est pas un trouble réparable : il faut que la gêne dépasse ce qu'on peut raisonnablement tolérer en vivant à proximité d'autrui. Le juge apprécie au cas par cas, selon plusieurs critères : l'intensité, la durée, la répétition, le moment (jour/nuit), l'environnement (zone rurale calme vs centre-ville animé), et l'antériorité (qui était là en premier).

**Troubles fréquemment reconnus comme anormaux** :
- **Bruit** : musique forte répétée, aboiements incessants, travaux hors horaires autorisés, fêtes nocturnes régulières
- **Nuisances olfactives** : odeurs de fumée, de cuisine, de déjections animales, dépôts d'ordures
- **Nuisances visuelles** : dépôt permanent de détritus, construction dégradant la vue de façon excessive
- **Empiètement** : haie, arbre, construction qui déborde sur votre terrain ; branches qui surplombent
- **Privation d'ensoleillement ou de vue** par une construction ou une végétation excessive
- **Écoulement d'eaux**, infiltrations causées par le voisin

**Troubles généralement non retenus** : un bruit occasionnel et modéré, les bruits de la vie courante (pas, conversations normales), une gêne purement subjective sans répétition ni intensité particulière.

Le trouble est apprécié objectivement : c'est l'anormalité de la gêne qui compte, pas l'intention de nuire du voisin. Même un voisin de bonne foi peut être responsable d'un trouble anormal.`,
      },
      {
        heading: "Les étapes amiables avant la mise en demeure",
        body: `La justice attend de vous une tentative de résolution amiable progressive. Brûler les étapes affaiblit votre dossier.

**Étape 1 — Le dialogue direct**. Aussi frustrant que cela puisse paraître, commencez par parler à votre voisin, calmement, en exposant concrètement la gêne. Beaucoup de troubles cessent à ce stade, le voisin n'ayant pas conscience du dérangement. Notez la date de cette démarche.

**Étape 2 — Constituer un dossier de preuves**. C'est l'étape décisive et trop souvent négligée. Rassemblez :
- Un **journal des nuisances** daté et détaillé (date, heure, durée, nature, intensité de chaque incident)
- Des **enregistrements** audio ou vidéo horodatés (smartphone)
- Des **témoignages écrits** d'autres voisins ou de visiteurs (attestation sur l'honneur, modèle CERFA 11527)
- Des **constats** : main courante au commissariat pour le bruit, constat de commissaire de justice (ex-huissier, 200-400 €) pour un trouble matériel ou un empiètement
- Pour le bruit : éventuellement un **constat de mesure acoustique** par un acousticien ou les services d'hygiène de la mairie

**Étape 3 — Le courrier simple de demande amiable**. Avant la mise en demeure formelle, un premier courrier écrit (simple ou recommandé) qui expose le trouble, demande qu'il cesse, et propose une discussion. Il montre votre bonne foi et marque le point de départ écrit du litige.

Sans réaction à ce courrier dans un délai raisonnable (15 jours à 1 mois), passez à la mise en demeure formelle.`,
      },
      {
        heading: "Rédiger la mise en demeure",
        body: `La mise en demeure est le courrier formel qui précède la phase judiciaire. Elle doit être précise, factuelle et documentée.

**Contenu** :
- Vos coordonnées complètes et celles du voisin (nom, adresse)
- La qualification juridique : "trouble anormal de voisinage" au sens de l'article 1253 du Code civil
- La description **précise et chronologique** des nuisances : nature, fréquence, horaires, durée, depuis quelle date
- Le rappel de vos démarches amiables antérieures (dialogue, courrier simple) avec leurs dates
- La référence aux preuves constituées (journal de nuisances, témoignages, constats — sans forcément les joindre, mais en les mentionnant)
- La **demande explicite** : cessation du trouble, et le cas échéant remise en état (élagage, retrait d'un dépôt, insonorisation)
- Un **délai raisonnable** pour agir : 8 à 15 jours pour un trouble simple à faire cesser, jusqu'à 1 mois pour des travaux (élagage, insonorisation)
- L'annonce des **conséquences** en cas d'inaction : saisine du conciliateur de justice puis du tribunal, demande de dommages-intérêts pour le préjudice subi, demande de cessation sous astreinte

**Forme** : lettre recommandée avec accusé de réception, impérativement. C'est la preuve datée que le voisin a été formellement informé et mis en demeure d'agir.

**Ton** : factuel et ferme, jamais insultant ni menaçant au-delà des recours légaux. Un courrier agressif peut se retourner contre vous (le voisin pourrait invoquer un harcèlement). Restez sur le terrain des faits et du droit.

Conservez une copie de la lettre et l'accusé de réception : ils constituent une pièce maîtresse de votre futur dossier judiciaire.`,
      },
      {
        heading: "Les recours : conciliation obligatoire, puis tribunal",
        body: `Si la mise en demeure reste sans effet, la voie judiciaire s'ouvre — mais elle est désormais précédée d'une étape obligatoire.

**La conciliation préalable obligatoire**. Pour les conflits de voisinage, une tentative de résolution amiable (conciliation, médiation ou procédure participative) est **obligatoire avant de saisir le juge**, quel que soit le montant du litige (article 750-1 du Code de procédure civile, renforcé par les réformes récentes). Sans cette tentative, votre assignation est irrecevable.

Le **conciliateur de justice** est gratuit. Saisine en ligne sur conciliateurs.fr ou auprès du tribunal / de la mairie. Il convoque les deux parties et tente de trouver un accord. Délai : 1 à 3 mois. En cas d'accord, un constat est signé et a force exécutoire si homologué par le juge. En cas d'échec, le conciliateur délivre un constat de non-conciliation qui ouvre la voie judiciaire.

**Le constat de commissaire de justice**. En parallèle, faire dresser un constat par un commissaire de justice (ex-huissier) renforce considérablement votre dossier — il fait foi devant le tribunal. Coût : 200 à 400 € selon la complexité, récupérable si vous gagnez.

**La saisine du tribunal judiciaire**. Si la conciliation échoue, vous saisissez le tribunal judiciaire. Vous pouvez demander :
- La **cessation du trouble**, le cas échéant **sous astreinte** (somme due par jour de retard)
- La **remise en état** (élagage, démolition d'un ouvrage en infraction, travaux d'insonorisation)
- des **dommages-intérêts** pour le préjudice subi (perte de jouissance, préjudice moral, frais engagés)

Pour les litiges jusqu'à 10 000 €, l'avocat n'est pas obligatoire et la procédure est gratuite. Au-delà, l'avocat devient obligatoire.

**Protection juridique** : vérifiez votre contrat d'assurance habitation — beaucoup incluent une garantie "protection juridique" qui prend en charge les frais de procédure et l'assistance d'un avocat pour les litiges de voisinage. C'est souvent oublié et très utile.

**Cas du locataire** : si vous êtes locataire et que le trouble vient d'un autre locataire du même bailleur, alertez aussi le propriétaire par LRAR : il a l'obligation de garantir la jouissance paisible du logement et peut agir contre le locataire fautif.`,
      },
    ],
    faq: [
      {
        q: "Qu'est-ce qui distingue un trouble \"normal\" d'un trouble \"anormal\" de voisinage ?",
        a: "Le caractère **anormal** signifie que la gêne dépasse les inconvénients que l'on doit raisonnablement tolérer en vivant à proximité d'autrui (article 1253 du Code civil, consacré par la loi du 15 avril 2024). Le juge apprécie selon plusieurs critères : l'intensité de la gêne, sa durée, sa répétition, le moment (jour/nuit), l'environnement (un bruit toléré en centre-ville ne l'est pas en zone rurale calme) et l'antériorité. Un bruit occasionnel et modéré, les bruits de la vie courante ne sont pas anormaux. En revanche, une musique forte répétée, des aboiements incessants, des odeurs persistantes, un empiètement matériel le sont. Le trouble s'apprécie objectivement : même un voisin de bonne foi peut être responsable.",
      },
      {
        q: "Dois-je tenter un règlement amiable avant d'aller au tribunal ?",
        a: "Oui, c'est obligatoire. Pour les conflits de voisinage, une tentative de résolution amiable préalable (conciliation, médiation ou procédure participative) est exigée avant toute saisine du juge, quel que soit le montant (article 750-1 du Code de procédure civile). Sans cette tentative, votre assignation sera déclarée irrecevable. Le plus simple et gratuit est de saisir un **conciliateur de justice** (conciliateurs.fr). Au-delà de l'obligation légale, c'est aussi tactiquement utile : un dossier qui montre une escalade progressive et raisonnable (dialogue, courrier, mise en demeure, conciliation) est beaucoup plus solide devant le juge qu'une action brutale.",
      },
      {
        q: "Quelles preuves dois-je réunir contre mon voisin ?",
        a: "Constituez un dossier le plus complet possible : un **journal des nuisances** daté et détaillé (date, heure, durée, nature de chaque incident) ; des **enregistrements** audio/vidéo horodatés ; des **témoignages écrits** d'autres voisins ou de visiteurs (attestation sur l'honneur, modèle CERFA 11527) ; des **mains courantes** déposées au commissariat pour le bruit ; un **constat de commissaire de justice** (ex-huissier) pour un trouble matériel ou un empiètement (200-400 €, déterminant devant le juge) ; et pour le bruit, éventuellement une **mesure acoustique** par les services d'hygiène de la mairie ou un acousticien. Plus le dossier est documenté et étalé dans le temps, plus il établit le caractère répété et anormal du trouble.",
      },
      {
        q: "Quel délai accorder à mon voisin dans la mise en demeure ?",
        a: "Le délai doit être proportionné à ce qui est demandé. Pour faire **cesser un comportement** (baisser le volume, arrêter des nuisances), 8 à 15 jours suffisent. Pour des **travaux** (élaguer une haie ou un arbre, retirer un dépôt, réaliser une insonorisation), accordez 15 jours à 1 mois selon l'ampleur. Mentionnez une date butoir précise (\"avant le [date] inclus\"). Un délai trop court (moins de 8 jours) peut être jugé déraisonnable ; un délai trop long affaiblit l'effet de la mise en demeure. L'envoi se fait en lettre recommandée avec accusé de réception : c'est la preuve datée que le voisin a été formellement informé.",
      },
      {
        q: "Mon voisin est locataire : qui dois-je mettre en demeure ?",
        a: "Mettez en demeure **le voisin lui-même**, auteur du trouble, qui est responsable de son comportement. Mais si ce voisin est locataire, alertez **également son propriétaire bailleur** par lettre recommandée. Le bailleur a une obligation légale de garantir la jouissance paisible des lieux et peut agir contre son locataire fautif (rappel à l'ordre, voire résiliation du bail pour troubles de voisinage caractérisés). Doubler la mise en demeure (locataire fautif + son bailleur) augmente la pression et la probabilité que le trouble cesse. Si vous êtes vous-même locataire, signalez aussi le trouble à votre propre bailleur, qui vous doit la jouissance paisible de votre logement.",
      },
      {
        q: "Puis-je obtenir des dommages-intérêts pour le trouble subi ?",
        a: "Oui. Si le trouble est reconnu anormal, le juge peut condamner le voisin à vous verser des dommages-intérêts en réparation du préjudice subi : perte de jouissance de votre logement, préjudice moral (stress, fatigue liée au bruit), frais que vous avez engagés (constat d'huissier, mesure acoustique, déménagement temporaire). Le juge peut aussi ordonner la **cessation du trouble sous astreinte** (une somme due par le voisin pour chaque jour de retard à se conformer) et la **remise en état** (élagage, démolition d'un ouvrage en infraction, insonorisation). Pensez à vérifier la garantie \"protection juridique\" de votre assurance habitation : elle prend souvent en charge les frais de procédure et l'assistance d'un avocat pour ce type de litige.",
      },
    ],
  },

  // ─── Guide 19 : Heures supplémentaires impayées (Lot C 2026-05-16) ───
  {
    slug: "reclamer-heures-supplementaires-impayees",
    category: "travail",
    title: "Heures supplémentaires impayées : comment réclamer son dû à l'employeur",
    metaTitle: "Heures supplémentaires impayées — réclamer à son employeur",
    description:
      "Heures sup non payées ? Mise en demeure de l'employeur, articles L3171-4 et L3245-1, charge de la preuve partagée. Le guide complet pour récupérer son dû.",
    relatedLetterSlug: "mise-en-demeure-payer",
    publishedAt: "2026-05-16",
    updatedAt: "2026-05-16",
    readingTime: "6 min",
    sections: [
      {
        heading: "Heures supplémentaires : de quoi parle-t-on exactement ?",
        body: `Les heures supplémentaires sont les heures de travail effectuées au-delà de la durée légale, fixée à **35 heures par semaine** par l'article L3121-27 du Code du travail. Elles ouvrent droit à une majoration de salaire ou, par accord collectif, à un repos compensateur équivalent.

Le taux de majoration est défini en priorité par la convention ou l'accord collectif applicable à l'entreprise. À défaut d'accord, c'est le Code du travail qui s'applique : **25 % pour les 8 premières heures supplémentaires** de la semaine (de la 36e à la 43e heure) et **50 % au-delà** de la 43e heure, selon l'article L3121-36.

Attention au piège : toutes les heures travaillées au-delà de 35 heures ne sont pas mécaniquement des heures supplémentaires. Si vous êtes au forfait jours, ou si votre contrat prévoit une durée différente (par exemple 39 heures hebdomadaires avec RTT), le mode de décompte change. C'est la durée *réellement effectuée* sur la semaine — et non l'horaire affiché sur votre fiche de paie — qui sert de référence devant le juge.

Plusieurs situations entraînent automatiquement la qualification d'heures supplémentaires, même sans demande formelle écrite :
- Travail explicitement demandé par l'employeur (mail, SMS, demande orale prouvable par témoins)
- Travail réalisé avec son accord tacite — par exemple si votre supérieur ne pouvait pas ignorer que vous restiez tard et n'a rien dit
- Travail rendu nécessaire par l'accomplissement de vos missions, même non expressément demandé`,
      },
      {
        heading: "Le cadre juridique : ce que dit vraiment le Code du travail",
        body: `Trois articles structurent toute la matière. **L'article L3121-28 du Code du travail** prévoit que toute heure effectuée au-delà de la durée légale donne lieu à majoration. **L'article L3121-36** fixe les taux par défaut (25 % et 50 %). **L'article L3245-1** vous donne **3 ans** à compter de la date à laquelle le salaire aurait dû être versé pour réclamer les sommes dues — passé ce délai, la créance est prescrite et définitivement perdue.

Vous pouvez donc remonter jusqu'à trois années glissantes. Concrètement, en mai 2026, vous pouvez encore réclamer les heures supplémentaires impayées depuis mai 2023 — mais pas au-delà.

La question décisive, dans la quasi-totalité des litiges aux prud'hommes, est celle de la preuve. C'est sur ce point que l'article **L3171-4** est central. Il prévoit qu'en cas de litige sur le nombre d'heures effectuées, le salarié doit présenter « des éléments suffisamment précis quant aux heures non rémunérées qu'il prétend avoir accomplies ». L'employeur doit alors « fournir au juge les éléments de nature à justifier les horaires effectivement réalisés ».

La jurisprudence est constante depuis l'arrêt de la Cour de cassation du **18 mars 2020 (Cass. soc., n° 18-10.919)** : le salarié n'a pas à prouver formellement toutes ses heures. Il lui suffit de produire des indices crédibles — captures d'emails envoyés tôt ou tard, tableaux personnels reconstitués, témoignages, relevés de badge, agendas Outlook, SMS professionnels. C'est ensuite à l'employeur d'apporter ses propres décomptes contradictoires.

> [!CONSEIL]
> La charge de la preuve est **partagée**, pas portée par le seul salarié. Vous n'avez pas besoin d'un dossier irréfutable au départ : un tableau de vos horaires reconstitué a posteriori, quelques captures d'emails envoyés à 21 h, ou un témoignage écrit de collègue suffisent à enclencher la procédure. C'est ensuite à l'employeur de produire ses propres relevés — et s'il n'en tient pas, le doute profite au salarié. Beaucoup de salariés abandonnent en croyant qu'il faut tout prouver seuls. C'est faux, et l'employeur compte parfois sur cette erreur.`,
      },
      {
        heading: "Comment réclamer concrètement : du mail à la mise en demeure",
        body: `La réclamation se construit en trois temps, du plus informel au plus contraignant.

**Étape 1 — Demande écrite simple.** Envoyez d'abord un mail à votre responsable RH ou à votre supérieur hiérarchique. Exposez les faits : période concernée, nombre approximatif d'heures réclamées, demande de régularisation. Ce premier écrit n'a pas en lui-même de portée juridique forte, mais il constitue un commencement de preuve si l'employeur ne réagit pas, et il vous permet parfois d'obtenir une régularisation à l'amiable. Conservez systématiquement une trace (PDF de l'email envoyé, accusé de lecture si possible).

**Étape 2 — Mise en demeure par lettre recommandée AR.** Si la demande informelle reste sans réponse au bout de 15 jours, ou si la réponse est un refus, passez à la mise en demeure. Cette lettre doit contenir :
- Votre identité complète, votre poste et votre date d'entrée dans l'entreprise
- La période couverte par la réclamation (du JJ/MM/AAAA au JJ/MM/AAAA)
- Un décompte chiffré des heures supplémentaires impayées, semaine par semaine si possible, avec le taux de majoration applicable
- Le montant total réclamé (heures × taux horaire brut × majoration)
- Un délai imparti pour le paiement (généralement 15 jours)
- La mention expresse qu'à défaut, vous saisirez le conseil de prud'hommes
- Le visa des articles L3171-4 et L3245-1 du Code du travail

L'envoi en recommandé avec accusé de réception est indispensable. C'est lui qui **interrompt la prescription triennale** (article 2240 du Code civil) et constitue la preuve formelle, datée, de votre réclamation. Un email ou un courrier simple ne suffisent pas.

**Étape 3 — Saisine du conseil de prud'hommes.** Sans paiement ou accord amiable dans le délai imparti, vous saisissez le conseil de prud'hommes du lieu de votre travail. La procédure est gratuite, ne nécessite pas obligatoirement d'avocat (mais c'est recommandé au-delà de quelques milliers d'euros), et débute par une phase de conciliation obligatoire. Les pièces produites à ce stade — votre mise en demeure, vos décomptes, vos preuves indiciaires — forment le socle du dossier.`,
      },
      {
        heading: "Que faire si l'employeur refuse de payer ou ne répond pas ?",
        body: `Le silence de l'employeur, après mise en demeure, équivaut à un refus. Plusieurs leviers existent en parallèle de la saisine prud'homale, et peuvent être actionnés simultanément.

**Saisir l'inspection du travail.** L'inspecteur du travail peut être saisi par courrier simple ou via la DREETS. Il a accès aux registres de l'entreprise, peut interroger l'employeur, et dresser un procès-verbal transmis au parquet en cas d'infraction caractérisée — par exemple un travail dissimulé par dissimulation d'heures. Cette saisine est gratuite et peut être anonyme.

**Demander la requalification en travail dissimulé.** L'article L8221-5 du Code du travail considère comme travail dissimulé toute mention sur le bulletin de paie d'un nombre d'heures inférieur à celui réellement effectué — dès lors que l'employeur a agi de manière intentionnelle. Si cette qualification est retenue par les prud'hommes, vous pouvez prétendre à une **indemnité forfaitaire de 6 mois de salaire** (article L8223-1), qui se cumule intégralement avec le rappel d'heures supplémentaires lui-même.

**Demander la résiliation judiciaire du contrat de travail.** Si le non-paiement persiste et constitue un manquement grave de l'employeur à ses obligations, vous pouvez demander aux prud'hommes la résiliation judiciaire à ses torts (Cass. soc., 7 juin 2017, n° 16-13.808). Les effets sont ceux d'un licenciement sans cause réelle et sérieuse : indemnité de licenciement, indemnité compensatrice de préavis, dommages et intérêts.

**Ne démissionnez pas dans la précipitation.** C'est l'erreur la plus coûteuse. Une démission classique vous prive de toute indemnité, de l'assurance chômage, et complique la suite. Si vous voulez quitter l'entreprise, demandez la résiliation judiciaire (procédure ci-dessus) ou prenez acte de la rupture aux torts de l'employeur — démarche risquée qui doit impérativement être préparée avec un avocat ou un défenseur syndical.`,
      },
    ],
    faq: [
      {
        q: "Quel délai ai-je pour réclamer des heures supplémentaires non payées ?",
        a: "Trois ans à compter de la date à laquelle le salaire aurait dû être versé, selon l'article L3245-1 du Code du travail. Concrètement, en mai 2026, vous pouvez remonter jusqu'aux heures supplémentaires non payées depuis mai 2023 — mais pas au-delà. Attention : ce délai court mois par mois. Plus vous attendez, plus les périodes les plus anciennes tombent en prescription et sont définitivement perdues. L'envoi d'une mise en demeure en recommandé AR interrompt la prescription : à compter de sa réception par l'employeur, un nouveau délai de 3 ans repart à zéro (article 2240 du Code civil). C'est pour cette raison qu'il faut envoyer la mise en demeure dès que possible, même si vous n'êtes pas encore prêt à saisir les prud'hommes.",
      },
      {
        q: "Mon employeur peut-il refuser de me payer des heures que je n'ai pas demandé à faire ?",
        a: "Pas systématiquement. Les heures supplémentaires sont dues dès lors qu'elles ont été effectuées avec **l'accord, même tacite, de l'employeur**. La jurisprudence considère que si l'employeur ne pouvait pas ignorer que le salarié restait au-delà de ses horaires et n'a pas réagi pour l'en empêcher, son accord est présumé. Inversement, si l'employeur a expressément interdit les heures supplémentaires et qu'il peut le prouver (note de service écrite, mail formel, témoins), il peut en refuser le paiement. En pratique, dans la grande majorité des litiges, l'accord tacite est retenu — surtout quand la charge de travail rendait objectivement les heures supplémentaires inévitables pour accomplir les missions confiées.",
      },
      {
        q: "Quelles preuves dois-je apporter ?",
        a: "Vous n'avez pas à produire une preuve formelle et complète. L'article L3171-4 du Code du travail prévoit que la charge de la preuve est partagée : vous devez apporter des « éléments suffisamment précis » pour étayer votre demande, et c'est ensuite à l'employeur de produire ses propres décomptes. Les éléments admis par les juges sont nombreux : tableau de vos horaires reconstitué à la main, captures d'écran d'emails envoyés tôt le matin ou tard le soir, relevés de badgeuse, agendas Outlook, témoignages écrits de collègues, SMS professionnels. Un seul de ces éléments suffit souvent à enclencher la procédure. C'est ensuite à l'employeur de prouver des horaires différents — et s'il ne tient pas de registre fiable des temps de travail, le doute profite au salarié.",
      },
      {
        q: "Que faire si je suis au forfait jours ?",
        a: "Le forfait jours obéit à un régime différent : vous n'êtes pas payé en heures mais en jours travaillés (218 jours maximum par an pour un temps plein, article L3121-64 du Code du travail). En principe, il n'y a donc pas d'heures supplémentaires au sens strict. Mais le forfait jours suppose le respect de plusieurs garanties : repos quotidien de 11 heures, repos hebdomadaire de 35 heures consécutives, entretien annuel sur la charge de travail. Si ces garanties n'ont pas été respectées, le forfait peut être déclaré privé d'effet par les prud'hommes — et l'intégralité des heures effectuées au-delà de 35 h par semaine devient alors récupérable en heures supplémentaires. C'est une procédure puissante, mais technique : un défenseur syndical ou un avocat est vivement recommandé.",
      },
      {
        q: "Puis-je être licencié si je réclame mes heures supplémentaires ?",
        a: "Non. Vous bénéficiez d'une protection légale contre les représailles. Tout licenciement motivé — directement ou indirectement — par votre réclamation est nul. Si vous êtes licencié peu après votre démarche et que vous pouvez établir un lien chronologique et factuel (par exemple un licenciement pour insuffisance professionnelle trois semaines après votre mise en demeure, sans avertissement préalable), la nullité du licenciement peut être prononcée par les prud'hommes. Vous obtenez alors votre réintégration ou, à votre choix, une indemnité minimale de 6 mois de salaire en plus des indemnités de licenciement classiques. Ne renoncez donc pas par crainte : le risque légal pèse sur l'employeur, pas sur vous.",
      },
      {
        q: "L'employeur me propose de récupérer mes heures en repos plutôt que de me les payer. Puis-je accepter ?",
        a: "Oui, mais à conditions strictes. La conversion d'heures supplémentaires en repos compensateur de remplacement (RCR) est prévue par l'article L3121-37 du Code du travail. Elle doit toutefois respecter trois règles : être prévue par convention ou accord collectif (à défaut, elle ne vous est pas opposable), le repos doit inclure la majoration (1 h 15 de repos pour 1 h supplémentaire majorée à 25 %), et il doit être pris dans le délai prévu par l'accord (souvent 2 mois) — sinon l'employeur reste tenu de payer en argent. Si l'employeur propose une « récupération » sans accord collectif valide et sans majoration, la proposition n'a aucune valeur juridique et vous restez fondé à réclamer le paiement majoré en numéraire.",
      },
    ],
  },

  // ─── Guide 20 : Requalification CDD en CDI (Lot C 2026-05-16) ───
  {
    slug: "requalification-cdd-en-cdi",
    category: "travail",
    title: "Requalifier son CDD en CDI : motifs, démarche et indemnités",
    metaTitle: "Requalification CDD en CDI — motifs et procédure",
    description:
      "CDD irrégulier ou abusif ? Requalification de plein droit en CDI : articles L1242-12, L1244-3, L1245-1. Procédure prud'homale accélérée et effet rétroactif.",
    relatedLetterSlug: "mise-en-demeure-executer",
    publishedAt: "2026-05-16",
    updatedAt: "2026-05-16",
    readingTime: "6 min",
    sections: [
      {
        heading: "Quand un CDD est-il irrégulier ?",
        body: `Le contrat à durée déterminée est l'exception, le CDI reste la règle (article L1221-2 du Code du travail). Le législateur a donc strictement encadré les cas de recours au CDD pour éviter qu'il ne devienne un mode de gestion permanente de l'emploi.

Les cas autorisés sont limitativement énumérés par l'article L1242-2 :
- Remplacement d'un salarié absent ou dont le contrat est suspendu
- Accroissement temporaire d'activité dûment justifié
- Emplois à caractère saisonnier ou d'usage constant
- CDD à objet défini pour les cadres et ingénieurs (18 à 36 mois)
- Contrats aidés relevant de la politique de l'emploi

En dehors de ces cas, le recours au CDD est irrégulier — et la requalification en CDI est de droit. Plusieurs irrégularités, même formelles, suffisent à elles seules à entraîner cette requalification :
- Absence ou imprécision du motif dans le contrat écrit (L1242-12)
- Contrat non transmis au salarié dans les 2 jours ouvrables suivant l'embauche (L1242-13)
- Absence pure et simple d'écrit
- Succession de CDD sans respect du délai de carence légal (L1244-3)
- Recours au CDD pour pourvoir durablement un emploi lié à l'activité normale et permanente de l'entreprise (L1242-1)

La jurisprudence est très stricte sur la forme. Un simple oubli de mention obligatoire — nom du remplacé, qualification, durée — peut suffire à la requalification, indépendamment de la réalité du motif (Cass. soc., 4 décembre 2002, n° 00-44.020).`,
      },
      {
        heading: "Le cadre juridique : motifs et sanctions",
        body: `Trois articles structurent la requalification. **L'article L1242-12 du Code du travail** impose un écrit comportant la définition précise du motif. **L'article L1244-3** fixe le délai de carence à respecter entre deux CDD sur le même poste (un tiers de la durée du contrat précédent en règle générale). **L'article L1245-1** prévoit que tout manquement à ces règles entraîne la **requalification de plein droit** en CDI.

L'irrégularité peut tenir au fond — le poste relève en réalité de l'activité normale et permanente — ou à la forme — mention manquante, signature tardive, motif mal qualifié. Les deux types d'irrégularité produisent le même effet : requalification automatique, sans appréciation possible par le juge sur l'opportunité.

La Cour de cassation considère depuis longtemps que la requalification est une sanction objective. Elle s'applique dès qu'une irrégularité est constatée, indépendamment du préjudice subi par le salarié. Autrement dit : vous n'avez pas à prouver que vous avez été "lésé" — il suffit de démontrer l'irrégularité.

L'employeur ne peut pas régulariser un CDD irrégulier en faisant signer un nouveau document après coup. La signature initiale fait foi, et tout ajustement postérieur est inopérant.

> [!CONSEIL]
> La requalification produit ses effets **dès le premier jour du contrat irrégulier**, pas à la date de la décision du juge ou de la saisine. Cela signifie que votre ancienneté, vos congés payés, votre prime d'ancienneté, votre indemnité conventionnelle de licenciement et votre indemnité légale sont recalculés à partir de la date d'origine. Si vous avez enchaîné 18 mois de CDD irréguliers et que vous obtenez la requalification, vous êtes considéré comme CDI depuis 18 mois — avec tous les droits attachés. L'impact financier est souvent considérable, et les salariés n'anticipent pas cette rétroactivité.`,
      },
      {
        heading: "La démarche : mise en demeure et saisine prud'homale",
        body: `La procédure se construit en deux temps.

**Étape 1 — Mise en demeure par lettre recommandée AR.** Le salarié — ou l'ex-salarié si le CDD a déjà pris fin — adresse à l'employeur une lettre demandant la requalification. Cette lettre doit contenir :
- L'identité du salarié, son poste et la date d'embauche
- La liste précise des CDD concernés (dates, références, motifs)
- L'irrégularité invoquée (article visé : L1242-12, L1244-3, L1242-1, etc.)
- La demande expresse de requalification en CDI
- Le rappel des conséquences : indemnité de requalification, rappel de salaire éventuel, et droits liés au CDI
- Un délai imparti (15 jours) pour répondre avant saisine du conseil de prud'hommes

Cette mise en demeure n'est pas obligatoire pour saisir les prud'hommes, mais elle est utile : elle ouvre la porte à un règlement amiable, et interrompt la prescription biennale (article L1471-1).

**Étape 2 — Saisine du conseil de prud'hommes.** En l'absence d'accord, le salarié saisit la formation prud'homale du lieu de travail. La requalification bénéficie d'une **procédure accélérée prévue par l'article L1245-2** : l'affaire est portée directement devant le bureau de jugement, sans phase de conciliation préalable, et le jugement doit intervenir dans le mois suivant la saisine.

Cette procédure rapide est un avantage stratégique : elle évite les délais habituels de 12 à 18 mois des prud'hommes, et met l'employeur sous pression. Les pièces à produire sont les contrats successifs, les bulletins de paie, les éventuels échanges écrits, et tout document attestant du caractère permanent du poste (organigramme, fiches de fonction, recrutements ultérieurs sur le même poste).`,
      },
      {
        heading: "Les indemnités spécifiques à la requalification",
        body: `La requalification ouvre droit à plusieurs indemnités cumulables.

**Indemnité de requalification (L1245-2).** Minimum **un mois de salaire**, sans plafond. Les juges l'évaluent en fonction de la durée des CDD irréguliers et de l'ancienneté reconstituée. Dans les cas les plus longs ou les plus abusifs, cette indemnité peut atteindre 3 à 6 mois de salaire.

**Indemnité de fin de contrat (prime de précarité).** Elle reste due au titre de chaque CDD effectué, indépendamment de la requalification (Cass. soc., 7 mars 2018, n° 16-13.194).

**Si le CDD a déjà pris fin sans renouvellement.** La fin du CDD est requalifiée en licenciement sans cause réelle et sérieuse. Le salarié obtient en plus :
- Indemnité légale ou conventionnelle de licenciement (selon l'ancienneté reconstituée)
- Indemnité compensatrice de préavis (1 ou 2 mois selon l'ancienneté)
- Dommages et intérêts pour licenciement sans cause réelle et sérieuse (selon le barème Macron, article L1235-3)

**Si travail dissimulé caractérisé.** L'article L8223-1 prévoit une indemnité forfaitaire de **6 mois de salaire**, cumulable avec toutes les indemnités ci-dessus, si l'employeur a sciemment utilisé le CDD pour dissimuler un emploi permanent.

**Effets sur Pôle Emploi / France Travail.** L'allocation d'aide au retour à l'emploi (ARE) est recalculée sur la base du salaire reconstitué, ce qui peut entraîner un rappel d'indemnités chômage si elles ont été versées sur une base sous-évaluée.`,
      },
    ],
    faq: [
      {
        q: "Combien de CDD successifs faut-il avoir signés avant de pouvoir demander la requalification ?",
        a: "Il n'existe pas de seuil chiffré. La requalification ne dépend pas du *nombre* de CDD, mais de leur *régularité*. Un seul CDD suffit s'il est irrégulier sur la forme (absence d'écrit, motif imprécis, signature tardive) ou sur le fond (poste relevant de l'activité normale et permanente). À l'inverse, dix CDD parfaitement réguliers et bien motivés ne donnent pas droit à requalification. Cela étant, la succession de CDD sans respect du délai de carence prévu par l'article L1244-3 entraîne automatiquement la requalification — c'est le motif le plus fréquemment invoqué par les juges, car facile à prouver via les dates des contrats successifs.",
      },
      {
        q: "Mon CDD a duré 2 ans, suis-je automatiquement en CDI ?",
        a: "Non, la durée n'est pas un critère unique de requalification. Un CDD à objet défini ou un CDD pour remplacement peuvent durer 18 mois (24 mois avec renouvellement) en parfaite régularité. C'est la conformité au motif légal et le respect des formalités qui comptent, pas la durée. En revanche, si le CDD dépasse la durée maximale légale autorisée pour son motif (18 mois en règle générale), la requalification est de droit. Pour les CDD d'usage (BTP, hôtellerie, audiovisuel...), il n'existe pas de durée maximale mais la succession sur un même poste doit rester compatible avec le caractère par essence temporaire de l'emploi — sinon requalification.",
      },
      {
        q: "L'employeur peut-il me licencier après ma demande de requalification ?",
        a: "Le licenciement reste possible mais il bénéficie d'une protection renforcée. Tout licenciement motivé — directement ou indirectement — par la demande de requalification est nul. Si vous êtes licencié dans les semaines qui suivent votre lettre, et que le motif invoqué par l'employeur n'est pas solide (par exemple une « insuffisance professionnelle » sans avertissement préalable), la nullité peut être prononcée. Le salarié obtient alors sa réintégration ou, à son choix, une indemnité minimale de 6 mois de salaire en plus des indemnités classiques. Dans les faits, l'employeur préfère souvent attendre la fin du CDD pour ne pas renouveler — mais cette stratégie ne le protège pas, puisque la requalification rend cette non-reconduction abusive.",
      },
      {
        q: "Quel délai ai-je pour saisir les prud'hommes ?",
        a: "Le délai de prescription est de **2 ans** à compter du jour où le salarié a connu ou aurait dû connaître les faits permettant d'agir (article L1471-1 du Code du travail). Pour la requalification, ce point de départ est généralement la date du dernier CDD irrégulier, ou la date de connaissance du caractère permanent du poste. La prescription est interrompue par toute saisine du conseil de prud'hommes — ou par l'envoi d'une lettre recommandée AR de mise en demeure (article 2240 du Code civil). Au-delà de 2 ans, l'action est prescrite et le salarié perd définitivement son droit à requalification, même si l'irrégularité est manifeste.",
      },
      {
        q: "Combien puis-je espérer obtenir financièrement ?",
        a: "Le montant total dépend de la durée des CDD et du salaire. Au minimum : 1 mois de salaire au titre de l'indemnité de requalification (L1245-2). Si le CDD a pris fin et que la rupture est requalifiée en licenciement sans cause réelle et sérieuse, il faut ajouter : indemnité légale de licenciement (1/4 de mois par année d'ancienneté reconstituée), indemnité compensatrice de préavis (1 à 2 mois), et dommages-intérêts selon le barème Macron (entre 1 et 20 mois selon l'ancienneté). Si le travail dissimulé est caractérisé, ajouter 6 mois de salaire forfaitaires (L8223-1). Pour un CDD de 2 ans payé 2 500 € brut, le total peut facilement dépasser **15 000 à 25 000 euros**.",
      },
      {
        q: "Le CDD d'intérim peut-il aussi être requalifié ?",
        a: "Oui. Le contrat de mission (intérim) obéit à des règles similaires aux CDD classiques, prévues par les articles L1251-1 et suivants du Code du travail. La requalification peut être prononcée contre l'entreprise utilisatrice — et non contre la société d'intérim — dès lors que les motifs de recours sont irréguliers, que la durée maximale est dépassée, ou que le contrat est utilisé pour pourvoir durablement un emploi permanent. Les indemnités sont les mêmes : indemnité de requalification minimum 1 mois, plus le cas échéant indemnités de licenciement sans cause réelle et sérieuse. La saisine se fait également selon la procédure accélérée prévue à L1251-41.",
      },
    ],
  },

  // ─── Guide 21 : Contester un solde de tout compte erroné (Lot C 2026-05-16) ───
  {
    slug: "contester-solde-de-tout-compte",
    category: "travail",
    title: "Contester un solde de tout compte erroné : délais et procédure",
    metaTitle: "Contester un solde de tout compte — délais, procédure",
    description:
      "Solde de tout compte avec erreurs ou omissions ? Article L1234-20. Délai 6 mois si signé, 3 ans si non signé. Mise en demeure et procédure complète.",
    relatedLetterSlug: "mise-en-demeure-payer",
    publishedAt: "2026-05-16",
    updatedAt: "2026-05-16",
    readingTime: "5 min",
    sections: [
      {
        heading: "Qu'est-ce que le solde de tout compte et que doit-il contenir ?",
        body: `Le solde de tout compte (STC) est un document remis par l'employeur au salarié à la rupture du contrat de travail. Il liste l'ensemble des sommes versées à l'occasion de la rupture : derniers salaires, indemnité de congés payés non pris, indemnité de licenciement ou de fin de contrat, indemnité compensatrice de préavis, primes éventuelles, et tout autre élément de rémunération échu.

L'article L1234-20 du Code du travail impose à l'employeur de l'établir et de le remettre au salarié, quel que soit le motif de la rupture : démission, licenciement, fin de CDD, rupture conventionnelle, retraite, départ négocié. Il doit être daté et signé par l'employeur.

Le STC doit faire l'inventaire **détaillé poste par poste** des sommes versées. Une simple mention globale (« je vous verse 4 200 € pour solde de tout compte ») n'est pas valable juridiquement : la jurisprudence exige que chaque élément soit ventilé pour que le salarié puisse vérifier le calcul de chaque poste.

Le STC s'accompagne en principe d'un bulletin de paie reprenant les éléments, d'un certificat de travail, et d'une attestation Pôle Emploi / France Travail. Ces documents constituent ensemble le « solde de tout compte » au sens large, mais c'est bien le reçu signé qui a la portée juridique encadrée par L1234-20.`,
      },
      {
        heading: "Les délais de contestation : 6 mois si signé, 3 ans sans signature",
        body: `L'article L1234-20 du Code du travail prévoit un régime double, selon que le salarié a signé ou non le reçu.

**Si le salarié a signé** le reçu pour solde de tout compte avec la mention prévue par la loi, il dispose d'un délai de **6 mois** à compter de la signature pour le dénoncer. Au-delà, le reçu devient libératoire pour l'employeur sur les sommes qui y figurent. Concrètement, le salarié ne peut plus contester les montants énumérés.

**Si le salarié n'a pas signé** (ou s'il a signé avec des réserves), la prescription de droit commun s'applique : **3 ans** pour les créances salariales (article L3245-1), 2 ans pour les autres créances liées au contrat de travail (article L1471-1).

L'écart est considérable. Un salarié qui signe sans précaution se prive de 30 mois d'action.

Important : la dénonciation doit être faite par **lettre recommandée avec AR**, motivée, et adressée à l'employeur. Elle peut viser tout ou partie du STC. Si elle vise un poste précis (par exemple un rappel d'heures supplémentaires omis), elle n'affecte pas le caractère libératoire pour les autres postes — c'est pourquoi la dénonciation doit être large si plusieurs erreurs sont suspectées.

> [!CONSEIL]
> La signature « pour solde de tout compte » est un piège juridique. La mention exacte requise par l'article R1234-19 est : « reçu pour solde de tout compte ». Sans cette formulation, ou si la mention figure en bas de page de manière dissimulée, la jurisprudence admet souvent que le délai de 6 mois ne s'applique pas. **Avant de signer**, relisez attentivement et signez avec la mention manuscrite « sous réserve » si vous avez un doute. Cette simple précaution préserve les 3 ans de prescription au lieu des 6 mois. Beaucoup d'employeurs comptent sur la précipitation du salarié à la sortie pour faire signer un STC erroné en sa défaveur.`,
      },
      {
        heading: "Comment contester : mise en demeure et procédure",
        body: `La contestation se fait en deux étapes.

**Étape 1 — Lettre de dénonciation par recommandé AR.** Cette lettre doit :
- Identifier précisément le reçu contesté (date de signature, montant total)
- Lister les postes contestés avec, pour chacun, le montant figurant au STC et le montant qui aurait dû y figurer selon vos calculs
- Joindre les pièces justificatives : bulletins de paie, contrat de travail, accord d'entreprise, relevés de présence
- Demander le paiement de la différence dans un délai imparti (généralement 15 jours)
- Mentionner les articles L1234-20 et L3245-1 du Code du travail
- Indiquer qu'à défaut de paiement, vous saisirez le conseil de prud'hommes

L'envoi en recommandé AR est indispensable : c'est la seule preuve recevable que la dénonciation a été faite dans le délai légal de 6 mois.

**Étape 2 — Saisine du conseil de prud'hommes.** Sans accord, le salarié saisit le conseil de prud'hommes du lieu de travail. La phase de conciliation préalable est obligatoire pour ce type de contentieux. Si la conciliation échoue, l'affaire est renvoyée devant le bureau de jugement.

La charge de la preuve appartient au salarié pour démontrer le caractère erroné du STC, mais l'employeur doit produire ses propres décomptes et justificatifs. Si l'employeur n'apporte aucun élément, le juge tranche en faveur du salarié sur la base des seuls éléments produits par celui-ci.`,
      },
      {
        heading: "Quels postes peuvent être contestés rétroactivement ?",
        body: `Plusieurs postes sont fréquemment sources d'erreurs et peuvent être rétroactivement réclamés via la contestation du STC.

**Heures supplémentaires impayées.** Si vos heures supplémentaires n'ont pas été intégrées au STC, vous pouvez les réclamer sur la base de l'article L3171-4 du Code du travail. La prescription est de 3 ans, ce qui peut représenter des sommes substantielles.

**Indemnité compensatrice de congés payés (ICCP).** Souvent mal calculée, surtout pour les contrats à temps partiel, les CDD successifs, ou en présence d'absences (arrêt maladie, congé maternité). Le calcul doit suivre la règle la plus favorable au salarié : 1/10 de la rémunération brute totale ou maintien intégral.

**Indemnité de licenciement.** Calculée selon l'ancienneté reconstituée (1/4 de mois par année jusqu'à 10 ans, 1/3 au-delà selon l'article R1234-2). Vérifier que la convention collective applicable n'impose pas un calcul plus favorable, fréquent dans plusieurs secteurs.

**Prime d'ancienneté, 13e mois, intéressement, participation.** Si le STC ne reprend pas la part proportionnelle due au titre de la période non encore versée, c'est une omission contestable.

**Indemnité de fin de contrat (CDD).** La prime de précarité (10 % de la rémunération brute totale) doit figurer au STC. Son omission est extrêmement fréquente.

**Reliquats de RTT non pris ou jours de CET non soldés.** Doivent être payés à la rupture, sauf accord collectif prévoyant un versement spécifique.

À chaque fois, le calcul de la somme due se fait à partir des bulletins de paie, du contrat de travail, et de la convention collective applicable. En cas de doute, la consultation d'un défenseur syndical ou d'un avocat reste recommandée — beaucoup de prud'hommes constatent que des STC apparemment corrects sont en réalité sous-évalués de plusieurs milliers d'euros.`,
      },
    ],
    faq: [
      {
        q: "Que signifie exactement la mention « pour solde de tout compte » ?",
        a: "Cette mention indique que le salarié reconnaît avoir reçu les sommes énumérées dans le reçu, et qu'il renonce à toute réclamation supplémentaire sur ces postes. Juridiquement, c'est une renonciation conditionnée par l'article L1234-20 du Code du travail : elle n'est libératoire pour l'employeur que sur les sommes effectivement énumérées dans le document. Si un poste a été oublié (par exemple une prime d'ancienneté), il reste réclamable indépendamment du caractère « définitif » du reçu. Sans cette mention exacte ou sans signature, le reçu n'est qu'un simple bulletin de paie et la prescription longue (3 ans pour les salaires) s'applique. La mention déclenche en revanche le délai court de 6 mois.",
      },
      {
        q: "Puis-je signer le reçu puis le contester ensuite ?",
        a: "Oui, dans le délai de 6 mois à compter de la signature, par lettre recommandée AR motivée. La signature ne vous prive pas du droit de contester — elle déclenche simplement le compte à rebours. Pour préserver vos droits au maximum, deux options : soit refuser de signer (3 ans de prescription au lieu de 6 mois), soit signer en ajoutant à la main la mention « **sous toutes réserves de mes droits, contestation à venir** ». Cette mention manuscrite est jugée par la Cour de cassation comme privant le reçu de son caractère libératoire (Cass. soc., 18 décembre 2019, n° 18-15.336). L'employeur ne peut pas refuser de vous remettre le STC si vous refusez de signer : il doit vous l'adresser par voie postale.",
      },
      {
        q: "Quels postes du STC peuvent être contestés ?",
        a: "Tous les postes peuvent être contestés s'ils sont erronés ou incomplets. Les contestations les plus fréquentes portent sur les heures supplémentaires impayées, l'indemnité compensatrice de congés payés (ICCP), l'indemnité de licenciement (souvent sous-évaluée en cas d'ancienneté mal reconstituée), la prime de précarité en CDD, les primes d'ancienneté ou 13e mois proratisés, les jours de RTT ou de CET non soldés. À chaque fois, la contestation doit s'appuyer sur des justificatifs : bulletins de paie, contrat de travail, convention collective, accord d'entreprise. Un calcul détaillé poste par poste augmente nettement les chances d'obtenir gain de cause.",
      },
      {
        q: "Et si mon employeur refuse de me remettre mon STC ?",
        a: "L'employeur a l'obligation légale de remettre le solde de tout compte à la rupture du contrat, sous peine de devoir réparer le préjudice subi. Si malgré une demande écrite il refuse ou tarde, envoyez une mise en demeure par lettre recommandée AR en visant l'article L1234-20 et en demandant la remise sous 8 jours. Sans réponse, vous pouvez saisir le conseil de prud'hommes en référé pour obtenir la remise sous astreinte (une somme journalière due par l'employeur pour chaque jour de retard). Vous pouvez également demander des dommages-intérêts pour le préjudice causé — notamment si le retard vous a empêché de percevoir vos allocations chômage ou de retrouver un emploi.",
      },
      {
        q: "La signature engage-t-elle pour tous les postes, même ceux non détaillés ?",
        a: "Non. Le caractère libératoire du reçu pour solde de tout compte ne s'applique **qu'aux sommes effectivement énumérées** dans le document (Cass. soc., 18 décembre 2013, n° 12-24.985). Si un poste — par exemple une prime annuelle ou des heures supplémentaires — n'a pas été mentionné, vous pouvez le réclamer sans être tenu par le délai de 6 mois. La prescription applicable est alors celle de droit commun : 3 ans pour les créances salariales. C'est pour cette raison que le STC doit être détaillé poste par poste : un STC se contentant d'une somme globale, sans détail, est très facilement contestable même après 6 mois.",
      },
      {
        q: "Que faire si le STC inclut des sommes manifestement inexactes ?",
        a: "Dans cette situation, ne signez surtout pas dans la précipitation. Demandez le détail des calculs à l'employeur — par mail, en gardant trace écrite. Comparez chaque poste avec vos bulletins de paie, votre contrat, et la convention collective applicable. Si vous identifiez une erreur, deux options : refuser de signer et envoyer une lettre recommandée AR demandant la rectification dans un délai de 15 jours, ou signer en ajoutant la mention manuscrite « sous toutes réserves de mes droits, montants contestés à venir » suivie de votre paragraphe. Cette seconde option préserve vos droits tout en vous permettant de toucher rapidement les sommes non contestées. Dans tous les cas, conservez l'original du STC, vos bulletins de paie, et copie de tous les échanges écrits.",
      },
    ],
  },

  // ─── Guide 22 : Demande de rupture conventionnelle (Lot C 2026-05-16) ───
  {
    slug: "demander-rupture-conventionnelle-employeur",
    category: "travail",
    title: "Demander une rupture conventionnelle à son employeur : procédure et négociation",
    metaTitle: "Demande de rupture conventionnelle — lettre et procédure",
    description:
      "Comment formuler une demande de rupture conventionnelle ? Article L1237-11, négociation, indemnité minimale, homologation DREETS, droit au chômage.",
    relatedLetterSlug: "mise-en-demeure-executer",
    publishedAt: "2026-05-16",
    updatedAt: "2026-05-16",
    readingTime: "6 min",
    sections: [
      {
        heading: "Rupture conventionnelle : à quoi s'attendre",
        body: `La rupture conventionnelle est un mode de rupture amiable du contrat de travail à durée indéterminée. Elle a été créée par la loi du 25 juin 2008 et codifiée aux articles L1237-11 à L1237-16 du Code du travail. Elle suppose le consentement libre et éclairé des deux parties — salarié et employeur — sur le principe même de la rupture et sur ses conditions financières.

Pourquoi elle plaît au salarié : elle ouvre droit à l'**indemnité spécifique de rupture conventionnelle** (au moins équivalente à l'indemnité légale de licenciement) **et au chômage**, ce qui en fait une alternative très favorable à la démission.

Pourquoi elle plaît parfois à l'employeur : elle sécurise juridiquement la rupture, en évitant les contentieux d'un licenciement (cause réelle et sérieuse, procédure, indemnités majorées en cas d'absence de motif). Pour un salarié qui veut partir, elle évite à l'employeur le risque d'une démission donnée sous le coup de l'émotion et requalifiée ensuite en licenciement.

Ce qu'elle n'est pas : un licenciement à l'amiable. La rupture conventionnelle est un acte juridique distinct, soumis à un formalisme strict, à une homologation administrative, et à un délai de rétractation. Une simple "lettre de licenciement amiable" signée à deux n'a pas la même valeur juridique et peut être requalifiée — soit en démission, soit en licenciement sans cause réelle et sérieuse.

Public concerné : tous les salariés en CDI, y compris en période d'essai (sauf accord contraire), y compris les salariés protégés (avec autorisation de l'inspection du travail). Les CDD ne peuvent pas faire l'objet d'une rupture conventionnelle classique mais d'une rupture conventionnelle d'un commun accord (régime distinct, article L1243-1).`,
      },
      {
        heading: "Le cadre juridique : ce qui est négociable et ce qui ne l'est pas",
        body: `**Ce qui est imposé par la loi et non négociable :**
- Le caractère écrit et formel de la convention (article L1237-11)
- L'entretien préalable obligatoire entre les parties (L1237-12)
- Le délai de rétractation de 15 jours calendaires (L1237-13)
- L'homologation par la DREETS (Direction régionale de l'économie, de l'emploi, du travail et des solidarités) ou son refus dans les 15 jours ouvrables (L1237-14)
- Le montant minimum de l'indemnité spécifique : au moins égal à l'indemnité légale ou conventionnelle de licenciement (L1237-13)

**Ce qui est négociable entre les parties :**
- Le montant exact de l'indemnité (souvent au-delà du minimum légal, surtout pour des ruptures d'initiative employeur)
- La date de fin du contrat de travail (dans la limite imposée par l'homologation)
- L'éventuelle dispense d'exécution du préavis, et son éventuelle compensation financière
- La levée ou non d'une éventuelle clause de non-concurrence (et son indemnisation)
- Le traitement des éléments accessoires : matériel professionnel, droits acquis (CET, RTT non pris), formation engagée, intéressement et participation au prorata

L'employeur n'a aucune obligation de proposer plus que le minimum légal. Mais s'il a un intérêt à voir partir le salarié — par exemple si la procédure de licenciement est complexe ou risquée juridiquement — la négociation peut conduire à une indemnité bien supérieure. Le rapport de force dépend de la situation : ancienneté, qualité du dossier salarié, climat dans l'entreprise, urgence pour l'employeur.

> [!CONSEIL]
> La rupture conventionnelle **n'est pas un droit**. L'employeur peut la refuser sans avoir à se justifier, et la jurisprudence est constante sur ce point : aucun juge ne peut imposer à un employeur de signer. Beaucoup de salariés confondent demande et résiliation unilatérale : si vous quittez le poste après un refus, c'est une démission — pas une rupture conventionnelle. La demande doit ouvrir une négociation, pas l'imposer. Si l'employeur refuse, vos options restent la démission (sans chômage), la prise d'acte de rupture aux torts de l'employeur (risquée, nécessite un avocat), ou l'attente d'une opportunité.`,
      },
      {
        heading: "Comment formuler la demande à son employeur",
        body: `La demande peut être verbale ou écrite. Une demande écrite, par lettre remise en main propre contre décharge ou par recommandé AR, a deux avantages : elle laisse une trace, et elle formalise le démarrage de la procédure dès la date d'envoi.

**Structure recommandée de la lettre :**
- Identification : nom, fonction, ancienneté
- Phrase d'introduction expliquant la démarche (sans formule maladroite type "je veux partir" — préférer "je souhaite engager avec vous une discussion en vue d'une rupture conventionnelle")
- Brève motivation, sans agressivité : changement professionnel, projet personnel, évolution de carrière. Évitez les griefs envers l'entreprise : ils créent un climat défavorable à la négociation.
- Proposition concrète : date d'effet souhaitée, conditions financières envisagées
- Demande d'un entretien dans un délai raisonnable (15 jours)
- Formule de politesse

**Ce qu'il ne faut pas faire :**
- Annoncer un départ ferme en cas de refus — cela transforme la lettre en démission déguisée
- Mentionner un nouvel emploi obtenu — cela affaiblit la position de négociation et peut faire requalifier la rupture si la chronologie est défavorable
- Énumérer des reproches à l'encontre de l'employeur — réserver ces éléments à une éventuelle prise d'acte si la négociation échoue

**Si l'employeur est ouvert à la discussion**, un ou plusieurs entretiens informels précèdent l'entretien officiel prévu par L1237-12. Lors de ces échanges, le salarié peut se faire assister par un membre du personnel de son choix, et l'employeur par toute personne de son choix dans l'entreprise (si l'effectif le permet).`,
      },
      {
        heading: "Après l'accord : entretien, signature, homologation",
        body: `Une fois le principe et les conditions arrêtés, la procédure formelle se déroule en plusieurs étapes encadrées par les articles L1237-12 à L1237-14.

**1. Entretien préalable obligatoire (L1237-12).** Au moins un entretien doit avoir lieu entre les parties pour discuter des modalités. Le salarié peut s'y faire assister par un salarié de l'entreprise ou, en l'absence d'IRP, par un conseiller du salarié inscrit sur une liste préfectorale. L'employeur ne peut s'y faire assister que si le salarié l'est lui-même. Aucun procès-verbal n'est obligatoire, mais il est conseillé d'en rédiger un signé par les deux parties.

**2. Signature de la convention.** La convention doit être rédigée sur le formulaire CERFA n° 14598*01 (ou télédéclarée sur le portail TéléRC). Elle précise : identité des parties, date envisagée de rupture, montant de l'indemnité spécifique, modalités d'exécution éventuelle du préavis.

**3. Délai de rétractation (L1237-13).** Chacune des deux parties dispose d'un délai de **15 jours calendaires** à compter de la signature pour se rétracter, par lettre recommandée AR. Ni l'employeur ni le salarié n'ont à justifier d'un motif. Pendant ce délai, le contrat de travail continue normalement.

**4. Homologation par la DREETS (L1237-14).** À l'issue du délai de rétractation, la convention est transmise à la DREETS (ex-DIRECCTE) qui dispose de **15 jours ouvrables** pour l'homologuer. Le silence vaut homologation tacite. L'administration vérifie le respect du formalisme et l'absence d'indices d'un consentement vicié. Elle peut refuser, notamment si l'indemnité est inférieure au minimum légal ou si le délai de rétractation n'a pas été respecté.

**5. Rupture effective.** Le contrat prend fin au plus tôt le lendemain du jour de l'homologation administrative, ou à la date convenue si elle est postérieure. À cette date, l'employeur remet le solde de tout compte, le certificat de travail, et l'attestation France Travail. Le salarié peut s'inscrire au chômage.

**Délai total de la procédure** : environ 5 à 6 semaines entre la signature et la rupture effective, sans compter la phase préalable de négociation.`,
      },
    ],
    faq: [
      {
        q: "L'employeur peut-il refuser ma demande de rupture conventionnelle ?",
        a: "Oui, sans avoir à se justifier. La rupture conventionnelle suppose le consentement libre des deux parties, et aucune disposition légale n'oblige l'employeur à accepter une demande du salarié. Aucun juge ne peut imposer la signature. En cas de refus, vos options se limitent à : continuer à exercer votre poste, démissionner (sans droit au chômage sauf cas particuliers de démission légitime), ou prendre acte de la rupture aux torts de l'employeur si vous avez des griefs sérieux (procédure risquée, à préparer avec un avocat). Une nouvelle demande peut être tentée plus tard si la situation évolue — il n'y a pas de délai imposé entre deux demandes.",
      },
      {
        q: "Quel est le montant minimum de l'indemnité de rupture conventionnelle ?",
        a: "L'article L1237-13 du Code du travail impose un montant au moins égal à l'**indemnité légale de licenciement** : 1/4 de mois de salaire par année d'ancienneté jusqu'à 10 ans, puis 1/3 de mois par année au-delà (article R1234-2). Si une convention collective ou un accord d'entreprise prévoit une indemnité de licenciement supérieure, c'est ce montant qui s'impose comme plancher. Le salaire de référence est le 1/12 de la rémunération brute des 12 derniers mois, ou le 1/3 des 3 derniers mois si plus favorable. Au-delà de ce minimum, tout est négociable. Pour les ruptures d'initiative employeur (l'entreprise veut faire partir le salarié), l'indemnité atteint souvent 2 à 4 fois l'indemnité légale.",
      },
      {
        q: "Puis-je toucher le chômage après une rupture conventionnelle ?",
        a: "Oui, c'est l'un des grands avantages de cette procédure. L'indemnité de rupture conventionnelle, lorsqu'elle ne dépasse pas le minimum légal ou conventionnel, ne donne lieu à aucun différé d'indemnisation chômage spécifique. Si l'indemnité dépasse ce minimum, un différé spécifique d'indemnisation est calculé (article 21 de la convention d'assurance chômage). Vous pouvez aussi être soumis au différé de congés payés (jours de CP versés en solde de tout compte). En pratique, l'allocation chômage commence en général 7 jours après l'inscription, à condition d'avoir 6 mois d'affiliation sur les 24 derniers mois (ou 36 si plus de 53 ans).",
      },
      {
        q: "Combien de temps prend la procédure complète ?",
        a: "Environ 5 à 6 semaines entre la signature de la convention et la rupture effective, sans compter la phase préalable de négociation qui peut durer de quelques jours à plusieurs mois. Le détail : entretien préalable obligatoire (au moins 1 jour entre la convocation et l'entretien, en pratique 1 à 2 semaines), puis signature de la convention, puis délai de rétractation de 15 jours calendaires, puis transmission à la DREETS qui dispose de 15 jours ouvrables pour homologuer, puis date de rupture (au plus tôt le lendemain de l'homologation). La date de rupture peut être différée si les parties le souhaitent — par exemple pour permettre au salarié de finaliser un projet.",
      },
      {
        q: "Et si je change d'avis pendant la procédure ?",
        a: "Vous pouvez vous rétracter unilatéralement pendant les **15 jours calendaires** suivant la signature de la convention, sans avoir à justifier d'un motif (article L1237-13). La rétractation doit être notifiée à l'autre partie par tout moyen offrant date certaine — concrètement, par lettre recommandée avec AR. Passé ce délai, la rétractation n'est plus possible : la convention produit ses effets après homologation. Si vous changez d'avis après la rupture, vous ne pouvez plus revenir en arrière — vous devrez chercher un nouveau poste, y compris éventuellement dans la même entreprise via une réembauche distincte. À noter : la rétractation par l'une des parties éteint la convention dans son intégralité, même si l'autre partie souhaite la maintenir.",
      },
      {
        q: "Quelle est la différence avec un licenciement à l'amiable ?",
        a: "Il n'existe juridiquement aucune notion de « licenciement à l'amiable » en droit français. Toute rupture du contrat de travail relève de catégories légales précises : licenciement (à l'initiative de l'employeur, avec cause réelle et sérieuse), démission (à l'initiative du salarié), rupture conventionnelle (commun accord formalisé), ou prise d'acte (à l'initiative du salarié, avec griefs envers l'employeur). Une « rupture amiable » qui ne respecterait pas le formalisme de la rupture conventionnelle serait requalifiée par les prud'hommes — généralement en licenciement sans cause réelle et sérieuse, avec toutes les indemnités correspondantes, à la charge de l'employeur. C'est pour cela qu'il faut impérativement passer par le formulaire CERFA et l'homologation DREETS, et non pas se contenter d'un courrier signé à deux.",
      },
    ],
  },

  // ─── Guide 23 : Loi Lemoine assurance emprunteur (Lot C 2026-05-16) ───
  {
    slug: "resilier-assurance-emprunteur-loi-lemoine",
    category: "banque-assurance",
    title: "Résilier son assurance emprunteur grâce à la loi Lemoine : guide complet",
    metaTitle: "Résilier assurance emprunteur loi Lemoine — mode d'emploi",
    description:
      "Loi Lemoine du 28 février 2022 : résiliation à tout moment de l'assurance emprunteur. Procédure pas à pas, délai banque 10 jours, équivalence des garanties.",
    relatedLetterSlug: "resiliation-abonnement",
    publishedAt: "2026-05-16",
    updatedAt: "2026-05-16",
    readingTime: "6 min",
    sections: [
      {
        heading: "Loi Lemoine : ce qui a changé depuis 2022",
        body: `La loi n° 2022-270 du 28 février 2022 — dite « loi Lemoine » — a profondément modifié les règles de résiliation et de substitution de l'assurance emprunteur des crédits immobiliers. Elle codifie aux articles L313-30 et suivants du Code de la consommation un droit nouveau : la **résiliation à tout moment** du contrat d'assurance, sans frais et sans pénalité.

Avant cette loi, le marché était verrouillé. Les emprunteurs ne pouvaient changer d'assurance que pendant la première année (loi Hamon de 2014, art. L113-12-2 du Code des assurances), puis à chaque date d'anniversaire (amendement Bourquin de 2018). En pratique, la majorité des emprunteurs restaient avec l'assurance de groupe de leur banque, souvent 2 à 3 fois plus chère qu'une délégation d'assurance externe.

**Trois changements majeurs depuis la loi Lemoine :**

1. **Résiliation à tout moment.** Pour tous les crédits immobiliers, qu'ils soient récents ou anciens, l'emprunteur peut résilier son assurance et la remplacer par un autre contrat à n'importe quel moment, sans attendre une date anniversaire.

2. **Suppression du questionnaire de santé** pour les prêts immobiliers à usage non professionnel inférieurs à 200 000 € par emprunteur, et dont l'échéance intervient avant les 60 ans de l'emprunteur.

3. **Information renforcée.** La banque est tenue d'informer chaque année l'emprunteur de son droit de résiliation et de substitution, ainsi que du coût annuel de son assurance (article L313-31 du Code de la consommation).

**Enjeu financier moyen pour un emprunteur :** la délégation d'assurance permet typiquement d'économiser de 5 000 à 20 000 euros sur la durée d'un prêt immobilier de 200 000 euros sur 20 ans, selon le profil et l'âge.`,
      },
      {
        heading: "Le cadre juridique et la condition d'équivalence des garanties",
        body: `Trois articles structurent le mécanisme. **L'article L313-30 du Code de la consommation** prévoit le droit à la résiliation à tout moment. **L'article L313-31** organise la procédure de substitution et fixe les délais de réponse de la banque. **L'article L313-32** précise les motifs pour lesquels la banque peut refuser le nouveau contrat.

Le droit de résiliation n'est cependant pas inconditionnel. La banque conserve un **droit d'examen sur l'équivalence des garanties** entre l'ancien et le nouveau contrat. Si le nouveau contrat n'offre pas une couverture au moins équivalente sur les risques exigés à la souscription, la banque peut légalement refuser la substitution.

L'équivalence se mesure par rapport à une grille standardisée définie par le Comité Consultatif du Secteur Financier (CCSF). Cette grille liste les garanties exigibles : décès, perte totale et irréversible d'autonomie (PTIA), invalidité permanente totale ou partielle (IPT, IPP), incapacité temporaire totale (ITT). À la signature du prêt, la banque exige un certain nombre de ces garanties — généralement 10 à 15 critères précis sur la grille des 26 critères CCSF. Le nouveau contrat doit couvrir au minimum ces mêmes critères.

**Délai de réponse de la banque : 10 jours ouvrés** à compter de la réception du dossier complet (article L313-31). Le silence à l'issue de ce délai vaut acceptation tacite — c'est un point essentiel pour faire pression en cas de blocage.

> [!CONSEIL]
> L'équivalence des garanties est le point le plus délicat en pratique. Joignez systématiquement à votre demande la **fiche standardisée d'information (FSI) du nouveau contrat** complétée par l'assureur, ainsi que les conditions générales et particulières. Sans ces documents, le délai légal de 10 jours ouvrés **ne commence pas à courir**, et la banque peut traîner indéfiniment en demandant des compléments. Ajoutez aussi une lettre type reprenant point par point les critères de la grille CCSF exigés à la souscription, en démontrant que chacun est couvert. Cette préparation préalable transforme un dossier "compliqué" en dossier que la banque ne peut plus refuser sans motif sérieux.`,
      },
      {
        heading: "La procédure pas à pas : du choix du nouveau contrat à la confirmation",
        body: `La procédure se déroule en cinq étapes.

**Étape 1 — Identifier les garanties exigées par la banque.** Vous trouvez la liste des critères exigés dans votre contrat de prêt initial, ou plus simplement dans la **fiche standardisée d'information (FSI)** remise par la banque à la souscription (article L313-10 du Code de la consommation). Conservez ce document précieusement — il sert de référence pour démontrer l'équivalence.

**Étape 2 — Trouver un nouveau contrat équivalent.** Comparez les offres de plusieurs assureurs (mutuelles, courtiers en ligne, compagnies indépendantes). Demandez à chacun de remplir une FSI sur leur produit, en cochant les critères CCSF couverts. Comparez ligne à ligne avec votre FSI bancaire. Le tarif annuel et l'économie sur la durée restante du prêt sont les autres critères clés.

**Étape 3 — Envoyer la demande de substitution.** Adressez à votre banque (et non à l'assureur initial) une lettre recommandée AR contenant :
- Votre demande expresse de résiliation et de substitution
- L'identification du prêt concerné (numéro, date de souscription, capital initial)
- Les coordonnées du nouvel assureur
- La FSI du nouveau contrat
- Les conditions générales et particulières du nouveau contrat
- Une lettre démontrant l'équivalence des garanties point par point
- Le visa de l'article L313-30 du Code de la consommation
- Une demande de réponse dans le délai légal de 10 jours ouvrés

**Étape 4 — Attendre la réponse de la banque.** La banque dispose de 10 jours ouvrés à compter de la réception du dossier complet pour accepter ou refuser. Le silence vaut acceptation. En cas de refus, la banque doit motiver précisément quel critère n'est pas équivalent. Un refus non motivé ou motivé de manière vague est contestable.

**Étape 5 — Signature et bascule.** En cas d'acceptation, vous signez le nouveau contrat à la date convenue. La banque modifie l'avenant au contrat de prêt. L'ancien contrat prend fin à la date de prise d'effet du nouveau. Vous récupérez la quote-part de prime déjà payée et non consommée auprès de l'ancien assureur.`,
      },
      {
        heading: "Que faire si la banque refuse la substitution ?",
        body: `Un refus de la banque n'est pas une fin de non-recevoir. Trois leviers existent en cas de blocage.

**Étape 1 — Demander la motivation précise du refus.** L'article L313-32 impose à la banque de préciser quel critère exact n'est pas couvert par le nouveau contrat. Un refus du type "garanties insuffisantes" sans précision n'est pas valable. Demandez par écrit le détail du critère manquant.

**Étape 2 — Faire compléter le nouveau contrat.** Si le critère manquant est mineur, l'assureur peut souvent l'ajouter à votre contrat (par exemple en passant d'une couverture ITT de 90 à 60 jours de franchise). Une fois le contrat ajusté, vous renouvelez la demande de substitution avec la nouvelle FSI.

**Étape 3 — Saisir le médiateur bancaire.** Si la banque persiste dans un refus manifestement injustifié, vous pouvez saisir gratuitement le médiateur de la consommation de votre banque (ses coordonnées figurent sur tous les courriers bancaires et sur le site web de la banque). Cette saisine est gratuite et la médiation aboutit dans environ 50 % des cas en faveur du consommateur lorsque le dossier est solide.

**Étape 4 — Saisir le tribunal judiciaire.** En dernier recours, vous pouvez saisir le tribunal judiciaire compétent pour faire constater l'équivalence et obtenir le remboursement des primes payées en trop. Cette procédure nécessite l'assistance d'un avocat pour les montants supérieurs à 10 000 euros.

**Sanction administrative possible.** L'ACPR (Autorité de contrôle prudentiel et de résolution) peut sanctionner les banques qui pratiquent des refus systématiques ou abusifs (jusqu'à 100 millions d'euros d'amende pour des établissements). Une plainte auprès de l'ACPR via leur site web peut motiver la banque à reconsidérer sa position.

**Délai de prescription des actions.** L'action en remboursement des primes payées en trop se prescrit par 5 ans (article 2224 du Code civil) à compter de la date à laquelle la banque aurait dû accepter la substitution.`,
      },
    ],
    faq: [
      {
        q: "À partir de quand puis-je résilier mon assurance emprunteur grâce à la loi Lemoine ?",
        a: "Depuis le **1er juin 2022** pour les nouveaux contrats souscrits, et depuis le **1er septembre 2022** pour les contrats en cours (toutes générations confondues). Concrètement, en mai 2026, tout emprunteur peut résilier à n'importe quel moment, sans attendre une date anniversaire. La résiliation prend effet à la date convenue avec la banque dans le cadre de la substitution, généralement entre 15 et 30 jours après l'acceptation. Vous récupérez la quote-part de prime non consommée auprès de l'assureur sortant — c'est une obligation légale, à ne pas oublier de réclamer.",
      },
      {
        q: "La banque peut-elle me refuser le changement d'assurance ?",
        a: "Oui, mais uniquement si elle peut démontrer que le nouveau contrat n'offre pas une couverture au moins équivalente sur les critères exigés à la souscription. L'article L313-32 du Code de la consommation impose à la banque de motiver précisément son refus en pointant le critère manquant. Un refus vague ou tardif n'est pas valable. En pratique, la non-équivalence porte le plus souvent sur l'invalidité permanente partielle (IPP), les délais de carence, ou la couverture de certaines pathologies. Si le critère manquant est mineur, l'assureur peut souvent ajuster le nouveau contrat pour l'inclure. Sinon, vous pouvez saisir le médiateur bancaire ou l'ACPR.",
      },
      {
        q: "Quel est le délai de réponse de la banque ?",
        a: "**10 jours ouvrés** à compter de la réception du dossier complet (article L313-31 du Code de la consommation). Le silence à l'issue de ce délai vaut acceptation tacite. C'est un levier puissant : si la banque ne répond pas ou répond hors délai, vous pouvez vous prévaloir de cette acceptation tacite et exiger la substitution. Pour que ce délai commence effectivement à courir, le dossier transmis doit être complet : demande motivée, FSI du nouveau contrat, conditions générales et particulières, démonstration d'équivalence point par point. Un dossier incomplet permet à la banque de demander des compléments sans que le délai ne court — d'où l'importance d'un dossier irréprochable dès le premier envoi en recommandé AR.",
      },
      {
        q: "Que dois-je vérifier sur le nouveau contrat d'assurance ?",
        a: "Trois choses essentielles. Premièrement, **l'équivalence des garanties** par rapport à votre contrat actuel : le nouvel assureur doit couvrir au minimum les mêmes critères de la grille CCSF que ceux exigés par votre banque à la souscription. Deuxièmement, **les exclusions** : sports à risque, pathologies préexistantes, situations professionnelles. Si vous avez des conditions particulières, vérifiez qu'elles sont bien couvertes. Troisièmement, **le coût total sur la durée restante du prêt** — pas seulement la première année. Certains contrats appliquent une prime croissante avec l'âge qui rattrape voire dépasse le contrat de groupe sur les dernières années du prêt. Un courtier spécialisé peut vous faire une comparaison ligne à ligne — ses honoraires sont généralement nuls pour vous (rémunération par l'assureur).",
      },
      {
        q: "Le changement d'assurance a-t-il un impact sur les conditions de mon prêt ?",
        a: "En principe, non. La substitution d'assurance n'affecte ni le taux d'intérêt, ni la durée, ni le montant des mensualités du prêt. Seule la part « assurance » de votre mensualité globale est modifiée. La banque ne peut pas conditionner l'acceptation à un quelconque ajustement du contrat de prêt. Une seule exception : si votre prêt comporte une clause de domiciliation des revenus liée à l'assurance (clause aujourd'hui très rare et restreinte depuis 2019), un ajustement marginal peut être négocié. Dans tous les cas, demandez à la banque un avenant écrit confirmant que les autres conditions du prêt restent inchangées.",
      },
      {
        q: "Et pour les anciens prêts antérieurs à 2022 ?",
        a: "La loi Lemoine s'applique également **aux contrats d'assurance emprunteur en cours**, y compris ceux liés à des prêts souscrits avant 2022. Depuis le 1er septembre 2022, tous les emprunteurs peuvent résilier à tout moment, quelle que soit la date de souscription du prêt initial. Aucun emprunteur n'est exclu du dispositif. À noter : si votre prêt approche de son terme (moins de 2 ou 3 ans restants), l'économie potentielle peut être modeste et il vaut peut-être mieux garder le contrat existant. Faites un calcul précis incluant les éventuels frais d'avenant facturés par la banque (souvent 0 à 100 euros) avant de basculer.",
      },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
