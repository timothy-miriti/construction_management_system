
from flask import Flask
from app.config import config
from app.extensions import db, migrate, jwt, cors

from app.auth.routes import auth_bp
from app.projects.routes import projects_bp
from app.tasks.routes import tasks_bp
from app.expenses.routes import expenses_bp
from app.materials.routes import materials_bp
from app.equipment.routes import equipment_bp
from app.attendance.routes import attendance_bp
from app.progress_reports.routes import progress_reports_bp
from app.documents.routes import documents_bp
from app.dashboard.routes import dashboard_bp



def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app)

    with app.app_context():
        from app import models

    app.register_blueprint(auth_bp)
    app.register_blueprint(projects_bp)
    app.register_blueprint(tasks_bp)
    app.register_blueprint(expenses_bp)
    app.register_blueprint(materials_bp)
    app.register_blueprint(equipment_bp)
    app.register_blueprint(attendance_bp)
    app.register_blueprint(progress_reports_bp)
    app.register_blueprint(documents_bp)
    app.register_blueprint(dashboard_bp)


    @app.route('/api/health')
    def health_check():
        return {'status': 'ok'}

    return app