# Configuration des Environnements Dashboard Mindeo

## Structure des Dossiers et Ports

### 1. Version Stable (Dashboard-mindeo-Janvier-2025-baseline)
- **Dossier**: `~/Downloads/Dashboard_Mindeo-main`
- **Port**: 2000
- **Branche**: `Dashboard-mindeo-Janvier-2025-baseline`
- **Usage**: Version stable pour l'équipe, accessible via ngrok

### 2. Version Main
- **Dossier**: `~/Downloads/Dashboard_Mindeo-temp-main`
- **Port**: 7001
- **Branche**: `main`
- **Usage**: Version de référence principale

### 3. Version Développement
- **Dossier**: `~/Downloads/Dashboard_Mindeo-dev`
- **Port**: 7002
- **Branche**: `feat/1-janvier-project-plan-template`
- **Usage**: Environnement de développement pour les nouvelles fonctionnalités

## Ports à Éviter
- **3000**: Réservé/Conflit
- **3001**: Réservé/Conflit
- **5000**: Réservé/Conflit
- **8000**: Potentiel conflit

## Comment Changer d'Environnement

### Pour la Version Stable (2000)
```bash
cd ~/Downloads/Dashboard_Mindeo-main
git checkout Dashboard-mindeo-Janvier-2025-baseline
npm run dev  # Lance sur port 2000
```

### Pour la Version Main (7001)
```bash
cd ~/Downloads/Dashboard_Mindeo-temp-main
git checkout main
npm run dev  # Lance sur port 7001
```

### Pour le Développement (7002)
```bash
cd ~/Downloads/Dashboard_Mindeo-dev
git checkout feat/1-janvier-project-plan-template
npm run dev  # Lance sur port 7002
```

## Notes Importantes
1. Toujours vérifier le port dans `vite.config.ts` avant de lancer un serveur
2. Ne pas modifier la version stable (port 2000) pendant qu'elle est utilisée par l'équipe
3. Utiliser `git stash` si besoin de sauvegarder des modifications avant de changer de branche
