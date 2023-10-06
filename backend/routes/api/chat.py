import json

from flask import current_app, g, jsonify, make_response, request, session
from flask_login import current_user, login_required
from flask_socketio import emit, join_room, leave_room

from backend import socketio
from backend.models import Group, Message, User
from backend.routes.api import api_bp

# web-socket listeners
# @socketio.on('login')
# def connected():
#     print(request.sid)
#     print('client is connected')
#     emit('connect', {
#         'data': f'id: {request.sid} is connected'
#     })


@socketio.on('join')
def join_group(data):
    group_id = data['group_id']
    user_id = data['user_id']
    room = str(group_id)
    join_room(room)
    emit('join_notification', {'message': f'{user_id} has joined the chat'}, room=room) # TODO: implement notification

@socketio.on('leave')
def leave_group(data):
    group_id = data['group_id']
    user_id = data['user_id']
    room = str(group_id)
    leave_group(room)
    emit('leave_notification', {'message': f'{user_id} has left the chat'}, room=room) # TODO: implement notification

@socketio.on('disconnect')
def disconnected():
    print('user disconnected')
    emit('disconnect',
         f'user {request.sid} has been disconnected', broadcast=True)


@socketio.on('data')
def handle_message(data):
    message = data['message']
    group_id = data['group_id']
    user_id = data['user_id']

    room = str(group_id)
    group = Group.find(id=group_id)
    user = User.find(id=user_id)
    # print(f'{group_id} ------ {user_id} ------- {message}')
    if group and user:
        user = user[0]
        group = group[0]
        message_obj = Message(
            owner_id=user.id,
            user=user,
            content=message,
            group_id=group_id,
            group=group
            )
        message_obj.save()
        message = message_obj.to_dict()
        # print(message, message_obj)
        # print('hello- success')
    
        emit('data', message, room=room)


# @socketio.on('message')
# def handle_message(data):
#     emit('message', data, broadcast=True)


# groups api
@api_bp.route('/group', methods=['POST'])
@login_required
def create_group():
    """create group with group name linked to user"""
    group_name = json.loads(request.get_data())
    if not group_name:
        return make_response(jsonify({'errormessage': 'group not created'}), 400)
    user_id = session.get('user_id')

    if user_id:
        group = Group(name=group_name, owner_id=user_id)
        user = g.user
        user.groups.append(group)
        user.save()
        group.save()

        return make_response(jsonify({'group_id': f'{group.id}', 'group_name': f'{group.name}'}), 201)
    return make_response(jsonify({'errormessage': 'user not available'}), 400)


@api_bp.route('/group', methods=['DELETE'])
@login_required
def delete_group():
    """delete a group, done by only the owner"""
    NotImplemented


@api_bp.route('/joingroup', methods=['POST'])
@login_required
def join_group():
    """other users to join a group"""
    NotImplemented


@api_bp.route('/groups', methods=['GET'])
@login_required
def get_groups():
    """get user groups"""
    user = g.user
    if user:
        groups = [group.to_dict() for group in user.groups]
        return make_response(jsonify({'groups': groups}))
    return make_response(jsonify({'errormessage': 'user not available'}), 400)

# messages api


@api_bp.route('messages/<group_id>', methods=['GET'])
@login_required
def get_messages(group_id):
    """get messages for a group"""
    # group_id = json.loads(request.get_data())
    group = Group.find(id=group_id)

    if group:
        group = group[0]
        messages = [message.to_dict() for message in group.messages]
        # print(messages)
        return make_response(jsonify({'messages': messages}))
    return make_response(jsonify({'errormessage': 'group not available'}), 400)


@api_bp.before_request
def load_user():
    g.user = None
    if 'user_id' in session:
        user_id = session.get('user_id')
        g.user = User.find(id=user_id)[0]
        g.name = g.user.username
