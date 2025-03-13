/**
 * Service for interacting with AI endpoints.
 */
import apiClient from "../api/apiClient";
import { FeatureModule } from "./featuresService";

interface EnhanceDescriptionRequest {
  user_description: string;
}

interface EnhanceDescriptionResponse {
  enhanced_description: string;
}

interface EnhanceBusinessGoalsRequest {
  project_description: string;
  user_goals: string[];
}

interface EnhanceBusinessGoalsResponse {
  enhanced_goals: string[];
}

interface EnhanceTargetUsersRequest {
  project_description: string;
  target_users: string;
}

interface EnhanceTargetUsersResponse {
  enhanced_target_users: string;
}

interface EnhanceRequirementsRequest {
  project_description: string;
  business_goals: string[];
  user_requirements: string[];
}

interface EnhanceRequirementsResponse {
  enhanced_requirements: string[];
}

interface FeaturesData {
  coreModules: FeatureModule[];
  optionalModules?: FeatureModule[];
}

interface EnhanceFeaturesRequest {
  project_description: string;
  business_goals: string[];
  requirements: string[];
  user_features?: FeatureModule[];
}

interface EnhanceFeaturesResponse {
  data: FeaturesData;
}

export interface PageComponent {
  name: string;
  path: string;
  components: string[];
  enabled: boolean;
}

export interface PagesData {
  public: PageComponent[];
  authenticated: PageComponent[];
  admin: PageComponent[];
}

interface EnhancePagesRequest {
  project_description: string;
  features: FeatureModule[];
  requirements: string[];
  existing_pages?: PagesData;
}

interface EnhancePagesResponse {
  data: PagesData;
}

class AIService {
  /**
   * Enhance a project description using AI.
   *
   * @param description The original project description
   * @returns The enhanced description or null if an error occurred
   */
  async enhanceDescription(description: string): Promise<string | null> {
    try {
      const response = await apiClient.post<EnhanceDescriptionResponse>(
        "/api/ai-text/enhance-description",
        { user_description: description } as EnhanceDescriptionRequest
      );

      return response.data.enhanced_description;
    } catch (error) {
      console.error("Error enhancing description:", error);
      return null;
    }
  }

  /**
   * Enhance business goals using AI.
   *
   * @param projectDescription The project description
   * @param businessGoals The original business goals
   * @returns The enhanced business goals or null if an error occurred
   */
  async enhanceBusinessGoals(
    projectDescription: string,
    businessGoals: string[]
  ): Promise<string[] | null> {
    try {
      const response = await apiClient.post<EnhanceBusinessGoalsResponse>(
        "/api/ai-text/enhance-business-goals",
        {
          project_description: projectDescription,
          user_goals: businessGoals,
        } as EnhanceBusinessGoalsRequest
      );

      return response.data.enhanced_goals;
    } catch (error) {
      console.error("Error enhancing business goals:", error);
      return null;
    }
  }

  /**
   * Enhance target users description using AI.
   *
   * @param projectDescription The project description
   * @param targetUsers The original target users description
   * @returns The enhanced target users description or null if an error occurred
   */
  async enhanceTargetUsers(
    projectDescription: string,
    targetUsers: string
  ): Promise<string | null> {
    try {
      const response = await apiClient.post<EnhanceTargetUsersResponse>(
        "/api/ai-text/enhance-target-users",
        {
          project_description: projectDescription,
          target_users: targetUsers,
        } as EnhanceTargetUsersRequest
      );

      return response.data.enhanced_target_users;
    } catch (error) {
      console.error("Error enhancing target users:", error);
      return null;
    }
  }

  /**
   * Enhance project requirements using AI.
   *
   * @param projectDescription The project description
   * @param businessGoals The business goals
   * @param requirements The original requirements
   * @returns The enhanced requirements or null if an error occurred
   */
  async enhanceRequirements(
    projectDescription: string,
    businessGoals: string[],
    requirements: string[]
  ): Promise<string[] | null> {
    try {
      const response = await apiClient.post<EnhanceRequirementsResponse>(
        "/api/ai-text/enhance-requirements",
        {
          project_description: projectDescription,
          business_goals: businessGoals,
          user_requirements: requirements,
        } as EnhanceRequirementsRequest
      );

      return response.data.enhanced_requirements;
    } catch (error) {
      console.error("Error enhancing requirements:", error);
      return null;
    }
  }

  /**
   * Enhance project features using AI.
   *
   * @param projectDescription The project description
   * @param businessGoals The business goals
   * @param requirements The project requirements
   * @param userFeatures The original features (optional)
   * @returns The enhanced features data or null if an error occurred
   */
  async enhanceFeatures(
    projectDescription: string,
    businessGoals: string[],
    requirements: string[],
    userFeatures?: FeatureModule[]
  ): Promise<FeaturesData | null> {
    try {
      const response = await apiClient.post<EnhanceFeaturesResponse>(
        "/api/ai-text/enhance-features",
        {
          project_description: projectDescription,
          business_goals: businessGoals,
          requirements: requirements,
          user_features: userFeatures,
        } as EnhanceFeaturesRequest
      );

      return response.data.data;
    } catch (error) {
      console.error("Error enhancing features:", error);
      return null;
    }
  }

  /**
   * Enhance project pages/screens using AI.
   *
   * @param projectDescription The project description
   * @param features The project features
   * @param requirements The project requirements
   * @param existingPages The original pages (optional)
   * @returns The enhanced pages data or null if an error occurred
   */
  async enhancePages(
    projectDescription: string,
    features: FeatureModule[],
    requirements: string[],
    existingPages?: PagesData
  ): Promise<PagesData | null> {
    try {
      const response = await apiClient.post<EnhancePagesResponse>(
        "/api/ai-text/enhance-pages",
        {
          project_description: projectDescription,
          features: features,
          requirements: requirements,
          existing_pages: existingPages,
        } as EnhancePagesRequest
      );

      return response.data.data;
    } catch (error) {
      console.error("Error enhancing pages:", error);
      return null;
    }
  }
}

export const aiService = new AIService();
