from app.extensions import db
from .base import BaseModel
from sqlalchemy.dialects.postgresql import UUID

class User(BaseModel):
    __tablename__ = 'users'
    
    company_id = db.Column(UUID(as_uuid=True), db.ForeignKey('companies.id'), nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    
    # 👈 AÑADIMOS LA COLUMNA PARA LA LLAVE DE LA API PÚBLICA
    api_key = db.Column(db.String(100), unique=True, nullable=True)