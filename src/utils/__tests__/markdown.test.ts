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

  it('should render footnotes properly', async () => {
    const md = 'Here is a statement[^1].\n\n[^1]: This is the citation.';
    const html = await parse(md);

    expect(html).toContain('class="footnote-ref"');
    expect(html).toContain('href="#fn-1"');
    expect(html).toContain('id="fn-1"');
    expect(html).toContain('class="footnotes');
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
