import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Item } from '@base-project/shared';

export class DatabaseService {
  private readonly tableName = 'items';
  private supabase: SupabaseClient | null = null;

  private getClient(): SupabaseClient {
    if (!this.supabase) {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase configuration. Please check your environment variables.');
      }

      this.supabase = createClient(supabaseUrl, supabaseKey);
    }
    return this.supabase;
  }

  canInitialize(): boolean {
    return this.getClient() !== null;
  }

  async getAllItems(): Promise<Item[]> {
    try {
      const { data, error } = await this.getClient()
        .from(this.tableName)
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Database error fetching items:', error);
        throw new Error('Failed to fetch items from database');
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllItems:', error);
      throw error;
    }
  }

  async getItemById(id: string): Promise<Item | null> {
    try {
      const { data, error } = await this.getClient()
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Item not found
        }
        console.error('Database error fetching item:', error);
        throw new Error('Failed to fetch item from database');
      }

      return data;
    } catch (error) {
      console.error('Error in getItemById:', error);
      throw error;
    }
  }

  async createItem(item: Omit<Item, 'id'>): Promise<Item> {
    try {
      const { data, error } = await this.getClient()
        .from(this.tableName)
        .insert([item])
        .select()
        .single();

      if (error) {
        console.error('Database error creating item:', error);
        throw new Error('Failed to create item in database');
      }

      return data;
    } catch (error) {
      console.error('Error in createItem:', error);
      throw error;
    }
  }

  // Initialize database with sample data if empty
  async initializeSampleData(): Promise<void> {
    try {
      const items = await this.getAllItems();
      
      if (items.length === 0) {
        console.log('Initializing database with sample data...');
        
        const sampleItems = [
          { name: 'Laptop', type: 'Electronics', amount: 1200 },
          { name: 'Coffee Beans', type: 'Food', amount: 25 },
          { name: 'Office Chair', type: 'Furniture', amount: 350 },
          { name: 'Notebook', type: 'Stationery', amount: 15 }
        ];

        for (const item of sampleItems) {
          await this.createItem(item);
        }
        
        console.log('Sample data initialized successfully');
      }
    } catch (error) {
      console.error('Failed to initialize sample data:', error);
      // Don't throw the error, just log it
    }
  }
}

export const databaseService = new DatabaseService();