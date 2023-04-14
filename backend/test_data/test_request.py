import json
import requests
import os

def post_with_json(url, json_file):
    with open(json_file, 'r') as f:
        data = json.load(f)
    headers = {'Content-type': 'application/json'}
    response = requests.post(url, data=json.dumps(data), headers=headers)
    return response

url = "http://localhost:3001/run_analytics"
#url = "https://butter-production.up.railway.app/run_analytics"
json_file = "test_data.json"

post_with_json(url, json_file)