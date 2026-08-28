import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

import Header from "./components/Header";
import UploadPanel from "./components/UploadPanel";
import ResultPanel from "./components/ResultPanel";
import ArchitectureSection from "./components/ArchitectureSection";
import Footer from "./components/Footer";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [probabilities, setProbabilities] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Revoke the previous object URL whenever the preview changes/unmounts
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileSelected = (file) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPG or PNG).");
      return;
    }
    setError(null);
    setResult(null);
    setConfidence(null);
    setProbabilities(null);
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handlePredict = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);

    // Unchanged request contract: multipart/form-data, field name "file"
    const formData = new FormData();
    formData.append("file", image);

    try {
      const res = await axios.post(
        "https://ai-vqc-fruit.onrender.com/predict",
        formData
      );

      // Unchanged response handling
      setResult(res.data.prediction);
      setConfidence(res.data.confidence);
      setProbabilities(res.data.probabilities);
    } catch {
      setError("Backend connection error. Please try again.");
    }

    setLoading(false);
  };

  const handleReset = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setConfidence(null);
    setProbabilities(null);
    setError(null);
  };

  return (
    <div className="app">
      <Header />

      <main className="dashboard">
        <div className="dashboard-grid">
          <UploadPanel
            preview={preview}
            loading={loading}
            error={error}
            hasImage={!!image}
            onFileSelected={handleFileSelected}
            onAnalyze={handlePredict}
            onClear={handleReset}
          />
          <ResultPanel
            result={result}
            confidence={confidence}
            probabilities={probabilities}
            onReset={handleReset}
          />
        </div>

        <ArchitectureSection />
      </main>

      <Footer />
    </div>
  );
}

export default App;
