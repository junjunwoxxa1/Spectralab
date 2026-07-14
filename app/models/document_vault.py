import uuid
from app.extensions import db
from sqlalchemy.dialects.postgresql import UUID

class DocumentVault(db.Model):
    __tablename__ = 'document_vault'
    __table_args__ = {'extend_existing': True}

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    asset_id = db.Column(UUID(as_uuid=True), db.ForeignKey('assets.id'), nullable=False)
    document_type = db.Column(db.String(50))
    file_url = db.Column(db.String(255))
    version = db.Column(db.String(50), default='1.0')
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())
    is_active = db.Column(db.Boolean, default=True)