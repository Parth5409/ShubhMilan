# SoulSync Backend Documentation

SoulSync is a sophisticated matchmaking platform that combines traditional user data with AI-driven semantic analysis and astrology insights.

## Architecture Overview

The backend is built with **FastAPI**, offering high performance and automatic API documentation. It follows a modular structure to separate concerns:

- **Entry Point**: `main.py` initializes the FastAPI application, sets up middleware (CORS), and includes the various routers.
- **Core**: `core/` contains global configuration (`config.py`) and database connection logic (`db.py`).
- **Models**: `models/` defines the data structure using Pydantic. This ensures strict type checking and validation for all API inputs and outputs.
- **Routers**: `routers/` handles HTTP requests. Each router is responsible for a specific domain (e.g., `users.py`, `interests.py`, `auth.py`).
- **Services**: `services/` contains the business logic. `MongoService` handles all MongoDB operations, while `VectorService` manages semantic search in ChromaDB.
- **Utils**: `utils/` contains modular helper functions, including authentication dependencies and security routines.

---

## Data Storage

SoulSync uses a dual-database approach to provide both structured and semantic query capabilities:

### 1. MongoDB (Primary Store)
Stores all persistent data including:
- **Users**: Authentication data, basic info (name, age, city, occupation, **mobile number**), astrology details, and AI-generated bios.
- **Interests**: Tracks connection requests between users, including status (pending, accepted, declined) and personalized messages.

### 2. ChromaDB (Vector Store)
Powers the "AI Difference":
- Stores vector embeddings of user bios.
- Enables semantic matchmaking, finding partners based on values and personality rather than just keyword matching.

---

## Key Features & Endpoints

### Authentication (`/auth`)
- **Register/Login**: JWT-based authentication with bcrypt password hashing.
- Profile completion status tracking.

### User Management (`/users`)
- **Profile Updates**: Multi-step onboarding handling basic info, professional background, and AI bio enhancement.
- **Multi-step Onboarding**: Guided process to build a comprehensive digital reflection.
- **Photo Uploads**: Support for profile photos and ID verification images.

### Intelligent Matching (`/matches`)
- **Semantic Search**: Find users based on natural language queries.
- **Compatibility Scoring**: A custom algorithm that combines interest overlap, city proximity, relationship goals, and semantic similarity to provide a percentage-based compatibility match.

### Connection Workflow (`/interests`)
- **Send Interests**: Initiate connections with personalized messages.
- **Manage Requests**: Accept or decline incoming interests.
- **Contact Access**: Mobile numbers are securely revealed only when both parties have an "accepted" connection.

---

## AI & Astrology Integration

SoulSync leverages AI to create deeper connections:
- **Bio Enhancement**: Transforms raw user input into a compelling, insightful bio.
- **Astrology Generation**: Uses birth details (time, date, place) to generate sun/moon signs and personalized readings.
- **Semantic Analysis**: Analyzes user values and journeys to match beyond superficial interests.

---

## Technical Stack
- **Framework**: FastAPI (Python)
- **Primary Database**: MongoDB (Motor async driver)
- **Vector Database**: ChromaDB
- **Security**: JWT, Bcrypt
- **AI Integration**: LangChain / Google Generative AI (via vector embeddings)
