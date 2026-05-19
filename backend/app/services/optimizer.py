def generate_suggestions(metrics: dict) -> dict:
    """
    Generate optimization suggestions based on current configuration and metrics.
    
    Args:
        metrics (dict): Current run metrics and configuration.
        
    Returns:
        dict: Optimization plan with 'suggestions' and 'optimized_config'.
    """
    suggestions = []
    current_batch_size = metrics.get('batch_size', 32)
    current_epochs = metrics.get('epochs', 10)
    
    # Logic 1: Reduce Batch Size if high load/emission
    new_batch_size = current_batch_size
    if metrics.get('gpu_load', 0) > 80 or metrics.get('batch_size', 0) >= 64:
        new_batch_size = max(16, current_batch_size // 2)
        suggestions.append(f"Reduce batch size from {current_batch_size} to {new_batch_size} to lower peak power draw.")

    # Logic 2: Reduce Epochs if applicable
    new_epochs = current_epochs
    if metrics.get('epochs', 0) >= 10:
        new_epochs = max(1, current_epochs // 2)
        suggestions.append(f"Reduce training epochs from {current_epochs} to {new_epochs} (using Early Stopping) to cut runtime by ~50%.")
        
    # Logic 3: Mixed Precision
    suggestions.append("Enable Mixed Precision (FP16) to reduce memory bandwidth and energy usage by ~30%.")

    # Logic 4: Model Specific
    model_type = metrics.get('model_type', 'generic').upper()
    base_reduction = 20  # Base logic reduction
    
    if 'NLP' in model_type or 'BERT' in model_type:
        suggestions.append("Consider DistilBERT or Model Distillation for a 40% smaller model footprint.")
        base_reduction += 25
    elif 'CNN' in model_type or 'RESNET' in model_type:
        suggestions.append("Apply Model Pruning to remove redundant weights without significant accuracy loss.")
        base_reduction += 15
    elif 'LSTM' in model_type or 'RNN' in model_type:
        suggestions.append("Use GRU (Gated Recurrent Units) for a 33% reduction in parameter complexity.")
        base_reduction += 10
    else:
        base_reduction += 5

    # Logic 5: Grid Factor Optimization
    current_grid_factor = metrics.get('grid_factor', 450.0)
    new_grid_factor = current_grid_factor
    if current_grid_factor > 250:
        new_grid_factor = 150.0  # Simulated low-carbon grid
        suggestions.append(f"Shift workload to a Carbon-Aware region (e.g., Sweden or France) to reduce Grid Intensity from {current_grid_factor} to {new_grid_factor} gCO2/kWh.")
        base_reduction += 20  # Significant reduction from grid alone

    # Add some variability based on batch size and epochs
    variability = (metrics.get('batch_size', 32) / 64) * 5 + (metrics.get('epochs', 10) / 20) * 5
    estimated_reduction = min(95, base_reduction + variability)

    return {
        "plan_id": f"OPT_PLAN_{model_type[:3]}_{int(estimated_reduction)}",
        "suggestions": suggestions,
        "optimized_config": {
            "batch_size": new_batch_size,
            "epochs": new_epochs,
            "precision": "fp16",
            "grid_factor": new_grid_factor,
            "optimization_technique": "carbon_aware_scheduling"
        },
        "estimated_reduction_percentage": round(estimated_reduction, 1)
    }
