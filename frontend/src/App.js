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
    <div className="min-h-screen bg-gray-100 p-6">
      {/* ===== Header ===== */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center text-indigo-600">
          AIKosh Spaces POC
        </h1>
      </header>

      {/* ===== Deploy New Space ===== */}
      <section className="mb-12 max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Deploy New Space</h2>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />
        <button
          onClick={handleUpload}
          disabled={!file}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 disabled:opacity-50"
        >
          Upload
        </button>
      </section>

      {/* ===== Spaces List ===== */}
      <section className="mb-12 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-center">Available Spaces</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.length === 0 && <p className="text-center col-span-full">No models uploaded yet.</p>}
          {spaces.map((space, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-2">{space.model_name}</h3>
              <p className="mb-2">Status: {space.status}</p>
              <button
                onClick={() => runDemo(space.model_name)}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-400"
              >
                Run Demo
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Demo Result ===== */}
      {demoResult && (
        <section className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4 text-center">Live Demo</h2>
          <p className="text-center">{demoResult}</p>
        </section>
      )}
    </div>
  );
}

export default App;
