from pathlib import Path
import time
import os
import json
import requests
from rich.progress import track
from rich.console import Console
import git
from datetime import datetime

def test(json_file: str, desc: str=""):
    def dec(func):
        Butter.tests.append((func, json_file, desc))
    return dec

class Butter:
    tests = []

    def __init__(self) -> None:
        self.console = Console()
        self.url = "https://butter-production.up.railway.app/run_analytics"

    def run_tests(self, path: Path, id, description: str, debug=False):
        self.console.print(f":sunglasses: Running tests...\n")

        tests = []
        json_files = set()
        for test, json_file, desc in Butter.tests:

            # Read the json file with the prompts / expected outputs
            json_files.add(json_file)
            with open(path / json_file, 'r') as f:
                test_json = json.load(f)

            start = time.time()

            # Each test input is a list of strings
            cases = []
            for prompt in track(test_json["tests"], description=f"Processing {test.__name__}..."):
                
                # Output is a list of strings, meta is a generic json object
                args = None
                if "args" in prompt.keys():
                    args = prompt["args"]
                    output, meta = test(prompt["input"], args)
                else:
                    output, meta = test(prompt["input"])

                if type(output) != list:
                    raise Exception(f"Output of {test.__name__} is not a list")

                cases.append({
                    "inputs": prompt["input"],
                    "outputs": output,
                    "expected": prompt["answer"],
                    "meta": meta,
                    "args": args
                })

            end = time.time()

            tests.append({
                "title": test.__name__,
                "description": desc,
                "jsonFile": json_file,
                "cases": cases
                })

            # print(f"Input: {prompt['question']}, Output: {output}, Meta: {meta}")
            self.console.print(f":star:Completed {test.__name__} in {round(end - start, 2)}s\n")


        commit_id = None
        branch_name = None
        try:
            repo = git.Repo(path, search_parent_directories=True)
            commit_id = repo.head.object.hexsha
            branch_name = repo.active_branch.name
        except git.exc.InvalidGitRepositoryError:
            self.console.print(":exclamation: Not in a git repository! Commit id and branch will not be sent to server.")

        # Create a post request
        data = {
            "projectId": id,
            "tests": tests,
            "path": str(path),
            "commitId": commit_id,
            "branch": branch_name,
            "description": description
            }

        response = self.submit_tests(data)
        if not response.ok or debug:
            # Cache the data file so use can attempt to resubmit results later
            date = datetime.now().strftime("%Y_%m_%d-%I:%M:%S_%p")
            os.makedirs(path / ".butter", exist_ok=True)
            file_path = path / f".butter/test_{date}.json"
            with open(file_path, 'w+') as f:
                json.dump(data, f)
                self.console.print(":file_folder: Cached data to", str(file_path))

    def submit_tests(self, data):
        headers = {'Content-type': 'application/json'}
        response = requests.post(self.url, data=json.dumps(data), headers=headers)
        if not response.ok:
            self.console.print(":sad: Error: ", response.text)
        else:
            self.console.print("Data sent to server! :rocket:")
        return response 
    