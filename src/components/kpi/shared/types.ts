import { KPI } from '../../../types/airtable';

export interface KPIDisplayProps {
  kpi: KPI;
  showPreviousValue?: boolean;
  onUpdate?: (kpiId: string, newValue: number) => void;
}

export interface KPIListProps {
  kpis: KPI[];
  showPreviousValue?: boolean;
  onUpdate?: (kpiId: string, newValue: number) => void;
}
