-- Schema for green-ai-monitor database

CREATE TABLE carbon_emissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    emissions REAL NOT NULL,
    project TEXT NOT NULL,
    duration REAL NOT NULL
);

CREATE TABLE logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    level TEXT NOT NULL,
    message TEXT NOT NULL,
    project TEXT NOT NULL,
    source TEXT NOT NULL
);

CREATE TABLE system_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    cpu_usage REAL NOT NULL,
    memory_usage REAL NOT NULL,
    gpu_usage REAL,
    power_consumption REAL,
    project TEXT NOT NULL
);

CREATE TABLE ai_model_emissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    model_name TEXT NOT NULL,
    model_type TEXT NOT NULL,
    hardware TEXT NOT NULL,
    runtime_minutes REAL NOT NULL,
    energy_kwh REAL NOT NULL,
    co2_kg REAL NOT NULL,
    remarks TEXT
);