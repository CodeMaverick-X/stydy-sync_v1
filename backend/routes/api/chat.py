from flask import current_app, request
from flask_socketio import SocketIO, emit

from backend.routes.api import api_bp

print('[[[###+++DEBUGGING+++###]]]] befor socket io int')
# socketio = SocketIO(current_app)

@api_bp.route('/chat')
def chat():
    return 'helloworld'
print('[[[###+++DEBUGGING+++###]]]]beofr handler')

# @socketio.on('message')
# def handle_message(data):
#     print('[[[###+++DEBUGGING+++###]]]]')
#     emit('message', data, broadcast=True)
#     print('[[[###+++DEBUGGING+++###]]]]')
