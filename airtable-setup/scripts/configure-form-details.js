/**
 * GUIDE COMPLET DE CONFIGURATION DU FORMULAIRE QUALIFICATION_INFOPRENEURS
 * 
 * Ce script sert de documentation complu00e8te pour configurer le formulaire
 * de qualification d'infopreneurs dans Airtable.
 */

// Texte d'introduction pour le formulaire
const introductionText = `
Bienvenue dans le questionnaire de qualification Mindeo!

Ce questionnaire nous permet d'u00e9valuer si nous pouvons vous aider u00e0 atteindre vos objectifs d'infopreneur. Les informations que vous nous communiquez restent strictement confidentielles et nous permettent de comprendre votre business actuel et vos ambitions.

Prenez quelques minutes pour ru00e9pondre aux questions suivantes avec le plus de pru00e9cision possible.
`;

// Message de confirmation apru00e8s soumission
const confirmationMessage = `
Merci pour vos ru00e9ponses!

Votre demande a bien u00e9tu00e9 enregistru00e9e. Notre u00e9quipe va analyser votre questionnaire dans les 48 heures et vous recontactera pour discuter des possibilitu00e9s de collaboration.

Si votre profil correspond u00e0 nos critu00e8res, nous vous proposerons un appel de du00e9couverte pour approfondir votre situation et explorer comment nous pouvons vous accompagner.
`;

// Configuration des sections avec textes d'aide
const formSections = [
  {
    title: "Section 1: Identification",
    description: "Information de base pour vous identifier",
    fields: [
      { name: "Nom_Complet", helpText: "Votre nom et pru00e9nom" },
      { name: "Email", helpText: "Nous utiliserons principalement cette adresse pour communiquer avec vous." },
      { name: "Tu00e9lu00e9phone", helpText: "Numu00e9ro ou00f9 nous pouvons vous joindre en cas de besoin" },
      { name: "Nom_Business", helpText: "Le nom de votre marque ou entreprise" },
      { name: "Lien_Principal", helpText: "Votre site principal ou00f9 vous vendez vos produits/services ou pru00e9sentez votre activitu00e9." }
    ]
  },
  {
    title: "Section 2: Pru00e9sence digitale",
    description: "Vos diffu00e9rents points de pru00e9sence en ligne",
    fields: [
      { name: "Instagram", helpText: "URL de votre compte professionnel Instagram" },
      { name: "YouTube", helpText: "URL de votre chau00eene YouTube" },
      { name: "LinkedIn", helpText: "URL de votre profil professionnel LinkedIn" },
      { name: "Facebook", helpText: "URL de votre page ou groupe Facebook" },
      { name: "TikTok", helpText: "URL de votre compte TikTok" },
      { name: "Autre_Ru00e9seau", helpText: "URL d'un autre ru00e9seau social significatif pour votre business" }
    ]
  },
  {
    title: "Section 3: Business et niche",
    description: "Du00e9tails sur votre activitu00e9 et votre positionnement",
    fields: [
      { name: "Niche", helpText: "Votre secteur d'activitu00e9 principal" },
      { name: "Sous_Niche", helpText: "Pru00e9cisez votre spu00e9cialitu00e9 au sein de cette niche" },
      { name: "Expu00e9rience_Annu00e9es", helpText: "Depuis combien d'annu00e9es exercez-vous dans cette niche?" },
      { name: "CA_Mensuel", helpText: "Votre chiffre d'affaires mensuel moyen sur les 6 derniers mois, en euros." },
      { name: "CA_Source_Principale", helpText: "Quelle est votre principale source de revenus?" },
      { name: "Marge_Bu00e9nu00e9ficiaire", helpText: "Approximativement, quel pourcentage de votre CA repru00e9sente votre bu00e9nu00e9fice net?" }
    ]
  },
  {
    title: "Section 4: Audience et acquisition",
    description: "Informations sur votre audience et vos canaux d'acquisition",
    fields: [
      { name: "Taille_Liste_Email", helpText: "Nombre total d'abonnu00e9s u00e0 votre liste email (tous segments confondus)." },
      { name: "Taille_Audience_Sociale", helpText: "Nombre total de followers/abonnu00e9s sur l'ensemble de vos ru00e9seaux sociaux." },
      { name: "Canal_Acquisition_Principal", helpText: "Quel est votre principal canal pour acquu00e9rir de nouveaux prospects/clients?" },
      { name: "Budget_Ads_Mensuel", helpText: "Budget mensuel consacru00e9 u00e0 la publicitu00e9 payante, tous canaux confondus." },
      { name: "Prix_Moyen_Offre", helpText: "Prix moyen de vos produits ou services, en euros" },
      { name: "Taux_Conversion_Global", helpText: "Quel est votre taux de conversion global approximatif (visiteurs u2192 clients)?" }
    ]
  },
  {
    title: "Section 5: Funnel et processus de vente",
    description: "Votre parcours client et vos mu00e9thodes de vente",
    fields: [
      { name: "Type_Funnel_Principal", helpText: "Quel type de funnel utilisez-vous principalement pour convertir vos prospects?" },
      { name: "Type_Contenu_Principal", helpText: "Quel format de contenu privilu00e9giez-vous pour communiquer avec votre audience?" },
      { name: "CTA_Principale", helpText: "Quel est votre appel u00e0 l'action principal?" },
      { name: "Processus_Closing", helpText: "Comment finalisez-vous principalement vos ventes?" },
      { name: "Outil_CRM", helpText: "Quel outil utilisez-vous pour gu00e9rer vos leads et clients?" }
    ]
  },
  {
    title: "Section 6: Objectifs et du00e9fis",
    description: "Vos ambitions et les obstacles u00e0 surmonter",
    fields: [
      { name: "Objectif_CA_6Mois", helpText: "Quel chiffre d'affaires mensuel visez-vous dans 6 mois?" },
      { name: "Prioritu00e9_1", helpText: "Quelle est votre prioritu00e9 numu00e9ro 1 actuellement pour votre business?" },
      { name: "Prioritu00e9_2", helpText: "Quelle est votre deuxiu00e8me prioritu00e9?" },
      { name: "Du00e9fi_Principal", helpText: "Quel est le problu00e8me principal qui vous empu00eache d'atteindre vos objectifs actuellement?" },
      { name: "Blocage_Croissance", helpText: "Quels sont les principaux facteurs limitant votre croissance?" },
      { name: "Objectif_Collaboration", helpText: "Comment pensez-vous que nous pourrions vous aider spu00e9cifiquement?" }
    ]
  }
];

// Champs u00e0 masquer dans le formulaire
const hiddenFields = [
  "ID_Infopreneur",
  "Score_Qualification",
  "Statut",
  "Date_Soumission",
  "Derniu00e8re_Modification"
];

/**
 * INSTRUCTIONS DE CONFIGURATION DU FORMULAIRE DANS AIRTABLE
 * 
 * 1. Dans votre base Airtable, allez u00e0 la table "Qualification_Infopreneurs"
 * 2. Cliquez sur "Forms" en haut
 * 3. Cliquez sur "Create a form"
 * 4. Copiez le texte d'introduction dans le champ "Form title & description"
 * 
 * Pour chaque section:
 * 5. Ajoutez un "Section break" en cliquant sur "+" entre les champs
 * 6. Utilisez les titres et descriptions de section fournis
 * 7. Pour chaque champ, ajoutez le texte d'aide correspondant
 * 
 * Pour les champs u00e0 masquer:
 * 8. Cliquez sur chaque champ dans la liste des champs u00e0 gauche
 * 9. Dans le panneau de droite, du00e9sactivez "Always show field"
 * 
 * Pour terminer:
 * 10. Configurez le message de confirmation avec le texte fourni
 * 11. Personnalisez le thu00e8me et les couleurs selon votre identitu00e9 visuelle
 * 12. Activez l'option "Email notifications" pour recevoir une alerte u00e0 chaque soumission
 */

console.log('u2705 Guide de configuration du formulaire gu00e9nu00e9ru00e9!');
console.log('Suivez les instructions dans ce fichier pour configurer manuellement le formulaire dans l\'interface Airtable.');
