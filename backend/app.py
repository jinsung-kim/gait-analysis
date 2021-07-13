from flask import Flask, request, jsonify
from flask_cors import CORS

# MongoDB connection
# from pymongo import MongoClient


# Used to generate tokens
from flask_jwt_extended import create_access_token, JWTManager

app = Flask(__name__)
CORS(app)

app.config['JWT_SECRET_KEY'] = 'gaitanalysis'

jwt = JWTManager(app)

# Helpers
from read_csv import CSV

# Testing if up
@app.route('/', methods=['GET'])
def homePage():
    return "Hello, world"


@app.route('/getbox', methods=['GET'])
def getBoxPlotData():
    left_df = CSV("l", "sample/left.csv")
    right_df = CSV("r", "sample/right.csv")

    # Get left foot side
    gait_velocity_left = left_df.read_file_for("stride_pace", "Left")
    stride_length_left = left_df.read_file_for("stride_length", "Left")
    step_rate_left = left_df.read_file_for("step_rate", "Left")

    left = {
        "gait_velocity": gait_velocity_left,
        "stride_length": stride_length_left,
        "step_rate": step_rate_left,
        # "gait_list": left_df.generate_list("stride_pace"),
        # "stride_list": left_df.generate_list("stride_length"),
        # "step_list": left_df.generate_list("step_rate")
    }

    # Get right foot side
    gait_velocity_right = right_df.read_file_for("stride_pace", "Right")
    stride_length_right = right_df.read_file_for("stride_length", "Right")
    step_rate_right = right_df.read_file_for("step_rate", "Right")

    right = {
        "gait_velocity": gait_velocity_right,
        "stride_length": stride_length_right,
        "step_rate": step_rate_right,
        # "gait_list": right_df.generate_list("stride_pace"),
        # "stride_list": right_df.generate_list("stride_length"),
        # "step_list": right_df.generate_list("step_rate")
    }

    return jsonify({ "left": left, "right": right })


if __name__ == '__main__':
    # app.run(host='0.0.0.0', debug=False, port= os.environ.get('PORT', 80))
    app.run(port=5000, debug=True)