import JSZip from "jszip";
import { ProjectBase } from "../../types/project";
import {
  ProjectTechStack,
  Requirements,
  Pages,
  DataModel,
  Api,
} from "../../types/templates";
import { FeaturesData } from "../featuresService";
import { generateApiEndpointsMarkdown } from "./apiEndpoints";
import { generateDataModelMarkdown } from "./dataModel";
import { generateFeaturesMarkdown } from "./features";
import { generatePagesMarkdown } from "./pages";
import { generateProjectBasicsMarkdown } from "./projectBasics";
import { generateRequirementsMarkdown } from "./requirements";
import { generateTechStackMarkdown } from "./techStack";
import { generateFileName } from "./utils";

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
 * @returns Promise that resolves to a Blob containing the zip file
 */
export async function generateMarkdownZip(
  project: ProjectBase,
  techStack: ProjectTechStack | null,
  requirements: Requirements | null,
  features: FeaturesData | null,
  pages: Pages | null,
  dataModel: Partial<DataModel> | null,
  apiEndpoints: Api | null
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

  // Generate a README file for the zip
  const readme =
    `# ${project.name} Project Specification\n\n` +
    `This archive contains markdown files for all sections of the ${project.name} project specification.\n\n` +
    `## Contents\n\n` +
    `- Project Basics\n` +
    `- Tech Stack\n` +
    `- Requirements\n` +
    `- Features\n` +
    `- Pages\n` +
    `- Data Model\n` +
    `- API Endpoints\n\n` +
    `Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;

  zip.file("README.md", readme);

  // Generate the zip file
  return await zip.generateAsync({ type: "blob" });
}
