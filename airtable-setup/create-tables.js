const axios = require('axios');

const API_KEY = 'patEvEhaTBRmTxpQc.5c3a7241c0d360d379260e8655a372d34dec2626c76f51736975c058f30fbfae';
const BASE_ID = 'app6Q4KQzMBm5MEsz';

// Définition des tables pour Questionnaires
const questionnaireTables = [
  {
    name: 'Questionnaires',
    description: 'Liste des questionnaires disponibles',
    fields: [
      { name: 'Titre', type: 'singleLineText' },
      { name: 'Description', type: 'multilineText' },
      { name: 'Catégorie', type: 'singleSelect', options: { choices: [
        { name: 'Marketing' }, { name: 'Finance' }, { name: 'Opérations' }, { name: 'Stratégie' }
      ]}},
      { name: 'Fonction_Cible', type: 'multipleSelects', options: { choices: [
        { name: 'Marketing' }, { name: 'Finance' }, { name: 'Operations' }, { name: 'IT' }, 
        { name: 'Sales' }, { name: 'HR' }, { name: 'R&D' }
      ]}},
      { name: 'Date_Création', type: 'date' },
      { name: 'Statut', type: 'singleSelect', options: { choices: [
        { name: 'Draft' }, { name: 'Active' }, { name: 'Archived' }
      ]}},
      { name: 'Score_Min_Acceptable', type: 'number' },
      { name: 'Score_Max_Possible', type: 'number' }
    ]
  },
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
      { name: 'Poids', type: 'number' },
      { name: 'Ordre', type: 'number' },
      { name: 'Est_Obligatoire', type: 'checkbox' }
    ]
  },
  {
    name: 'Sessions_Questionnaire',
    description: 'Sessions de remplissage des questionnaires',
    fields: [
      { name: 'Questionnaire_ID', type: 'singleLineText' },
      { name: 'Date_Début', type: 'dateTime' },
      { name: 'Date_Fin', type: 'dateTime' },
      { name: 'Statut', type: 'singleSelect', options: { choices: [
        { name: 'In Progress' }, { name: 'Completed' }
      ]}},
      { name: 'Score_Total', type: 'number' },
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
      { name: 'Score_Attribué', type: 'number' },
      { name: 'Commentaire', type: 'multilineText' },
      { name: 'Timestamp', type: 'dateTime' }
    ]
  }
];

// Définition des tables pour Due Diligence
const dueDiligenceTables = [
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
      { name: 'Date_Création', type: 'date' },
      { name: 'Date_Échéance', type: 'date' },
      { name: 'Progression', type: 'percent' },
      { name: 'Responsable', type: 'singleLineText' }
    ]
  },
  {
    name: 'DD_Items',
    description: 'Éléments des checklists de due diligence',
    fields: [
      { name: 'Checklist_ID', type: 'singleLineText' },
      { name: 'Titre', type: 'singleLineText' },
      { name: 'Description', type: 'multilineText' },
      { name: 'Statut', type: 'singleSelect', options: { choices: [
        { name: 'Not Started' }, { name: 'In Progress' }, { name: 'Completed' }
      ]}},
      { name: 'Criticité', type: 'singleSelect', options: { choices: [
        { name: 'High' }, { name: 'Medium' }, { name: 'Low' }
      ]}},
      { name: 'Responsable', type: 'singleLineText' },
      { name: 'Date_Échéance', type: 'date' },
      { name: 'Lien_Preuve', type: 'url' },
      { name: 'Commentaires', type: 'multilineText' },
      { name: 'KPIs_Associés', type: 'multilineText' }
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
      { name: 'Date_Upload', type: 'dateTime' },
      { name: 'Uploader', type: 'singleLineText' },
      { name: 'Commentaires', type: 'multilineText' }
    ]
  }
];

async function createTables() {
  try {
    const tables = [...questionnaireTables, ...dueDiligenceTables];
    
    for (const table of tables) {
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
        console.error(`❌ Erreur lors de la création de la table ${table.name}:`, 
          tableError.response?.data?.error?.message || tableError.message);
      }
    }
    
    console.log('Processus de création de tables terminé.');
  } catch (error) {
    console.error('Erreur générale:', error.message);
  }
}

createTables();
