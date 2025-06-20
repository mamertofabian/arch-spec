"""
API routes for documentation generation using AI.
"""

import logging
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any

from app.ai.prompts.readme import readme_system_prompt, get_readme_user_prompt
from app.ai.prompts.ai_rules import create_ai_rules_system_prompt, get_create_ai_rules_user_prompt
from app.schemas.ai_text import (
    CreateAIRulesRequest,
    CreateAIRulesResponse,
    EnhanceReadmeRequest,
    EnhanceReadmeResponse,
)
from app.services.ai_service import FAST_MODEL, AIService
from app.core.firebase_auth import get_current_user
from app.utils.llm_logging import DefaultLLMLogger
from app.db.base import db
from app.services.db_usage_tracker import DatabaseUsageTracker

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ai-text", tags=["AI Text"])


@router.post("/enhance-readme", response_model=EnhanceReadmeResponse)
async def enhance_readme(
    request: EnhanceReadmeRequest, current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Enhance project README using AI.

    This endpoint takes project information including name, description, business goals,
    requirements, features, and tech stack, and generates a comprehensive README markdown file.
    """
    try:
        # Create the service objects
        llm_logger = DefaultLLMLogger()
        usage_tracker = DatabaseUsageTracker(db.get_db())

        # Initialize the AI client with the logger and usage tracker
        client = AIService(llm_logger, usage_tracker)

        # Create the system message
        system_message = readme_system_prompt(request.additional_user_instruction)

        # Create the user message
        user_message = get_readme_user_prompt(
            request.project_name,
            request.project_description,
            request.business_goals,
            request.requirements,
            request.features,
            request.tech_stack,
            request.additional_user_instruction,
        )

        # Generate the response
        messages = [{"role": "user", "content": user_message}]
        response = await client.generate_response(
            messages,
            system_message,
            FAST_MODEL,
            log_metadata={
                "user_id": current_user.get("firebase_uid") if current_user else None,
                "project_id": request.project_id if hasattr(request, "project_id") else "unknown",
                "project_name": request.project_name,
                "project_description": request.project_description,
                "business_goals": request.business_goals,
                "requirements": request.requirements,
                "features": request.features,
                "tech_stack": request.tech_stack,
                "additional_user_instruction": request.additional_user_instruction,
            },
            response_type="enhance_readme",
            check_credits=True,
            use_token_api_for_estimation=True,
        )

        # Handle potential credit errors - check the response content if it's a dict
        if (
            isinstance(response, dict)
            and isinstance(response.get("content"), str)
            and response["content"].startswith("Insufficient credits")
        ):
            raise HTTPException(status_code=402, detail=response["content"])
        elif isinstance(response, str) and response.startswith("Insufficient credits"):
            raise HTTPException(status_code=402, detail=response)

        # Return the enhanced README
        return EnhanceReadmeResponse(enhanced_readme=response.strip())
    except Exception as e:
        logger.error(f"Error generating README: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate README: {str(e)}")


@router.post("/create-ai-rules", response_model=CreateAIRulesResponse)
async def create_ai_rules(
    request: CreateAIRulesRequest, current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Create AI rules using AI."""
    try:
        # Create the service objects
        llm_logger = DefaultLLMLogger()
        usage_tracker = DatabaseUsageTracker(db.get_db())

        # Initialize the AI client with the logger and usage tracker
        client = AIService(llm_logger, usage_tracker)

        # Create the system message
        system_message = create_ai_rules_system_prompt(request.additional_user_instruction)

        # Create the user message
        user_message = get_create_ai_rules_user_prompt(
            request.project_name,
            request.project_description,
            request.business_goals,
            request.requirements,
            request.features,
            request.tech_stack,
            request.additional_user_instruction,
        )

        # Generate the response
        messages = [{"role": "user", "content": user_message}]
        response = await client.generate_response(
            messages,
            system_message,
            FAST_MODEL,
            log_metadata={
                "user_id": current_user.get("firebase_uid") if current_user else None,
                "project_id": request.project_id if hasattr(request, "project_id") else "unknown",
                "project_name": request.project_name,
                "project_description": request.project_description,
                "business_goals": request.business_goals,
                "requirements": request.requirements,
                "features": request.features,
                "tech_stack": request.tech_stack,
                "additional_user_instruction": request.additional_user_instruction,
            },
            response_type="create_ai_rules",
            check_credits=True,
            use_token_api_for_estimation=True,
        )

        # Handle potential credit errors - check the response content if it's a dict
        if (
            isinstance(response, dict)
            and isinstance(response.get("content"), str)
            and response["content"].startswith("Insufficient credits")
        ):
            raise HTTPException(status_code=402, detail=response["content"])
        elif isinstance(response, str) and response.startswith("Insufficient credits"):
            raise HTTPException(status_code=402, detail=response)

        # Return the created AI rules
        return CreateAIRulesResponse(ai_rules=response.strip())
    except Exception as e:
        logger.error(f"Error creating AI rules: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create AI rules: {str(e)}")
