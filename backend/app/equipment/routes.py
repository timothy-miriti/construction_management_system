from flask import Blueprint, request, jsonify
from marshmallow import ValidationError

from app.extensions import db
from app.models.equipment import Equipment
from app.models.project import Project
from app.models.user import User
from app.schemas.equipment_schema import EquipmentSchema
from app.middleware.rbac import roles_required

equipment_bp = Blueprint('equipment', __name__, url_prefix='/api/equipment')
equipment_schema = EquipmentSchema()


def validate_related_ids(data):
    if 'project_id' in data and not Project.query.get(data['project_id']):
        return 'project_id does not match any existing project'
    if data.get('assigned_to') is not None and not User.query.get(data['assigned_to']):
        return 'assigned_to does not match any existing user'
    return None


@equipment_bp.route('', methods=['GET'])
def list_equipment():
    project_id = request.args.get('project_id', type=int)
    query = Equipment.query
    if project_id:
        query = query.filter_by(project_id=project_id)
    return jsonify([e.to_dict() for e in query.order_by(Equipment.id.desc()).all()]), 200


@equipment_bp.route('/<int:equipment_id>', methods=['GET'])
def get_equipment(equipment_id):
    item = Equipment.query.get(equipment_id)
    if not item:
        return jsonify({'error': 'Equipment not found'}), 404
    return jsonify(item.to_dict()), 200


@equipment_bp.route('', methods=['POST'])
@roles_required('admin', 'project_manager')
def create_equipment():
    json_data = request.get_json(silent=True)
    if not json_data:
        return jsonify({'error': 'No input data provided'}), 400

    try:
        data = equipment_schema.load(json_data)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400

    error = validate_related_ids(data)
    if error:
        return jsonify({'error': error}), 400

    item = Equipment(**data)
    db.session.add(item)
    db.session.commit()

    return jsonify(item.to_dict()), 201


@equipment_bp.route('/<int:equipment_id>', methods=['PUT'])
@roles_required('admin', 'project_manager')
def update_equipment(equipment_id):
    item = Equipment.query.get(equipment_id)
    if not item:
        return jsonify({'error': 'Equipment not found'}), 404

    json_data = request.get_json(silent=True)
    if not json_data:
        return jsonify({'error': 'No input data provided'}), 400

    try:
        data = equipment_schema.load(json_data, partial=True)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400

    error = validate_related_ids(data)
    if error:
        return jsonify({'error': error}), 400

    for field, value in data.items():
        setattr(item, field, value)

    db.session.commit()
    return jsonify(item.to_dict()), 200


@equipment_bp.route('/<int:equipment_id>', methods=['DELETE'])
@roles_required('admin', 'project_manager')
def delete_equipment(equipment_id):
    item = Equipment.query.get(equipment_id)
    if not item:
        return jsonify({'error': 'Equipment not found'}), 404

    db.session.delete(item)
    db.session.commit()
    return '', 204