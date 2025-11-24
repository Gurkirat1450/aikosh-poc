import React, { useState, useEffect } from "react";

const BASE_URL = "https://aikosh-poc-production.up.railway.app"; // live backend

function App() {
  const [spaces, setSpaces] = useState([]);
  const [file, setFile] = useState(null);
  const [demoResult, setDemoResult] = useState("");

  // Fetch list of models
  const fetchSpaces = async () => {
    const res = await fetch(`${BASE_URL}/list-spaces`);
    const data = await res.json();
    setSpaces(data);
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  // Upload model
  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${BASE_URL}/upload-model`, {
      method: "POST",
      body: formData,
    });
    await res.json();
    setFile(null);
    fetchSpaces();
  };

  // Run demo
  const runDemo = async (modelName) => {
    const res = await fetch(`${BASE_URL}/model-demo/${modelName}`);
    const data = await res.json();
    setDemoResult(`${modelName}: ${data.demo_result}`);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>AIKosh Spaces POC</h1>

      {/* ===== Upload Section ===== */}
      <div style={{ marginBottom: "2rem" }}>
        <h2>Deploy New Space</h2>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleUpload} disabled={!file}>
          Upload
        </button>
      </div>

      {/* ===== Spaces List ===== */}
      <div style={{ marginBottom: "2rem" }}>
        <h2>Available Spaces</h2>
        {spaces.length === 0 && <p>No models uploaded yet.</p>}
        <ul>
          {spaces.map((space, idx) => (
            <li key={idx}>
              {space.model_name} - {space.status}{" "}
              <button onClick={() => runDemo(space.model_name)}>Run Demo</button>
            </li>
          ))}
        </ul>
      </div>

      {/* ===== Demo Result ===== */}
      {demoResult && (
        <div>
          <h2>Live Demo</h2>
          <p>{demoResult}</p>
        </div>
      )}
    </div>
  );
}

export default App;
