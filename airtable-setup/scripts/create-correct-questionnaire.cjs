const axios = require('axios');

const API_KEY = 'patEvEhaTBRmTxpQc.5c3a7241c0d360d379260e8655a372d34dec2626c76f51736975c058f30fbfae';
const BASE_ID = 'app6Q4KQzMBm5MEsz';

// Vérifier d'abord si les tables existent déjà
async function checkIfTablesExist() {
  try {
    const response = await axios.get(
      `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const tables = response.data.tables.map(table => table.name);
    return {
      infopreneurExists: tables.includes('Infopreneurs'),
      questionnaireExists: tables.includes('Questionnaire_Initial')
    };
  } catch (error) {
    console.error('Erreur lors de la vérification des tables:', error.message);
    return { infopreneurExists: false, questionnaireExists: false };
  }
}

// Définition de la table Questionnaire_Initial correcte
const questionnaireInitialTable = {
  name: 'Questionnaire_Initial',
  description: 'Réponses au questionnaire initial pour qualifier les leads',
  fields: [
    { name: 'ID_Answer', type: 'autoNumber' },
    // Champ de lien vers Infopreneurs - Sera configuré après vérification
    { name: 'Q1_Revenue', type: 'number', options: { precision: 2 } },
    { name: 'Q2_CanalAcquisition', type: 'singleSelect', options: { choices: [
      { name: 'Ads' }, { name: 'SEO' }, { name: 'Social Media' },
      { name: 'Email' }, { name: 'Referral' }, { name: 'Other' }
    ]}},
    { name: 'Q3_AdsSpend', type: 'number', options: { precision: 2 } },
    { name: 'Q4_ProfitMargin', type: 'percent', options: { precision: 2 } },
    { name: 'Q5_AudienceSize', type: 'number', options: { precision: 0 } },
    { name: 'Q6_Objectives', type: 'multilineText' },
    { name: 'Q7_MainChallenges', type: 'multilineText' },
    { name: 'Q8_FunnelType', type: 'singleLineText' },
    { name: 'DateSubmitted', type: 'dateTime', options: { 
      dateFormat: { name: 'iso', format: 'YYYY-MM-DD' }, 
      timeFormat: { name: '24hour', format: 'HH:mm' }, 
      timeZone: 'Europe/Paris' 
    } }
  ]
};

async function createTable() {
  // Vérifier si les tables existent
  const { infopreneurExists, questionnaireExists } = await checkIfTablesExist();
  
  if (!infopreneurExists) {
    console.error('❌ La table Infopreneurs n\'existe pas. Veuillez la créer d\'abord.');
    return;
  }
  
  if (questionnaireExists) {
    console.log('⚠️ La table Questionnaire_Initial existe déjà. Supprimez-la manuellement si vous souhaitez la recréer.');
    return;
  }
  
  try {
    // Créer la table Questionnaire_Initial
    console.log('Création de la table Questionnaire_Initial...');
    
    // Ajouter le champ de lien vers Infopreneurs
    questionnaireInitialTable.fields.splice(1, 0, {
      name: 'Infopreneur',
      type: 'multipleRecordLinks',
      options: {
        linkedTableName: 'Infopreneurs'
      }
    });
    
    const response = await axios.post(
      `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`,
      questionnaireInitialTable,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Table Questionnaire_Initial créée avec succès!');
    console.log('Configuration de la table terminée.');
  } catch (error) {
    console.error('❌ Erreur lors de la création de la table Questionnaire_Initial:');
    if (error.response?.data?.error?.message) {
      console.error(error.response.data.error.message);
    } else {
      console.error(error.message);
    }
    
    // Afficher les détails de l'erreur si disponibles
    if (error.response?.data?.error?.details) {
      console.error('Détails:', JSON.stringify(error.response.data.error.details, null, 2));
    }
  }
}

createTable();
