from datetime import datetime
from app.extensions import db
from .base import BaseModel
from sqlalchemy.dialects.postgresql import UUID, JSONB

class LifecycleEvent(BaseModel):
    __tablename__ = 'lifecycle_events'
    
    asset_id = db.Column(UUID(as_uuid=True), db.ForeignKey('assets.id'), nullable=False)
    tech_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    
    event_type = db.Column(db.String(50), nullable=False)
    event_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    observations = db.Column(db.Text, nullable=False)
    parts_replaced = db.Column(JSONB, nullable=True, default=[])
    
    status = db.Column(db.String(20), default='Completado')
    digital_signature_url = db.Column(db.String(255), nullable=True)