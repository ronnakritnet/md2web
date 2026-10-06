import { insertMarkdown } from './markdown-formatter';

const PAIRS: Record<string, string> = {
  '(': ')',
  '[': ']',
  '{': '}',
  '"': '"',
  "'": "'",
  '`': '`',
};

const CLOSING_CHARS = new Set([')', ']', '}', '"', "'", '`']);

export function handleEditorKeyDown(
  e: KeyboardEvent,
  textarea: HTMLTextAreaElement,
  updatePreview: () => Promise<void>
): void {
  const { key, shiftKey, ctrlKey, metaKey } = e;
  const { selectionStart: start, selectionEnd: end, value } = textarea;

  // 1. Keyboard formatting shortcuts (Ctrl+B / Ctrl+I / Cmd+B / Cmd+I)
  if (ctrlKey || metaKey) {
    if (key.toLowerCase() === 'b') {
      e.preventDefault();
      insertMarkdown(textarea, 'bold', updatePreview);
      return;
    }
    if (key.toLowerCase() === 'i') {
      e.preventDefault();
      insertMarkdown(textarea, 'italic', updatePreview);
      return;
    }
    return;
  }

  // 2. Tab and Shift+Tab indentation (2 spaces)
  if (key === 'Tab') {
    e.preventDefault();

    if (!shiftKey) {
      // Single cursor or single line without multi-line selection
      const isMultiLine = value.substring(start, end).includes('\n');

      if (!isMultiLine) {
        // Insert 2 spaces at current position
        const before = value.substring(0, start);
        const after = value.substring(end);
        textarea.value = before + '  ' + after;
        const newPos = start + 2;
        textarea.setSelectionRange(newPos, newPos);
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        return;
      }

      // Multi-line indent
      const lineStartIndex = value.lastIndexOf('\n', start - 1) + 1;
      const lines = value.substring(lineStartIndex, end).split('\n');
      const indented = lines.map(line => '  ' + line).join('\n');
      const before = value.substring(0, lineStartIndex);
      const after = value.substring(end);

      textarea.value = before + indented + after;
      textarea.setSelectionRange(start + 2, lineStartIndex + indented.length);
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      return;
    } else {
      // Shift + Tab: Unindent (remove up to 2 leading spaces)
      const lineStartIndex = value.lastIndexOf('\n', start - 1) + 1;
      const targetText = value.substring(lineStartIndex, end);
      const lines = targetText.split('\n');
      let removedCharsFirstLine = 0;
      let totalRemovedChars = 0;

      const unindented = lines.map((line, idx) => {
        let spacesToRemove = 0;
        if (line.startsWith('  ')) {
          spacesToRemove = 2;
        } else if (line.startsWith(' ')) {
          spacesToRemove = 1;
        }

        if (idx === 0) removedCharsFirstLine = spacesToRemove;
        totalRemovedChars += spacesToRemove;
        return line.substring(spacesToRemove);
      }).join('\n');

      const before = value.substring(0, lineStartIndex);
      const after = value.substring(end);

      textarea.value = before + unindented + after;
      const newStart = Math.max(lineStartIndex, start - removedCharsFirstLine);
      const newEnd = Math.max(newStart, end - totalRemovedChars);
      textarea.setSelectionRange(newStart, newEnd);
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      return;
    }
  }

  // 3. Backspace: delete matching pair if cursor is in between
  if (key === 'Backspace' && start === end && start > 0) {
    const charBefore = value[start - 1];
    const charAfter = value[start];

    if (PAIRS[charBefore] === charAfter) {
      e.preventDefault();
      textarea.value = value.substring(0, start - 1) + value.substring(start + 1);
      textarea.setSelectionRange(start - 1, start - 1);
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      return;
    }
  }

  // 4. Smart Quotes / Brackets Pair
  // If user has text selected and types an opening character: wrap selection
  if (start !== end && PAIRS[key]) {
    e.preventDefault();
    const openChar = key;
    const closeChar = PAIRS[key];
    const selectedText = value.substring(start, end);

    textarea.value = value.substring(0, start) + openChar + selectedText + closeChar + value.substring(end);
    textarea.setSelectionRange(start + 1, end + 1);
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    return;
  }

  // If no selection and user types a closing character when next char matches: skip over
  if (start === end && CLOSING_CHARS.has(key)) {
    if (value[start] === key) {
      // Skip over existing closing character
      e.preventDefault();
      textarea.setSelectionRange(start + 1, start + 1);
      return;
    }
  }

  // If no selection and user types an opening character: auto-insert pair
  if (start === end && PAIRS[key]) {
    e.preventDefault();
    const openChar = key;
    const closeChar = PAIRS[key];

    textarea.value = value.substring(0, start) + openChar + closeChar + value.substring(end);
    textarea.setSelectionRange(start + 1, start + 1);
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    return;
  }
}
