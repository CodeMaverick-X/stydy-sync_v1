#!/usr/bin/python3
"""Blueprint for authentication"""
import json

from flask import Blueprint, current_app, jsonify, make_response, request
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


@auth_bp.route('/login', methods=['POST'])
def login():
    """LOGIN view"""
    data = json.loads(request.get_data())
    username, password = data.values()
    user = User.find(username=username)
    if user:
        if password == user[0].password: # hash password
            print('Login')
        else:
            print('wrong password')
    else:
        print('user does not exist')
    
    return make_response(jsonify({'data': 'this is a test'})) # just a test

@auth_bp.route('/signup', methods=['POST'])
def signup():
    """SIGNUP view"""

    if request.is_json:
        data = json.loads(request.get_data())
        username, email, password, passwordConfirm = data.values()
        if User.find(username=username):
            return make_response(jsonify({'errormessage': 'username used'}), 400)
        if User.find(email=email):
            return make_response(jsonify({'errormessage': 'email used'}), 400)
        user = User(username=username, password=password, email=email)
        user.save() # save user
        
        return make_response(jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email
             }), 201)

    return make_response(jsonify({'errormessage' : 'request not json'}), 400)

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