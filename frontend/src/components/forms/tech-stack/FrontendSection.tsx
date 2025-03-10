import {
  UseFormRegister,
  FormState,
  FieldError,
  useWatch,
  Control,
} from "react-hook-form";
import {
  Technology,
  UILibrary,
  StateManagement,
} from "../../../types/techStack";
import { TechStackFormData } from "../tech-stack/techStackSchema";
import { ReactNode, useEffect, useMemo } from "react";
import {
  filterLanguageOptions,
  filterFrameworkOptions,
  filterUILibraryOptions,
  filterStateManagementOptions,
} from "../../../utils/techStackFilterUtils";

interface FrontendSectionProps {
  register: UseFormRegister<TechStackFormData>;
  errors: FormState<TechStackFormData>["errors"];
  frontendFrameworks: Technology[];
  uiLibraryOptions: UILibrary[];
  stateManagementOptions: StateManagement[];
  control: Control<TechStackFormData>;
}

const FrontendSection = ({
  register,
  errors,
  frontendFrameworks,
  uiLibraryOptions,
  stateManagementOptions,
  control,
}: FrontendSectionProps) => {
  // Helper function to safely get error message
  const getErrorMessage = (error: FieldError | undefined): ReactNode => {
    return error?.message as ReactNode;
  };

  // Watch for form value changes
  const watchedValues = useWatch({
    control,
    name: ["frontend", "frontend_language", "ui_library", "state_management"],
  });

  const [
    selectedFramework,
    selectedLanguage,
    selectedUILibrary,
    selectedStateManagement,
  ] = watchedValues;

  // Debug log for watched values
  useEffect(() => {
    console.log("Selected values:", {
      framework: selectedFramework,
      language: selectedLanguage,
      uiLibrary: selectedUILibrary,
      stateManagement: selectedStateManagement,
    });
  }, [
    selectedFramework,
    selectedLanguage,
    selectedUILibrary,
    selectedStateManagement,
  ]);

  const filteredLanguages = useMemo(
    () =>
      filterLanguageOptions(
        selectedFramework,
        selectedUILibrary,
        selectedStateManagement,
        frontendFrameworks,
        uiLibraryOptions,
        stateManagementOptions
      ),
    [
      selectedFramework,
      selectedUILibrary,
      selectedStateManagement,
      frontendFrameworks,
      uiLibraryOptions,
      stateManagementOptions,
    ]
  );

  const filteredFrameworks = useMemo(
    () =>
      filterFrameworkOptions(
        selectedLanguage,
        selectedUILibrary,
        selectedStateManagement,
        frontendFrameworks,
        uiLibraryOptions,
        stateManagementOptions
      ),
    [
      selectedLanguage,
      selectedUILibrary,
      selectedStateManagement,
      frontendFrameworks,
      uiLibraryOptions,
      stateManagementOptions,
    ]
  );

  const filteredUILibraries = useMemo(
    () =>
      filterUILibraryOptions(
        selectedFramework,
        selectedLanguage,
        selectedStateManagement,
        frontendFrameworks,
        uiLibraryOptions,
        stateManagementOptions
      ),
    [
      selectedFramework,
      selectedLanguage,
      selectedStateManagement,
      frontendFrameworks,
      uiLibraryOptions,
      stateManagementOptions,
    ]
  );

  const filteredStateManagement = useMemo(
    () =>
      filterStateManagementOptions(
        selectedFramework,
        selectedLanguage,
        selectedUILibrary,
        frontendFrameworks,
        uiLibraryOptions,
        stateManagementOptions
      ),
    [
      selectedFramework,
      selectedLanguage,
      selectedUILibrary,
      frontendFrameworks,
      uiLibraryOptions,
      stateManagementOptions,
    ]
  );

  return (
    <div>
      <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-4">
        Frontend
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="frontend"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Framework
          </label>
          <select
            id="frontend"
            {...register("frontend")}
            className={`mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
              errors.frontend ? "border-red-500 focus:ring-red-500" : ""
            }`}
          >
            <option value="">Select Framework</option>
            {filteredFrameworks.map((framework) => (
              <option key={framework.id} value={framework.id}>
                {framework.id}
              </option>
            ))}
          </select>
          {errors.frontend && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {getErrorMessage(errors.frontend)}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="frontend_language"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Language
          </label>
          <select
            id="frontend_language"
            {...register("frontend_language")}
            className={`mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
              errors.frontend_language
                ? "border-red-500 focus:ring-red-500"
                : ""
            }`}
          >
            <option value="">Select Language</option>
            {filteredLanguages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
          {errors.frontend_language && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {getErrorMessage(errors.frontend_language)}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="ui_library"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            UI Library
          </label>
          <select
            id="ui_library"
            {...register("ui_library")}
            className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          >
            <option value="">Select UI Library</option>
            {filteredUILibraries.map((lib) => (
              <option key={lib.id} value={lib.id}>
                {lib.id}
              </option>
            ))}
          </select>
        </div>

        {/* State Management dropdown */}
        <div>
          <label
            htmlFor="state_management"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            State Management
          </label>
          <select
            id="state_management"
            {...register("state_management")}
            className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          >
            <option value="">Select State Management</option>
            {filteredStateManagement.map((sm) => (
              <option key={sm.id} value={sm.id}>
                {sm.id}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FrontendSection;
