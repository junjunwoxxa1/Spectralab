from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.user import User

bp = Blueprint('users', __name__)

# 1. OBTENER TODOS LOS USUARIOS
@bp.route('/', methods=['GET'])
def get_users():
    users = User.query.all()
    result = []
    for u in users:
        result.append({
            'id': str(u.id),
            'email': u.email,
            'full_name': u.full_name,
            'role': u.role,
            'is_active': u.is_active
        })
    return jsonify(result), 200

# 2. CREAR UN NUEVO USUARIO
@bp.route('/', methods=['POST'])
def create_user():
    data = request.get_json()
    
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({'error': 'El correo ya está registrado'}), 400

    new_user = User(
        email=data.get('email'),
        password_hash=data.get('password'),
        full_name=data.get('full_name'),
        role=data.get('role', 'tecnico'),
        is_active=True  # 👈 AÑADIMOS ESTO PARA FORZAR EL ESTADO
    )
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({
        'id': str(new_user.id),
        'email': new_user.email,
        'full_name': new_user.full_name,
        'role': new_user.role,
        'is_active': new_user.is_active # 👈 Lo devolvemos también
    }), 201

# 3. ACTUALIZAR PERFIL, CONTRASEÑA, ROL Y ESTADO
@bp.route('/<uuid:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    # Actualizar datos básicos
    if 'full_name' in data:
        user.full_name = data['full_name']
    if 'email' in data:
        user.email = data['email']
    if 'role' in data:
        user.role = data['role']
    if 'is_active' in data:
        user.is_active = data['is_active']
        
    # Lógica de cambio de contraseña
    if 'current_password' in data and 'new_password' in data:
        if user.password_hash == data['current_password']:
            user.password_hash = data['new_password']
        else:
            return jsonify({'error': 'La contraseña actual es incorrecta'}), 401
    
    db.session.commit()
    
    return jsonify({
        'id': str(user.id),
        'email': user.email,
        'full_name': user.full_name,
        'role': user.role,
        'is_active': user.is_active
    }), 200