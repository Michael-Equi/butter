import typer
from butter.butter import Butter
from pathlib import Path
import os
# import logging

app = typer.Typer()


@app.command()
def run(path: str="./", description: str='', debug: bool=False):

    # logging.basicConfig(filename='./example.log', encoding='utf-8', level=logging.DEBUG)

    # Path should be global after running these two lines
    if not os.path.isabs(path):
        path = os.path.abspath(path)

    path = Path(path)
    butter_tester = Butter(path, description)

    with open(path / 'tests.py', 'r') as f:
        text = f.read()
        exec(text, globals(), globals())

    # List tests in path
    butter_tester.run_tests(debug=debug)

# @app.command()
# def delete():
#     print("Deleting user: Hiro Hamada")


if __name__ == "__main__":
    app()