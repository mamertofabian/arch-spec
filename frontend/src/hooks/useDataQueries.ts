import { useQuery, useQueryClient } from "@tanstack/react-query";
import { templatesService } from "../services/templatesService";
import { techStackService } from "../services/techStackService";
import { requirementsService } from "../services/requirementsService";
import { featuresService, FeaturesData } from "../services/featuresService";
import { useState, useEffect } from "react";
import { RequirementsData } from "../types/project";

// Query keys for different types of data
export const QUERY_KEYS = {
  TECH_STACK: "techStack",
  TEMPLATES: "templates",
};

/**
 * Hook to fetch tech stack data
 */
export function useTechStack() {
  return useQuery({
    queryKey: [QUERY_KEYS.TECH_STACK],
    queryFn: async () => {
      // Use the tech stack service to ensure proper authentication
      return await techStackService.getAllTechnology();
    },
  });
}

/**
 * Hook to invalidate tech stack data for refreshing
 */
export function useRefreshTechStack() {
  const queryClient = useQueryClient();

  return {
    refreshTechStack: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TECH_STACK] });
    },
  };
}

/**
 * Hook to fetch template data
 */
export function useTemplates() {
  return useQuery({
    queryKey: [QUERY_KEYS.TEMPLATES],
    queryFn: async () => {
      const templates = await templatesService.getTemplates();
      return templates;
    },
  });
}

/**
 * Hook to fetch a specific template by ID
 */
export function useTemplate(templateId?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.TEMPLATES, templateId],
    queryFn: async () => {
      if (!templateId) throw new Error("Template ID is required");
      const template = await templatesService.getTemplateById(templateId);
      return template;
    },
    enabled: !!templateId, // Only run if templateId is provided
  });
}

/**
 * Hook to invalidate templates data for refreshing
 */
export function useRefreshTemplates() {
  const queryClient = useQueryClient();

  return {
    refreshTemplates: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TEMPLATES] });
    },
  };
}

// Requirements hook
export const useRequirements = (projectId?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<RequirementsData | null>(null);

  useEffect(() => {
    const fetchRequirements = async () => {
      if (!projectId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const requirements = await requirementsService.getRequirements(
          projectId
        );
        setData(requirements);
      } catch (err) {
        console.error("Error fetching requirements:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch requirements")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequirements();
  }, [projectId]);

  return { data, isLoading, error };
};

// Features hook
export const useFeatures = (projectId?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<FeaturesData | null>(null);

  useEffect(() => {
    const fetchFeatures = async () => {
      if (!projectId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const features = await featuresService.getFeatures(projectId);
        setData(features);
      } catch (err) {
        console.error("Error fetching features:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch features")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatures();
  }, [projectId]);

  return { data, isLoading, error };
};
