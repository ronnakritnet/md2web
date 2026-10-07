import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getExportFilename, exportMarkdown } from '../editor/export-markdown';

describe('export-markdown utility', () => {
  describe('getExportFilename', () => {
    it('should derive filename from first H1 heading', () => {
      const md = '# My Awesome Project\n\nSome introductory content.';
      expect(getExportFilename(md)).toBe('my-awesome-project.md');
    });

    it('should support Thai language in headings', () => {
      const md = '# บันทึกการประชุม ประจำสัปดาห์\n\nรายละเอียด';
      expect(getExportFilename(md)).toBe('บันทึกการประชุม-ประจำสัปดาห์.md');
    });

    it('should fallback to H2 when no H1 is present', () => {
      const md = 'Paragraph before\n\n## Sub Section Title\n\nMore content';
      expect(getExportFilename(md)).toBe('sub-section-title.md');
    });

    it('should return document.md when no heading is found', () => {
      const md = 'Just some paragraphs without any heading.\nLine 2.';
      expect(getExportFilename(md)).toBe('document.md');
    });

    it('should return document.md for empty or whitespace content', () => {
      expect(getExportFilename('')).toBe('document.md');
      expect(getExportFilename('   \n  \t ')).toBe('document.md');
    });

    it('should strip special characters from heading', () => {
      const md = '# Guide: 100% Tips & Tricks?! (2026)\n\nContent';
      expect(getExportFilename(md)).toBe('guide-100-tips-tricks-2026.md');
    });

    it('should support international accented characters and non-Latin scripts', () => {
      const md = '# Mon Résumé & Profil\n\nContenu';
      expect(getExportFilename(md)).toBe('mon-résumé-profil.md');
    });
  });

  describe('exportMarkdown', () => {
    let originalCreateObjectURL: typeof URL.createObjectURL;
    let originalRevokeObjectURL: typeof URL.revokeObjectURL;

    beforeEach(() => {
      originalCreateObjectURL = URL.createObjectURL;
      originalRevokeObjectURL = URL.revokeObjectURL;
      URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url');
      URL.revokeObjectURL = vi.fn();
    });

    afterEach(() => {
      URL.createObjectURL = originalCreateObjectURL;
      URL.revokeObjectURL = originalRevokeObjectURL;
      vi.restoreAllMocks();
    });

    it('should trigger browser download using an anchor element', () => {
      const clickSpy = vi.fn();
      const originalCreateElement = document.createElement.bind(document);

      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        const el = originalCreateElement(tagName);
        if (tagName.toLowerCase() === 'a') {
          el.click = clickSpy;
        }
        return el;
      });

      const filename = exportMarkdown('# Test Note\nHello world');

      expect(filename).toBe('test-note.md');
      expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it('should respect custom filename if provided', () => {
      const clickSpy = vi.fn();
      const originalCreateElement = document.createElement.bind(document);

      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        const el = originalCreateElement(tagName);
        if (tagName.toLowerCase() === 'a') {
          el.click = clickSpy;
        }
        return el;
      });

      const filename = exportMarkdown('Some content', 'custom-name.md');

      expect(filename).toBe('custom-name.md');
      expect(clickSpy).toHaveBeenCalledTimes(1);
    });
  });
});
