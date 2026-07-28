from marshmallow import Schema, fields


class ExpenseSchema(Schema):
    project_id = fields.Integer(required=True)
    category = fields.String(required=True)
    planned_amount = fields.Float(required=False)
    actual_amount = fields.Float(required=False)
    date = fields.Date(required=False)