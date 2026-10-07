import { marked, type Renderer } from 'marked';
import hljs from 'highlight.js';

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/<[^>]+>/g, '') // strip HTML tags
    .replace(/[^\p{L}\p{M}\p{N}\s_-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '') || 'heading';
}

export function createCustomRenderer(): Renderer {
  const renderer = new marked.Renderer();
  
  // Wrap tables in responsive container for mobile scrolling
  const originalTable = renderer.table.bind(renderer);
  renderer.table = function(token) {
    const tableHtml = originalTable(token);
    return `<div class="overflow-x-auto my-4">${tableHtml}</div>`;
  };

  // Add id attributes to headings for internal links / Table of Contents
  renderer.heading = function(token) {
    const depth = token.depth;
    const text = token.text || '';
    const id = createSlug(text);
    const content = this.parser.parseInline(token.tokens);
    return `<h${depth} id="${id}">${content}</h${depth}>\n`;
  };

  // Syntax highlighting for code blocks with language badge and copy button
  renderer.code = function(token) {
    const code = token.text || '';
    const rawLang = (token.lang || '').trim().split(/\s+/)[0];
    let highlighted = '';

    if (rawLang && hljs.getLanguage(rawLang)) {
      try {
        highlighted = hljs.highlight(code, { language: rawLang }).value;
      } catch {
        highlighted = hljs.highlightAuto(code).value;
      }
    } else {
      try {
        highlighted = hljs.highlightAuto(code).value;
      } catch {
        highlighted = code
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
      }
    }

    const langBadge = rawLang ? `<span class="code-lang uppercase text-[11px] font-semibold text-slate-400 tracking-wider">${rawLang}</span>` : '<span></span>';
    const langClass = rawLang ? ` language-${rawLang}` : '';

    return `<div class="code-block-container relative my-4 rounded-lg overflow-hidden border border-slate-700/80 bg-[#0d1117]">` +
      `<div class="code-block-header flex items-center justify-between px-4 py-1.5 bg-slate-800/70 border-b border-slate-700/60 text-xs font-mono">` +
        langBadge +
        `<button type="button" class="copy-code-btn text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-xs py-0.5 px-2 rounded hover:bg-slate-700/50" data-code="${encodeURIComponent(code)}" title="Copy code" aria-label="Copy code">` +
          `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="copy-icon"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>` +
          `<span class="copy-label">Copy</span>` +
        `</button>` +
      `</div>` +
      `<pre class="!my-0 !p-4 !bg-transparent overflow-x-auto"><code class="hljs${langClass} font-mono text-sm leading-relaxed">${highlighted}</code></pre>` +
    `</div>\n`;
  };
  
  return renderer;
}
