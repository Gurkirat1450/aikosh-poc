# ===================== IMPORTS =====================
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os
import numpy as np
import random

# Image demo
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input, decode_predictions
from tensorflow.keras.preprocessing import image

# Text demo
from transformers import pipeline

# ===================== APP INIT =====================
app = FastAPI(title="AIKosh Spaces Backend")

# ===================== CORS =====================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow any origin for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===================== DATABASE =====================
spaces_db = []

# ===================== UPLOADED MODELS FOLDER =====================
upload_folder = "uploaded_models"
os.makedirs(upload_folder, exist_ok=True)

# ===================== DEMO MODELS =====================
demo_models = [
    {"model_name": "Image Classifier (MobileNetV2)", "path": "demo_image", "status": "Ready"},
    {"model_name": "Text Sentiment Classifier (DistilBERT)", "path": "demo_text", "status": "Ready"},
    {"model_name": "Random Demo Model", "path": "demo_random", "status": "Ready"}
]

# Add uploaded models from folder
for f in os.listdir(upload_folder):
    spaces_db.append({
        "model_name": f,
        "path": os.path.join(upload_folder, f),
        "status": "Uploaded"
    })

# Add demo models
spaces_db.extend(demo_models)

# ===================== LOAD ONLINE MODELS =====================
image_model = MobileNetV2(weights="imagenet")  # image classifier
text_classifier = pipeline("sentiment-analysis")  # text classifier

# ===================== ROUTES =====================
@app.get("/")
def home():
    return {"message": "AIKosh Spaces Backend Running!"}

# --------------------- List Spaces ---------------------
@app.get("/list-spaces")
def list_spaces():
    """
    Returns all available models: uploaded + demo models
    """
    return spaces_db

# --------------------- Upload Model ---------------------
@app.post("/upload-model")
async def upload_model(file: UploadFile = File(...)):
    save_path = os.path.join(upload_folder, file.filename)
    with open(save_path, "wb") as f:
        f.write(await file.read())
    spaces_db.append({
        "model_name": file.filename,
        "path": save_path,
        "status": "Uploaded"
    })
    return {"message": "Model uploaded successfully!", "file": file.filename}

# --------------------- Model Demo ---------------------
@app.post("/model-demo-file/{model_name}")
async def run_demo_file(model_name: str, file: UploadFile = File(...)):
    """
    Run a demo for a specific model.
    Supports:
      - Image Classifier (MobileNetV2)
      - Text Sentiment Classifier (DistilBERT)
      - Random Demo Model
    """
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as f:
        f.write(await file.read())

    result = "No prediction"

    try:
        if model_name == "Image Classifier (MobileNetV2)":
            img = image.load_img(temp_path, target_size=(224,224))
            x = image.img_to_array(img)
            x = np.expand_dims(x, axis=0)
            x = preprocess_input(x)
            preds = image_model.predict(x)
            decoded = decode_predictions(preds, top=1)[0][0]
            result = f"{decoded[1]} ({decoded[2]*100:.2f}%)"

        elif model_name == "Text Sentiment Classifier (DistilBERT)":
            # Read uploaded text file as UTF-8
            content = (await file.read()).decode("utf-8")
            pred = text_classifier(content)[0]
            result = f"{pred['label']} ({pred['score']*100:.2f}%)"

        elif model_name == "Random Demo Model":
            result = random.choice(["Class A", "Class B", "Class C"])

        else:
            result = "Unknown model for demo."

    except Exception as e:
        result = f"Error: {str(e)}"

    # Remove temp file
    os.remove(temp_path)

    return {"demo_result": result}
