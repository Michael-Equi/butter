import butter
import logging
from typing import List

@butter.test("tests.json", "description 1")
def test1(input: List[str]):
    logging.info(f"This is a test 1 on input {input}")
    output = [f"This is a test 1 on input {input}"]
    return output, {}

@butter.test("tests.json", "description 2")
def test2(input: List[str]):
    logging.info(f"This is a test 2 on input {input}")
    output = [f"This is a test 2 on input {input}"]
    return output, {}

@butter.test("tests.json", "description 3")
def test3(input: List[str]):
    logging.info(f"This is a test 3 on input {input}")
    output = [f"This is a test 3 on input {input}"]
    return output, {}