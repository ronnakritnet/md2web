import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { createCustomRenderer } from './markdown/custom-renderer';
import { footnotesExtension } from './markdown/footnotes-extension';

function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') return html;
  try {
    const purify = typeof DOMPurify === 'function' ? DOMPurify(window) : DOMPurify;
    if (purify && typeof purify.sanitize === 'function') {
      return purify.sanitize(html, {
        USE_PROFILES: { html: true, svg: true },
        ADD_TAGS: ['input', 'button', 'svg', 'path', 'rect'],
        ADD_ATTR: [
          'target',
          'id',
          'class',
          'checked',
          'disabled',
          'type',
          'aria-label',
          'data-code',
          'xmlns',
          'viewBox',
          'fill',
          'stroke',
          'stroke-width',
          'stroke-linecap',
          'stroke-linejoin',
          'd',
          'rx',
          'ry',
          'x',
          'y',
          'width',
          'height',
          'title',
        ],
      });
    }
  } catch (error) {
    console.error('HTML sanitization error:', error);
  }
  return html;
}

export function createMarkdownParser() {
  // Configure marked with custom renderer and extensions
  marked.setOptions({
    breaks: true,
    gfm: true,
    renderer: createCustomRenderer(),
  });

  // Register footnotes extension
  const footnotes = footnotesExtension();

  marked.use({
    extensions: footnotes.extensions,
  });

  return {
    parse: async (markdown: string): Promise<string> => {
      try {
        // Pre-process for footnotes
        const preprocessed = footnotes.preprocess ? footnotes.preprocess(markdown) : markdown;

        // Parse markdown
        let html = await marked.parse(preprocessed) as string;

        // Post-process for footnotes
        if (footnotes.postprocess) {
          html = footnotes.postprocess(html);
        }

        // Sanitize generated HTML to prevent XSS attacks while preserving markdown elements
        return sanitizeHtml(html);
      } catch (error) {
        console.error('Markdown parsing error:', error);
        // Return the raw markdown as fallback
        return `<pre class="text-red-400">Error parsing markdown: ${error instanceof Error ? error.message : 'Unknown error'}</pre>`;
      }
    }
  };
}

// Export default instance for backward compatibility
const defaultParser = createMarkdownParser();
export const parse = defaultParser.parse;
