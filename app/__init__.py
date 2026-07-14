from flask import Flask
from flask_cors import CORS
from .config import Config
from .extensions import db, migrate, jwt, ma

def create_app(config_class=Config):
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(config_class)

    # Inicializar extensiones
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    ma.init_app(app)

    from app import models

    from app.api.v1.assets_routes import bp as assets_bp
    app.register_blueprint(assets_bp, url_prefix='/api/v1/assets')

    from app.api.v1.companies_routes import bp as companies_bp
    app.register_blueprint(companies_bp, url_prefix='/api/v1/companies')

    from app.api.v1.lifecycle_routes import bp as lifecycle_bp
    app.register_blueprint(lifecycle_bp, url_prefix='/api/v1/lifecycle')
    
    from app.api.v1.document_routes import bp as documents_bp
    app.register_blueprint(documents_bp, url_prefix='/api/v1/documents')
    
    from app.api.v1.auth_routes import bp as auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')

    from app.api.v1.users_routes import bp as users_bp
    app.register_blueprint(users_bp, url_prefix='/api/v1/users')

    from app.api.v1.tickets_routes import bp as tickets_bp
    app.register_blueprint(tickets_bp, url_prefix='/api/v1/tickets')

    # Ruta de comprobación de salud
    @app.route('/health', methods=['GET'])
    def health_check():
        return {'status': 'ok', 'message': 'Spectralab Cloud API v1.0 running'}

    return app