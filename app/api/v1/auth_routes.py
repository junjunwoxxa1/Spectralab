from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash  # <--- IMPORTA ESTO
from app.models.user import User

bp = Blueprint('auth', __name__)

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    # AQUÍ ESTÁ EL CAMBIO: Usamos check_password_hash
    if user and check_password_hash(user.password_hash, password):
        access_token = create_access_token(
            identity=str(user.id),
            additional_claims={
                'role': user.role, 
                'full_name': user.full_name
            }
        )
        
        return jsonify({
            'token': access_token,
            'user': {
                'id': str(user.id),
                'email': user.email,
                'full_name': user.full_name,
                'role': user.role
            }
        }), 200
    
    return jsonify({'error': 'Correo o contraseña incorrectos'}), 401