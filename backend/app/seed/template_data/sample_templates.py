# Sample project templates
from bson import ObjectId


PROJECT_TEMPLATES = [
    {
        "id": str(ObjectId()),
        "template": {
            "name": "React Web App with Supabase",
            "version": "1.0.0",
            "description": "A web application template using React for frontend and Supabase for authentication and database",
            "businessGoals": "",
            "targetUsers": "",
            "domain": "",
            "techStack": {
                "frontend": {
                    "framework": "React",
                    "language": "TypeScript",
                    "stateManagement": "Context API",
                    "uiLibrary": "Tailwind CSS",
                    "formHandling": "React Hook Form",
                    "routing": "React Router"
                },
                "backend": {
                    "type": "baas",
                    "service": "Supabase",
                    "functions": "Edge Functions",
                    "realtime": "Supabase Realtime"
                },
                "database": {
                    "type": "sql",
                    "system": "PostgreSQL",
                    "hosting": "Supabase",
                },
                "authentication": {
                    "provider": "Supabase Auth",
                    "methods": ["Email/Password", "Google", "GitHub"]
                },
                "hosting": {
                    "frontend": "Vercel",
                    "backend": "Supabase",
                    "database": "Supabase"
                },
                "storage": {
                    "type": "objectStorage",
                    "service": "Supabase Storage"
                },
                "deployment": {
                    "ci_cd": "GitHub Actions",
                }
            },
            "requirements": {
                "functional": [
                    "User Authentication System: Implement comprehensive authentication flows including registration, login, password reset, and social logins (Google, GitHub) through Supabase Auth. The system should maintain session state and handle token refresh automatically.",
                    "Role-Based Access Control: Provide differentiated access levels for regular users and administrators. Admin users should have access to user management functionalities and system settings, while regular users should only access their own data and profile.",
                    "Data Management Operations: Support complete CRUD operations for application items, with appropriate validation, error handling, and real-time updates. Items should be user-scoped to ensure data privacy.",
                    "User Profile Management: Allow users to view and update their profile information, including personal details, preferences, and account settings. Profile changes should be persisted to the database immediately.",
                    "Admin Dashboard & Analytics: Provide administrators with a dashboard showing key metrics, user statistics, and system health indicators. Include user management tools with the ability to view, edit, and manage user accounts."
                ],
                "non_functional": [
                  "Security: Implement proper authentication mechanisms, data encryption, protection against common web vulnerabilities (XSS, CSRF, SQL injection), and secure API access. Follow security best practices for handling user data and credentials.",
                  "Performance: Ensure application responsiveness with page load times under 2 seconds, efficient database queries, and optimized frontend rendering. Implement caching strategies for frequently accessed data.",
                  "Usability & Accessibility: Create a responsive interface that works across desktop and mobile devices. Follow WCAG 2.1 AA standards for accessibility, ensuring the application is usable by people with various disabilities.",
                  "Scalability: Design the application to handle increasing user loads without performance degradation. Implement database indexing strategies and optimize query patterns for large datasets.",
                  "Maintainability: Structure code with clear organization, consistent naming conventions, and comprehensive documentation. Implement testing at unit, integration, and E2E levels to ensure code quality and facilitate future changes."
                ]
            },
            "features": {
                "coreModules": [
                    {
                        "name": "Authentication",
                        "description": "User registration, login, password reset, profile management",
                        "enabled": True
                    },
                    {
                        "name": "User Management",
                        "description": "User roles, permissions, and account administration",
                        "enabled": True
                    },
                    {
                        "name": "Data Management",
                        "description": "CRUD operations for application data",
                        "enabled": True
                    },
                    {
                        "name": "Notifications",
                        "description": "In-app notifications and email alerts",
                        "enabled": False,
                        "optional": True
                    },
                    {
                        "name": "Reports & Analytics",
                        "description": "Data visualization and reporting capabilities",
                        "enabled": False,
                        "optional": True
                    },
                    {
                        "name": "Payment Processing",
                        "description": "Integration with payment gateways",
                        "enabled": False,
                        "optional": True,
                        "providers": ["Stripe", "PayPal"]
                    }
                ]
            },
            "pages": {
                "public": [
                    {
                        "name": "Landing",
                        "path": "/",
                        "components": ["Hero", "Features", "Pricing", "Footer"],
                        "enabled": True
                    },
                    {
                        "name": "Login",
                        "path": "/login",
                        "components": ["LoginForm", "SocialLogin"],
                        "enabled": True
                    },
                    {
                        "name": "Register",
                        "path": "/register",
                        "components": ["RegistrationForm", "SocialLogin"],
                        "enabled": True
                    },
                    {
                        "name": "ForgotPassword",
                        "path": "/forgot-password",
                        "components": ["PasswordResetForm"],
                        "enabled": True
                    }
                ],
                "authenticated": [
                    {
                        "name": "Dashboard",
                        "path": "/dashboard",
                        "components": ["Summary", "RecentActivity", "QuickActions"],
                        "enabled": True
                    },
                    {
                        "name": "Profile",
                        "path": "/profile",
                        "components": ["UserInfo", "ProfileForm", "SecuritySettings"],
                        "enabled": True
                    },
                    {
                        "name": "Settings",
                        "path": "/settings",
                        "components": ["AppSettings", "Preferences", "Notifications"],
                        "enabled": True
                    }
                ],
                "admin": [
                    {
                        "name": "AdminDashboard",
                        "path": "/admin",
                        "components": ["Stats", "UserManagement", "ContentManagement"],
                        "enabled": True
                    },
                    {
                        "name": "UserManagement",
                        "path": "/admin/users",
                        "components": ["UserTable", "UserDetails", "UserEdit"],
                        "enabled": True
                    },
                    {
                        "name": "SystemSettings",
                        "path": "/admin/settings",
                        "components": ["GlobalSettings", "SecurityControls"],
                        "enabled": True
                    }
                ]
            },
            "dataModel": {
                "entities": [
                    {
                        "name": "User",
                        "description": "Application user information",
                        "fields": [
                            {
                                "name": "id",
                                "type": "uuid",
                                "primaryKey": True,
                                "generated": True
                            },
                            {
                                "name": "email",
                                "type": "string",
                                "unique": True,
                                "required": True
                            },
                            {
                                "name": "full_name",
                                "type": "string"
                            },
                            {
                                "name": "avatar_url",
                                "type": "string"
                            },
                            {
                                "name": "role",
                                "type": "string",
                                "enum": ["user", "admin"],
                                "default": "user"
                            },
                            {
                                "name": "created_at",
                                "type": "timestamp",
                                "default": "now()"
                            },
                            {
                                "name": "updated_at",
                                "type": "timestamp",
                                "default": "now()"
                            }
                        ]
                    },
                    {
                        "name": "Profile",
                        "description": "Extended user profile information",
                        "fields": [
                            {
                                "name": "id",
                                "type": "uuid",
                                "primaryKey": True,
                                "generated": True
                            },
                            {
                                "name": "user_id",
                                "type": "uuid",
                                "foreignKey": {
                                    "table": "User",
                                    "field": "id",
                                    "onDelete": "CASCADE"
                                }
                            },
                            {
                                "name": "bio",
                                "type": "text"
                            },
                            {
                                "name": "preferences",
                                "type": "jsonb"
                            },
                            {
                                "name": "created_at",
                                "type": "timestamp",
                                "default": "now()"
                            },
                            {
                                "name": "updated_at",
                                "type": "timestamp",
                                "default": "now()"
                            }
                        ]
                    },
                    {
                        "name": "Item",
                        "description": "Generic data item (customize based on app needs)",
                        "fields": [
                            {
                                "name": "id",
                                "type": "uuid",
                                "primaryKey": True,
                                "generated": True
                            },
                            {
                                "name": "user_id",
                                "type": "uuid",
                                "foreignKey": {
                                    "table": "User",
                                    "field": "id",
                                    "onDelete": "CASCADE"
                                }
                            },
                            {
                                "name": "title",
                                "type": "string",
                                "required": True
                            },
                            {
                                "name": "description",
                                "type": "text"
                            },
                            {
                                "name": "amount",
                                "type": "decimal",
                                "default": 0
                            },
                            {
                                "name": "date",
                                "type": "date",
                                "default": "now()"
                            },
                            {
                                "name": "category",
                                "type": "string"
                            },
                            {
                                "name": "status",
                                "type": "string",
                                "enum": ["active", "archived", "deleted"],
                                "default": "active"
                            },
                            {
                                "name": "metadata",
                                "type": "jsonb"
                            },
                            {
                                "name": "created_at",
                                "type": "timestamp",
                                "default": "now()"
                            },
                            {
                                "name": "updated_at",
                                "type": "timestamp",
                                "default": "now()"
                            }
                        ]
                    }
                ],
                "relationships": [
                    {
                        "type": "oneToOne",
                        "from": "User",
                        "to": "Profile",
                        "field": "user_id"
                    },
                    {
                        "type": "oneToMany",
                        "from": "User",
                        "to": "Item",
                        "field": "user_id"
                    }
                ]
            },
            "api": {
                "endpoints": [
                    {
                        "path": "/api/auth",
                        "description": "Authentication endpoints (handled by Supabase)",
                        "methods": ["POST", "GET"],
                        "auth": False
                    },
                    {
                        "path": "/api/users",
                        "description": "User management",
                        "methods": ["GET", "POST", "PUT", "DELETE"],
                        "auth": True,
                        "roles": ["admin"]
                    },
                    {
                        "path": "/api/users/me",
                        "description": "Current user profile",
                        "methods": ["GET", "PUT"],
                        "auth": True
                    },
                    {
                        "path": "/api/items",
                        "description": "Item management",
                        "methods": ["GET", "POST", "PUT", "DELETE"],
                        "auth": True
                    }
                ]
            },
            "testing": {
                "unit": {
                    "framework": "Jest",
                    "coverage": 80,
                    "directories": [
                        "components",
                        "hooks",
                        "utils"
                    ]
                },
                "integration": {
                    "framework": "React Testing Library",
                    "coverage": 70,
                    "focus": [
                        "Form submissions",
                        "Authentication flows",
                        "Data fetching"
                    ]
                },
                "e2e": {
                    "framework": "Cypress",
                    "coverage": 50,
                    "scenarios": [
                        "User registration",
                        "Login and logout",
                        "Basic CRUD operations",
                        "Admin workflows"
                    ]
                }
            },
            "projectStructure": {
                "frontend": {
                    "directories": [
                        "src/components",
                        "src/hooks",
                        "src/context",
                        "src/pages",
                        "src/utils",
                        "src/api",
                        "src/styles",
                        "src/types",
                        "src/tests"
                    ],
                    "files": [
                        "src/App.tsx",
                        "src/index.tsx",
                        "src/routes.tsx",
                        "src/supabaseClient.ts",
                        "src/types/index.d.ts"
                    ]
                }
            },
            "deployment": {
                "environments": [
                    {
                        "name": "Development",
                        "url": "${PROJECT_NAME}-dev.vercel.app",
                        "variables": [
                            {
                                "name": "REACT_APP_SUPABASE_URL",
                                "value": "https://your-project.supabase.co",
                                "secret": True
                            },
                            {
                                "name": "REACT_APP_SUPABASE_ANON_KEY",
                                "value": "",
                                "secret": True
                            }
                        ]
                    },
                    {
                        "name": "Production",
                        "url": "${PROJECT_NAME}.vercel.app",
                        "variables": [
                            {
                                "name": "REACT_APP_SUPABASE_URL",
                                "value": "https://your-project.supabase.co",
                                "secret": True
                            },
                            {
                                "name": "REACT_APP_SUPABASE_ANON_KEY",
                                "value": "",
                                "secret": True
                            }
                        ]
                    }
                ],
                "cicd": {
                    "provider": "GitHub Actions",
                    "steps": [
                        "Install dependencies",
                        "Run tests",
                        "Build application",
                        "Deploy to environment"
                    ]
                }
            },
            "documentation": {
                "sections": [
                    "Overview",
                    "Architecture",
                    "Data Model",
                    "API Reference",
                    "UI Components",
                    "Authentication",
                    "Deployment",
                    "Testing"
                ],
                "diagrams": [
                    {
                        "name": "Architecture Diagram",
                        "type": "mermaid",
                        "template": "flowchart TD\n  User[User] --> Frontend[React Frontend]\n  Frontend --> Supabase[Supabase]\n  Supabase --> Auth[Authentication]\n  Supabase --> DB[PostgreSQL Database]\n  Frontend --> API[API Layer]\n  API --> DB"
                    },
                    {
                        "name": "Entity Relationship",
                        "type": "mermaid",
                        "template": "erDiagram\n  USER ||--o{ ITEM : creates\n  USER ||--|| PROFILE : has"
                    },
                    {
                        "name": "Authentication Flow",
                        "type": "mermaid",
                        "template": "sequenceDiagram\n  participant User\n  participant Frontend\n  participant SupabaseAuth\n  participant Database\n  User->>Frontend: Login with credentials\n  Frontend->>SupabaseAuth: Authenticate\n  SupabaseAuth-->>Frontend: Return JWT\n  Frontend->>Database: Access with JWT\n  Database-->>Frontend: Return data"
                    }
                ]
            }
        }
    },
]
