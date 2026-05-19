# 🚀 Quick Start Guide - Green AI Monitor

## Running the Complete System

### Step 1: Start Backend
Open Terminal 1:
```bash
cd backend
uvicorn app.main:app --reload
```
✅ Backend running at http://localhost:8000

### Step 2: Start Frontend
Open Terminal 2:
```bash
cd frontend
npm start
```
✅ Frontend running at http://localhost:3000

### Step 3: Run Test Workload
Open Terminal 3:
```bash
python ml_workloads/dummy_workload.py
```
✅ Tracking active for 30 seconds

---

## What You'll See

### 1. **Dashboard** (http://localhost:3000)
- **Real-Time System Monitoring** section with live stats
- **Emission History** chart (populated after tracking sessions)
- **Optimization Tips** for reducing carbon footprint

### 2. **API Documentation** (http://localhost:8000/docs)
- Interactive Swagger UI
- Test all endpoints directly
- View request/response schemas

### 3. **Live Stats Updates**
Watch the dashboard update every second:
- CPU Usage %
- Memory Usage (GB)
- GPU Usage % (if available)
- Power Consumption (W)
- CO₂ Emissions (mg/s)

---

## Testing the Tracking System

### Using the Dummy Workload
```bash
python ml_workloads/dummy_workload.py
```

**What it does:**
1. Calls `/api/v1/tracking` with `action: "start"`
2. Runs CPU-intensive work for 30 seconds
3. Calls `/api/v1/tracking` with `action: "stop"`
4. Displays emission results

### Using API Directly

**Start Tracking:**
```python
import requests
requests.post('http://localhost:8000/api/v1/tracking', 
              json={'action': 'start', 'project': 'My Model'})
```

**Get Live Stats:**
```python
response = requests.get('http://localhost:8000/api/v1/stats/live')
print(response.json())
```

**Stop Tracking:**
```python
response = requests.post('http://localhost:8000/api/v1/tracking',
                        json={'action': 'stop', 'project': 'My Model'})
print(response.json())
```

---

## Troubleshooting

### Frontend shows "Loading..."
- ✅ Check backend is running on port 8000
- ✅ Check browser console for errors
- ✅ Verify API endpoints in DevTools Network tab

### Backend errors
- ✅ Install all dependencies: `pip install -r requirements.txt`
- ✅ Check Python version (3.8+)
- ✅ Verify port 8000 is not in use

### No GPU stats
- ✅ This is normal if you don't have an NVIDIA GPU
- ✅ GPU field will show `null` in the response
- ✅ System still tracks CPU and power consumption

---

## Key Files to Know

| File | Purpose |
|------|---------|
| `backend/app/main.py` | FastAPI entry point |
| `backend/app/api/tracking.py` | Tracking endpoints |
| `backend/app/services/system_monitor.py` | CPU/GPU monitoring |
| `frontend/src/components/LiveStats.jsx` | Real-time dashboard |
| `frontend/src/services/api.js` | API client |
| `ml_workloads/dummy_workload.py` | Test script |

---

## Next Steps

1. ✅ **Explore the Dashboard** - Open http://localhost:3000
2. ✅ **Run a Test** - Execute `python ml_workloads/dummy_workload.py`
3. ✅ **Check API Docs** - Visit http://localhost:8000/docs
4. ✅ **View Emission History** - See the chart populate after tracking
5. ✅ **Read Optimization Tips** - Learn how to reduce carbon footprint

---

**Need help?** Check the main [README.md](../README.md) for detailed documentation.
