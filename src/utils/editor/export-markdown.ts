import { createSlug } from '../markdown/custom-renderer';

/**
 * Extracts a sensible file name from Markdown content based on the first heading.
 * Falls back to 'document.md' if no valid heading is present.
 */
export function getExportFilename(markdown: string): string {
  if (!markdown || !markdown.trim()) {
    return 'document.md';
  }

  // Look for first H1: # Heading
  const h1Match = markdown.match(/^#\s+(.+)$/m);
  if (h1Match && h1Match[1].trim()) {
    const slug = createSlug(h1Match[1].trim());
    if (slug && slug !== 'heading') {
      return `${slug}.md`;
    }
  }

  // Fallback to first H2: ## Heading
  const h2Match = markdown.match(/^##\s+(.+)$/m);
  if (h2Match && h2Match[1].trim()) {
    const slug = createSlug(h2Match[1].trim());
    if (slug && slug !== 'heading') {
      return `${slug}.md`;
    }
  }

  return 'document.md';
}

/**
 * Downloads the given Markdown string as a .md file directly in the browser.
 */
export function exportMarkdown(markdown: string, customFilename?: string): string {
  const filename = customFilename || getExportFilename(markdown);

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return filename;
  }

  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Free allocated memory
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);

  return filename;
}
