"""
API routes for project templates.
"""
import logging
from fastapi import APIRouter, HTTPException, Path, Body
from typing import Dict, Any

from ...schemas.templates import ProjectTemplateResponse, ProjectTemplateList
from ...schemas.shared_schemas import TechStackData
from ...services.templates_service import TemplatesService
from ...seed.tech_registry import validate_template_tech_stack

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/", response_model=ProjectTemplateList)
async def get_templates():
    """
    Get all project templates.
    """
    try:
        templates = await TemplatesService.get_templates()
        return {"templates": templates}
    except Exception as e:
        logger.error(f"Error retrieving templates: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve templates: {str(e)}"
        )


@router.get("/{template_id}", response_model=ProjectTemplateResponse)
async def get_template_by_id(
    template_id: str = Path(..., description="The ID of the template to retrieve")
):
    """
    Get a project template by ID.
    """
    try:
        template = await TemplatesService.get_template_by_id(template_id)
        if not template:
            raise HTTPException(
                status_code=404,
                detail=f"Template with ID {template_id} not found"
            )
        return template
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving template {template_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve template: {str(e)}"
        )


@router.put("/{template_id}", response_model=ProjectTemplateResponse)
async def update_template(
    template_id: str = Path(..., description="The ID of the template to update"),
    template_data: Dict[str, Any] = Body(..., description="Updated template data")
):
    """
    Update a project template by ID.
    
    This endpoint allows for bulk updating of the entire template document.
    """
    try:
        # Validate tech stack if present
        if "techStack" in template_data:
            try:
                # Convert to TechStackData model for validation
                tech_stack = TechStackData(**template_data["techStack"])
                # Validate technologies
                validate_result = validate_template_tech_stack(tech_stack)
                if not validate_result["is_valid"]:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Invalid technologies in tech stack: {validate_result['invalid_technologies']}"
                    )
            except Exception as e:
                if isinstance(e, HTTPException):
                    raise
                logger.error(f"Error validating tech stack: {str(e)}")
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid tech stack format: {str(e)}"
                )
                
        updated_template = await TemplatesService.update_template(template_id, template_data)
        if not updated_template:
            raise HTTPException(
                status_code=404,
                detail=f"Template with ID {template_id} not found"
            )
        return updated_template
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating template {template_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update template: {str(e)}"
        ) 