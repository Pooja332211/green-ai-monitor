def analyze_emission(metrics: dict) -> dict:
    """
    Analyze emission metrics and return a list of reasons for high emissions.
    
    Args:
        metrics (dict): Dictionary containing 'co2_kg', 'power_usage_w', 'gpu_load', 'cpu_load', 'epoch_count', 'batch_size'
        
    Returns:
        dict: Analysis result with 'is_high_emission' (bool) and 'factors' (list of strings)
    """
    factors = []
    
    # Thresholds (Simulated based on typical sustainable AI values)
    CO2_THRESHOLD_KG = 0.1
    GPU_LOAD_THRESHOLD = 80
    EPOCH_THRESHOLD = 8
    BATCH_SIZE_THRESHOLD = 32
    
    co2_kg = metrics.get('co2_kg', 0)
    gpu_load = metrics.get('gpu_load', 0)
    epochs = metrics.get('epochs', 0)
    batch_size = metrics.get('batch_size', 0)
    
    if co2_kg > CO2_THRESHOLD_KG:
        factors.append(f"CO2 emissions ({co2_kg:.4f} kg) exceed sustainable threshold ({CO2_THRESHOLD_KG} kg).")
        
    if gpu_load > GPU_LOAD_THRESHOLD:
        factors.append(f"GPU usage is critical ({gpu_load}%). High compute intensity detected.")
        
    if epochs > EPOCH_THRESHOLD:
        factors.append(f"High number of training epochs ({epochs}) increases total energy consumption.")
        
    if batch_size > BATCH_SIZE_THRESHOLD:
        factors.append(f"Large batch size ({batch_size}) contributes to higher peak power draw.")
        
    return {
        "analysis_id": "ANL_SYS_01",
        "is_high_emission": len(factors) > 0,
        "co2_magnitude": co2_kg,
        "factors": factors if factors else ["System operating within sustainable parameters."]
    }
