import typer
from butter.butter import Butter
from pathlib import Path
import os
import json
# import logging

app = typer.Typer()

@app.command()
def run(path: str="./", description: str='', debug: bool=False):

    # logging.basicConfig(filename='./example.log', encoding='utf-8', level=logging.DEBUG)
    id = os.getenv('BUTTER_ID', None)
    if id is None:
        raise Exception("BUTTER_ID not set")

    # Path should be global after running these two lines
    if not os.path.isabs(path):
        path = os.path.abspath(path)

    path = Path(path)
    butter_tester = Butter()

    with open(path / 'tests.py', 'r') as f:
        text = f.read()
        exec(text, globals(), globals())

    # List tests in path
    butter_tester.run_tests(path, id, description, debug=debug)

@app.command()
def submit(json_file: str):
    butter_tester = Butter()
    # Path should be global after running these two lines
    if not os.path.isabs(json_file):
        json_file = os.path.abspath(json_file)
    with open(json_file, 'r') as f:
        data = json.load(f)
    butter_tester.submit_tests(data)


if __name__ == "__main__":
    app()