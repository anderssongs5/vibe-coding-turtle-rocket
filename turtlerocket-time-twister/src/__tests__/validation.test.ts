import { validateFileType, validateFileSize, checkICSFormat } from '../utils/validation';

function makeFile(name: string, size: number, type = ''): File {
  const blob = new Blob(['x'.repeat(size)], { type });
  return new File([blob], name, { type });
}

describe('validateFileType', () => {
  it('accepts .ics extension', () => {
    expect(validateFileType(makeFile('calendar.ics', 10))).toBe(true);
  });

  it('accepts text/calendar MIME type', () => {
    expect(validateFileType(makeFile('calendar', 10, 'text/calendar'))).toBe(true);
  });

  it('rejects .txt files', () => {
    expect(validateFileType(makeFile('notes.txt', 10))).toBe(false);
  });

  it('rejects .csv files', () => {
    expect(validateFileType(makeFile('events.csv', 10))).toBe(false);
  });

  it('is case-insensitive for extension', () => {
    expect(validateFileType(makeFile('CAL.ICS', 10))).toBe(true);
  });
});

describe('validateFileSize', () => {
  it('accepts file within default 5 MB limit', () => {
    expect(validateFileSize(makeFile('cal.ics', 1024))).toBe(true);
  });

  it('accepts file exactly at limit', () => {
    const limit = 5 * 1024 * 1024;
    expect(validateFileSize(makeFile('cal.ics', limit))).toBe(true);
  });

  it('rejects file exceeding 5 MB', () => {
    const overLimit = 5 * 1024 * 1024 + 1;
    expect(validateFileSize(makeFile('cal.ics', overLimit))).toBe(false);
  });

  it('accepts custom maxBytes parameter', () => {
    expect(validateFileSize(makeFile('cal.ics', 100), 200)).toBe(true);
    expect(validateFileSize(makeFile('cal.ics', 300), 200)).toBe(false);
  });
});

describe('checkICSFormat', () => {
  it('accepts valid ICS content', () => {
    const ics = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nEND:VCALENDAR';
    expect(checkICSFormat(ics)).toBe(true);
  });

  it('rejects content missing BEGIN:VCALENDAR', () => {
    expect(checkICSFormat('VERSION:2.0\r\nEND:VCALENDAR')).toBe(false);
  });

  it('rejects content missing END:VCALENDAR', () => {
    expect(checkICSFormat('BEGIN:VCALENDAR\r\nVERSION:2.0')).toBe(false);
  });

  it('accepts content with leading whitespace', () => {
    const ics = '\n\nBEGIN:VCALENDAR\r\nEND:VCALENDAR';
    expect(checkICSFormat(ics)).toBe(true);
  });

  it('rejects empty string', () => {
    expect(checkICSFormat('')).toBe(false);
  });
});
