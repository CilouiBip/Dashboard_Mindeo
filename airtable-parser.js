import fs from 'fs';

// Fonction principale de parsing
function parseAirtableLogs(logs) {
  // Diviser le texte en lignes
  const lines = logs.split('\n').filter(line => line.trim() !== '');
  
  // Variables pour stocker les informations
  let result = [];
  let currentTable = null;
  let currentField = null;
  let inChoices = false;
  let choices = [];
  
  // Parcourir chaque ligne
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Ignorer les lignes "CONSOLE.LOG"
    if (line === "CONSOLE.LOG") continue;
    
    // Détecter une nouvelle table
    if (line.startsWith('"Table:')) {
      const tableName = line.replace('"Table:', '').replace('"', '').trim();
      currentTable = { name: tableName, fields: [] };
      result.push(currentTable);
      inChoices = false;
      continue;
    }
    
    // Détecter un nouveau champ
    if (line.startsWith('"- Field:')) {
      if (currentTable) {
        const parts = line.replace('"- Field:', '').replace('"', '').split(',');
        const fieldName = parts[0].trim();
        const fieldType = parts[1].replace('Type:', '').replace('"', '').trim();
        
        currentField = { name: fieldName, type: fieldType };
        if (fieldType === "formula" || fieldType === "rollup") {
          currentField.formula = "";
        }
        if (fieldType === "singleSelect" || fieldType === "multipleSelects") {
          currentField.choices = [];
          inChoices = true;
          choices = [];
        } else {
          inChoices = false;
        }
        
        currentTable.fields.push(currentField);
      }
      continue;
    }
    
    // Traiter les formules
    if (currentField && (currentField.type === "formula" || currentField.type === "rollup") && line.startsWith('" Formula:')) {
      currentField.formula = line.replace('" Formula:', '').replace('"', '').trim();
      continue;
    }
    
    // Traiter les choix
    if (inChoices && line.startsWith('" Choices:')) {
      const choicesText = line.replace('" Choices:', '').replace('"', '').trim();
      choices = choicesText.split(',').map(choice => choice.trim());
      currentField.choices = choices;
      inChoices = false;
      continue;
    }
  }
  
  return result;
}

// Fonction principale
function processLogs() {
  // Créer un chemin pour le fichier de sortie
  const outputFile = './airtable-schema.json';
  
  // Vérifier si les logs sont passés en paramètre
  if (process.argv.length > 2) {
    // Lire les logs depuis un fichier
    const logFile = process.argv[2];
    const logs = fs.readFileSync(logFile, 'utf8');
    processLogsData(logs, outputFile);
  } else {
    // Lire les logs depuis l'entrée standard (stdin)
    let data = '';
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    
    process.stdin.on('data', function(chunk) {
      data += chunk;
    });
    
    process.stdin.on('end', function() {
      processLogsData(data, outputFile);
    });
  }
}

// Fonction pour traiter les données des logs
function processLogsData(logs, outputFile) {
  // Parser les logs
  const schema = parseAirtableLogs(logs);
  
  // Écrire le résultat dans un fichier JSON
  fs.writeFileSync(outputFile, JSON.stringify(schema, null, 2), 'utf8');
  
  console.log(`✅ Schema généré avec succès dans ${outputFile}`);
  console.log(`📊 Statistiques:`);
  console.log(`   - Nombre de tables: ${schema.length}`);
  console.log(`   - Nombre total de champs: ${schema.reduce((total, table) => total + table.fields.length, 0)}`);
}

// Exécuter le script
processLogs();
