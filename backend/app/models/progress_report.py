from datetime import datetime
from app.extensions import db


class ProgressReport(db.Model):
    __tablename__ = 'progress_reports'

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    submitted_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    description = db.Column(db.Text)
    completion_percentage = db.Column(db.Integer, default=0)
    photo_url = db.Column(db.String(500))

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    project = db.relationship('Project', backref='progress_reports')
    submitter = db.relationship('User', foreign_keys=[submitted_by])

    def to_dict(self):
        return {
            'id': self.id,
            'project_id': self.project_id,
            'submitted_by': self.submitted_by,
            'submitter_name': self.submitter.name if self.submitter else None,
            'date': self.date.isoformat() if self.date else None,
            'description': self.description,
            'completion_percentage': self.completion_percentage,
            'photo_url': self.photo_url,
            'created_at': self.created_at.isoformat(),
        }