from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from app.models.project import Project
from app.models.task import Task
from app.models.expense import Expense

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')


@dashboard_bp.route('', methods=['GET'])
@jwt_required()
def get_dashboard():
    projects = Project.query.all()
    tasks = Task.query.all()
    expenses = Expense.query.all()

    total_projects = len(projects)
    active_projects = sum(1 for p in projects if p.status == 'in_progress')
    completed_projects = sum(1 for p in projects if p.status == 'complete')
    total_budget = sum(p.budget_total or 0 for p in projects)

    total_tasks = len(tasks)
    completed_tasks = sum(1 for t in tasks if t.status == 'done')
    task_completion_rate = round((completed_tasks / total_tasks * 100), 1) if total_tasks else 0

    total_planned = sum(e.planned_amount or 0 for e in expenses)
    total_actual = sum(e.actual_amount or 0 for e in expenses)

    recent_projects = sorted(projects, key=lambda p: p.id, reverse=True)[:5]

    return jsonify({
        'total_projects': total_projects,
        'active_projects': active_projects,
        'completed_projects': completed_projects,
        'total_budget': total_budget,
        'total_tasks': total_tasks,
        'completed_tasks': completed_tasks,
        'task_completion_rate': task_completion_rate,
        'total_planned_expenses': total_planned,
        'total_actual_expenses': total_actual,
        'recent_projects': [p.to_dict() for p in recent_projects],
    }), 200