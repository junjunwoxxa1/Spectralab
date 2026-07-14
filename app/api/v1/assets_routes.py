from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.asset import Asset
from app.schemas.asset_schema import asset_schema, assets_schema

bp = Blueprint('assets', __name__)

@bp.route('/', methods=['POST'])
def create_asset():
    data = request.get_json()
    
    # Creamos el activo extrayendo los datos del JSON
    new_asset = Asset(
        company_id=data.get('company_id'),
        brand=data.get('brand'),
        model=data.get('model'),
        serial_number=data.get('serial_number'),
        internal_code=data.get('internal_code'),
        status=data.get('status', 'Operativo')
    )
    
    db.session.add(new_asset)
    db.session.commit()
    
    return asset_schema.jsonify(new_asset), 201

@bp.route('/', methods=['GET'])
def get_assets():
    assets = Asset.query.all()
    return assets_schema.jsonify(assets), 200


@bp.route('/<uuid:id>', methods=['PUT'])
def update_asset(id):
    asset = db.session.get(Asset, id)
    if not asset:
        return jsonify({"error": "Activo no encontrado"}), 404

    data = request.get_json()

    # Actualizamos los campos permitidos si vienen en el JSON
    if 'serial_number' in data:
        asset.serial_number = data['serial_number']
    if 'status' in data:
        asset.status = data['status']
    
    # Manejamos las fechas (si vienen vacías desde React, las guardamos como nulas)
    if 'purchase_date' in data:
        asset.purchase_date = data['purchase_date'] if data['purchase_date'] else None
    if 'warranty_expires' in data:
        asset.warranty_expires = data['warranty_expires'] if data['warranty_expires'] else None

    db.session.commit()

    # Devolvemos el activo actualizado para que React refresque la pantalla
    return jsonify({
        "id": asset.id,
        "brand": asset.brand,
        "model": asset.model,
        "serial_number": asset.serial_number,
        "internal_code": asset.internal_code,
        "purchase_date": asset.purchase_date.strftime('%Y-%m-%d') if asset.purchase_date else None,
        "warranty_expires": asset.warranty_expires.strftime('%Y-%m-%d') if asset.warranty_expires else None,
        "status": asset.status
    }), 200