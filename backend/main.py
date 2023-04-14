from flask import Flask, request
import json
import os
import numpy as np
import openai
import requests
from pymongo import MongoClient
from bson.objectid import ObjectId
import randomname
import datetime
import threading

app = Flask(__name__)

MONGODB_URI = os.getenv("MONGODB_URI")
print(MONGODB_URI)
client = MongoClient(MONGODB_URI)
database = client['butter']

openai.api_key = os.getenv("OPENAI_API_KEY")
huggingface_bearer = "Bearer " + os.getenv("HUGGINGFACE_BEARER")

#test_cases = [['Hi this is a test of how to create a test case. We will be looking at sematic similarity, word similarity, tfid, word distributions, and other metrics. Very cool!', 'This is a test to see how well we can measure semantic and word similarity, TFID, word distributions, and other metrics. Lets check it out!', "Oi, this be a test of 'ow to create a test case. We'll be 'aving a peek at sematic similarity, word similarity, tfid, word distributions, and other metrics. Very marvy!", "Let's examine the semantic and word similarity, Tf-IDF, and word distributions of a sample test. Sounds awesome!"],['Hi this is a test of how to create a test case. We will be looking at sematic similarity, word similarity, tfid, word distributions, and other metrics. Very cool!', 'This is a test to see how well we can measure semantic and word similarity, TFID, word distributions, and other metrics. Lets check it out!', "Oi, this be a test of 'ow to create a test case. We'll be 'aving a peek at sematic similarity, word similarity, tfid, word distributions, and other metrics. Very marvy!", "Let's examine the semantic and word similarity, Tf-IDF, and word distributions of a sample test. Sounds awesome!"],['Hi this is a test of how to create a test case. We will be looking at sematic similarity, word similarity, tfid, word distributions, and other metrics. Very cool!', 'This is a test to see how well we can measure semantic and word similarity, TFID, word distributions, and other metrics. Lets check it out!', "Oi, this be a test of 'ow to create a test case. We'll be 'aving a peek at sematic similarity, word similarity, tfid, word distributions, and other metrics. Very marvy!", "Let's examine the semantic and word similarity, Tf-IDF, and word wefwefieowfjoi of a sample test. Sounds awesome!"]]
#expected_cases = ['Hi this is a test of how to create a test case. We will be looking at sematic similarity, word similarity, tfid, word distributions, and other metrics. Very cool!','Hi this is a test of how to create a test case. We will be looking at sematic similarity, word similarity, tfid, word distributions, and other metrics. Very cool!','Hi this is a test of how to create a test case. We will be looking at sematic similarity, word similarity, tfid, word distributions, and other metrics. Very cool!']

def run_analytics(db, content):
    
    tests = content['tests'] # Array of arrays of test dicts with structure of inputs[] and outputs[]
    # Get create an object id
    test_run_id = ObjectId()

    running_semantic_similarity = 0
    running_jaccard_similarity = 0
    running_expected_sentiment = 0
    running_test_sentiment = 0
    running_counter = 0
    running_correctness = 0

    for test in tests:
        """title = test['title']
        description = test['description']
        commit = test['commit']
        branch = test['branch']"""

        test_semantic_similarity = 0
        test_jaccard_similarity = 0
        test_expected_sentiment = 0
        test_test_sentiment = 0
        test_correctness = 0
        test_counter = 0
        
        print(running_counter)
        for case in test['cases']:
            outputs = case['outputs']
            expected = case['expected']
            inputs = case['input']
            semantic_similarities = []
            jaccard_similarities = []
            expected_sentiments = []
            test_sentiments = []
            gpt3_correctness = []
            # Calculating the similarity between the expected output and the test output
            #for i in range(len(expected)):
            #try:
            try:
                semantic_similarities.append(_get_similarity(outputs[-1], expected)) # TODO: (michael-lutz) add protection against API failure
            except Exception as e:
                print('An error occurred:', e)
                semantic_similarities.append(.5)
            try:
                jaccard_similarities.append(_jaccard_similarity(outputs[-1], expected))
            except Exception as e:
                print('An error occurred:', e)
                jaccard_similarities.append(.5)
            try:
                expected_sentiments.append(_get_sentiment(expected))
            except:
                expected_sentiments.append(0)
            try:
                test_sentiments.append(_get_sentiment(outputs[-1]))
            except:
                test_sentiments.append(0)
            try:
                gpt3_correctness.append(_gpt3_correctness(inputs[-1], outputs[-1], expected))
            except:
                gpt3_correctness.append(0)

            average_semantic_similarity = np.mean(semantic_similarities)
            average_jaccard_similarity = np.mean(jaccard_similarities)
            average_expected_sentiment = np.mean(expected_sentiments)
            average_test_sentiment = np.mean(test_sentiments)

            case['semanticSimilarity'] = average_semantic_similarity
            case['jaccardSimilarity'] = average_jaccard_similarity
            case['expectedSentiment'] = average_expected_sentiment
            case['testSentiment'] = average_test_sentiment
            case['gptCorrectness'] = gpt3_correctness
            
            running_semantic_similarity += average_semantic_similarity
            running_jaccard_similarity += average_jaccard_similarity
            running_expected_sentiment += average_expected_sentiment
            running_test_sentiment += average_test_sentiment

            if gpt3_correctness == "CORRECT":
                test_correctness += 1
                running_correctness += 1

            running_counter += 1

            test_semantic_similarity += average_semantic_similarity
            test_jaccard_similarity += average_jaccard_similarity
            test_expected_sentiment += average_expected_sentiment
            test_test_sentiment += average_test_sentiment
            test_counter += 1

        test['semanticSimilarity'] = test_semantic_similarity / test_counter
        test['jaccardSimilarity'] = test_jaccard_similarity / test_counter
        test['expectedSentiment'] = test_expected_sentiment / test_counter
        test['testSentiment'] = test_test_sentiment / test_counter
        test['testCorrectness'] = test_correctness / test_counter

        test['createdAt'] = datetime.datetime.utcnow()
        test['updatedAt'] = datetime.datetime.utcnow()
        test['testRunId'] = test_run_id
        # Writing to database
        db['Test'].insert_one(test)
    
    content['averageSemanticSimilarity'] = running_semantic_similarity / running_counter
    content['averageJaccardSimilarity'] = running_jaccard_similarity / running_counter
    content['averageExpectedSentiment'] = running_expected_sentiment / running_counter
    content['averageTestSentiment'] = running_test_sentiment / running_counter
    content['averageCorrectness'] = running_correctness / running_counter
    content['projectId'] = ObjectId(content['projectId'])
    content['name'] = randomname.get_name()
    content['_id'] = test_run_id

    content['createdAt'] = datetime.datetime.utcnow()
    content['updatedAt'] = datetime.datetime.utcnow()

    del content['tests']
    db['TestRun'].insert_one(content)


@app.route('/run_analytics', methods=['POST'])
def run_analytics_handler():
    """
    A post method that handles a request wih the parameter "input" and writes the value of input
    """
    # Getting access to database defined above
    global database
    db = database
    content = request.json

    # Create a new thread that will run the analytics function
    analytics_thread = threading.Thread(target=run_analytics, args=(db, content))

    # Start the new thread
    analytics_thread.start()
    
    d = {'success': 'True'}
    res_body = json.dumps(d)
    return res_body, 200

# First calculating semantic similarity of results using OpenAI's Embedding api
def _get_openai_emb(text, embedding_model="text-embedding-ada-002"):
    """
    Returns the embedding of the text using OpenAI's Embedding API
    Parameters: text - string,
                embedding_model - string, the model to use for the embedding
    """
    response = openai.Embedding.create(input=text, model=embedding_model)
    return np.array(response['data'][0]['embedding'])

def _get_similarity(test, expected, embedder=_get_openai_emb):
    """
    Calculates the similarity between the expected output and the test output
    Paramters: tests - list of strings
               expected - string
    """
    print(test)
    print(expected)
    tests = embedder(test)
    expected = embedder(expected)
    return tests @ expected


def _get_sentiment(input):
    """
    Uses huggingface to calucluate the sentiment of a text
    """
    if not input:
        return 0

    API_URL = "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest"
    headers = {"Authorization": huggingface_bearer}
    payload = {"inputs": input}
    response = requests.post(API_URL, headers=headers, json=payload)
    positive, negative = 0, 0

    try:    
        for score_obj in response.json()[0]:
            print(score_obj)
            if score_obj['label'] == 'positive':
                positive = score_obj['score']
            elif score_obj['label'] == 'negative':
                negative = score_obj['score']
        return positive - negative
    except:
        return 0

def _jaccard_similarity(string1, string2):
    """
    Calculates the intersection over union for strings (text similarity), ranges from 0 to 1
    Parameters: string1 - string
                string2 - string
    """
    string1_set = set(string1.split())
    string2_set = set(string2.split())
    intersection = string1_set.intersection(string2_set)
    union = string1_set.union(string2_set)
    return len(intersection) / len(union)



def _gpt3_correctness(question, response, expected):
    prompt = """You are a teacher grading a quiz.
    You are given a question, the student's answer, and the true answer, and are asked to score the student answer as either CORRECT or INCORRECT.
    Example Format:
    QUESTION: question here
    STUDENT ANSWER: student's answer here
    TRUE ANSWER: true answer here
    GRADE: CORRECT or INCORRECT here
    Grade the student answers based ONLY on their factual accuracy. Ignore differences in punctuation and phrasing between the student answer and true answer. It is OK if the student answer contains more information than the true answer, as long as it does not contain any conflicting statements. Begin! 
    QUESTION: {question}
    STUDENT ANSWER: {response}
    TRUE ANSWER: {expected}
    GRADE:"""

    # Create the final prompt with the values
    final_prompt = prompt.format(question=question, response=response, expected=expected)

    """response = openai.Completion.create(
        engine="gpt-3.5-turbo",
        prompt=final_prompt,
        max_tokens=50,
        n=1,
        stop=None,
        temperature=0.5,
    )"""
    response = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=[{"role": "user", "content": final_prompt}])
    

    return response.choices[0].message.content





if __name__ == '__main__':
    #app.run(debug=True, port=os.getenv("PORT", default=3001))

    print(_gpt3_correctness("What is the capital of France?", "Paris", "Paris"))
