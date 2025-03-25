import JSZip from "jszip";
import { ProjectBase } from "../../types/project";
import {
  ProjectTechStack,
  Requirements,
  Pages,
  DataModel,
  Api,
  ImplementationPrompts,
  UIDesign,
} from "../../types/templates";
import { FeaturesData } from "../featuresService";
import { TestCasesData } from "../testCasesService";
import { aiService } from "../aiService";
import { generateApiEndpointsMarkdown } from "./apiEndpoints";
import { generateDataModelMarkdown } from "./dataModel";
import { generateFeaturesMarkdown } from "./features";
import { generatePagesMarkdown } from "./pages";
import { generateProjectBasicsMarkdown } from "./projectBasics";
import { generateRequirementsMarkdown } from "./requirements";
import { generateTechStackMarkdown } from "./techStack";
import { generateTestCasesMarkdown } from "./testCases";
import { generateUIDesignMarkdown } from "./uiDesign";
import { generateFileName } from "./utils";
import { generateImplementationPromptsMarkdown } from "./implementationPrompts";

/**
 * Creates a zip file containing all markdown files for a project
 *
 * @param project The project data
 * @param techStack The tech stack data
 * @param requirements The requirements data
 * @param features The features data
 * @param pages The pages data
 * @param dataModel The data model
 * @param apiEndpoints The API endpoints
 * @param testCases The test cases
 * @param implementationPrompts The implementation prompts
 * @param uiDesign The UI design data
 * @param useAIReadme Flag to use AI for README generation
 * @param aiRules Flag to use AI for rules generation
 * @param additionalInstructions Additional instructions for the README and AI rules (optional)
 * @returns Promise that resolves to a Blob containing the zip file
 */
export async function generateMarkdownZip(
  project: ProjectBase,
  techStack: ProjectTechStack | null,
  requirements: Requirements | null,
  features: FeaturesData | null,
  pages: Pages | null,
  dataModel: Partial<DataModel> | null,
  apiEndpoints: Api | null,
  testCases: TestCasesData | null,
  implementationPrompts: ImplementationPrompts | null,
  uiDesign: UIDesign | null,
  useAIReadme: boolean,
  useAIRules: boolean,
  additionalInstructions?: string
): Promise<Blob> {
  const zip = new JSZip();

  // Add each markdown file to the zip
  if (project) {
    const basicsMarkdown = generateProjectBasicsMarkdown(project);
    zip.file(generateFileName(project.name, "basics"), basicsMarkdown);
  }

  if (techStack) {
    const techStackMarkdown = generateTechStackMarkdown(techStack);
    zip.file(generateFileName(project.name, "tech-stack"), techStackMarkdown);
  }

  if (requirements) {
    const requirementsMarkdown = generateRequirementsMarkdown(requirements);
    zip.file(
      generateFileName(project.name, "requirements"),
      requirementsMarkdown
    );
  }

  if (features) {
    const featuresMarkdown = generateFeaturesMarkdown(features);
    zip.file(generateFileName(project.name, "features"), featuresMarkdown);
  }

  if (pages) {
    const pagesMarkdown = generatePagesMarkdown(pages);
    zip.file(generateFileName(project.name, "pages"), pagesMarkdown);
  }

  if (dataModel) {
    const dataModelMarkdown = generateDataModelMarkdown(dataModel);
    zip.file(generateFileName(project.name, "data-model"), dataModelMarkdown);
  }

  if (apiEndpoints) {
    const apiEndpointsMarkdown = generateApiEndpointsMarkdown(apiEndpoints);
    zip.file(
      generateFileName(project.name, "api-endpoints"),
      apiEndpointsMarkdown
    );
  }

  if (testCases) {
    const testCasesMarkdown = generateTestCasesMarkdown(testCases);
    zip.file(generateFileName(project.name, "test-cases"), testCasesMarkdown);
  }

  // UI Design markdown
  if (uiDesign) {
    const uiDesignMarkdown = generateUIDesignMarkdown(uiDesign);
    zip.file(generateFileName(project.name, "ui-design"), uiDesignMarkdown);
  }

  // Implementation Prompts markdown
  if (implementationPrompts) {
    const implementationPromptsMarkdown = generateImplementationPromptsMarkdown(
      implementationPrompts
    );
    zip.file("implementation-prompts.md", implementationPromptsMarkdown);
  }

  // Initialize readme variable
  let enhancedReadme: string | null = null;
  let readme =
    `# ${project.name} Project Specification\n\n` +
    `This archive contains markdown files for all sections of the ${project.name} project specification.\n\n` +
    `## Contents\n\n` +
    `- Project Basics\n` +
    `- Tech Stack\n` +
    `- Requirements\n` +
    `- Features\n` +
    `- Pages\n` +
    `- Data Model\n` +
    `- API Endpoints\n` +
    `- Test Cases\n` +
    `- UI Design\n\n` +
    `Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;

  try {
    if (useAIReadme) {
      // Attempt to generate an AI-enhanced README
      enhancedReadme = await aiService.enhanceReadme(
        project.name,
        project.description,
        project.business_goals || [],
        {
          functional: requirements?.functional || [],
          non_functional: requirements?.non_functional || [],
        },
        {
          coreModules: features?.coreModules || [],
          optionalModules: features?.optionalModules || [],
        },
        techStack ? { ...techStack } : {},
        additionalInstructions
      );
      // Use the AI-enhanced README if available
      if (enhancedReadme) {
        readme = enhancedReadme;
      }
    }
  } catch (error) {
    console.error("Error generating AI README:", error);
  }

  zip.file("README.md", readme);

  let aiRules = `
# Project Rules for ${project.name}

## Project Context

**Project Description:**
${project.description}

**Business Goals:**
${project.business_goals?.join("\n")}

**Requirements Overview:**
- Functional Requirements: 
  ${requirements?.functional?.map((req) => req).join("\n - ")}
- Non-Functional Requirements: 
  ${requirements?.non_functional?.map((req) => req).join("\n - ")}

**Features:**
- Core: 
  ${features?.coreModules?.map((module) => module.name).join("\n - ")}
- Optional: 
  ${features?.optionalModules?.map((module) => module.name).join("\n - ")}

**Tech Stack:**
- Frontend: ${techStack?.frontend.framework} / ${techStack?.frontend.language}
- Backend: ${techStack?.backend.type}
- Database: ${techStack?.database.type} / ${techStack?.database.system}

## AI Assistant Persona

When working on this project, the AI assistant should:

- Act as a knowledgeable developer familiar with the technology stack
- Prioritize solutions that align with the project's business goals
- Consider both functional and non-functional requirements
- Focus on delivering the core features first
- Follow established patterns in the existing codebase
- Provide clear explanations for implementation decisions

## Coding Standards

### General Guidelines
- Write clean, maintainable code
- Follow consistent naming conventions
- Include appropriate error handling
- Add comments for complex logic
- Write unit tests for new functionality

### Technology-Specific Standards
- **${techStack?.frontend.framework}**: Follow component-based architecture
- **${techStack?.backend.type}**: Implement proper separation of concerns
- **${
    techStack?.database.system
  }**: Use parameterized queries to prevent injection

---

*Note: These rules provide general guidance for AI assistance with this project. Refer to the detailed specification documents for comprehensive implementation details.*`;

  if (useAIRules) {
    // Initialize ai rules variable
    let enhancedAIRules: string | null = null;

    try {
      // Attempt to generate ai rules
      enhancedAIRules = await aiService.createAIRules(
        project.name,
        project.description,
        project.business_goals || [],
        {
          functional: requirements?.functional || [],
          non_functional: requirements?.non_functional || [],
        },
        {
          coreModules: features?.coreModules || [],
          optionalModules: features?.optionalModules || [],
        },
        techStack ? { ...techStack } : {},
        additionalInstructions
      );

      if (enhancedAIRules) {
        aiRules = enhancedAIRules;
      }
    } catch (error) {
      console.error("Error generating AI Rules:", error);
    }
  }

  zip.file(".cursorrules", aiRules);
  zip.file(".windsurfrules", aiRules);
  zip.file("CLAUDE.md", aiRules);

  // Generate the zip file
  return await zip.generateAsync({ type: "blob" });
}
