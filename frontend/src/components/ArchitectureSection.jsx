import { useState } from "react";

const STEPS = [
  {
    title: "Hybrid CNN + VQC classifier",
    detail:
      "Classical feature extraction is combined with quantum variational learning in a single end-to-end model.",
  },
  {
    title: "Classical featurizer",
    detail:
      "3 Conv2D + ReLU blocks, followed by AdaptiveAvgPool2D and a Linear(64 → 4) layer, producing a 4-dimensional feature vector.",
  },
  {
    title: "Quantum circuit",
    detail: "4 qubits with AngleEmbedding (RY rotations), one input feature per qubit.",
  },
  {
    title: "Variational layers",
    detail: "4 layers of StronglyEntanglingLayers with trainable rotation and entanglement parameters.",
  },
  {
    title: "Measurement",
    detail: "Pauli-Z expectation values produce 3 logits, one per quality class (Good / Moderate / Bad).",
  },
  {
    title: "Training",
    detail: "End-to-end hybrid optimization with Adam, updating both the CNN and quantum parameters jointly.",
  },
];

function ArchitectureSection() {
  const [open, setOpen] = useState(false);

  return (
    <section className="panel arch-panel">
      <button
        type="button"
        className="arch-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>Model architecture</span>
        <svg
          className={`chevron ${open ? "chevron-open" : ""}`}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ol className="arch-list">
          {STEPS.map((step, i) => (
            <li key={step.title}>
              <span className="arch-index">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <strong>{step.title}</strong>
                <p>{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export default ArchitectureSection;
