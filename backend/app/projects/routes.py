from flask import Blueprint, request, jsonify
from marshmallow import ValidationError

from app.extensions import db
from app.models.project import Project
from app.models.user import User
from app.schemas.project_schema import ProjectSchema
from app.middleware.rbac import roles_required

projects_bp = Blueprint('projects', __name__, url_prefix='/api/projects')

project_schema = ProjectSchema()


@projects_bp.route('', methods=['GET'])
def list_projects():
    projects = Project.query.order_by(Project.id.desc()).all()
    return jsonify([p.to_dict() for p in projects]), 200


@projects_bp.route('/<int:project_id>', methods=['GET'])
def get_project(project_id):
    project = Project.query.get(project_id)
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    return jsonify(project.to_dict()), 200


@projects_bp.route('', methods=['POST'])
@roles_required('admin', 'project_manager')
def create_project():
    json_data = request.get_json(silent=True)
    if not json_data:
        return jsonify({'error': 'No input data provided'}), 400

    try:
        data = project_schema.load(json_data)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400

    manager = User.query.get(data['manager_id'])
    if not manager:
        return jsonify({'error': 'manager_id does not match any existing user'}), 400

    if 'client_id' in data and data['client_id'] is not None:
        client = User.query.get(data['client_id'])
        if not client:
            return jsonify({'error': 'client_id does not match any existing user'}), 400

    project = Project(
        name=data['name'],
        location=data.get('location'),
        start_date=data['start_date'],
        end_date=data.get('end_date'),
        status=data.get('status', 'planning'),
        budget_total=data.get('budget_total', 0),
        manager_id=data['manager_id'],
        client_id=data.get('client_id'),
    )

    db.session.add(project)
    db.session.commit()

    return jsonify(project.to_dict()), 201

@projects_bp.route('/<int:project_id>', methods=['PUT'])
@roles_required('admin', 'project_manager')
def update_project(project_id):
    project = Project.query.get(project_id)
    if not project:
        return jsonify({'error': 'Project not found'}), 404

    json_data = request.get_json(silent=True)
    if not json_data:
        return jsonify({'error': 'No input data provided'}), 400

    try:
        data = project_schema.load(json_data, partial=True)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400

    if 'manager_id' in data:
        manager = User.query.get(data['manager_id'])
        if not manager:
            return jsonify({'error': 'manager_id does not match any existing user'}), 400

    if 'client_id' in data and data['client_id'] is not None:
        client = User.query.get(data['client_id'])
        if not client:
            return jsonify({'error': 'client_id does not match any existing user'}), 400

    for field, value in data.items():
        setattr(project, field, value)

    db.session.commit()

    return jsonify(project.to_dict()), 200


@projects_bp.route('/<int:project_id>', methods=['DELETE'])
@roles_required('admin')
def delete_project(project_id):
    project = Project.query.get(project_id)
    if not project:
        return jsonify({'error': 'Project not found'}), 404

    db.session.delete(project)
    db.session.commit()

    return '', 204