from pathlib import Path
import time

def test(func):
    Butter.tests.append(func)
    return func

class Butter:
    tests = []

    def __init__(self, path: str) -> None:
        self.path = Path(path)

    def run_tests(self, test_json):
        for test in Butter.tests:
            print(f"#################### Running test {test.__name__} ####################")
            start = time.time()
            for prompt in test_json["tests"]:
                if "args" in prompt.keys():
                    args = prompt["args"]
                    output, meta = test(prompt["question"], args)
                else:
                    output, meta = test(prompt["question"])
                print(f"Input: {prompt['question']}, Output: {output}, Meta: {meta}")
            end = time.time()
            print(f"#################### Completed {test.__name__} in {round(end - start, 2)}s ####################")
    