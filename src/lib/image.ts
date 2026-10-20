/** 이미지 처리 보조 로직 (순수 함수). Canvas/Blob 호출은 컴포넌트에서 수행합니다. */

/** 이 사이트가 정한 안전 한도입니다. 브라우저별 실제 한도는 다를 수 있습니다. */
export const IMAGE_LIMITS = {
  /** 입력 파일 최대 크기 (바이트) */
  maxFileBytes: 20 * 1024 * 1024,
  /** 입력 이미지 최대 화소 수 (가로×세로) */
  maxInputPixels: 40_000_000,
  /** 출력 이미지 최대 화소 수 */
  maxOutputPixels: 40_000_000,
  /** 출력 한 변 최대 길이 (px) */
  maxSide: 8192,
} as const;

/** 입력으로 받는 래스터 이미지 형식 (브라우저가 디코딩 가능해야 함) */
export const ACCEPTED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/avif'] as const;
export const ACCEPT_ATTR = ACCEPTED_MIME.join(',');

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '-';
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

export type Validation = { ok: true } | { ok: false; error: string };

export function validateImageFile(file: { size: number; type: string }): Validation {
  if (file.size === 0) return { ok: false, error: '빈 파일입니다.' };
  if (!(ACCEPTED_MIME as readonly string[]).includes(file.type)) {
    return { ok: false, error: `지원하지 않는 형식입니다(${file.type || '알 수 없음'}). JPEG, PNG, WebP, GIF, BMP, AVIF 파일을 선택해 주세요. (GIF는 첫 프레임만 처리됩니다.)` };
  }
  if (file.size > IMAGE_LIMITS.maxFileBytes) {
    return { ok: false, error: `파일이 너무 큽니다(${formatBytes(file.size)}). 최대 ${formatBytes(IMAGE_LIMITS.maxFileBytes)}까지 처리합니다.` };
  }
  return { ok: true };
}

export function validateDimensions(width: number, height: number, kind: 'input' | 'output' = 'input'): Validation {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) {
    return { ok: false, error: '가로·세로는 1 이상의 정수여야 합니다.' };
  }
  const maxPixels = kind === 'input' ? IMAGE_LIMITS.maxInputPixels : IMAGE_LIMITS.maxOutputPixels;
  if (width * height > maxPixels) {
    return { ok: false, error: `해상도가 너무 큽니다(${width}×${height}). 최대 ${(maxPixels / 1_000_000).toLocaleString('ko-KR')}메가픽셀까지 처리합니다.` };
  }
  if (kind === 'output' && (width > IMAGE_LIMITS.maxSide || height > IMAGE_LIMITS.maxSide)) {
    return { ok: false, error: `한 변은 최대 ${IMAGE_LIMITS.maxSide}px까지 지정할 수 있습니다.` };
  }
  return { ok: true };
}

export type ResizeMode = 'width' | 'height' | 'percent' | 'fit' | 'exact';

export interface ResizeInput {
  srcW: number;
  srcH: number;
  mode: ResizeMode;
  width?: number;
  height?: number;
  percent?: number;
  /** exact 모드에서 비율 유지 여부 (false 면 늘어남) */
  keepRatio?: boolean;
  /** 원본보다 크게 만들기 허용 */
  allowUpscale?: boolean;
}

export type ResizeResult = { ok: true; width: number; height: number } | { ok: false; error: string };

/** 목표 크기를 계산합니다. 결과는 항상 1 이상의 정수입니다. */
export function computeResize(i: ResizeInput): ResizeResult {
  const { srcW, srcH } = i;
  if (!(srcW > 0 && srcH > 0)) return { ok: false, error: '원본 크기를 알 수 없습니다.' };
  const need = (v: number | undefined, label: string): string | null =>
    v === undefined || !Number.isFinite(v) || v <= 0 ? `${label}을(를) 0보다 큰 숫자로 입력해 주세요.` : null;
  let w: number;
  let h: number;
  switch (i.mode) {
    case 'width': {
      const e = need(i.width, '가로(px)');
      if (e) return { ok: false, error: e };
      w = i.width!;
      h = (srcH * w) / srcW;
      break;
    }
    case 'height': {
      const e = need(i.height, '세로(px)');
      if (e) return { ok: false, error: e };
      h = i.height!;
      w = (srcW * h) / srcH;
      break;
    }
    case 'percent': {
      const e = need(i.percent, '비율(%)');
      if (e) return { ok: false, error: e };
      w = (srcW * i.percent!) / 100;
      h = (srcH * i.percent!) / 100;
      break;
    }
    case 'fit': {
      const e = need(i.width, '가로(px)') ?? need(i.height, '세로(px)');
      if (e) return { ok: false, error: e };
      const s = Math.min(i.width! / srcW, i.height! / srcH);
      w = srcW * s;
      h = srcH * s;
      break;
    }
    case 'exact': {
      const e = need(i.width, '가로(px)') ?? need(i.height, '세로(px)');
      if (e) return { ok: false, error: e };
      if (i.keepRatio) {
        const s = Math.min(i.width! / srcW, i.height! / srcH);
        w = srcW * s;
        h = srcH * s;
      } else {
        w = i.width!;
        h = i.height!;
      }
      break;
    }
  }
  w = Math.max(1, Math.round(w));
  h = Math.max(1, Math.round(h));
  if (!i.allowUpscale && (w > srcW || h > srcH)) {
    return { ok: false, error: `원본(${srcW}×${srcH})보다 크게 만들려면 "확대 허용"을 선택하세요. 확대하면 화질이 떨어질 수 있습니다.` };
  }
  return { ok: true, width: w, height: h };
}

/** 다운로드 파일명: 원본 이름의 확장자를 바꿉니다. */
export function outputFileName(original: string, ext: string, suffix = ''): string {
  const base = original.replace(/\.[^./\\]+$/, '') || 'image';
  return `${base}${suffix}.${ext}`;
}

/** MIME → 확장자 */
export function extForMime(mime: string): string {
  switch (mime) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    default:
      return 'img';
  }
}

/** 품질 슬라이더 값(1~100)을 canvas.toBlob 의 0~1 로 변환 */
export function qualityToUnit(q: number): number {
  if (!Number.isFinite(q)) return 0.8;
  return Math.min(1, Math.max(0.01, Math.round(q) / 100));
}
