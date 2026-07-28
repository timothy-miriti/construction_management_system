from flask import Blueprint, request, jsonify
from marshmallow import ValidationError

from app.extensions import db
from app.models.document import Document
from app.models.project import Project
from app.models.user import User
from app.schemas.document_schema import DocumentSchema
from app.middleware.rbac import roles_required

documents_bp = Blueprint('documents', __name__, url_prefix='/api/documents')
document_schema = DocumentSchema()


def validate_related_ids(data):
    if 'project_id' in data and not Project.query.get(data['project_id']):
        return 'project_id does not match any existing project'
    if 'uploaded_by' in data and not User.query.get(data['uploaded_by']):
        return 'uploaded_by does not match any existing user'
    return None


@documents_bp.route('', methods=['GET'])
def list_documents():
    project_id = request.args.get('project_id', type=int)
    query = Document.query
    if project_id:
        query = query.filter_by(project_id=project_id)
    return jsonify([d.to_dict() for d in query.order_by(Document.id.desc()).all()]), 200


@documents_bp.route('', methods=['POST'])
@roles_required('admin', 'project_manager', 'engineer')
def create_document():
    json_data = request.get_json(silent=True)
    if not json_data:
        return jsonify({'error': 'No input data provided'}), 400

    try:
        data = document_schema.load(json_data)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400

    error = validate_related_ids(data)
    if error:
        return jsonify({'error': error}), 400

    document = Document(**data)
    db.session.add(document)
    db.session.commit()

    return jsonify(document.to_dict()), 201


@documents_bp.route('/<int:document_id>', methods=['DELETE'])
@roles_required('admin', 'project_manager')
def delete_document(document_id):
    document = Document.query.get(document_id)
    if not document:
        return jsonify({'error': 'Document not found'}), 404

    db.session.delete(document)
    db.session.commit()
    return '', 204