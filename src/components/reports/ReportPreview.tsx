import { clsx } from 'clsx';

/**
 * Renders the generated report string with lightweight markdown-like
 * visual styling — no external parser needed since the format is controlled
 * by generateReport.ts.
 */
export function ReportPreview({ text }: { text: string }) {
  const lines = text.split('\n');

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 font-mono text-sm leading-relaxed">
      {lines.map((line, idx) => {
        if (line.startsWith('# ')) {
          return (
            <p key={idx} className="mt-0 mb-2 text-xl font-bold text-slate-900 font-sans">
              {line.slice(2)}
            </p>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <p key={idx} className="mt-5 mb-2 text-base font-semibold text-slate-800 font-sans">
              {line.slice(3)}
            </p>
          );
        }
        if (line.startsWith('### ')) {
          return (
            <p key={idx} className="mt-4 mb-1.5 text-sm font-semibold text-slate-700 font-sans">
              {line.slice(4)}
            </p>
          );
        }
        if (line === '---') {
          return <hr key={idx} className="my-4 border-slate-200" />;
        }
        if (line.startsWith('- ')) {
          return (
            <p key={idx} className="text-slate-700">
              {renderInline(line)}
            </p>
          );
        }
        if (line.startsWith('  ')) {
          // Indented description continuation
          return (
            <p key={idx} className="ml-4 text-xs text-slate-500">
              {line.trim()}
            </p>
          );
        }
        if (line === '') {
          return <div key={idx} className="h-1" />;
        }
        return (
          <p key={idx} className={clsx('text-slate-600', line.startsWith('_') && 'italic text-slate-400')}>
            {renderInline(line)}
          </p>
        );
      })}
    </div>
  );
}

/** Render **bold**, _italic_, and ~~strikethrough~~ inline markdown. */
function renderInline(text: string): React.ReactNode {
  // Split on **, ~~, _ markers and build a React node array
  const parts: React.ReactNode[] = [];
  // Matches: **bold**, ~~strike~~, _italic_
  const pattern = /(\*\*[^*]+\*\*|~~[^~]+~~|_[^_]+_)/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    const token = match[0];
    if (token.startsWith('**')) {
      parts.push(<strong key={match.index} className="font-semibold text-slate-900">{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('~~')) {
      parts.push(<del key={match.index} className="text-slate-400">{token.slice(2, -2)}</del>);
    } else {
      parts.push(<em key={match.index} className="text-slate-500">{token.slice(1, -1)}</em>);
    }
    last = match.index + token.length;
  }

  if (last < text.length) {
    parts.push(text.slice(last));
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>;
}
