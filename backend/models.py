import uuid
from datetime import datetime

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

group_members = db.Table('group_members',
    db.Column('group_id', db.String(36), db.ForeignKey('groups.id')),
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'))
)

class User(UserMixin, Base):
    """user model"""
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    secodary_id = db.Column(db.String(36), default=generate_uuid, unique=True)
    username = db.Column(db.String(50), unique=True)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100), unique=False)
    groups = db.relationship('Group', secondary=group_members, back_populates='members')
    messages = db.relationship('Message', back_populates='user')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Group(Base):
    """Group model for group chats"""

    __tablename__ = 'groups'

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid, unique=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    content = db.Column(db.String(200), unique=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    members = db.relationship('User', secondary=group_members, back_populates='groups')
    name = db.Column(db.String(50), unique=False)
    messages = db.relationship('Message', back_populates='group')


    def to_dict(self):
        """return dict of obj for serialization"""
        new_dict = {}
        for key, value in self.__dict__.items():
            if key != 'messages' and key != 'members' and key != '_sa_instance_state':
                if key == 'created_at' and isinstance(value, datetime):
                    new_dict[key] = value.strftime('%Y-%m-%d %H:%M:%S')  # Format the datetime as a string
                else:
                    new_dict[key] = value
        return new_dict


class Message(Base):
    """Message model for message objects"""

    __tablename__ = 'messages'

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid, unique=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('User', back_populates='messages')
    content = db.Column(db.String(200), unique=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    sort_number = db.Column(db.Integer)
    group = db.relationship('Group', back_populates='messages')
    group_id = db.Column(db.String(36), db.ForeignKey('groups.id'))


    @classmethod
    def get(cls, **kwargs):
        """returns messages ordered by created at"""
        return cls.query.order_by(cls.created_at).all()

    def to_dict(self):
        """return dict of obj for serialisation"""
        new_dict = {}
        print(self, self.content, 'the self and dict') # bugg from something greater than me needs this

        for key, value in self.__dict__.items():
            if key != 'group' and key != 'user' and key != '_sa_instance_state':
                if key == 'created_at' and isinstance(value, datetime):
                    new_dict[key] = value.strftime('%Y-%m-%d %H:%M:%S')  # Format the datetime as a string
                else:
                    new_dict[key] = value
        # print(new_dict, 'from to dict funct---------------')
        return new_dict

