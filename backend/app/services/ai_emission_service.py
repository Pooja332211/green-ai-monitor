from sqlalchemy.orm import Session
from app.models.ai_model_emission import AIModelEmission

def get_all_emissions(db: Session):
    return db.query(AIModelEmission).all()

def get_emission_by_model(model_name: str, db: Session):
    return db.query(AIModelEmission).filter(AIModelEmission.model_name == model_name).first()
