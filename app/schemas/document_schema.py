from app.extensions import ma
from app.models.document_vault import DocumentVault

class DocumentVaultSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = DocumentVault
        include_fk = True

document_schema = DocumentVaultSchema()
documents_schema = DocumentVaultSchema(many=True)