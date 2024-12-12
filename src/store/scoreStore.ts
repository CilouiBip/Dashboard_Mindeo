import create from 'zustand';
import { Problem, SubProblem, AuditItem, KPI, BusinessFunction } from '../types/airtable';

interface ScoreState {
  problems: Problem[];
  subProblems: SubProblem[];
  auditItems: AuditItem[];
  kpis: KPI[];
  globalScore: number;
  functionScores: Record<BusinessFunction, number>;
  setProblems: (problems: Problem[]) => void;
  setSubProblems: (subProblems: SubProblem[]) => void;
  setAuditItems: (auditItems: AuditItem[]) => void;
  setKPIs: (kpis: KPI[]) => void;
  calculateScores: () => void;
}

export const useScoreStore = create<ScoreState>((set, get) => ({
  problems: [],
  subProblems: [],
  auditItems: [],
  kpis: [],
  globalScore: 0,
  functionScores: {
    Marketing: 0,
    Sales: 0,
    Product: 0,
    Content: 0,
    Legal: 0,
    Finance: 0,
    Executive: 0,
  },
  setProblems: (problems) => set({ problems }),
  setSubProblems: (subProblems) => set({ subProblems }),
  setAuditItems: (auditItems) => set({ auditItems }),
  setKPIs: (kpis) => set({ kpis }),
  calculateScores: () => {
    const { kpis } = get();
    
    // Calculate function scores
    const functionScores = {} as Record<BusinessFunction, number>;
    const functionKPIs = {} as Record<BusinessFunction, KPI[]>;

    // Group KPIs by function
    kpis.forEach(kpi => {
      const function_ = kpi.Type as BusinessFunction;
      if (!functionKPIs[function_]) {
        functionKPIs[function_] = [];
      }
      functionKPIs[function_].push(kpi);
    });

    // Calculate score for each function
    Object.entries(functionKPIs).forEach(([function_, kpis]) => {
      let functionScore = 0;
      let totalWeight = 0;

      kpis.forEach(kpi => {
        const weight = kpi.Ponderation || 1;
        totalWeight += weight;

        // Calculate KPI score based on current value vs thresholds
        let kpiScore = 0;
        const currentValue = parseFloat(kpi.Score?.toString() || '0');
        const min = parseFloat(kpi.Min?.toString() || '0');
        const max = parseFloat(kpi.Max?.toString() || '100');
        
        if (currentValue >= max) {
          kpiScore = 100;
        } else if (currentValue <= min) {
          kpiScore = 0;
        } else {
          kpiScore = ((currentValue - min) / (max - min)) * 100;
        }

        functionScore += (kpiScore * weight);
      });

      functionScores[function_ as BusinessFunction] = totalWeight > 0 ? 
        (functionScore / totalWeight) : 0;
    });

    // Calculate global score
    const totalWeight = Object.values(functionScores).reduce((acc, score) => acc + score, 0);
    const globalScore = totalWeight / Object.keys(functionScores).length;

    set({ functionScores, globalScore });
  },
}));