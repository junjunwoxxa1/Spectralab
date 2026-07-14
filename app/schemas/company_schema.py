from app.extensions import ma
from app.models.company import Company

class CompanySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Company
        load_instance = True

company_schema = CompanySchema()
companies_schema = CompanySchema(many=True)