const axios = require('axios');

const API_KEY = 'patEvEhaTBRmTxpQc.5c3a7241c0d360d379260e8655a372d34dec2626c76f51736975c058f30fbfae';
const BASE_ID = 'app6Q4KQzMBm5MEsz';

// Définition de la table unifiée
const qualificationTable = {
  name: 'Qualification_Infopreneurs',
  description: 'Table unifiée pour la qualification des infopreneurs',
  fields: [
    // Informations d'identification
    { name: 'ID_Infopreneur', type: 'singleLineText' },
    { name: 'FullName', type: 'singleLineText' },
    { name: 'Email', type: 'email' },
    { name: 'Phone', type: 'phoneNumber' },
    { name: 'BusinessName', type: 'singleLineText' },
    
    // Informations business et audience
    { name: 'Niche', type: 'singleSelect', options: { choices: [
      { name: 'Marketing' }, { name: 'Finance' }, { name: 'Fitness' }, 
      { name: 'E-commerce' }, { name: 'Coaching' }, { name: 'Education' },
      { name: 'Other' }
    ]}},
    { name: 'SocialMediaLink', type: 'url' },
    
    // Réponses au questionnaire
    { name: 'MonthlyRevenue', type: 'number', options: { precision: 2 } },
    { name: 'CanalAcquisition', type: 'singleSelect', options: { choices: [
      { name: 'Ads' }, { name: 'SEO' }, { name: 'Social Media' },
      { name: 'Email' }, { name: 'Referral' }, { name: 'Other' }
    ]}},
    { name: 'AdsSpend', type: 'number', options: { precision: 2 } },
    { name: 'ProfitMargin', type: 'percent', options: { precision: 2 } },
    { name: 'AudienceSize', type: 'number', options: { precision: 0 } },
    { name: 'Objectives', type: 'multilineText' },
    { name: 'MainChallenges', type: 'multilineText' },
    { name: 'FunnelType', type: 'singleSelect', options: { choices: [
      { name: 'Call 1:1' }, { name: 'VSL' }, { name: 'Webinaire' },
      { name: 'Email sequence' }, { name: 'Quiz/Survey' }, { name: 'Autre' }
    ]}},
    
    // Statut et suivi
    { name: 'Status', type: 'singleSelect', options: { choices: [
      { name: 'New' }, { name: 'Qualified' }, { name: 'MVD Ongoing' },
      { name: 'DueDiligence' }, { name: 'Deal Signed' }, { name: 'Rejected' }
    ]}},
    { name: 'CreatedDate', type: 'dateTime', options: { 
      dateFormat: { name: 'iso', format: 'YYYY-MM-DD' }, 
      timeFormat: { name: '24hour', format: 'HH:mm' }, 
      timeZone: 'Europe/Paris' 
    } }
  ]
};

async function createTable() {
  try {
    console.log('Création de la table Qualification_Infopreneurs...');
    
    const response = await axios.post(
      `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`,
      qualificationTable,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Table Qualification_Infopreneurs créée avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors de la création de la table:');
    if (error.response?.data?.error?.message) {
      console.error(error.response.data.error.message);
    } else {
      console.error(error.message);
    }
    
    if (error.response?.data?.error?.details) {
      console.error('Détails:', JSON.stringify(error.response.data.error.details, null, 2));
    }
  }
}

createTable();
