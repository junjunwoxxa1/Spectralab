from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.lifecycle_event import LifecycleEvent
from app.schemas.lifecycle_schema import lifecycle_event_schema, lifecycle_events_schema

bp = Blueprint('lifecycle', __name__)

# Obtener todo el historial de un activo específico
@bp.route('/asset/<uuid:asset_id>', methods=['GET'])
def get_asset_events(asset_id):
    events = LifecycleEvent.query.filter_by(asset_id=asset_id).order_by(LifecycleEvent.event_date.desc()).all()
    return lifecycle_events_schema.jsonify(events), 200

# Registrar una nueva intervención
@bp.route('/', methods=['POST'])
def create_event():
    data = request.get_json()
    
    new_event = LifecycleEvent(
        asset_id=data.get('asset_id'),
        event_type=data.get('event_type'),
        observations=data.get('description'),
        status='Completado'
        # NO enviamos tech_id aquí, dejamos que el modelo use el default que acabamos de definir
    )
    
    db.session.add(new_event)
    db.session.commit()
    
    return lifecycle_event_schema.jsonify(new_event), 201