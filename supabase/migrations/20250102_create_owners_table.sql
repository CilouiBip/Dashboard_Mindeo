-- Créer la table owners
CREATE TABLE public.owners (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    role text,
    created_at timestamptz DEFAULT now()
);
