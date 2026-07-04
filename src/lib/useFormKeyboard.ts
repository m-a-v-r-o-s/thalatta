'use client';

import { useEffect, useRef } from 'react';

const FIELD =
  'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled])';

/**
 * Mobile-friendly form behaviour. Attach the returned ref to the element that
 * wraps the fields:
 *   - the on-screen keyboard never covers the focused field; it is scrolled
 *     into the visible area (and kept there while the keyboard opens/resizes);
 *   - pressing Enter on the keyboard jumps to the next field and brings it into
 *     view (textareas keep Enter for new lines; the last field dismisses it).
 */
export function useFormKeyboard<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const isField = (el: EventTarget | null): el is HTMLElement =>
      el instanceof HTMLElement && el.matches(FIELD);

    const fields = () =>
      Array.from(root.querySelectorAll<HTMLElement>(FIELD)).filter((el) => el.offsetParent !== null);

    // Only active where there is an on-screen keyboard.
    const touch = () => window.matchMedia('(pointer: coarse)').matches;

    // Scroll a field into the part of the page the keyboard does not cover.
    const reveal = (el: HTMLElement) => {
      const vv = window.visualViewport;
      const rect = el.getBoundingClientRect();
      const topSafe = 108; // keep clear of the fixed header
      if (vv) {
        const bottomSafe = vv.offsetTop + vv.height - 16;
        if (rect.bottom > bottomSafe) {
          window.scrollBy({ top: rect.bottom - bottomSafe, behavior: 'smooth' });
        } else if (rect.top < vv.offsetTop + topSafe) {
          window.scrollBy({ top: rect.top - (vv.offsetTop + topSafe), behavior: 'smooth' });
        }
      } else {
        el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    };

    const onFocusIn = (e: FocusEvent) => {
      const el = e.target;
      if (!isField(el)) return;
      if (el.tagName !== 'TEXTAREA') {
        const isLast = fields().indexOf(el) === fields().length - 1;
        el.setAttribute('enterkeyhint', isLast ? 'done' : 'next');
      }
      // Give the on-screen keyboard a moment to open before measuring.
      if (touch()) window.setTimeout(() => reveal(el), 260);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || e.shiftKey) return;
      const el = e.target;
      if (!isField(el) || el.tagName === 'TEXTAREA') return;
      if (!touch()) return; // only hijack Enter where there is a soft keyboard
      e.preventDefault();
      const list = fields();
      const next = list[list.indexOf(el) + 1];
      if (next) {
        next.focus();
        const input = next as HTMLInputElement;
        if (input.setSelectionRange && /^(text|email|tel|search|url|password)$/.test(input.type)) {
          const end = input.value.length;
          try {
            input.setSelectionRange(end, end);
          } catch {
            /* some input types disallow selection */
          }
        }
      } else {
        el.blur(); // last field: close the keyboard
      }
    };

    const onViewportResize = () => {
      const active = document.activeElement;
      if (touch() && isField(active) && root.contains(active)) reveal(active);
    };

    root.addEventListener('focusin', onFocusIn);
    root.addEventListener('keydown', onKeyDown);
    window.visualViewport?.addEventListener('resize', onViewportResize);
    return () => {
      root.removeEventListener('focusin', onFocusIn);
      root.removeEventListener('keydown', onKeyDown);
      window.visualViewport?.removeEventListener('resize', onViewportResize);
    };
  }, []);

  return ref;
}
