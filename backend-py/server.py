from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import requests
from dotenv import load_dotenv
import os

# Load env variables 
load_dotenv()
CLIENT_ID = os.environ.get("CLIENT_ID")
CLIENT_SECRET = os.environ.get("CLIENT_SECRET")

# Initialize flask server and cors
app = Flask(__name__)
CORS(app, supports_credentials=True)

# User access token from github api
@app.route('/getAccessToken', methods=['GET'])
def get_access_token():
    code = request.args.get('code')
    params = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'code': code
    }
    headers = {'Accept': 'application/json'}
    response = requests.post('https://github.com/login/oauth/access_token', params=params, headers=headers)
    data = response.json()
    resp = make_response(jsonify(data))
    resp.set_cookie('accessToken', data.get('access_token'), httponly=True)
    return resp

# fetch user github profile data
@app.route('/getUserData', methods=['GET'])
def get_user_data():
    print(request.cookies.get("accessToken"))
    headers = {'Authorization': request.headers['Authorization']}
    response = requests.get('https://api.github.com/user', headers=headers)
    data = response.json()
    return jsonify(data)

if __name__ == '__main__':
    app.run(port=4000, debug=True)