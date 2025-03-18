const axios = require('axios');

const API_KEY = 'patEvEhaTBRmTxpQc.5c3a7241c0d360d379260e8655a372d34dec2626c76f51736975c058f30fbfae';
const BASE_ID = 'app6Q4KQzMBm5MEsz';

// Définition de la table DD_Items
const ddItemsTable = {
  name: 'DD_Items',
  description: 'Checklist de Due Diligence - Chaque ligne correspond à un item à vérifier',
  fields: [
    { name: 'ID_Item', type: 'autoNumber', options: { format: "0" } },
    { name: 'InfopreneurID', type: 'singleLineText', options: {} },
    { name: 'Category', type: 'singleSelect', options: { choices: [
      { name: 'JURIDIQUE' }, { name: 'FINANCIER' }, { name: 'MARKETING' }, 
      { name: 'TECH' }, { name: 'ORG & OPS' }, { name: 'AUTRE' }
    ]}},
    { name: 'SubCategory', type: 'singleSelect', options: { choices: [
      { name: 'Contrats Commerciaux' }, { name: 'Structure d\'entreprise' },
      { name: 'Propriété intellectuelle' }, { name: 'RGPD' },
      { name: 'Comptabilité' }, { name: 'Fiscalité' },
      { name: 'Trésorerie' }, { name: 'RH' },
      { name: 'Stratégie marketing' }, { name: 'Acquisition' },
      { name: 'Conversion' }, { name: 'Rétention' },
      { name: 'Infrastructure' }, { name: 'Sécurité' },
      { name: 'Process opérationnels' }, { name: 'Équipe' }
    ]}},
    { name: 'ItemName', type: 'singleLineText', options: {} },
    { name: 'Description', type: 'multilineText', options: {} },
    { name: 'DueDate', type: 'date', options: { dateFormat: { name: 'iso', format: 'YYYY-MM-DD' } } },
    { name: 'Owner', type: 'singleLineText', options: {} },
    { name: 'Status', type: 'singleSelect', options: { choices: [
      { name: 'Not Started' }, { name: 'In Progress' }, { name: 'Completed' }, { name: 'Validé' }
    ]}},
    { name: 'DeliverableType', type: 'singleSelect', options: { choices: [
      { name: 'PDF' }, { name: 'Excel' }, { name: 'Note d\'analyse' }, 
      { name: 'Email' }, { name: 'Screenshot' }, { name: 'Autre' }
    ]}},
    { name: 'Attachment', type: 'multipleAttachments', options: {} },
    { name: 'Observations', type: 'multilineText', options: {} },
    { name: 'Priority', type: 'singleSelect', options: { choices: [
      { name: 'Low' }, { name: 'Medium' }, { name: 'High' }, { name: 'Critical' }
    ]}},
    { name: 'CreatedDate', type: 'dateTime', options: { 
      dateFormat: { name: 'iso', format: 'YYYY-MM-DD' }, 
      timeFormat: { name: '24hour', format: 'HH:mm' }, 
      timeZone: 'Europe/Paris' 
    } }
  ]
};

async function createDDItemsTable() {
  try {
    console.log(`Création de la table ${ddItemsTable.name}...`);
    
    try {
      const response = await axios.post(
        `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`,
        ddItemsTable,
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log(`✅ Table ${ddItemsTable.name} créée avec succès!`);
    } catch (tableError) {
      console.error(`❌ Erreur lors de la création de la table ${ddItemsTable.name}:`);
      if (tableError.response?.data?.error?.message) {
        console.error(tableError.response.data.error.message);
      } else {
        console.error(tableError.message);
      }
      
      // Afficher les détails de l'erreur si disponibles
      if (tableError.response?.data?.error?.details) {
        console.error('Détails:', JSON.stringify(tableError.response.data.error.details, null, 2));
      }
    }
    
    console.log('Processus de création de table terminé.');
  } catch (error) {
    console.error('Erreur générale:', error.message);
  }
}

createDDItemsTable();
