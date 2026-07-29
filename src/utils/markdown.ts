import { marked } from 'marked';
import { createCustomRenderer } from './markdown/custom-renderer';
import { footnotesExtension } from './markdown/footnotes-extension';

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

export async function parse(markdown: string): Promise<string> {
  try {
    // Pre-process for footnotes
    const preprocessed = footnotes.preprocess ? footnotes.preprocess(markdown) : markdown;
    
    // Parse markdown
    let html = await marked.parse(preprocessed) as string;
    
    // Post-process for footnotes
    if (footnotes.postprocess) {
      html = footnotes.postprocess(html);
    }
    
    return html;
  } catch (error) {
    console.error('Markdown parsing error:', error);
    // Return the raw markdown as fallback
    return `<pre class="text-red-400">Error parsing markdown: ${error instanceof Error ? error.message : 'Unknown error'}</pre>`;
  }
}
