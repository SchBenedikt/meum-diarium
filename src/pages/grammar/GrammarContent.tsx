import React from 'react';
import { CheckCircle2 } from 'lucide-react';

/**
 * Splits a long prose paragraph into an array of sentences, trimming whitespace.
 * Avoids splitting on common abbreviations like "z.B.", "bzw.", "u.a.", "d.h."
 */
export function splitToSentences(text: string): string[] {
  // Replace common abbreviations with a placeholder to avoid false splits
  const abbrevs: [RegExp, string][] = [
    [/z\.B\./g, 'z§B§'],
    [/bzw\./g, 'bzw§'],
    [/u\.a\./g, 'u§a§'],
    [/d\.h\./g, 'd§h§'],
    [/v\.\s*Chr\./g, 'v§Chr§'],
    [/n\.\s*Chr\./g, 'n§Chr§'],
    [/ca\./g, 'ca§'],
    [/etc\./g, 'etc§'],
    [/vgl\./g, 'vgl§'],
  ];
  let safe = text;
  for (const [re, placeholder] of abbrevs) {
    safe = safe.replace(re, placeholder);
  }
  const parts = safe
    .split(/\.\s+(?=[A-ZÄÖÜ])/)
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => (s.endsWith('.') ? s : `${s}.`));
  // Restore placeholders
  return parts.map(s => {
    let r = s;
    for (const [, placeholder] of abbrevs) {
      r = r.replace(new RegExp(placeholder.replace('§', '\\§'), 'g'), placeholder.replace('§', '.'));
    }
    // Restore all § to .
    r = r.replace(/§/g, '.');
    return r;
  });
}

/**
 * Parses a rules string into labelled rule objects.
 * Detects patterns like "Term: description." and splits accordingly.
 */
export function parseRules(text: string): { label: string; body: string }[] {
  // Split on label pattern: "Word(s): " at the start of each segment
  const pattern = /(?:^|\.\s+)([A-ZÄÖÜ][^:]{1,40}):\s+/g;
  const segments: { label: string; body: string }[] = [];
  let lastIndex = 0;
  let lastLabel = '';
  let match: RegExpExecArray | null;
  const clean = text.trim();
  while ((match = pattern.exec(clean)) !== null) {
    if (lastLabel && match.index > lastIndex) {
      segments.push({ label: lastLabel, body: clean.slice(lastIndex, match.index).trim().replace(/\.$/, '') });
    }
    lastLabel = match[1];
    lastIndex = match.index + match[0].length;
  }
  if (lastLabel) {
    segments.push({ label: lastLabel, body: clean.slice(lastIndex).trim().replace(/\.$/, '') });
  }
  // Fall back to simple sentence split if no labels detected
  if (segments.length === 0) {
    return splitToSentences(clean).map(s => ({ label: '', body: s }));
  }
  return segments;
}

/** Renders the intro/explanation block */
export function ExplanationBlock({ text }: { text: string }) {
  const sentences = splitToSentences(text);
  return (
    <div className="rounded-2xl border-l-4 border-primary bg-primary/5 px-5 py-4 space-y-1">
      {sentences.map((s, i) => (
        <p key={i} className={`${i === 0 ? 'text-sm font-medium text-foreground' : 'text-sm text-muted-foreground'} leading-relaxed`}>
          {s}
        </p>
      ))}
    </div>
  );
}

/** Renders the details block as a bullet list, one sentence per item */
export function DetailsList({ text }: { text: string }) {
  const sentences = splitToSentences(text);
  return (
    <ul className="space-y-2">
      {sentences.map((s, i) => (
        <li key={i} className="flex gap-3 items-start">
          <CheckCircle2 className="h-4 w-4 text-primary/60 mt-0.5 shrink-0" />
          <span className="text-sm text-muted-foreground leading-relaxed">{s}</span>
        </li>
      ))}
    </ul>
  );
}

/** Renders rules as labelled cards (label: body) */
export function RuleCards({ text }: { text: string }) {
  const rules = parseRules(text);
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {rules.map((rule, i) => (
        <div key={i} className="rounded-xl border border-border/60 bg-card p-3.5 space-y-1">
          {rule.label && (
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary">{rule.label}</p>
          )}
          <p className="text-sm text-muted-foreground leading-relaxed">{rule.body}</p>
        </div>
      ))}
    </div>
  );
}
