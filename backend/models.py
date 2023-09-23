import uuid

from flask_login import UserMixin

from backend import db


def generate_uuid():
    """Generate a new UUID for the 'id' field"""
    return str(uuid.uuid4())
class Base(db.Model):
    """base model to hold some methods inherited by subclasses"""
    __abstract__ = True

    def save(self):
        """save the object to the database"""
        db.session.add(self)
        db.session.commit()

    @classmethod
    def find(cls, **kwargs):
        """find object based on params"""
        return cls.query.filter_by(**kwargs).all()

class User(UserMixin, Base):
    """user model"""
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    secodary_id = db.Column(db.String(36), default=generate_uuid, unique=True)
    username = db.Column(db.String(50), unique=True)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100), unique=False)
