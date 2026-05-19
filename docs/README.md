# Green AI Monitor Documentation

## Overview

Green AI Monitor is a comprehensive system for tracking and monitoring carbon emissions from Artificial Intelligence and Machine Learning workloads. This documentation provides detailed information about the project's architecture, implementation, and usage.

## Table of Contents

- [Synopsis](synopsis.md) - Project overview and objectives
- [Architecture Diagram](architecture_diagram.md) - System architecture description
- [Flowchart](flowchart.md) - Process flow documentation
- [IEEE Paper](ieee_paper.md) - Research paper template
- [Viva Questions](viva_questions.md) - Questions for viva voce examination

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 14+
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd green-ai-monitor
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend:**
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```

2. **Start the Frontend:**
   ```bash
   cd frontend
   npm start
   ```

3. **Access the Dashboard:**
   Open http://localhost:3000 in your browser

## Project Structure

```
green-ai-monitor/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic services
│   │   └── main.py         # Application entry point
│   └── requirements.txt    # Python dependencies
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   └── services/       # API service functions
│   └── package.json        # Node dependencies
├── chatbot/                 # Educational chatbot
│   ├── bot.py              # Main chatbot script
│   ├── intents.json        # Conversation intents
│   └── nlp_utils.py        # NLP utilities
├── ml_workloads/            # Sample AI workloads
│   ├── bert/               # BERT fine-tuning
│   ├── lstm/               # LSTM training
│   ├── resnet/             # ResNet training
│   └── yolov5/             # YOLO inference
├── database/                # Database files and schema
├── docs/                    # Documentation
└── scripts/                 # Utility scripts
```

## Key Features

### Real-time Emission Tracking
- Uses CodeCarbon library for accurate CO2 emission calculations
- Tracks emissions based on hardware power consumption and energy sources
- Supports multiple concurrent projects

### System Monitoring
- Monitors CPU, memory, and power usage
- Correlates system metrics with emission data
- Provides hardware performance insights

### Interactive Dashboard
- Real-time visualization of emission data
- Historical charts and trends
- Live statistics display
- Optimization recommendations

### Educational Chatbot
- Answers questions about carbon emissions
- Provides AI-specific sustainability advice
- Uses NLP for natural conversation

### RESTful API
- Comprehensive API for all system functions
- Well-documented endpoints with automatic OpenAPI docs
- CORS-enabled for frontend integration

## API Documentation

The backend provides a complete REST API with the following endpoints:

- `GET /` - API root
- `POST /api/v1/tracking/start` - Start emission tracking
- `POST /api/v1/tracking/stop` - Stop emission tracking
- `GET /api/v1/stats` - Get emission statistics
- `GET /api/v1/logs` - Retrieve system logs
- `GET /api/v1/suggestions` - Get optimization tips

Full API documentation is available at http://localhost:8000/docs when the backend is running.

## Configuration

### Environment Variables
- `DATABASE_URL` - Database connection string (default: SQLite)
- `CODECARBON_PROJECT_NAME` - Default project name for tracking
- `CORS_ORIGINS` - Allowed CORS origins (default: http://localhost:3000)

### Database
The system uses SQLite by default. For production, configure PostgreSQL or MySQL in the database connection settings.

## Development

### Running Tests
```bash
cd backend
pytest
```

### Code Formatting
```bash
cd backend
black .
isort .
```

### Frontend Development
```bash
cd frontend
npm run build    # Production build
npm run test     # Run tests
npm run eject    # Eject from Create React App
```

## Deployment

### Docker Deployment
```bash
# Build images
docker build -t green-ai-monitor-backend ./backend
docker build -t green-ai-monitor-frontend ./frontend

# Run containers
docker run -p 8000:8000 green-ai-monitor-backend
docker run -p 3000:3000 green-ai-monitor-frontend
```

### Production Considerations
- Use production WSGI server (Gunicorn) for backend
- Configure reverse proxy (nginx) for frontend
- Set up proper database for scalability
- Implement authentication and authorization
- Configure HTTPS certificates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- CodeCarbon library for emission tracking
- FastAPI framework for the backend
- React for the frontend
- Open-source AI community for sustainability awareness

## Support

For questions or issues, please open an issue on the GitHub repository or contact the development team.

## Version History

- v1.0.0 - Initial release with core functionality
- Future versions will include enhanced features and improvements

---

For more detailed information, refer to the specific documentation files linked above.