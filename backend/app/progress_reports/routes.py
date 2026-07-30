from flask import Blueprint, request, jsonify
from marshmallow import ValidationError

from app.extensions import db
from app.models.progress_report import ProgressReport
from app.models.project import Project
from app.models.user import User
from app.schemas.progress_report_schema import ProgressReportSchema
from app.middleware.rbac import roles_required

progress_reports_bp = Blueprint('progress_reports', __name__, url_prefix='/api/progress-reports')
progress_report_schema = ProgressReportSchema()


def validate_related_ids(data):
    if 'project_id' in data and not Project.query.get(data['project_id']):
        return 'project_id does not match any existing project'
    if 'submitted_by' in data and not User.query.get(data['submitted_by']):
        return 'submitted_by does not match any existing user'
    return None


@progress_reports_bp.route('', methods=['GET'])
def list_progress_reports():
    project_id = request.args.get('project_id', type=int)
    query = ProgressReport.query
    if project_id:
        query = query.filter_by(project_id=project_id)
    return jsonify([r.to_dict() for r in query.order_by(ProgressReport.id.desc()).all()]), 200


@progress_reports_bp.route('', methods=['POST'])
@roles_required('admin', 'project_manager', 'engineer', 'contractor')
def create_progress_report():
    json_data = request.get_json(silent=True)
    if not json_data:
        return jsonify({'error': 'No input data provided'}), 400

    try:
        data = progress_report_schema.load(json_data)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400

    error = validate_related_ids(data)
    if error:
        return jsonify({'error': error}), 400

    report = ProgressReport(**data)
    db.session.add(report)
    db.session.commit()

    return jsonify(report.to_dict()), 201


@progress_reports_bp.route('/<int:report_id>', methods=['PUT'])
@roles_required('admin', 'project_manager', 'engineer', 'contractor')
def update_progress_report(report_id):
    report = ProgressReport.query.get(report_id)
    if not report:
        return jsonify({'error': 'Progress report not found'}), 404

    json_data = request.get_json(silent=True)
    if not json_data:
        return jsonify({'error': 'No input data provided'}), 400

    try:
        data = progress_report_schema.load(json_data, partial=True)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400

    error = validate_related_ids(data)
    if error:
        return jsonify({'error': error}), 400

    for field, value in data.items():
        setattr(report, field, value)

    db.session.commit()
    return jsonify(report.to_dict()), 200


@progress_reports_bp.route('/<int:report_id>', methods=['DELETE'])
@roles_required('admin', 'project_manager')
def delete_progress_report(report_id):
    report = ProgressReport.query.get(report_id)
    if not report:
        return jsonify({'error': 'Progress report not found'}), 404

    db.session.delete(report)
    db.session.commit()
    return '', 204