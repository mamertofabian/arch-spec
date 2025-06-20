"""
API routes for tech stack compatibility.
"""

import logging
from app.seed.tech_stack import load_tech_stack_data
from fastapi import APIRouter, HTTPException

from ...db.base import db
from ...schemas.tech_stack import TechStackData

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get(
    "",
    response_model=TechStackData,
    summary="Get complete tech stack data",
    description="Retrieves the full tech stack with all technologies and compatibility information",
)
async def get_all_technology():
    """
    Retrieves the full tech stack with all technologies and compatibility information
    """
    try:
        database = db.get_db()
        if database is not None:
            result = await database.tech_stack.find_one()
            if result is not None:
                logger.info("Tech stack data retrieved from database")
                return result["data"]
            else:
                # return the tech stack data from tech_stack_data.json
                logger.info("Tech stack data not found in database, returning seed data")
                return load_tech_stack_data()
        else:
            logger.error("Database connection not available")
            raise HTTPException(status_code=500, detail="Database connection not available")
    except Exception as e:
        logger.error(f"Error getting all technology options: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error getting all technology options: {str(e)}"
        )
