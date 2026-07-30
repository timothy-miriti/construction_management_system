from flask import Blueprint, request, jsonify
from marshmallow import ValidationError

from app.extensions import db
from app.models.attendance import Attendance
from app.models.project import Project
from app.models.user import User
from app.schemas.attendance_schema import AttendanceSchema
from app.middleware.rbac import roles_required

attendance_bp = Blueprint('attendance', __name__, url_prefix='/api/attendance')
attendance_schema = AttendanceSchema()


def validate_related_ids(data):
    if 'worker_id' in data and not User.query.get(data['worker_id']):
        return 'worker_id does not match any existing user'
    if 'project_id' in data and not Project.query.get(data['project_id']):
        return 'project_id does not match any existing project'
    return None


@attendance_bp.route('', methods=['GET'])
def list_attendance():
    project_id = request.args.get('project_id', type=int)
    worker_id = request.args.get('worker_id', type=int)
    query = Attendance.query
    if project_id:
        query = query.filter_by(project_id=project_id)
    if worker_id:
        query = query.filter_by(worker_id=worker_id)
    return jsonify([a.to_dict() for a in query.order_by(Attendance.id.desc()).all()]), 200


@attendance_bp.route('', methods=['POST'])
@roles_required('admin', 'project_manager', 'contractor', 'worker')
def create_attendance():
    json_data = request.get_json(silent=True)
    if not json_data:
        return jsonify({'error': 'No input data provided'}), 400

    try:
        data = attendance_schema.load(json_data)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400

    error = validate_related_ids(data)
    if error:
        return jsonify({'error': error}), 400

    record = Attendance(**data)
    db.session.add(record)
    db.session.commit()

    return jsonify(record.to_dict()), 201


@attendance_bp.route('/<int:attendance_id>', methods=['PUT'])
@roles_required('admin', 'project_manager')
def update_attendance(attendance_id):
    record = Attendance.query.get(attendance_id)
    if not record:
        return jsonify({'error': 'Attendance record not found'}), 404

    json_data = request.get_json(silent=True)
    if not json_data:
        return jsonify({'error': 'No input data provided'}), 400

    try:
        data = attendance_schema.load(json_data, partial=True)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400

    error = validate_related_ids(data)
    if error:
        return jsonify({'error': error}), 400

    for field, value in data.items():
        setattr(record, field, value)

    db.session.commit()
    return jsonify(record.to_dict()), 200


@attendance_bp.route('/<int:attendance_id>', methods=['DELETE'])
@roles_required('admin', 'project_manager')
def delete_attendance(attendance_id):
    record = Attendance.query.get(attendance_id)
    if not record:
        return jsonify({'error': 'Attendance record not found'}), 404

    db.session.delete(record)
    db.session.commit()
    return '', 204