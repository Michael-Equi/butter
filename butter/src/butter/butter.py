from pathlib import Path
import time
import json
import requests
from tqdm import tqdm

def test(json_file: str, desc: str=""):
    def dec(func):
        Butter.tests.append((func, json_file, desc))
    return dec

class Butter:
    tests = []

    def __init__(self, path: str) -> None:
        self.path = Path(path)

    def run_tests(self):
        tests = []
        json_files = set()
        for test, json_file, desc in Butter.tests:
            print(f"#################### Running test {test.__name__} ####################")
            
            # Read the json file with the prompts / expected outputs
            json_files.add(json_file)
            with open(self.path / json_file, 'r') as f:
                test_json = json.load(f)

            start = time.time()

            # Each test input is a list of strings
            cases = []
            for prompt in tqdm(test_json["tests"]):
                
                # Output is a list of strings, meta is a generic json object
                args = None
                if "args" in prompt.keys():
                    args = prompt["args"]
                    output, meta = test(prompt["input"], args)
                else:
                    output, meta = test(prompt["input"])

                cases.append({
                    "input": prompt["input"],
                    "output": output,
                    "answer": prompt["answer"],
                    "meta": meta,
                    "argss": args
                })

            end = time.time()

            tests.append({
                "name": test.__name__,
                "description": desc,
                "json_file": json_file,
                "cases": cases
                })

            # print(f"Input: {prompt['question']}, Output: {output}, Meta: {meta}")
            print(f"#################### Completed {test.__name__} in {round(end - start, 2)}s ####################")


        # TODO Attach commit id and branch name
        # Create a post request
        url = "https://www.example.com"
        data = {
            "tests": tests,
            "path": str(self.path),
            "commit": "",
            "branch": "",
            }
        headers = {'Content-type': 'application/json'}
        requests.post(url, data=data, headers=headers)
        
        # Save data to a json file
        with open(self.path / "data_dump.json", 'w+') as f:
            json.dump(tests, f)
    