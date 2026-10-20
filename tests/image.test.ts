import { describe, expect, it } from 'vitest';
import { computeResize, extForMime, IMAGE_LIMITS, outputFileName, qualityToUnit, validateDimensions, validateImageFile } from '@/lib/image';

describe('이미지 검증', () => {
  it('형식·용량 검증', () => {
    expect(validateImageFile({ size: 1000, type: 'image/png' }).ok).toBe(true);
    expect(validateImageFile({ size: 0, type: 'image/png' }).ok).toBe(false);
    expect(validateImageFile({ size: 1000, type: 'application/pdf' }).ok).toBe(false);
    expect(validateImageFile({ size: IMAGE_LIMITS.maxFileBytes + 1, type: 'image/jpeg' }).ok).toBe(false);
  });
  it('해상도 검증', () => {
    expect(validateDimensions(4000, 3000).ok).toBe(true);
    expect(validateDimensions(10000, 10000).ok).toBe(false);
    expect(validateDimensions(0, 10).ok).toBe(false);
    expect(validateDimensions(1.5, 10).ok).toBe(false);
    expect(validateDimensions(9000, 100, 'output').ok).toBe(false);
  });
});

describe('리사이즈 계산', () => {
  const base = { srcW: 2000, srcH: 1000 };
  it('가로 기준 비율 유지', () => {
    expect(computeResize({ ...base, mode: 'width', width: 500 })).toEqual({ ok: true, width: 500, height: 250 });
  });
  it('세로 기준', () => {
    expect(computeResize({ ...base, mode: 'height', height: 100 })).toEqual({ ok: true, width: 200, height: 100 });
  });
  it('퍼센트', () => {
    expect(computeResize({ ...base, mode: 'percent', percent: 50 })).toEqual({ ok: true, width: 1000, height: 500 });
  });
  it('상자 안에 맞춤', () => {
    expect(computeResize({ ...base, mode: 'fit', width: 400, height: 400 })).toEqual({ ok: true, width: 400, height: 200 });
  });
  it('정확한 크기(비율 무시)', () => {
    expect(computeResize({ ...base, mode: 'exact', width: 300, height: 300, keepRatio: false })).toEqual({ ok: true, width: 300, height: 300 });
  });
  it('확대는 허용 옵션이 있어야 함', () => {
    expect(computeResize({ ...base, mode: 'percent', percent: 200 }).ok).toBe(false);
    expect(computeResize({ ...base, mode: 'percent', percent: 200, allowUpscale: true })).toEqual({ ok: true, width: 4000, height: 2000 });
  });
  it('잘못된 입력', () => {
    expect(computeResize({ ...base, mode: 'width', width: 0 }).ok).toBe(false);
    expect(computeResize({ ...base, mode: 'width' }).ok).toBe(false);
    expect(computeResize({ srcW: 0, srcH: 0, mode: 'width', width: 1 }).ok).toBe(false);
  });
  it('최소 1px', () => {
    expect(computeResize({ srcW: 1000, srcH: 1, mode: 'width', width: 10 })).toEqual({ ok: true, width: 10, height: 1 });
  });
});

describe('기타', () => {
  it('파일명·확장자·품질', () => {
    expect(outputFileName('photo.final.PNG', 'webp')).toBe('photo.final.webp');
    expect(outputFileName('a.jpg', 'jpg', '-resized')).toBe('a-resized.jpg');
    expect(outputFileName('.png', 'webp')).toBe('image.webp');
    expect(extForMime('image/jpeg')).toBe('jpg');
    expect(qualityToUnit(80)).toBe(0.8);
    expect(qualityToUnit(500)).toBe(1);
    expect(qualityToUnit(NaN)).toBe(0.8);
  });
});
