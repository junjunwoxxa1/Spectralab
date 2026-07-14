from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.ticket import Ticket
from app.models.asset import Asset
from app.models.user import User

bp = Blueprint('tickets', __name__)

@bp.route('/', methods=['GET'])
def get_tickets():
    tickets = Ticket.query.order_by(Ticket.created_at.desc()).all()
    result = []
    for t in tickets:
        asset = Asset.query.get(t.asset_id) if t.asset_id else None
        user = User.query.get(t.user_id) if t.user_id else None
        result.append({
            'id': str(t.id),
            'title': t.title,
            'description': t.description,
            'service_type': t.service_type,
            'priority': t.priority,
            'status': t.status,
            'created_at': t.created_at.isoformat() if t.created_at else None,
            'asset_name': f"{asset.brand} {asset.model}" if asset else "Equipo no especificado",
            'client_name': user.full_name if user else "Usuario Desconocido"
        })
    return jsonify(result), 200

@bp.route('/', methods=['POST'])
def create_ticket():
    data = request.get_json()
    new_ticket = Ticket(
        title=data.get('title'),
        description=data.get('description'),
        service_type=data.get('service_type'),
        priority=data.get('priority', 'Media'),
        asset_id=data.get('asset_id'),
        user_id=data.get('user_id')
    )
    db.session.add(new_ticket)
    db.session.commit()
    return jsonify({'message': 'Ticket creado exitosamente', 'id': str(new_ticket.id)}), 201

# Actualizar el estado del ticket (Pendiente -> En Proceso -> Resuelto)
@bp.route('/<uuid:ticket_id>/status', methods=['PUT'])
def update_status(ticket_id):
    ticket = Ticket.query.get_or_404(ticket_id)
    data = request.get_json()
    ticket.status = data.get('status', ticket.status)
    db.session.commit()
    return jsonify({'message': 'Estado actualizado', 'status': ticket.status}), 200