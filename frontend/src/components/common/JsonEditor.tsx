import { useState } from "react";
import ReactJson from "@microlink/react-json-view";

interface JsonEditorProps<T extends Record<string, unknown>> {
  data: T;
  onEdit?: (edit: { updated_src: T }) => void;
  readOnly?: boolean;
  title?: string;
  className?: string;
}

/**
 * A reusable component for displaying and editing JSON data with both raw and visual views
 */
const JsonEditor = <T extends Record<string, unknown>>({
  data,
  onEdit,
  readOnly = false,
  title,
  className = "",
}: JsonEditorProps<T>) => {
  const [activeView, setActiveView] = useState<"visual" | "raw">("visual");

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-slate-200 ${className}`}
    >
      {title && (
        <div className="border-b border-slate-200 px-4 py-3">
          <h3 className="font-medium text-slate-800">{title}</h3>
        </div>
      )}

      <div className="border-b border-slate-200">
        <div className="flex">
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeView === "visual"
                ? "border-b-2 border-primary-600 text-primary-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
            onClick={() => setActiveView("visual")}
          >
            Visual Editor
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeView === "raw"
                ? "border-b-2 border-primary-600 text-primary-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
            onClick={() => setActiveView("raw")}
          >
            Raw JSON
          </button>
        </div>
      </div>

      <div className="p-4">
        {activeView === "visual" ? (
          <div
            className="overflow-auto text-left"
            style={{ maxHeight: "calc(100vh - 16rem)" }}
          >
            <ReactJson
              src={data}
              name={null}
              theme="rjv-default"
              iconStyle="circle"
              indentWidth={2}
              collapsed={false}
              collapseStringsAfterLength={50}
              enableClipboard={true}
              displayDataTypes={false}
              onEdit={!readOnly ? onEdit : undefined}
              onAdd={!readOnly ? onEdit : undefined}
              onDelete={!readOnly ? onEdit : undefined}
              style={{
                backgroundColor: "transparent",
                textAlign: "left",
                fontFamily: "monospace",
              }}
            />
          </div>
        ) : (
          <div
            className="bg-slate-900 rounded-lg p-4 overflow-auto"
            style={{ maxHeight: "calc(100vh - 16rem)" }}
          >
            <pre className="text-green-400 text-sm whitespace-pre-wrap text-left">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default JsonEditor;
