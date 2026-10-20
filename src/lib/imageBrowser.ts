/** 브라우저 전용 이미지 헬퍼 (Canvas / Blob / File API). 서버로 전송하지 않습니다. */

export interface LoadedImage {
  img: HTMLImageElement;
  url: string; // object URL (사용 후 revokeObjectURL 필요)
  width: number;
  height: number;
}

export function loadImageFromFile(file: File): Promise<LoadedImage> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth < 1 || img.naturalHeight < 1) {
        URL.revokeObjectURL(url);
        reject(new Error('이미지 크기를 읽을 수 없습니다.'));
        return;
      }
      resolve({ img, url, width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('이미지를 열 수 없습니다. 손상된 파일이거나 이 브라우저가 해당 형식을 지원하지 않을 수 있습니다.'));
    };
    img.src = url;
  });
}

export function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality?: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    try {
      canvas.toBlob((b) => resolve(b), mime, quality);
    } catch {
      resolve(null);
    }
  });
}

export type EncodeResult = { ok: true; blob: Blob } | { ok: false; error: string };

/**
 * 이미지를 지정 크기 canvas 에 그려 mime 형식으로 인코딩합니다.
 * toBlob 은 미지원 형식이면 PNG 로 대체하므로 결과 형식을 반드시 확인합니다.
 */
export async function renderToBlob(
  img: CanvasImageSource,
  width: number,
  height: number,
  mime: 'image/webp' | 'image/jpeg' | 'image/png',
  quality: number,
): Promise<EncodeResult> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return { ok: false, error: '이 브라우저에서 canvas를 사용할 수 없거나 메모리가 부족합니다. 더 작은 이미지로 다시 시도해 주세요.' };
  }
  try {
    if (mime === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, width, height);
    const blob = await canvasToBlob(canvas, mime, mime === 'image/png' ? undefined : quality);
    if (!blob) {
      return { ok: false, error: '이미지 인코딩에 실패했습니다. 해상도가 너무 크거나 메모리가 부족할 수 있습니다.' };
    }
    if (blob.type !== mime) {
      return {
        ok: false,
        error:
          mime === 'image/webp'
            ? '이 브라우저는 WebP 인코딩을 지원하지 않습니다. 다른 최신 브라우저에서 시도하거나 JPEG·PNG로 저장해 주세요.'
            : `이 브라우저는 ${mime} 인코딩을 지원하지 않습니다.`,
      };
    }
    return { ok: true, blob };
  } catch (e) {
    return { ok: false, error: `처리 중 오류가 발생했습니다: ${e instanceof Error ? e.message : String(e)}` };
  } finally {
    canvas.width = 0;
    canvas.height = 0;
  }
}

/** 브라우저가 canvas 에서 WebP 인코딩을 지원하는지 확인합니다. */
export async function detectWebpEncoding(): Promise<boolean> {
  try {
    const c = document.createElement('canvas');
    c.width = 1;
    c.height = 1;
    const b = await canvasToBlob(c, 'image/webp', 0.8);
    return b !== null && b.type === 'image/webp';
  } catch {
    return false;
  }
}
