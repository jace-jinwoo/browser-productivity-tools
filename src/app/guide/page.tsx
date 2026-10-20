import type { Metadata } from 'next';
import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import { GUIDES } from '@/data/guides';
import { SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: '이용 안내',
  description: `${SITE_NAME} 사용 방법과 글자수·이미지 변환·OG 미리보기 사용 시 주의사항, 파일·텍스트의 개인정보 처리 방식을 안내합니다.`,
  alternates: { canonical: '/guide/' },
  openGraph: { url: '/guide/', title: `이용 안내 | ${SITE_NAME}` },
};

export default function GuidePage() {
  return (
    <article className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">이용 안내</h1>

      <section aria-labelledby="howto-h">
        <h2 id="howto-h" className="text-xl font-semibold">기본 사용 방법</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-gray-700">
          <li>홈 화면의 검색창이나 카테고리에서 필요한 도구를 선택합니다.</li>
          <li>텍스트를 입력하면 결과가 실시간으로 표시되고, 이미지 도구는 파일을 선택한 뒤 변환 버튼을 누르면 결과와 다운로드 버튼이 나타납니다.</li>
          <li>복사 버튼으로 텍스트 결과를 복사하거나 다운로드 버튼으로 이미지를 저장합니다.</li>
          <li>각 도구 페이지 하단의 상세 설명, FAQ, 참고 출처를 함께 확인하세요.</li>
        </ol>
      </section>

      <section aria-labelledby="notes-h">
        <h2 id="notes-h" className="text-xl font-semibold">결과 해석 시 주의사항</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-gray-700">
          <li>글자수·바이트는 제출처의 계산 방식(공백·줄바꿈 처리)과 다를 수 있으니 최종 제출 화면에서도 확인하세요.</li>
          <li>이미지는 파일 크기·해상도 한도를 넘거나 브라우저가 지원하지 않는 형식이면 처리되지 않습니다. 결과 용량과 화질은 다운로드 전에 미리보기로 확인하세요.</li>
          <li>중요한 제출·계약·법률 관련 판단에는 최종 결과물을 직접 확인하고 공식 문서를 우선하세요.</li>
        </ul>
      </section>

      <AdSlot placement="content" />

      <section aria-labelledby="articles-h">
        <h2 id="articles-h" className="text-xl font-semibold">안내 콘텐츠</h2>
        <div className="mt-4 space-y-8">
          {GUIDES.map((g) => (
            <section key={g.id} id={g.id} aria-labelledby={`${g.id}-h`} className="scroll-mt-4">
              <h3 id={`${g.id}-h`} className="text-lg font-semibold text-gray-900">{g.title}</h3>
              <p className="text-xs text-gray-400">{g.date}</p>
              <div className="mt-2 space-y-3 text-gray-700">
                {g.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <p className="mt-2 text-sm">
                <Link href={`/${g.toolSlug}/`} className="text-brand-700 underline">관련 도구로 이동</Link>
              </p>
            </section>
          ))}
        </div>
      </section>
    </article>
  );
}
