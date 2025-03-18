/**
 * Script : getAirtableSchema.js
 *
 * Objectif :
 * - Se connecter à Airtable avec la clé API
 * - Lister les tables (soit via la Metadata API bêta, soit en dur)
 * - Pour chaque table, récupérer la structure (les champs),
 *   et détecter les "link to record", "formula fields", etc.
 *
 * Usage :
 *   node getAirtableSchema.js
 */
import Airtable from 'airtable';
import fetch from 'node-fetch';
import fs from 'fs';

// ------------------------------
// 1. CONFIG
// ------------------------------
const AIRTABLE_API_KEY = 'patEvEhaTBRmTxpQc.5c3a7241c0d360d379260e8655a372d34dec2626c76f51736975c058f30fbfae';
const AIRTABLE_BASE_ID = 'app6Q4KQzMBm5MEsz';

// Option A : Si tu as déjà la liste de tes tables
//           (car l'API standard ne la donne pas d'office)
const HARDCODED_TABLE_NAMES = [
  'GLOBAL_SCORE',
  'KPIs',
  'AUDIT',
  'Qualification_Infopreneurs'
];

// Option B : Utiliser la Metadata API (bêta)
const USE_METADATA_API = true;  // Mets à false si tu ne veux pas faire la requête Metadata

// ------------------------------
// 2. INIT Airtable
// ------------------------------
const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

/** 
 * Va stocker le schéma final, sous forme d'objet :
 * {
 *   tables: [
 *     {
 *       name: "KPIs",
 *       fields: [
 *         { name: "Nom_KPI", type: "singleLineText" },
 *         { name: "Score_Normalisé", type: "formula", formula: "..." },
 *         { name: "InfopreneurID", type: "multipleRecordLinks", linkedTable: "..." },
 *         ...
 *       ],
 *     }
 *     ...
 *   ]
 * }
 */
const globalSchema = {
  baseId: AIRTABLE_BASE_ID,
  tables: []
};

// ------------------------------
// 3. Option B: Méthode via l'API Metadata (si souhaité)
// ------------------------------
async function fetchTablesFromMetadata() {
  // Endpoint de la Metadata API (bêta)
  // Doc : https://airtable.com/developers/metadata/docs#introduction
  const url = `https://api.airtable.com/v0/meta/bases/${AIRTABLE_BASE_ID}/tables`;

  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`
    }
  });
  if (!resp.ok) {
    throw new Error(`Metadata API error: ${resp.status} ${resp.statusText}`);
  }

  const data = await resp.json();
  // data.tables = array of { id, name, primaryField, fields, views, etc. }
  return data.tables.map(t => t.name);
}

// ------------------------------
// 4. Récupérer la structure d'une table (API standard & heuristiques)
// ------------------------------
async function getTableFieldsSchema(tableName) {
  // L'API standard d'Airtable ne donne pas un "schéma" direct. 
  // On fait donc un "heuristic" : on récupère 1 ou X records et on lit le type (??)
  // Malheureusement, l'API standard renvoie juste "fields: { <fieldName>: <value> }"
  // Donc on ne peut pas aisément détecter formula vs text, à moins de faire un guess.
  //
  // MIEUX : On combine la Metadata API (table.fields) pour avoir type, formula, etc.

  if (USE_METADATA_API) {
    // Appel direct pour la table depuis la metadata
    const mdUrl = `https://api.airtable.com/v0/meta/bases/${AIRTABLE_BASE_ID}/tables`;
    const resp = await fetch(mdUrl, {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` }
    });
    if (!resp.ok) {
      throw new Error(`Metadata API error (table-level): ${resp.status} ${resp.statusText}`);
    }
    const data = await resp.json();
    // Cherche la table par name
    const tableMeta = data.tables.find(t => t.name === tableName);
    if (!tableMeta) {
      return {
        name: tableName,
        fields: []
      };
    }
    // tableMeta.fields est un array de { name, type, options: {...} }
    // Exemple type = "formula", "multipleRecordLinks", etc.
    // Pour "formula", on a options.formulaText
    const fieldsArr = tableMeta.fields.map(f => {
      const fieldInfo = {
        name: f.name,
        type: f.type
      };
      if (f.type === 'formula') {
        // On peut tenter d'extraire la formule
        if (f.options && f.options.formulaText) {
          fieldInfo.formula = f.options.formulaText;
        }
      }
      if (f.type === 'multipleRecordLinks') {
        // Lien "Link to another record"
        // On peut récupérer f.options.linkedTableId, etc.
        if (f.options && f.options.linkedTableId) {
          fieldInfo.linkedTableId = f.options.linkedTableId;
        }
      }
      // etc. on peut ajouter d'autres cas
      return fieldInfo;
    });

    return {
      name: tableName,
      fields: fieldsArr
    };

  } else {
    // Sinon, si la Metadata API n'est pas utilisée, on ne peut que "deviner"
    // On fait un fetch sur la table, 1 record, on renvoie un truc minimal :
    const records = await base(tableName).select({ maxRecords: 1 }).firstPage();
    if (records.length === 0) {
      return {
        name: tableName,
        fields: []
      };
    }
    // On recupere record[0].fields => { fieldName: value }
    // => "type" inconnu. On renvoie un "unknown" ?
    const example = records[0].fields;
    const fieldsArr = Object.keys(example).map(k => ({
      name: k,
      type: 'unknown (guessed from standard API)'
    }));
    return { name: tableName, fields: fieldsArr };
  }
}

// ------------------------------
// 5. Main
// ------------------------------
(async function main() {
  try {
    let tableNames = HARDCODED_TABLE_NAMES;
    if (USE_METADATA_API) {
      // 1) Récupère liste des tables par la metadata
      console.log('[INFO] Fetching table names via Metadata API...');
      tableNames = await fetchTablesFromMetadata();
      console.log('[INFO] Found tables:', tableNames);
    }

    // 2) Pour chaque table, on récupère le schéma
    for (const tname of tableNames) {
      console.log(`\n--- Analyzing table: ${tname} ---`);
      const tblSchema = await getTableFieldsSchema(tname);
      globalSchema.tables.push(tblSchema);

      // Petit log
      console.log(`Fields in "${tname}":`);
      tblSchema.fields.forEach(f => {
        if (f.formula) {
          console.log(`  - ${f.name} [${f.type}] => formula: ${f.formula}`);
        } else if (f.linkedTableId) {
          console.log(`  - ${f.name} [link to tableId: ${f.linkedTableId}]`);
        } else {
          console.log(`  - ${f.name} [${f.type}]`);
        }
      });
    }

    // 3) Sauvegarde dans un JSON
    fs.writeFileSync('airtable_schema.json', JSON.stringify(globalSchema, null, 2), 'utf8');
    console.log('[INFO] Schema saved to airtable_schema.json');

    // 4) Génération du rapport Markdown
    generateMarkdownReport(globalSchema);
  } catch (err) {
    console.error('Erreur dans le script:', err);
  }
})();

// ------------------------------
// 6. Génération du rapport Markdown
// ------------------------------
function generateMarkdownReport(schema) {
  const { baseId, tables } = schema;
  
  let markdown = `# Rapport Technique: Schéma Airtable Mindeo\n\n`;
  markdown += `## Informations sur la Base\n\n`;
  markdown += `- **ID de la Base**: ${baseId}\n`;
  markdown += `- **Nombre de Tables**: ${tables.length}\n`;
  markdown += `- **Date du Rapport**: ${new Date().toLocaleString('fr-FR')}\n\n`;
  
  markdown += `## Vue d'Ensemble des Tables\n\n`;
  markdown += `| # | Nom de la Table | Nombre de Champs |\n`;
  markdown += `|---|----------------|------------------|
`;
  
  tables.forEach((table, index) => {
    markdown += `| ${index + 1} | ${table.name} | ${table.fields.length} |\n`;
  });
  
  markdown += `\n## Détails des Tables et Champs\n\n`;
  
  tables.forEach((table) => {
    markdown += `### Table: ${table.name}\n\n`;
    markdown += `- **Nombre de Champs**: ${table.fields.length}\n\n`;
    
    markdown += `#### Champs\n\n`;
    markdown += `| Nom du Champ | Type | Formule/Options |\n`;
    markdown += `|--------------|------|--------------|
`;
    
    table.fields.forEach((field) => {
      let fieldOptions = 'N/A';
      
      if (field.formula) {
        fieldOptions = `\`${field.formula.substring(0, 30)}${field.formula.length > 30 ? '...' : ''}\``;
      } else if (field.linkedTableId) {
        fieldOptions = `Lié à: ${field.linkedTableId}`;
      }
      
      markdown += `| ${field.name} | ${field.type} | ${fieldOptions} |\n`;
    });
    
    markdown += `\n`;
  });
  
  markdown += `## Relations entre Tables\n\n`;
  markdown += `| Table Source | Champ | Table Destination |\n`;
  markdown += `|--------------|-------|------------------|\n`;
  
  let hasRelations = false;
  
  tables.forEach((table) => {
    table.fields.forEach((field) => {
      if (field.linkedTableId) {
        hasRelations = true;
        // Trouver le nom de la table liée si possible
        const destinationTable = tables.find(t => t.id === field.linkedTableId);
        const destinationName = destinationTable ? destinationTable.name : field.linkedTableId;
        
        markdown += `| ${table.name} | ${field.name} | ${destinationName} |\n`;
      }
    });
  });
  
  if (!hasRelations) {
    markdown += `*Aucune relation trouvée entre les tables*\n`;
  }
  
  markdown += `\n## Notes Techniques\n\n`;
  markdown += `- Ce rapport a été généré automatiquement le ${new Date().toLocaleString('fr-FR')}.\n`;
  markdown += `- Les formules longues ont été tronquées pour la lisibilité.\n`;
  
  // Écrire le fichier Markdown
  fs.writeFileSync('airtable_schema_report.md', markdown, 'utf8');
  console.log('[INFO] Rapport Markdown généré dans airtable_schema_report.md');
}
