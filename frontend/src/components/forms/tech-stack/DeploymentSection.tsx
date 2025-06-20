import { UseFormRegister, Control, UseFormSetValue } from 'react-hook-form';
import { TechStackFormData } from './techStackSchema';
import { useEffect, useRef } from 'react';
import { ProjectTechStack } from '../../../types/templates';

// Import shadcn UI components
import { Label } from '../../ui/label';
import { Select } from '../../ui/select';

interface DeploymentSectionProps {
  register: UseFormRegister<TechStackFormData>;
  deploymentCICDOptions: string[];
  deploymentContainerizationOptions: string[];
  control: Control<TechStackFormData>;
  setValue: UseFormSetValue<TechStackFormData>;
  initialData?: ProjectTechStack;
}

const DeploymentSection = ({
  register,
  deploymentCICDOptions,
  deploymentContainerizationOptions,
  setValue,
  initialData,
}: DeploymentSectionProps) => {
  // Create a ref to track whether we've applied initial data
  const initialDataAppliedRef = useRef<boolean>(false);

  // Reset form values if templateId is null
  useEffect(() => {
    if (!initialData) {
      setValue('deployment_ci_cd', '', { shouldDirty: false });
      setValue('deployment_containerization', '', { shouldDirty: false });
    }
  }, [initialData, setValue]);

  // Set initial values if they exist
  useEffect(() => {
    if (!initialData || !initialData.deployment) return;

    console.log('Checking initial data for deployment section:', initialData.deployment);

    // Track values that were successfully set
    let valuesWereSet = false;

    // Check and set CI/CD
    if (initialData.deployment.ci_cd) {
      setValue('deployment_ci_cd', initialData.deployment.ci_cd, {
        shouldDirty: true,
      });
      console.log('Setting initial deployment CI/CD:', initialData.deployment.ci_cd);
      valuesWereSet = true;
    }

    // Check and set containerization
    if (initialData.deployment.containerization) {
      setValue('deployment_containerization', initialData.deployment.containerization, {
        shouldDirty: true,
      });
      console.log(
        'Setting initial deployment containerization:',
        initialData.deployment.containerization
      );
      valuesWereSet = true;
    }

    // Mark as applied if any values were set
    if (valuesWereSet) {
      initialDataAppliedRef.current = true;
    }
  }, [initialData, setValue]);

  return (
    <div>
      <h3 className="mb-4 text-lg font-medium text-slate-800 dark:text-slate-100">Deployment</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="deployment_ci_cd">CI/CD</Label>
          <Select id="deployment_ci_cd" {...register('deployment_ci_cd')}>
            <option value="">Select CI/CD</option>
            {deploymentCICDOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="deployment_containerization">Containerization</Label>
          <Select id="deployment_containerization" {...register('deployment_containerization')}>
            <option value="">Select Containerization</option>
            {deploymentContainerizationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
};

export default DeploymentSection;
