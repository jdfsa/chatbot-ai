import os
from langchain_deepseek import ChatDeepSeek
from file_loader import load_files
from config import Config

# Get the API key from the environment variable
api_key =  os.getenv('DEEPSEEK_API_KEY', '')

if not api_key:
    raise ValueError("API_KEY environment variable is not set")

START_PROMPT = '''
you-'re helping a user with a set of files. the user is having a conversation about their files.

here's the content of their files:

<files>
    {files}
</files>

try to be helpful and answer their questions.
'''.strip()

FILE_TEMPLATE = '''
<file>
    <name>{name}</name>
    <content>{content}</content>
</file>
'''

# pre-loading model
files = load_files(Config.DATA_DIR)
initial_prompt = START_PROMPT.format(files=[
    FILE_TEMPLATE.format(name=file.name, content=file.content)
    for file in files
])
chat_history = [
    ('system', initial_prompt)
]

# initialize chat model
llm = ChatDeepSeek(
    model_name=Config.MODEL,
    temperature=0.7,
    max_tokens=500,
    api_key=api_key,
    streaming=True,
)

def chatbot_response(user_input):
    chat_history.append(('human', user_input))

    msg = ''
    for token in llm.stream(chat_history):
        if not token.content:
            continue

        msg += token.content
        yield token

    chat_history.append(msg)
