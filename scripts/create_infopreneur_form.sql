-- Script de création de la table infopreneur_form dans Supabase
CREATE TABLE IF NOT EXISTS infopreneur_form (
    id SERIAL PRIMARY KEY,
    NomComplet VARCHAR(255) NOT NULL,
    NomEntreprise VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    Telephone VARCHAR(50),
    URLPrincipale VARCHAR(255),
    TypeBusiness VARCHAR(100),
    Niche VARCHAR(255),
    ProduitOffrePrincipale VARCHAR(255),
    CAMensuel NUMERIC(15,2),
    PrixMoyenVente NUMERIC(15,2),
    MargeBenef NUMERIC(5,2),
    ProcessusVente VARCHAR(100),
    CanalAcquisitionPrincipal VARCHAR(100),
    BudgetMensuelAds VARCHAR(50),
    FunnelPrincipal VARCHAR(100),
    TailleAudience INT,
    TauxConversionGlobal NUMERIC(5,2),
    NbLeadsEntrants INT,
    PrincipalDefiActuel TEXT,
    BlocagesFreinsCroissance VARCHAR(255),
    ObjectifCollabVision TEXT,
    PrioritesPrincipales TEXT,
    DateSoumission TIMESTAMP DEFAULT NOW()
);

-- Création d'un index sur l'email pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_infopreneur_form_email ON infopreneur_form(Email);

-- Commentaires sur la table
COMMENT ON TABLE infopreneur_form IS 'Table pour stocker les réponses du formulaire infopreneur';
