from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# Enable CORS for frontend
origins = [
    "http://localhost:3000",
    "https://phenomenal-youtiao-cdd6b2.netlify.app"  # replace with your Netlify URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Fake database
spaces_db = []

# ================== Endpoints ==================

@app.get("/")
def home():
    return {"message": "AIKosh Spaces Backend Running!"}

@app.post("/upload-model")
async def upload_model(file: UploadFile = File(...)):
    save_path = f"uploaded_models/{file.filename}"
    os.makedirs("uploaded_models", exist_ok=True)

    with open(save_path, "wb") as f:
        f.write(await file.read())

    # Store info
    spaces_db.append({
        "model_name": file.filename,
        "path": save_path,
        "status": "Uploaded"
    })

    return {"message": "Model uploaded successfully!", "file": file.filename}

@app.get("/list-spaces")
def list_spaces():
    return spaces_db

@app.get("/model-demo/{model_name}")
def model_demo(model_name: str):
    # Simulate a demo result
    return {"model": model_name, "demo_result": "This is a POC demo output"}
