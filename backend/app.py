from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import date, datetime
from dateutil.relativedelta import relativedelta
import math

# MongoDB connection
from pymongo import MongoClient

# Used to generate tokens
from flask_jwt_extended import create_access_token, JWTManager

app = Flask(__name__)
CORS(app)

app.config['JWT_SECRET_KEY'] = 'gaitanalysis'

jwt = JWTManager(app)

cluster = MongoClient("mongodb+srv://jinkim:SJsknyu774!@session-data.my1fw.mongodb.net/session-data?retryWrites=true&w=majority")
database = cluster['gait']
sessions = database['sessions']

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
    }

    # Get right foot side
    gait_velocity_right = right_df.read_file_for("stride_pace", "Right")
    stride_length_right = right_df.read_file_for("stride_length", "Right")
    step_rate_right = right_df.read_file_for("step_rate", "Right")

    right = {
        "gait_velocity": gait_velocity_right,
        "stride_length": stride_length_right,
        "step_rate": step_rate_right,
    }

    return jsonify({ "left": left, "right": right })


@app.route('/getheat', methods=['GET'])
def getHeatMapData():
    
    # Time period to query for
    today = datetime.combine(date.today(), datetime.min.time())
    # six_months_ago = today + relativedelta(months=-6) # Go six months back

    # Used to get days in between
    def days_between(d1, d2):
        return abs((d2 - d1).days)

    by_date = {}
    m = 0

    re = []

    for session in sessions.find():
        if (session["user"] == 1): # Should be all sessions for now
            d = datetime.strptime(session["date"], "%m/%d/%Y")
            c = days_between(today, d)
            by_date[c] = { "left": session["left"], "right": session["right"] }
            m = max(m, c)
            re.append({ "date": session["date"], "left": session["left"], "right": session["right"] })

    by_week = {} # Where all of the sessions are stored by week (used to average)

    last_week = 0

    for i in range(m):
        if i in by_date:
            week = math.floor(i / 7) # To associate the date with a week
            if week in by_week:
                by_week[week].append(by_date[i])
            else:
                by_week[week] = [by_date[i]]
                last_week = max(last_week, week)

    avgs = {}

    for week in range(last_week):
        if week not in by_week:
            continue
        ses_c = len(by_week[week]) # Number of sessions in this week

        gait_l = 0
        cad_l = 0
        stride_l = 0

        gait_r = 0
        cad_r = 0
        stride_r = 0

        for i in range(ses_c): # Each session of the week
            gait_l += by_week[week][i]["left"]["gait_vel"]["med"]
            cad_l += by_week[week][i]["left"]["cadence"]["med"]
            stride_l += by_week[week][i]["left"]["stride_pace"]["med"]

            gait_r += by_week[week][i]["right"]["gait_vel"]["med"]
            cad_r += by_week[week][i]["right"]["cadence"]["med"]
            stride_r += by_week[week][i]["right"]["stride_pace"]["med"]

        # Gather weekly averages
        gait_l /= ses_c
        cad_l /= ses_c
        stride_l /= ses_c

        gait_r /= ses_c
        cad_r /= ses_c
        stride_r /= ses_c

        left = {
            "gait_velocity": gait_l,
            "stride_length": stride_l,
            "step_rate": cad_l,
        }

        right = {
            "gait_velocity": gait_r,
            "stride_length": stride_r,
            "step_rate": cad_r,
        }

        avgs[week] = { "left": left, "right": right }

    res = []

    for session in re:
        d = datetime.strptime(session["date"], "%m/%d/%Y")
        c = days_between(today, d)
        week = math.floor(c / 7)

        if (week not in avgs):
            continue

        # Gathering the weekly averages
        g_l = avgs[week]["left"]["gait_velocity"]
        # c_l = avgs[week]["left"]["step_rate"]
        # s_l = avgs[week]["left"]["stride_length"]

        g_r = avgs[week]["right"]["gait_velocity"]
        # c_r = avgs[week]["right"]["step_rate"]
        # s_r = avgs[week]["right"]["stride_length"]

        # Comparing to the current session's data
        g_diff = abs(g_l - session["left"]["gait_vel"]["med"]) + abs(g_r - session["right"]["gait_vel"]["med"])
        # c_diff = ()
        # s_diff = ()

        res.append({ "date": session["date"], "val": g_diff })


    return jsonify(res)


if __name__ == '__main__':
    # app.run(host='0.0.0.0', debug=False, port= os.environ.get('PORT', 80))
    app.run(port=5000, debug=True)