"""
Schemas for AI text generation.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

from .shared_schemas import ImplementationPromptType


class DescriptionEnhanceRequest(BaseModel):
    """Request model for enhancing project descriptions."""

    user_description: str = Field(
        ...,
        title="User Description",
        description="The original project description provided by the user",
        examples=["An app for tracking my daily workouts"],
    )

    additional_user_instruction: Optional[str] = Field(
        None,
        title="Additional User Instruction",
        description="Custom instructions for the AI when enhancing the description",
    )


class DescriptionEnhanceResponse(BaseModel):
    """Response model for enhanced project descriptions."""

    enhanced_description: str = Field(
        ...,
        title="Enhanced Description",
        description="The AI-enhanced project description",
    )


class BusinessGoalsEnhanceRequest(BaseModel):
    """Request model for enhancing business goals."""

    project_description: str = Field(
        ...,
        title="Project Description",
        description="The description of the project",
        examples=["A web application for tracking daily fitness workouts and nutrition"],
    )

    user_goals: List[str] = Field(
        ...,
        title="User Goals",
        description="The original business goals provided by the user",
        examples=[["Track workouts", "Monitor progress", "Share with friends"]],
    )

    additional_user_instruction: Optional[str] = Field(
        None,
        title="Additional User Instruction",
        description="Custom instructions for the AI when enhancing business goals",
    )


class BusinessGoalsEnhanceResponse(BaseModel):
    """Response model for enhanced business goals."""

    enhanced_goals: List[str] = Field(
        ...,
        title="Enhanced Goals",
        description="The AI-enhanced business goals",
    )


class TargetUsersEnhanceRequest(BaseModel):
    """Request model for enhancing target users description."""

    project_description: str = Field(
        ...,
        title="Project Description",
        description="The description of the project",
        examples=["A web application for tracking daily fitness workouts and nutrition"],
    )

    target_users: str = Field(
        ...,
        title="Target Users",
        description="The original target users description provided by the user",
        examples=["People who want to track their workouts"],
    )

    additional_user_instruction: Optional[str] = Field(
        None,
        title="Additional User Instruction",
        description="Custom instructions for the AI when enhancing target users description",
    )


class TargetUsersEnhanceResponse(BaseModel):
    """Response model for enhanced target users description."""

    enhanced_target_users: str = Field(
        ...,
        title="Enhanced Target Users",
        description="The AI-enhanced target users description",
    )


class RequirementsEnhanceRequest(BaseModel):
    """Request model for enhancing project requirements."""

    project_description: str = Field(
        ...,
        title="Project Description",
        description="The description of the project",
        examples=["A web application for tracking daily fitness workouts and nutrition"],
    )

    business_goals: List[str] = Field(
        ...,
        title="Business Goals",
        description="The business goals of the project",
        examples=[["Increase user engagement", "Generate revenue through premium subscriptions"]],
    )

    user_requirements: List[str] = Field(
        ...,
        title="User Requirements",
        description="The original requirements provided by the user",
        examples=[["Track workouts", "Monitor progress", "Share with friends"]],
    )

    additional_user_instruction: Optional[str] = Field(
        None,
        title="Additional User Instruction",
        description="Custom instructions for the AI when enhancing project requirements",
    )


class RequirementsEnhanceResponse(BaseModel):
    """Response model for enhanced project requirements."""

    enhanced_requirements: List[str] = Field(
        ...,
        title="Enhanced Requirements",
        description="The AI-enhanced project requirements",
    )


class FeaturesEnhanceRequest(BaseModel):
    """Request model for enhancing project features."""

    project_description: str = Field(
        ...,
        title="Project Description",
        description="The description of the project",
        examples=["A web application for tracking daily fitness workouts and nutrition"],
    )

    business_goals: List[str] = Field(
        ...,
        title="Business Goals",
        description="The business goals of the project",
        examples=[["Increase user engagement", "Generate revenue through premium subscriptions"]],
    )

    requirements: List[str] = Field(
        ...,
        title="Requirements",
        description="The project requirements",
        examples=[["Track workouts", "Monitor progress", "Share with friends"]],
    )

    user_features: Optional[List[Dict[str, Any]]] = Field(
        default=None,
        title="User Features",
        description="The original features provided by the user",
    )

    additional_user_instruction: Optional[str] = Field(
        None,
        title="Additional User Instruction",
        description="Custom instructions for the AI when enhancing project features",
    )


class FeatureModule(BaseModel):
    """Model for a feature module."""

    name: str = Field(
        ...,
        title="Module Name",
        description="Name of the module (e.g., Authentication, User Management)",
    )

    description: str = Field(
        ..., title="Module Description", description="Brief description of the module's purpose"
    )

    enabled: bool = Field(
        ..., title="Enabled", description="Whether this module is enabled by default"
    )

    optional: bool = Field(
        ..., title="Optional", description="Whether this module is optional or required"
    )

    providers: Optional[List[str]] = Field(
        default=None,
        title="Providers",
        description="List of service providers associated with this module, if any",
    )


class FeaturesData(BaseModel):
    """Model for features data."""

    coreModules: List[FeatureModule] = Field(
        ..., title="Core Modules", description="List of core modules in the application"
    )

    optionalModules: Optional[List[FeatureModule]] = Field(
        default=None,
        title="Optional Modules",
        description="List of optional modules that can be enabled",
    )


class FeaturesEnhanceResponse(BaseModel):
    """Response model for enhanced features."""

    data: FeaturesData = Field(
        ..., title="Features Data", description="The structured feature data organized by modules"
    )


class PageComponent(BaseModel):
    """Model for a page component."""

    name: str = Field(
        ..., title="Page Name", description="Name of the page (e.g., Landing, Dashboard)"
    )

    path: str = Field(..., title="Page Path", description="URL path for the page")

    components: List[str] = Field(
        default_factory=list,
        title="Components",
        description="List of UI components included in this page",
    )

    enabled: bool = Field(default=True, title="Enabled", description="Whether this page is enabled")


class PagesData(BaseModel):
    """Model for pages data organized by access level."""

    public: List[PageComponent] = Field(
        default_factory=list,
        title="Public Pages",
        description="List of screens accessible to unauthenticated users",
    )

    authenticated: List[PageComponent] = Field(
        default_factory=list,
        title="Authenticated Pages",
        description="List of screens accessible to logged-in users",
    )

    admin: List[PageComponent] = Field(
        default_factory=list,
        title="Admin Pages",
        description="List of screens accessible to administrators",
    )


class PagesEnhanceRequest(BaseModel):
    """Request model for enhancing application pages."""

    project_description: str = Field(
        ...,
        title="Project Description",
        description="The description of the project",
        examples=["A web application for tracking daily fitness workouts and nutrition"],
    )

    features: List[Dict[str, Any]] = Field(
        default_factory=list,
        title="Features",
        description="The project features that need UI representation",
    )

    requirements: List[str] = Field(
        default_factory=list,
        title="Requirements",
        description="The project requirements",
        examples=[["Track workouts", "Monitor progress", "Share with friends"]],
    )

    existing_pages: Optional[PagesData] = Field(
        default=None,
        title="Existing Pages",
        description="The existing pages that may need enhancement",
    )

    additional_user_instruction: Optional[str] = Field(
        None,
        title="Additional User Instruction",
        description="Custom instructions for the AI when enhancing application pages",
    )


class PagesEnhanceResponse(BaseModel):
    """Response model for enhanced pages."""

    data: PagesData = Field(
        ...,
        title="Pages Data",
        description="The structured page recommendations organized by access level",
    )


class UIDesignData(BaseModel):
    """Model for UI design data."""

    colors: Dict[str, str] = Field(
        ..., title="Colors", description="Color palette for the application"
    )

    typography: Dict[str, Any] = Field(
        ..., title="Typography", description="Typography settings for the application"
    )

    spacing: Dict[str, Any] = Field(
        ..., title="Spacing", description="Spacing system for the application"
    )

    borderRadius: Dict[str, str] = Field(
        ..., title="Border Radius", description="Border radius values for different elements"
    )

    shadows: Dict[str, str] = Field(
        ..., title="Shadows", description="Shadow values for different elements"
    )

    layout: Dict[str, Any] = Field(
        ..., title="Layout", description="Layout settings for the application"
    )

    components: Dict[str, str] = Field(
        ..., title="Components", description="Component-specific design settings"
    )

    darkMode: Dict[str, Any] = Field(..., title="Dark Mode", description="Dark mode configuration")

    animations: Dict[str, Any] = Field(
        ..., title="Animations", description="Animation and transition settings"
    )


class UIDesignEnhanceRequest(BaseModel):
    """Request model for enhancing UI design."""

    project_description: str = Field(
        ...,
        title="Project Description",
        description="The description of the project",
        examples=["A web application for tracking daily fitness workouts and nutrition"],
    )

    features: List[Dict[str, Any]] = Field(
        default_factory=list,
        title="Features",
        description="The project features that need UI representation",
    )

    requirements: List[str] = Field(
        default_factory=list,
        title="Requirements",
        description="The project requirements",
        examples=[["Track workouts", "Monitor progress", "Share with friends"]],
    )

    existing_ui_design: Optional[UIDesignData] = Field(
        default=None,
        title="Existing UI Design",
        description="The existing UI design that may need enhancement",
    )

    additional_user_instruction: Optional[str] = Field(
        None,
        title="Additional User Instruction",
        description="Custom instructions for the AI when enhancing UI design",
    )


class UIDesignEnhanceResponse(BaseModel):
    """Response model for enhanced UI design."""

    data: UIDesignData = Field(
        ..., title="UI Design Data", description="The structured UI design recommendations"
    )


class DataModelEnhanceRequest(BaseModel):
    """Request model for enhancing the data model."""

    project_description: str = Field(
        ...,
        title="Project Description",
        description="The description of the project",
        examples=["A web application for tracking daily fitness workouts and nutrition"],
    )

    business_goals: List[str] = Field(
        ...,
        title="Business Goals",
        description="The business goals of the project",
        examples=[["Increase user engagement", "Generate revenue through premium subscriptions"]],
    )

    features: List[Dict[str, Any]] = Field(
        ...,
        title="Features",
        description="The features implemented in the project",
    )

    requirements: List[str] = Field(
        ...,
        title="Requirements",
        description="The project requirements",
        examples=[["Track workouts", "Monitor progress", "Share with friends"]],
    )

    existing_data_model: Optional[Dict[str, Any]] = Field(
        default=None,
        title="Existing Data Model",
        description="The existing data model that may need enhancement",
    )

    additional_user_instruction: Optional[str] = Field(
        None,
        title="Additional User Instruction",
        description="Custom instructions for the AI when enhancing data model",
    )


class EntityField(BaseModel):
    """Model for a field in an entity."""

    name: str = Field(..., title="Field Name", description="Name of the field")

    type: str = Field(..., title="Field Type", description="Data type of the field")

    primaryKey: Optional[bool] = Field(
        default=None, title="Primary Key", description="Whether this field is a primary key"
    )

    generated: Optional[bool] = Field(
        default=None,
        title="Generated",
        description="Whether this field value is automatically generated",
    )

    unique: Optional[bool] = Field(
        default=None, title="Unique", description="Whether this field must contain unique values"
    )

    required: Optional[bool] = Field(
        default=None, title="Required", description="Whether this field is required"
    )

    default: Optional[str] = Field(
        default=None, title="Default Value", description="Default value for this field"
    )

    enum: Optional[List[str]] = Field(
        default=None, title="Enum Values", description="List of allowed values for this field"
    )


class Entity(BaseModel):
    """Model for an entity in the data model."""

    name: str = Field(..., title="Entity Name", description="Name of the entity")

    description: str = Field(
        ..., title="Entity Description", description="Brief description of the entity's purpose"
    )

    fields: List[EntityField] = Field(
        ..., title="Fields", description="List of fields/properties for this entity"
    )


class Relationship(BaseModel):
    """Model for a relationship between entities."""

    type: str = Field(
        ...,
        title="Relationship Type",
        description="Type of relationship (oneToOne, oneToMany, manyToOne, manyToMany)",
    )

    from_entity: str = Field(..., title="From Entity", description="Source entity name")

    to_entity: str = Field(..., title="To Entity", description="Target entity name")

    field: str = Field(
        ..., title="Field", description="Field name that represents the relationship"
    )

    throughTable: Optional[str] = Field(
        default=None,
        title="Through Table",
        description="Intermediate table for many-to-many relationships",
    )


class DataModel(BaseModel):
    """Model for a complete data model."""

    entities: List[Entity] = Field(
        ..., title="Entities", description="List of entities in the data model"
    )

    relationships: List[Relationship] = Field(
        default_factory=list,
        title="Relationships",
        description="List of relationships between entities",
    )


class DataModelEnhanceResponse(BaseModel):
    """Response model for enhanced data model."""

    data: DataModel = Field(
        ...,
        title="Data Model",
        description="The structured data model with entities and relationships",
    )


class ApiEndpoint(BaseModel):
    """Model for an API endpoint."""

    path: str = Field(
        ...,
        title="API Endpoint Path",
        description="The path of the API endpoint (e.g., /api/users)",
    )

    description: str = Field(
        ..., title="Description", description="Brief description of the endpoint's purpose"
    )

    methods: List[str] = Field(
        ...,
        title="HTTP Methods",
        description="HTTP methods supported by this endpoint (GET, POST, PUT, DELETE, PATCH)",
    )

    auth: bool = Field(
        ...,
        title="Authentication Required",
        description="Whether authentication is required for this endpoint",
    )

    roles: Optional[List[str]] = Field(
        default=None,
        title="Required Roles",
        description="Roles that can access this endpoint, if any",
    )


class ApiData(BaseModel):
    """Model for API endpoints data."""

    endpoints: List[ApiEndpoint] = Field(
        ..., title="API Endpoints", description="List of API endpoints"
    )


class ApiEndpointsEnhanceRequest(BaseModel):
    """Request model for enhancing API endpoints."""

    project_description: str = Field(
        ...,
        title="Project Description",
        description="The description of the project",
        examples=["A web application for tracking daily fitness workouts and nutrition"],
    )

    features: List[Dict[str, Any]] = Field(
        ...,
        title="Features",
        description="The features implemented in the project",
    )

    data_models: Dict[str, Any] = Field(
        default_factory=dict,
        title="Data Models",
        description="The data models used in the project",
    )

    requirements: List[str] = Field(
        ...,
        title="Requirements",
        description="The project requirements",
        examples=[["User authentication", "Data persistence", "Real-time updates"]],
    )

    existing_endpoints: Optional[Dict[str, Any]] = Field(
        default=None,
        title="Existing Endpoints",
        description="The existing API endpoints that may need enhancement",
    )

    additional_user_instruction: Optional[str] = Field(
        None,
        title="Additional User Instruction",
        description="Custom instructions for the AI when enhancing API endpoints",
    )


class ApiEndpointsEnhanceResponse(BaseModel):
    """Response model for enhanced API endpoints."""

    data: ApiData = Field(
        ..., title="API Endpoints Data", description="The structured API endpoints data"
    )


class TechStackEnhanceRequest(BaseModel):
    """Request model for enhancing technology stack recommendations."""

    project_description: str = Field(
        ...,
        title="Project Description",
        description="The description of the project",
        examples=["A web application for tracking daily fitness workouts and nutrition"],
    )

    project_requirements: List[str] = Field(
        ...,
        title="Project Requirements",
        description="The project requirements",
        examples=[["User authentication", "Data persistence", "Real-time updates"]],
    )

    user_preferences: Dict[str, Any] = Field(
        default_factory=dict,
        title="User Preferences",
        description="The user's existing technology preferences",
    )

    additional_user_instruction: Optional[str] = Field(
        None,
        title="Additional User Instruction",
        description="Custom instructions for the AI when enhancing technology stack recommendations",
    )


class TechStackRecommendation(BaseModel):
    """Model for technology stack recommendations."""

    frontend: Dict[str, Optional[str]] = Field(
        default_factory=dict,
        title="Frontend Technologies",
        description="Recommended frontend technologies",
    )

    backend: Dict[str, Optional[str]] = Field(
        default_factory=dict,
        title="Backend Technologies",
        description="Recommended backend technologies",
    )

    database: Dict[str, Optional[str]] = Field(
        default_factory=dict,
        title="Database Technologies",
        description="Recommended database technologies",
    )

    authentication: Dict[str, Any] = Field(
        default_factory=dict,
        title="Authentication Technologies",
        description="Recommended authentication technologies",
    )

    hosting: Dict[str, Optional[str]] = Field(
        default_factory=dict,
        title="Hosting Technologies",
        description="Recommended hosting technologies",
    )

    storage: Dict[str, Optional[str]] = Field(
        default_factory=dict,
        title="Storage Technologies",
        description="Recommended storage technologies",
    )

    deployment: Dict[str, Optional[str]] = Field(
        default_factory=dict,
        title="Deployment Technologies",
        description="Recommended deployment technologies",
    )

    overallJustification: str = Field(
        default="",
        title="Overall Justification",
        description="Brief explanation of why this tech stack is appropriate for the project",
    )


class TechStackEnhanceResponse(BaseModel):
    """Response model for enhanced technology stack recommendations."""

    data: TechStackRecommendation = Field(
        ...,
        title="Technology Stack Recommendations",
        description="AI-generated technology stack recommendations",
    )


class TestCase(BaseModel):
    """Model for an individual test case using Gherkin format."""

    feature: str = Field(
        ...,
        title="Feature",
        description="The feature being tested (e.g., User Authentication, Shopping Cart)",
    )

    title: str = Field(
        ...,
        title="Title",
        description="Title of the test case (e.g., Login with valid credentials)",
    )

    description: Optional[str] = Field(
        None, title="Description", description="Optional description of the test case"
    )

    tags: Optional[List[str]] = Field(
        None,
        title="Tags",
        description="Optional tags for categorizing the test case (e.g., smoke, regression, ui)",
    )

    scenarios: List[Dict[str, Any]] = Field(
        ...,
        title="Scenarios",
        description="List of scenarios in this test case with steps in Gherkin format",
    )


class TestCasesData(BaseModel):
    """Model for test cases data using Gherkin format."""

    testCases: List[TestCase] = Field(
        ..., title="Test Cases", description="List of test cases in Gherkin format"
    )


class TestCasesEnhanceRequest(BaseModel):
    """Request model for enhancing test cases."""

    project_description: str = Field(
        ...,
        title="Project Description",
        description="The description of the project",
        examples=["A web application for tracking daily fitness workouts and nutrition"],
    )

    requirements: List[str] = Field(
        ...,
        title="Requirements",
        description="The project requirements",
        examples=[["Users must be able to login", "Users should be able to track workouts"]],
    )

    features: List[Dict[str, Any]] = Field(
        ...,
        title="Features",
        description="The features implemented in the project",
    )

    existing_test_cases: Optional[List[Dict[str, Any]]] = Field(
        None,
        title="Existing Test Cases",
        description="Existing test cases that need enhancement",
    )

    additional_user_instruction: Optional[str] = Field(
        None,
        title="Additional User Instruction",
        description="Custom instructions for the AI when enhancing test cases",
    )


class TestCasesEnhanceResponse(BaseModel):
    """Response model for enhanced test cases."""

    data: TestCasesData = Field(
        ..., title="Test Cases Data", description="The structured test cases data"
    )


class ImplementationPromptGenerateRequest(BaseModel):
    """Request for generating implementation prompts."""

    category: str = Field(..., description="The category to generate prompts for")
    project_id: str = Field(..., description="The project ID to generate prompts for")
    prompt_type: Optional[ImplementationPromptType] = Field(
        None, description="Optional specific prompt type to generate"
    )
    additional_user_instruction: Optional[str] = Field(
        None,
        title="Additional User Instruction",
        description="Custom instructions for the AI when generating implementation prompts",
    )


class ImplementationPromptResponse(BaseModel):
    """Response containing a generated implementation prompt."""

    type: ImplementationPromptType
    content: str


class ImplementationPromptsGenerateResponse(BaseModel):
    """Response containing generated implementation prompts."""

    prompts: List[ImplementationPromptResponse]


class EnhanceReadmeRequest(BaseModel):
    """Request model for enhancing project README."""

    project_name: str = Field(
        ...,
        title="Project Name",
        description="The name of the project",
    )

    project_description: str = Field(
        ...,
        title="Project Description",
        description="The project description",
    )

    business_goals: List[str] = Field(
        ...,
        title="Business Goals",
        description="List of business goals for the project",
    )

    requirements: Dict[str, List[str]] = Field(
        ...,
        title="Requirements",
        description="Dictionary of project requirements (functional and non-functional)",
    )

    features: Dict[str, Any] = Field(
        ...,
        title="Features",
        description="Dictionary of project features (core and optional modules)",
    )

    tech_stack: Dict[str, Any] = Field(
        ...,
        title="Tech Stack",
        description="Dictionary of technology stack recommendations",
    )

    additional_user_instruction: Optional[str] = Field(
        None,
        title="Additional User Instruction",
        description="Custom instructions for the AI when enhancing project README",
    )


class EnhanceReadmeResponse(BaseModel):
    """Response model for enhanced README."""

    enhanced_readme: str = Field(
        ...,
        title="Enhanced README",
        description="The AI-enhanced README markdown content",
    )


class CreateAIRulesRequest(EnhanceReadmeRequest):
    """Request model for creating AI rules."""

    additional_user_instruction: Optional[str] = Field(
        None,
        title="Additional User Instruction",
        description="Custom instructions for the AI when creating AI rules",
    )


class CreateAIRulesResponse(BaseModel):
    """Response model for created AI rules."""

    ai_rules: str = Field(
        ...,
        title="AI Rules",
        description="The created AI rules",
    )
