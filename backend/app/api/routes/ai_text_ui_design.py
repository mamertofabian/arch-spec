"""
API routes for UI design enhancement using AI.
"""
import logging
import json
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any

from app.ai.tools.print_ui_design import print_ui_design_input_schema
from app.ai.prompts.ui_design import get_ui_design_user_prompt
from app.schemas.ai_text import (
    UIDesignEnhanceRequest,
    UIDesignEnhanceResponse,
    UIDesignData,
)
from app.services.ai_service import AnthropicClient, INTELLIGENT_MODEL
from app.core.firebase_auth import get_current_user
from app.api.routes.ai_text_utils import extract_data_from_response
from app.utils.llm_logging import log_llm_response

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ai-text", tags=["AI Text"])

@router.post("/enhance-ui-design", response_model=UIDesignEnhanceResponse)
async def enhance_ui_design(
    request: UIDesignEnhanceRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Enhance UI design using AI with function calling.
    
    This endpoint takes a project description, features, requirements, and optionally
    existing UI design, and returns an improved, structured UI design system.
    It uses Anthropic's tool use feature to ensure a structured response.
    """
    try:
        # Initialize the AI client
        client = AnthropicClient()
        
        # Create the system message
        system_message = (
            "You are a UI/UX designer generating UI design system recommendations for a software project. "
            "Based on the project description, features, and requirements, recommend a cohesive UI design system "
            "with colors, typography, spacing, and other visual elements."
        )
        
        # Format features and requirements as strings
        formatted_features = "None provided"
        if request.features and len(request.features) > 0:
            formatted_features = json.dumps(request.features, indent=2)
            
        formatted_requirements = "\n".join([f"- {req}" for req in request.requirements])
        
        # Format existing UI design if provided
        formatted_existing_ui_design = "None provided"
        if request.existing_ui_design:
            formatted_existing_ui_design = json.dumps(request.existing_ui_design.dict(), indent=2)
        
        # Create the user message
        user_prompt = get_ui_design_user_prompt(request.project_description, formatted_features, formatted_requirements, formatted_existing_ui_design)
        
        # Generate the tool use response
        messages = [{"role": "user", "content": user_prompt}]
        tools = [print_ui_design_input_schema()]
        response = client.get_tool_use_response(system_message, tools, messages, model=INTELLIGENT_MODEL)
        
        # Log the LLM response
        log_llm_response(
            project_id=request.project_id if hasattr(request, "project_id") else "unknown",
            response_type="enhance_ui_design",
            response=json.dumps(response),  # Convert response object to string for logging
            parsed_data=response,  # Store the structured response directly
            metadata={
                "user_id": current_user.get("uid") if current_user else None,
                "model": INTELLIGENT_MODEL,
                "system_message": system_message,
                "user_message": user_prompt,
                "tools": tools,
                "project_description": request.project_description,
                "features": request.features,
                "requirements": request.requirements,
                "existing_ui_design": request.existing_ui_design.dict() if request.existing_ui_design else None
            }
        )
        
        if "error" in response:
            logger.error(f"Error in AI tool use: {response['error']}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to generate UI design: {response['error']}"
            )
            
        # Extract UI design data with fallback mechanisms
        ui_design_data = extract_data_from_response(response, UIDesignData, logger)
            
        # Return the enhanced UI design
        return UIDesignEnhanceResponse(data=ui_design_data)
    except Exception as e:
        logger.error(f"Error enhancing UI design: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to enhance UI design: {str(e)}"
        ) 