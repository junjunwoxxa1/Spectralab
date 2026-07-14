import uuid
from app.extensions import db
from sqlalchemy.dialects.postgresql import UUID, JSONB

class LifecycleEvent(db.Model):
    __tablename__ = 'lifecycle_events'
    __table_args__ = {'extend_existing': True}

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    asset_id = db.Column(UUID(as_uuid=True), db.ForeignKey('assets.id'), nullable=False)
    
    # FORZAMOS un valor por defecto para evitar el error NOT NULL
    tech_id = db.Column(UUID(as_uuid=True), nullable=False, default='d43e5971-8b3a-4a87-b9c1-52d3c9451121')
    
    event_type = db.Column(db.String(50), nullable=False)
    event_date = db.Column(db.DateTime, default=db.func.now())
    observations = db.Column(db.Text)
    parts_replaced = db.Column(JSONB, default=list)
    status = db.Column(db.String(50), default='Completado')
    digital_signature_url = db.Column(db.String(255))