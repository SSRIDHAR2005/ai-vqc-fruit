import { useRef, useState } from "react";

function UploadIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 16V4M12 4L7 9M12 4L17 9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UploadPanel({ preview, loading, error, onFileSelected, onAnalyze, onClear, hasImage }) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelected(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
  };

  return (
    <div className="panel upload-panel">
      <div className="panel-heading">
        <h2>1. Upload a fruit image</h2>
        <p>JPG or PNG, ideally a single fruit against a clear background.</p>
      </div>

      {!preview ? (
        <div
          className={`dropzone ${dragActive ? "dropzone-active" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload a fruit image by clicking or dragging a file here"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
        >
          <UploadIcon />
          <p className="dropzone-title">Drag & drop an image here</p>
          <p className="dropzone-sub">or click to browse your files</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            hidden
          />
        </div>
      ) : (
        <div className="preview-wrap">
          <div className={`preview-frame ${loading ? "is-scanning" : ""}`}>
            <img src={preview} alt="Selected fruit preview" className="preview-img" />
            {loading && (
              <div className="scan-overlay" aria-hidden="true">
                <div className="scan-sweep" />
              </div>
            )}
          </div>
          <button
            type="button"
            className="btn-ghost btn-small change-image-btn"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
          >
            Change image
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            hidden
          />
        </div>
      )}

      {error && (
        <div className="inline-error" role="alert">
          {error}
        </div>
      )}

      <div className="upload-actions">
        <button
          type="button"
          className="btn-primary"
          onClick={onAnalyze}
          disabled={!hasImage || loading}
        >
          {loading ? (
            <>
              <span className="spinner" aria-hidden="true" />
              Analyzing…
            </>
          ) : (
            "Analyze fruit"
          )}
        </button>
        {hasImage && (
          <button type="button" className="btn-ghost" onClick={onClear} disabled={loading}>
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

export default UploadPanel;
