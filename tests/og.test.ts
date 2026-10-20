import { describe, expect, it } from 'vitest';
import { checkOg, parseOgFromHtml, previewValues } from '@/lib/og';

const HTML = `<!doctype html><html><head>
<title>샘플 &amp; 페이지</title>
<meta name="description" content="기본 설명">
<meta property="og:title" content="OG 제목">
<meta property='og:description' content='OG &quot;설명&quot;'>
<meta property="og:image" content="https://example.com/a.png">
<meta property="og:url" content="https://example.com/page">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="https://example.com/canonical">
<!-- <meta property="og:title" content="주석"> -->
<script>var s = '<meta property="og:title" content="스크립트">';</script>
</head><body></body></html>`;

describe('OG 파서', () => {
  const d = parseOgFromHtml(HTML);
  it('OG 값 추출', () => {
    expect(d.title).toBe('OG 제목');
    expect(d.description).toBe('OG "설명"');
    expect(d.image).toBe('https://example.com/a.png');
    expect(d.type).toBe('website');
    expect(d.twitterCard).toBe('summary_large_image');
    expect(d.canonical).toBe('https://example.com/canonical');
  });
  it('title 엔티티 해석', () => {
    expect(d.htmlTitle).toBe('샘플 & 페이지');
  });
  it('주석·스크립트 안 태그는 무시', () => {
    expect(d.all['og:title']).toBe('OG 제목');
  });
  it('필수 속성이 모두 있으면 오류 없음', () => {
    expect(checkOg(d).filter((i) => i.level === 'error')).toHaveLength(0);
  });
  it('필수 속성 누락 감지', () => {
    const e = checkOg(parseOgFromHtml('<title>x</title>'));
    expect(e.filter((i) => i.level === 'error')).toHaveLength(4);
  });
  it('상대 경로 이미지 경고', () => {
    const r = checkOg(parseOgFromHtml('<meta property="og:image" content="/a.png">'));
    expect(r.some((i) => i.level === 'warn' && i.message.includes('절대 URL'))).toBe(true);
  });
  it('미리보기는 OG 없으면 기본 태그로 대체', () => {
    const p = previewValues(parseOgFromHtml('<title>T</title><meta name="description" content="D">'));
    expect(p.title).toBe('T');
    expect(p.description).toBe('D');
  });
  it('host 추출', () => {
    expect(previewValues(d).host).toBe('example.com');
  });
});
