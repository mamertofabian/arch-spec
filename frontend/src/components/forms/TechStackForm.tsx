import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  StateManagement,
  TechStackData,
  Technology,
  UILibrary,
} from "../../types/techStack";
import { useTechStack } from "../../hooks/useDataQueries";

// Import schema
import {
  techStackSchema,
  TechStackFormData,
} from "./tech-stack/techStackSchema";

// Import section components
import FrontendSection from "./tech-stack/FrontendSection";
import BackendSection from "./tech-stack/BackendSection";
import DatabaseSection from "./tech-stack/DatabaseSection";
import AuthenticationSection from "./tech-stack/AuthenticationSection";
import { ProjectTechStack } from "../../types/templates";

interface TechStackFormProps {
  initialData?: ProjectTechStack;
  onSubmit: (data: TechStackFormData) => void;
  onBack?: () => void;
}

const TechStackForm = ({
  initialData,
  onSubmit,
  onBack,
}: TechStackFormProps) => {
  // State for options
  const [techStackOptions, setTechStackOptions] =
    useState<TechStackData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // State for filtered options
  const [authOptions] = useState<string[]>([]);

  const defaultValues: TechStackFormData = {
    frontend: "",
    frontend_language: "",
    ui_library: "",
    state_management: "",
    backend_type: "",
    backend_framework: "",
    backend_language: "",
    backend_service: "",
    backend_realtime: "",
    database_type: "",
    database_system: "",
    database_hosting: "",
    database_orm: "",
    auth_provider: "",
    auth_methods: "",
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue: setTechStackValue,
  } = useForm<TechStackFormData>({
    resolver: zodResolver(techStackSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    console.log("initialData", initialData);
  }, [initialData]);

  // Use the data query hook instead of direct service call
  const { data: techStackData, isLoading: isTechStackLoading } = useTechStack();

  // Update local state when data from hook is received
  useEffect(() => {
    if (techStackData) {
      setTechStackOptions(techStackData);
      setIsLoading(false);
    } else {
      setIsLoading(isTechStackLoading);
    }
  }, [techStackData, isTechStackLoading]);

  // Helper functions to get tech options from the updated TechStackData structure
  const getFrontendFrameworks = (): Technology[] => {
    // Get all frameworks and filter to only return frontend frameworks
    const frameworks = techStackOptions?.technologies?.frameworks || {};

    return (
      Object.entries(frameworks)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, framework]) => framework.type === "frontend")
        .map(([name, framework]) => ({
          ...framework,
          id: name,
        }))
        .sort((a, b) => a.id.localeCompare(b.id)) as Technology[]
    );
  };

  const getFrontendUILibraries = (): UILibrary[] => {
    // Get all UI libraries and filter to only return frontend UI libraries
    const uiLibraries = techStackOptions?.technologies?.uiLibraries || {};

    return Object.entries(uiLibraries)
      .map(([name, uiLibrary]) => ({
        ...uiLibrary,
        id: name,
      }))
      .sort((a, b) => a.id.localeCompare(b.id)) as UILibrary[];
  };

  const getFrontendStateManagement = (): StateManagement[] => {
    // Get all state management and filter to only return frontend state management
    const stateManagement =
      techStackOptions?.technologies?.stateManagement || {};

    return Object.entries(stateManagement)
      .map(([name, stateManagement]) => ({
        ...stateManagement,
        id: name,
      }))
      .sort((a, b) => a.id.localeCompare(b.id)) as StateManagement[];
  };

  const getBackendFrameworks = (): Technology[] => {
    // Get all frameworks and filter to only return backend frameworks
    const frameworks = techStackOptions?.technologies?.frameworks || {};

    return (
      Object.entries(frameworks)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, framework]) => framework.type === "backend")
        .map(([name, framework]) => ({
          ...framework,
          id: name,
        })) as Technology[]
    );
  };

  const getBackendBaaS = (): Technology[] => {
    // Get all BaaS and filter to only return backend BaaS
    const baas = techStackOptions?.technologies?.baas || {};

    return Object.entries(baas).map(([name, baas]) => ({
      ...baas,
      id: name,
    })) as Technology[];
  };

  const getBackendRealtime = (): Technology[] => {
    // Get all realtime and filter to only return backend realtime
    const realtime = techStackOptions?.technologies?.realtime || {};

    return Object.entries(realtime).map(([name, realtime]) => ({
      ...realtime,
      id: name,
    })) as Technology[];
  };

  const getBackendFunctions = (): Technology[] => {
    // Get all functions and filter to only return backend functions
    const functions = techStackOptions?.technologies?.serverless || {};

    return Object.entries(functions).map(([name, functions]) => ({
      ...functions,
      id: name,
    })) as Technology[];
  };

  const getBackendServerless = (): Technology[] => {
    // Get all serverless options
    const serverless = techStackOptions?.technologies?.serverless || {};

    return Object.entries(serverless).map(([name, service]) => ({
      ...service,
      id: name,
    })) as Technology[];
  };

  const getAllDatabases = (): Technology[] => {
    // Get all databases
    const databases = techStackOptions?.technologies?.databases || {};

    return Object.entries(databases).map(([name, database]) => ({
      ...database,
      id: name,
    })) as Technology[];
  };

  const getAllDatabaseHosting = (): string[] => {
    // Get all database hosting
    return techStackOptions?.categories?.database?.hosting || [];
  };

  const getAllOrms = (): Technology[] => {
    // Get all ORMs
    const orms = techStackOptions?.technologies?.orms || {};

    return Object.entries(orms).map(([name, orm]) => ({
      ...orm,
      id: name,
    })) as Technology[];
  };

  if (isLoading || !techStackOptions) {
    return <div className="p-4">Loading tech stack options...</div>;
  }

  return (
    <form
      id="tech-stack-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8"
    >
      {/* Frontend Section */}
      <FrontendSection
        register={register}
        errors={errors}
        frontendFrameworks={getFrontendFrameworks()}
        uiLibraryOptions={getFrontendUILibraries()}
        stateManagementOptions={getFrontendStateManagement()}
        control={control}
        setValue={setTechStackValue}
        initialData={initialData}
      />

      {/* Backend Section */}
      <BackendSection
        register={register}
        errors={errors}
        backendFrameworks={getBackendFrameworks()}
        backendBaaS={getBackendBaaS()}
        backendRealtime={getBackendRealtime()}
        backendFunctions={getBackendFunctions()}
        backendServerless={getBackendServerless()}
        initialData={initialData}
        control={control}
        setValue={setTechStackValue}
      />

      {/* Database Section */}
      <DatabaseSection
        register={register}
        errors={errors}
        allDatabases={getAllDatabases()}
        allDatabaseHosting={getAllDatabaseHosting()}
        allOrms={getAllOrms()}
        initialData={initialData}
        control={control}
        setValue={setTechStackValue}
      />

      {/* Authentication Section */}
      <AuthenticationSection
        register={register}
        backend=""
        authOptions={authOptions}
        initialData={initialData}
        control={control}
        setValue={setTechStackValue}
      />

      {/* Navigation buttons */}
      {onBack && (
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Back
          </button>
        </div>
      )}
    </form>
  );
};

export default TechStackForm;
