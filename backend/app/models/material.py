from datetime import datetime
from app.extensions import db


class Material(db.Model):
    __tablename__ = 'materials'

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    quantity = db.Column(db.Float, default=0)
    unit_cost = db.Column(db.Float, default=0)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    project = db.relationship('Project', backref='materials')

    def to_dict(self):
        return {
            'id': self.id,
            'project_id': self.project_id,
            'name': self.name,
            'quantity': self.quantity,
            'unit_cost': self.unit_cost,
            'total_cost': round(self.quantity * self.unit_cost, 2),
            'created_at': self.created_at.isoformat(),
        }