from marshmallow import Schema, fields, validate


class TaskSchema(Schema):
    project_id = fields.Integer(required=True)
    title = fields.String(required=True, validate=validate.Length(min=2, max=150))
    assigned_to = fields.Integer(required=False, allow_none=True)
    start_date = fields.Date(required=False, allow_none=True)
    end_date = fields.Date(required=False, allow_none=True)
    status = fields.String(
        required=False,
        validate=validate.OneOf(['not_started', 'in_progress', 'done']),
    )
    depends_on = fields.Integer(required=False, allow_none=True)