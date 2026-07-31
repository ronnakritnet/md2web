const DRAFT_TEXT_KEY = 'md2web_draft_text';
const DRAFT_THEME_KEY = 'md2web_draft_theme';

export function saveDraft(markdownEditor: HTMLTextAreaElement): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(DRAFT_TEXT_KEY, markdownEditor.value);
  }
}

export function restoreDraft(
  markdownEditor: HTMLTextAreaElement,
  themeSelector: HTMLSelectElement | null,
  updatePreview: () => Promise<void>,
  updatePreviewTheme: () => void
): void {
  if (typeof window !== 'undefined') {
    const savedText = localStorage.getItem(DRAFT_TEXT_KEY);
    const savedTheme = localStorage.getItem(DRAFT_THEME_KEY);

    if (savedText) {
      markdownEditor.value = savedText;
      updatePreview();
    }

    if (savedTheme && themeSelector) {
      themeSelector.value = savedTheme;
      updatePreviewTheme();
    }
  }
}
