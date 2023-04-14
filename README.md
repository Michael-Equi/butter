# Butter

Butter is an open-source solution for testing generative AI applications to ensure quality and consistency of outputs in various situations. It consists of two components: a CLI and a Python testing framework inspired by packages like pytest, and a full-stack web application. The web interface offers a clean UI to visualize model performance and easily understand test results, while the modular backend allows for deploying in-house testing tools at your convenience.

## Getting Started


### Installing from PyPi

If all you need is the Python package for running tests, you can get up and running by installing directly from PyPI: 

Run `pip install butter-cli`

### Installing from Source

This step is required if you want to use the latest version, contribute new features, or deploy the web interface on your own.

To install the Python package, first navigate to the butter/butter directory and run:

```
python setup.py install
```

Confirm proper installation by running:

```
butter --help
```
TODO: Add documentation about installing / setting up backend

Refer to the "Running Locally" section for instructions on setting up the backend and frontend for processing test results.


## Using Butter

To create a Butter test, first create a `tests.json` file in the following format. You can provide multiple inputs to handle cases where, for example, a chatbot requires multiple inputs and generates intermediate outputs before producing the final output. This is useful for testing memory and chat frameworks.

```
{
    "tests": [
        {
            "input": ["Input 1", "Input 2", "Input 3"],
            "answer": "Final answer"
        },
        {
            "input": ["Input 1", "Input 2", "Input 3"],
            "answer": "Final answer"
        },
        ...
    ]
}
```

Next, write Python tests in `tests.py` that call your applications using the following format: 

```
import butter
import test-application

@butter.test("tests.json", "description of test")
def test1(input: List[str]):
    output test-application.generate_ouput(input[0])
    meta = {"data": Any meta you want to store from the test}
    return [output], meta

@butter.test("tests.json", "This is an example of multi-input, multi-output")
def test2(input: List[str]):
    outputs = []
    for input in inputs:
        outputs.append(test-application.generate_ouput(input))
    return outputs[-1], {"intermediate_outputs": outputs[:-1]}

...
```

Each test goes through all the tests in the specified JSON file and collects the outputs. Before running the tests, you need to specify the project to publish the results to. If you are using the Butter website, obtain the project ID (TODO: add image showing where to find the ID).

Add the project ID to the environment where you plan to run the test script:

```
export BUTTER_ID="proejct_id"
```

### Using the CLI

To use the CLI for running tests and uploading results to the project specified by your `BUTTER_ID`, run the following command in the directory that includes your `tests.json` and `test.py` files:

```
butter run
```

Run `butter run --help` for more command options. By default the results are only stored locally if the test fails or you set the `--debug` flag. If you have a results JSON that you want to submit after it has been generated (for example in instances where uploading results fails initially) you can run `butter submit /path/to/file.json`. Make sure your `BUTTER_ID` is set correctly when calling this function.

## Running Locally

To run the backend and interface locally follow the steps below. sTODO