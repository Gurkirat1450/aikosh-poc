from fastapi import FastAPI, UploadFile, File
import os

app = FastAPI()

# Fake database to store uploaded model info
spaces_db = []

@app.get("/")
def home():
    return {"message": "AIKosh Spaces Backend Running!"}

@app.post("/upload-model")
async def upload_model(file: UploadFile = File(...)):
    save_path = f"uploaded_models/{file.filename}"

    # Create folder if not exists
    os.makedirs("uploaded_models", exist_ok=True)

    with open(save_path, "wb") as f:
        f.write(await file.read())

    # Store model info in database
    spaces_db.append({
        "model_name": file.filename,
        "path": save_path,
        "status": "Uploaded"
    })

    return {"message": "Model uploaded successfully!", "file": file.filename}

@app.get("/list-spaces")
def list_spaces():
    return spaces_db

