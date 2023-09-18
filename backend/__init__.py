import os

from flask import Flask, g
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_mapping(
    SECRET_KEY='dev_SECRETE',
    SQLALCHEMY_DATABASE_URI='mysql+pymysql://new_admin:admin-pass@database-1/studysync_dev_db',
    SQLALCHEMY_ECHO=False
)
# print('__________[[[[[[[[!!--DEBUGGING--!!]]]]]]]]___________')
db = SQLAlchemy(app)
CORS(app)
# print('__________[[[[[[[[!!--DEBUGGING--!!]]]]]]]]___________')


with app.app_context():
    from backend.routes.auth.auth import auth_bp

app.register_blueprint(auth_bp)




if __name__ == '__main__':
    app.run(debug=True)