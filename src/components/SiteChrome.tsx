import Link from 'next/link';
import { SITE_NAME } from '@/lib/site';
import { TOOLS } from '@/data/tools';

export function SiteHeader() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="text-lg font-bold text-brand-700">
          {SITE_NAME}
        </Link>
        <nav aria-label="주요 메뉴">
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <li><Link href="/" className="text-gray-700 hover:text-brand-700">홈</Link></li>
            <li><Link href="/character-counter/" className="text-gray-700 hover:text-brand-700">글자수</Link></li>
            <li><Link href="/image-to-webp/" className="text-gray-700 hover:text-brand-700">WebP</Link></li>
            <li><Link href="/json-formatter/" className="text-gray-700 hover:text-brand-700">JSON</Link></li>
            <li><Link href="/guide/" className="text-gray-700 hover:text-brand-700">이용 안내</Link></li>
            <li><Link href="/about/" className="text-gray-700 hover:text-brand-700">서비스 소개</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-gray-600">
        <nav aria-label="전체 도구">
          <ul className="flex flex-wrap gap-x-4 gap-y-1">
            {TOOLS.map((t) => (
              <li key={t.slug}>
                <Link href={`/${t.slug}/`} className="hover:text-brand-700">{t.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="사이트 정보" className="mt-4">
          <ul className="flex flex-wrap gap-x-4 gap-y-1">
            <li><Link href="/about/" className="hover:text-brand-700">서비스 소개</Link></li>
            <li><Link href="/guide/" className="hover:text-brand-700">이용 안내</Link></li>
            <li><Link href="/privacy/" className="hover:text-brand-700">개인정보처리방침</Link></li>
            <li><Link href="/terms/" className="hover:text-brand-700">이용약관</Link></li>
            <li><Link href="/contact/" className="hover:text-brand-700">문의</Link></li>
          </ul>
        </nav>
        <p className="mt-4 text-xs text-gray-500">
          © {SITE_NAME}. 처리 결과는 참고용이며 제출·계약·법률과 관련된 판단은 최종 결과물을 직접 확인한 뒤 하세요. 파일과 텍스트는 서버로 전송되지 않습니다.
        </p>
      </div>
    </footer>
  );
}
