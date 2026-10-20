/** HTML 문자열에서 OG/Twitter/기본 메타 태그를 추출합니다. (브라우저·Node 모두 동작하는 순수 함수) */

export const MAX_HTML_CHARS = 2_000_000;

export interface OgData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  siteName?: string;
  type?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  htmlTitle?: string;
  metaDescription?: string;
  canonical?: string;
  /** property/name → content (og:, twitter:, description 첫 값) */
  all: Record<string, string>;
}

export interface OgIssue {
  level: 'error' | 'warn' | 'info';
  message: string;
}

function safeCp(n: number): string {
  try {
    return String.fromCodePoint(n);
  } catch {
    return '';
  }
}

function decodeEntities(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h: string) => safeCp(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d: string) => safeCp(parseInt(d, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function parseAttrs(tag: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const re = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  const body = tag.replace(/^<\s*[a-zA-Z0-9]+/, '').replace(/\/?>$/, '');
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) {
    const name = m[1].toLowerCase();
    if (!(name in attrs)) attrs[name] = decodeEntities(m[2] ?? m[3] ?? m[4] ?? '');
  }
  return attrs;
}

export function parseOgFromHtml(html: string): OgData {
  // 주석·스크립트·스타일은 무시
  const clean = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style)\b[\s\S]*?<\/\1\s*>/gi, '');
  const all: Record<string, string> = {};
  for (const m of clean.matchAll(/<meta\b[^>]*>/gi)) {
    const a = parseAttrs(m[0]);
    const key = (a.property ?? a.name ?? '').trim().toLowerCase();
    if (key && a.content !== undefined && !(key in all)) all[key] = a.content.trim();
  }
  let canonical: string | undefined;
  for (const m of clean.matchAll(/<link\b[^>]*>/gi)) {
    const a = parseAttrs(m[0]);
    if (a.rel && a.rel.toLowerCase().split(/\s+/).includes('canonical') && a.href) {
      canonical = a.href.trim();
      break;
    }
  }
  const t = /<title\b[^>]*>([\s\S]*?)<\/title\s*>/i.exec(clean)?.[1];
  return {
    title: all['og:title'],
    description: all['og:description'],
    image: all['og:image'] ?? all['og:image:url'],
    url: all['og:url'],
    siteName: all['og:site_name'],
    type: all['og:type'],
    twitterCard: all['twitter:card'],
    twitterTitle: all['twitter:title'],
    twitterDescription: all['twitter:description'],
    twitterImage: all['twitter:image'],
    htmlTitle: t !== undefined ? decodeEntities(t).replace(/\s+/g, ' ').trim() : undefined,
    metaDescription: all['description'],
    canonical,
    all: Object.fromEntries(Object.entries(all).filter(([k]) => k.startsWith('og:') || k.startsWith('twitter:') || k === 'description')),
  };
}

/** Open Graph 프로토콜의 필수 속성(og:title, og:type, og:image, og:url) 점검 */
export function checkOg(d: OgData): OgIssue[] {
  const issues: OgIssue[] = [];
  const req: [keyof OgData, string][] = [
    ['title', 'og:title'],
    ['type', 'og:type'],
    ['image', 'og:image'],
    ['url', 'og:url'],
  ];
  for (const [k, label] of req) {
    if (!d[k]) issues.push({ level: 'error', message: `${label} 이(가) 없습니다. (Open Graph 프로토콜 필수 속성)` });
  }
  if (!d.description) issues.push({ level: 'warn', message: 'og:description 이(가) 없습니다. 공유 카드에 설명이 표시되지 않을 수 있습니다.' });
  if (d.image && !/^https?:\/\//i.test(d.image)) {
    issues.push({ level: 'warn', message: 'og:image 가 절대 URL(https://…)이 아닙니다. 상대 경로는 크롤러가 해석하지 못할 수 있고, 아래 미리보기에서도 이미지를 불러오지 않습니다.' });
  }
  if (d.image && /^http:\/\//i.test(d.image)) {
    issues.push({ level: 'info', message: 'og:image 가 http:// 입니다. https 사용을 권장합니다.' });
  }
  if (!d.twitterCard) issues.push({ level: 'info', message: 'twitter:card 가 없습니다. 서비스별로 Open Graph 값으로 대체하는 방식이 다를 수 있습니다.' });
  return issues;
}

/** 미리보기에 쓸 값 (OG 우선, 없으면 트위터/HTML 기본 태그로 대체) */
export function previewValues(d: OgData): { title: string; description: string; image: string; host: string } {
  const title = d.title || d.twitterTitle || d.htmlTitle || '';
  const description = d.description || d.twitterDescription || d.metaDescription || '';
  const image = d.image || d.twitterImage || '';
  let host = '';
  const u = d.url || d.canonical;
  if (u) {
    try {
      host = new URL(u).host;
    } catch {
      host = '';
    }
  }
  return { title, description, image, host };
}
