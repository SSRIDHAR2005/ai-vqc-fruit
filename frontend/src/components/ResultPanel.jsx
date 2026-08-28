import ConfidenceGauge from "./ConfidenceGauge";

const GRADE_META = {
  good: {
    label: "Good",
    desc: "Meets quality standards.",
    color: "var(--color-good)",
    bg: "var(--color-good-bg)",
    icon: (
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  moderate: {
    label: "Moderate",
    desc: "Some quality concerns detected.",
    color: "var(--color-moderate)",
    bg: "var(--color-moderate-bg)",
    icon: (
      <path
        d="M12 9v4m0 4h.01M10.29 3.86l-8.02 13.9A1.5 1.5 0 003.55 20h16.9a1.5 1.5 0 001.28-2.24l-8.02-13.9a1.5 1.5 0 00-2.56 0z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  bad: {
    label: "Bad",
    desc: "Fails quality standards.",
    color: "var(--color-bad)",
    bg: "var(--color-bad-bg)",
    icon: (
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  uncertain: {
    label: "Uncertain",
    desc: "Model confidence was too low to commit to a grade.",
    color: "var(--color-uncertain)",
    bg: "var(--color-uncertain-bg)",
    icon: (
      <path
        d="M9.5 9a2.5 2.5 0 115 .5c0 1.5-2.5 1.8-2.5 3.5M12 17h.01"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
};

function EmptyState() {
  return (
    <div className="result-empty">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 16l3-4 2.5 3L16 11l3 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="result-empty-title">No analysis yet</p>
      <p className="result-empty-sub">Upload an image and run analysis to see the grade here.</p>
    </div>
  );
}

function ResultPanel({ result, confidence, probabilities, onReset }) {
  const meta = result ? GRADE_META[result] ?? GRADE_META.uncertain : null;

  const sortedProbs = probabilities
    ? Object.entries(probabilities).sort((a, b) => b[1] - a[1])
    : [];

  return (
    <div className="panel result-panel">
      <div className="panel-heading">
        <h2>2. Grading result</h2>
        <p>Predicted quality class and model confidence.</p>
      </div>

      {!result ? (
        <EmptyState />
      ) : (
        <div className="result-body">
          <div className="result-top">
            <div className="grade-badge" style={{ background: meta.bg, color: meta.color }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                {meta.icon}
              </svg>
              <span>{meta.label}</span>
            </div>
            <ConfidenceGauge value={confidence} color={meta.color} />
          </div>

          <p className="grade-desc">{meta.desc}</p>

          {sortedProbs.length > 0 && (
            <div className="probabilities">
              <p className="probabilities-title">Class probabilities</p>
              {sortedProbs.map(([label, value]) => {
                const rowMeta = GRADE_META[label] ?? GRADE_META.uncertain;
                return (
                  <div key={label} className="prob-row">
                    <span className="prob-label">{rowMeta.label ?? label}</span>
                    <div className="bar" role="progressbar" aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100}>
                      <div
                        className="fill"
                        style={{ width: `${value * 100}%`, background: rowMeta.color }}
                      />
                    </div>
                    <span className="prob-value">{(value * 100).toFixed(1)}%</span>
                  </div>
                );
              })}
            </div>
          )}

          <button type="button" className="btn-secondary" onClick={onReset}>
            Upload another image
          </button>
        </div>
      )}
    </div>
  );
}

export default ResultPanel;
