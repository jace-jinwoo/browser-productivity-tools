'use client';

import { useEffect, useId, useState } from 'react';
import { ImageDropzone, Spinner, useResultUrl, useSourceImage } from './ImageParts';
import { formatBytes, outputFileName, qualityToUnit } from '@/lib/image';
import { detectWebpEncoding, renderToBlob } from '@/lib/imageBrowser';

export default function ImageToWebpTool() {
  const uid = useId();
  const { source, loading, error: loadError, select, clear } = useSourceImage();
  const [quality, setQuality] = useState(80);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useResultUrl();
  const [webpOk, setWebpOk] = useState<boolean | null>(null);

  useEffect(() => {
    let alive = true;
    detectWebpEncoding().then((ok) => alive && setWebpOk(ok));
    return () => {
      alive = false;
    };
  }, []);

  // 새 파일을 고르면 이전 결과 제거
  useEffect(() => {
    setResult(null);
    setError(null);
  }, [source, setResult]);

  const convert = async () => {
    if (!source) return;
    setError(null);
    setConverting(true);
    setResult(null);
    // 로딩 표시가 그려질 수 있도록 한 프레임 양보
    await new Promise((r) => setTimeout(r, 30));
    const r = await renderToBlob(source.img, source.width, source.height, 'image/webp', qualityToUnit(quality));
    setConverting(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    setResult(r.blob, source.width, source.height);
  };

  const busy = loading || converting;
  const shownError = loadError ?? error;
  const dlName = source ? outputFileName(source.file.name, 'webp') : 'image.webp';

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      {webpOk === false && (
        <p role="alert" className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          이 브라우저는 canvas WebP 인코딩을 지원하지 않는 것으로 확인되었습니다. 변환이 실패할 수 있으니 다른 최신 브라우저를 사용해 주세요.
        </p>
      )}
      <ImageDropzone inputId={`${uid}-file`} onFile={select} disabled={busy} />

      {loading && <div className="mt-3"><Spinner label="이미지를 불러오는 중…" /></div>}
      <p role="alert" className="mt-3 min-h-[1.25rem] text-sm text-red-600">{shownError}</p>

      {source && (
        <div className="mt-2 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={source.url} alt="원본 이미지 미리보기" className="max-h-64 w-full rounded-md border border-gray-200 bg-gray-50 object-contain" />
              <figcaption className="mt-1 text-xs text-gray-600">
                원본: {source.file.name} · {source.width}×{source.height}px · {formatBytes(source.file.size)}
              </figcaption>
            </figure>
            {result && (
              <figure>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={result.url} alt="WebP 변환 결과 미리보기" className="max-h-64 w-full rounded-md border border-gray-200 bg-gray-50 object-contain" />
                <figcaption className="mt-1 text-xs text-gray-600">
                  결과: {dlName} · {result.width}×{result.height}px · {formatBytes(result.blob.size)}
                  {result.blob.size >= source.file.size ? ' (원본보다 작아지지 않았습니다)' : ` (원본 대비 ${Math.round((1 - result.blob.size / source.file.size) * 100)}% 감소)`}
                </figcaption>
              </figure>
            )}
          </div>

          <div>
            <label htmlFor={`${uid}-q`} className="block text-sm font-medium text-gray-700">
              품질: {quality}
            </label>
            <input
              id={`${uid}-q`}
              type="range"
              min={1}
              max={100}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full max-w-sm accent-brand-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={convert}
              disabled={busy || webpOk === false}
              className="rounded-md bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              WebP로 변환
            </button>
            {result && (
              <a href={result.url} download={dlName} className="rounded-md border border-brand-600 px-4 py-2 font-medium text-brand-700 hover:bg-brand-50">
                다운로드 ({formatBytes(result.blob.size)})
              </a>
            )}
            <button type="button" onClick={clear} disabled={busy} className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50">
              초기화
            </button>
          </div>
          {converting && <Spinner label="변환 중… 큰 이미지는 시간이 걸릴 수 있습니다." />}
        </div>
      )}
    </div>
  );
}
