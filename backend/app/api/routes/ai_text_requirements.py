"""
API routes for project requirements enhancement.
"""
import logging
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any

from app.ai.prompts.requirements import requirements_system_prompt_enhance
from app.schemas.ai_text import (
    RequirementsEnhanceRequest,
    RequirementsEnhanceResponse,
)
from app.services.ai_service import FAST_MODEL, AnthropicClient
from app.core.firebase_auth import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ai-text", tags=["AI Text"])

@router.post("/enhance-requirements", response_model=RequirementsEnhanceResponse)
async def enhance_requirements(
    request: RequirementsEnhanceRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Enhance project requirements using AI.
    
    This endpoint takes a project description, business goals and the user's initial requirements
    and returns improved, more focused, and actionable requirements. The AI will ensure the
    requirements align with the project description and business goals.
    """
    try:
        # Initialize the AI client
        client = AnthropicClient()
        
        # Create the system message
        system_message = requirements_system_prompt_enhance()
        
        # Format the business goals and requirements as strings
        formatted_goals = "\n".join([f"- {goal}" for goal in request.business_goals])
        formatted_requirements = "\n".join([f"- {req}" for req in request.user_requirements])
        
        # Create the user message
        user_message = (
            f"Project description: {request.project_description}\n"
            f"Business goals:\n{formatted_goals}\n"
            f"Original requirements:\n{formatted_requirements}"
        )
        
        # Generate the response
        messages = [{"role": "user", "content": user_message}]
        response = client.generate_response(messages, system_message)
        
        # Parse the response into an array of requirements
        enhanced_requirements = []
        for line in response.split("\n"):
            # Remove leading/trailing whitespace
            line = line.strip()
            # Check if line is not empty
            if line:
                # Check if the line starts with a category prefix
                if line.lower().startswith("[functional]") or line.lower().startswith("[non-functional]"):
                    enhanced_requirements.append(line)
                # Handle both bulleted and non-bulleted formats
                elif line.startswith("-") or line.startswith("•"):
                    # Remove the bullet point and any leading/trailing whitespace
                    req = line[1:].strip()
                    if req:  # Only add non-empty requirements
                        enhanced_requirements.append(req)
                # Also handle numbered lists (1., 2., etc.)
                elif line and line[0].isdigit() and line[1:].startswith(". "):
                    req = line[line.find(".")+1:].strip()
                    if req:  # Only add non-empty requirements
                        enhanced_requirements.append(req)
                # Handle non-bulleted requirements
                else:
                    enhanced_requirements.append(line)
        
        # If no requirements were extracted, try to split by newlines
        if not enhanced_requirements and response.strip():
            response_parts = response.split("\n\n")
            candidate_reqs = []
            for part in response_parts:
                candidate_reqs.extend(part.split("\n"))
            enhanced_requirements = [req.strip() for req in candidate_reqs if req.strip()]
            
            # If still no requirements, just use the entire response
            if not enhanced_requirements:
                enhanced_requirements = [response.strip()]
        
        # Return the enhanced requirements
        return RequirementsEnhanceResponse(enhanced_requirements=enhanced_requirements)
    except Exception as e:
        logger.error(f"Error enhancing requirements: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to enhance requirements: {str(e)}"
        )