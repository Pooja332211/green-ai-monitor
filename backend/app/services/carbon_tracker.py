from codecarbon import EmissionsTracker
import time

class CarbonTrackerService:
    def __init__(self):
        self.tracker = None
        self.start_time = None
        self.project = None

    def start_tracking(self, project: str):
        if self.tracker:
            self.tracker.stop()
        self.tracker = EmissionsTracker(project_name=project)
        self.tracker.start()
        self.start_time = time.time()
        self.project = project

    def stop_tracking(self):
        if self.tracker:
            emissions = self.tracker.stop()
            duration = time.time() - self.start_time
            self.tracker = None
            self.start_time = None
            return {
                "emissions": emissions,
                "project": self.project,
                "duration": duration
            }
        return None

    def get_current_emissions(self):
        if self.tracker:
            return self.tracker._get_emissions()
        return None

carbon_tracker = CarbonTrackerService()