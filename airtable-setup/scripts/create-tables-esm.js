import axios from 'axios';
import dotenv from 'dotenv';
import { promises as fs } from 'fs';
import path from 'path';

// Configuration
dotenv.config();

const API_KEY = process.env.AIRTABLE_API_KEY;
const BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!API_KEY || !BASE_ID) {
  console.error('❌ Erreur: Les variables d\'environnement AIRTABLE_API_KEY et AIRTABLE_BASE_ID doivent être définies');
  process.exit(1);
}

// Configuration de l'API Airtable
const baseUrl = `https://api.airtable.com/v0/meta/bases/${BASE_ID}`;
const airtableAPI = axios.create({
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }
});

// Tableau pour stocker les IDs de tables pour les relations
const tableIds = {};

// Options de date/heure communes
const dateTimeOptions = {
  dateFormat: { name: 'iso', format: 'YYYY-MM-DD' },
  timeFormat: { name: '24hour', format: 'HH:mm' },
  timeZone: 'Europe/Paris'
};

// Définition des tables et de leurs champs
const tablesConfig = [
  {
    name: 'Infopreneurs',
    description: 'Stocke la fiche d\'identité, le questionnaire initial, et le "dealflow status" d\'un infopreneur.',
    fields: [
      { name: 'ID_Infopreneur', type: 'number', options: { precision: 0 } },
      { name: 'CreatedDate', type: 'dateTime', options: dateTimeOptions },
      { name: 'Nom_Complet', type: 'singleLineText' },
      { name: 'Téléphone', type: 'phoneNumber' },
      { name: 'Nom_Business', type: 'singleLineText' },
      { name: 'Sous_Niche', type: 'singleLineText' },
      { name: 'Expérience_Années', type: 'number', options: { precision: 0 } },
      { name: 'CA_Mensuel', type: 'number', options: { precision: 2 } },
      { name: 'Marge_Bénéficiaire', type: 'percent', options: { precision: 2 } },
      { name: 'Taille_Audience_Sociale', type: 'number', options: { precision: 0 } },
      { name: 'Taille_Liste_Email', type: 'number', options: { precision: 0 } },
      { 
        name: 'Blocage_Croissance', 
        type: 'multipleSelects', 
        options: {
          choices: [
            { name: 'Acquisition' },
            { name: 'Conversion' },
            { name: 'Rétention' },
            { name: 'Scaling' },
            { name: 'Marges' },
            { name: 'Équipe' },
            { name: 'Processus' },
            { name: 'Technique' }
          ]
        }
      },
      { name: 'Lien_Principal', type: 'url' },
      { name: 'Instagram', type: 'url' },
      { name: 'YouTube', type: 'url' },
      { name: 'LinkedIn', type: 'url' },
      { name: 'Facebook', type: 'url' },
      { name: 'TikTok', type: 'url' },
      { name: 'Autre_Réseau', type: 'url' },
      { 
        name: 'Score_Qualification', 
        type: 'formula', 
        options: {
          formula: 'IF({CA_Mensuel} >= 10000, 20, IF({CA_Mensuel} >= 5000, 10, 0)) + IF({Taille_Audience_Sociale} >= 5000, 15, 0) + IF({Taille_Liste_Email} >= 20000, 10, IF({Taille_Liste_Email} >= 5000, 5, 0))'
        }
      },
      {
        name: 'Statut',
        type: 'singleSelect',
        options: {
          choices: [
            { name: 'Nouveau' },
            { name: 'Qualifié' },
            { name: 'MVD' },
            { name: 'DueD' },
            { name: 'Contrat signé' },
            { name: 'Rejeté' }
          ]
        }
      },
      {
        name: 'StatutAuto',
        type: 'formula',
        options: {
          formula: 'IF({Score_Qualification} >= 50, "Qualifié", "Nouveau")'
        }
      },
      { name: 'Date_Soumission', type: 'dateTime', options: dateTimeOptions },
      { name: 'Dernière_Modification', type: 'dateTime', options: dateTimeOptions }
    ]
  },
  {
    name: 'MVD',
    description: 'Stocke les 15–20 KPI du MVD, pour un infopreneur (1 record = 1 MVD).',
    fields: [
      { name: 'ID_MVD', type: 'number', options: { precision: 0 } },
      // Le champ Infopreneur sera ajouté après la création de la table Infopreneurs
      { name: 'CreatedDate', type: 'dateTime', options: dateTimeOptions },
      { name: 'CAC', type: 'number', options: { precision: 2 } },
      { name: 'ROAS', type: 'number', options: { precision: 2 } },
      { name: 'Taux_Closing', type: 'percent', options: { precision: 2 } },
      { name: 'LTV', type: 'number', options: { precision: 2 } },
      { name: 'Coût_Acquisition', type: 'number', options: { precision: 2 } },
      { name: 'CPL', type: 'number', options: { precision: 2 } }, // Coût par Lead
      { name: 'CPC', type: 'number', options: { precision: 2 } }, // Coût par Clic
      { name: 'CTR', type: 'percent', options: { precision: 2 } }, // Click-Through Rate
      { name: 'Taux_Conversion', type: 'percent', options: { precision: 2 } },
      { name: 'Panier_Moyen', type: 'number', options: { precision: 2 } },
      { name: 'Marge_Brute', type: 'percent', options: { precision: 2 } },
      { name: 'Marge_Nette', type: 'percent', options: { precision: 2 } },
      { name: 'CA_Mensuel_Moyen', type: 'number', options: { precision: 2 } },
      { name: 'NPS', type: 'number', options: { precision: 1 } }, // Net Promoter Score
      { name: 'Taux_Retour', type: 'percent', options: { precision: 2 } },
      { name: 'Taux_Rétention', type: 'percent', options: { precision: 2 } },
      { name: 'Récurrence_Achat', type: 'number', options: { precision: 2 } },
      { name: 'Taux_Désabonnement', type: 'percent', options: { precision: 2 } },
      { name: 'Proof_Upload', type: 'multipleAttachments' },
      {
        name: 'Score_MVD',
        type: 'formula',
        options: {
          formula: 'IF({CAC} < 100, 15, IF({CAC} < 200, 10, 0)) + IF({ROAS} > 3, 15, IF({ROAS} > 2, 10, 0)) + IF({Taux_Closing} > 0.05, 15, IF({Taux_Closing} > 0.02, 10, 0))'
        }
      }
    ],
    relationFields: [
      {
        name: 'Infopreneur',
        type: 'singleRecordLink',
        options: {
          linkedTableName: 'Infopreneurs',
          relationship: 'many_to_one'
        }
      }
    ]
  },
  {
    name: 'DD_Items',
    description: 'Checklist de Due Diligence (20+ items) par infopreneur.',
    fields: [
      { name: 'ID_Item', type: 'number', options: { precision: 0 } },
      // Le champ Infopreneur sera ajouté après la création de la table Infopreneurs
      {
        name: 'Category',
        type: 'singleSelect',
        options: {
          choices: [
            { name: 'Juridique' },
            { name: 'Financier' },
            { name: 'Marketing' },
            { name: 'Tech' },
            { name: 'Opérations' },
            { name: 'Autre' }
          ]
        }
      },
      { name: 'ItemName', type: 'singleLineText' },
      { name: 'Description', type: 'multilineText' },
      { name: 'Attachment', type: 'multipleAttachments' },
      {
        name: 'Status',
        type: 'singleSelect',
        options: {
          choices: [
            { name: 'Not Started' },
            { name: 'In Progress' },
            { name: 'Completed' }
          ]
        }
      },
      {
        name: 'Priority',
        type: 'singleSelect',
        options: {
          choices: [
            { name: 'Low' },
            { name: 'Medium' },
            { name: 'High' },
            { name: 'Critical' }
          ]
        }
      },
      { name: 'Observations', type: 'multilineText' },
      { name: 'CreatedDate', type: 'dateTime', options: dateTimeOptions }
    ],
    relationFields: [
      {
        name: 'Infopreneur',
        type: 'multipleRecordLinks',
        options: {
          linkedTableName: 'Infopreneurs',
          relationship: 'many_to_many'
        }
      }
    ]
  },
  {
    name: 'ChecklistItems',
    description: 'Grosse liste (jusqu\'à 1500–2000 lignes) de points d\'audit, par infopreneur.',
    fields: [
      { name: 'ID_ChecklistItem', type: 'number', options: { precision: 0 } },
      // Le champ Infopreneur sera ajouté après la création de la table Infopreneurs
      {
        name: 'Dimension',
        type: 'singleSelect',
        options: {
          choices: [
            { name: 'Marketing' },
            { name: 'Sales' },
            { name: 'Ops' },
            { name: 'Finance' },
            { name: 'Tech' },
            { name: 'Légal' },
            { name: 'Recrutement' },
            { name: 'Formation' }
          ]
        }
      },
      { name: 'SubDimension', type: 'singleLineText' },
      { name: 'ProblemName', type: 'singleLineText' },
      { name: 'Process', type: 'multilineText' }, // ou url si besoin
      {
        name: 'Criticality',
        type: 'singleSelect',
        options: {
          choices: [
            { name: 'High' },
            { name: 'Medium' },
            { name: 'Low' }
          ]
        }
      },
      {
        name: 'Status',
        type: 'singleSelect',
        options: {
          choices: [
            { name: 'To Review' },
            { name: 'In progress' },
            { name: 'Completed' }
          ]
        }
      },
      { name: 'Attachment', type: 'multipleAttachments' },
      { name: 'Observations', type: 'multilineText' }
    ],
    relationFields: [
      {
        name: 'Infopreneur',
        type: 'multipleRecordLinks',
        options: {
          linkedTableName: 'Infopreneurs',
          relationship: 'many_to_many'
        }
      }
    ]
  },
  {
    name: 'ProjectPlanPriority',
    description: 'Liste d\'actions / plan de projet prioritaire.',
    fields: [
      { name: 'Action_Number', type: 'number', options: { precision: 0 } },
      // Le champ Infopreneur sera ajouté après la création de la table Infopreneurs
      { name: 'Action_Name', type: 'singleLineText' },
      {
        name: 'Owner',
        type: 'singleSelect',
        options: {
          choices: [
            { name: 'Team Member A' },
            { name: 'Team Member B' },
            { name: 'Team Member C' },
            { name: 'External Partner' }
          ]
        }
      },
      {
        name: 'Priority_Level',
        type: 'singleSelect',
        options: {
          choices: [
            { name: 'High' },
            { name: 'Medium' },
            { name: 'Low' }
          ]
        }
      },
      {
        name: 'Status',
        type: 'singleSelect',
        options: {
          choices: [
            { name: 'Todo' },
            { name: 'In progress' },
            { name: 'Done' }
          ]
        }
      },
      { name: 'Start_Date', type: 'dateTime', options: dateTimeOptions },
      { name: 'Completion_Date', type: 'dateTime', options: dateTimeOptions },
      { name: 'Estimated_Hours', type: 'number', options: { precision: 1 } },
      { name: 'Actual_Hours', type: 'number', options: { precision: 1 } },
      { name: 'Comments', type: 'multilineText' }
    ],
    relationFields: [
      {
        name: 'Infopreneur',
        type: 'multipleRecordLinks',
        options: {
          linkedTableName: 'Infopreneurs',
          relationship: 'many_to_many'
        }
      }
    ]
  }
];

/**
 * Vérifie si une table existe déjà
 * @param {string} tableName - Nom de la table à vérifier
 * @returns {Promise<{exists: boolean, tableId: string|null}>}
 */
async function checkTableExists(tableName) {
  try {
    console.log(`🔍 Vérification de l'existence de la table "${tableName}"...`);
    const response = await airtableAPI.get(`${baseUrl}/tables`);
    const existingTable = response.data.tables.find(table => table.name === tableName);
    
    if (existingTable) {
      console.log(`✅ Table "${tableName}" trouvée avec l'ID: ${existingTable.id}`);
      return { exists: true, tableId: existingTable.id };
    } else {
      console.log(`ℹ️ Table "${tableName}" non trouvée.`);
      return { exists: false, tableId: null };
    }
  } catch (error) {
    console.error(`❌ Erreur lors de la vérification de la table "${tableName}":`, error.message);
    if (error.response?.data?.error) {
      console.error('Détails:', error.response.data.error.message);
    }
    throw error;
  }
}

/**
 * Vérifie si un champ existe déjà dans une table
 * @param {string} tableId - ID de la table
 * @param {string} fieldName - Nom du champ à vérifier
 * @returns {Promise<boolean>}
 */
async function checkFieldExists(tableId, fieldName) {
  try {
    const response = await airtableAPI.get(`${baseUrl}/tables/${tableId}/fields`);
    return response.data.fields.some(field => field.name === fieldName);
  } catch (error) {
    console.error(`❌ Erreur lors de la vérification du champ "${fieldName}":`, error.message);
    return false;
  }
}

/**
 * Crée une nouvelle table
 * @param {Object} tableConfig - Configuration de la table
 * @returns {Promise<{id: string, name: string}>}
 */
async function createTable(tableConfig) {
  try {
    console.log(`🔧 Création de la table "${tableConfig.name}"...`);
    
    // Créer une copie du tableConfig sans le champ relationFields
    const { relationFields, ...configWithoutRelations } = tableConfig;
    
    const response = await airtableAPI.post(
      `${baseUrl}/tables`,
      configWithoutRelations
    );
    
    console.log(`✅ Table "${tableConfig.name}" créée avec succès! ID: ${response.data.id}`);
    return { id: response.data.id, name: tableConfig.name };
  } catch (error) {
    console.error(`❌ Erreur lors de la création de la table "${tableConfig.name}":`, error.message);
    if (error.response?.data?.error) {
      console.error('Détails:', error.response.data.error.message);
      if (error.response.data.error.details) {
        console.error('Informations supplémentaires:', JSON.stringify(error.response.data.error.details, null, 2));
      }
    }
    throw error;
  }
}

/**
 * Ajoute un champ à une table existante
 * @param {string} tableId - ID de la table
 * @param {Object} field - Configuration du champ
 * @returns {Promise<Object>}
 */
async function addField(tableId, field) {
  try {
    const fieldExists = await checkFieldExists(tableId, field.name);
    
    if (fieldExists) {
      console.log(`ℹ️ Le champ "${field.name}" existe déjà dans la table ${tableId}. Ignoré.`);
      return { success: true, message: 'Field already exists' };
    }
    
    console.log(`🔧 Ajout du champ "${field.name}" à la table ${tableId}...`);
    const response = await airtableAPI.post(
      `${baseUrl}/tables/${tableId}/fields`,
      field
    );
    
    console.log(`✅ Champ "${field.name}" ajouté avec succès!`);
    return response.data;
  } catch (error) {
    console.error(`❌ Erreur lors de l'ajout du champ "${field.name}":`, error.message);
    if (error.response?.data?.error) {
      console.error('Détails:', error.response.data.error.message);
      if (error.response.data.error.details) {
        console.error('Informations supplémentaires:', JSON.stringify(error.response.data.error.details, null, 2));
      }
    }
    // Ne pas interrompre le processus si un champ échoue
    return { success: false, error: error.message };
  }
}

/**
 * Ajoute un champ de relation à une table
 * @param {string} tableId - ID de la table source
 * @param {Object} relationField - Configuration de la relation
 * @param {Object} tableIds - Mapping des noms de tables vers leurs IDs
 * @returns {Promise<Object>}
 */
async function addRelationField(tableId, relationField, tableIds) {
  try {
    const { linkedTableName, ...options } = relationField.options;
    
    if (!tableIds[linkedTableName]) {
      throw new Error(`Table liée "${linkedTableName}" non trouvée dans le mapping des IDs`);
    }
    
    const fieldConfig = {
      name: relationField.name,
      type: relationField.type,
      options: {
        ...options,
        linkedTableId: tableIds[linkedTableName]
      }
    };
    
    return await addField(tableId, fieldConfig);
  } catch (error) {
    console.error(`❌ Erreur lors de l'ajout du champ de relation "${relationField.name}":`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Sauvegarde le mapping des IDs de tables dans un fichier JSON
 * @param {Object} tableIds - Mapping des noms de tables vers leurs IDs
 */
async function saveTableIdsToFile(tableIds) {
  try {
    const filePath = path.join(process.cwd(), 'airtable-table-ids.json');
    await fs.writeFile(filePath, JSON.stringify(tableIds, null, 2));
    console.log(`✅ IDs des tables sauvegardés dans ${filePath}`);
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde des IDs de tables:', error.message);
  }
}

/**
 * Vérifie si une ancienne table existe et s'il faut la renommer
 * @param {string} oldName - Ancien nom de la table
 * @param {string} newName - Nouveau nom de la table
 * @returns {Promise<{shouldRename: boolean, tableId: string|null}>}
 */
async function checkForRenaming(oldName, newName) {
  try {
    // Vérifier si la nouvelle table existe déjà
    const { exists: newExists } = await checkTableExists(newName);
    if (newExists) {
      // Si la nouvelle table existe déjà, pas besoin de renommage
      return { shouldRename: false, tableId: null };
    }
    
    // Vérifier si l'ancienne table existe
    const { exists: oldExists, tableId } = await checkTableExists(oldName);
    if (oldExists) {
      console.log(`🔄 Table "${oldName}" trouvée et sera renommée en "${newName}"`);
      return { shouldRename: true, tableId };
    }
    
    return { shouldRename: false, tableId: null };
  } catch (error) {
    console.error(`❌ Erreur lors de la vérification pour le renommage:`, error.message);
    return { shouldRename: false, tableId: null };
  }
}

/**
 * Renomme une table existante
 * @param {string} tableId - ID de la table à renommer
 * @param {string} newName - Nouveau nom pour la table
 * @returns {Promise<boolean>}
 */
async function renameTable(tableId, newName) {
  try {
    console.log(`🔄 Renommage de la table ${tableId} en "${newName}"...`);
    await airtableAPI.patch(`${baseUrl}/tables/${tableId}`, {
      name: newName
    });
    console.log(`✅ Table renommée avec succès en "${newName}"!`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur lors du renommage de la table en "${newName}":`, error.message);
    if (error.response?.data?.error) {
      console.error('Détails:', error.response.data.error.message);
    }
    return false;
  }
}

/**
 * Vérifie les tables pour des renommages potentiels
 */
async function checkForTableRenaming() {
  // Mapping des anciens noms vers les nouveaux noms
  const renameMapping = {
    'Audit_Items': 'ChecklistItems',
    'Actions_Priority': 'ProjectPlanPriority'
  };
  
  for (const [oldName, newName] of Object.entries(renameMapping)) {
    console.log(`🔍 Vérification si la table "${oldName}" doit être renommée en "${newName}"...`);
    const { shouldRename, tableId } = await checkForRenaming(oldName, newName);
    
    if (shouldRename && tableId) {
      const renamed = await renameTable(tableId, newName);
      if (renamed) {
        tableIds[newName] = tableId;
      }
    }
  }
}

/**
 * Fonction principale qui orchestre le processus de création/mise à jour des tables
 */
async function main() {
  console.log('🚀 Démarrage du processus de restructuration des tables Airtable...');
  console.log('🔑 Utilisation de la base Airtable avec l\'ID:', BASE_ID);
  
  try {
    // Vérifier si des tables existantes doivent être renommées
    await checkForTableRenaming();
    
    // Première passe: créer ou récupérer les tables existantes
    for (const tableConfig of tablesConfig) {
      const { exists, tableId } = await checkTableExists(tableConfig.name);
      
      if (exists) {
        console.log(`📝 Utilisation de la table existante "${tableConfig.name}" avec ID: ${tableId}`);
        tableIds[tableConfig.name] = tableId;
        
        // Ajouter les champs manquants
        for (const field of tableConfig.fields) {
          await addField(tableId, field);
        }
      } else {
        // Créer la nouvelle table
        const { id } = await createTable(tableConfig);
        tableIds[tableConfig.name] = id;
      }
    }
    
    // Sauvegarder les IDs de tables pour référence future
    await saveTableIdsToFile(tableIds);
    
    console.log('\n📊 Résumé des IDs de tables:');
    for (const [name, id] of Object.entries(tableIds)) {
      console.log(`- ${name}: ${id}`);
    }
    
    // Deuxième passe: ajouter les champs de relation
    console.log('\n🔄 Configuration des relations entre tables...');
    
    for (const tableConfig of tablesConfig) {
      if (tableConfig.relationFields && tableConfig.relationFields.length > 0) {
        const tableId = tableIds[tableConfig.name];
        
        console.log(`📝 Ajout des relations pour la table "${tableConfig.name}"...`);
        
        for (const relationField of tableConfig.relationFields) {
          await addRelationField(tableId, relationField, tableIds);
        }
      }
    }
    
    console.log('\n✅ Processus de restructuration des tables terminé avec succès!');
    console.log('📋 Résumé:');
    console.log(`- Tables configurées: ${Object.keys(tableIds).length}`);
    console.log('- Relations établies entre les tables');
    console.log('\n🔍 Pour voir les détails complets, consultez les logs ci-dessus.');
    console.log('\n📌 Note: Si besoin, les formules complexes peuvent être ajustées manuellement dans l\'interface Airtable.');
    
  } catch (error) {
    console.error('\n❌ Erreur lors du processus de restructuration:', error.message);
    console.error('Le processus s\'est terminé avec des erreurs. Vérifiez les logs pour plus de détails.');
    process.exit(1);
  }
}

// Exécution du script
main();
