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
        if (str(session["user"]) == "618877e7ff9832fe99b10cd0"): # Should be all sessions for now
            d = datetime.strptime(session["date"], "%m-%d-%Y")
            c = days_between(today, d)

            # To address multiple sessions on the same day
            if c not in by_date:
                by_date[c] = [{ "left": session["left"], "right": session["right"] }]
            else:
                by_date[c].append({ "left": session["left"], "right": session["right"] })
            
            m = max(m, c) # Furthest back
            re.append({ "date": session["date"], "left": session["left"], "right": session["right"] })

    by_week = {} # Where all of the sessions are stored by week (used to average)

    last_week = 0

    for i in range(m):
        if i in by_date:
            week = math.floor(i / 7) # To associate the date with a week
            for j in range(len(by_date[i])):
                if week in by_week:
                    by_week[week].append(by_date[i][j])
                else:
                    by_week[week] = [by_date[i][j]]
                    last_week = max(last_week, week) + 1

    avgs = {}

    for week in range(last_week):

        if week not in by_week:
            continue

        ses_c = len(by_week[week]) # Number of sessions in this week

        gait_l = 0
        str_l = 0
        step_l = 0

        gait_r = 0
        str_r = 0
        step_r = 0

        for i in range(ses_c): # Each session of the week
            gait_l += by_week[week][i]["left"]["stride_pace"]["median"]
            str_l += by_week[week][i]["left"]["stride_length"]["median"]
            step_l += by_week[week][i]["left"]["step_rate"]["median"]

            gait_r += by_week[week][i]["right"]["stride_pace"]["median"]
            str_r += by_week[week][i]["right"]["stride_length"]["median"]
            step_r += by_week[week][i]["right"]["step_rate"]["median"]

        # Gather weekly averages
        gait_l /= ses_c
        str_l /= ses_c
        step_l /= ses_c

        gait_r /= ses_c
        str_r /= ses_c
        step_r /= ses_c

        left = {
            "gait_velocity": gait_l,
            "stride_length": str_l,
            "step_rate": step_l,
        }

        right = {
            "gait_velocity": gait_r,
            "stride_length": str_r,
            "step_rate": step_r,
        }

        avgs[week] = { "left": left, "right": right }

    res = []

    for session in re:
        d = datetime.strptime(session["date"], "%m-%d-%Y")
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
        g_diff = abs(g_l - session["left"]["stride_pace"]["median"]) + abs(g_r - session["right"]["stride_pace"]["median"])
        # c_diff = abs(c_l - session["left"]["step_rate"]["median"]) + abs(c_r - session["right"]["step_rate"]["median"])
        # s_diff = abs(s_l - session["left"]["stride_length"]["median"]) + abs(s_r - session["right"]["stride_length"]["median"])

        res.append({ "date": session["date"].replace('-', '/'), "val": g_diff })

    return jsonify(res)


if __name__ == '__main__':
    # app.run(host='0.0.0.0', debug=False, port= os.environ.get('PORT', 80))
    app.run(port=5000, debug=True)