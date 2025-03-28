import { ProjectBase } from "../../types/project";
import { Clock, ArrowRight, Bookmark, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  project: ProjectBase;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  // Format the date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  // Get the project template name from metadata if available
  const getProjectType = () => {
    return "Custom project";
  };

  return (
    <div className="card p-5 hover:shadow-xl transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div className="relative group/menu">
              <button className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
            {project.name}
          </h3>
          <p className="text-slate-600 text-sm line-clamp-2 mb-3">
            {project.description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100">
        if (project.updated_at) {
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            <span>Updated {formatDate(project.updated_at as string)}</span>
          </div>
        }

        <div>
          <button className="p-1 rounded-full text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors mr-1">
            <Bookmark size={16} />
          </button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
        <div className="text-xs font-medium text-slate-500">
          {getProjectType()}
        </div>
        <Link
          to={`/projects/${project.id}`}
          className="btn btn-ghost text-primary-600 hover:bg-primary-50 flex items-center text-sm py-1.5 shadow-none"
        >
          View Project
          <ArrowRight
            size={16}
            className="ml-1 transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
