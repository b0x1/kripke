import { useLayoutEffect, useRef } from "react";
import { type FormulaToken, tokenizeFormula } from "../engine/formulaText";
import { FormulaPalette } from "./FormulaPalette";

type PrettyProps = {
  text: string;
  unicode?: boolean;
};

export function FormulaView({ text, unicode = true }: PrettyProps) {
  const tokens = tokenizeFormula(text);
  return (
    <code className="formula-pretty">
      {tokens.map((token, i) => (
        <span key={i} className={tokenClass(token)}>
          {token.kind === "op" && unicode ? token.unicode : token.raw}
        </span>
      ))}
    </code>
  );
}

type FieldProps = {
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  "aria-label": string;
  showPalette?: boolean;
};

export function FormulaField({
  value,
  onChange,
  invalid,
  "aria-label": ariaLabel,
  showPalette = true,
}: FieldProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const html = tokensToHtml(value);
    if (el.innerHTML === html) {
      return;
    }
    const focused = document.activeElement === el;
    const caret = focused ? caretOffset(el) : 0;
    el.innerHTML = html;
    if (focused) {
      setCaretOffset(el, Math.min(caret, value.length));
    }
  }, [value]);

  function insertSymbol(symbol: string) {
    const el = ref.current;
    if (!el) {
      onChange(value + symbol);
      return;
    }
    const focused = document.activeElement === el;
    const caret = focused ? caretOffset(el) : value.length;
    const nextText = value.slice(0, caret) + symbol + value.slice(caret);
    el.innerHTML = tokensToHtml(nextText);
    const nextCaret = caret + symbol.length;
    if (!focused) {
      el.focus();
    }
    setCaretOffset(el, nextCaret);
    onChange(nextText);
  }

  return (
    <div className="formula-field-container">
      {showPalette ? (
        <FormulaPalette onInsert={insertSymbol} />
      ) : null}
      <div
        ref={ref}
        role="textbox"
        aria-label={ariaLabel}
        aria-invalid={invalid ? true : undefined}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        className="formula-input"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
        onPaste={(e) => {
          e.preventDefault();
          const el = ref.current;
          if (!el) {
            return;
          }
          const pasted = e.clipboardData.getData("text/plain").replace(/\n/g, "");
          const caret = caretOffset(el);
          const current = readText(el);
          const text = current.slice(0, caret) + pasted + current.slice(caret);
          el.innerHTML = tokensToHtml(text);
          setCaretOffset(el, caret + pasted.length);
          onChange(text);
        }}
        onInput={() => {
          const el = ref.current;
          if (!el) {
            return;
          }
          const text = readText(el);
          const caret = caretOffset(el);
          el.innerHTML = tokensToHtml(text);
          setCaretOffset(el, Math.min(caret, text.length));
          onChange(text);
        }}
      />
    </div>
  );
}

function tokensToHtml(text: string): string {
  if (text === "") {
    return "";
  }
  return tokenizeFormula(text)
    .map((token) => {
      const body = escapeHtml(token.raw);
      return `<span class="${tokenClass(token)}">${body}</span>`;
    })
    .join("");
}

function tokenClass(token: FormulaToken): string {
  return `tok-${token.role}`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function readText(el: HTMLElement): string {
  return (el.textContent ?? "").replace(/\n/g, "");
}

function caretOffset(root: HTMLElement): number {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) {
    return 0;
  }
  const range = sel.getRangeAt(0);
  const pre = range.cloneRange();
  pre.selectNodeContents(root);
  pre.setEnd(range.endContainer, range.endOffset);
  return pre.toString().length;
}

function setCaretOffset(root: HTMLElement, offset: number): void {
  const sel = window.getSelection();
  if (!sel) {
    return;
  }
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let remaining = offset;
  let node = walker.nextNode();
  while (node) {
    const len = node.textContent?.length ?? 0;
    if (remaining <= len) {
      const range = document.createRange();
      range.setStart(node, remaining);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      return;
    }
    remaining -= len;
    node = walker.nextNode();
  }
  const range = document.createRange();
  range.selectNodeContents(root);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
}
