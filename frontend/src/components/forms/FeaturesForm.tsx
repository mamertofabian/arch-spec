import {
  Edit,
  Info,
  Loader2,
  Lock,
  PlusCircle,
  RefreshCw,
  Save,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useToast } from '../../contexts/ToastContext';
import { aiService } from '../../services/aiService';
import { FeatureModule, FeaturesData, featuresService } from '../../services/featuresService';
import { projectsService } from '../../services/projectsService';
import { requirementsService } from '../../services/requirementsService';
import AIInstructionsModal from '../ui/AIInstructionsModal';
import { PremiumFeatureBadge, ProcessingOverlay } from '../ui/index';

// Import shadcn UI components
import { useUserProfile } from '../../hooks/useUserProfile';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { Checkbox } from '../ui/checkbox';
import Input from '../ui/Input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';
import { Textarea } from '../ui/textarea';
interface FeaturesFormProps {
  initialData?: FeaturesData;
  projectId?: string;
  onSuccess?: (featuresData: FeaturesData) => void;
}

export default function FeaturesForm({ initialData, projectId, onSuccess }: FeaturesFormProps) {
  const { showToast } = useToast();
  const { hasAIFeatures } = useSubscription();
  const { aiCreditsRemaining } = useUserProfile();
  const [coreModules, setCoreModules] = useState<FeatureModule[]>(initialData?.coreModules || []);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Add state for form-level error and success messages
  const [error, setError] = useState<string>('');

  // Add state for tracking unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [initialCoreModules, setInitialCoreModules] = useState<FeatureModule[]>([]);

  // State for feature form - used for both adding and editing
  const [isAddingFeature, setIsAddingFeature] = useState(false);
  const [isEditingFeature, setIsEditingFeature] = useState(false);
  const [editingFeatureIndex, setEditingFeatureIndex] = useState<number | null>(null);
  const [featureForm, setFeatureForm] = useState<{
    name: string;
    description: string;
    enabled: boolean;
    optional?: boolean;
    providers?: string[];
  }>({
    name: '',
    description: '',
    enabled: true,
    optional: true,
    providers: [],
  });
  const [showProviders, setShowProviders] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Add state for AI enhancement
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [isAddingFeatures, setIsAddingFeatures] = useState<boolean>(false);
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [businessGoals, setBusinessGoals] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);

  // Add state for AI instructions modals
  const [isEnhanceModalOpen, setIsEnhanceModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Add debug logging for initialData
  // useEffect(() => {
  //   console.log("FeaturesForm initialData:", initialData);
  // }, [initialData]);

  // Track unsaved changes by comparing current features with initial features
  useEffect(() => {
    if (!initialData) return;
    
    // Compare current features with initial features
    const currentFeaturesJson = JSON.stringify(coreModules);
    const initialFeaturesJson = JSON.stringify(initialCoreModules);
    
    setHasUnsavedChanges(currentFeaturesJson !== initialFeaturesJson);
  }, [coreModules, initialCoreModules, initialData]);

  // Effect to update local state when initial data changes
  useEffect(() => {
    if (initialData) {
      // console.log(
      //   "Setting core modules from initialData:",
      //   initialData.coreModules
      // );
      const initialFeatures = initialData.coreModules || [];
      setCoreModules(initialFeatures);
      setInitialCoreModules(JSON.parse(JSON.stringify(initialFeatures))); // Deep copy to avoid reference issues
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
            console.log('Fetched features data:', featuresData);
            const fetchedFeatures = featuresData.coreModules || [];
            setCoreModules(fetchedFeatures);
            setInitialCoreModules(JSON.parse(JSON.stringify(fetchedFeatures))); // Deep copy
          }
        } catch (error) {
          console.error('Error fetching features:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchFeatures();
  }, [projectId, initialData]);

  // New function to fetch project info for AI enhancement
  const fetchProjectInfo = async () => {
    if (!projectId) return;

    try {
      // Fetch project details including description and business goals
      const projectDetails = await projectsService.getProjectById(projectId);

      if (projectDetails) {
        setProjectDescription(projectDetails.description || '');
        setBusinessGoals(projectDetails.business_goals || []);

        // Fetch requirements as well
        const requirementsData = await requirementsService.getRequirements(projectId);
        if (requirementsData) {
          // Combine functional and non-functional requirements
          const allRequirements = [
            ...(requirementsData.functional || []),
            ...(requirementsData.non_functional || []),
          ];
          setRequirements(allRequirements);
        }
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  // Add effect to fetch project info
  useEffect(() => {
    if (projectId) {
      fetchProjectInfo();
    }
  }, [projectId]);

  const handleToggleFeature = (index: number) => {
    if (!coreModules[index].optional) return; // Can't disable non-optional features

    const updatedModules = [...coreModules];
    updatedModules[index] = {
      ...updatedModules[index],
      enabled: !updatedModules[index].enabled,
    };
    setCoreModules(updatedModules);
    
    // Indicate that changes need to be saved
    setHasUnsavedChanges(true);
  };

  const handleProviderChange = (moduleIndex: number, provider: string) => {
    const updatedModules = [...coreModules];
    updatedModules[moduleIndex] = {
      ...updatedModules[moduleIndex],
      providers: [provider], // Replace existing providers with the selected one
    };
    setCoreModules(updatedModules);
    
    // Indicate that changes need to be saved
    setHasUnsavedChanges(true);
  };

  const handleFeatureFormChange = (field: string, value: string | boolean | string[]) => {
    setFeatureForm({
      ...featureForm,
      [field]: value,
    });

    // Clear any error for this field when it changes
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      });
    }
  };

  const validateFeatureForm = () => {
    const newErrors: Record<string, string> = {};

    if (!featureForm.name.trim()) {
      newErrors.name = 'Feature name is required';
    }

    if (!featureForm.description.trim()) {
      newErrors.description = 'Feature description is required';
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
    if (showProviders && featureForm.providers && featureForm.providers.length > 0) {
      featureToAdd.providers = featureForm.providers;
    }

    // Add to core modules
    setCoreModules([...coreModules, featureToAdd]);

    // Reset the form
    resetFeatureForm();

    // Indicate that changes need to be saved instead of showing success toast
    setHasUnsavedChanges(true);
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
    if (showProviders && featureForm.providers && featureForm.providers.length > 0) {
      updatedFeature.providers = featureForm.providers;
    }

    // Update the feature in coreModules
    const updatedModules = [...coreModules];
    updatedModules[editingFeatureIndex] = updatedFeature;
    setCoreModules(updatedModules);

    // Reset the form
    resetFeatureForm();

    // Indicate that changes need to be saved instead of showing success toast
    setHasUnsavedChanges(true);
  };

  const handleDeleteFeature = (index: number) => {
    // Remove the feature at the specified index
    const updatedModules = coreModules.filter((_, i) => i !== index);
    setCoreModules(updatedModules);

    // Indicate that changes need to be saved instead of showing success toast
    setHasUnsavedChanges(true);
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
      name: '',
      description: '',
      enabled: true,
      optional: true,
      providers: [],
    });
    setShowProviders(false);
    setIsAddingFeature(false);
    setIsEditingFeature(false);
    setEditingFeatureIndex(null);
  };

  // Function to open the enhance features modal
  const openEnhanceModal = () => {
    // Check if user has remaining AI credits
    if (aiCreditsRemaining <= 0) {
      showToast({
        title: 'Insufficient AI Credits',
        description: "You've used all your AI credits for this billing period",
        type: 'warning',
      });
      return;
    }

    if (!hasAIFeatures) {
      showToast({
        title: 'Premium Feature',
        description: 'Upgrade to Premium to use AI-powered features',
        type: 'info',
      });
      return;
    }

    if (!projectId) {
      showToast({
        title: 'Error',
        description: 'Project must be saved before features can be enhanced',
        type: 'error',
      });
      return;
    }

    if (!projectDescription) {
      showToast({
        title: 'Warning',
        description: 'Project description is missing. Features may not be properly enhanced.',
        type: 'warning',
      });
    }

    if (requirements.length === 0) {
      showToast({
        title: 'Warning',
        description: 'No requirements found. Features will be based only on project description.',
        type: 'warning',
      });
    }

    setIsEnhanceModalOpen(true);
  };

  // Function to open the add features modal
  const openAddModal = () => {
    // Check if user has remaining AI credits
    if (aiCreditsRemaining <= 0) {
      showToast({
        title: 'Insufficient AI Credits',
        description: "You've used all your AI credits for this billing period",
        type: 'warning',
      });
      return;
    }

    if (!hasAIFeatures) {
      showToast({
        title: 'Premium Feature',
        description: 'Upgrade to Premium to use AI-powered features',
        type: 'info',
      });
      return;
    }

    if (!projectId) {
      showToast({
        title: 'Error',
        description: 'Project must be saved before features can be enhanced',
        type: 'error',
      });
      return;
    }

    if (!projectDescription) {
      showToast({
        title: 'Warning',
        description: 'Project description is missing. Features may not be properly generated.',
        type: 'warning',
      });
    }

    setIsAddModalOpen(true);
  };

  // Modified function to enhance features using AI (replace existing features)
  const enhanceFeatures = async (additionalInstructions?: string) => {
    setIsEnhancing(true);
    setError('');

    try {
      // Continue with the rest of the function...
      console.log('Enhancing features with AI...');
      console.log('Core modules:', coreModules);
      const enhancedFeatures = await aiService.enhanceFeatures(
        projectDescription,
        businessGoals,
        requirements,
        coreModules.length > 0 ? coreModules : undefined,
        additionalInstructions
      );

      if (enhancedFeatures) {
        // Replace existing features with enhanced ones
        setCoreModules(enhancedFeatures.coreModules || []);

        // If we have optional modules, we could handle them here too
        // For now, we'll focus on core modules

        showToast({
          title: 'Success',
          description: 'Features enhanced successfully',
          type: 'success',
        });
      } else {
        showToast({
          title: 'Warning',
          description: 'No enhanced features returned',
          type: 'warning',
        });
      }
    } catch (error) {
      console.error('Error enhancing features:', error);
      showToast({
        title: 'Error',
        description: 'Failed to enhance features',
        type: 'error',
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  // Modified function to add AI-generated features without replacing existing ones
  const addAIFeatures = async (additionalInstructions?: string) => {
    setIsAddingFeatures(true);
    setError('');

    try {
      // Continue with the rest of the function...
      console.log('Adding AI features...');
      console.log('Core modules:', coreModules);
      const enhancedFeatures = await aiService.enhanceFeatures(
        projectDescription,
        businessGoals,
        requirements,
        undefined,
        additionalInstructions
      );

      if (enhancedFeatures && enhancedFeatures.coreModules.length > 0) {
        // Add new features to existing ones
        setCoreModules([...coreModules, ...enhancedFeatures.coreModules]);

        showToast({
          title: 'Success',
          description: `Added ${enhancedFeatures.coreModules.length} new features`,
          type: 'success',
        });
      } else {
        showToast({
          title: 'Warning',
          description: 'No new features generated',
          type: 'warning',
        });
      }
    } catch (error) {
      console.error('Error adding AI features:', error);
      showToast({
        title: 'Error',
        description: 'Failed to generate new features',
        type: 'error',
      });
    } finally {
      setIsAddingFeatures(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setError('');

    if (!projectId) {
      const errorMessage = 'Project must be saved before features can be saved';
      showToast({
        title: 'Error',
        description: errorMessage,
        type: 'error',
      });
      setError(errorMessage);
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
          title: 'Success',
          description: 'Features saved successfully',
          type: 'success',
        });
        
        // Update initial features to match current features, resetting unsaved changes
        setInitialCoreModules(JSON.parse(JSON.stringify(coreModules)));
        setHasUnsavedChanges(false);

        if (onSuccess) {
          onSuccess(result);
        }
      } else {
        const errorMessage = 'Failed to save features';
        showToast({
          title: 'Error',
          description: errorMessage,
          type: 'error',
        });
        setError(errorMessage);
        setTimeout(() => setError(''), 5000);
      }
    } catch (error) {
      console.error('Error saving features:', error);
      const errorMessage = 'An unexpected error occurred';
      showToast({
        title: 'Error',
        description: errorMessage,
        type: 'error',
      });
      setError(errorMessage);
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to check if any AI operation is in progress
  const isAnyEnhancementInProgress = () => {
    return isEnhancing || isAddingFeatures;
  };

  // Helper to get the appropriate message for the overlay
  const getEnhancementMessage = () => {
    if (isEnhancing) {
      return 'AI is analyzing your project to enhance all features. Please wait...';
    }
    if (isAddingFeatures) {
      return 'AI is generating new features based on your project requirements. Please wait...';
    }
    return 'AI enhancement in progress...';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="mr-3 h-6 w-6 animate-spin text-primary-600" />
        <span className="text-slate-600 dark:text-slate-300">Loading features...</span>
      </div>
    );
  }

  return (
    <form id="features-form" onSubmit={handleSubmit} className="relative space-y-8">
      {/* Processing Overlay */}
      <ProcessingOverlay
        isVisible={isAnyEnhancementInProgress()}
        message={getEnhancementMessage()}
        opacity={0.6}
      />

      {/* AI Instructions Modals */}
      <AIInstructionsModal
        isOpen={isEnhanceModalOpen}
        onClose={() => setIsEnhanceModalOpen(false)}
        onConfirm={(instructions) => enhanceFeatures(instructions)}
        title="Enhance All Features"
        description="The AI will replace your current features with enhanced versions that are more specific, comprehensive, and aligned with your project goals."
        confirmText="Replace Features"
      />

      <AIInstructionsModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={(instructions) => addAIFeatures(instructions)}
        title="Generate Additional Features"
        description="The AI will generate new features to complement your existing ones based on your project description and requirements."
        confirmText="Add Features"
      />

      {/* Error Message */}
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}
      
      {/* Unsaved Changes Indicator */}
      {hasUnsavedChanges && (
        <div className="mb-4 flex items-center justify-between rounded-md bg-amber-50 p-3 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
          <span>You have unsaved changes. Don't forget to save your features.</span>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h2 className="mb-4 text-xl font-semibold text-slate-800 dark:text-slate-100">
            Features & Modules
          </h2>
          <p className="mb-6 text-slate-600 dark:text-slate-400">
            Define the features and modules to include in your project.
          </p>
        </div>

        {/* AI Enhancement Buttons */}
        <div className="mb-4 flex justify-end">
          <div className="mb-4 flex items-center justify-end gap-3">
            {!hasAIFeatures && <PremiumFeatureBadge />}
            <Button
              type="button"
              onClick={openAddModal}
              disabled={isAddingFeatures || isEnhancing || !projectId || !hasAIFeatures}
              variant={hasAIFeatures ? 'outline' : 'ghost'}
              className={`relative flex items-center gap-2 ${
                !hasAIFeatures ? 'cursor-not-allowed opacity-50' : ''
              }`}
              title={
                hasAIFeatures
                  ? 'Generate new features to complement existing ones'
                  : 'Upgrade to Premium to use AI-powered features'
              }
            >
              {isAddingFeatures ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  {hasAIFeatures ? <Sparkles className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  <span>Add AI Features</span>
                </>
              )}
            </Button>
            <Button
              type="button"
              onClick={openEnhanceModal}
              disabled={
                isEnhancing ||
                isAddingFeatures ||
                !projectId ||
                !hasAIFeatures ||
                coreModules.length === 0
              }
              variant={hasAIFeatures ? 'outline' : 'ghost'}
              className={`relative flex items-center gap-2 ${
                !hasAIFeatures ? 'cursor-not-allowed opacity-50' : ''
              }`}
              title={
                hasAIFeatures
                  ? 'Replace all features with enhanced versions'
                  : 'Upgrade to Premium to use AI-powered features'
              }
            >
              {isEnhancing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Enhancing...</span>
                </>
              ) : (
                <>
                  {hasAIFeatures ? <RefreshCw className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  <span>Replace All</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Add new feature button */}
        {!isAddingFeature && !isEditingFeature && (
          <div className="mb-6">
            <Button
              type="button"
              variant="default"
              className="flex items-center"
              onClick={() => setIsAddingFeature(true)}
            >
              <PlusCircle size={16} className="mr-2" />
              Add New Feature
            </Button>
          </div>
        )}

        {/* Feature form for adding new features only */}
        {isAddingFeature && (
          <Card className="mb-6 bg-slate-50 p-4 dark:bg-slate-700/30">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium text-slate-800 dark:text-slate-100">Add New Feature</h3>
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
                <Label htmlFor="feature-name">
                  Feature Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="feature-name"
                  type="text"
                  value={featureForm.name}
                  onChange={(e) => handleFeatureFormChange('name', e.target.value)}
                  placeholder="e.g., User Authentication"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Feature description */}
              <div>
                <Label htmlFor="feature-description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="feature-description"
                  value={featureForm.description}
                  onChange={(e) => handleFeatureFormChange('description', e.target.value)}
                  rows={3}
                  placeholder="Describe what this feature does"
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              {/* Feature options */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Checkbox
                    id="feature-enabled"
                    checked={featureForm.enabled}
                    onCheckedChange={(checked) => handleFeatureFormChange('enabled', checked)}
                    label="Enabled by default"
                  />
                </div>

                <div>
                  <Checkbox
                    id="feature-optional"
                    checked={featureForm.optional}
                    onCheckedChange={(checked) => handleFeatureFormChange('optional', checked)}
                    label="Optional (not required for implementation)"
                  />
                </div>
              </div>

              {/* Provider options */}
              <div>
                <div className="mb-2">
                  <Checkbox
                    id="has-providers"
                    checked={showProviders}
                    onCheckedChange={(checked) => setShowProviders(checked)}
                    label="This feature uses external providers"
                  />
                </div>

                {showProviders && (
                  <div className="mt-2">
                    <Select
                      label="Available Providers"
                      value={(featureForm.providers && featureForm.providers[0]) || ''}
                      onChange={(e) =>
                        handleFeatureFormChange('providers', e.target.value ? [e.target.value] : [])
                      }
                    >
                      <option value="">Select provider...</option>
                      <option value="Stripe">Stripe</option>
                      <option value="PayPal">PayPal</option>
                      <option value="AWS">AWS</option>
                      <option value="Azure">Azure</option>
                      <option value="GCP">Google Cloud</option>
                      <option value="Firebase">Firebase</option>
                      <option value="Custom">Custom Implementation</option>
                    </Select>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="mt-2 flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetFeatureForm}>
                  Cancel
                </Button>
                <Button type="button" variant="default" onClick={handleAddFeature}>
                  Add Feature
                </Button>
              </div>
            </div>
          </Card>
        )}

        {coreModules.length === 0 && !isAddingFeature && !isEditingFeature ? (
          <Card className="bg-slate-50 text-center dark:bg-slate-800">
            <p className="text-slate-600 dark:text-slate-400">
              No features available. Add your first feature to get started.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {coreModules.map((module, index) => (
              <div key={index}>
                <Card className="bg-white p-4 dark:bg-slate-800">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-slate-800 dark:text-slate-100">
                        {module.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
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
                            ? 'cursor-not-allowed text-slate-400 dark:text-slate-600'
                            : 'cursor-pointer'
                        }`}
                        title={module.optional ? 'Toggle feature' : 'This feature is required'}
                      >
                        {module.enabled ? (
                          <ToggleRight size={24} className="text-primary-600" />
                        ) : (
                          <ToggleLeft size={24} className="text-slate-400 dark:text-slate-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  {!module.optional && (
                    <div className="mb-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <Info size={12} />
                      <span>This feature is required for implementation</span>
                    </div>
                  )}

                  {module.enabled && module.providers && module.providers.length > 0 && (
                    <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-700">
                      <Select
                        label="Provider"
                        value={module.providers[0] || ''}
                        onChange={(e) => handleProviderChange(index, e.target.value)}
                      >
                        <option value="">Select provider...</option>
                        <option value="Stripe">Stripe</option>
                        <option value="PayPal">PayPal</option>
                        <option value="AWS">AWS</option>
                        <option value="Azure">Azure</option>
                        <option value="GCP">Google Cloud</option>
                        <option value="Firebase">Firebase</option>
                        <option value="Custom">Custom Implementation</option>
                      </Select>
                    </div>
                  )}
                </Card>

                {/* Inline edit form */}
                {isEditingFeature && editingFeatureIndex === index && (
                  <Card className="mb-4 mt-2 border-l-4 border-primary-500 bg-slate-50 p-4 dark:bg-slate-700/30">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-medium text-slate-800 dark:text-slate-100">
                        Edit Feature
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
                        <Label htmlFor={`feature-name-${index}`}>
                          Feature Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id={`feature-name-${index}`}
                          type="text"
                          value={featureForm.name}
                          onChange={(e) => handleFeatureFormChange('name', e.target.value)}
                          placeholder="e.g., User Authentication"
                          className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                      </div>

                      {/* Feature description */}
                      <div>
                        <Label htmlFor={`feature-description-${index}`}>
                          Description <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id={`feature-description-${index}`}
                          value={featureForm.description}
                          onChange={(e) => handleFeatureFormChange('description', e.target.value)}
                          rows={3}
                          placeholder="Describe what this feature does"
                          className={errors.description ? 'border-red-500' : ''}
                        />
                        {errors.description && (
                          <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                        )}
                      </div>

                      {/* Feature options */}
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <Checkbox
                            id={`feature-enabled-${index}`}
                            checked={featureForm.enabled}
                            onCheckedChange={(checked) =>
                              handleFeatureFormChange('enabled', checked)
                            }
                            label="Enabled by default"
                          />
                        </div>

                        <div>
                          <Checkbox
                            id={`feature-optional-${index}`}
                            checked={featureForm.optional}
                            onCheckedChange={(checked) =>
                              handleFeatureFormChange('optional', checked)
                            }
                            label="Optional (not required for implementation)"
                          />
                        </div>
                      </div>

                      {/* Provider options */}
                      <div>
                        <div className="mb-2">
                          <Checkbox
                            id={`has-providers-${index}`}
                            checked={showProviders}
                            onCheckedChange={(checked) => setShowProviders(checked)}
                            label="This feature uses external providers"
                          />
                        </div>

                        {showProviders && (
                          <div className="mt-2">
                            <Select
                              label="Available Providers"
                              value={(featureForm.providers && featureForm.providers[0]) || ''}
                              onChange={(e) =>
                                handleFeatureFormChange(
                                  'providers',
                                  e.target.value ? [e.target.value] : []
                                )
                              }
                            >
                              <option value="">Select provider...</option>
                              <option value="Stripe">Stripe</option>
                              <option value="PayPal">PayPal</option>
                              <option value="AWS">AWS</option>
                              <option value="Azure">Azure</option>
                              <option value="GCP">Google Cloud</option>
                              <option value="Firebase">Firebase</option>
                              <option value="Custom">Custom Implementation</option>
                            </Select>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="mt-2 flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={resetFeatureForm}>
                          Cancel
                        </Button>
                        <Button type="button" variant="default" onClick={handleEditFeature}>
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || !projectId || !hasUnsavedChanges}
          variant={!projectId || isSubmitting || !hasUnsavedChanges ? 'outline' : 'default'}
          className={
            !projectId || isSubmitting || !hasUnsavedChanges
              ? 'cursor-not-allowed opacity-50'
              : 'animate-pulse'
          }
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              {hasUnsavedChanges && <Save className="mr-2 h-4 w-4" />}
              Save Features
              {hasUnsavedChanges && '*'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
