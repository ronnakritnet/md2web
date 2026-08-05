const DRAFT_TEXT_KEY = 'md2web_draft_text';
const DRAFT_COLOR_KEY = 'md2web_draft_color';

export function saveDraft(markdownEditor: HTMLTextAreaElement): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(DRAFT_TEXT_KEY, markdownEditor.value);
  }
}

export function restoreDraft(
  markdownEditor: HTMLTextAreaElement,
  updatePreview: () => Promise<void>,
  updatePreviewTheme: (color?: string) => void
): void {
  if (typeof window !== 'undefined') {
    const savedText = localStorage.getItem(DRAFT_TEXT_KEY);
    const savedColor = localStorage.getItem(DRAFT_COLOR_KEY);

    if (savedText) {
      markdownEditor.value = savedText;
      updatePreview();
    }

    if (savedColor) {
      updatePreviewTheme(savedColor);
    }
  }
}
