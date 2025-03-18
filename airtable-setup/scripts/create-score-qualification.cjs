const axios = require('axios');

const API_KEY = 'patEvEhaTBRmTxpQc.5c3a7241c0d360d379260e8655a372d34dec2626c76f51736975c058f30fbfae';
const BASE_ID = 'app6Q4KQzMBm5MEsz';
const TABLE_NAME = 'Qualification_Infopreneurs';

// Fonction pour récupérer l'ID de la table
async function getTableId() {
  try {
    console.log(`Récupération de l'ID de la table ${TABLE_NAME}...`);
    
    const response = await axios.get(
      `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const table = response.data.tables.find(t => t.name === TABLE_NAME);
    if (!table) {
      console.error(`❌ Table ${TABLE_NAME} non trouvée!`);
      return null;
    }
    
    console.log(`✅ Table trouvée! ID: ${table.id}`);
    return table.id;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de la table:');
    console.error(error.message);
    return null;
  }
}

// Fonction pour ajouter le champ Score_Qualification (formule)
async function addScoreQualificationField(tableId) {
  try {
    console.log(`Ajout du champ Score_Qualification...`);
    
    const formulaField = {
      name: 'Score_Qualification',
      type: 'formula',
      options: {
        formula: `IF(CA_Mensuel >= 10000, 20, IF(CA_Mensuel >= 5000, 10, 0)) +
                 IF(Taille_Liste_Email >= 5000, 15, 0) +
                 IF(Taille_Audience_Sociale >= 20000, 10, IF(Taille_Audience_Sociale >= 5000, 5, 0)) +
                 IF(Budget_Ads_Mensuel >= 3000, 15, 0) +
                 IF(Prix_Moyen_Offre >= 1000, 10, 0)`
      }
    };
    
    const response = await axios.post(
      `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables/${tableId}/fields`,
      formulaField,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log(`✅ Champ Score_Qualification ajouté avec succès!`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur lors de l'ajout du champ Score_Qualification:`);
    console.error(error.message);
    
    if (error.response?.data?.error?.details) {
      console.error('Détails:', JSON.stringify(error.response.data.error.details, null, 2));
    }
    return false;
  }
}

// Fonction principale
async function main() {
  const tableId = await getTableId();
  if (!tableId) {
    console.error('❌ Impossible de continuer sans l\'ID de la table.');
    return;
  }
  
  const success = await addScoreQualificationField(tableId);
  if (success) {
    console.log('✅ Le champ Score_Qualification a été ajouté avec succès à la table!');
  } else {
    console.log('⚠️ Le champ Score_Qualification n\'a pas pu être ajouté. Vérifiez qu\'il n\'existe pas déjà.');
  }
}

// Lancer la fonction principale
main();
