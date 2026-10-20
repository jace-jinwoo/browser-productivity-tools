import { describe, expect, it } from 'vitest';
import { analyzeText, countLines, countParagraphs, countUtf8Bytes, countWords } from '@/lib/text';
import { cleanText, DEFAULT_CLEAN_OPTIONS, type CleanOptions } from '@/lib/textClean';

describe('글자수', () => {
  it('빈 입력', () => {
    const s = analyzeText('');
    expect(s.chars).toBe(0);
    expect(s.lines).toBe(0);
    expect(s.words).toBe(0);
    expect(s.utf8Bytes).toBe(0);
  });
  it('공백 포함/제외', () => {
    const s = analyzeText('안녕 하세요\n반갑습니다');
    expect(s.chars).toBe(12);
    expect(s.charsNoSpace).toBe(10);
  });
  it('UTF-8 바이트: ASCII 1, 한글 3, 이모지 4', () => {
    expect(countUtf8Bytes('a')).toBe(1);
    expect(countUtf8Bytes('가')).toBe(3);
    expect(countUtf8Bytes('😀')).toBe(4);
  });
  it('이모지는 코드 포인트 1개로 계산', () => {
    expect(analyzeText('😀').chars).toBe(1);
  });
  it('전각 공백·탭은 공백 제외 계산에서 빠짐', () => {
    expect(analyzeText('a　b\tc').charsNoSpace).toBe(3);
  });
  it('줄 수: CRLF/CR/LF 와 마지막 빈 줄', () => {
    expect(countLines('a\r\nb\rc\nd')).toBe(4);
    expect(countLines('a\n')).toBe(2);
    expect(analyzeText('a\n\nb').nonEmptyLines).toBe(2);
  });
  it('단어 수는 공백 기준', () => {
    expect(countWords('  hello   world \n 안녕 ')).toBe(3);
  });
  it('문단 수', () => {
    expect(countParagraphs('a\nb\n\nc\n \n\nd')).toBe(3);
  });
});

describe('텍스트 정리', () => {
  const off: CleanOptions = Object.fromEntries(Object.keys(DEFAULT_CLEAN_OPTIONS).map((k) => [k, false])) as unknown as CleanOptions;
  it('연속 공백 → 1칸', () => {
    expect(cleanText('a   b\t\tc', { ...off, collapseSpaces: true })).toBe('a b c');
  });
  it('줄 앞뒤 공백 제거', () => {
    expect(cleanText('  a  \n b ', { ...off, trimLines: true })).toBe('a\nb');
  });
  it('연속 빈 줄 → 1줄', () => {
    expect(cleanText('a\n\n\n\nb', { ...off, collapseBlankLines: true })).toBe('a\n\nb');
  });
  it('모든 빈 줄 제거', () => {
    expect(cleanText('a\n\n \nb\n\nc', { ...off, removeBlankLines: true })).toBe('a\nb\nc');
  });
  it('줄바꿈 통일', () => {
    expect(cleanText('a\r\nb\rc', { ...off, normalizeNewlines: true })).toBe('a\nb\nc');
  });
  it('한 줄로 합치기', () => {
    expect(cleanText('a\nb\n\nc', { ...off, joinLines: true })).toBe('a b c');
  });
  it('투명 문자·NBSP 처리', () => {
    expect(cleanText('a​b c', { ...off, removeInvisible: true, nbspToSpace: true })).toBe('ab c');
  });
  it('기본 옵션은 내용 글자를 바꾸지 않음', () => {
    expect(cleanText('  안녕   하세요  \r\n\r\n\r\n\r\n반갑습니다 ', DEFAULT_CLEAN_OPTIONS)).toBe('안녕 하세요\n\n반갑습니다');
  });
});
