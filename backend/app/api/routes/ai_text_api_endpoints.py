"""
API routes for API endpoints enhancement using AI.
"""
import logging
import json
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any

from app.ai.tools.print_api_endpoints import print_api_endpoints_input_schema
from app.ai.prompts.api_endpoints import get_api_endpoints_user_prompt
from app.schemas.ai_text import (
    ApiEndpointsEnhanceRequest,
    ApiEndpointsEnhanceResponse,
    ApiData,
)
from app.services.ai_service import AnthropicClient, INTELLIGENT_MODEL
from app.core.firebase_auth import get_current_user
from app.api.routes.ai_text_utils import extract_data_from_response
from app.utils.llm_logging import log_llm_response

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ai-text", tags=["AI Text"])

@router.post("/enhance-api-endpoints", response_model=ApiEndpointsEnhanceResponse)
async def enhance_api_endpoints(
    request: ApiEndpointsEnhanceRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Enhance API endpoints using AI with function calling.
    
    This endpoint takes a project description, features, data models, requirements, and optionally
    existing API endpoints, and returns an improved, structured API endpoints specification.
    It uses Anthropic's tool use feature to ensure a structured response.
    """
    try:
        # Initialize the AI client
        client = AnthropicClient()
        
        # Create the system message
        system_message = (
            "You are an API designer creating RESTful endpoints for a software project. "
            "Design a comprehensive API based on the project specifications."
        )
        
        # Format the features, data models, and requirements as strings
        formatted_features = "None provided"
        if request.features and len(request.features) > 0:
            formatted_features = json.dumps(request.features, indent=2)
            
        formatted_data_models = "None provided"
        if request.data_models and len(request.data_models) > 0:
            formatted_data_models = json.dumps(request.data_models, indent=2)
            
        formatted_requirements = "\n".join([f"- {req}" for req in request.requirements])
        
        # Create the user message
        user_prompt = get_api_endpoints_user_prompt(
            request.project_description, 
            formatted_features, 
            formatted_data_models, 
            formatted_requirements,
            request.additional_user_instruction
        )

        # Generate the tool use response
        messages = [{"role": "user", "content": user_prompt}]
        tools = [print_api_endpoints_input_schema()]
        response = client.get_tool_use_response(system_message, tools, messages, model=INTELLIGENT_MODEL)
        
        # Log the LLM response
        log_llm_response(
            project_id=request.project_id if hasattr(request, "project_id") else "unknown",
            response_type="enhance_api_endpoints",
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
                "data_models": request.data_models,
                "requirements": request.requirements,
                "additional_user_instruction": request.additional_user_instruction
            }
        )
        
        if "error" in response:
            logger.error(f"Error in AI tool use: {response['error']}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to generate API endpoints: {response['error']}"
            )
            
        # Extract API endpoints data with fallback mechanisms
        api_endpoints_data = extract_data_from_response(response, ApiData, logger)
            
        # Return the enhanced API endpoints
        return ApiEndpointsEnhanceResponse(data=api_endpoints_data)
    except Exception as e:
        logger.error(f"Error enhancing API endpoints: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to enhance API endpoints: {str(e)}"
        ) 