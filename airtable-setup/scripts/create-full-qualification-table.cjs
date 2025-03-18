const axios = require('axios');

const API_KEY = 'patEvEhaTBRmTxpQc.5c3a7241c0d360d379260e8655a372d34dec2626c76f51736975c058f30fbfae';
const BASE_ID = 'app6Q4KQzMBm5MEsz';
const TABLE_NAME = 'Qualification_Infopreneurs';

// Définition complète des champs selon votre documentation détaillée
const completeFieldsDefinition = [
  // Section 1: Identification
  { name: 'ID_Infopreneur', type: 'singleLineText' },
  { name: 'Nom_Complet', type: 'singleLineText' },
  { name: 'Email', type: 'email' },
  { name: 'Téléphone', type: 'phoneNumber' },
  { name: 'Nom_Business', type: 'singleLineText' },
  { name: 'Lien_Principal', type: 'url' },
  
  // Section 2: Présence digitale
  { name: 'Instagram', type: 'url' },
  { name: 'YouTube', type: 'url' },
  { name: 'LinkedIn', type: 'url' },
  { name: 'Facebook', type: 'url' },
  { name: 'TikTok', type: 'url' },
  { name: 'Autre_Réseau', type: 'url' },
  
  // Section 3: Business et niche
  { name: 'Niche', type: 'singleSelect', options: { choices: [
    { name: 'Développement personnel' }, { name: 'Business/Entrepreneuriat' },
    { name: 'Marketing digital' }, { name: 'Santé/Bien-être' },
    { name: 'Finance/Investissement' }, { name: 'Lifestyle' },
    { name: 'Parentalité' }, { name: 'Formation professionnelle' },
    { name: 'Art/Créativité' }, { name: 'Spiritualité' }, { name: 'Autre' }
  ]}},
  { name: 'Sous_Niche', type: 'singleLineText' },
  { name: 'Expérience_Années', type: 'number', options: { precision: 0 } },
  { name: 'CA_Mensuel', type: 'number', options: { precision: 2 } },
  { name: 'CA_Source_Principale', type: 'singleSelect', options: { choices: [
    { name: 'Formation en ligne' }, { name: 'Coaching individuel' },
    { name: 'Programme de groupe' }, { name: 'Produits physiques' },
    { name: 'Affiliation' }, { name: 'Membership' },
    { name: 'Services' }, { name: 'Autre' }
  ]}},
  { name: 'Marge_Bénéficiaire', type: 'percent', options: { precision: 2 } },
  
  // Section 4: Audience et acquisition
  { name: 'Taille_Liste_Email', type: 'number', options: { precision: 0 } },
  { name: 'Taille_Audience_Sociale', type: 'number', options: { precision: 0 } },
  { name: 'Canal_Acquisition_Principal', type: 'singleSelect', options: { choices: [
    { name: 'Publicité Facebook/Instagram' }, { name: 'Publicité Google/YouTube' },
    { name: 'SEO' }, { name: 'Contenu organique réseaux sociaux' },
    { name: 'Partenariats/JV' }, { name: 'Affiliation' },
    { name: 'Bouche à oreille' }, { name: 'Podcast' }, { name: 'Autre' }
  ]}},
  { name: 'Budget_Ads_Mensuel', type: 'number', options: { precision: 2 } },
  { name: 'Prix_Moyen_Offre', type: 'number', options: { precision: 2 } },
  { name: 'Taux_Conversion_Global', type: 'percent', options: { precision: 2 } },
  
  // Section 5: Funnel et processus de vente
  { name: 'Type_Funnel_Principal', type: 'singleSelect', options: { choices: [
    { name: 'Webinaire automatisé' }, { name: 'Challenge gratuit' },
    { name: 'Vidéo de vente (VSL)' }, { name: 'Appel découverte' },
    { name: 'Séquence email' }, { name: 'Quiz/Diagnostic' },
    { name: 'Mini-formation gratuite' }, { name: 'Livre/Guide PDF' },
    { name: 'Masterclass live' }, { name: 'Autre' }
  ]}},
  { name: 'Type_Contenu_Principal', type: 'singleSelect', options: { choices: [
    { name: 'Vidéo' }, { name: 'Audio/Podcast' },
    { name: 'Articles/Blog' }, { name: 'Stories/Reels' },
    { name: 'Emails' }, { name: 'Lives' }, { name: 'Autre' }
  ]}},
  { name: 'CTA_Principale', type: 'singleLineText' },
  { name: 'Processus_Closing', type: 'singleSelect', options: { choices: [
    { name: '100% automatisé' }, { name: 'Appel de closing' },
    { name: 'Messenger/WhatsApp' }, { name: 'Email' },
    { name: 'Webinaire live' }, { name: 'Autre' }
  ]}},
  { name: 'Outil_CRM', type: 'singleLineText' },
  
  // Section 6: Objectifs et défis
  { name: 'Objectif_CA_6Mois', type: 'number', options: { precision: 2 } },
  { name: 'Priorité_1', type: 'multilineText' },
  { name: 'Priorité_2', type: 'multilineText' },
  { name: 'Défi_Principal', type: 'multilineText' },
  { name: 'Blocage_Croissance', type: 'multipleSelects', options: { choices: [
    { name: 'Trafic insuffisant' }, { name: 'Conversion faible' },
    { name: 'Problèmes de production' }, { name: 'Manque de temps' },
    { name: 'Équipe insuffisante' }, { name: 'Budget limité' },
    { name: 'Positionnement flou' }, { name: 'Offre mal adaptée' },
    { name: 'Concurrence forte' }, { name: 'Autre' }
  ]}},
  { name: 'Objectif_Collaboration', type: 'multilineText' },
  
  // Section 7: Qualification et suivi
  { name: 'Statut', type: 'singleSelect', options: { choices: [
    { name: 'Nouveau' }, { name: 'Qualifié' },
    { name: 'MVD en cours' }, { name: 'Due Diligence' },
    { name: 'Contrat signé' }, { name: 'Refusé' }
  ]}},
  { name: 'Date_Soumission', type: 'dateTime', options: { 
    dateFormat: { name: 'iso', format: 'YYYY-MM-DD' }, 
    timeFormat: { name: '24hour', format: 'HH:mm' }, 
    timeZone: 'Europe/Paris' 
  } },
  { name: 'Dernière_Modification', type: 'dateTime', options: { 
    dateFormat: { name: 'iso', format: 'YYYY-MM-DD' }, 
    timeFormat: { name: '24hour', format: 'HH:mm' }, 
    timeZone: 'Europe/Paris' 
  } }
];

// Fonction pour récupérer les champs existants
async function getExistingFields() {
  try {
    console.log(`Récupération des champs existants de la table ${TABLE_NAME}...`);
    
    const response = await axios.get(
      `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const table = response.data.tables.find(t => t.name === TABLE_NAME);
    if (!table) {
      console.error(`❌ Table ${TABLE_NAME} non trouvée!`);
      return null;
    }
    
    console.log(`✅ ${table.fields.length} champs trouvés dans la table ${TABLE_NAME}`);
    return table;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des champs existants:');
    if (error.response?.data?.error?.message) {
      console.error(error.response.data.error.message);
    } else {
      console.error(error.message);
    }
    return null;
  }
}

// Fonction pour ajouter un champ à la table
async function addField(field) {
  try {
    console.log(`Ajout du champ ${field.name}...`);
    
    const response = await axios.post(
      `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables/${TABLE_NAME}/fields`,
      field,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log(`✅ Champ ${field.name} ajouté avec succès!`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur lors de l'ajout du champ ${field.name}:`);
    if (error.response?.data?.error?.message) {
      console.error(error.response.data.error.message);
    } else {
      console.error(error.message);
    }
    
    if (error.response?.data?.error?.details) {
      console.error('Détails:', JSON.stringify(error.response.data.error.details, null, 2));
    }
    return false;
  }
}

// Fonction principale
async function updateTable() {
  // Récupérer la table existante
  const existingTable = await getExistingFields();
  if (!existingTable) {
    return;
  }
  
  // Récupérer les noms des champs existants
  const existingFieldNames = existingTable.fields.map(f => f.name);
  
  // Identifier les champs manquants
  const missingFields = completeFieldsDefinition.filter(
    field => !existingFieldNames.includes(field.name)
  );
  
  console.log(`Il y a ${missingFields.length} champs manquants à ajouter.`);
  
  // Ajouter chaque champ manquant
  let addedCount = 0;
  for (const field of missingFields) {
    const success = await addField(field);
    if (success) {
      addedCount++;
    }
  }
  
  console.log(`✅ ${addedCount} champs ajoutés sur ${missingFields.length} manquants.`);
  console.log(`La table ${TABLE_NAME} est maintenant complète selon la structure souhaitée.`);
  console.log(`N'oubliez pas d'ajouter manuellement le champ de formule Score_Qualification!`);
}

updateTable();
