from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.company import Company
from app.schemas.company_schema import company_schema, companies_schema

bp = Blueprint('companies', __name__)

@bp.route('/', methods=['POST'])
def create_company():
    data = request.get_json()
    new_company = Company(
        name=data.get('name'),
        tax_id=data.get('tax_id'),
        contact_email=data.get('contact_email'),
        contact_phone=data.get('contact_phone')
    )
    db.session.add(new_company)
    db.session.commit()
    return company_schema.jsonify(new_company), 201

@bp.route('/', methods=['GET'])
def get_companies():
    companies = Company.query.all()
    return companies_schema.jsonify(companies), 200


@bp.route('/<uuid:company_id>', methods=['PUT'])
def update_company(company_id):
    company = Company.query.get_or_404(company_id)
    data = request.get_json()
    
    # Actualizamos los campos con la información que viene del Frontend
    company.name = data.get('name', company.name)
    company.tax_id = data.get('tax_id', company.tax_id)
    company.contact_email = data.get('contact_email', company.contact_email)
    company.contact_phone = data.get('contact_phone', company.contact_phone)
    
    db.session.commit()
    return company_schema.jsonify(company), 200