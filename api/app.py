import json

from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
from chatbot import chatbot_response
from requests_toolbelt.downloadutils import stream

app = Flask(__name__)
CORS(app)


def generate_event(user_input):
    for token in chatbot_response(user_input):
        data = json.dumps({
            'message': token.content
        })
        yield f'data: {data}\n\n'

    yield 'data: {"end": true}\n\n'


@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message')
    if not user_input:
        return jsonify({"error": "No message provided"})

    return Response(
        stream_with_context(generate_event(user_input)),
        content_type='text/event-stream',
        mimetype='text/event-stream'
    )


if __name__ == '__main__':
    app.run(debug=False)
