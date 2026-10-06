import { marked, type Renderer } from 'marked';

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/<[^>]+>/g, '') // strip HTML tags
    .replace(/[^\w\s\u0E00-\u0E7F-]/g, '')
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
  
  return renderer;
}
