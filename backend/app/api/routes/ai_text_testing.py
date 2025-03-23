"""
API routes for test cases generation using AI.
"""
import logging
import json
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any

from app.ai.tools.print_test_cases import print_test_cases_input_schema
from app.ai.prompts.test_cases import get_test_cases_user_prompt
from app.schemas.ai_text import (
    TestCasesEnhanceRequest,
    TestCasesEnhanceResponse,
    TestCasesData,
)
from app.services.ai_service import AnthropicClient, INTELLIGENT_MODEL
from app.core.firebase_auth import get_current_user
from app.api.routes.ai_text_utils import extract_data_from_response
from app.utils.llm_logging import log_llm_response

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ai-text", tags=["AI Text"])

@router.post("/enhance-test-cases", response_model=TestCasesEnhanceResponse)
async def enhance_test_cases(
    request: TestCasesEnhanceRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Enhance or generate test cases in Gherkin format.
    """
    try:
        client = AnthropicClient()
        
        # Create system message
        system_message = "You are an expert QA engineer specializing in writing Gherkin test cases for software applications."
        
        # Format requirements as string
        formatted_requirements = "\n".join(f"- {req}" for req in request.requirements)
        
        # Format features as JSON string
        formatted_features = json.dumps(request.features, indent=2)
        
        # Format existing test cases if any
        formatted_test_cases = None
        if request.existing_test_cases:
            formatted_test_cases = json.dumps(request.existing_test_cases, indent=2)
        
        # Create the user prompt
        user_prompt = get_test_cases_user_prompt(
            formatted_requirements,
            formatted_features,
            formatted_test_cases,
            request.additional_user_instruction
        )

        # Generate the tool use response
        messages = [{"role": "user", "content": user_prompt}]
        tools = [print_test_cases_input_schema()]
        response = client.get_tool_use_response(system_message, tools, messages, model=INTELLIGENT_MODEL)
        
        # Log the LLM response
        log_llm_response(
            project_id=request.project_id if hasattr(request, "project_id") else "unknown",
            response_type="enhance_test_cases",
            response=json.dumps(response),  # Convert response object to string for logging
            parsed_data=response,  # Store the structured response directly
            metadata={
                "user_id": current_user.get("uid") if current_user else None,
                "model": INTELLIGENT_MODEL,
                "system_message": system_message,
                "user_message": user_prompt,
                "tools": tools,
                "requirements": request.requirements,
                "features": request.features,
                "existing_test_cases": request.existing_test_cases,
                "additional_user_instruction": request.additional_user_instruction
            }
        )
        
        # Extract the response data
        test_cases_data = extract_data_from_response(response, TestCasesData, logger)
        
        return {"data": test_cases_data}
    except Exception as e:
        logger.error(f"Error enhancing test cases: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error enhancing test cases: {str(e)}")


@router.post("/generate-test-cases", response_model=TestCasesEnhanceResponse)
async def generate_test_cases(
    request: TestCasesEnhanceRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Generate new test cases in Gherkin format based on project requirements and features.
    This is a dedicated endpoint for creating test cases from scratch.
    """
    try:
        client = AnthropicClient()
        
        # Create system message
        system_message = "You are an expert QA engineer specializing in writing comprehensive Gherkin test cases for software applications. Focus on creating test cases that cover all functional requirements and important edge cases."
        
        # Format requirements as string
        formatted_requirements = "\n".join(f"- {req}" for req in request.requirements)
        
        # Format features as JSON string
        formatted_features = json.dumps(request.features, indent=2)
        
        # Create the user prompt - we don't pass existing test cases
        user_prompt = get_test_cases_user_prompt(
            formatted_requirements,
            formatted_features,
            None,  # No existing test cases for generation from scratch
            request.additional_user_instruction
        )
        
        # Generate the tool use response
        messages = [{"role": "user", "content": user_prompt}]
        tools = [print_test_cases_input_schema()]
        response = client.get_tool_use_response(system_message, tools, messages, model=INTELLIGENT_MODEL)
        
        # Log the LLM response
        log_llm_response(
            project_id=request.project_id if hasattr(request, "project_id") else "unknown",
            response_type="generate_test_cases",
            response=json.dumps(response),  # Convert response object to string for logging
            parsed_data=response,  # Store the structured response directly
            metadata={
                "user_id": current_user.get("uid") if current_user else None,
                "model": INTELLIGENT_MODEL,
                "system_message": system_message,
                "user_message": user_prompt,
                "tools": tools,
                "requirements": request.requirements,
                "features": request.features,
                "additional_user_instruction": request.additional_user_instruction
            }
        )
        
        # Extract the response data
        test_cases_data = extract_data_from_response(response, TestCasesData, logger)
        
        return {"data": test_cases_data}
    except Exception as e:
        logger.error(f"Error generating test cases: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating test cases: {str(e)}")