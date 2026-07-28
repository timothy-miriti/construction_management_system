from datetime import datetime
from app.extensions import db


class Task(db.Model):
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    title = db.Column(db.String(150), nullable=False)
    assigned_to = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    start_date = db.Column(db.Date, nullable=True)
    end_date = db.Column(db.Date, nullable=True)
    status = db.Column(db.String(30), nullable=False, default='not_started')
    depends_on = db.Column(db.Integer, db.ForeignKey('tasks.id'), nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    project = db.relationship('Project', backref='tasks')
    assignee = db.relationship('User', foreign_keys=[assigned_to])
    dependency = db.relationship('Task', remote_side=[id])

    def to_dict(self):
        return {
            'id': self.id,
            'project_id': self.project_id,
            'title': self.title,
            'assigned_to': self.assigned_to,
            'assignee_name': self.assignee.name if self.assignee else None,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'status': self.status,
            'depends_on': self.depends_on,
            'depends_on_title': self.dependency.title if self.dependency else None,
            'created_at': self.created_at.isoformat(),
        }