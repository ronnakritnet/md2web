export async function insertMarkdown(
  markdownEditor: HTMLTextAreaElement,
  format: string,
  updatePreview: () => Promise<void>
): Promise<void> {
  const start = markdownEditor.selectionStart;
  const end = markdownEditor.selectionEnd;
  const selectedText = markdownEditor.value.substring(start, end);

  let before = '';
  let after = '';
  let placeholder = '';
  let cursorOffset = 0;

  switch (format) {
    case 'bold':
      before = '**';
      after = '**';
      placeholder = 'bold text';
      break;
    case 'italic':
      before = '*';
      after = '*';
      placeholder = 'italic text';
      break;
    case 'h1':
      before = '# ';
      after = '';
      placeholder = 'Heading 1';
      break;
    case 'h2':
      before = '## ';
      after = '';
      placeholder = 'Heading 2';
      break;
    case 'link':
      before = '[';
      after = '](url)';
      placeholder = 'link text';
      cursorOffset = -4; // Position cursor before "url)"
      break;
    case 'list':
      before = '- ';
      after = '';
      placeholder = 'list item';
      break;
    case 'table':
      before = '| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |';
      after = '';
      placeholder = '';
      cursorOffset = 0;
      break;
    case 'tasklist':
      before = '- [ ] Task item\n- [ ] Another task';
      after = '';
      placeholder = '';
      cursorOffset = 0;
      break;
    case 'blockquote':
      before = '> ';
      after = '';
      placeholder = 'Quote text';
      break;
    case 'footnote':
      before = '[^1]';
      after = '';
      placeholder = '';
      // Add footnote definition at the end
      const currentText = markdownEditor.value;
      const footnoteDef = '\n\n[^1]: Footnote definition';
      const newText = currentText.substring(0, start) + before + currentText.substring(end) + footnoteDef;
      markdownEditor.value = newText;
      const newCursorPos = start + before.length;
      markdownEditor.setSelectionRange(newCursorPos, newCursorPos);
      markdownEditor.focus();
      // Trigger input event for live preview
      markdownEditor.dispatchEvent(new Event('input', { bubbles: true }));
      await updatePreview();
      return;
    case 'hr':
      before = '---';
      after = '';
      placeholder = '';
      break;
  }

  const newText = markdownEditor.value.substring(0, start) + before + (selectedText || placeholder) + after + markdownEditor.value.substring(end);
  markdownEditor.value = newText;

  let newCursorPos = start + before.length + (selectedText || placeholder).length + after.length + cursorOffset;
  if (cursorOffset !== 0) {
    newCursorPos = start + before.length + (selectedText || placeholder).length + cursorOffset;
  }
  markdownEditor.setSelectionRange(newCursorPos, newCursorPos);
  markdownEditor.focus();

  // Trigger input event for live preview
  markdownEditor.dispatchEvent(new Event('input', { bubbles: true }));
  await updatePreview();
}
