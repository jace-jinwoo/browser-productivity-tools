# 브라우저 텍스트·이미지 도구 (browser-productivity-tools)

글자수·단어수 세기, 텍스트 공백·줄바꿈 정리, 이미지 WebP 변환, 이미지 리사이즈, JSON Formatter, OG 태그 미리보기를 제공하는 한국어 정적 웹사이트입니다.
Next.js(App Router) + TypeScript + Tailwind CSS, `output: 'export'` 정적 배포, Netlify 자동 배포를 전제로 합니다. 서버·DB·로그인·유료 API 없이 모든 처리는 방문자의 브라우저에서 이루어집니다.

## 페이지

| 경로 | 내용 |
| --- | --- |
| `/` | 검색·카테고리·인기 도구·안내 콘텐츠 |
| `/character-counter/` | 공백 포함·제외 글자수, UTF-8 바이트, 줄 수 |
| `/word-counter/` | 단어(어절)·문단·줄 수 |
| `/text-cleaner/` | 연속 공백·빈 줄·줄바꿈 정리 (맞춤법 교정 없음) |
| `/image-to-webp/` | Canvas/Blob 기반 WebP 변환·다운로드 (WebP 미지원 브라우저 감지) |
| `/image-resizer/` | 가로·세로·비율·상자 맞춤·정확한 크기 리사이즈, JPEG/PNG/WebP 저장 |
| `/json-formatter/` | JSON 정렬·압축·키 정렬 (unit-converters 구현 재사용) |
| `/og-preview/` | 붙여 넣은 HTML 기반 OG 태그 추출·카드 미리보기·필수 속성 점검 |
| `/about/` `/guide/` `/privacy/` `/terms/` `/contact/` | 소개·이용 안내·정책·문의 |
| `/sitemap.xml` `/robots.txt` `/icon.svg` | SEO·파비콘 (빌드 시 생성) |

도구 메타데이터(설명·FAQ·참고 출처)는 `src/data/tools.ts`, 라우트는 `src/app/[tool]/page.tsx`(`generateStaticParams` + `dynamicParams = false`)입니다.

## 설계상 한계와 정책

- **서버 전송 없음**: 텍스트·이미지·HTML은 모두 브라우저 메모리에서만 처리합니다. 이미지는 File API → Canvas → Blob → 다운로드 링크(object URL, 초기화·교체·언마운트 시 해제) 순서입니다.
- **이미지 한도**(`src/lib/image.ts`의 `IMAGE_LIMITS`): 파일 20MB, 입력/출력 4천만 화소, 출력 한 변 8192px. **이 값은 이 사이트가 정한 안전 한도**이며 브라우저·기기별 실제 canvas·메모리 한도는 다를 수 있습니다(외부 문서에서 확인한 수치가 아님). 초과 시 안내 메시지를 표시합니다.
- **WebP 미지원 브라우저**: 마운트 시 1×1 canvas로 `toBlob('image/webp')` 지원을 점검하고, 변환 시 결과 Blob의 `type`이 `image/webp`가 아니면(브라우저가 PNG로 대체) 오류로 처리해 잘못된 파일을 내려주지 않습니다.
- **로딩 상태**: 이미지 로드·변환 중 스피너(`role="status"`)와 버튼 비활성화, 텍스트 도구는 `useDeferredValue` 기반 "계산 중…" 표시.
- **글자수 기준**: 유니코드 코드 포인트(이모지 1자), 공백 제외는 `\s` 전체 제외, 바이트는 UTF-8(`TextEncoder`). EUC-KR 등 다른 인코딩 바이트는 계산하지 않습니다. 제출처마다 줄바꿈 계산이 다를 수 있음을 화면에 안내합니다.
- **OG 미리보기**: 다른 사이트 URL을 브라우저에서 직접 가져오면 CORS로 막히는 경우가 많고 서버 중계는 금지되어 있어 **HTML 붙여 넣기 방식만** 제공합니다. 실제 공유 카드는 서비스마다 다르므로 미리보기는 참고용입니다.
- **맞춤법 자동 교정 미제공**: 검증된 API 없이 정확히 구현할 수 없어 만들지 않았습니다. `/text-cleaner/`는 공백·줄바꿈 정리만 합니다.
- **JSON**: `src/lib/json.ts`와 `tests/json.test.ts`는 `/home/claude/unit-converters`의 구현과 동일합니다(복사 후 변경 없음).

## 로컬 실행

```bash
npm install
npm run dev        # 개발 서버
npm test           # 단위 테스트 (vitest)
npm run typecheck  # 타입 검사
npm run build      # 정적 빌드 → out/
npm run verify     # out/ 검증: 필수 페이지, 메타데이터, 내부 링크, sitemap, 광고 코드 미노출
npm run preview    # out/ 미리보기
```

Node 20 이상을 권장합니다 (Netlify는 `netlify.toml`에서 22로 지정).

## 환경변수

`.env.example`를 참고해 Netlify 사이트 설정(Site configuration → Environment variables)에 등록합니다. `NEXT_PUBLIC_*` 값은 **빌드 시점**에 인라인되므로 변경 후 재배포가 필요합니다.

| 변수 | 설명 |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 배포 도메인 (canonical·sitemap·OG 기준, 끝 슬래시 없이) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | 문의 페이지 이메일 (비우면 "설정 필요" 안내 표시) |
| `NEXT_PUBLIC_ADSENSE_ENABLED` | AdSense 승인 전에는 `false` |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | `ca-pub-…` |
| `NEXT_PUBLIC_ADSENSE_SLOT_HOME / TOOL / CONTENT` | 위치별 광고 단위 ID |

## GitHub Private 저장소 연결

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin git@github.com:<계정>/<저장소>.git   # Private 저장소
git push -u origin main
```

## Netlify 배포

1. Netlify → Add new site → Import an existing project → GitHub 선택 후 저장소 연결
2. 설정은 `netlify.toml`이 지정합니다: Build command `npm run build`, Publish directory `out`
3. 환경변수 등록(위 표) 후 Deploy
4. 배포 후 `https://<도메인>/sitemap.xml`, `/robots.txt`, 각 도구 경로를 직접 열어 확인
5. Google Search Console에 사이트를 등록하고 sitemap.xml 제출

`trailingSlash: true`이므로 모든 페이지가 `경로/index.html`로 생성되어 정적 호스팅에서 새로고침 시 404가 나지 않습니다.

## AdSense 광고

- `src/components/AdSlot.tsx`가 광고 영역을 담당하며 `home` / `tool` / `content` 위치를 지원합니다.
- `NEXT_PUBLIC_ADSENSE_ENABLED`가 `true`가 아니거나 client/slot이 비어 있으면 **아무것도 렌더링하지 않고** AdSense 스크립트도 로드하지 않습니다. (`npm run verify`가 비활성 빌드에 광고 코드가 없는지 확인합니다.)
- 승인 후: 환경변수 4~6개를 입력하고 `ENABLED=true`로 바꿔 재배포합니다.
- 광고에는 "광고" 라벨이 붙고 도구 버튼과 분리됩니다. 승인 보장이나 클릭 유도 문구는 사용하지 않습니다.
- 사이트 루트에 `ads.txt`가 필요하면 `public/ads.txt`를 추가하세요 (승인 후 AdSense 안내에 따름).

## 데이터 정확성 정책

- 외부 사실 데이터(요금·법령·스펙 등)를 사용하지 않으며, 계산 기준(글자수 규칙, 이미지 한도)은 화면과 이 문서에 명시한 사이트 자체 정책입니다.
- 확인하지 못한 기능은 만들지 않고(맞춤법 교정, URL 직접 조회) 한계를 화면에 안내합니다.

## 유지보수 절차

- 도구 추가: `src/lib/`에 순수 함수 → `tests/`에 테스트 → `src/data/tools.ts`에 메타·FAQ·출처 추가 → `src/app/[tool]/page.tsx`의 `renderTool`에 연결 → `scripts/verify-static.mjs`의 `REQUIRED_PAGES`에 경로 추가. sitemap·홈 검색·푸터에는 자동 반영됩니다.
- 안내 글 추가: `src/data/guides.ts`
- `LAST_UPDATED`(`src/lib/site.ts`)는 내용 갱신 시 수정합니다.
- 배포 전 체크: `npm test && npm run typecheck && npm run build && npm run verify`

## 프로젝트 구조

```
src/app/         페이지, sitemap.ts, robots.ts, icon.svg
src/components/  도구 UI(TextStatsTool, TextCleanerTool, ImageToWebpTool, ImageResizerTool, JsonTool, OgPreviewTool), AdSlot, JsonLd, 공통 레이아웃
src/data/        tools.ts, guides.ts
src/lib/         text, textClean, image, imageBrowser, og, json, format, site
tests/           vitest 단위 테스트 (text, image, og, json)
scripts/         verify-static.mjs
```

## 참고 출처

각 도구 페이지 하단 "참고 출처"에 MDN, WHATWG HTML Standard, IETF RFC(3629·8259), Unicode, Open Graph protocol, Google WebP 문서 링크를 넣었습니다. 이 링크들은 공식 문서의 잘 알려진 경로이나 **이번 작업에서 개별 페이지를 열어 재확인하지는 않았습니다.** 배포 전 링크 유효성을 직접 확인하세요. 수치형 외부 데이터(요금·법적 기준 등)는 이 프로젝트에 없습니다.

## 검증 상태

개발 환경의 npm 레지스트리 접속이 차단되어 **`npm install`, `npm test`(vitest), `npm run typecheck`, `npm run build`, `npm run verify`는 실행하지 못했습니다.** 대신 다음만 수행했습니다.

- `src/lib`·`src/data` 순수 TS 파일을 전역 `tsc --strict`로 타입 검사(오류 없음), Node의 `--experimental-strip-types`로 글자수·정리·OG 파싱·리사이즈 계산의 대표 입력 동작 확인
- React 컴포넌트·페이지는 의존성 타입이 없어 타입 검사를 못 했고 코드를 직접 읽어 점검
- 실제 브라우저에서의 Canvas/Blob/WebP 동작과 이미지 UI는 **미검증**

배포 전 "배포 전 체크" 명령과 주요 브라우저 수동 테스트가 필요합니다.
