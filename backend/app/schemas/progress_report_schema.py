from marshmallow import Schema, fields, validate


class ProgressReportSchema(Schema):
    project_id = fields.Integer(required=True)
    submitted_by = fields.Integer(required=True)
    date = fields.Date(required=False)
    description = fields.String(required=False, allow_none=True)
    completion_percentage = fields.Integer(
        required=False, validate=validate.Range(min=0, max=100)
    )
    photo_url = fields.String(required=False, allow_none=True)