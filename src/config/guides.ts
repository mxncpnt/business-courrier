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
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
