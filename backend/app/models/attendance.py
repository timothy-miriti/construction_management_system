from datetime import datetime
from app.extensions import db


class Attendance(db.Model):
    __tablename__ = 'attendance'

    id = db.Column(db.Integer, primary_key=True)
    worker_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    hours_worked = db.Column(db.Float, nullable=False, default=0)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    worker = db.relationship('User', foreign_keys=[worker_id])
    project = db.relationship('Project', backref='attendance_records')

    def to_dict(self):
        return {
            'id': self.id,
            'worker_id': self.worker_id,
            'worker_name': self.worker.name if self.worker else None,
            'project_id': self.project_id,
            'date': self.date.isoformat() if self.date else None,
            'hours_worked': self.hours_worked,
            'created_at': self.created_at.isoformat(),
        }