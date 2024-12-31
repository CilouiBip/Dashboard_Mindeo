import Airtable from 'airtable';
import { Problem, SubProblem, AuditItem, KPI } from '../types/airtable';

class AirtableService {
  private base: Airtable.Base;
  private isInitialized: boolean = false;

  constructor() {
    const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY;
    const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;

    if (!apiKey || !baseId) {
      console.error('Missing Airtable configuration');
      this.base = new Airtable().base('dummy');
      return;
    }

    try {
      this.base = new Airtable({ apiKey }).base(baseId);
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Airtable:', error);
      this.base = new Airtable().base('dummy');
    }
  }

  private checkInitialization() {
    if (!this.isInitialized) {
      throw new Error(
        'Airtable is not properly configured. Please check your environment variables:\n' +
        '- VITE_AIRTABLE_API_KEY\n' +
        '- VITE_AIRTABLE_BASE_ID'
      );
    }
  }

  private async fetchRecords<T>(tableName: string): Promise<T[]> {
    this.checkInitialization();

    try {
      const records = await this.base(tableName).select().all();
      return records.map(record => ({
        id: record.id,
        ...record.fields
      })) as T[];
    } catch (error) {
      console.error(`Error fetching ${tableName}:`, error);
      throw new Error(`Failed to fetch ${tableName} from Airtable. Please check your configuration and permissions.`);
    }
  }

  async getProblems(): Promise<Problem[]> {
    return this.fetchRecords<Problem>('Marketing_Problems');
  }

  async getSubProblems(): Promise<SubProblem[]> {
    return this.fetchRecords<SubProblem>('Sub_Problems');
  }

  async getAuditItems(): Promise<AuditItem[]> {
    return this.fetchRecords<AuditItem>('Audit_Items');
  }

  async getKPIs(): Promise<KPI[]> {
    return this.fetchRecords<KPI>('KPI_Link');
  }

  async updateAuditItemStatus(itemId: string, status: AuditItem['Status']) {
    this.checkInitialization();

    try {
      await this.base('Audit_Items').update(itemId, {
        Status: status,
      });
    } catch (error) {
      console.error('Error updating audit item status:', error);
      throw new Error('Failed to update audit item status in Airtable');
    }
  }
}

export const airtableService = new AirtableService();