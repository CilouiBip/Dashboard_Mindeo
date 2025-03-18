import { api } from '../src/api/airtable';

async function showHierarchy() {
  try {
    const structure = await api.fetchHierarchyStructure();
    
    // Pour la fonction Marketing uniquement
    const marketing = structure['Marketing'];
    if (!marketing) {
      console.log('Aucune donnée pour la fonction Marketing');
      return;
    }

    console.log('Structure Marketing:');
    console.log('==================\n');
    
    Object.entries(marketing).forEach(([problem, categories]) => {
      console.log(`Problème: ${problem}`);
      console.log('Catégories:');
      categories.forEach(category => {
        console.log(`  - ${category}`);
      });
      console.log('');
    });
  } catch (error) {
    console.error('Erreur:', error);
  }
}

showHierarchy();
