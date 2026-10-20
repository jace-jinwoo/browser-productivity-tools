/** 공백·줄바꿈 정리 (맞춤법 교정은 하지 않음) */

export interface CleanOptions {
  normalizeNewlines: boolean; // CRLF/CR → LF
  nbspToSpace: boolean; // U+00A0 → 공백
  tabsToSpace: boolean; // 탭 → 공백 1칸
  removeInvisible: boolean; // U+200B, U+2060, U+FEFF 제거
  trimLines: boolean; // 각 줄 앞뒤 공백 제거
  collapseSpaces: boolean; // 연속 공백 → 1칸
  removeBlankLines: boolean; // 모든 빈 줄 제거
  collapseBlankLines: boolean; // 연속 빈 줄 → 1줄 (removeBlankLines 가 꺼져 있을 때)
  joinLines: boolean; // 줄바꿈을 공백으로 합쳐 한 줄로
  trimAll: boolean; // 전체 앞뒤 공백·줄바꿈 제거
}

export const DEFAULT_CLEAN_OPTIONS: CleanOptions = {
  normalizeNewlines: true,
  nbspToSpace: true,
  tabsToSpace: false,
  removeInvisible: false,
  trimLines: true,
  collapseSpaces: true,
  removeBlankLines: false,
  collapseBlankLines: true,
  joinLines: false,
  trimAll: true,
};

export function cleanText(input: string, o: CleanOptions): string {
  let t = input;
  if (o.normalizeNewlines) t = t.replace(/\r\n?/g, '\n');
  if (o.removeInvisible) t = t.replace(/[​⁠﻿]/g, '');
  if (o.nbspToSpace) t = t.replace(/ /g, ' ');
  if (o.tabsToSpace) t = t.replace(/\t/g, ' ');
  if (o.collapseSpaces) t = t.replace(/[^\S\r\n]{2,}/g, ' ');
  if (o.trimLines) t = t.replace(/^[^\S\r\n]+|[^\S\r\n]+$/gm, '');
  if (o.removeBlankLines) t = t.replace(/(\r\n|\r|\n)(?:[^\S\r\n]*(?:\r\n|\r|\n))+/g, '$1').replace(/^(?:[^\S\r\n]*(?:\r\n|\r|\n))+/, '');
  else if (o.collapseBlankLines) t = t.replace(/((?:\r\n|\r|\n)[^\S\r\n]*){3,}/g, (m) => (m.includes('\r\n') ? '\r\n\r\n' : m.includes('\r') && !m.includes('\n') ? '\r\r' : '\n\n'));
  if (o.joinLines) t = t.replace(/[^\S\r\n]*(?:\r\n|\r|\n)+[^\S\r\n]*/g, ' ');
  if (o.trimAll) t = t.trim();
  return t;
}
