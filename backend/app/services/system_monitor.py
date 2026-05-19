import psutil
import time
import threading

class SystemMonitorService:
    def __init__(self):
        self.monitoring = False
        self.project = None
        self.metrics = {
            "cpu_usage": 0,
            "memory_usage": 0,
            "memory_used_gb": 0,
            "memory_total_gb": 0,
            "power_consumption": 0,
            "co2_emissions": 0,
            "project": None
        }
        self.thread = None
        # Carbon intensity factor (kg CO2 / kWh)
        self.carbon_intensity = 0.475 
        # Assumed CPU Thermal Design Power (Watts)
        self.cpu_tdp = 65 
        # Assumed base power consumption (Watts)
        self.idle_power = 15

    def start_monitoring(self, project: str):
        if self.monitoring:
            return
        self.monitoring = True
        self.project = project
        self.thread = threading.Thread(target=self._monitor_loop, daemon=True)
        self.thread.start()

    def stop_monitoring(self):
        self.monitoring = False
        if self.thread:
            self.thread.join(timeout=1)
        return self.metrics

    def _monitor_loop(self):
        while self.monitoring:
            # We use a blocking interval in _get_current_metrics to get accurate CPU stats
            # so we don't need a time.sleep() here.
            self.metrics = self._get_current_metrics()

    def _get_current_metrics(self):
        # Increased interval to 0.5s for stability/accuracy (aligns with Task Manager)
        cpu_p = psutil.cpu_percent(interval=0.5)
        mem = psutil.virtual_memory()
        
        # Fluctuating grid factor (g CO2 / kWh) to simulate real-time changes
        import random
        # Base around 431 from frontend, but let it drift between 400-500
        self.carbon_intensity_g = 431 + (random.random() * 40 - 20)
        self.carbon_intensity = self.carbon_intensity_g / 1000.0 # kg CO2 / kWh

        # GPU Monitoring fallback
        gpu_usage = None
        gpu_power = 0
        try:
            import pynvml
            pynvml.nvmlInit()
            handle = pynvml.nvmlDeviceGetHandleByIndex(0)
            gpu_usage = pynvml.nvmlDeviceGetUtilizationRates(handle).gpu
            # Power in milliwatts, convert to Watts
            gpu_power = pynvml.nvmlDeviceGetPowerUsage(handle) / 1000.0
            pynvml.nvmlShutdown()
        except:
            pass

        # Power estimation fallback: Idle + CPU% contribution + GPU Power
        power_w = self.idle_power + (cpu_p / 100.0) * (self.cpu_tdp - self.idle_power) + gpu_power
        
        # CO2 Calculation (mg/s):
        # (Power_W / 1000) = kW
        # kW * intensity = kg CO2 / hour
        # (kg/h / 3600) = kg CO2 / second
        # kg * 1,000,000 = mg
        co2_mg_s = (power_w / 1000.0) * self.carbon_intensity * (1.0 / 3600.0) * 1000000.0

        return {
            "cpu_usage": round(cpu_p, 2),
            "memory_usage": round(mem.percent, 2),
            "memory_used_gb": round(mem.used / (1024**3), 2),
            "memory_total_gb": round(mem.total / (1024**3), 2),
            "gpu_usage": gpu_usage,
            "power_consumption": round(power_w, 2),
            "co2_emissions": round(co2_mg_s, 4), # mg per second
            "grid_factor": round(self.carbon_intensity_g, 2),
            "project": self.project
        }

    def get_current_metrics(self):
        return self.metrics

system_monitor = SystemMonitorService()