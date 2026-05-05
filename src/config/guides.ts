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

  // ─── Guide 6 : Mise en demeure restitution caution location ───
  {
    slug: "mise-en-demeure-restitution-caution-location",
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
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
