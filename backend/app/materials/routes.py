from flask import Blueprint, request, jsonify
from marshmallow import ValidationError

from app.extensions import db
from app.models.material import Material
from app.models.project import Project
from app.schemas.material_schema import MaterialSchema
from app.middleware.rbac import roles_required

materials_bp = Blueprint('materials', __name__, url_prefix='/api/materials')
material_schema = MaterialSchema()


@materials_bp.route('', methods=['GET'])
def list_materials():
    project_id = request.args.get('project_id', type=int)
    query = Material.query
    if project_id:
        query = query.filter_by(project_id=project_id)
    return jsonify([m.to_dict() for m in query.order_by(Material.id.desc()).all()]), 200


@materials_bp.route('/<int:material_id>', methods=['GET'])
def get_material(material_id):
    material = Material.query.get(material_id)
    if not material:
        return jsonify({'error': 'Material not found'}), 404
    return jsonify(material.to_dict()), 200


@materials_bp.route('', methods=['POST'])
@roles_required('admin', 'project_manager')
def create_material():
    json_data = request.get_json(silent=True)
    if not json_data:
        return jsonify({'error': 'No input data provided'}), 400

    try:
        data = material_schema.load(json_data)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400

    if not Project.query.get(data['project_id']):
        return jsonify({'error': 'project_id does not match any existing project'}), 400

    material = Material(**data)
    db.session.add(material)
    db.session.commit()

    return jsonify(material.to_dict()), 201


@materials_bp.route('/<int:material_id>', methods=['PUT'])
@roles_required('admin', 'project_manager')
def update_material(material_id):
    material = Material.query.get(material_id)
    if not material:
        return jsonify({'error': 'Material not found'}), 404

    json_data = request.get_json(silent=True)
    if not json_data:
        return jsonify({'error': 'No input data provided'}), 400

    try:
        data = material_schema.load(json_data, partial=True)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400

    for field, value in data.items():
        setattr(material, field, value)

    db.session.commit()
    return jsonify(material.to_dict()), 200


@materials_bp.route('/<int:material_id>', methods=['DELETE'])
@roles_required('admin', 'project_manager')
def delete_material(material_id):
    material = Material.query.get(material_id)
    if not material:
        return jsonify({'error': 'Material not found'}), 404

    db.session.delete(material)
    db.session.commit()
    return '', 204