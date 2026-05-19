# Database

This directory contains the database setup for the green-ai-monitor project.

## Files

- `emissions.db`: SQLite database file with tables for carbon emissions, logs, and system metrics.
- `schema.sql`: SQL schema file defining the database structure.

## Tables

- `carbon_emissions`: Stores carbon emission data (id, timestamp, emissions, project, duration).
- `logs`: Stores log entries (id, timestamp, level, message, project, source).
- `system_metrics`: Stores system performance metrics (id, timestamp, cpu_usage, memory_usage, gpu_usage, power_consumption, project).

## Setup

The database is created using the schema.sql file. To recreate, run the `create_db.py` script in the project root.