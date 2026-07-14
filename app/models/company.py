from app.extensions import db
from .base import BaseModel

class Company(BaseModel):
    __tablename__ = 'companies'
    
    name = db.Column(db.String(150), nullable=False)
    tax_id = db.Column(db.String(50), unique=True, nullable=True) # RUC, NIT, etc.
    contact_email = db.Column(db.String(120))
    contact_phone = db.Column(db.String(50))
    
    # Relaciones
    users = db.relationship('User', backref='company', lazy=True)
    assets = db.relationship('Asset', backref='company', lazy=True)