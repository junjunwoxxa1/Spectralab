from app.extensions import db
from .base import BaseModel
from sqlalchemy.dialects.postgresql import UUID, JSONB

class Asset(BaseModel):
    __tablename__ = 'assets'
    
    company_id = db.Column(UUID(as_uuid=True), db.ForeignKey('companies.id'), nullable=False)
    
    brand = db.Column(db.String(100), nullable=False)
    model = db.Column(db.String(100), nullable=False)
    serial_number = db.Column(db.String(100), nullable=False)
    internal_code = db.Column(db.String(50), unique=True, nullable=True)
    
    purchase_date = db.Column(db.Date, nullable=True)
    warranty_expires = db.Column(db.Date, nullable=True)
    status = db.Column(db.String(50), default='Operativo')
    
    technical_specs = db.Column(JSONB, nullable=True, default={})
    
    # Relaciones
    events = db.relationship('LifecycleEvent', backref='asset', lazy='dynamic', order_by='desc(LifecycleEvent.event_date)')
    documents = db.relationship('DocumentVault', backref='asset', lazy=True)

class DocumentVault(BaseModel):
    __tablename__ = 'document_vault'
    
    asset_id = db.Column(UUID(as_uuid=True), db.ForeignKey('assets.id'), nullable=False)
    document_type = db.Column(db.String(50), nullable=False)
    file_url = db.Column(db.String(255), nullable=False)
    version = db.Column(db.String(20), default='1.0')