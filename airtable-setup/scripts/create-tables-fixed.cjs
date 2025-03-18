const axios = require('axios');

const API_KEY = 'patEvEhaTBRmTxpQc.5c3a7241c0d360d379260e8655a372d34dec2626c76f51736975c058f30fbfae';
const BASE_ID = 'app6Q4KQzMBm5MEsz';

// Définition des nouvelles tables selon la structure demandée
const newTables = [
  {
    name: 'Infopreneurs',
    description: 'Centraliser les leads / infopreneurs, leurs informations principales et leur statut dans le process',
    fields: [
      { name: 'ID_Infopreneur', type: 'singleLineText' },
      { name: 'FullName', type: 'singleLineText' },
      { name: 'Email', type: 'email' },
      { name: 'Phone', type: 'phoneNumber' },
      { name: 'BusinessName', type: 'singleLineText' },
      { name: 'Niche', type: 'singleSelect', options: { choices: [
        { name: 'Marketing' }, { name: 'Finance' }, { name: 'Fitness' }, 
        { name: 'E-commerce' }, { name: 'Coaching' }, { name: 'Education' },
        { name: 'Other' }
      ]}},
      { name: 'MonthlyRevenue', type: 'number', options: { precision: 2 } },
      { name: 'AudienceSize', type: 'number', options: { precision: 0 } },
      { name: 'QualificationScore', type: 'formula', options: { formula: 'IF({MonthlyRevenue} >= 10000, 20, 10) + IF({AudienceSize} >= 5000, 10, 5)' } },
      { name: 'Status', type: 'singleSelect', options: { choices: [
        { name: 'New' }, { name: 'Qualified' }, { name: 'MVD Ongoing' },
        { name: 'DueDiligence' }, { name: 'Deal Signed' }, { name: 'Rejected' }
      ]}},
      { name: 'CreatedDate', type: 'dateTime', options: { 
        dateFormat: { name: 'iso', format: 'YYYY-MM-DD' }, 
        timeFormat: { name: '24hour', format: 'HH:mm' }, 
        timeZone: 'Europe/Paris' 
      } },
      { name: 'LastUpdate', type: 'dateTime', options: { 
        dateFormat: { name: 'iso', format: 'YYYY-MM-DD' }, 
        timeFormat: { name: '24hour', format: 'HH:mm' }, 
        timeZone: 'Europe/Paris' 
      } }
    ]
  },
  {
    name: 'Questionnaire_Initial',
    description: 'Stocker toutes les réponses au questionnaire initial (style Acquisition.com) pour qualifier les leads',
    fields: [
      { name: 'ID_Answer', type: 'singleLineText' },
      { name: 'InfopreneurID', type: 'singleLineText' },
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
      { name: 'Score_Qualification', type: 'formula', options: { formula: 'IF({Q1_Revenue} >= 10000, 20, 10) + IF({Q5_AudienceSize} >= 5000, 10, 5)' } },
      { name: 'DateSubmitted', type: 'dateTime', options: { 
        dateFormat: { name: 'iso', format: 'YYYY-MM-DD' }, 
        timeFormat: { name: '24hour', format: 'HH:mm' }, 
        timeZone: 'Europe/Paris' 
      } }
    ]
  },
  {
    name: 'MVD_Answers',
    description: 'KPI & Data plus profondes pour le MVD',
    fields: [
      { name: 'ID_Answer', type: 'singleLineText' },
      { name: 'InfopreneurID', type: 'singleLineText' },
      { name: 'KPI_Name', type: 'singleSelect', options: { choices: [
        { name: 'CA Mensuel' }, { name: 'ROAS' }, { name: 'Taux de closing' },
        { name: 'Coût d\'acquisition' }, { name: 'LTV' }, { name: 'Other' }
      ]}},
      { name: 'CurrentValue', type: 'number', options: { precision: 2 } },
      { name: 'ProofUpload', type: 'multipleAttachments' },
      { name: 'ScoreDerived', type: 'formula', options: { formula: 'IF({KPI_Name} = "CA Mensuel", IF({CurrentValue} >= 10000, 20, 10), IF({KPI_Name} = "ROAS", IF({CurrentValue} >= 3, 20, 10), 0))' } },
      { name: 'CreatedDate', type: 'dateTime', options: { 
        dateFormat: { name: 'iso', format: 'YYYY-MM-DD' }, 
        timeFormat: { name: '24hour', format: 'HH:mm' }, 
        timeZone: 'Europe/Paris' 
      } }
    ]
  },
  {
    name: 'DD_Items',
    description: 'Checklist de Due Diligence - Chaque ligne correspond à un item à vérifier',
    fields: [
      { name: 'ID_Item', type: 'singleLineText' },
      { name: 'InfopreneurID', type: 'singleLineText' },
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
      { name: 'ItemName', type: 'singleLineText' },
      { name: 'Description', type: 'multilineText' },
      { name: 'DueDate', type: 'date', options: { dateFormat: { name: 'iso', format: 'YYYY-MM-DD' } } },
      { name: 'Owner', type: 'singleLineText' },
      { name: 'Status', type: 'singleSelect', options: { choices: [
        { name: 'Not Started' }, { name: 'In Progress' }, { name: 'Completed' }, { name: 'Validé' }
      ]}},
      { name: 'DeliverableType', type: 'singleSelect', options: { choices: [
        { name: 'PDF' }, { name: 'Excel' }, { name: 'Note d\'analyse' }, 
        { name: 'Email' }, { name: 'Screenshot' }, { name: 'Autre' }
      ]}},
      { name: 'Attachment', type: 'multipleAttachments' },
      { name: 'Observations', type: 'multilineText' },
      { name: 'Priority', type: 'singleSelect', options: { choices: [
        { name: 'Low' }, { name: 'Medium' }, { name: 'High' }, { name: 'Critical' }
      ]}},
      { name: 'CreatedDate', type: 'dateTime', options: { 
        dateFormat: { name: 'iso', format: 'YYYY-MM-DD' }, 
        timeFormat: { name: '24hour', format: 'HH:mm' }, 
        timeZone: 'Europe/Paris' 
      } }
    ]
  },
  {
    name: 'DD_Phases',
    description: 'Étapes de la Due Diligence',
    fields: [
      { name: 'ID_Phase', type: 'singleLineText' },
      { name: 'InfopreneurID', type: 'singleLineText' },
      { name: 'PhaseName', type: 'singleSelect', options: { choices: [
        { name: 'Pré-diligence' }, { name: 'Juridique' }, { name: 'Financier' },
        { name: 'Marketing' }, { name: 'Tech' }, { name: 'Opérations' }
      ]}},
      { name: 'StartDate', type: 'date', options: { dateFormat: { name: 'iso', format: 'YYYY-MM-DD' } } },
      { name: 'EndDate', type: 'date', options: { dateFormat: { name: 'iso', format: 'YYYY-MM-DD' } } },
      { name: 'Status', type: 'singleSelect', options: { choices: [
        { name: 'Not Started' }, { name: 'In Progress' }, { name: 'Completed' }
      ]}},
      { name: 'Notes', type: 'multilineText' }
    ]
  },
  {
    name: 'Questions',
    description: 'Framework flexible pour les questionnaires (style typeform)',
    fields: [
      { name: 'ID_Question', type: 'singleLineText' },
      { name: 'QuestionText', type: 'multilineText' },
      { name: 'Category', type: 'singleSelect', options: { choices: [
        { name: 'Initial Qualification' }, { name: 'Marketing' }, { name: 'Finance' },
        { name: 'Operations' }, { name: 'Tech' }, { name: 'Other' }
      ]}},
      { name: 'QuestionType', type: 'singleSelect', options: { choices: [
        { name: 'Numeric' }, { name: 'Text' }, { name: 'MultipleChoice' },
        { name: 'YesNo' }, { name: 'Scale' }, { name: 'Other' }
      ]}},
      { name: 'Options', type: 'multilineText' },
      { name: 'Weight', type: 'number', options: { precision: 1 } }
    ]
  },
  {
    name: 'Answers',
    description: 'Réponses pour le système Questions flexible',
    fields: [
      { name: 'ID_Answer', type: 'singleLineText' },
      { name: 'ID_Question', type: 'singleLineText' },
      { name: 'InfopreneurID', type: 'singleLineText' },
      { name: 'Value', type: 'multilineText' },
      { name: 'SubmittedDate', type: 'dateTime', options: { 
        dateFormat: { name: 'iso', format: 'YYYY-MM-DD' }, 
        timeFormat: { name: '24hour', format: 'HH:mm' }, 
        timeZone: 'Europe/Paris' 
      } }
    ]
  }
];

async function createTables() {
  try {
    for (const table of newTables) {
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
