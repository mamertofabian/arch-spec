import { useState } from "react";
import { Copy, Download, Check } from "lucide-react";
import { useToast } from "../../contexts/ToastContext";
import {
  ImplementationPrompts,
  ImplementationPromptType,
} from "../../types/templates";
import {
  IMPLEMENTATION_CATEGORIES,
  CATEGORY_LABELS,
  PROMPT_TYPE_LABELS,
} from "../../constants/implementationPrompts";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Spinner from "../ui/Spinner";

interface ImplementationPromptsPreviewProps {
  projectId?: string; // Making this optional since it's not used
  data?: ImplementationPrompts;
  isLoading?: boolean;
}

export default function ImplementationPromptsPreview({
  data,
  isLoading = false,
}: ImplementationPromptsPreviewProps) {
  const { showToast } = useToast();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    // Start with the first category expanded if it has prompts
    data?.data?.[IMPLEMENTATION_CATEGORIES[0]]?.length > 0
      ? IMPLEMENTATION_CATEGORIES[0]
      : null
  );
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const copyPromptToClipboard = async (content: string, promptId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedPromptId(promptId);
      showToast({
        title: "Copied",
        description: "Prompt copied to clipboard",
        type: "success",
      });
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedPromptId(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      showToast({
        title: "Error",
        description: "Failed to copy prompt to clipboard",
        type: "error",
      });
    }
  };

  const downloadAllPrompts = () => {
    try {
      if (!data) return;

      // Create a properly formatted text for download
      let content = "# IMPLEMENTATION PROMPTS\n\n";

      IMPLEMENTATION_CATEGORIES.forEach((category) => {
        if (data.data[category] && data.data[category].length > 0) {
          content += `## ${CATEGORY_LABELS[category]}\n\n`;

          // Sort prompts by type: MAIN first, then FOLLOWUP_1, then FOLLOWUP_2
          const sortedPrompts = [...data.data[category]].sort((a, b) => {
            const typeOrder = {
              [ImplementationPromptType.MAIN]: 0,
              [ImplementationPromptType.FOLLOWUP_1]: 1,
              [ImplementationPromptType.FOLLOWUP_2]: 2,
            };
            return typeOrder[a.type] - typeOrder[b.type];
          });

          sortedPrompts.forEach((prompt) => {
            content += `### ${PROMPT_TYPE_LABELS[prompt.type]}\n\n`;
            content += `${prompt.content}\n\n`;
          });

          content += "\n";
        }
      });

      // Create a blob and download link
      const blob = new Blob([content], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "implementation_prompts.md";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast({
        title: "Downloaded",
        description: "Implementation prompts downloaded successfully",
        type: "success",
      });
    } catch (err) {
      console.error("Failed to download prompts: ", err);
      showToast({
        title: "Error",
        description: "Failed to download implementation prompts",
        type: "error",
      });
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spinner size="md" />
        <span className="ml-3 text-slate-600 dark:text-slate-300">
          Loading implementation prompts...
        </span>
      </div>
    );
  }

  // If no data or empty data
  if (!data || !data.data || Object.keys(data.data).length === 0) {
    return (
      <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
        <div className="text-center py-8">
          <p className="text-slate-600 dark:text-slate-400">
            No implementation prompts defined yet.
          </p>
        </div>
      </div>
    );
  }

  // Get categories that have prompts, maintaining the original order
  const categoriesWithPrompts = IMPLEMENTATION_CATEGORIES.filter(
    (category) => data.data[category] && data.data[category].length > 0
  );

  // Count total prompts
  const totalPrompts = Object.values(data.data).reduce(
    (total, prompts) => total + prompts.length,
    0
  );

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
            Implementation Prompts
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {totalPrompts} prompt{totalPrompts !== 1 ? "s" : ""} across{" "}
            {categoriesWithPrompts.length} categor
            {categoriesWithPrompts.length !== 1 ? "ies" : "y"}
          </p>
        </div>
        <Button
          onClick={downloadAllPrompts}
          variant="outline"
          className="flex items-center gap-2"
          title="Download all prompts as a markdown file"
        >
          <Download size={16} />
          <span>Download All</span>
        </Button>
      </div>

      <div className="space-y-4">
        {categoriesWithPrompts.length > 0 ? (
          categoriesWithPrompts.map((category) => (
            <div
              key={category}
              className="border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden"
            >
              <button
                onClick={() => toggleCategory(category)}
                className={`w-full flex justify-between items-center p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                  expandedCategory === category
                    ? "bg-slate-100 dark:bg-slate-700"
                    : "bg-white dark:bg-slate-800"
                }`}
              >
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {CATEGORY_LABELS[category]}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {data.data[category].length} prompt
                  {data.data[category].length !== 1 ? "s" : ""}
                </span>
              </button>

              {expandedCategory === category && (
                <div className="p-3 space-y-3 bg-slate-50 dark:bg-slate-800">
                  {data.data[category]
                    .sort((a, b) => {
                      const typeOrder = {
                        [ImplementationPromptType.MAIN]: 0,
                        [ImplementationPromptType.FOLLOWUP_1]: 1,
                        [ImplementationPromptType.FOLLOWUP_2]: 2,
                      };
                      return typeOrder[a.type] - typeOrder[b.type];
                    })
                    .map((prompt) => (
                      <Card
                        key={prompt.id}
                        className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 p-3"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span className="inline-block px-2 py-1 text-xs rounded bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                              {PROMPT_TYPE_LABELS[prompt.type]}
                            </span>
                            {prompt.updated_at && (
                              <span className="text-xs text-slate-400 dark:text-slate-500">
                                Updated:{" "}
                                {new Date(
                                  prompt.updated_at
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyPromptToClipboard(prompt.content, prompt.id)
                            }
                            className="text-slate-500 hover:text-primary-500"
                            title="Copy prompt to clipboard"
                          >
                            {copiedPromptId === prompt.id ? (
                              <Check size={16} className="text-green-500" />
                            ) : (
                              <Copy size={16} />
                            )}
                          </Button>
                        </div>
                        <pre className="whitespace-pre-wrap text-slate-600 dark:text-slate-300 text-sm mt-2 font-sans">
                          {prompt.content}
                        </pre>
                      </Card>
                    ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-slate-500 dark:text-slate-400 py-6">
            No implementation prompts have been defined yet. Go to the edit tab
            to create some.
          </p>
        )}
      </div>
    </div>
  );
}
