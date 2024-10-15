from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from searchAgent import research, retrive_tools_results
from decision_maker import decision_maker
from utils.persona import system_messages
from dotenv import load_dotenv
import shutil
from werkzeug.utils import secure_filename

load_dotenv()

app = Flask(__name__)
CORS(app)


UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

genai.configure(api_key=os.environ['GOOGLE_API_KEY'])

tools = [research, decision_maker, retrive_tools_results]

model = genai.GenerativeModel(model_name="gemini-1.5-flash-002", tools=tools, system_instruction=system_messages)

chat = model.start_chat(enable_automatic_function_calling=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/chat", methods=['POST'])
def chat_api():
    message = request.form.get('message')
    images = request.files.getlist('images')
    files = request.files.getlist('files')

    print(images)
    image_paths = []
    file_paths = []

    if images:
        for image in images:
            if image and allowed_file(image.filename):
                filename = secure_filename(image.filename)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                image.save(file_path)
                image_paths.append(file_path)
    print(image_paths)

    if files:
        for file in files:
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)
                file_paths.append(file_path)

    
    paths = []
    if image_paths:
            for image_path in image_paths:
                print(image_path)
                image = genai.upload_file(image_path)
                paths.append(image)
            message_args = []
            for i in range(len(paths)):
                message_args.append(paths[i])
            message_args.append(message)
            response = chat.send_message(message_args)
    elif files:
        for file_path in files:
            file = genai.upload_file(file_path)
            paths.append(file)
        message_args = []
        for i in range(len(paths)):
            message_args.append(paths[i])
        message_args.append(message)
        response = chat.send_message(message_args)
    else:
        response = chat.send_message(message)
    print(response.candidates)
    return jsonify({"response": response.text})

@app.route("/get_file_list", methods=['GET'])
def get_file_list():
    files = os.listdir(app.config['UPLOAD_FOLDER'])
    return jsonify({"files": files})

if __name__ == "__main__":
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run(host="0.0.0.0", port=8000, debug=True)
