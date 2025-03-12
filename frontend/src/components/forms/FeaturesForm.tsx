import { useState, useEffect } from "react";
import {
  ToggleLeft,
  ToggleRight,
  Info,
  Loader2,
  PlusCircle,
  X,
  Edit,
  Trash2,
} from "lucide-react";
import {
  FeatureModule,
  FeaturesData,
  featuresService,
} from "../../services/featuresService";
import { useToast } from "../../contexts/ToastContext";

interface FeaturesFormProps {
  initialData?: FeaturesData;
  projectId?: string;
  onSuccess?: (featuresData: FeaturesData) => void;
}

export default function FeaturesForm({
  initialData,
  projectId,
  onSuccess,
}: FeaturesFormProps) {
  const { showToast } = useToast();
  const [coreModules, setCoreModules] = useState<FeatureModule[]>(
    initialData?.coreModules || []
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // State for feature form - used for both adding and editing
  const [isAddingFeature, setIsAddingFeature] = useState(false);
  const [isEditingFeature, setIsEditingFeature] = useState(false);
  const [editingFeatureIndex, setEditingFeatureIndex] = useState<number | null>(
    null
  );
  const [featureForm, setFeatureForm] = useState<{
    name: string;
    description: string;
    enabled: boolean;
    optional?: boolean;
    providers?: string[];
  }>({
    name: "",
    description: "",
    enabled: true,
    optional: true,
    providers: [],
  });
  const [showProviders, setShowProviders] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Add debug logging for initialData
  useEffect(() => {
    console.log("FeaturesForm initialData:", initialData);
  }, [initialData]);

  // Effect to update local state when initial data changes
  useEffect(() => {
    if (initialData) {
      console.log(
        "Setting core modules from initialData:",
        initialData.coreModules
      );
      setCoreModules(initialData.coreModules || []);
    }
  }, [initialData]);

  // Fetch features if projectId is provided but no initialData
  useEffect(() => {
    const fetchFeatures = async () => {
      if (projectId && !initialData) {
        setIsLoading(true);
        try {
          const featuresData = await featuresService.getFeatures(projectId);
          if (featuresData) {
            console.log("Fetched features data:", featuresData);
            setCoreModules(featuresData.coreModules || []);
          }
        } catch (error) {
          console.error("Error fetching features:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchFeatures();
  }, [projectId, initialData]);

  const handleToggleFeature = (index: number) => {
    if (!coreModules[index].optional) return; // Can't disable non-optional features

    const updatedModules = [...coreModules];
    updatedModules[index] = {
      ...updatedModules[index],
      enabled: !updatedModules[index].enabled,
    };
    setCoreModules(updatedModules);
  };

  const handleProviderChange = (moduleIndex: number, provider: string) => {
    const updatedModules = [...coreModules];
    updatedModules[moduleIndex] = {
      ...updatedModules[moduleIndex],
      providers: [provider], // Replace existing providers with the selected one
    };
    setCoreModules(updatedModules);
  };

  const handleFeatureFormChange = (
    field: string,
    value: string | boolean | string[]
  ) => {
    setFeatureForm({
      ...featureForm,
      [field]: value,
    });

    // Clear any error for this field when it changes
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      });
    }
  };

  const validateFeatureForm = () => {
    const newErrors: Record<string, string> = {};

    if (!featureForm.name.trim()) {
      newErrors.name = "Feature name is required";
    }

    if (!featureForm.description.trim()) {
      newErrors.description = "Feature description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddFeature = () => {
    if (!validateFeatureForm()) return;

    // Create a new feature module from the form data
    const featureToAdd: FeatureModule = {
      name: featureForm.name.trim(),
      description: featureForm.description.trim(),
      enabled: featureForm.enabled,
      optional: featureForm.optional,
    };

    // Only add providers if they're being used
    if (
      showProviders &&
      featureForm.providers &&
      featureForm.providers.length > 0
    ) {
      featureToAdd.providers = featureForm.providers;
    }

    // Add to core modules
    setCoreModules([...coreModules, featureToAdd]);

    // Reset the form
    resetFeatureForm();

    // Show success toast
    showToast({
      title: "Success",
      description: "New feature added successfully",
      type: "success",
    });
  };

  const handleEditFeature = () => {
    if (editingFeatureIndex === null || !validateFeatureForm()) return;

    // Create an updated feature module
    const updatedFeature: FeatureModule = {
      name: featureForm.name.trim(),
      description: featureForm.description.trim(),
      enabled: featureForm.enabled,
      optional: featureForm.optional,
    };

    // Only add providers if they're being used
    if (
      showProviders &&
      featureForm.providers &&
      featureForm.providers.length > 0
    ) {
      updatedFeature.providers = featureForm.providers;
    }

    // Update the feature in coreModules
    const updatedModules = [...coreModules];
    updatedModules[editingFeatureIndex] = updatedFeature;
    setCoreModules(updatedModules);

    // Reset the form
    resetFeatureForm();

    // Show success toast
    showToast({
      title: "Success",
      description: "Feature updated successfully",
      type: "success",
    });
  };

  const handleDeleteFeature = (index: number) => {
    // Remove the feature at the specified index
    const updatedModules = coreModules.filter((_, i) => i !== index);
    setCoreModules(updatedModules);

    // Show success toast
    showToast({
      title: "Success",
      description: "Feature removed successfully",
      type: "success",
    });
  };

  const handleStartEditFeature = (index: number) => {
    const feature = coreModules[index];

    // Set form data based on selected feature
    setFeatureForm({
      name: feature.name,
      description: feature.description,
      enabled: feature.enabled,
      optional: feature.optional,
      providers: feature.providers || [],
    });

    // Set editing state
    setShowProviders(!!feature.providers && feature.providers.length > 0);
    setEditingFeatureIndex(index);
    setIsEditingFeature(true);
  };

  const resetFeatureForm = () => {
    setFeatureForm({
      name: "",
      description: "",
      enabled: true,
      optional: true,
      providers: [],
    });
    setShowProviders(false);
    setIsAddingFeature(false);
    setIsEditingFeature(false);
    setEditingFeatureIndex(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectId) {
      showToast({
        title: "Error",
        description: "Project must be saved before features can be saved",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const data = {
        coreModules: coreModules,
      };

      const result = await featuresService.saveFeatures(projectId, data);

      if (result) {
        showToast({
          title: "Success",
          description: "Features saved successfully",
          type: "success",
        });

        if (onSuccess) {
          onSuccess(result);
        }
      } else {
        showToast({
          title: "Error",
          description: "Failed to save features",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error saving features:", error);
      showToast({
        title: "Error",
        description: "An unexpected error occurred",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 text-primary-600 animate-spin mr-3" />
        <span className="text-slate-600 dark:text-slate-300">
          Loading features...
        </span>
      </div>
    );
  }

  return (
    <form id="features-form" onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Features & Modules
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Define the features and modules to include in your project.
          </p>
        </div>

        {/* Add new feature button */}
        {!isAddingFeature && !isEditingFeature && (
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setIsAddingFeature(true)}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <PlusCircle size={16} className="mr-2" />
              Add New Feature
            </button>
          </div>
        )}

        {/* Feature form (used for both adding and editing) */}
        {(isAddingFeature || isEditingFeature) && (
          <div className="bg-slate-50 dark:bg-slate-700/30 p-4 border border-slate-200 dark:border-slate-700 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-slate-800 dark:text-slate-100">
                {isEditingFeature ? "Edit Feature" : "Add New Feature"}
              </h3>
              <button
                type="button"
                onClick={resetFeatureForm}
                className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Feature name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Feature Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={featureForm.name}
                  onChange={(e) =>
                    handleFeatureFormChange("name", e.target.value)
                  }
                  placeholder="e.g., User Authentication"
                  className={`w-full p-2 border ${
                    errors.name
                      ? "border-red-500"
                      : "border-slate-300 dark:border-slate-600"
                  } rounded focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Feature description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={featureForm.description}
                  onChange={(e) =>
                    handleFeatureFormChange("description", e.target.value)
                  }
                  rows={3}
                  placeholder="Describe what this feature does"
                  className={`w-full p-2 border ${
                    errors.description
                      ? "border-red-500"
                      : "border-slate-300 dark:border-slate-600"
                  } rounded focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100`}
                ></textarea>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Feature options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="feature-enabled"
                    checked={featureForm.enabled}
                    onChange={(e) =>
                      handleFeatureFormChange("enabled", e.target.checked)
                    }
                    className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label
                    htmlFor="feature-enabled"
                    className="ml-2 block text-sm text-slate-700 dark:text-slate-300"
                  >
                    Enabled by default
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="feature-optional"
                    checked={featureForm.optional}
                    onChange={(e) =>
                      handleFeatureFormChange("optional", e.target.checked)
                    }
                    className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label
                    htmlFor="feature-optional"
                    className="ml-2 block text-sm text-slate-700 dark:text-slate-300"
                  >
                    Optional (not required for implementation)
                  </label>
                </div>
              </div>

              {/* Provider options */}
              <div>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="has-providers"
                    checked={showProviders}
                    onChange={(e) => setShowProviders(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label
                    htmlFor="has-providers"
                    className="ml-2 block text-sm text-slate-700 dark:text-slate-300"
                  >
                    This feature uses external providers
                  </label>
                </div>

                {showProviders && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Available Providers
                    </label>
                    <select
                      value={
                        (featureForm.providers && featureForm.providers[0]) ||
                        ""
                      }
                      onChange={(e) =>
                        handleFeatureFormChange(
                          "providers",
                          e.target.value ? [e.target.value] : []
                        )
                      }
                      className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    >
                      <option value="">Select provider...</option>
                      <option value="Stripe">Stripe</option>
                      <option value="PayPal">PayPal</option>
                      <option value="AWS">AWS</option>
                      <option value="Azure">Azure</option>
                      <option value="GCP">Google Cloud</option>
                      <option value="Firebase">Firebase</option>
                      <option value="Custom">Custom Implementation</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  type="button"
                  onClick={resetFeatureForm}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={
                    isEditingFeature ? handleEditFeature : handleAddFeature
                  }
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  {isEditingFeature ? "Save Changes" : "Add Feature"}
                </button>
              </div>
            </div>
          </div>
        )}

        {coreModules.length === 0 && !isAddingFeature && !isEditingFeature ? (
          <div className="p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-center">
            <p className="text-slate-600 dark:text-slate-400">
              No features available. Add your first feature to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {coreModules.map((module, index) => (
              <div
                key={index}
                className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-slate-800 dark:text-slate-100">
                      {module.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {module.description}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleStartEditFeature(index)}
                      className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                      title="Edit feature"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteFeature(index)}
                      className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      title="Remove feature"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleFeature(index)}
                      disabled={!module.optional}
                      className={`p-1 ${
                        !module.optional
                          ? "cursor-not-allowed text-slate-400 dark:text-slate-600"
                          : "cursor-pointer"
                      }`}
                      title={
                        module.optional
                          ? "Toggle feature"
                          : "This feature is required"
                      }
                    >
                      {module.enabled ? (
                        <ToggleRight size={24} className="text-primary-600" />
                      ) : (
                        <ToggleLeft
                          size={24}
                          className="text-slate-400 dark:text-slate-500"
                        />
                      )}
                    </button>
                  </div>
                </div>

                {!module.optional && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <Info size={12} />
                    <span>This feature is required for implementation</span>
                  </div>
                )}

                {module.enabled &&
                  module.providers &&
                  module.providers.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Provider
                      </label>
                      <select
                        value={module.providers[0] || ""}
                        onChange={(e) =>
                          handleProviderChange(index, e.target.value)
                        }
                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      >
                        <option value="">Select provider...</option>
                        <option value="Stripe">Stripe</option>
                        <option value="PayPal">PayPal</option>
                        <option value="AWS">AWS</option>
                        <option value="Azure">Azure</option>
                        <option value="GCP">Google Cloud</option>
                        <option value="Firebase">Firebase</option>
                        <option value="Custom">Custom Implementation</option>
                      </select>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !projectId}
          className={`px-4 py-2 rounded-md text-white ${
            !projectId || isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary-600 hover:bg-primary-700"
          } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
        >
          {isSubmitting ? "Saving..." : "Save Features"}
        </button>
      </div>
    </form>
  );
}
