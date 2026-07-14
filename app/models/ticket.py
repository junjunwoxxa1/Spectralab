from app.extensions import db
from .base import BaseModel
from sqlalchemy.dialects.postgresql import UUID

class Ticket(BaseModel):
    __tablename__ = 'tickets'
    
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    service_type = db.Column(db.String(50), nullable=False) # Preventivo, Correctivo, Diagnóstico, Calibración
    priority = db.Column(db.String(20), default='Media') # Baja, Media, Alta, Crítica
    status = db.Column(db.String(50), default='Pendiente') # Pendiente, En Proceso, Resuelto
    
    asset_id = db.Column(UUID(as_uuid=True), db.ForeignKey('assets.id'), nullable=True)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)