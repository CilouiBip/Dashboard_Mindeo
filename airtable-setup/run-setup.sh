#!/bin/bash

# Exporter les variables d'environnement nécessaires
export AIRTABLE_API_KEY=patEvEhaTBRmTxpQc.5c3a7241c0d360d379260e8655a372d34dec2626c76f51736975c058f30fbfae
export AIRTABLE_BASE_ID=app6Q4KQzMBm5MEsz

# Exécuter le script de création des tables
cd "$(dirname "$0")"
node ./scripts/create-tables-esm.js

echo "\n\nUn fichier airtable-table-ids.json a été créé avec les identifiants des tables"
