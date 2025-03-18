#!/bin/bash

UI_DIR="src/components/ui"
REPORT_FILE="ui-exports-report.md"

echo "# Rapport d'Audit des Exports UI" > $REPORT_FILE
echo "\nDate: $(date)\n" >> $REPORT_FILE
echo "## 1. Analyse des Composants UI\n" >> $REPORT_FILE

# Fonction pour extraire les exports d'un fichier
analyze_exports() {
    local file=$1
    echo "### ${file##*/}\n" >> $REPORT_FILE
    echo "\`\`\`typescript" >> $REPORT_FILE
    grep -E "^export |^export default" "$file" >> $REPORT_FILE
    echo "\`\`\`\n" >> $REPORT_FILE
}

# Analyse de chaque fichier .tsx
for file in $UI_DIR/*.tsx; do
    if [[ ! $file =~ \.temp\. ]]; then
        analyze_exports "$file"
    fi
done

echo "## 2. Vérification des Imports dans index.ts\n" >> $REPORT_FILE
echo "\`\`\`typescript" >> $REPORT_FILE
cat $UI_DIR/index.ts >> $REPORT_FILE
echo "\`\`\`\n" >> $REPORT_FILE

echo "## 3. Recherche des Imports dans le Codebase\n" >> $REPORT_FILE
echo "### Imports trouvés :\n" >> $REPORT_FILE
echo "\`\`\`typescript" >> $REPORT_FILE
grep -r "import.*from.*components/ui" src/ --include="*.tsx" --include="*.ts" | grep -v "node_modules" >> $REPORT_FILE
echo "\`\`\`\n" >> $REPORT_FILE

echo "✅ Rapport généré dans $REPORT_FILE"
