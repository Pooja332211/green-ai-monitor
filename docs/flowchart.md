# Process Flowchart Description

## Overview

The Green AI Monitor system operates through a series of interconnected processes that handle carbon emission tracking, data collection, visualization, and user interaction. This document describes the key workflows and decision points in the system.

## Main System Workflow

### 1. System Initialization
```
Start Application
    ↓
FastAPI Server Starts
    ↓
CORS Middleware Configured
    ↓
Database Tables Created (SQLAlchemy)
    ↓
Services Initialized:
    - Carbon Tracker Service
    - System Monitor Service
    ↓
API Routers Registered
    ↓
Application Ready for Requests
```

### 2. Carbon Emission Tracking Workflow
```
User/API Request to Start Tracking
    ↓
Validate Project Name
    ↓
Carbon Tracker Service:
    - Initialize CodeCarbon EmissionsTracker
    - Start tracking with project name
    - Record start time
    ↓
System Monitor Service:
    - Begin collecting hardware metrics
    - CPU, Memory, Power consumption
    ↓
Tracking Active:
    - Continuous emission calculation
    - Real-time metric collection
    - Data buffered in memory
    ↓
Stop Tracking Request
    ↓
Calculate Final Emissions
    ↓
Store Data in Database:
    - CarbonEmission record
    - SystemMetrics records
    - Log entry
    ↓
Return Summary (emissions, duration, project)
```

### 3. Frontend Dashboard Workflow
```
User Opens Dashboard
    ↓
React App Loads
    ↓
Dashboard Component Mounts
    ↓
Parallel Data Fetching:
    ├── API Call: /api/v1/stats (emission statistics)
    ├── API Call: /api/v1/logs (recent logs)
    └── API Call: /api/v1/suggestions (optimization tips)
    ↓
Components Render:
    ├── LiveStats: Display current metrics
    ├── EmissionChart: Visualize historical data
    └── OptimizationTips: Show recommendations
    ↓
Real-time Updates (Polling/WebSocket)
    ↓
UI Updates with New Data
```

### 4. Chatbot Interaction Workflow
```
User Input Received
    ↓
Text Preprocessing (nlp_utils.py):
    - Tokenization
    - Lowercasing
    - Stop word removal
    ↓
Intent Matching:
    - Compare against intents.json patterns
    - Calculate similarity scores
    ↓
Best Intent Selected
    ↓
Rule-based Enhancement (rules.py):
    - Apply contextual rules
    - Add AI-specific considerations
    ↓
Response Generated
    ↓
Output to User
```

### 5. API Request Processing Workflow
```
HTTP Request Received
    ↓
FastAPI Routing
    ↓
Request Validation (Pydantic Schemas)
    ↓
Business Logic Execution:
    ├── Tracking API: Call Carbon Tracker Service
    ├── Stats API: Query Database for aggregated data
    ├── Logs API: Retrieve log entries
    └── Suggestions API: Generate optimization tips
    ↓
Database Operations (if needed)
    ↓
Response Formatting
    ↓
HTTP Response Sent
```

### 6. Data Storage and Retrieval
```
Data Collection Event
    ↓
Validate Data Integrity
    ↓
SQLAlchemy Model Creation
    ↓
Database Transaction:
    - Insert/Update records
    - Handle relationships
    ↓
Commit Transaction
    ↓
Log Operation Success/Failure
```

### 7. Error Handling and Logging
```
Error Occurs
    ↓
Exception Caught
    ↓
Log Error Details:
    - Timestamp
    - Error type
    - Context information
    ↓
Determine Error Type:
    ├── Validation Error → Return 400 Bad Request
    ├── Database Error → Return 500 Internal Server Error
    ├── Service Error → Return 503 Service Unavailable
    └── Unknown Error → Return 500 Internal Server Error
    ↓
Return Error Response with Details
```

### 8. ML Workload Integration
```
ML Training/Inference Starts
    ↓
Carbon Tracking Initiated (via API or direct call)
    ↓
ML Process Executes:
    - Model loading
    - Data processing
    - Training/Inference loops
    ↓
System Resources Monitored
    ↓
Emissions Calculated Continuously
    ↓
ML Process Completes
    ↓
Tracking Stopped
    ↓
Results Stored and Reported
```

## Decision Points

- **Tracking Status**: Is tracking already active? (Prevents multiple concurrent sessions)
- **Data Availability**: Are there sufficient data points for statistics? (Fallback to defaults)
- **Intent Confidence**: Is the chatbot intent match above threshold? (Fallback to default response)
- **Resource Limits**: Are system resources within acceptable ranges? (Trigger warnings)
- **Database Connection**: Is database accessible? (Graceful degradation)

## Asynchronous Operations

- **Background Monitoring**: System metrics collected in separate threads
- **Real-time Updates**: Frontend polling for live data
- **Event-driven Services**: Startup/shutdown events trigger service lifecycle

## Performance Considerations

- **Caching**: Frequently accessed data cached in memory
- **Batch Operations**: Database writes batched for efficiency
- **Lazy Loading**: Large datasets loaded on demand
- **Connection Pooling**: Database connections managed efficiently

This flowchart represents the core processes of the Green AI Monitor system, highlighting the interconnected nature of its components and the flow of data through the application.