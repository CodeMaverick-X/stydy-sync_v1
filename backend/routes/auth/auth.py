#!/usr/bin/python3
"""Blueprint for authentication"""
from flask import Blueprint, current_app, jsonify
from flask_login import (LoginManager, current_user, login_required,
                         login_user, logout_user)

from backend.models import User, db

with current_app.app_context():
    db.create_all()

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')


login_manager = LoginManager()
login_manager.init_app(current_app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

"""AUTH ROUTES"""


@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    """LOGIN view"""
    user = User(username="reinhard_02", email="reinhard_02@mail.com")
    user.save()
    login_user(user)

    return [user.email, 'logged in']

@auth_bp.route('/signup', methods=['POST'])
def signup():
    """SIGNUP view"""
    return 'signed up'

@auth_bp.route('/home', methods=['GET'])
@login_required
def index():
    """HOME view"""
    return f'this is the home page for {current_user.username}'


@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    """LOGOUT view"""
    logout_user()
    return 'logged out'