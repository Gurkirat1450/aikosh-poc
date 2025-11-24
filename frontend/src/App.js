import React, { useState, useEffect } from "react";

const BASE_URL = "https://aikosh-poc-production.up.railway.app";

function App() {
  const [spaces, setSpaces] = useState([]);
  const [file, setFile] = useState(null);
  const [demoResult, setDemoResult] = useState("");

  // Fetch uploaded models
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
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-indigo-600 text-white py-6 shadow">
        <h1 className="text-3xl md:text-4xl font-bold text-center">
          AIKosh Spaces POC
        </h1>
      </header>

      <main className="p-6 max-w-6xl mx-auto space-y-12">
        {/* Deploy New Space */}
        <section className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-4">Deploy New Space</h2>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="border border-gray-300 rounded px-3 py-2 w-full md:w-auto"
            />
            <button
              onClick={handleUpload}
              disabled={!file}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 disabled:opacity-50"
            >
              Upload
            </button>
          </div>
        </section>

        {/* Spaces List */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Available Spaces
          </h2>
          {spaces.length === 0 ? (
            <p className="text-center text-gray-500">No models uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {spaces.map((space, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
                >
                  <h3 className="text-xl font-semibold mb-2">{space.model_name}</h3>
                  <p className="mb-3 text-gray-600">Status: {space.status}</p>
                  <button
                    onClick={() => runDemo(space.model_name)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-400"
                  >
                    Run Demo
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Demo Result */}
        {demoResult && (
          <section className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold mb-4 text-center">Live Demo</h2>
            <p className="text-center text-gray-700">{demoResult}</p>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
