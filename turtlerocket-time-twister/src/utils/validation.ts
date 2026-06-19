const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export function validateFileType(file: File): boolean {
  return file.name.toLowerCase().endsWith('.ics') || file.type === 'text/calendar';
}

export function validateFileSize(file: File, maxBytes: number = MAX_FILE_SIZE): boolean {
  return file.size <= maxBytes;
}

export function checkICSFormat(content: string): boolean {
  const trimmed = content.trimStart();
  return trimmed.startsWith('BEGIN:VCALENDAR') && trimmed.includes('END:VCALENDAR');
}
