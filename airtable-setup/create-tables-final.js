const axios = require('axios');

const API_KEY = 'patEvEhaTBRmTxpQc.5c3a7241c0d360d379260e8655a372d34dec2626c76f51736975c058f30fbfae';
const BASE_ID = 'app6Q4KQzMBm5MEsz';

// Tables restantes à créer
const remainingTables = [
  {
    name: 'Questions',
    description: 'Questions des questionnaires',
    fields: [
      { name: 'Questionnaire_ID', type: 'singleLineText' },
      { name: 'Texte_Question', type: 'multilineText' },
      { name: 'Type_Question', type: 'singleSelect', options: { choices: [
        { name: 'Choix Multiple' }, { name: 'Texte' }, { name: 'Numérique' }, { name: 'Oui/Non' }
      ]}},
      { name: 'Options', type: 'multilineText' },
      { name: 'Poids', type: 'number', options: { precision: 1 } },
      { name: 'Ordre', type: 'number', options: { precision: 0 } },
      { name: 'Est_Obligatoire', type: 'checkbox', options: {} }
    ]
  },
  {
    name: 'Sessions_Questionnaire',
    description: 'Sessions de remplissage des questionnaires',
    fields: [
      { name: 'Questionnaire_ID', type: 'singleLineText' },
      { name: 'Date_Début', type: 'dateTime', options: { dateFormat: { name: 'iso', format: 'YYYY-MM-DD' }, timeFormat: { name: '24hour', format: 'HH:mm' }, timeZone: 'Europe/Paris' } },
      { name: 'Date_Fin', type: 'dateTime', options: { dateFormat: { name: 'iso', format: 'YYYY-MM-DD' }, timeFormat: { name: '24hour', format: 'HH:mm' }, timeZone: 'Europe/Paris' } },
      { name: 'Statut', type: 'singleSelect', options: { choices: [
        { name: 'In Progress' }, { name: 'Completed' }
      ]}},
      { name: 'Score_Total', type: 'number', options: { precision: 1 } },
      { name: 'Utilisateur', type: 'singleLineText' },
      { name: 'Entreprise_Cible', type: 'singleLineText' }
    ]
  },
  {
    name: 'Réponses',
    description: 'Réponses aux questions',
    fields: [
      { name: 'Session_ID', type: 'singleLineText' },
      { name: 'Question_ID', type: 'singleLineText' },
      { name: 'Valeur_Réponse', type: 'multilineText' },
      { name: 'Score_Attribué', type: 'number', options: { precision: 1 } },
      { name: 'Commentaire', type: 'multilineText' },
      { name: 'Timestamp', type: 'dateTime', options: { dateFormat: { name: 'iso', format: 'YYYY-MM-DD' }, timeFormat: { name: '24hour', format: 'HH:mm' }, timeZone: 'Europe/Paris' } }
    ]
  },
  {
    name: 'DD_Checklists',
    description: 'Checklists de due diligence',
    fields: [
      { name: 'Nom', type: 'singleLineText' },
      { name: 'Description', type: 'multilineText' },
      { name: 'Catégorie', type: 'singleSelect', options: { choices: [
        { name: 'Juridique' }, { name: 'Financier' }, { name: 'Opérationnel' }, { name: 'IT' }
      ]}},
      { name: 'Statut', type: 'singleSelect', options: { choices: [
        { name: 'Not Started' }, { name: 'In Progress' }, { name: 'Completed' }
      ]}},
      { name: 'Deal_ID', type: 'singleLineText' },
      { name: 'Date_Création', type: 'date', options: { dateFormat: { name: 'iso', format: 'YYYY-MM-DD' } } },
      { name: 'Date_Échéance', type: 'date', options: { dateFormat: { name: 'iso', format: 'YYYY-MM-DD' } } },
      { name: 'Progression', type: 'percent', options: {} },
      { name: 'Responsable', type: 'singleLineText' }
    ]
  },
  {
    name: 'DD_Documents',
    description: 'Documents liés aux items de due diligence',
    fields: [
      { name: 'Item_ID', type: 'singleLineText' },
      { name: 'Nom_Fichier', type: 'singleLineText' },
      { name: 'Type_Document', type: 'singleSelect', options: { choices: [
        { name: 'PDF' }, { name: 'Document' }, { name: 'Spreadsheet' }, { name: 'Image' }, { name: 'Other' }
      ]}},
      { name: 'URL_Document', type: 'url' },
      { name: 'Date_Upload', type: 'dateTime', options: { dateFormat: { name: 'iso', format: 'YYYY-MM-DD' }, timeFormat: { name: '24hour', format: 'HH:mm' }, timeZone: 'Europe/Paris' } },
      { name: 'Uploader', type: 'singleLineText' },
      { name: 'Commentaires', type: 'multilineText' }
    ]
  }
];

async function createTables() {
  try {
    for (const table of remainingTables) {
      console.log(`Création de la table ${table.name}...`);
      
      try {
        const response = await axios.post(
          `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`,
          table,
          {
            headers: {
              'Authorization': `Bearer ${API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log(`✅ Table ${table.name} créée avec succès!`);
      } catch (tableError) {
        console.error(`❌ Erreur lors de la création de la table ${table.name}:`);
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
    }
    
    console.log('Processus de création de tables terminé.');
  } catch (error) {
    console.error('Erreur générale:', error.message);
  }
}

createTables();
