from flask import Flask, request, jsonify

# Used to send data to MongoDB
# import json
# from bson import json_util

# MongoDB connection
# from pymongo import MongoClient

# import json
# from bson import json_util

# Used to generate tokens
from flask_jwt_extended import create_access_token, JWTManager

# Used for getting current time
from datetime import datetime

app = Flask(__name__)

app.config['JWT_SECRET_KEY'] = 'gaitanalysis'

jwt = JWTManager(app)

@app.route('/', methods=['GET'])
def homePage():
    return "Hello, world" # Eventually put a home page here


if __name__ == '__main__':
    # app.run(host='0.0.0.0', debug=False, port= os.environ.get('PORT', 80))
    app.run(port=5000, debug=True)