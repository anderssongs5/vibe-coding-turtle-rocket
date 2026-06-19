import { generateFilename } from '../utils/download';

describe('generateFilename', () => {
  it('returns a filename ending with .ics', () => {
    expect(generateFilename()).toMatch(/\.ics$/);
  });

  it('uses the provided prefix', () => {
    expect(generateFilename('my-cal')).toMatch(/^my-cal-/);
  });

  it('includes a date portion (8 digits YYYYMMDD)', () => {
    expect(generateFilename()).toMatch(/\d{8}/);
  });

  it('uses default prefix when none provided', () => {
    expect(generateFilename()).toMatch(/^optimized-calendar-/);
  });
});
