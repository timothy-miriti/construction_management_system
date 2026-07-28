from marshmallow import Schema, fields, validate


class DocumentSchema(Schema):
    project_id = fields.Integer(required=True)
    uploaded_by = fields.Integer(required=True)
    name = fields.String(required=True, validate=validate.Length(min=1, max=150))
    file_url = fields.String(required=True)
    doc_type = fields.String(
        required=False,
        validate=validate.OneOf(['contract', 'blueprint', 'permit', 'other']),
    )