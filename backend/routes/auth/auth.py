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
            user = user[0]
            login_user(user) # login user
            return make_response(jsonify({
            'id': current_user.id,
            'username': user.username,
            'email': user.email
             }), 200)
        else:
            return make_response(jsonify({'errormessage': 'wrong username or password'}), 401)
    else:
        return make_response(jsonify({'errormessage': 'wrong username or password'}), 401)
    


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
        login_user(user) # login user
        
        return make_response(jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email
             }), 201)

    return make_response(jsonify({'errormessage' : 'request not json'}), 400)

# @auth_bp.route('/home', methods=['GET'])
# @login_required
# def index():
    # """HOME view"""
    # return f'this is the home page for {current_user.username}'


@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    """LOGOUT view"""
    if current_user:
        logout_user()
        response = make_response(jsonify({'message': 'logged out'}), 200)
        response.headers['Access-Control-Allow-Origin'] = 'http://127.0.0.1:5000'  # Update with your actual frontend origin
        
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        
        return response
    return make_response(jsonify({'errormessage': 'something wrong with session'}))

@login_manager.unauthorized_handler
def unauthorized():
    """return for unauthorized to stop an html error page from been sent"""
    return make_response(jsonify({'errormessage': 'unauthorized'}), 401)
