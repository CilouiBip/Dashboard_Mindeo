import type { Vision } from './visionService';

export interface KeyResult {
  id: string;
  metric: string;
  target?: number;
  unit?: string;
  current?: number;
  initiatives: string[];
}

export interface GeneratedOKR {
  id: string;
  objective: string;
  keyResults: KeyResult[];
}

// Helper function to normalize key results to exactly 3
function normalizeKeyResults(keyResults: any[]): any[] {
  if (!Array.isArray(keyResults)) {
    return Array(3).fill({
      kr: "Augmenter le nombre de clients actifs",
      target: "100",
      initiatives: ["Initiative 1", "Initiative 2"]
    });
  }

  if (keyResults.length === 3) {
    return keyResults;
  }

  if (keyResults.length > 3) {
    console.warn('Too many key results, trimming to 3');
    return keyResults.slice(0, 3);
  }

  console.warn('Too few key results, adding defaults');
  const defaults = [
    {
      kr: "Augmenter le nombre de clients actifs",
      target: "100",
      initiatives: ["Initiative 1", "Initiative 2"]
    },
    {
      kr: "Améliorer le taux de satisfaction client",
      target: "90%",
      initiatives: ["Initiative 1", "Initiative 2"]
    },
    {
      kr: "Accroître le revenu mensuel récurrent",
      target: "50000",
      initiatives: ["Initiative 1", "Initiative 2"]
    }
  ];

  const result = [...keyResults];
  while (result.length < 3) {
    result.push(defaults[result.length]);
  }
  return result;
}

// Helper function to ensure exactly 3 objectives
function normalizeOKRs(okrs: any[]): any[] {
  if (!Array.isArray(okrs)) {
    console.warn('Invalid OKRs structure, using fallback');
    return FALLBACK_OBJECTIVES;
  }

  // First normalize the number of objectives
  let normalizedOkrs = okrs.length === 3 ? okrs : 
                      okrs.length > 3 ? okrs.slice(0, 3) :
                      [...okrs, ...FALLBACK_OBJECTIVES.slice(okrs.length)];

  // Then ensure each objective has exactly 3 KRs
  return normalizedOkrs.map(okr => ({
    ...okr,
    keyResults: normalizeKeyResults(okr.keyResults)
  }));
}

// Helper function to validate OKR structure
function validateOKRs(okrs: any[]): boolean {
  try {
    // Validation de base de la structure
    if (!Array.isArray(okrs) || okrs.length !== 3) {
      console.error('Invalid OKRs: Must have exactly 3 objectives, received:', okrs?.length);
      return false;
    }

    // Validation de chaque objectif et ses KRs
    return okrs.every((okr, index) => {
      // Validation de l'objectif
      if (!okr.objective || typeof okr.objective !== 'string' || okr.objective.length < 20) {
        console.error(`Invalid objective at index ${index}:`, okr);
        return false;
      }

      // Validation des Key Results - maintenant on exige exactement 3
      if (!Array.isArray(okr.keyResults) || okr.keyResults.length !== 3) {
        console.error(`Invalid number of key results for objective ${index}:`, okr.keyResults?.length);
        return false;
      }

      // Validation de chaque KR
      return okr.keyResults.every((kr: any, krIndex: number) => {
        // Validation du KR lui-même
        if (!kr.kr || typeof kr.kr !== 'string' || kr.kr.length < 10) {
          console.error(`Invalid KR statement at objective ${index}, KR ${krIndex}`);
          return false;
        }

        // Validation de la cible (doit contenir au moins un chiffre)
        if (!kr.target || typeof kr.target !== 'string' || !kr.target.match(/\d/)) {
          console.error(`Invalid target at objective ${index}, KR ${krIndex}`);
          return false;
        }

        // Validation des initiatives (2-4 initiatives requises)
        if (!kr.initiatives || 
            !Array.isArray(kr.initiatives) || 
            kr.initiatives.length < 2 || 
            kr.initiatives.length > 4 ||
            !kr.initiatives.every((init: any) => typeof init === 'string' && init.length > 0)) {
          console.error(`Invalid initiatives at objective ${index}, KR ${krIndex}`);
          return false;
        }

        return true;
      });
    });
  } catch (error) {
    console.error('Error during OKR validation:', error);
    return false;
  }
}

const SYSTEM_PROMPT = `
You are a world-class OKR consultant specializing in digital business strategy.

Your task:
- Always return exactly 3 objectives, each with EXACTLY 3 Key Results.
- Each Key Result must have 2-4 specific initiatives to achieve it.
- Integrate any input data the user provides (vision, revenue, product, challenges, etc.).
- Output the final OKRs strictly in valid JSON, with no extra text.

Each objective must be:
- Ambitious but achievable
- Highly specific to the business context
- Revenue and market-segment focused
- Action-oriented with clear outcomes

Each Key Result must:
- Be measurable with clear numeric targets
- Include 2-4 concrete initiatives to achieve it
- Focus on specific business metrics

Format:
[
  {
    "objective": "Specific objective focused on revenue/market segment",
    "keyResults": [
      {
        "kr": "Clear measurable outcome",
        "target": "Specific numeric target",
        "initiatives": [
          "Concrete action 1 to achieve the KR",
          "Concrete action 2 to achieve the KR",
          "Concrete action 3 to achieve the KR"
        ]
      }
    ]
  }
]
`;

const USER_PROMPT_TEMPLATE = (vision: Vision) => {
  const challenges = vision.main_challenges || '';
  
  return `
Voici mes inputs :

VISION (3 ans) : ${vision.vision_text}
Revenu actuel : ${vision.current_revenue}
Revenu cible : ${vision.target_revenue}
Produit/Service principal : ${vision.main_product}
${challenges ? `Défis principaux : ${challenges}` : ''}

Génère EXACTEMENT 3 objectifs alignés sur ces informations, chacun avec EXACTEMENT 3 Key Results et 2-4 initiatives concrètes par KR.
Les objectifs doivent être très spécifiques, axés sur les segments de marché et les revenus.
Chaque KR doit être mesurable avec des cibles numériques claires.
Chaque initiative doit être une action concrète et réalisable.

Format JSON uniquement, sans texte autour.
  `;
};

export async function generateOKRs(vision: Vision, retryCount = 0): Promise<GeneratedOKR[]> {
  const MAX_RETRIES = 5;
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your .env file');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: USER_PROMPT_TEMPLATE(vision) }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI request failed: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    let okrs;
    try {
      okrs = JSON.parse(content);
      // Try to normalize the response if needed
      okrs = normalizeOKRs(okrs);
    } catch (error) {
      console.error('JSON parse error:', error);
      throw new Error('Invalid JSON response from OpenAI');
    }

    // Validate OKR structure
    if (!validateOKRs(okrs)) {
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying OKR generation (attempt ${retryCount + 1} of ${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, retryCount), 8000)));
        return generateOKRs(vision, retryCount + 1);
      }
      throw new Error('Failed to generate valid OKRs after multiple attempts');
    }

    return okrs.map((okr: any) => ({
      id: crypto.randomUUID(),
      objective: okr.objective,
      keyResults: okr.keyResults.map((kr: any) => {
        const { target, unit } = parseTarget(kr.target);
        return {
          id: crypto.randomUUID(),
          metric: kr.kr,
          target,
          unit,
          current: 0,
          initiatives: kr.initiatives
        };
      })
    }));
  } catch (error) {
    console.error('Error in generateOKRs:', error);
    throw error;
  }
}

export function convertToDBFormat(generatedOKRs: GeneratedOKR[], visionId: string) {
  return generatedOKRs.map(okr => ({
    objective: okr.objective,
    key_results: okr.keyResults.map(kr => ({
      metric: kr.metric,
      target: kr.target,
      current: kr.current,
      unit: kr.unit,
      initiatives: kr.initiatives
    })),
    status: 'active' as const,
    iteration: 1,
    vision_id: visionId
  }));
}

// Helper function to extract numbers and units from a target string
function parseTarget(targetStr: string): { target: number; unit: string } {
  // First try to match percentage
  const percentMatch = targetStr.match(/(\d+)%/);
  if (percentMatch) {
    return {
      target: parseInt(percentMatch[1], 10),
      unit: '%'
    };
  }

  // Then try to match number + unit
  const match = targetStr.match(/(\d+)\s*(\w+)?/);
  if (match) {
    return {
      target: parseInt(match[1], 10),
      unit: match[2] || ''
    };
  }

  // If no number found, return default
  return {
    target: 0,
    unit: ''
  };
}

// Fallback objectives if needed
const FALLBACK_OBJECTIVES = [
  {
    objective: "Développer une offre de coaching personnalisée pour les infopreneurs débutants",
    keyResults: [
      { kr: "Créer et lancer un programme de mentorat structuré", target: "1 programme", initiatives: ["Créer un plan de mentorat", "Développer des ressources pédagogiques"] },
      { kr: "Atteindre un nombre de clients actifs dans le programme", target: "10 clients", initiatives: ["Promouvoir le programme sur les réseaux sociaux", "Créer un système de référence"] },
      { kr: "Maintenir un taux de satisfaction client", target: "90%", initiatives: ["Mettre en place un système de feedback", "Améliorer les ressources pédagogiques"] }
    ]
  },
  {
    objective: "Optimiser la méthodologie d'accompagnement pour maximiser les résultats clients",
    keyResults: [
      { kr: "Documenter et standardiser le processus d'accompagnement", target: "1 playbook", initiatives: ["Créer un guide de bonnes pratiques", "Développer des outils de suivi"] },
      { kr: "Mesurer le taux de réussite des objectifs clients", target: "80%", initiatives: ["Mettre en place un système de suivi des résultats", "Analyser les données pour identifier les tendances"] },
      { kr: "Réduire le temps moyen d'atteinte des premiers résultats", target: "30 jours", initiatives: ["Améliorer la formation des coachs", "Développer des ressources supplémentaires"] }
    ]
  },
  {
    objective: "Établir une présence en ligne forte et engageante",
    keyResults: [
      { kr: "Produire du contenu éducatif de qualité", target: "12 articles/mois", initiatives: ["Créer un calendrier de publication", "Développer des ressources visuelles"] },
      { kr: "Augmenter l'engagement sur les réseaux sociaux", target: "5000 interactions/mois", initiatives: ["Créer un plan de contenu social", "Utiliser les publicités ciblées"] },
      { kr: "Développer une communauté active", target: "1000 membres", initiatives: ["Créer un groupe de discussion", "Organiser des événements en ligne"] }
    ]
  }
];
