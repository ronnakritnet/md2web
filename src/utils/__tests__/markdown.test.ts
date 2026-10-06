import { describe, it, expect } from 'vitest';
import { parse } from '../markdown';

describe('markdown parser and sanitizer', () => {
  it('should parse basic markdown syntax into HTML', async () => {
    const md = '# Main Heading\n\nThis is **bold** and *italic*.';
    const html = await parse(md);

    expect(html).toContain('<h1');
    expect(html).toContain('Main Heading');
    expect(html).toContain('<strong>bold</strong>');
    expect(html).toContain('<em>italic</em>');
  });

  it('should render GFM tables with responsive wrapper', async () => {
    const md = `| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |`;
    const html = await parse(md);

    expect(html).toContain('<table');
    expect(html).toContain('overflow-x-auto');
    expect(html).toContain('Header 1');
    expect(html).toContain('Cell 1');
  });

  it('should add slug id to headings for internal table of contents navigation', async () => {
    const md = '# Main Heading\n\n## Section One\n\n### บทนำ';
    const html = await parse(md);

    expect(html).toContain('<h1 id="main-heading">');
    expect(html).toContain('<h2 id="section-one">');
    expect(html).toContain('<h3 id="บทนำ">');
  });

  it('should render footnotes properly with stable numbering for multiple references', async () => {
    const md = 'Statement one[^1] and statement two[^1] followed by note two[^2].\n\n[^1]: Citation one\n[^2]: Citation two';
    const html = await parse(md);

    // Both references to footnote 1 should display [1]
    expect(html).toContain('id="ref-1" class="text-sky-400 hover:text-sky-300 no-underline">1</a>');
    expect(html).toContain('id="ref-1-2" class="text-sky-400 hover:text-sky-300 no-underline">1</a>');
    // Reference to footnote 2 should display [2]
    expect(html).toContain('id="ref-2" class="text-sky-400 hover:text-sky-300 no-underline">2</a>');

    expect(html).toContain('id="fn-1"');
    expect(html).toContain('id="fn-2"');
    expect(html).toContain('class="footnotes');
  });

  it('should render task list checkboxes', async () => {
    const md = '- [x] Completed task\n- [ ] Pending task';
    const html = await parse(md);

    expect(html).toContain('<input');
    expect(html).toContain('type="checkbox"');
    expect(html).toContain('checked');
    expect(html).toContain('Completed task');
    expect(html).toContain('Pending task');
  });

  describe('Syntax Highlighting and Code Blocks', () => {
    it('should render code blocks with syntax highlighting and language badge', async () => {
      const md = '```javascript\nconst greeting = "Hello, world!";\n```';
      const html = await parse(md);

      expect(html).toContain('code-block-container');
      expect(html).toContain('code-lang uppercase');
      expect(html).toContain('javascript</span>');
      expect(html).toContain('hljs');
      expect(html).toContain('language-javascript');
      expect(html).toContain('copy-code-btn');
      expect(html).toContain('data-code');
    });

    it('should auto-detect syntax when language is not specified', async () => {
      const md = '```\nfunction add(a, b) {\n  return a + b;\n}\n```';
      const html = await parse(md);

      expect(html).toContain('code-block-container');
      expect(html).toContain('hljs');
      expect(html).toContain('copy-code-btn');
    });

    it('should preserve copy button and data-code attribute through sanitization', async () => {
      const md = '```python\nprint("test")\n```';
      const html = await parse(md);

      expect(html).toContain('<button');
      expect(html).toContain('copy-code-btn');
      expect(html).toContain('data-code=');
      expect(html).toContain('<svg');
    });
  });

  describe('XSS Protection (DOMPurify Sanitization)', () => {
    it('should strip script tags from rendered HTML', async () => {
      const maliciousMd = 'Normal text\n\n<script>alert("XSS")</script>\n\nMore text';
      const html = await parse(maliciousMd);

      expect(html).not.toContain('<script>');
      expect(html).not.toContain('alert("XSS")');
      expect(html).toContain('Normal text');
      expect(html).toContain('More text');
    });

    it('should strip onerror event handlers from img tags', async () => {
      const maliciousMd = '<img src="invalid-image.jpg" onerror="alert(\'XSS\')">';
      const html = await parse(maliciousMd);

      expect(html).not.toContain('onerror');
      expect(html).not.toContain('alert(');
    });

    it('should strip javascript: pseudo-protocol in links', async () => {
      const maliciousMd = '[Click me](javascript:alert("XSS"))';
      const html = await parse(maliciousMd);

      expect(html).not.toContain('href="javascript:');
      expect(html).not.toContain('alert(');
    });

    it('should strip iframe elements', async () => {
      const maliciousMd = '<iframe src="https://evil.example.com"></iframe>';
      const html = await parse(maliciousMd);

      expect(html).not.toContain('<iframe');
    });
  });
});
