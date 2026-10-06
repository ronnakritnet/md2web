import { describe, it, expect, vi } from 'vitest';
import { handleEditorKeyDown } from '../editor/keyboard-shortcuts';

function createMockTextarea(initialValue: string = '', start: number = 0, end: number = 0): HTMLTextAreaElement {
  const textarea = document.createElement('textarea');
  textarea.value = initialValue;
  textarea.selectionStart = start;
  textarea.selectionEnd = end;
  return textarea;
}

function simulateKeyDown(
  textarea: HTMLTextAreaElement,
  key: string,
  options: { shiftKey?: boolean; ctrlKey?: boolean; metaKey?: boolean } = {}
): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    key,
    shiftKey: options.shiftKey ?? false,
    ctrlKey: options.ctrlKey ?? false,
    metaKey: options.metaKey ?? false,
    bubbles: true,
    cancelable: true,
  });

  const updatePreview = vi.fn().mockResolvedValue(undefined);
  handleEditorKeyDown(event, textarea, updatePreview);
  return event;
}

describe('keyboard shortcuts', () => {
  describe('Tab & Indentation (2 spaces)', () => {
    it('should insert 2 spaces at cursor on Tab', () => {
      const textarea = createMockTextarea('Helloworld', 5, 5);
      const event = simulateKeyDown(textarea, 'Tab');

      expect(event.defaultPrevented).toBe(true);
      expect(textarea.value).toBe('Hello  world');
      expect(textarea.selectionStart).toBe(7);
      expect(textarea.selectionEnd).toBe(7);
    });

    it('should indent multiple selected lines with 2 spaces on Tab', () => {
      const textarea = createMockTextarea('line1\nline2\nline3', 2, 10);
      const event = simulateKeyDown(textarea, 'Tab');

      expect(event.defaultPrevented).toBe(true);
      expect(textarea.value).toBe('  line1\n  line2\nline3');
    });

    it('should unindent 2 spaces on Shift+Tab', () => {
      const textarea = createMockTextarea('  line1\n  line2', 0, 16);
      const event = simulateKeyDown(textarea, 'Tab', { shiftKey: true });

      expect(event.defaultPrevented).toBe(true);
      expect(textarea.value).toBe('line1\nline2');
    });

    it('should remove 1 space on Shift+Tab if line only has 1 leading space', () => {
      const textarea = createMockTextarea(' line1', 1, 1);
      const event = simulateKeyDown(textarea, 'Tab', { shiftKey: true });

      expect(event.defaultPrevented).toBe(true);
      expect(textarea.value).toBe('line1');
    });
  });

  describe('Smart Quotes / Brackets Pair', () => {
    it('should auto-insert closing pair for brackets and quotes', () => {
      const pairs = [
        { open: '(', expected: '()' },
        { open: '[', expected: '[]' },
        { open: '{', expected: '{}' },
        { open: '"', expected: '""' },
        { open: "'", expected: "''" },
        { open: '`', expected: '``' },
      ];

      for (const { open, expected } of pairs) {
        const textarea = createMockTextarea('', 0, 0);
        const event = simulateKeyDown(textarea, open);

        expect(event.defaultPrevented).toBe(true);
        expect(textarea.value).toBe(expected);
        expect(textarea.selectionStart).toBe(1);
        expect(textarea.selectionEnd).toBe(1);
      }
    });

    it('should wrap selected text when opening bracket or quote is typed', () => {
      const textarea = createMockTextarea('selected', 0, 8);
      const event = simulateKeyDown(textarea, '(');

      expect(event.defaultPrevented).toBe(true);
      expect(textarea.value).toBe('(selected)');
      expect(textarea.selectionStart).toBe(1);
      expect(textarea.selectionEnd).toBe(9);
    });

    it('should wrap selected text with quotes', () => {
      const textarea = createMockTextarea('code', 0, 4);
      const event = simulateKeyDown(textarea, '`');

      expect(event.defaultPrevented).toBe(true);
      expect(textarea.value).toBe('`code`');
      expect(textarea.selectionStart).toBe(1);
      expect(textarea.selectionEnd).toBe(5);
    });

    it('should skip over existing closing bracket when typing the closing character', () => {
      const textarea = createMockTextarea('()', 1, 1);
      const event = simulateKeyDown(textarea, ')');

      expect(event.defaultPrevented).toBe(true);
      expect(textarea.value).toBe('()');
      expect(textarea.selectionStart).toBe(2);
      expect(textarea.selectionEnd).toBe(2);
    });

    it('should skip over existing closing quote when typing the quote', () => {
      const textarea = createMockTextarea('""', 1, 1);
      const event = simulateKeyDown(textarea, '"');

      expect(event.defaultPrevented).toBe(true);
      expect(textarea.value).toBe('""');
      expect(textarea.selectionStart).toBe(2);
    });

    it('should delete both characters when backspacing between a matching pair', () => {
      const textarea = createMockTextarea('()', 1, 1);
      const event = simulateKeyDown(textarea, 'Backspace');

      expect(event.defaultPrevented).toBe(true);
      expect(textarea.value).toBe('');
      expect(textarea.selectionStart).toBe(0);
      expect(textarea.selectionEnd).toBe(0);
    });

    it('should delete both quotes when backspacing between matching quotes', () => {
      const textarea = createMockTextarea('``', 1, 1);
      const event = simulateKeyDown(textarea, 'Backspace');

      expect(event.defaultPrevented).toBe(true);
      expect(textarea.value).toBe('');
      expect(textarea.selectionStart).toBe(0);
    });

    it('should not delete next character if backspace is not between a matching pair', () => {
      const textarea = createMockTextarea('(a)', 2, 2);
      const event = simulateKeyDown(textarea, 'Backspace');

      // Regular backspace should not be prevented by the pair deletion logic
      expect(event.defaultPrevented).toBe(false);
    });
  });

  describe('Formatting Shortcuts', () => {
    it('should trigger bold formatting on Ctrl+B', () => {
      const textarea = createMockTextarea('text', 0, 4);
      const event = simulateKeyDown(textarea, 'b', { ctrlKey: true });

      expect(event.defaultPrevented).toBe(true);
      expect(textarea.value).toBe('**text**');
    });

    it('should trigger italic formatting on Ctrl+I', () => {
      const textarea = createMockTextarea('text', 0, 4);
      const event = simulateKeyDown(textarea, 'i', { ctrlKey: true });

      expect(event.defaultPrevented).toBe(true);
      expect(textarea.value).toBe('*text*');
    });
  });
});
