from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt


from app.extensions import db
from app.models.user import User
from app.schemas.auth_schema import RegisterSchema, LoginSchema

from app.middleware.rbac import roles_required


auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')



# register
register_schema = RegisterSchema()


@auth_bp.route('/register', methods=['POST'])
def register():
    json_data = request.get_json(silent=True)
    if not json_data:
        return jsonify({'error': 'No input data provided'}), 400

    try:
        data = register_schema.load(json_data)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'A user with this email already exists'}), 409

    user = User(
        name=data['name'],
        email=data['email'],
        role=data['role'],
        phone=data.get('phone'),
    )
    user.set_password(data['password'])

    db.session.add(user)
    db.session.commit()

    return jsonify(user.to_dict()), 201

#LOGIN
login_schema = LoginSchema()


@auth_bp.route('/login', methods=['POST'])
def login():
    json_data = request.get_json(silent=True)
    if not json_data:
        return jsonify({'error': 'No input data provided'}), 400

    try:
        data = login_schema.load(json_data)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400

    user = User.query.filter_by(email=data['email']).first()

    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={'role': user.role},
    )

    return jsonify({
        'access_token': access_token,
        'user': user.to_dict(),
    }), 200

from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify(user.to_dict()), 200



