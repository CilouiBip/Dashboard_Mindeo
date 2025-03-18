#!/bin/bash

# Créer le répertoire de logs s'il n'existe pas
mkdir -p logs

# Définir des couleurs pour le terminal
GREEN="\033[0;32m"
BLUE="\033[0;34m"
NC="\033[0m" # No Color

echo -e "${BLUE}=== Script de conversion des logs Airtable en JSON ====${NC}"
echo -e "${GREEN}1. Collez vos logs Airtable ci-dessous${NC}"
echo -e "${GREEN}2. Après avoir collé les logs, appuyez sur Ctrl+D pour terminer${NC}"
echo "----------------------------------------"

# Exécuter le script Node qui va recevoir les logs depuis stdin
node airtable-parser.js

# Vérifier si le script s'est bien exécuté
if [ $? -eq 0 ]; then
  echo -e "\n${GREEN}✅ Conversion réussie!${NC}"
  echo -e "📄 Le fichier JSON est disponible à: ${BLUE}./airtable-schema.json${NC}"
  
  # Afficher les premières lignes du résultat pour vérification
  echo -e "\n${BLUE}Aperçu du JSON généré:${NC}"
  head -n 15 airtable-schema.json
  echo -e "${BLUE}...${NC}"
  
  # Déplacer le fichier de sortie dans le répertoire des logs avec un timestamp
  TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
  mv airtable-schema.json "logs/airtable-schema_${TIMESTAMP}.json"
  echo -e "\n${GREEN}📦 Le fichier a été déplacé vers:${NC} ${BLUE}logs/airtable-schema_${TIMESTAMP}.json${NC}"
else
  echo -e "\n${RED}❌ Erreur lors de la conversion${NC}"
fi
