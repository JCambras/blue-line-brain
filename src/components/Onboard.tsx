interface OnboardProps {
  onClose: () => void;
}

export function Onboard({ onClose }: OnboardProps) {
  return (
    <div className="blb-modal-bg">
      <div className="blb-modal">
        <div className="blb-modal-tag">WELCOME, KID</div>
        <h2>Three rules.</h2>
        <ol className="blb-modal-list">
          <li>
            <strong>Read the ice</strong> — every scenario shows a real situation.
          </li>
          <li>
            <strong>Pick fast</strong> — the timer matters. Speed is the skill.
          </li>
          <li>
            <strong>Wrong is fine</strong> — every miss tells you why. Then you go
            again.
          </li>
        </ol>
        <button
          className="blb-cta-primary blb-modal-btn"
          onClick={onClose}
        >
          LACE 'EM UP
        </button>
      </div>
    </div>
  );
}
