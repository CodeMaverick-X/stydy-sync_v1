#!/usr/bin/python
"""blueprint"""
from flask import Blueprint

api_bp = Blueprint('api', __name__, url_prefix='/api')


from backend.routes.api.chat import *

