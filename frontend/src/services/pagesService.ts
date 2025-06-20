import { Pages } from '../types/templates';
import apiClient from '../api/apiClient';
const API_BASE_URL = '/api';

interface PagesResponse {
  id: string;
  project_id: string;
  created_at: string;
  updated_at: string;
  version: number;
  data: Pages;
}

export class PagesService {
  /**
   * Get pages data for a project
   * @param projectId The project ID
   * @returns Pages data or null if not found
   */
  static async getPages(projectId: string): Promise<Pages | null> {
    try {
      const response = await apiClient.get<PagesResponse>(
        `${API_BASE_URL}/project-specs/${projectId}/pages`
      );

      if (!response.data) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch pages: ${response.statusText}`);
      }

      return response.data.data;
    } catch (error) {
      console.error('Error fetching pages:', error);
      throw error;
    }
  }

  /**
   * Save pages data for a project
   * @param projectId The project ID
   * @param pagesData The pages data to save
   * @returns The saved pages data
   */
  static async savePages(projectId: string, pagesData: Pages): Promise<Pages | null> {
    try {
      const response = await apiClient.put<Pages>(
        `${API_BASE_URL}/project-specs/${projectId}/pages`,
        {
          data: pagesData,
        }
      );

      if (!response.data) {
        throw new Error(`Failed to save pages: ${response.statusText}`);
      }

      return response.data;
    } catch (error) {
      console.error('Error saving pages:', error);
      throw error;
    }
  }
}

export const pagesService = PagesService;
