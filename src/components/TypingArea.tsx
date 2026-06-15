interface Props {
  target: string;
  typed: string;
  finished: boolean;
  justify: boolean; // justified alignment for prose (theory/interview)
}

export function TypingArea({ target, typed, finished, justify }: Props) {
  const chars = target.split("");

  return (
    <div
      className={`font-mono text-[1.35rem] leading-[2.1] whitespace-pre-wrap break-words select-none ${
        justify ? "text-justify" : ""
      }`}
    >
      {chars.map((ch, i) => {
        const isCaret = !finished && i === typed.length;
        let cls = "text-dim";
        if (i < typed.length) {
          if (typed[i] === ch) {
            cls = "text-fg";
          } else {
            cls = ch === " " || ch === "\n" ? "text-error bg-error/25 rounded-sm" : "text-error";
          }
        }
        const display = ch === "\n" ? "\u23CE\n" : ch;
        return (
          <span key={i} className={`${cls}${isCaret ? " caret" : ""}`}>
            {display}
          </span>
        );
      })}
    </div>
  );
}
