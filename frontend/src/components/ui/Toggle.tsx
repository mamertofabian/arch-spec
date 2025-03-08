import { Switch } from '@headlessui/react';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const Toggle = ({
  enabled,
  onChange,
  label,
  description,
  size = 'md',
  disabled = false,
}: ToggleProps) => {
  // Size classes
  const sizeClasses = {
    sm: 'h-5 w-9',
    md: 'h-6 w-11',
    lg: 'h-7 w-14',
  };

  const thumbSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const translateClasses = {
    sm: 'translate-x-4',
    md: 'translate-x-5',
    lg: 'translate-x-7',
  };

  return (
    <Switch.Group>
      <div className="flex items-center">
        {label && (
          <div className="mr-4">
            <Switch.Label className="text-sm font-medium text-gray-700">
              {label}
            </Switch.Label>
            {description && (
              <p className="text-xs text-gray-500">{description}</p>
            )}
          </div>
        )}
        <Switch
          checked={enabled}
          onChange={onChange}
          disabled={disabled}
          className={`${enabled ? 'bg-blue-600' : 'bg-gray-200'}
            ${sizeClasses[size]}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            relative inline-flex shrink-0 border-2 border-transparent rounded-full
            transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2
            focus:ring-offset-2 focus:ring-blue-500`}
        >
          <span
            className={`${enabled ? translateClasses[size] : 'translate-x-0'}
              ${thumbSizeClasses[size]}
              pointer-events-none inline-block rounded-full bg-white shadow
              transform ring-0 transition ease-in-out duration-200`}
          />
        </Switch>
      </div>
    </Switch.Group>
  );
};

export default Toggle;
