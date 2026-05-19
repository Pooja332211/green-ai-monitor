import sqlite3
from datetime import datetime, timedelta
import random
import os

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'green_ai_monitor.db')

def seed_history():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Clear existing logs (optional)
    # cursor.execute("DELETE FROM carbon_emissions")

    # Generate 20 sample sessions over the last 24 hours
    now = datetime.now()
    project_names = ["BERT-Finetune", "ResNet-Training", "YOLO-Infer", "LSTM-Weather", "Dummy-Workload"]
    
    for i in range(20):
        timestamp = (now - timedelta(hours=i)).strftime('%Y-%m-%d %H:%M:%S')
        project = random.choice(project_names)
        emissions = random.uniform(0.001, 1.5)
        duration = random.uniform(10, 3600)
        
        cursor.execute(
            "INSERT INTO carbon_emissions (timestamp, emissions, project, duration) VALUES (?, ?, ?, ?)",
            (timestamp, emissions, project, duration)
        )

    conn.commit()
    conn.close()
    print("✅ Successfully seeded 20 historical emission logs!")

if __name__ == "__main__":
    seed_history()
