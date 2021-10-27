from flask import Flask, json, request, jsonify
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

CLUSTER = MongoClient("mongodb+srv://jinkim:SJsknyu774!@gait.my1fw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
DATABASE = CLUSTER['gait-sessions']
SESSIONS = DATABASE['sessions']

# Testing if up
@app.route('/', methods=['GET'])
def homePage():
    return "Hello, world"

# User registration
@app.route('/registration', methods=['POST'])
def registerUser():
    data = request.get_json()

    pass

# User login
@app.route('/login', methods=['POST'])
def loginUser():
    # data = request.get_json()

    pass


@app.route('/getSessionIds', methods=['GET'])
def getSessionIds():
    # data = request.get_json() # Eventually this will be used to find specific user ID
    res = []

    for session in SESSIONS.find():
        res.append(session["_id"])

    return jsonify(res)


@app.route('/getbox', methods=['POST'])
def getBoxPlotData():

    data = request.get_json(force=True)
    target_id = -1

    left = {}
    right = {}

    if data:
        target_id = int(data["id"])

        user_sessions = {}
        res = {}

        for session in SESSIONS.find():
            user_sessions[session["_id"]] = session
            if (session["_id"] == target_id):
                res = session
                break

        left = {
            "gait_velocity": res["left"]["stride_pace"],
            "stride_length": res["left"]["stride_length"],
            "step_rate": res["left"]["step_rate"],
        }

        right = {
            "gait_velocity": res["right"]["stride_pace"],
            "stride_length": res["right"]["stride_length"],
            "step_rate": res["right"]["step_rate"],
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

    for session in SESSIONS.find():
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