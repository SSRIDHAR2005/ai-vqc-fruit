function ScanGraphic() {
  return (
    <svg
      className="hero-graphic"
      viewBox="0 0 320 320"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustration of a fruit being scanned by the model"
    >
      <defs>
        <linearGradient id="fruitGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2E9E5B" />
          <stop offset="100%" stopColor="#123D2A" />
        </linearGradient>
      </defs>

      <circle cx="160" cy="170" r="98" fill="url(#fruitGrad)" />
      <path
        d="M160 72 C 150 50, 168 38, 186 40"
        stroke="#8B5A2B"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M164 66 C 190 52, 214 66, 210 88"
        stroke="#2E9E5B"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* orbiting quantum nodes */}
      <g className="orbit-group">
        <circle cx="160" cy="170" r="132" fill="none" stroke="#3B4FE0" strokeOpacity="0.25" strokeDasharray="2 8" />
        <circle className="orbit-node" cx="292" cy="170" r="6" fill="#3B4FE0" />
        <circle className="orbit-node orbit-node-2" cx="28" cy="170" r="5" fill="#3B4FE0" />
        <circle className="orbit-node orbit-node-3" cx="160" cy="38" r="4.5" fill="#3B4FE0" />
      </g>

      {/* scan line */}
      <clipPath id="fruitClip">
        <circle cx="160" cy="170" r="98" />
      </clipPath>
      <g clipPath="url(#fruitClip)">
        <rect className="scan-line" x="62" y="72" width="196" height="4" fill="#EAFBE4" opacity="0.9" />
      </g>
    </svg>
  );
}

function Header() {
  return (
    <header className="site-header">
      <div className="nav-bar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">◆</span>
          <span>AI&nbsp;VQC</span>
        </div>
        <nav className="nav-links">
          <a href="https://github.com/SSRIDHAR2005/sridhar-s-tech" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a
            href="https://drive.google.com/file/d/1bFDHmP8_9rLOuJDisZHYWFxwPTq28LhF/view?usp=drive_link"
            target="_blank"
            rel="noreferrer"
          >
            Paper
          </a>
        </nav>
      </div>

      <div className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Hybrid Classical + Quantum ML</span>
          <h1>
            Fruit quality grading,<br />decided in a single scan.
          </h1>
          <p className="hero-sub">
            Upload a photo and a hybrid CNN + Variational Quantum Classifier
            grades it as Good, Moderate, or Bad — with a full confidence
            breakdown per class.
          </p>
          <div className="stat-chips">
            <div className="chip">
              <strong>4</strong>
              <span>Qubits</span>
            </div>
            <div className="chip">
              <strong>3</strong>
              <span>Classes</span>
            </div>
            <div className="chip">
              <strong>VQC</strong>
              <span>+ CNN</span>
            </div>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <ScanGraphic />
        </div>
      </div>
    </header>
  );
}

export default Header;
