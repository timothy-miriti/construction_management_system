from marshmallow import Schema, fields, validate


class AttendanceSchema(Schema):
    worker_id = fields.Integer(required=True)
    project_id = fields.Integer(required=True)
    date = fields.Date(required=False)
    hours_worked = fields.Float(required=True, validate=validate.Range(min=0, max=24))