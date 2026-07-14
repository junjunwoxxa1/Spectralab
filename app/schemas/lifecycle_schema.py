from app.extensions import ma
from app.models.lifecycle_event import LifecycleEvent

class LifecycleEventSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = LifecycleEvent
        include_fk = True

lifecycle_event_schema = LifecycleEventSchema()
lifecycle_events_schema = LifecycleEventSchema(many=True)