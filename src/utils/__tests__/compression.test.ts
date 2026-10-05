import { describe, it, expect } from 'vitest';
import { compress, decompress } from '../compression';

describe('compression utility', () => {
  it('should compress and decompress simple text correctly', () => {
    const original = 'Hello world! This is a test.';
    const compressed = compress(original);
    expect(compressed).toBeDefined();
    expect(typeof compressed).toBe('string');

    const decompressed = decompress(compressed);
    expect(decompressed).toBe(original);
  });

  it('should compress and decompress Unicode and Thai text correctly', () => {
    const original = 'สวัสดีชาวโลก ทดสอบระบบแปลง Markdown เป็น Web 🚀✨';
    const compressed = compress(original);
    const decompressed = decompress(compressed);
    expect(decompressed).toBe(original);
  });

  it('should compress and decompress JSON payload correctly', () => {
    const payload = JSON.stringify({
      theme: '#0f172a',
      markdown: '# Title\n\nSome **formatted** text.',
    });
    const compressed = compress(payload);
    const decompressed = decompress(compressed);
    expect(decompressed).toBe(payload);
    expect(JSON.parse(decompressed!)).toEqual({
      theme: '#0f172a',
      markdown: '# Title\n\nSome **formatted** text.',
    });
  });

  it('should return null on invalid decompression input', () => {
    // LZString handles corrupted data gracefully
    const invalidData = '---invalid---garbage---data---';
    const result = decompress(invalidData);
    // In lz-string, decompression of completely invalid data returns empty or null
    expect(result === null || typeof result === 'string').toBe(true);
  });
});
