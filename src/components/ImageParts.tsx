'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { loadImageFromFile, type LoadedImage } from '@/lib/imageBrowser';
import { ACCEPT_ATTR, formatBytes, IMAGE_LIMITS, validateDimensions, validateImageFile } from '@/lib/image';

export interface SourceImage extends LoadedImage {
  file: File;
}

/** 이미지 선택·검증·로딩 상태를 관리합니다. object URL 은 교체/언마운트 시 해제합니다. */
export function useSourceImage() {
  const [source, setSource] = useState<SourceImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const urlRef = useRef<string | null>(null);
  const seq = useRef(0);

  useEffect(() => () => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
  }, []);

  const clear = useCallback(() => {
    seq.current++;
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    setSource(null);
    setError(null);
    setLoading(false);
  }, []);

  const select = useCallback(async (file: File | null | undefined) => {
    if (!file) return;
    const my = ++seq.current;
    setError(null);
    const v = validateImageFile(file);
    if (!v.ok) {
      setError(v.error);
      return;
    }
    setLoading(true);
    try {
      const loaded = await loadImageFromFile(file);
      if (my !== seq.current) {
        URL.revokeObjectURL(loaded.url);
        return;
      }
      const d = validateDimensions(loaded.width, loaded.height, 'input');
      if (!d.ok) {
        URL.revokeObjectURL(loaded.url);
        setError(d.error);
        setLoading(false);
        return;
      }
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      urlRef.current = loaded.url;
      setSource({ ...loaded, file });
    } catch (e) {
      if (my === seq.current) setError(e instanceof Error ? e.message : '이미지를 불러오지 못했습니다.');
    } finally {
      if (my === seq.current) setLoading(false);
    }
  }, []);

  return { source, loading, error, select, clear };
}

/** 결과 Blob 의 object URL 을 관리합니다. */
export function useResultUrl() {
  const [result, setResult] = useState<{ blob: Blob; url: string; width: number; height: number } | null>(null);
  const ref = useRef<string | null>(null);
  useEffect(() => () => {
    if (ref.current) URL.revokeObjectURL(ref.current);
  }, []);
  const set = useCallback((blob: Blob | null, width = 0, height = 0) => {
    if (ref.current) URL.revokeObjectURL(ref.current);
    ref.current = null;
    if (!blob) {
      setResult(null);
      return;
    }
    const url = URL.createObjectURL(blob);
    ref.current = url;
    setResult({ blob, url, width, height });
  }, []);
  return [result, set] as const;
}

export function ImageDropzone({ onFile, disabled, inputId }: { onFile: (f: File | undefined) => void; disabled?: boolean; inputId: string }) {
  const [over, setOver] = useState(false);
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        if (!disabled) onFile(e.dataTransfer.files?.[0]);
      }}
      className={`rounded-lg border-2 border-dashed p-6 text-center ${over ? 'border-brand-600 bg-brand-50' : 'border-gray-300 bg-gray-50'}`}
    >
      <label htmlFor={inputId} className="block cursor-pointer text-sm font-medium text-brand-700">
        이미지 파일 선택 (또는 이곳에 끌어다 놓기)
      </label>
      <input
        id={inputId}
        type="file"
        accept={ACCEPT_ATTR}
        disabled={disabled}
        onChange={(e) => {
          onFile(e.target.files?.[0]);
          e.target.value = '';
        }}
        className="mt-3 block w-full text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-brand-600 file:px-3 file:py-1.5 file:text-white hover:file:bg-brand-700"
      />
      <p className="mt-2 text-xs text-gray-500">
        JPEG·PNG·WebP·GIF·BMP·AVIF, 최대 {formatBytes(IMAGE_LIMITS.maxFileBytes)} / {(IMAGE_LIMITS.maxInputPixels / 1_000_000).toLocaleString('ko-KR')}메가픽셀. 파일은 서버로 업로드되지 않습니다.
      </p>
    </div>
  );
}

export function Spinner({ label }: { label: string }) {
  return (
    <p role="status" className="flex items-center gap-2 text-sm text-brand-700">
      <span aria-hidden="true" className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
      {label}
    </p>
  );
}
