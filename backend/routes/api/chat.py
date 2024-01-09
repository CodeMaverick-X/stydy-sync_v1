import json

from flask import current_app, g, jsonify, make_response, request, session
from flask_login import current_user, login_required
from flask_socketio import emit, join_room, leave_room

from backend import socketio
from backend.models import Group, Message, User
from backend.routes.api import api_bp

# web-socket listeners

@socketio.on('join')
def join_r(data):
    group_id = data['group_id']
    user_id = data['user_id']
    room = str(group_id)
    join_room(room)
    emit('join_notification', {'message': f'{user_id} has joined the chat'}, room=room) # TODO: implement notification

@socketio.on('leave')
def leave_r(data):
    group_id = data['group_id']
    user_id = data['user_id']
    room = str(group_id)
    leave_room(room)
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
    user = User.find(secodary_id =user_id)
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
    
        emit('data', message, room=room)


# Groups api

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


@api_bp.route('/groups', methods=['GET'])
@login_required
def get_groups():
    """get user groups"""
    user = g.user
    if user:
        groups = [group.to_dict() for group in user.groups]
        return make_response(jsonify({'groups': groups}))
    return make_response(jsonify({'errormessage': 'user not available'}), 400)

@api_bp.route('/groupinfo/<group_id>', methods=['GET'])
@login_required
def get_group_info(group_id):
    """gets the group info in detail for the side panel  in message ui"""
    group = Group.find(id=group_id)
    if group:
        group = group[0]
        user = g.user
        user_id = user.secodary_id
        if ( user.secodary_id not in [ member.secodary_id for member in group.members] and user_id != group.owner_id):
            return make_response(jsonify({'errormessage': 'not authorized to make this request'}), 400)
        
        group_members = [ member.username for member in group.members ]
        group_data = group.to_dict()
        group_data.update({'members': group_members})

        return make_response(jsonify({'group_info': group_data}), 200)
    return make_response(jsonify({'erromesage': 'group not found'}), 401)


@api_bp.route('/joingroup', methods=['POST'])
@login_required
def join_group():
    """add a user to a group that he/she did not create: that is join a group"""
    data = request.get_data()
    if not data:
        return make_response(jsonify({'errormessage': 'empty data recieved'}), 400)
    data = json.loads(data)
    user_id = data.get('user_id')
    group_id = data.get('group_id')
    user = g.user
    group = Group.find(id=group_id)
    if user_id and user_id != g.user.secodary_id:
        return make_response(jsonify({'errormessage': 'you doing something fishy with the user_id'}), 400)

    if group and user:
        group = group[0]
        already_in_group = [g for member in group.members if member.id == user.id]
        if already_in_group:
            return make_response(jsonify({'group_id': f'{group.id}', 'group_name': f'{group.name}',
                                        'message': 'already in group'}), 201)
        group.members.append(user)
        group.save()
        user.save()

        return make_response(jsonify({'group_id': f'{group.id}', 'group_name': f'{group.name}'}), 201)
    return make_response(jsonify({'errormessage': 'group does not exist'}), 400)



# messages api

@api_bp.route('messages/<group_id>', methods=['GET'])
@login_required
def get_messages(group_id):
    """get messages for a group"""
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
        g.user = User.find(secodary_id =user_id)[0]
        g.name = g.user.username
