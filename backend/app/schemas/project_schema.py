from marshmallow import Schema, fields, validate


class ProjectSchema(Schema):
    name = fields.String(required=True, validate=validate.Length(min=2, max=150))
    location = fields.String(required=False, allow_none=True)
    start_date = fields.Date(required=True)
    end_date = fields.Date(required=False, allow_none=True)
    status = fields.String(
        required=False,
        validate=validate.OneOf(['planning', 'in_progress', 'on_hold', 'complete']),
    )
    budget_total = fields.Float(required=False)
    manager_id = fields.Integer(required=True)
    client_id = fields.Integer(required=False, allow_none=True)