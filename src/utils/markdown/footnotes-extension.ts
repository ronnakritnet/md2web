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

  // Pre-process: extract footnote definitions
  const preprocess = (markdown: string): string => {
    // Clear previous footnote state at the start of each parse
    footnotes.clear();

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

    const footnoteIndexMap = new Map<string, number>();
    const referenceCountMap = new Map<string, number>();
    let counter = 0;
    
    // Replace footnote references [^id] with links and maintain consistent numbers
    const processedHtml = html.replace(/\[\^([^\]]+)\]/g, (match, id) => {
      if (!footnotes.has(id)) return match;

      if (!footnoteIndexMap.has(id)) {
        counter++;
        footnoteIndexMap.set(id, counter);
      }
      const num = footnoteIndexMap.get(id)!;
      const refCount = (referenceCountMap.get(id) || 0) + 1;
      referenceCountMap.set(id, refCount);
      const refAnchorId = refCount === 1 ? `ref-${id}` : `ref-${id}-${refCount}`;

      return `<sup class="footnote-ref"><a href="#fn-${id}" id="${refAnchorId}" class="text-sky-400 hover:text-sky-300 no-underline">${num}</a></sup>`;
    });
    
    // Sort footnotes by their appearance order in the text
    const referencedFootnotes = Array.from(footnotes.values())
      .filter(fn => footnoteIndexMap.has(fn.id))
      .sort((a, b) => (footnoteIndexMap.get(a.id) || 0) - (footnoteIndexMap.get(b.id) || 0));

    // Also include any unreferenced defined footnotes at the end
    const unreferencedFootnotes = Array.from(footnotes.values())
      .filter(fn => !footnoteIndexMap.has(fn.id));

    const allOrderedFootnotes = [...referencedFootnotes, ...unreferencedFootnotes];

    const footnoteItems: string[] = [];
    
    for (const footnote of allOrderedFootnotes) {
      const num = footnoteIndexMap.get(footnote.id) || (++counter);
      const content = marked.parseInline(footnote.text) as string;
      const totalRefs = referenceCountMap.get(footnote.id) || 0;

      let backlinks = '';
      if (totalRefs <= 1) {
        backlinks = `<a href="#ref-${footnote.id}" class="text-sky-400 hover:text-sky-300 ml-2 no-underline" aria-label="Back to reference">${footnoteBackLabel}</a>`;
      } else {
        const links = Array.from({ length: totalRefs }, (_, i) => {
          const anchor = i === 0 ? `ref-${footnote.id}` : `ref-${footnote.id}-${i + 1}`;
          return `<a href="#${anchor}" class="text-sky-400 hover:text-sky-300 ml-1 no-underline" aria-label="Back to reference ${i + 1}">${footnoteBackLabel}<sup>${i + 1}</sup></a>`;
        });
        backlinks = links.join(' ');
      }

      footnoteItems.push(
        `<li id="fn-${footnote.id}" class="mb-2">` +
          `<span class="text-slate-400 mr-2">${num}.</span>` +
          `<span>${content}</span>` +
          ` ${backlinks}` +
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
