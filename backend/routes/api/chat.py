from flask import current_app, request
from flask_socketio import SocketIO

from backend.routes.api import api_bp

socketio = SocketIO(current_app)

@api_bp.route('/chat')
def chat():
    return 'helloworld'

@socketio.on('message')
def handle_message(data):
    print('recieved: ' + data)
