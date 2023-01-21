import butter
import logging

@butter.test
def test1(input):
    logging.info(f"This is a test 1 on input {input}")
    output = f"This is a test 1 on input {input}"
    return output, {}

@butter.test
def test2(input):
    logging.info(f"This is a test 2 on input {input}")
    output = f"This is a test 2 on input {input}"
    return output, {}

@butter.test
def test3(input):
    logging.info(f"This is a test 3 on input {input}")
    output = f"This is a test 3 on input {input}"
    return output, {}