import base64
import json
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import requests
from dotenv import load_dotenv
import os
import parser
from datetime import datetime, timedelta


# Load env variables 
load_dotenv()
CLIENT_ID = os.environ.get("CLIENT_ID")
CLIENT_SECRET = os.environ.get("CLIENT_SECRET")


# Initialize flask server and cors
app = Flask(__name__)
CORS(app, supports_credentials=True, origins='*')

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

    # Cookies secured by setting httponly=True
    expires = datetime.now()
    expires = expires + timedelta(days=1)
    resp.set_cookie('accessToken', data.get('access_token'), expires=expires)
    return resp


# fetch user github profile data
@app.route('/getUserData', methods=['GET'])
def get_user_data():
    print(request.headers)
    headers = {'Authorization': request.headers['Authorization']}
    response = requests.get('https://api.github.com/user', headers=headers)
    data = response.json()
    return jsonify(data)

# Get repositories list
@app.route('/repositories', methods=['GET'])
def get_repositories():
    headers = {'Authorization': request.headers['Authorization']}
    response = requests.get('https://api.github.com/user/repos', headers=headers)
    data = response.json()
    return jsonify(data)


def pom_parser(data):
    base64_content = data['content']
    decoded_content = base64.b64decode(base64_content).decode('utf-8')
    print(decoded_content)
    return parser.parser(decoded_content)


# Assuming POM.xml to be present in root
@app.route('/getPOMDependencies', methods=["POST"])
def getPOMFiles():
    try:
        user = request.get_json()['user']
        repo = request.get_json()['repo']
        path = 'pom.xml'
        token = request.headers['Authorization']
        url = f"https://api.github.com/repos/{user}/{repo}/contents/{path}"
        headers = {'Authorization': f'{token}'}
        r = requests.get(url, headers=headers)
        # Parse the JSON response into a Python dictionary
        data = json.loads(r.text)
        data = jsonify(pom_parser(data))
        return data
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)})
    except KeyError as e:
        return jsonify({'error': f'Missing key: {str(e)}'})


if __name__ == '__main__':
    app.run(port=4000, debug=True)