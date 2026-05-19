# Architecture Diagram Description

## Overview

The Green AI Monitor system follows a modular, layered architecture designed for scalability, maintainability, and clear separation of concerns. The architecture consists of four main layers: Presentation, Application, Domain, and Infrastructure, with additional supporting modules for specific functionalities.

## High-Level Architecture Components

### 1. Frontend Layer (Presentation)
- **Technology**: React.js
- **Components**:
  - `App.jsx`: Main application component
  - `Home.jsx`: Home page wrapper
  - `Dashboard.jsx`: Main dashboard component
  - `LiveStats.jsx`: Real-time statistics display
  - `EmissionChart.jsx`: Data visualization for emissions
  - `OptimizationTips.jsx`: Suggestions display
- **Purpose**: Provides user interface for monitoring and interacting with emission data

### 2. Backend Layer (Application)
- **Technology**: FastAPI (Python)
- **Main File**: `main.py`
- **API Endpoints**:
  - `/api/v1/tracking`: Carbon emission tracking operations
  - `/api/v1/stats`: Statistical data retrieval
  - `/api/v1/logs`: System and emission logs
  - `/api/v1/suggestions`: Optimization recommendations
- **Purpose**: Handles HTTP requests, business logic orchestration, and API responses

### 3. Services Layer (Domain)
- **Carbon Tracker Service** (`carbon_tracker.py`):
  - Uses CodeCarbon library for emission calculations
  - Manages tracking sessions for different projects
  - Provides real-time emission data
- **System Monitor Service** (`system_monitor.py`):
  - Collects hardware metrics (CPU, memory, power)
  - Correlates system usage with emissions
- **Purpose**: Core business logic for monitoring and tracking

### 4. Data Layer (Infrastructure)
- **Database**: SQLite with SQLAlchemy ORM
- **Models**:
  - `CarbonEmission`: Stores emission data
  - `SystemMetrics`: Hardware performance data
  - `Log`: Application and system logs
- **Schemas**: Pydantic models for API validation
- **Purpose**: Persistent data storage and retrieval

### 5. Chatbot Module
- **Technology**: Python with NLTK
- **Components**:
  - `bot.py`: Main chatbot interface
  - `nlp_utils.py`: Natural language processing utilities
  - `rules.py`: Rule-based response enhancement
  - `intents.json`: Predefined conversation patterns
- **Purpose**: Educational tool for carbon emission awareness

### 6. ML Workloads Module
- **Purpose**: Sample AI/ML tasks for testing emission tracking
- **Examples**:
  - BERT fine-tuning
  - LSTM training
  - ResNet training
  - YOLO object detection inference
- **Integration**: Can be monitored by the carbon tracker service

## Data Flow

1. **Emission Tracking Initiation**:
   - User/API request → Backend API → Carbon Tracker Service → CodeCarbon Library → Hardware monitoring

2. **Data Collection**:
   - System Monitor Service → Hardware sensors → Database (SystemMetrics)

3. **Real-time Updates**:
   - Services → Backend API → WebSocket/Polling → Frontend → User Dashboard

4. **Educational Interaction**:
   - User Input → Chatbot NLP → Intent Matching → Rule-based Responses → Educational Output

## Communication Patterns

- **RESTful APIs**: Between Frontend and Backend
- **Database Queries**: Backend to SQLite via SQLAlchemy
- **Service Integration**: Backend orchestrates Services via direct method calls
- **Event-driven**: Startup/Shutdown events trigger service initialization

## Deployment Architecture

- **Development**: Local setup with separate processes for backend, frontend, and chatbot
- **Production**: Containerized deployment (Docker) with reverse proxy (nginx)
- **Scalability**: Stateless backend allows horizontal scaling
- **Database**: SQLite for development; can be upgraded to PostgreSQL/MySQL for production

## Security Considerations

- CORS configuration for frontend-backend communication
- Input validation via Pydantic schemas
- No authentication implemented (can be added with OAuth/JWT)
- Database access restricted to backend services

## Extensibility Points

- **API Expansion**: New endpoints can be added via FastAPI routers
- **Service Addition**: New monitoring services can be integrated
- **Frontend Components**: Modular React components allow easy UI extensions
- **Database Migration**: SQLAlchemy supports schema evolution

This architecture provides a solid foundation for monitoring AI carbon emissions while remaining flexible for future enhancements and integrations.