import os

from flask import Flask, g, render_template, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
app.config.from_mapping(
    SECRET_KEY='dev_SECRETE',
    SQLALCHEMY_DATABASE_URI='mysql+pymysql://new_admin:admin-pass@database-1/studysync_dev_db',
    SQLALCHEMY_ECHO=False
)

db = SQLAlchemy(app)
CORS(app, supports_credentials=True)

# , engineio_logger=True, logger=True goes here | for debugging
socketio = SocketIO(app, cors_allowed_origins="*")

with app.app_context():
    from backend.routes.api import api_bp
    from backend.routes.auth.auth import auth_bp

app.register_blueprint(auth_bp)
app.register_blueprint(api_bp)

@app.route('/auth/signup')
@app.route('/home')
@app.route('/auth/login')
@app.route('/group')
@app.route('/')
def serve_react_app():
    return app.send_static_file('index.html')

# @app.route('/', defaults={'path': ''})
# @app.route('/<path:path>')                         # STILL DONT KNOW WHY IT DONT WORK
# def serve_react_app(path):
#     return app.send_static_file('index.html')



if __name__ == '__main__':
    socketio.run(app, debug=True)