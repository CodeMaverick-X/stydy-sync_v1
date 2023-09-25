from flask import request

from backend import socketio
from backend.routes.api import api_bp


@api_bp.route('/chat')
def chat():
    return 'helloworld'

@socketio.on('message')
def handle_message(data):
    print('recieved: ' + data)
