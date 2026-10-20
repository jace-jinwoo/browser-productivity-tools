'use client';

import { useDeferredValue, useId, useMemo, useState } from 'react';
import { checkOg, MAX_HTML_CHARS, parseOgFromHtml, previewValues } from '@/lib/og';

const SAMPLE = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <title>예제 페이지 | 샘플 사이트</title>
  <meta name="description" content="일반 메타 설명입니다.">
  <meta property="og:type" content="website">
  <meta property="og:title" content="예제 페이지 제목">
  <meta property="og:description" content="공유 카드에 표시될 설명입니다.">
  <meta property="og:url" content="https://example.com/page/">
  <meta property="og:image" content="https://example.com/og.png">
  <meta property="og:site_name" content="샘플 사이트">
  <meta name="twitter:card" content="summary_large_image">
</head>
<body></body>
</html>`;

const LEVEL_STYLE = {
  error: 'border-red-300 bg-red-50 text-red-800',
  warn: 'border-amber-300 bg-amber-50 text-amber-900',
  info: 'border-gray-200 bg-gray-50 text-gray-700',
} as const;
const LEVEL_LABEL = { error: '오류', warn: '주의', info: '참고' } as const;

export default function OgPreviewTool() {
  const uid = useId();
  const [html, setHtml] = useState('');
  const [imgFailed, setImgFailed] = useState<string | null>(null);
  const deferred = useDeferredValue(html);
  const pending = deferred !== html;
  const tooLong = deferred.length > MAX_HTML_CHARS;

  const data = useMemo(() => (deferred.trim() === '' || tooLong ? null : parseOgFromHtml(deferred)), [deferred, tooLong]);
  const issues = useMemo(() => (data ? checkOg(data) : []), [data]);
  const pv = useMemo(() => (data ? previewValues(data) : null), [data]);
  const imageOk = pv && /^https?:\/\//i.test(pv.image) ? pv.image : '';
  const entries = data ? Object.entries(data.all) : [];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <p className="mb-3 rounded-md border border-brand-100 bg-brand-50 p-3 text-sm text-gray-700">
        브라우저는 보안 정책(CORS) 때문에 다른 사이트의 HTML을 직접 가져오지 못하는 경우가 많아, URL 대신 <strong>페이지 소스(HTML)를 붙여 넣는 방식</strong>으로 분석합니다.
        브라우저에서 &quot;페이지 소스 보기&quot;로 복사해 붙여 넣으세요.
      </p>
      <label htmlFor={`${uid}-in`} className="mb-1 block text-sm font-medium text-gray-700">HTML 입력</label>
      <textarea
        id={`${uid}-in`}
        value={html}
        onChange={(e) => setHtml(e.target.value)}
        rows={10}
        spellCheck={false}
        className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-200"
      />
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setHtml(SAMPLE)} className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">예제 불러오기</button>
        <button type="button" onClick={() => setHtml('')} className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">지우기</button>
        <span className="text-sm text-gray-500" aria-live="polite">{pending ? '분석 중…' : ''}</span>
      </div>
      {tooLong && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          입력이 너무 깁니다({deferred.length.toLocaleString('ko-KR')}자). {MAX_HTML_CHARS.toLocaleString('ko-KR')}자 이하로 줄이거나 &lt;head&gt; 부분만 붙여 넣어 주세요.
        </p>
      )}

      {data && pv && (
        <div className="mt-6 space-y-6">
          <section aria-labelledby={`${uid}-card`}>
            <h3 id={`${uid}-card`} className="text-base font-semibold text-gray-900">공유 카드 미리보기 (참고용)</h3>
            <div className="mt-2 max-w-md overflow-hidden rounded-lg border border-gray-300 bg-white">
              {imageOk && imgFailed !== imageOk ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageOk} alt="og:image 미리보기" onError={() => setImgFailed(imageOk)} className="aspect-[1.91/1] w-full bg-gray-100 object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="flex aspect-[1.91/1] w-full items-center justify-center bg-gray-100 px-4 text-center text-sm text-gray-500">
                  {pv.image === '' ? '이미지 없음 (og:image 미지정)' : imgFailed === imageOk ? '이미지를 불러오지 못했습니다 (주소·접근 제한 확인)' : '이미지를 표시하지 않음 (절대 URL이 아님)'}
                </div>
              )}
              <div className="border-t border-gray-200 p-3">
                {pv.host && <p className="text-xs uppercase text-gray-500">{pv.host}</p>}
                <p className="mt-0.5 line-clamp-2 font-semibold text-gray-900">{pv.title || '(제목 없음)'}</p>
                <p className="mt-0.5 line-clamp-2 text-sm text-gray-600">{pv.description || '(설명 없음)'}</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">실제 카카오톡·페이스북·X 등의 표시는 서비스마다 다릅니다. 이 카드는 일반적인 형태의 예시입니다.</p>
          </section>

          <section aria-labelledby={`${uid}-chk`}>
            <h3 id={`${uid}-chk`} className="text-base font-semibold text-gray-900">점검 결과</h3>
            {issues.length === 0 ? (
              <p className="mt-2 text-sm text-green-700">Open Graph 필수 속성(og:title, og:type, og:image, og:url)이 모두 있습니다.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {issues.map((i) => (
                  <li key={i.message} className={`rounded-md border p-2 text-sm ${LEVEL_STYLE[i.level]}`}>
                    <span className="mr-2 font-semibold">[{LEVEL_LABEL[i.level]}]</span>{i.message}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-labelledby={`${uid}-tags`}>
            <h3 id={`${uid}-tags`} className="text-base font-semibold text-gray-900">추출된 태그</h3>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full min-w-[28rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-600"><th className="py-1 pr-3 font-medium">태그</th><th className="py-1 font-medium">값</th></tr>
                </thead>
                <tbody>
                  {data.htmlTitle !== undefined && (
                    <tr className="border-b border-gray-100"><td className="py-1 pr-3 font-mono">&lt;title&gt;</td><td className="py-1 break-all">{data.htmlTitle}</td></tr>
                  )}
                  {data.canonical && (
                    <tr className="border-b border-gray-100"><td className="py-1 pr-3 font-mono">canonical</td><td className="py-1 break-all">{data.canonical}</td></tr>
                  )}
                  {entries.map(([k, v]) => (
                    <tr key={k} className="border-b border-gray-100"><td className="py-1 pr-3 font-mono">{k}</td><td className="py-1 break-all">{v}</td></tr>
                  ))}
                </tbody>
              </table>
              {entries.length === 0 && data.htmlTitle === undefined && <p className="mt-2 text-sm text-gray-500">추출된 태그가 없습니다. &lt;meta&gt; 태그가 포함된 HTML인지 확인하세요.</p>}
            </div>
          </section>
        </div>
      )}
      <p className="mt-4 text-xs text-gray-500">붙여 넣은 HTML은 서버로 전송되지 않고 실행되지 않으며, 브라우저 안에서 문자열로만 분석합니다. 이미지 미리보기는 입력한 og:image 주소로 브라우저가 직접 이미지를 요청합니다.</p>
    </div>
  );
}
