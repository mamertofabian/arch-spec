import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Loader,
  Search,
  FolderPlus,
  Filter,
  MoreVertical,
  Users,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { useProjectStore } from "../store/projectStore";

const Projects = () => {
  const navigate = useNavigate();
  const { projects, fetchProjects, isLoading, error } = useProjectStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState(projects);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProjects(projects);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredProjects(
        projects.filter(
          (project) =>
            project.name.toLowerCase().includes(query) ||
            project.description.toLowerCase().includes(query) ||
            project.domain?.toLowerCase().includes(query) ||
            project.organization?.toLowerCase().includes(query) ||
            project.business_goals.some((goal) =>
              goal.toLowerCase().includes(query)
            ) ||
            project.target_users.some((user) =>
              user.toLowerCase().includes(query)
            )
        )
      );
    }
  }, [searchQuery, projects]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300";
      case "in_progress":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
      case "completed":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      default:
        return "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-1.5"></span>
        );
      case "in_progress":
        return (
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></span>
        );
      case "completed":
        return (
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
        );
      default:
        return (
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-1.5"></span>
        );
    }
  };

  return (
    <MainLayout>
      {/* Main content container */}
      <div className="w-full h-full">
        {/* Header with title and action button */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-heading">
              Projects
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Manage your software architecture specification projects
            </p>
          </div>
          <button
            onClick={() => navigate("/new-project")}
            className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm"
          >
            <Plus size={18} />
            <span>New Project</span>
          </button>
        </div>

        {/* Search and filters bar */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full py-2 pl-10 pr-4 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600">
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Projects content */}
        <div className="w-full">
          {isLoading ? (
            <div className="flex justify-center items-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
              <Loader className="animate-spin h-8 w-8 text-primary-600 mr-3" />
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                Loading projects...
              </span>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
              <AlertCircle className="h-8 w-8 text-red-600 mr-3" />
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                Error loading projects. Please try again.
              </span>
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {getStatusDot(project.status)}
                        {project.status.replace("_", " ")}
                      </div>
                      <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
                      {project.name}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4">
                      {project.description}
                    </p>

                    {/* Project metadata */}
                    <div className="space-y-2 mb-4">
                      {project.domain && (
                        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-medium mr-2">Domain:</span>
                          {project.domain}
                        </div>
                      )}
                      {project.organization && (
                        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-medium mr-2">
                            Organization:
                          </span>
                          {project.organization}
                        </div>
                      )}
                      {project.project_lead && (
                        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                          <Users size={12} className="mr-1" />
                          <span className="font-medium mr-2">Lead:</span>
                          {project.project_lead}
                        </div>
                      )}
                      {project.functional_requirements && (
                        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                          <CheckCircle size={12} className="mr-1" />
                          <span className="font-medium mr-2">
                            Requirements:
                          </span>
                          {project.functional_requirements.length +
                            (project.non_functional_requirements?.length || 0)}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-700">
                      <span>
                        Updated{" "}
                        {new Date(project.updated_at).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                      >
                        View Project
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                <FolderPlus
                  size={24}
                  className="text-slate-400 dark:text-slate-500"
                />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                No projects yet
              </h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                Create your first project to get started building your
                architecture specifications
              </p>
              <button
                onClick={() => navigate("/new-project")}
                className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-sm flex items-center gap-2 mx-auto"
              >
                <Plus size={18} />
                Create Project
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Projects;
