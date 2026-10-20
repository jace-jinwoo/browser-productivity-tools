/** 글자수·단어수·바이트·줄 수 계산 (순수 함수) */

export interface TextStats {
  /** 공백 포함 글자 수 (유니코드 코드 포인트 기준, 줄바꿈 포함) */
  chars: number;
  /** 모든 공백 문자(스페이스·탭·줄바꿈·전각 공백 등) 제외 글자 수 */
  charsNoSpace: number;
  /** UTF-8 인코딩 바이트 수 */
  utf8Bytes: number;
  /** 줄 수 (빈 입력은 0, 마지막 줄바꿈 뒤의 빈 줄도 1줄로 계산) */
  lines: number;
  /** 내용이 있는 줄 수 */
  nonEmptyLines: number;
  /** 공백으로 구분한 단어(어절) 수 */
  words: number;
  /** 빈 줄로 구분한 문단 수 */
  paragraphs: number;
  /** 사용자 인지 글자(grapheme) 수. Intl.Segmenter 미지원 시 null */
  graphemes: number | null;
}

export function countCodePoints(text: string): number {
  let n = 0;
  for (const _ of text) n++;
  return n;
}

export function countUtf8Bytes(text: string): number {
  return new TextEncoder().encode(text).length;
}

export function countLines(text: string): number {
  if (text === '') return 0;
  return text.split(/\r\n|\r|\n/).length;
}

export function countWords(text: string): number {
  const t = text.trim();
  if (t === '') return 0;
  return t.split(/\s+/u).length;
}

export function countParagraphs(text: string): number {
  const t = text.trim();
  if (t === '') return 0;
  return t.split(/(?:\r\n|\r|\n)[^\S\r\n]*(?:\r\n|\r|\n)+/u).filter((p) => p.trim() !== '').length;
}

export function countGraphemes(text: string): number | null {
  const Seg = (Intl as unknown as { Segmenter?: new (l?: string, o?: { granularity: string }) => { segment(s: string): Iterable<unknown> } }).Segmenter;
  if (!Seg) return null;
  let n = 0;
  for (const _ of new Seg('ko', { granularity: 'grapheme' }).segment(text)) n++;
  return n;
}

export function analyzeText(text: string): TextStats {
  const lines = text === '' ? [] : text.split(/\r\n|\r|\n/);
  return {
    chars: countCodePoints(text),
    charsNoSpace: countCodePoints(text.replace(/\s/gu, '')),
    utf8Bytes: countUtf8Bytes(text),
    lines: lines.length,
    nonEmptyLines: lines.filter((l) => l.trim() !== '').length,
    words: countWords(text),
    paragraphs: countParagraphs(text),
    graphemes: countGraphemes(text),
  };
}
