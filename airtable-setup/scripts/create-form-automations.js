// Ce script configure les automations dans Airtable pour le formulaire de qualification d'infopreneurs
// Note: Les automatisations Airtable ne peuvent pas u00eatre cru00e9u00e9es via l'API Metadata
// Ce script sert de guide pour la configuration manuelle

/**
 * AUTOMATISATION 1: Gu00c9Nu00c9RATION D'ID UNIQUE
 * 
 * 1. Dans l'interface Airtable, allez dans l'onglet "Automations"
 * 2. Cru00e9ez une nouvelle automatisation avec le du00e9clencheur "When a record is created"
 * 3. Ajoutez une action "Run a script" avec le code suivant:
 */

// Code pour l'automatisation de gu00e9nu00e9ration d'ID
const today = new Date();
const dateStr = today.getFullYear().toString() + 
              (today.getMonth() + 1).toString().padStart(2, '0') + 
              today.getDate().toString().padStart(2, '0');
const randomNum = Math.floor(1000 + Math.random() * 9000);
const newID = `INF-${dateStr}-${randomNum}`;
return {ID_Infopreneur: newID};

/**
 * 4. Ajoutez une action "Update record" en su00e9lectionnant:
 *    - Table: Qualification_Infopreneurs
 *    - Record: The created record in the trigger (l'enregistrement cru00e9u00e9 dans le du00e9clencheur)
 *    - Champ u00e0 mettre u00e0 jour: ID_Infopreneur avec la valeur du script
 */

/**
 * AUTOMATISATION 2: ALERTE POUR LES LEADS QUALIFIu00c9S
 * 
 * 1. Cru00e9ez une nouvelle automatisation avec le du00e9clencheur "When a record matches conditions"
 * 2. Configurez les conditions:
 *    - Table: Qualification_Infopreneurs
 *    - Condition: Score_Qualification > 50
 * 3. Ajoutez une action "Send email" avec:
 *    - To: votre adresse email ou celle de l'u00e9quipe
 *    - Subject: Nouveau lead qualifiu00e9: {% pru00e9nom %} {% nom %}
 *    - Body: Un template personnalisu00e9 incluant les du00e9tails du lead, par exemple:
 */

/*
Un nouveau lead qualifiu00e9 a u00e9tu00e9 du00e9tectu00e9!

Informations:
- Nom: {{Nom_Complet}}
- Email: {{Email}}
- Business: {{Nom_Business}}
- Score: {{Score_Qualification}}
- CA Mensuel: {{CA_Mensuel}} u20ac
- Taille de liste email: {{Taille_Liste_Email}}

Prioritu00e9 exprimu00e9e: {{Prioritu00e9_1}}

Consultez l'enregistrement complet: [LIEN AIRTABLE]
*/

/**
 * PARAMu00c8TRES DU FORMULAIRE
 * 
 * 1. Dans l'onglet Forms, cru00e9ez un nouveau formulaire pour la table
 * 2. Ajoutez le texte d'introduction fourni dans la documentation
 * 3. Organisez les champs en 7 sections avec des "Section break"
 * 4. Masquez les champs techniques (ID_Infopreneur, Score_Qualification, etc.)
 * 5. Personnalisez les libellu00e9s des questions pour plus de clartu00e9
 * 6. Ajoutez des textes d'aide pour guider les ru00e9pondants
 * 7. Configurez le message de confirmation apru00e8s soumission
 */

console.log('u2705 Guide de configuration des automatisations et du formulaire gu00e9nu00e9ru00e9!');
console.log('Suivez ces instructions pour configurer manuellement les automatisations dans l\'interface Airtable.');
