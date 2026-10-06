import { compress } from '../compression';

const MAX_SIZE = 30000; // 30KB safe limit for URL hash

export function generateUrl(
  markdownEditor: HTMLTextAreaElement,
  themeColor: string,
  urlModal: HTMLElement,
  generatedUrl: HTMLInputElement
): void {
  if (typeof window === 'undefined') return;

  const markdown = markdownEditor.value;

  if (!markdown.trim()) {
    alert('Please enter some Markdown content first.');
    return;
  }

  const payload = JSON.stringify({ theme: themeColor, markdown });

  try {
    const compressed = compress(payload);

    let url;
    if (window.location.origin === 'null' || window.location.origin.includes('file://')) {
      url = window.location.href.split('#')[0] + '#' + compressed;
    } else {
      url = window.location.origin + window.location.pathname + '#' + compressed;
    }

    // Validate size (URL hash limit is ~32KB across major browsers)
    if (url.length > MAX_SIZE) {
      alert(`Compressed URL is too large (${url.length} chars). Maximum safe length is ${MAX_SIZE} characters. Please reduce document length or embedded data.`);
      return;
    }

    generatedUrl.value = url;
    urlModal.classList.remove('hidden');
  } catch (error) {
    console.error('Compression error:', error);
    alert('Failed to compress content. Please try again.');
  }
}

export function closeModal(urlModal: HTMLElement): void {
  urlModal.classList.add('hidden');
}
