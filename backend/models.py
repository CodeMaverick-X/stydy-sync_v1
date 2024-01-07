import uuid
from datetime import datetime

from flask_login import UserMixin
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.event import listens_for

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
        db.session.refresh(self)

    @classmethod
    def find(cls, **kwargs):
        """find object based on params"""
        return cls.query.filter_by(**kwargs).all()

group_members = db.Table('group_members',
    db.Column('group_id', db.String(36), db.ForeignKey('groups.id')),
    db.Column('user_id', db.String(36), db.ForeignKey('users.secodary_id'))
)

class User(UserMixin, Base):
    """user model"""
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(db.Integer, primary_key=True)
    secodary_id: Mapped[str] = mapped_column(db.String(36), default=generate_uuid, unique=True)
    username: Mapped[str] = mapped_column(db.String(50), unique=True)
    email: Mapped[str] = mapped_column(db.String(100), unique=True)
    password: Mapped[str] = mapped_column(db.String(100), unique=False)
    groups = db.relationship('Group', secondary=group_members, back_populates='members')
    messages = db.relationship('Message', back_populates='user')
    created_at: Mapped[datetime] = mapped_column(db.DateTime, default=datetime.utcnow)

class Group(Base):
    """Group model for group chats"""

    __tablename__ = 'groups'

    id: Mapped[str] = mapped_column(db.String(36), primary_key=True, default=generate_uuid, unique=True)
    owner_id: Mapped[str] = mapped_column(db.String(36), db.ForeignKey('users.secodary_id'))
    # content = mapped_column(db.String(200), unique=False)
    created_at: Mapped[datetime] = mapped_column(db.DateTime, default=datetime.utcnow)
    members = db.relationship('User', secondary=group_members, back_populates='groups')
    name: Mapped[str] = mapped_column(db.String(50), unique=False)
    messages: Mapped[str] = db.relationship('Message', back_populates='group', order_by='asc(Message.created_at)')


    def to_dict(self):
        """return dict of obj for serialization"""
        new_dict = {}
        db.session.refresh(self)
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

    id: Mapped[str] = mapped_column(db.String(36), primary_key=True, default=generate_uuid, unique=True)
    owner_id: Mapped[str] = mapped_column(db.String(36), db.ForeignKey('users.secodary_id'))
    user = db.relationship('User', back_populates='messages')
    content: Mapped[str] = mapped_column(db.String(200), unique=False)
    created_at: Mapped[datetime] = mapped_column(db.DateTime, default=datetime.utcnow)
    sort_number = mapped_column(db.Integer)
    group = db.relationship('Group', back_populates='messages')
    group_id: Mapped[str] = mapped_column(db.String(36), db.ForeignKey('groups.id'))

    username: Mapped[str] = mapped_column(db.String(50), nullable=False)


    @classmethod
    def get(cls, **kwargs):
        """returns messages ordered by created at"""
        return cls.query.order_by(cls.created_at).all()

    def to_dict(self):
        """return dict of obj for serialisation"""
        new_dict = {}
        db.session.refresh(self)
        # print(self, self.content, 'the self and dict') # bugg from something greater than me needs this

        for key, value in self.__dict__.items():
            if key != 'group' and key != 'user' and key != '_sa_instance_state':
                if key == 'created_at' and isinstance(value, datetime):
                    new_dict[key] = value.strftime('%Y-%m-%d %H:%M:%S')  # Format the datetime as a string
                else:
                    new_dict[key] = value
        # print(new_dict, 'from to dict funct---------------')
        return new_dict

@listens_for(Message, 'before_insert')
def before_message_insert(mapper, connection, target):
    target.username = target.user.username
