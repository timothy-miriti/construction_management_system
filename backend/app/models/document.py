from datetime import datetime
from app.extensions import db


class Document(db.Model):
    __tablename__ = 'documents'

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    uploaded_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(150), nullable=False)
    file_url = db.Column(db.String(500), nullable=False)
    doc_type = db.Column(db.String(30), nullable=False, default='other')

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    project = db.relationship('Project', backref='documents')
    uploader = db.relationship('User', foreign_keys=[uploaded_by])

    def to_dict(self):
        return {
            'id': self.id,
            'project_id': self.project_id,
            'uploaded_by': self.uploaded_by,
            'uploader_name': self.uploader.name if self.uploader else None,
            'name': self.name,
            'file_url': self.file_url,
            'doc_type': self.doc_type,
            'created_at': self.created_at.isoformat(),
        }