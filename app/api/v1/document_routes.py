from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.document_vault import DocumentVault
from app.schemas.document_schema import document_schema, documents_schema

# Aquí es donde definimos 'bp' (Blueprint) para que Flask lo reconozca
bp = Blueprint('documents', __name__)

# Obtener los documentos de un equipo
@bp.route('/asset/<uuid:asset_id>', methods=['GET'])
def get_asset_documents(asset_id):
    # Usamos created_at porque así se llama en tu base de datos
    docs = DocumentVault.query.filter_by(asset_id=asset_id).order_by(DocumentVault.created_at.desc()).all()
    return documents_schema.jsonify(docs), 200

# Registrar un nuevo documento
@bp.route('/', methods=['POST'])
def create_document():
    data = request.get_json()
    
    new_doc = DocumentVault(
        asset_id=data.get('asset_id'),
        document_type=data.get('document_type'),
        file_url=data.get('file_url'),
        version=data.get('version', '1.0') # Usamos la columna correcta de tu tabla
    )
    
    db.session.add(new_doc)
    db.session.commit()
    
    return document_schema.jsonify(new_doc), 201