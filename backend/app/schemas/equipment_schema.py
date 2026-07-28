from marshmallow import Schema, fields, validate


class EquipmentSchema(Schema):
    project_id = fields.Integer(required=True)
    name = fields.String(required=True, validate=validate.Length(min=1, max=120))
    status = fields.String(
        required=False,
        validate=validate.OneOf(['available', 'in_use', 'maintenance']),
    )
    assigned_to = fields.Integer(required=False, allow_none=True)