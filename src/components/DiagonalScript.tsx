/**
 * Renders a line of text with each glyph kept upright while the baseline is
 * shaped. The actual shape is chosen by CSS from the page theme (see
 * globals.css): a gentle sine wave in light mode, a slight diagonal in dark.
 * Each character carries its wave offset (--wy) and the wrapper carries the
 * diagonal angle (--diag-angle). The full string is exposed via aria-label.
 */
export default function DiagonalScript({
  text,
  angle = 5,
  amplitude = 0.13,
  frequency = 0.42,
  className = '',
}: {
  text: string;
  angle?: number;
  amplitude?: number; // wave height, in em
  frequency?: number; // radians of wave per character
  className?: string;
}) {
  const chars = Array.from(text);
  return (
    <span
      aria-label={text}
      className={`diag-script ${className}`}
      style={{ display: 'inline-block', whiteSpace: 'nowrap', '--diag-angle': `${angle}deg` } as React.CSSProperties}
    >
      {chars.map((ch, i) => {
        const wy = ch === ' ' ? 0 : (amplitude * Math.sin(i * frequency)).toFixed(3);
        return (
          <span
            key={i}
            aria-hidden="true"
            className="diag-char"
            style={
              {
                display: 'inline-block',
                '--wy': `${wy}em`,
                ...(ch === ' ' ? { width: '0.26em' } : null),
              } as React.CSSProperties
            }
          >
            {ch === ' ' ? ' ' : ch}
          </span>
        );
      })}
    </span>
  );
}
