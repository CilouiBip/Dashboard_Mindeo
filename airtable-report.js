const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_KEY = 'patEvEhaTBRmTxpQc.5c3a7241c0d360d379260e8655a372d34dec2626c76f51736975c058f30fbfae';
const BASE_ID = 'app6Q4KQzMBm5MEsz';

const baseUrl = `https://api.airtable.com/v0/meta/bases/${BASE_ID}`;
const headers = {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json'
};

async function main() {
  try {
    // Ru00e9cupu00e9rer les tables
    console.log('Ru00e9cupu00e9ration des tables...');
    const tablesRes = await axios.get(`${baseUrl}/tables`, { headers });
    const tables = tablesRes.data.tables;
    
    // Ru00e9cupu00e9rer les infos de la base
    const baseRes = await axios.get(baseUrl, { headers });
    const baseInfo = baseRes.data;
    
    // Gu00e9nu00e9rer le rapport
    let report = `# Rapport des Tables Airtable - ${baseInfo.name}\n\n`;
    report += `## Ru00e9sumu00e9\n\n`;
    report += `- Base: ${baseInfo.name}\n`;
    report += `- ID: ${baseInfo.id}\n`;
    report += `- Tables: ${tables.length}\n\n`;
    
    report += `## Toutes les Tables\n\n`;
    
    // Pour chaque table
    for (const table of tables) {
      report += `### Table: ${table.name}\n`;
      report += `- ID: ${table.id}\n`;
      report += `- Description: ${table.description || 'N/A'}\n`;
      report += `- Champs: ${table.fields.length}\n\n`;
      
      report += `#### Champs\n\n`;
      report += `| Nom | Type | Description |\n`;
      report += `|-----|------|-------------|\n`;
      
      for (const field of table.fields) {
        report += `| ${field.name} | ${field.type} | ${field.description || ''} |\n`;
      }
      
      report += `\n`;
    }
    
    // u00c9crire le rapport
    fs.writeFileSync('airtable-tables-report.md', report);
    console.log('u2705 Rapport gu00e9nu00e9ru00e9 avec succu00e8s: airtable-tables-report.md');
    
  } catch (error) {
    console.error('Erreur:', error.message);
    if (error.response) {
      console.error('Du00e9tails:', error.response.data);
    }
  }
}

main();
