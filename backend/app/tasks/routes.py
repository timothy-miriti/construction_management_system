from flask import Blueprint, request, jsonify
from marshmallow import ValidationError

from app.extensions import db
from app.models.task import Task
from app.models.project import Project
from app.models.user import User
from app.schemas.task_schema import TaskSchema
from app.middleware.rbac import roles_required

tasks_bp = Blueprint('tasks', __name__, url_prefix='/api/tasks')

task_schema = TaskSchema()


def validate_related_ids(data):
    """Checks foreign key fields point to real rows. Returns an error string, or None if all good."""
    if 'project_id' in data:
        if not Project.query.get(data['project_id']):
            return 'project_id does not match any existing project'

    if data.get('assigned_to') is not None:
        if not User.query.get(data['assigned_to']):
            return 'assigned_to does not match any existing user'

    if data.get('depends_on') is not None:
        if not Task.query.get(data['depends_on']):
            return 'depends_on does not match any existing task'

    return None


@tasks_bp.route('', methods=['GET'])
def list_tasks():
    project_id = request.args.get('project_id', type=int)
    query = Task.query
    if project_id:
        query = query.filter_by(project_id=project_id)
    tasks = query.order_by(Task.id.desc()).all()
    return jsonify([t.to_dict() for t in tasks]), 200


@tasks_bp.route('/<int:task_id>', methods=['GET'])
def get_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    return jsonify(task.to_dict()), 200


@tasks_bp.route('', methods=['POST'])
@roles_required('admin', 'project_manager')
def create_task():
    json_data = request.get_json(silent=True)
    if not json_data:
        return jsonify({'error': 'No input data provided'}), 400

    try:
        data = task_schema.load(json_data)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400

    error = validate_related_ids(data)
    if error:
        return jsonify({'error': error}), 400

    task = Task(
        project_id=data['project_id'],
        title=data['title'],
        assigned_to=data.get('assigned_to'),
        start_date=data.get('start_date'),
        end_date=data.get('end_date'),
        status=data.get('status', 'not_started'),
        depends_on=data.get('depends_on'),
    )

    db.session.add(task)
    db.session.commit()

    return jsonify(task.to_dict()), 201


@tasks_bp.route('/<int:task_id>', methods=['PUT'])
@roles_required('admin', 'project_manager')
def update_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({'error': 'Task not found'}), 404

    json_data = request.get_json(silent=True)
    if not json_data:
        return jsonify({'error': 'No input data provided'}), 400

    try:
        data = task_schema.load(json_data, partial=True)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400

    error = validate_related_ids(data)
    if error:
        return jsonify({'error': error}), 400

    for field, value in data.items():
        setattr(task, field, value)

    db.session.commit()

    return jsonify(task.to_dict()), 200


@tasks_bp.route('/<int:task_id>', methods=['DELETE'])
@roles_required('admin', 'project_manager')
def delete_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({'error': 'Task not found'}), 404

    db.session.delete(task)
    db.session.commit()

    return '', 204