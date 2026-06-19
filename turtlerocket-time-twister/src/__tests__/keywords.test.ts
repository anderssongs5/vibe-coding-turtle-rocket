import { HEAVY_KEYWORDS, LIGHT_KEYWORDS } from '../config/keywords';

describe('keyword lists', () => {
  it('HEAVY_KEYWORDS is non-empty', () => {
    expect(HEAVY_KEYWORDS.length).toBeGreaterThan(0);
  });

  it('LIGHT_KEYWORDS is non-empty', () => {
    expect(LIGHT_KEYWORDS.length).toBeGreaterThan(0);
  });

  it('all heavy keywords are lowercase', () => {
    HEAVY_KEYWORDS.forEach((kw) => expect(kw).toBe(kw.toLowerCase()));
  });

  it('all light keywords are lowercase', () => {
    LIGHT_KEYWORDS.forEach((kw) => expect(kw).toBe(kw.toLowerCase()));
  });

  it('no keyword appears in both lists', () => {
    const heavySet = new Set(HEAVY_KEYWORDS);
    LIGHT_KEYWORDS.forEach((kw) => expect(heavySet.has(kw)).toBe(false));
  });

  it('no duplicate entries within HEAVY_KEYWORDS', () => {
    const unique = new Set(HEAVY_KEYWORDS);
    expect(unique.size).toBe(HEAVY_KEYWORDS.length);
  });

  it('no duplicate entries within LIGHT_KEYWORDS', () => {
    const unique = new Set(LIGHT_KEYWORDS);
    expect(unique.size).toBe(LIGHT_KEYWORDS.length);
  });

  it('contains expected heavy keywords', () => {
    expect(HEAVY_KEYWORDS).toContain('meeting');
    expect(HEAVY_KEYWORDS).toContain('review');
    expect(HEAVY_KEYWORDS).toContain('planning');
    expect(HEAVY_KEYWORDS).toContain('analysis');
  });

  it('contains expected light keywords', () => {
    expect(LIGHT_KEYWORDS).toContain('lunch');
    expect(LIGHT_KEYWORDS).toContain('break');
    expect(LIGHT_KEYWORDS).toContain('optional');
    expect(LIGHT_KEYWORDS).toContain('gym');
  });
});
