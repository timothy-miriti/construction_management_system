from flask import Blueprint, request, jsonify
from marshmallow import ValidationError

from app.extensions import db
from app.models.expense import Expense
from app.models.project import Project
from app.schemas.expense_schema import ExpenseSchema
from app.middleware.rbac import roles_required

expenses_bp = Blueprint('expenses', __name__, url_prefix='/api/expenses')
expense_schema = ExpenseSchema()


@expenses_bp.route('', methods=['GET'])
def list_expenses():
    project_id = request.args.get('project_id', type=int)
    query = Expense.query
    if project_id:
        query = query.filter_by(project_id=project_id)
    return jsonify([e.to_dict() for e in query.order_by(Expense.id.desc()).all()]), 200


@expenses_bp.route('/<int:expense_id>', methods=['GET'])
def get_expense(expense_id):
    expense = Expense.query.get(expense_id)
    if not expense:
        return jsonify({'error': 'Expense not found'}), 404
    return jsonify(expense.to_dict()), 200


@expenses_bp.route('', methods=['POST'])
@roles_required('admin', 'project_manager')
def create_expense():
    json_data = request.get_json(silent=True)
    if not json_data:
        return jsonify({'error': 'No input data provided'}), 400

    try:
        data = expense_schema.load(json_data)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400

    if not Project.query.get(data['project_id']):
        return jsonify({'error': 'project_id does not match any existing project'}), 400

    expense = Expense(**data)
    db.session.add(expense)
    db.session.commit()

    return jsonify(expense.to_dict()), 201


@expenses_bp.route('/<int:expense_id>', methods=['PUT'])
@roles_required('admin', 'project_manager')
def update_expense(expense_id):
    expense = Expense.query.get(expense_id)
    if not expense:
        return jsonify({'error': 'Expense not found'}), 404

    json_data = request.get_json(silent=True)
    if not json_data:
        return jsonify({'error': 'No input data provided'}), 400

    try:
        data = expense_schema.load(json_data, partial=True)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400

    for field, value in data.items():
        setattr(expense, field, value)

    db.session.commit()
    return jsonify(expense.to_dict()), 200


@expenses_bp.route('/<int:expense_id>', methods=['DELETE'])
@roles_required('admin', 'project_manager')
def delete_expense(expense_id):
    expense = Expense.query.get(expense_id)
    if not expense:
        return jsonify({'error': 'Expense not found'}), 404

    db.session.delete(expense)
    db.session.commit()
    return '', 204