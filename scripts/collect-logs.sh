#!/bin/bash

# Créer le dossier logs s'il n'existe pas
mkdir -p logs

# Générer le nom du fichier de log avec timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOG_FILE="logs/app_${TIMESTAMP}.log"

# Fonction pour ajouter une section dans le fichier de log
add_section() {
    echo "=== $1 ===" >> "$LOG_FILE"
    echo "$2" >> "$LOG_FILE"
    echo "" >> "$LOG_FILE"
}

# En-tête du fichier de log
add_section "Application Logs" "Timestamp: $(date)"

# Information sur l'environnement
ENV_INFO="Node Version: $(node -v)
NPM Version: $(npm -v)
OS: $(uname -a)
PWD: $(pwd)"
add_section "Environment" "$ENV_INFO"

# Vérifier les processus Node.js en cours
PROCESS_INFO=$(ps aux | grep node | grep -v grep)
add_section "Node Processes" "$PROCESS_INFO"

# Vérifier l'utilisation des ports
PORT_INFO=$(lsof -i :7002)
add_section "Port Usage (7002)" "$PORT_INFO"

# Logs du navigateur (si disponibles)
if [ -f "browser_console.log" ]; then
    CONSOLE_LOGS=$(tail -n 50 browser_console.log)
    add_section "Browser Console Logs" "$CONSOLE_LOGS"
fi

# Logs de Supabase (si disponibles)
if [ -f "supabase.log" ]; then
    SUPABASE_LOGS=$(tail -n 50 supabase.log)
    add_section "Supabase Logs" "$SUPABASE_LOGS"
fi

# Logs des requêtes réseau (si disponibles)
if [ -f "network.log" ]; then
    NETWORK_LOGS=$(tail -n 50 network.log)
    add_section "Network Requests" "$NETWORK_LOGS"
fi

# Vérifier les erreurs dans les logs précédents
if [ -d "logs" ]; then
    ERRORS=$(grep -i "error\|exception\|failed" logs/app_*.log 2>/dev/null)
    if [ ! -z "$ERRORS" ]; then
        add_section "Recent Errors" "$ERRORS"
    fi
fi

echo "Logs collected in $LOG_FILE"

# Afficher les dernières lignes du fichier de log
tail -n 20 "$LOG_FILE"
