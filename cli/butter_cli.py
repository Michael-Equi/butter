import typer
import json
from butter import Butter
from pathlib import Path
import logging

app = typer.Typer()


@app.command()
def run(path: str="./", description: str=''):

    #TODO handle logging
    logging.basicConfig(filename='./example.log', encoding='utf-8', level=logging.DEBUG)

    # TODO Collect commit information

    path = Path(path)
    butter_tester = Butter(path)

    with open(path / 'tests.py', 'r') as f:
        text = f.read()
        exec(text)

    with open(path / 'tests.json', 'r') as f:
        test_json = json.load(f)

    # List tests in path
    butter_tester.run_tests(test_json)

@app.command()
def delete():
    print("Deleting user: Hiro Hamada")


if __name__ == "__main__":
    app()