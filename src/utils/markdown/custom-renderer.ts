import { marked, type Renderer } from 'marked';

export function createCustomRenderer(): Renderer {
  const renderer = new marked.Renderer();
  
  // Wrap tables in responsive container for mobile scrolling
  const originalTable = renderer.table.bind(renderer);
  renderer.table = function(token) {
    const tableHtml = originalTable(token);
    return `<div class="overflow-x-auto my-4">${tableHtml}</div>`;
  };
  
  return renderer;
}
