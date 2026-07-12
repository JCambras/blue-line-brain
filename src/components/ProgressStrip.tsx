import type { ModuleId } from '@/types';
import { nextLevelInfo } from '@/data/levels';

interface ProgressStripProps {
  xp: number;
  moduleId: ModuleId;
}

export function ProgressStrip({ xp, moduleId }: ProgressStripProps) {
  const { next, prev, pctToNext } = nextLevelInfo(xp, moduleId);
  return (
    <div className="blb-progress">
      <div className="blb-progress-bar">
        <div
          className="blb-progress-fill"
          style={{ width: `${Math.min(100, pctToNext)}%` }}
        />
      </div>
      <div className="blb-progress-label">
        {prev.name} → {next.name} · {Math.round(pctToNext)}%
      </div>
    </div>
  );
}
