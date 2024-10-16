# MedAssist: An AI-Powered Diagnostic Assistant for Doctors

[![MedAssist Logo](https://github.com/maverickkamal/MedAssist/blob/75239fbdd4c618c898c1650817268811dba38085/uploads/Gemini_Generated_Image_7c8ybf7c8ybf7c8y.jpeg)](https://github.com/maverickkamal/MedAssist)

MedAssist is an AI-powered tool designed to assist doctors in making faster and more accurate diagnoses. It analyzes medical images, processes patient records, and conducts in-depth research to provide valuable insights and alternative perspectives.

This project is a proof of concept, demonstrating the potential of AI to revolutionize healthcare.

## Features

* **Image Analysis:**  Identifies potential anomalies in medical images (X-rays, MRIs, CT scans) and suggests possible diagnoses.
* **Patient Record Processing:** Extracts key information from electronic health records (EHRs), lab results, and medical history.
* **Research Tool:**  Conducts extensive research beyond basic web searches, retrieving relevant medical information from reputable sources.
* **Explainable AI (XAI):**  Provides transparent explanations for the AI's reasoning, fostering trust and collaboration.


## Doctor Feedback

[![Doctor Feedback Screenshot](https://github.com/maverickkamal/MedAssist/blob/75239fbdd4c618c898c1650817268811dba38085/uploads/00c8cf67-6e98-480b-b353-5e346c07473b.png)](https://github.com/maverickkamal/MedAssist)

> "MedAssist has the potential to be a game-changer in healthcare. The ability to quickly analyze medical images and access relevant research is invaluable." - Dr. Ahmad

> "I'm particularly impressed with the XAI feature. It's crucial for doctors to understand the reasoning behind the AI's suggestions." - Dr. Ochigbo


## Getting Started

### Prerequisites

* **Python 3.8 or higher**
* **Tavily API Key:**  Obtain an API key from [tavily.com](https://tavily.com/)
* **Google Gemini API Key:**  Obtain an API key from [aistudio.google.com](https://aistudio.google.com/)


### Installation

1. **Clone the repository:**

   ```
   git clone [https://github.com/maverickkamal/MedAssist.git](https://github.com/maverickkamal/MedAssist.git)
   cd MedAssist
   ```

2.  **Install dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

3.  **Configure API keys:**

      * Rename `.env.example` to `.env`
      * Update the `.env` file with your Tavily and Google Gemini API keys.

4.  **Update model configurations:**

      * Navigate to `.venv/lib64/python3.11/site-packages/gpt_researcher/config/variables/default.py`
      * Update the following variables with their corresponding values from your `.env` file:
          * `EMBEDDING_MODEL`
          * `FAST_LLM`
          * `SMART_LLM`

## Running MedAssist

### Frontend

The frontend is built with Next.js. To run it:

```bash
cd frontend
npm install
npm run dev
```

**Note:** The frontend is currently under development and may have some bugs.

### Backend

To run the backend:

```bash
# From the root directory
python main.py
```

### CLI Version

Due to the frontend being under development, a CLI version is available for a more stable experience. To use it:

```bash
python main_cli.py --interactive
```

**Available arguments:**

  * `--interactive`:  Starts the interactive CLI mode.
  * `--image <image_path>`:  Analyzes a medical image.
  * `--file <file_path>`:  Processes a patient record file.

## Contributing

Contributions are welcome\! Please feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](https://www.google.com/url?sa=E&source=gmail&q=LICENSE) file for details.

## Acknowledgments

  * **Tavily** for their powerful search API.
  * **Google AI Studio** for providing access to Google Gemini.

<!-- end list -->


