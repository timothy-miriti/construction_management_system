from datetime import datetime
from app.extensions import db


class Expense(db.Model):
    __tablename__ = 'expenses'

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    category = db.Column(db.String(80), nullable=False)
    planned_amount = db.Column(db.Float, default=0)
    actual_amount = db.Column(db.Float, default=0)
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    project = db.relationship('Project', backref='expenses')

    def to_dict(self):
        return {
            'id': self.id,
            'project_id': self.project_id,
            'category': self.category,
            'planned_amount': self.planned_amount,
            'actual_amount': self.actual_amount,
            'date': self.date.isoformat() if self.date else None,
            'created_at': self.created_at.isoformat(),
        }