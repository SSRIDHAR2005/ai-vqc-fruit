function ConfidenceGauge({ value, color }) {
  const size = 128;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, value ?? 0));
  const offset = circumference * (1 - pct);

  return (
    <div className="gauge" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="gauge-ring"
        />
      </svg>
      <div className="gauge-label">
        <span className="gauge-value">{(pct * 100).toFixed(0)}%</span>
        <span className="gauge-caption">confidence</span>
      </div>
    </div>
  );
}

export default ConfidenceGauge;
