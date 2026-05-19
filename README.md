# 🌱 Green AI Monitor

> **Real-time carbon footprint tracking and optimization for AI models**

A comprehensive monitoring system that tracks CPU, GPU, memory usage, power consumption, and CO₂ emissions during AI model training and inference. Built with modern web technologies and premium UI design.

![Dashboard Preview](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.8+-blue?style=for-the-badge&logo=python)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688?style=for-the-badge&logo=fastapi)

---

## ✨ Features

### 🔍 Real-Time Monitoring
- **CPU & Memory Usage**: Track system resource utilization in real-time
- **GPU Monitoring**: NVIDIA GPU support with `pynvml`
- **Power Consumption**: Estimate power usage based on TDP and workload
- **CO₂ Emissions**: Calculate carbon footprint using CodeCarbon

### 📊 Data Visualization
- **Live Stats Dashboard**: Beautiful glassmorphism cards with gradient text
- **Emission Charts**: Interactive line charts showing historical data
- **Smooth Animations**: Fade-in, slide-in, and pulse effects

### 💡 AI-Powered Insights
- **Optimization Tips**: Get suggestions to reduce carbon footprint
- **Historical Analysis**: Compare emissions across different runs
- **Project Tracking**: Monitor multiple AI projects separately

### 🎨 Premium UI Design
- **Dark Theme**: Modern dark interface with vibrant accents
- **Glassmorphism**: Frosted glass effects on all components
- **Gradient Text**: Eye-catching gradients for headings
- **Responsive Layout**: Works on all screen sizes

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+**
- **Node.js 14+**
- **npm or yarn**
- **NVIDIA GPU** (optional, for GPU monitoring)

### Installation

1. **Clone the repository**
   ```bash
   cd "c:\Users\chinm\OneDrive\Desktop\2nd year mca project\green-ai-monitor"
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

### Running the Application

#### Start Backend (Terminal 1)
```bash
cd backend
uvicorn app.main:app --reload
```
Backend will run on **http://localhost:8000**

#### Start Frontend (Terminal 2)
```bash
cd frontend
npm start
```
Frontend will run on **http://localhost:3000**

#### Test with Dummy Workload (Terminal 3)
```bash
python ml_workloads/dummy_workload.py
```

---

## 📁 Project Structure

```
green-ai-monitor/
├── backend/
│   ├── app/
│   │   ├── api/              # REST API endpoints
│   │   │   ├── tracking.py   # Start/stop tracking
│   │   │   ├── stats.py      # Live & historical stats
│   │   │   ├── logs.py       # Emission logs
│   │   │   └── suggestions.py # Optimization tips
│   │   ├── services/         # Core business logic
│   │   │   ├── carbon_tracker.py  # CodeCarbon integration
│   │   │   └── system_monitor.py  # CPU/GPU/RAM monitoring
│   │   ├── models/           # Database models
│   │   ├── schemas/          # Pydantic schemas
│   │   └── database/         # SQLite connection
│   └── main.py               # FastAPI app entry point
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── LiveStats.jsx      # Real-time metrics
│   │   │   ├── EmissionChart.jsx  # Historical chart
│   │   │   ├── OptimizationTips.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── pages/
│   │   │   └── Home.jsx      # Main page with hero
│   │   ├── services/
│   │   │   └── api.js        # Axios API client
│   │   └── styles/
│   │       └── global.css    # Global styles & animations
│   └── package.json
├── ml_workloads/             # Test workloads
│   ├── dummy_workload.py     # Simple CPU test
│   ├── yolov5/
│   ├── bert/
│   └── resnet/
├── chatbot/                  # NLP chatbot (optional)
├── database/                 # SQLite database
└── requirements.txt
```

---

## 🔧 API Endpoints

### Tracking
- `POST /api/v1/tracking` - Start/stop tracking
  ```json
  { "action": "start", "project": "My Model" }
  { "action": "stop", "project": "My Model" }
  ```

### Stats
- `GET /api/v1/stats/live` - Get real-time metrics
- `GET /api/v1/stats/carbon/total` - Total CO₂ emissions
- `GET /api/v1/stats/carbon/average` - Average emissions

### Logs
- `GET /api/v1/logs` - Get emission history

### Suggestions
- `GET /api/v1/suggestions` - Get optimization tips

**API Documentation**: http://localhost:8000/docs

---

## 🎨 Design System

### Color Palette
```css
Primary Gradient:   #667eea → #764ba2 (Purple to Violet)
Success Gradient:   #4facfe → #00f2fe (Blue to Cyan)
Warning Gradient:   #fa709a → #fee140 (Pink to Yellow)
Background:         #0f0f23 (Deep Dark)
Card Background:    rgba(255, 255, 255, 0.05) (Glassmorphism)
```

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: 700-800 weight
- **Body**: 400-500 weight

### Animations
- **Fade In**: 0.6s ease-out
- **Slide In**: 0.4s cubic-bezier
- **Pulse**: 2s infinite
- **Shimmer**: 2s infinite (loading states)

---

## 🧪 Testing

### Run Dummy Workload
```bash
python ml_workloads/dummy_workload.py
```
This simulates CPU-intensive work for 30 seconds and tracks emissions.

### Test API Directly
```bash
# Start tracking
curl -X POST http://localhost:8000/api/v1/tracking \
  -H "Content-Type: application/json" \
  -d '{"action": "start", "project": "Test"}'

# Get live stats
curl http://localhost:8000/api/v1/stats/live

# Stop tracking
curl -X POST http://localhost:8000/api/v1/tracking \
  -H "Content-Type: application/json" \
  -d '{"action": "stop", "project": "Test"}'
```

---

## 📊 Technologies Used

| Technology | Purpose |
|------------|---------|
| **FastAPI** | High-performance REST API |
| **React.js** | Modern frontend framework |
| **CodeCarbon** | Energy → CO₂ calculation |
| **psutil** | CPU/RAM monitoring |
| **pynvml** | GPU monitoring (NVIDIA) |
| **SQLite** | Lightweight database |
| **Chart.js** | Interactive charts |
| **Axios** | HTTP client |

---

## 🌟 Key Highlights

✅ **Real-time monitoring** with 1-second refresh rate  
✅ **GPU support** for NVIDIA graphics cards  
✅ **Premium UI** with glassmorphism and animations  
✅ **Responsive design** for all screen sizes  
✅ **Error handling** for robust operation  
✅ **Historical tracking** with SQLite persistence  
✅ **API documentation** with Swagger UI  

---

## 🔮 Future Enhancements

- [ ] User authentication & multi-user support
- [ ] Chatbot integration for natural language queries
- [ ] Export reports as PDF/CSV
- [ ] Email notifications for high emissions
- [ ] Model comparison dashboard
- [ ] Cloud deployment support
- [ ] Dark/light theme toggle
- [ ] Mobile app

---

## 📝 License

This project is created for educational purposes as part of an MCA project.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📧 Contact

For questions or feedback, please reach out through the project repository.

---

<div align="center">

**Built with 💚 for a sustainable AI future**

[Documentation](./docs) • [API Docs](http://localhost:8000/docs) • [Report Issues](./issues)

</div>