from app.extensions import ma
from app.models.asset import Asset

class AssetSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Asset
        load_instance = True
        include_fk = True # Permite ver las llaves foráneas como company_id

asset_schema = AssetSchema()
assets_schema = AssetSchema(many=True)