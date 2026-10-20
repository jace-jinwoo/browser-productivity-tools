'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import { ImageDropzone, Spinner, useResultUrl, useSourceImage } from './ImageParts';
import { computeResize, extForMime, formatBytes, outputFileName, qualityToUnit, validateDimensions, type ResizeMode } from '@/lib/image';
import { detectWebpEncoding, renderToBlob } from '@/lib/imageBrowser';

type OutMime = 'image/jpeg' | 'image/png' | 'image/webp';

const MODES: { id: ResizeMode; label: string }[] = [
  { id: 'width', label: '가로 기준 (비율 유지)' },
  { id: 'height', label: '세로 기준 (비율 유지)' },
  { id: 'percent', label: '비율(%)' },
  { id: 'fit', label: '상자 안에 맞춤 (비율 유지)' },
  { id: 'exact', label: '정확한 크기' },
];

function num(v: string): number | undefined {
  if (v.trim() === '') return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}

export default function ImageResizerTool() {
  const uid = useId();
  const { source, loading, error: loadError, select, clear } = useSourceImage();
  const [mode, setMode] = useState<ResizeMode>('width');
  const [w, setW] = useState('');
  const [h, setH] = useState('');
  const [pct, setPct] = useState('50');
  const [keepRatio, setKeepRatio] = useState(true);
  const [upscale, setUpscale] = useState(false);
  const [mime, setMime] = useState<OutMime>('image/jpeg');
  const [quality, setQuality] = useState(85);
  const [busy, setBusy] = useState(false);
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

  useEffect(() => {
    setResult(null);
    setError(null);
    if (source) {
      setW(String(source.width));
      setH(String(source.height));
    }
  }, [source, setResult]);

  const target = useMemo(() => {
    if (!source) return null;
    const r = computeResize({
      srcW: source.width,
      srcH: source.height,
      mode,
      width: num(w),
      height: num(h),
      percent: num(pct),
      keepRatio,
      allowUpscale: upscale,
    });
    if (!r.ok) return r;
    const d = validateDimensions(r.width, r.height, 'output');
    return d.ok ? r : d;
  }, [source, mode, w, h, pct, keepRatio, upscale]);

  const run = async () => {
    if (!source || !target || !target.ok) return;
    setError(null);
    setBusy(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 30));
    const r = await renderToBlob(source.img, target.width, target.height, mime, qualityToUnit(quality));
    setBusy(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    setResult(r.blob, target.width, target.height);
  };

  const needW = mode === 'width' || mode === 'fit' || mode === 'exact';
  const needH = mode === 'height' || mode === 'fit' || mode === 'exact';
  const shownError = loadError ?? error;
  const dlName = source ? outputFileName(source.file.name, extForMime(mime), '-resized') : 'image.jpg';
  const inputCls = 'w-32 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <ImageDropzone inputId={`${uid}-file`} onFile={select} disabled={busy || loading} />
      {loading && <div className="mt-3"><Spinner label="이미지를 불러오는 중…" /></div>}
      <p role="alert" className="mt-3 min-h-[1.25rem] text-sm text-red-600">{shownError}</p>

      {source && (
        <div className="mt-2 space-y-4">
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={source.url} alt="원본 이미지 미리보기" className="max-h-56 rounded-md border border-gray-200 bg-gray-50 object-contain" />
            <figcaption className="mt-1 text-xs text-gray-600">
              원본: {source.file.name} · {source.width}×{source.height}px · {formatBytes(source.file.size)}
            </figcaption>
          </figure>

          <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
            <div>
              <label htmlFor={`${uid}-mode`} className="mb-1 block text-sm font-medium text-gray-700">크기 지정 방식</label>
              <select id={`${uid}-mode`} value={mode} onChange={(e) => setMode(e.target.value as ResizeMode)} className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm">
                {MODES.map((m) => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </div>
            {needW && (
              <div>
                <label htmlFor={`${uid}-w`} className="mb-1 block text-sm font-medium text-gray-700">가로(px)</label>
                <input id={`${uid}-w`} type="number" inputMode="numeric" min={1} value={w} onChange={(e) => setW(e.target.value)} className={inputCls} />
              </div>
            )}
            {needH && (
              <div>
                <label htmlFor={`${uid}-h`} className="mb-1 block text-sm font-medium text-gray-700">세로(px)</label>
                <input id={`${uid}-h`} type="number" inputMode="numeric" min={1} value={h} onChange={(e) => setH(e.target.value)} className={inputCls} />
              </div>
            )}
            {mode === 'percent' && (
              <div>
                <label htmlFor={`${uid}-p`} className="mb-1 block text-sm font-medium text-gray-700">비율(%)</label>
                <input id={`${uid}-p`} type="number" inputMode="decimal" min={1} value={pct} onChange={(e) => setPct(e.target.value)} className={inputCls} />
              </div>
            )}
            {mode === 'exact' && (
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={keepRatio} onChange={(e) => setKeepRatio(e.target.checked)} className="h-4 w-4 accent-brand-600" />
                비율 유지 (상자 안에 맞춤)
              </label>
            )}
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={upscale} onChange={(e) => setUpscale(e.target.checked)} className="h-4 w-4 accent-brand-600" />
              확대 허용 (화질 저하)
            </label>
          </div>

          <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
            <div>
              <label htmlFor={`${uid}-fmt`} className="mb-1 block text-sm font-medium text-gray-700">저장 형식</label>
              <select id={`${uid}-fmt`} value={mime} onChange={(e) => setMime(e.target.value as OutMime)} className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm">
                <option value="image/jpeg">JPEG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp" disabled={webpOk === false}>WebP{webpOk === false ? ' (이 브라우저 미지원)' : ''}</option>
              </select>
            </div>
            {mime !== 'image/png' && (
              <div>
                <label htmlFor={`${uid}-q`} className="block text-sm font-medium text-gray-700">품질: {quality}</label>
                <input id={`${uid}-q`} type="range" min={1} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-48 accent-brand-600" />
              </div>
            )}
          </div>

          <p className="min-h-[1.25rem] text-sm" aria-live="polite">
            {target && target.ok ? (
              <span className="text-gray-700">결과 크기: <strong>{target.width}×{target.height}px</strong></span>
            ) : target ? (
              <span className="text-red-600">{target.error}</span>
            ) : null}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={run}
              disabled={busy || !target || !target.ok}
              className="rounded-md bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              리사이즈
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
          {busy && <Spinner label="처리 중…" />}

          {result && (
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.url} alt="리사이즈 결과 미리보기" className="max-h-56 rounded-md border border-gray-200 bg-gray-50 object-contain" />
              <figcaption className="mt-1 text-xs text-gray-600">
                결과: {dlName} · {result.width}×{result.height}px · {formatBytes(result.blob.size)}
              </figcaption>
            </figure>
          )}
        </div>
      )}
    </div>
  );
}
