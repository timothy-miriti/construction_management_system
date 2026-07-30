from marshmallow import Schema, fields, validate


class RegisterSchema(Schema):
    name = fields.String(required=True, validate=validate.Length(min=2, max=120))
    email = fields.Email(required=True)
    password = fields.String(required=True, validate=validate.Length(min=6))
    role = fields.String(
        required=True,
        validate=validate.OneOf(
            ['admin', 'project_manager', 'engineer', 'contractor', 'worker', 'client']
        ),
    )
    phone = fields.String(required=False, allow_none=True)


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True)