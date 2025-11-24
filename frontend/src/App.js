import React, { useState, useEffect } from "react";

const BASE_URL = "https://adaptable-generosity.up.railway.app";

function App() {
  const [models, setModels] = useState([]);
  const [file, setFile] = useState(null);

  // Fetch uploaded models
  const fetchModels = async () => {
    try {
      const res = await fetch(`${BASE_URL}/list-spaces`);
      const data = await res.json();
      setModels(data);
    } catch (err) {
      console.error("Error fetching models:", err);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return alert("Select a file first!");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${BASE_URL}/upload-model`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      alert(data.message);
      fetchModels(); // refresh list
    } catch (err) {
      console.error("Error uploading file:", err);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>AIKosh Spaces</h1>
      <div style={{ marginBottom: "20px" }}>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} style={{ marginLeft: "10px" }}>
          Upload Model
        </button>
      </div>
      <h2>Uploaded Models:</h2>
      <ul>
        {models.length === 0 && <li>No models uploaded yet.</li>}
        {models.map((m, idx) => (
          <li key={idx}>
            {m.model_name} — {m.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

