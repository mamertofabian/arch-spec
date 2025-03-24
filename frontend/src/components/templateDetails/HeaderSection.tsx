import React from "react";
import CollapsibleSection from "./CollapsibleSection";

interface HeaderSectionProps {
  businessGoals: string[];
  targetUsers: string;
  isOpen: boolean;
  onToggle: () => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  businessGoals,
  targetUsers,
  isOpen,
  onToggle,
}) => {
  return (
    <CollapsibleSection
      title="Project Details"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Business Goals
          </h4>
          {Array.isArray(businessGoals) ? (
            <ul className="list-disc pl-5 space-y-1">
              {businessGoals.map((goal, index) => (
                <li
                  key={index}
                  className="text-sm text-slate-600 dark:text-slate-400"
                >
                  {goal}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {businessGoals}
            </p>
          )}
        </div>

        <div>
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Target Users
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {targetUsers}
          </p>
        </div>
      </div>
    </CollapsibleSection>
  );
};

export default HeaderSection;
