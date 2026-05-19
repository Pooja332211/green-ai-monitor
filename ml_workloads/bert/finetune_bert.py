"""
DistilBERT Fine-Tuning with CO₂ Emission Tracking
==================================================
This script demonstrates how DistilBERT generates CO₂ emissions
during fine-tuning and how to track them in real-time.

Libraries needed:
    pip install transformers torch codecarbon datasets
"""

from transformers import AutoTokenizer, AutoModelForSequenceClassification
from codecarbon import EmissionsTracker
import torch
import time

def run_distilbert_training():
    """
    Run DistilBERT fine-tuning simulation with CO₂ tracking.
    Returns emission data for dashboard display.
    """
    # 1. Load model
    print("[BERT] Loading DistilBERT model...")
    model_name = "distilbert-base-uncased"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=2)
    
    # 2. Start CO₂ tracking
    print("[CARBON] Starting emission tracker...")
    tracker = EmissionsTracker(
        project_name="DistilBERT Emission Demo",
        measure_power_secs=1,
        save_to_file=True,
        output_dir="./emissions_logs"
    )
    tracker.start()
    start_time = time.time()
    
    # 3. Dummy training loop (simulation for demo)
    print("[TRAIN] Running training simulation...")
    texts = ["Green AI is important for sustainability"] * 500
    inputs = tokenizer(texts, padding=True, truncation=True, return_tensors="pt", max_length=128)
    
    optimizer = torch.optim.AdamW(model.parameters(), lr=5e-5)
    
    for epoch in range(3):
        print(f"[EPOCH {epoch+1}/3] Training...")
        outputs = model(**inputs)
        loss = outputs.logits.mean()
        loss.backward()
        optimizer.step()
        optimizer.zero_grad()
        
        # Check for early stopping based on emissions
        current_emissions = tracker._total_emissions if hasattr(tracker, '_total_emissions') else 0
        if current_emissions > 0.5:
            print(f"[ALERT] High CO₂ detected ({current_emissions:.4f} kg). Consider early stopping.")
    
    # 4. Stop tracking
    runtime = time.time() - start_time
    co2 = tracker.stop()
    
    # 5. Return results
    results = {
        "model": "DistilBERT",
        "runtime_seconds": round(runtime, 2),
        "runtime_minutes": round(runtime / 60, 2),
        "co2_kg": round(co2, 6),
        "epochs": 3,
        "batch_size": 64,
        "hardware": "GPU" if torch.cuda.is_available() else "CPU"
    }
    
    print(f"\n[RESULT] CO₂ Emitted: {co2:.6f} kg")
    print(f"[RESULT] Runtime: {runtime:.2f} seconds")
    
    return results


def run_optimized_training():
    """
    Run DistilBERT with optimized settings for reduced emissions.
    """
    print("\n[OPTIMIZE] Running with reduced settings...")
    
    model_name = "distilbert-base-uncased"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=2)
    
    tracker = EmissionsTracker(project_name="DistilBERT Optimized")
    tracker.start()
    start_time = time.time()
    
    # Reduced settings
    texts = ["Green AI is important"] * 250  # Smaller batch
    inputs = tokenizer(texts, padding=True, truncation=True, return_tensors="pt", max_length=64)
    
    optimizer = torch.optim.AdamW(model.parameters(), lr=5e-5)
    
    for epoch in range(2):  # Fewer epochs
        outputs = model(**inputs)
        loss = outputs.logits.mean()
        loss.backward()
        optimizer.step()
        optimizer.zero_grad()
    
    runtime = time.time() - start_time
    co2 = tracker.stop()
    
    return {
        "model": "DistilBERT (Optimized)",
        "runtime_seconds": round(runtime, 2),
        "co2_kg": round(co2, 6),
        "epochs": 2,
        "batch_size": 32,
        "hardware": "GPU" if torch.cuda.is_available() else "CPU"
    }


if __name__ == "__main__":
    print("=" * 50)
    print("DistilBERT CO₂ Emission Tracking Demo")
    print("=" * 50)
    
    # Run baseline
    baseline = run_distilbert_training()
    
    # Run optimized
    optimized = run_optimized_training()
    
    # Compare
    print("\n" + "=" * 50)
    print("COMPARISON RESULTS")
    print("=" * 50)
    print(f"Baseline CO₂:  {baseline['co2_kg']:.6f} kg")
    print(f"Optimized CO₂: {optimized['co2_kg']:.6f} kg")
    reduction = ((baseline['co2_kg'] - optimized['co2_kg']) / baseline['co2_kg']) * 100 if baseline['co2_kg'] > 0 else 0
    print(f"Reduction:     {reduction:.1f}%")