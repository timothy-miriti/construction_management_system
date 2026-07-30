from marshmallow import Schema, fields, validate


class MaterialSchema(Schema):
    project_id = fields.Integer(required=True)
    name = fields.String(required=True, validate=validate.Length(min=1, max=120))
    quantity = fields.Float(required=False)
    unit_cost = fields.Float(required=False)