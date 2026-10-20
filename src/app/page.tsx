import type { Metadata } from 'next';
import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import HomeSearch, { type SearchItem } from '@/components/HomeSearch';
import JsonLd from '@/components/JsonLd';
import { CATEGORY_LABELS, TOOLS, type ToolCategory } from '@/data/tools';
import { GUIDES } from '@/data/guides';
import { absoluteUrl, SITE_NAME, SITE_TAGLINE } from '@/lib/site';

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} - 글자수 세기·WebP 변환·이미지 리사이즈·JSON·OG 미리보기` },
  description:
    '글자수·단어수 세기, 이미지 WebP 변환, 이미지 리사이즈, JSON 포맷터, OG 태그 미리보기를 한곳에서. 가입 없이 무료이며 텍스트와 파일은 서버로 전송되지 않습니다.',
  alternates: { canonical: '/' },
  openGraph: { url: '/', title: SITE_NAME, description: SITE_TAGLINE },
};

const items: SearchItem[] = TOOLS.map((t) => ({
  slug: t.slug,
  name: t.name,
  shortDescription: t.shortDescription,
  category: t.category,
  categoryLabel: CATEGORY_LABELS[t.category],
  keywords: t.keywords,
}));

const categories = (Object.keys(CATEGORY_LABELS) as ToolCategory[]).map((id) => ({ id, label: CATEGORY_LABELS[id] }));

export default function HomePage() {
  const popular = TOOLS.filter((t) => t.popular);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_NAME,
          url: absoluteUrl('/'),
          inLanguage: 'ko-KR',
        }}
      />
      <section className="rounded-2xl bg-brand-50 px-6 py-10 sm:px-10">
        <h1 className="text-3xl font-bold text-brand-900 sm:text-4xl">{SITE_NAME}</h1>
        <p className="mt-3 max-w-2xl text-gray-700">
          글자수 세기부터 이미지 WebP 변환·리사이즈, JSON 정리, OG 태그 점검까지. 가입 없이 무료로 쓰고, 입력한 텍스트와 이미지는 서버로 전송되지 않고 브라우저에서만 처리됩니다.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/character-counter/" className="rounded-md bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700">
            글자수 세기
          </Link>
          <Link href="/guide/" className="rounded-md border border-brand-600 px-4 py-2 font-medium text-brand-700 hover:bg-white">
            이용 안내
          </Link>
        </div>
      </section>

      <div className="mt-10">
        <HomeSearch items={items} categories={categories} />
      </div>

      <section aria-labelledby="popular-h" className="mt-12">
        <h2 id="popular-h" className="text-xl font-semibold text-gray-900">인기 도구</h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-3">
          {popular.map((t) => (
            <li key={t.slug}>
              <Link href={`/${t.slug}/`} className="block h-full rounded-lg border border-brand-100 bg-white p-4 hover:border-brand-600 hover:bg-brand-50">
                <span className="font-semibold text-gray-900">{t.name}</span>
                <span className="mt-1 block text-sm text-gray-600">{t.shortDescription}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <AdSlot placement="home" />

      <section aria-labelledby="guide-h" className="mt-12">
        <h2 id="guide-h" className="text-xl font-semibold text-gray-900">최신 안내 콘텐츠</h2>
        <ul className="mt-3 space-y-3">
          {GUIDES.map((g) => (
            <li key={g.id} className="rounded-lg border border-gray-200 p-4">
              <Link href={`/guide/#${g.id}`} className="font-semibold text-brand-700 hover:underline">
                {g.title}
              </Link>
              <p className="mt-1 text-sm text-gray-600">{g.summary}</p>
              <p className="mt-1 text-xs text-gray-400">{g.date}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
