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

  // ─── Guide 4 : Résiliation Free Mobile (loi Chatel) ───
  {
    slug: "resilier-free-mobile-loi-chatel",
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
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
