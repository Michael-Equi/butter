from pathlib import Path
import time
import json
import requests
from rich.progress import track
from rich.console import Console
import git

def test(json_file: str, desc: str=""):
    def dec(func):
        Butter.tests.append((func, json_file, desc))
    return dec

class Butter:
    tests = []

    def __init__(self, path: str, id, description: str) -> None:
        self.path = Path(path)
        self.id = id
        self.description = description
        self.console = Console()

    def run_tests(self, debug=False):
        self.console.print(f":sunglasses: Running tests...\n")

        tests = []
        json_files = set()
        for test, json_file, desc in Butter.tests:

            # Read the json file with the prompts / expected outputs
            json_files.add(json_file)
            with open(self.path / json_file, 'r') as f:
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


        # TODO Attach commit id and branch name
        repo = git.Repo(self.path, search_parent_directories=True)

        # Create a post request
        url = "https://www.example.com"
        data = {
            "projectId": self.id,
            "tests": tests,
            "path": str(self.path),
            "commitId": repo.head.object.hexsha,
            "branch": repo.active_branch.name,
            "description": self.description
            }
        headers = {'Content-type': 'application/json'}
        requests.post(url, data=data, headers=headers)
        self.console.print("Data sent to server! :smiley:")
        
        # Save data to a json file
        if debug:
            with open(self.path / "data_dump.json", 'w+') as f:
                json.dump(data, f)
    