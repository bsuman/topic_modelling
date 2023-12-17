from flask import Flask, request, jsonify, Response
import openai
import json
import logging
from pymongo import MongoClient
from collections import Counter

app = Flask(__name__)

# Create a MongoClient with authentication
client = MongoClient("mongodb://admin:admin-password@localhost:27017/topic_modeling?authSource=admin")

db = client['topic_modeling']


@app.route('/analyze', methods=['POST'])
def analyze_text():
    data = request.get_json()
    print(data['text'])

    if len(data['text']) <= 0:
        logging.info("No text given!")
        # throw invalid input error
        return Response(
            "BAD REQUEST",
            status=400,
        )

    print(data['text'])

    # Call the OpenAI API for topic extraction
    response = openai.Completion.create(
        engine="text-davinci-003",  # Use the text-davinci engine for better text-based results
        prompt=data['text'],
        max_tokens=100  # Adjust as needed
    )
    print(response['choices'][0]['text'])

    # Extract topics by counting word occurrences
    words = response['choices'][0]['text'].split()
    word_counts = Counter(words)

    # Convert word counts to a list of topics with occurrences
    topics = [{"topic": word, "occurrences": count} for word, count in word_counts.items()]
    logging.info(topics)

    # # Store results in MongoDB
    connections = generate_connections(topics)
    store_results(data['document_id'], topics,connections)

    return jsonify({"topics": topics, "connections": connections})


def extract_topics(model_output):
    # Implement logic to extract topics from the OpenAI response
    # Example: Assume the response contains topics in the format {"topic": "topic_name", "occurrences": 3}

    # Parse the response JSON
    try:
        response_data = json.loads(model_output)
    except json.JSONDecodeError as e:
        logging.error(e.msg)
        print(f"Error decoding JSON: {e}")
        return []

    # Check if the 'topics' key exists in the response
    if 'topics' in response_data:
        # Extract topics from the response
        topics = response_data['topics']

        # Ensure that the 'topics' value is a list
        if isinstance(topics, list):
            # Assume each topic has a 'topic' and 'occurrences' field
            extracted_topics = [
                {'topic_id': topic.get('topic'), 'occurrences': topic.get('occurrences', 0)}
                for topic in topics
            ]
            return extracted_topics

    print("Topics not found in the response.")
    return []


def generate_connections(topics):
    # Implement logic to generate connections between topics based on co-occurrences
    connections = []
    print(topics)
    # Calculate co-occurrences between topics
    for i in range(len(topics)):
        for j in range(i + 1, len(topics)):
            # Assume a simple condition for co-occurrence (e.g., topics appearing in the same document)
            if topics[i]['occurrences'] > 0 and topics[j]['occurrences'] > 0:
                strength = min(topics[i]['occurrences'], topics[j]['occurrences'])
                connection = {
                    'source': topics[i]['topic'],
                    'target': topics[j]['topic'],
                    'strength': strength
                }
                connections.append(connection)

    return connections


def store_results(document_id, topics, connections):
    # Store topics and co-occurrences in MongoDB
    db.results.insert_one({
        "document_id": document_id,
        "topics": topics,
        "connections": connections
    })


if __name__ == '__main__':
    app.run(debug=True)
