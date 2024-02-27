import base64
import json
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import requests
from dotenv import load_dotenv
import os
import parser
from datetime import datetime, timedelta
import logging


# Load env variables 
load_dotenv()
CLIENT_ID = os.environ.get("CLIENT_ID")
CLIENT_SECRET = os.environ.get("CLIENT_SECRET")


# Default port is 5000
PORT=int(os.environ.get('PORT',5000))


# Initialize flask server and cors
app = Flask(__name__)
CORS(app, supports_credentials=True, origins=os.environ.get('FRONTEND_URL'))


# Set up the logger
gunicorn_logger = logging.getLogger('gunicorn.error')
app.logger.handlers = gunicorn_logger.handlers
app.logger.setLevel(gunicorn_logger.level)


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
    resp = make_response(jsonify(data), response.status_code)

    # Cookies secured by setting httponly=True
    expires = datetime.now()
    expires = expires + timedelta(days=1)
    resp.set_cookie('accessToken', data.get('access_token'), expires=expires)
    return resp


# fetch user github profile data
@app.route('/getUserData', methods=['GET'])
def get_user_data():
    headers = {'Authorization': request.headers['Authorization']}
    response = requests.get('https://api.github.com/user', headers=headers)
    data = response.json()
    return jsonify(data), response.status_code


# Get repositories list
@app.route('/repositories', methods=['GET'])
def get_repositories():
    headers = {'Authorization': request.headers['Authorization']}
    response = requests.get('https://api.github.com/user/repos', headers=headers)
    data = response.json()
    return jsonify(data), response.status_code

# Convert the received encoded content to utf-8 and parse the pom.xml file
def pom_parser(data):
    base64_content = data['content']
    decoded_content = base64.b64decode(base64_content).decode('utf-8')
    app.logger.info(decoded_content)
    return parser.parser(decoded_content)


# Recursively search for pom.xml files in the repository
@app.route('/getPOMDependencies', methods=["POST"])
def getPOMFiles():
    try:
        user = request.get_json()['user']
        repo = request.get_json()['repo']
        token = request.headers['Authorization']
        headers = {'Authorization': f'{token}'}
        pom_dependency_array = []

        # Function to recursively search for pom.xml files
        def search_directory(path):
            url = f"https://api.github.com/repos/{user}/{repo}/contents/{path}"
            r = requests.get(url, headers=headers)
            files = r.json()

            for file in files:
                if file['type'] == 'dir':
                    search_directory(file['path'])
                elif file['name'] == 'pom.xml':
                    # Parse the pom.xml file
                    r = requests.get(file['url'], headers=headers)
                    data = r.json()
                    pom_data = pom_parser(data)
                    pom_dependency_array.append(pom_data)

        # Start the search at the root of the repository
        search_directory('')

        return make_response(pom_dependency_array, 200)
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 400
    except KeyError as e:
        return jsonify({'error': f'Missing key: {str(e)}'}), 404


if __name__ == '__main__':
    app.run(port=PORT, debug=True)