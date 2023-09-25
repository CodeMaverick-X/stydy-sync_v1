from flask import request

from backend.routes.api import api_bp


@api_bp.route('/chat')
def chat():
    return 'helloworld'
