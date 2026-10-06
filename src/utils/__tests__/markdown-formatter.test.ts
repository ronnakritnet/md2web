import { describe, it, expect, vi } from 'vitest';
import { insertMarkdown } from '../editor/markdown-formatter';

describe('markdown formatter utility', () => {
  it('should wrap selected text in bold markers', async () => {
    const textarea = document.createElement('textarea');
    textarea.value = 'Hello world';
    textarea.selectionStart = 6;
    textarea.selectionEnd = 11; // "world"

    const updatePreviewMock = vi.fn().mockResolvedValue(undefined);
    await insertMarkdown(textarea, 'bold', updatePreviewMock);

    expect(textarea.value).toBe('Hello **world**');
    expect(updatePreviewMock).toHaveBeenCalled();
  });

  it('should dynamically calculate next footnote number', async () => {
    const textarea = document.createElement('textarea');
    textarea.value = 'Point one[^1] and point two[^2].\n\n[^1]: Note 1\n[^2]: Note 2';
    // Cursor at position 9
    textarea.selectionStart = 9;
    textarea.selectionEnd = 9;

    const updatePreviewMock = vi.fn().mockResolvedValue(undefined);
    await insertMarkdown(textarea, 'footnote', updatePreviewMock);

    // Next footnote should be [^3]
    expect(textarea.value).toContain('[^3]');
    expect(textarea.value).toContain('[^3]: Footnote definition');
  });

  it('should insert link format and select the url placeholder', async () => {
    const textarea = document.createElement('textarea');
    textarea.value = 'Visit Google today';
    textarea.selectionStart = 6;
    textarea.selectionEnd = 12; // "Google"

    const updatePreviewMock = vi.fn().mockResolvedValue(undefined);
    await insertMarkdown(textarea, 'link', updatePreviewMock);

    expect(textarea.value).toBe('Visit [Google](url) today');
    // "url" starts at index 15 and ends at index 18
    expect(textarea.selectionStart).toBe(15);
    expect(textarea.selectionEnd).toBe(18);
  });
});
