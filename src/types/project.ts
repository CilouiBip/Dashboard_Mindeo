export type TimeFrame = 
  | "Immédiat" 
  | "Autre";

export interface ProjectTask {
  id: string;
  "Action_Required (from Action_ID)": string;
  "Item_Name (from Action_ID)": string;
  "Catégorie_Name_Link": string;
  "Sub_Problems_Text (from Action_ID)": string;
  "Problems_Name (from Action_ID)": string;
  "Fonction_Name (from Action_ID)": string;
}

export interface TimeSection {
  id: TimeFrame;
  title: string;
  description: string;
  tasks: ProjectTask[];
}

export const TIME_SECTIONS: Record<TimeFrame, { title: string; description: string }> = {
  "Immédiat": {
    title: "Actions Immédiates",
    description: "Actions prioritaires à traiter dans les plus brefs délais"
  },
  "Autre": {
    title: "Autres Actions",
    description: "Actions à traiter dans un second temps"
  }
};
