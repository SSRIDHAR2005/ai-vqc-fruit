import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [probabilities, setProbabilities] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showArch, setShowArch] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handlePredict = async () => {
    if (!image) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", image);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/predict",
        formData
      );

      setResult(res.data.prediction);
      setConfidence(res.data.confidence);
      setProbabilities(res.data.probabilities);

    } catch (err) {
      alert("Backend connection error");
    }

    setLoading(false);
  };

  return (
    <div className="app">

      <div className="card">

        <h1>🍎 AI VQC Fruit Quality</h1>
        <p className="subtitle">
          Hybrid Classical + Quantum Machine Learning
        </p>

        <div className="metrics">
          <div>🧠 4 Qubits</div>
          <div>📊 3 Classes</div>
          <div>⚡ VQC + CNN</div>
        </div>

        <input type="file" onChange={handleFile} />

        {preview && (
          <img src={preview} alt="preview" className="preview" />
        )}

        <button onClick={handlePredict}>
          {loading ? "Analyzing..." : "Analyze Fruit"}
        </button>

        {result && (
          <div className="result-section">

            <h2 className={`badge ${result}`}>
              {result.toUpperCase()}
            </h2>

            <p className="confidence-text">
              Confidence: {(confidence * 100).toFixed(2)}%
            </p>

            <div className="probabilities">
              {probabilities &&
                Object.entries(probabilities).map(([label, value]) => (
                  <div key={label} className="prob-row">
                    <span>{label}</span>
                    <div className="bar">
                      <div
                        className="fill"
                        style={{ width: `${value * 100}%` }}
                      ></div>
                    </div>
                    <span>{(value * 100).toFixed(1)}%</span>
                  </div>
                ))}
            </div>

          </div>
        )}

        <button
          className="arch-btn"
          onClick={() => setShowArch(!showArch)}
        >
          {showArch ? "Hide Architecture" : "View Model Architecture"}
        </button>

        {showArch && (
  <div className="architecture">
    <h3>Model Architecture</h3>

    <ul className="arch-list">
      <li>
        <strong>Hybrid CNN + VQC Classifier</strong> combining classical feature
        extraction with quantum variational learning.
      </li>

      <li>
        <strong>Classical Featurizer:</strong> 3 Conv2D + ReLU blocks →
        AdaptiveAvgPool2D → Linear(64 → 4) producing a 4-dimensional feature vector.
      </li>

      <li>
        <strong>Quantum Circuit:</strong> 4 qubits with AngleEmbedding (RY rotations)
        using one feature per qubit.
      </li>

      <li>
        <strong>Variational Layers:</strong> 4 layers of
        StronglyEntanglingLayers with trainable rotations and entanglement.
      </li>

      <li>
        <strong>Measurement:</strong> Pauli-Z expectation values producing
        3 logits (Good / Moderate / Bad).
      </li>

      <li>
        <strong>Training:</strong> End-to-end hybrid optimization using Adam,
        updating both CNN and quantum parameters.
      </li>
    </ul>
  </div>
)}

        <div className="links">
          <a href="https://github.com/SSRIDHAR2005/sridhar-s-tech" target="_blank">🔗 GitHub</a>
          <a href="https://drive.google.com/file/d/1bFDHmP8_9rLOuJDisZHYWFxwPTq28LhF/view?usp=drive_link" target="_blank">📄 Conference Paper</a>
        </div>

      </div>
    </div>
  );
}

export default App;