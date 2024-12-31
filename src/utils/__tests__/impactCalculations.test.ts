import { describe, it, expect } from 'vitest';
import { calculateKPIImpact, calculateTotalImpact, ImpactResult } from '../impactCalculations';
import { KPI, KPIType } from '../../types/airtable';

describe('Impact Calculations', () => {
  describe('calculateKPIImpact', () => {
    const baseKPI: KPI = {
      ID_KPI: '1',
      Nom_KPI: 'Test KPI',
      Type: KPIType.Input,
      Valeur_Actuelle: 100,
      Valeur_Precedente: 90,
      Score_KPI_Final: 8,
      Statut: 'Good',
      Fonctions: 'Test',
      Impact_Type: 'Linear',
      Impact_Weight: 1,
      Category_Weight: 1,
      Scaling_Factor: 1,
      Impact_Direction: 'Direct',
      Baseline_Revenue: 1000000,
      EBITDA_Factor: 0.2
    };

    it('should calculate linear impact correctly', () => {
      const result = calculateKPIImpact(baseKPI, 150);
      expect(result.revenue).toBe(500000); // 50% increase * 1M baseline
      expect(result.ebitda).toBe(100000); // 500K * 0.2 EBITDA factor
    });

    it('should handle inverse impact direction', () => {
      const inverseKPI = { ...baseKPI, Impact_Direction: 'Inverse' };
      const result = calculateKPIImpact(inverseKPI, 150);
      expect(result.revenue).toBe(-500000);
      expect(result.ebitda).toBe(-100000);
    });

    it('should handle exponential impact', () => {
      const exponentialKPI = { ...baseKPI, Impact_Type: 'Exponential' };
      const result = calculateKPIImpact(exponentialKPI, 150);
      const expectedImpact = (Math.pow(150/100, 2) - 1);
      expect(result.revenue).toBe(Math.round(expectedImpact * 1000000));
      expect(result.ebitda).toBe(Math.round(expectedImpact * 1000000 * 0.2));
    });

    it('should return zero impact when current value is zero', () => {
      const zeroKPI = { ...baseKPI, Valeur_Actuelle: 0 };
      const result = calculateKPIImpact(zeroKPI, 150);
      expect(result.revenue).toBe(0);
      expect(result.ebitda).toBe(0);
    });

    it('should apply weights correctly', () => {
      const weightedKPI = {
        ...baseKPI,
        Impact_Weight: 0.5,
        Category_Weight: 0.8,
        Scaling_Factor: 1.2
      };
      const result = calculateKPIImpact(weightedKPI, 150);
      // 50% increase * 0.5 * 0.8 * 1.2 * 1M baseline
      expect(result.revenue).toBe(240000);
      expect(result.ebitda).toBe(48000);
    });
  });

  describe('calculateTotalImpact', () => {
    it('should sum multiple impacts correctly', () => {
      const impacts: ImpactResult[] = [
        { revenue: 100000, ebitda: 20000 },
        { revenue: 200000, ebitda: 40000 },
        { revenue: -50000, ebitda: -10000 }
      ];
      const total = calculateTotalImpact(impacts);
      expect(total.revenue).toBe(250000);
      expect(total.ebitda).toBe(50000);
    });

    it('should return zero for empty impacts array', () => {
      const total = calculateTotalImpact([]);
      expect(total.revenue).toBe(0);
      expect(total.ebitda).toBe(0);
    });

    it('should handle negative values correctly', () => {
      const impacts: ImpactResult[] = [
        { revenue: -100000, ebitda: -20000 },
        { revenue: -200000, ebitda: -40000 }
      ];
      const total = calculateTotalImpact(impacts);
      expect(total.revenue).toBe(-300000);
      expect(total.ebitda).toBe(-60000);
    });
  });
});
