import os
import argparse
import google.generativeai as genai
from dotenv import load_dotenv
from werkzeug.utils import secure_filename

# Import your custom modules
from search_agent import research, retrive_tools_results
from decision_maker import decision_maker
from utils.persona import system_messages

load_dotenv()

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

genai.configure(api_key=os.environ['GOOGLE_API_KEY'])

tools = [research, decision_maker, retrive_tools_results]

model = genai.GenerativeModel(model_name="gemini-1.5-flash-002", tools=tools, system_instruction=system_messages)

chat = model.start_chat(enable_automatic_function_calling=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def process_message(message, image_paths=None, file_paths=None):
    paths = []
    
    if image_paths:
        for image_path in image_paths:
            if os.path.exists(image_path) and allowed_file(image_path):
                image = genai.upload_file(image_path)
                paths.append(image)
    
    if file_paths:
        for file_path in file_paths:
            if os.path.exists(file_path) and allowed_file(file_path):
                file = genai.upload_file(file_path)
                paths.append(file)
    
    message_args = paths + [message]
    response = chat.send_message(message_args)
    return response.text

def interactive_chat():
    print("Welcome to the MedAssist CLI Chat! Type 'exit' to end the conversation.")
    print("To upload files, use the following syntax:")
    print("  --image path/to/image.jpg")
    print("  --file path/to/document.pdf")
    print("You can include multiple files in a single message.")
    print("Start chatting:")

    while True:
        user_input = input("\nYou: ").strip()
        
        if user_input.lower() == 'exit':
            print("Goodbye!")
            break

        image_paths = []
        file_paths = []
        message_parts = []

        parts = user_input.split()
        i = 0
        while i < len(parts):
            if parts[i] == '--image' and i + 1 < len(parts):
                image_paths.append(parts[i + 1])
                i += 2
            elif parts[i] == '--file' and i + 1 < len(parts):
                file_paths.append(parts[i + 1])
                i += 2
            else:
                message_parts.append(parts[i])
                i += 1

        message = ' '.join(message_parts)

        if not message and not image_paths and not file_paths:
            print("Please provide a message or file to process.")
            continue

        response = process_message(message, image_paths, file_paths)
        print("\nAI:", response)

def main():
    parser = argparse.ArgumentParser(description="MedAssist CLI Application")
    parser.add_argument("--interactive", action="store_true", help="Start an interactive chat session")
    
    args = parser.parse_args()

    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

    if args.interactive:
        interactive_chat()
    else:
        print("Please use the --interactive flag to start a chat session.")
        print("Example: python ai_cli_app.py --interactive")

if __name__ == "__main__":
    main()
