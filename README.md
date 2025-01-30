# Chatbot AI

In this repository I'll find an implementation of a Chatbot written in `React` (front-end) and `Python` (back-end). It integrates with DeepSeek AI (model: `deepseek-chat`).

## Repo structure

| path | description |
| ---- | ----------- |
| api  | back-end    |
| web  | front-end   |

## Running

First you're going to need a DeepSeek API Key. For that you need to sign up in the [website](https://platform.deepseek.com/) and follow the instructions.

Run the following commands to start the application locally.

### Api

```sh
cd api

# installing dependencies
pip3 install -r requirements.txt
```


Running on Linux:

```sh
cd api
pip3 install -r requirements.txt

# replace DEEPSEEK_API_KEY variable with your API Key
DEEPSEEK_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" python app.py
```

Running on Windows (with Powershell):

```powershell
$env:DEEPSEEK_API_KEY = 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; python app.py
```


### front-end

```
cd web
npm install
npm start
```
