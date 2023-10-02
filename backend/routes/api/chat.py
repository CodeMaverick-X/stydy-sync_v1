from flask import current_app, request
from flask_socketio import emit

from backend import socketio
from backend.routes.api import api_bp


@api_bp.route('/chat')
def chat():
    return 'helloworld'


@socketio.on('login')
def connected():
    print(request.sid)
    print('client is connected')
    emit('connect', {
        'data': f'id: {request.sid} is connected'
    })

@socketio.on('disconnect')
def disconnected():
    print('user disconnected')
    emit('disconnect', f'user {request.sid} has been disconnected', broadcast=True)

@socketio.on('data')
def handle_message(data):
    print('Data from the end: ', str(data))
    emit('data', {
        'data': f'{data}'
    }, broadcast=True) 

@socketio.on('message')
def handle_message(data):
    emit('message', data, broadcast=True)