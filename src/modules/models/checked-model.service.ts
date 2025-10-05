import { Injectable, Logger } from '@nestjs/common';
import { createBrowserClient } from '@supabase/ssr';
import { Database } from '../../database.types';

export interface CheckedModel {
  id: number;
  name: string;
  created_at: string;
  hasContent: boolean;
  modelId: number;
}

export interface CreateCheckedModelDto {
  name: string;
  hasContent: boolean;
  modelId: number;
}

export interface UpdateCheckedModelDto {
  name?: string;
  hasContent?: boolean;
  modelId?: number;
}

@Injectable()
export class CheckedModelService {
  private readonly logger = new Logger(CheckedModelService.name);
  private readonly supabaseUrl = 'https://lrsgsgkissnmromalfsu.supabase.co';
  private readonly supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyc2dzZ2tpc3NubXJvbWFsZnN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NDExMzEsImV4cCI6MjA2MDExNzEzMX0.OlXZpo0mgZDnKK9iiEyrzF1avMlPdwa3YSuf3H0-YK4';

  private getSupabaseClient() {
    return createBrowserClient<Database>(this.supabaseUrl, this.supabaseKey);
  }

  async create(createDto: CreateCheckedModelDto): Promise<CheckedModel> {
    try {
      const supabase = this.getSupabaseClient();
      const { data, error } = await supabase
        .from('checkedModel')
        .insert({
          name: createDto.name,
          hasContent: createDto.hasContent,
          modelId: createDto.modelId,
        })
        .select()
        .single();

      if (error) {
        this.logger.error('Failed to create checked model', error);
        throw new Error(`Failed to create checked model: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned from create operation');
      }

      return data as CheckedModel;
    } catch (error) {
      this.logger.error('Failed to create checked model', error);
      throw error;
    }
  }

  async findAll(hasContent?: boolean): Promise<CheckedModel[]> {
    try {
      const supabase = this.getSupabaseClient();
      let query = supabase
        .from('checkedModel')
        .select('*');

      // Apply hasContent filter if provided
      if (hasContent !== undefined) {
        query = query.eq('hasContent', hasContent);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        this.logger.error('Failed to fetch checked models', error);
        throw new Error(`Failed to fetch checked models: ${error.message}`);
      }

      return (data || []) as CheckedModel[];
    } catch (error) {
      this.logger.error('Failed to fetch checked models', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<CheckedModel | null> {
    try {
      const supabase = this.getSupabaseClient();
      const { data, error } = await supabase
        .from('checkedModel')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        this.logger.error('Failed to fetch checked model', error);
        throw new Error(`Failed to fetch checked model: ${error.message}`);
      }

      return data as CheckedModel;
    } catch (error) {
      this.logger.error('Failed to fetch checked model', error);
      throw error;
    }
  }

  async update(id: number, updateDto: UpdateCheckedModelDto): Promise<CheckedModel | null> {
    try {
      const supabase = this.getSupabaseClient();
      const { data, error } = await supabase
        .from('checkedModel')
        .update(updateDto)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        this.logger.error('Failed to update checked model', error);
        throw new Error(`Failed to update checked model: ${error.message}`);
      }

      return data as CheckedModel;
    } catch (error) {
      this.logger.error('Failed to update checked model', error);
      throw error;
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      const supabase = this.getSupabaseClient();
      const { error } = await supabase
        .from('checkedModel')
        .delete()
        .eq('id', id);

      if (error) {
        this.logger.error('Failed to delete checked model', error);
        throw new Error(`Failed to delete checked model: ${error.message}`);
      }

      return true;
    } catch (error) {
      this.logger.error('Failed to delete checked model', error);
      throw error;
    }
  }

  async findByModelId(modelId: number): Promise<CheckedModel[]> {
    try {
      const supabase = this.getSupabaseClient();
      const { data, error } = await supabase
        .from('checkedModel')
        .select('*')
        .eq('modelId', modelId)
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error('Failed to fetch checked models by modelId', error);
        throw new Error(`Failed to fetch checked models by modelId: ${error.message}`);
      }

      return (data || []) as CheckedModel[];
    } catch (error) {
      this.logger.error('Failed to fetch checked models by modelId', error);
      throw error;
    }
  }
}
