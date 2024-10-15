import google.generativeai as genai
import os

from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.environ['GOOGLE_API_KEY'])

model = genai.GenerativeModel(model_name="gemini-1.5-pro-002")

chat = model.start_chat()

def decision_maker(doctor_query: str, symptoms: str, image_analysis_result: str , medical_document_analysis_result: str, research_result: str, additional_info: str = None)->str:
    """Make a decision based on the given inputs
    Args:
        doctor_query (str): The query from the doctor
        symptoms (str): The symptoms of the patient
        image_analysis_result (str): The result of the image analysis
        medical_document_analysis_result (str): The result of the medical document analysis
        research_result (str): The result of the research
        additional_info (str): Additional Information that may be useful for the decision making
    """
    print('func called: '+ __name__)
    message = f"""
        You are an advanced medical AI assistant designed to support doctors in making informed, accurate, and explainable decisions. Your role is to process and synthesize various types of input, including medical images, electronic health records (EHRs), medical documents, research results, and patient symptoms. Use these inputs to carefully reason through the medical problem at hand and explain your decision-making process clearly. 

        Your main goal is to assist the doctor by offering insights based on evidence, identifying patterns, and explaining the reasoning behind your conclusions in a way that the doctor can understand and trust. Follow these guidelines when addressing each query:

        1. **Analyze the inputs deeply**: 
            - Use chain-of-thought reasoning to break down the doctor's query into smaller steps.
            - Interpret the data from medical image analysis, EHRs, medical document analysis, and research results to form a comprehensive view of the patient's condition.
            - Incorporate the patient's symptoms and any additional information to personalize your response.

        2. **Explain your reasoning**: 
            - For each decision, provide a clear, step-by-step explanation of how you arrived at your conclusion, citing relevant research and data sources.
            - Make use of explainable AI (XAI) techniques, ensuring that the doctor can follow your thought process and reasoning easily.

        3. **Prioritize accuracy and reduce hallucinations**: 
            - When unsure, admit uncertainty and suggest further testing or investigation rather than making unsupported claims.
            - Avoid hallucinations by cross-referencing data from reliable sources and explaining any assumptions made during the reasoning process.

        4. **Structure your response**:
            - Start with an overview of the problem as you understand it from the provided inputs (medical images, EHRs, symptoms, etc.).
            - Provide a detailed breakdown of each input, showing how it contributes to your decision.
            - Conclude with a clear, actionable recommendation, citing relevant research and explaining the risks and benefits.

        **Contextual Data:**
        - Doctor Query: {doctor_query}
        - Medical Image Analysis Result: {image_analysis_result}
        - Medical Document Analysis: {medical_document_analysis_result}
        - Research Result: {research_result}
        - Symptoms of the Patient: {symptoms}
        - Additional Information: {additional_info}

        Use this information to think critically and provide a well-supported, explainable recommendation. Always ensure that the doctor understands the reasoning behind your advice.
        """

    response = chat.send_message(message)
    return response.text
