from datetime import datetime
import bcrypt
from app.extensions import db


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(30), nullable=False)
    phone = db.Column(db.String(30))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, plain_password):
        hashed = bcrypt.hashpw(plain_password.encode('utf-8'), bcrypt.gensalt())
        self.password_hash = hashed.decode('utf-8')

    def check_password(self, plain_password):
        return bcrypt.checkpw(
            plain_password.encode('utf-8'),
            self.password_hash.encode('utf-8')
        )

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'phone': self.phone,
            'created_at': self.created_at.isoformat(),
        }