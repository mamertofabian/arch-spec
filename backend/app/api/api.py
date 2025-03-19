"""API router.

This module provides the API router for the application.
"""

import logging
from fastapi import APIRouter

logger = logging.getLogger(__name__)

# Create API router
api_router = APIRouter()

# Import API routes with error handling
try:
    logger.info("Attempting to import API routes...")
    
    # Import routes one by one with error handling
    try:
        from .routes import projects
        api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
        logger.info("Projects router loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load projects router: {str(e)}")
    
    try:
        from .routes import tech_stack
        api_router.include_router(tech_stack.router, prefix="/tech-stack", tags=["tech-stack"])
        logger.info("Tech Stack router loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load tech stack router: {str(e)}")
    
    try:
        from .routes import templates
        api_router.include_router(templates.router, prefix="/templates", tags=["templates"])
        logger.info("Templates router loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load templates router: {str(e)}")
    
    try:
        from .routes import project_specs
        api_router.include_router(project_specs.router, prefix="/project-specs", tags=["project-specs"])
        logger.info("Project Specs router loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load project specs router: {str(e)}")
    
    try:
        from .routes import users
        api_router.include_router(users.router, prefix="/users", tags=["users"])
        logger.info(f"Users router loaded successfully with routes: {[route.path for route in users.router.routes]}")
    except Exception as e:
        logger.error(f"Failed to load users router: {str(e)}")
    
    try:
        from .routes import ai_text
        api_router.include_router(ai_text.router, prefix="/ai-text", tags=["ai-text"])
        logger.info("AI Text router loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load AI Text router: {str(e)}")
    
    try:
        from .endpoints import payments
        api_router.include_router(payments.router, prefix="/payments", tags=["payments"])
        logger.info("Payments router loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load Payments router: {str(e)}")
    
    try:
        from .routes import implementation_prompts
        api_router.include_router(implementation_prompts.router, prefix="/implementation-prompts", tags=["implementation-prompts"])
        logger.info("Implementation Prompts router loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load Implementation Prompts router: {str(e)}")
    
    logger.info("API routes imported successfully")
except Exception as e:
    logger.error(f"Failed to import API routes: {str(e)}") 