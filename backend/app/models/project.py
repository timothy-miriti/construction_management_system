from datetime import datetime
from app.extensions import db


class Project(db.Model):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    location = db.Column(db.String(255))
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date)
    status = db.Column(db.String(30), nullable=False, default='planning')
    budget_total = db.Column(db.Float, default=0)

    manager_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    client_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    manager = db.relationship('User', foreign_keys=[manager_id])
    client = db.relationship('User', foreign_keys=[client_id])

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'location': self.location,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'status': self.status,
            'budget_total': self.budget_total,
            'manager_id': self.manager_id,
            'manager_name': self.manager.name if self.manager else None,
            'client_id': self.client_id,
            'client_name': self.client.name if self.client else None,
            'created_at': self.created_at.isoformat(),
        }