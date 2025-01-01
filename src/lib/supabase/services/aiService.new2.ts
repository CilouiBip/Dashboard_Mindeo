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

const SYSTEM_PROMPT = `You are a world-class OKR consultant specializing in digital business strategy.

CRITICAL INSTRUCTIONS:
1. Always return EXACTLY 3 objectives (no more, no less).
2. Each objective MUST have EXACTLY 3 Key Results (no more, no less).
3. Each Key Result MUST have 2–4 initiatives, each initiative is a short, concrete action step.
4. All data from the user (vision, revenue, product, challenges) must be integrated explicitly in objectives or KRs.
5. Output a strictly valid JSON array with no extra text, in this format:

[
  {
    "objective": "Clear, specific statement (≥ 15 characters)",
    "keyResults": [
      {
        "kr": "Clear measurable metric (≥ 10 chars)",
        "target": "A numeric or % target with at least 1 digit",
        "initiatives": [
          "Action step 1",
          "Action step 2",
          "Action step 3"
        ]
      },
      {
        "kr": "Second KR ...",
        "target": "...",
        "initiatives": []
      },
      {
        "kr": "Third KR ...",
        "target": "...",
        "initiatives": []
      }
    ]
  },
  ...
]

IMPORTANT:  
- If the user's data is contradictory or incomplete, make your best assumption.  
- No textual explanations, disclaimers, or introductions outside the JSON.  
- Each objective must reflect the user's domain, revenue goals, or challenges.  
- The JSON must be valid.`;

const USER_PROMPT_TEMPLATE = (vision: Vision) => {
  const challenges = vision.main_challenges || '';
  
  return `
Voici mes inputs :

VISION (3 ans) : ${vision.vision_text}
Revenu actuel : ${vision.current_revenue}
Revenu cible : ${vision.target_revenue}
Produit/Service principal : ${vision.main_product}
${challenges ? `Défis principaux : ${challenges}` : ''}

Génère EXACTEMENT 3 objectifs, chacun avec EXACTEMENT 3 KRs, et chaque KR comporte 2–4 initiatives.
Pas de texte en dehors du JSON.
Les objectifs et KRs doivent refléter ma vision, mes défis et mes objectifs de revenus.`;
};

// Helper function to ensure exactly 3 objectives with exactly 3 KRs each
function normalizeOKRs(okrs: any[]): any[] {
  if (!Array.isArray(okrs)) {
    console.warn('Invalid OKRs structure, using fallback');
    return FALLBACK_OBJECTIVES;
  }

  // Ensure exactly 3 objectives
  let normalizedOkrs = okrs.length === 3 ? okrs : 
                      okrs.length > 3 ? okrs.slice(0, 3) :
                      [...okrs, ...FALLBACK_OBJECTIVES.slice(okrs.length)];

  // Ensure each objective has exactly 3 KRs
  return normalizedOkrs.map((okr, index) => {
    if (!Array.isArray(okr.keyResults)) {
      okr.keyResults = FALLBACK_OBJECTIVES[index].keyResults;
      return okr;
    }

    if (okr.keyResults.length === 3) {
      return okr;
    }

    if (okr.keyResults.length > 3) {
      okr.keyResults = okr.keyResults.slice(0, 3);
      return okr;
    }

    // Add fallback KRs if needed
    while (okr.keyResults.length < 3) {
      okr.keyResults.push(FALLBACK_OBJECTIVES[index].keyResults[okr.keyResults.length]);
    }
    return okr;
  });
}

function validateOKRs(okrs: any[]): boolean {
  try {
    // Must have exactly 3 objectives
    if (!Array.isArray(okrs) || okrs.length !== 3) {
      console.error('Invalid OKRs: Must have exactly 3 objectives, received:', okrs?.length);
      return false;
    }

    return okrs.every((okr, index) => {
      // Objective must be a string of at least 15 characters
      if (!okr.objective || typeof okr.objective !== 'string' || okr.objective.length < 15) {
        console.error(`Invalid objective at index ${index}:`, okr);
        return false;
      }

      // Must have exactly 3 Key Results
      if (!Array.isArray(okr.keyResults) || okr.keyResults.length !== 3) {
        console.error(`Must have exactly 3 key results for objective ${index}, got:`, okr.keyResults?.length);
        return false;
      }

      return okr.keyResults.every((kr: any, krIndex: number) => {
        // KR must be at least 10 characters
        if (!kr.kr || typeof kr.kr !== 'string' || kr.kr.length < 10) {
          console.error(`Invalid KR statement at objective ${index}, KR ${krIndex}`);
          return false;
        }

        // Target must contain at least one digit
        if (!kr.target || typeof kr.target !== 'string' || !kr.target.match(/\d/)) {
          console.error(`Invalid target at objective ${index}, KR ${krIndex}`);
          return false;
        }

        // Must have 2-4 non-empty initiatives
        if (!kr.initiatives || 
            !Array.isArray(kr.initiatives) || 
            kr.initiatives.length < 2 || 
            kr.initiatives.length > 4 ||
            !kr.initiatives.every((init: any) => typeof init === 'string' && init.length > 0)) {
          console.error(`Invalid initiatives at objective ${index}, KR ${krIndex}. Must have 2-4 non-empty initiatives.`);
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
      okrs = normalizeOKRs(okrs);
    } catch (error) {
      console.error('JSON parse error:', error);
      throw new Error('Invalid JSON response from OpenAI');
    }

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

function parseTarget(targetStr: string): { target: number; unit: string } {
  const percentMatch = targetStr.match(/(\d+)%/);
  if (percentMatch) {
    return {
      target: parseInt(percentMatch[1], 10),
      unit: '%'
    };
  }

  const match = targetStr.match(/(\d+)\s*(\w+)?/);
  if (match) {
    return {
      target: parseInt(match[1], 10),
      unit: match[2] || ''
    };
  }

  return {
    target: 0,
    unit: ''
  };
}

const FALLBACK_OBJECTIVES = [
  {
    objective: "Développer une offre de coaching personnalisée pour maximiser l'impact client",
    keyResults: [
      { kr: "Créer et lancer un programme de mentorat structuré", target: "1 programme", initiatives: ["Créer un plan de mentorat détaillé", "Développer les supports pédagogiques"] },
      { kr: "Atteindre un nombre minimum de clients actifs", target: "10 clients", initiatives: ["Lancer une campagne marketing ciblée", "Mettre en place un programme de parrainage"] },
      { kr: "Maintenir un score de satisfaction client élevé", target: "90%", initiatives: ["Implémenter un système de feedback continu", "Organiser des sessions de suivi mensuelles"] }
    ]
  },
  {
    objective: "Optimiser la méthodologie d'accompagnement pour garantir des résultats mesurables",
    keyResults: [
      { kr: "Standardiser le processus d'accompagnement", target: "1 playbook", initiatives: ["Documenter les meilleures pratiques", "Créer des modèles de suivi"] },
      { kr: "Augmenter le taux de réussite des objectifs clients", target: "80%", initiatives: ["Mettre en place des KPIs personnalisés", "Créer un tableau de bord de suivi"] },
      { kr: "Réduire le délai d'atteinte du premier résultat", target: "30 jours", initiatives: ["Optimiser le processus d'onboarding", "Créer des quick wins templates"] }
    ]
  },
  {
    objective: "Établir une présence en ligne autoritaire dans notre domaine d'expertise",
    keyResults: [
      { kr: "Produire du contenu expert régulier", target: "12 articles/mois", initiatives: ["Établir un calendrier éditorial", "Créer une banque de contenus"] },
      { kr: "Développer l'engagement sur les réseaux sociaux", target: "5000 interactions", initiatives: ["Lancer une stratégie de contenu", "Animer la communauté"] },
      { kr: "Construire une communauté active", target: "1000 membres", initiatives: ["Créer un espace d'échange", "Organiser des événements live"] }
    ]
  }
];
