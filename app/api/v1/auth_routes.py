from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app.models.user import User

bp = Blueprint('auth', __name__)

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Buscamos al usuario por su correo
    user = User.query.filter_by(email=email).first()

    # Validamos que exista y que la contraseña coincida
    if user and user.password_hash == password:
        # Generamos el Token JWT (El pase VIP)
        access_token = create_access_token(
            identity=str(user.id),
            additional_claims={
                'role': user.role, 
                'full_name': user.full_name
            }
        )
        
        # Devolvemos el token y los datos básicos al Frontend
        return jsonify({
            'token': access_token,
            'user': {
                'id': str(user.id),
                'email': user.email,
                'full_name': user.full_name,
                'role': user.role
            }
        }), 200
    
    # Si algo falla, rechazamos la entrada
    return jsonify({'error': 'Correo o contraseña incorrectos'}), 401