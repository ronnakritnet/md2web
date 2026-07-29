import { marked } from 'marked';

interface Footnote {
  id: string;
  text: string;
}

interface FootnoteExtensionOptions {
  footnoteLabel?: string;
  footnoteBackLabel?: string;
}

export function footnotesExtension(options: FootnoteExtensionOptions = {}) {
  const {
    footnoteLabel = 'Footnotes',
    footnoteBackLabel = '↩',
  } = options;

  const footnotes = new Map<string, Footnote>();
  let footnoteCounter = 0;

  // Pre-process: extract footnote definitions
  const preprocess = (markdown: string): string => {
    // Clear previous footnote state at the start of each parse
    footnotes.clear();
    footnoteCounter = 0;

    const lines = markdown.split('\n');
    const processedLines: string[] = [];
    
    for (const line of lines) {
      const footnoteMatch = line.match(/^\[\^([^\]]+)\]:\s*(.+)$/);
      if (footnoteMatch) {
        const [, id, text] = footnoteMatch;
        footnotes.set(id, { id, text });
      } else {
        processedLines.push(line);
      }
    }
    
    return processedLines.join('\n');
  };

  // Post-process: replace footnote references and add footnote section
  const postprocess = (html: string): string => {
    if (footnotes.size === 0) return html;
    
    // Replace footnote references [^id] with links
    let processedHtml = html.replace(/\[\^([^\]]+)\]/g, (match, id) => {
      if (footnotes.has(id)) {
        footnoteCounter++;
        return `<sup class="footnote-ref"><a href="#fn-${id}" id="ref-${id}" class="text-sky-400 hover:text-sky-300 no-underline">${footnoteCounter}</a></sup>`;
      }
      return match;
    });
    
    // Reset counter for footnote section
    footnoteCounter = 0;
    const footnoteItems: string[] = [];
    
    // Sort footnotes by first reference order
    const sortedFootnotes = Array.from(footnotes.values());
    
    for (const footnote of sortedFootnotes) {
      footnoteCounter++;
      const content = marked.parse(footnote.text) as string;
      footnoteItems.push(
        `<li id="fn-${footnote.id}" class="mb-2">` +
          `<span class="text-slate-400 mr-2">${footnoteCounter}.</span>` +
          `<span>${content}</span>` +
          ` <a href="#ref-${footnote.id}" class="text-sky-400 hover:text-sky-300 ml-2 no-underline" aria-label="Back to reference">${footnoteBackLabel}</a>` +
        `</li>`
      );
    }
    
    const footnoteSection = `
      <div class="footnotes mt-8 pt-4 border-t border-neutral-800 text-sm">
        <h3 class="font-semibold text-slate-200 mb-3">${footnoteLabel}</h3>
        <ol class="list-none pl-0">
          ${footnoteItems.join('\n')}
        </ol>
      </div>
    `;
    
    return processedHtml + footnoteSection;
  };

  return {
    extensions: [],
    preprocess,
    postprocess,
  };
}
