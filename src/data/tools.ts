export type ToolCategory = 'text' | 'image' | 'dev';

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  text: '텍스트 도구',
  image: '이미지 도구',
  dev: '웹·개발 도구',
};

export interface SourceRef {
  label: string;
  url?: string;
}

export interface ToolMeta {
  slug: string;
  name: string;
  category: ToolCategory;
  popular: boolean;
  title: string;
  description: string;
  shortDescription: string;
  keywords: string[];
  howTo: string[];
  example: { input: string; output: string; note?: string };
  details: string[];
  faq: { q: string; a: string }[];
  sources: SourceRef[];
  related: string[];
}

export const TOOLS: ToolMeta[] = [
  {
    slug: 'character-counter',
    name: '글자수 세기',
    category: 'text',
    popular: true,
    title: '글자수 세기 - 공백 포함·제외, 바이트, 줄 수 계산',
    description:
      '텍스트의 글자수를 공백 포함·공백 제외로 나누어 세고, UTF-8 바이트 수와 줄 수까지 한 번에 보여 줍니다. 입력한 글은 서버로 전송되지 않습니다.',
    shortDescription: '공백 포함·제외 글자수, UTF-8 바이트, 줄 수를 실시간 계산',
    keywords: ['글자수', '글자수 세기', '공백 제외', '바이트 수', '자소서', '줄 수', '문자 수'],
    howTo: [
      '입력 칸에 글을 붙여 넣거나 직접 입력합니다.',
      '공백 포함·공백 제외 글자수, UTF-8 바이트, 줄 수가 실시간으로 표시됩니다.',
      '제출처가 "공백 포함"인지 "공백 제외"인지, 글자 기준인지 바이트 기준인지 확인하고 해당 값을 보세요.',
      '필요하면 "지우기" 버튼으로 입력을 비웁니다.',
    ],
    example: {
      input: '안녕 하세요\\n반갑습니다 (두 줄)',
      output: '공백 포함 12자 / 공백 제외 10자 / UTF-8 32바이트 / 2줄',
      note: '한글 10자 × 3바이트 = 30바이트에 스페이스 1바이트와 줄바꿈 1바이트를 더해 32바이트입니다. 줄바꿈은 공백 문자로 취급되어 공백 제외 글자수에서 빠집니다.',
    },
    details: [
      '글자수는 유니코드 코드 포인트 단위로 셉니다. 이모지처럼 JavaScript 문자열에서 2개 단위(서로게이트 쌍)로 저장되는 문자도 1글자로 계산합니다. 여러 코드 포인트가 합쳐져 한 글자로 보이는 경우(예: 일부 이모지 조합)를 위해, 브라우저가 지원하면 "사용자 인지 글자(grapheme)" 수를 참고값으로 함께 표시합니다.',
      '"공백 제외"는 스페이스·탭·줄바꿈·전각 공백 등 모든 공백 문자를 뺀 글자수입니다. 줄바꿈도 공백 문자로 취급되므로 공백 포함 글자수에는 줄바꿈 문자가 1글자로 들어갑니다. 제출 사이트마다 줄바꿈 계산 방식이 다를 수 있으니 최종 제출 화면의 카운터도 확인하세요.',
      '바이트 수는 UTF-8 인코딩 기준입니다. ASCII 문자는 1바이트, 한글 음절은 3바이트, 대부분의 이모지는 4바이트입니다. EUC-KR 등 다른 인코딩 기준 바이트 수는 계산하지 않습니다.',
      '줄 수는 줄바꿈(LF, CRLF, CR)으로 나눈 줄의 개수이며, 마지막 줄바꿈 뒤의 빈 줄도 1줄로 셉니다. 내용이 있는 줄 수와 문단 수는 별도로 표시합니다.',
    ],
    faq: [
      { q: '입력한 글이 서버로 전송되나요?', a: '아니요. 모든 계산은 브라우저 안에서 이루어지며 입력한 텍스트는 저장하거나 전송하지 않습니다.' },
      { q: '자기소개서 글자수와 값이 다르게 나옵니다.', a: '제출 사이트마다 줄바꿈·공백·특수문자 처리 방식이 다를 수 있습니다. 이 도구는 공백 포함/제외와 바이트를 구분해 보여 주므로 제출처의 기준에 맞는 값을 확인하고, 최종 제출 화면에서도 한 번 더 확인하세요.' },
      { q: '한글이 3바이트인 이유는 무엇인가요?', a: 'UTF-8은 문자에 따라 1~4바이트를 사용하는 가변 길이 인코딩이며, 한글 음절은 3바이트로 인코딩됩니다.' },
      { q: '아주 긴 글도 처리할 수 있나요?', a: '브라우저 메모리가 허용하는 범위에서 처리됩니다. 매우 긴 글을 붙여 넣으면 잠시 느려질 수 있으며, 계산 중에는 "계산 중…" 상태를 표시합니다.' },
    ],
    sources: [
      { label: 'MDN - TextEncoder (UTF-8 인코딩)', url: 'https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder' },
      { label: 'RFC 3629 - UTF-8, a transformation format of ISO 10646', url: 'https://www.rfc-editor.org/rfc/rfc3629' },
      { label: 'MDN - Intl.Segmenter', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter' },
      { label: 'Unicode Standard Annex #29 - Text Segmentation', url: 'https://unicode.org/reports/tr29/' },
    ],
    related: ['word-counter', 'text-cleaner', 'json-formatter'],
  },
  {
    slug: 'word-counter',
    name: '단어수 세기',
    category: 'text',
    popular: true,
    title: '단어수 세기 - 단어·어절·문단 수 계산',
    description:
      '공백으로 구분한 단어(어절) 수, 문단 수, 줄 수를 세고 글자수도 함께 보여 줍니다. 영문 단어수와 한글 어절 수 확인에 사용하세요.',
    shortDescription: '단어(어절) 수·문단 수·줄 수를 실시간으로 계산',
    keywords: ['단어수', '단어 수 세기', '어절', '워드 카운터', 'word count', '문단 수'],
    howTo: [
      '입력 칸에 영문 또는 한글 글을 붙여 넣습니다.',
      '단어(어절) 수, 문단 수, 줄 수가 실시간으로 표시됩니다.',
      '글자수·바이트가 필요하면 함께 표시되는 값이나 글자수 세기 도구를 이용합니다.',
    ],
    example: {
      input: 'The quick brown fox\\n\\n안녕 하세요',
      output: '단어 6개 / 문단 2개 / 줄 3줄',
      note: '영문은 공백으로 나뉜 덩어리를 단어로, 한글은 띄어쓰기로 나뉜 덩어리(어절)를 단어로 셉니다.',
    },
    details: [
      '이 도구의 "단어 수"는 공백(스페이스·탭·줄바꿈)으로 나뉜 덩어리의 개수입니다. 영어에서는 일반적인 단어 수와 비슷하지만 하이픈 단어(well-known)는 1개로, 구두점이 붙은 단어는 구두점을 포함해 1개로 셉니다.',
      '한국어는 띄어쓰기 단위인 어절 기준으로 셉니다. 띄어쓰기를 하지 않는 중국어·일본어 문장은 하나의 덩어리로 세어지므로 단어 수가 실제보다 적게 나옵니다. 언어별 형태소·단어 분석은 지원하지 않습니다.',
      '문단은 빈 줄로 구분된 덩어리입니다. 줄바꿈만 하고 빈 줄이 없으면 같은 문단으로 셉니다.',
    ],
    faq: [
      { q: 'MS Word의 단어 수와 같은가요?', a: '프로그램마다 단어를 나누는 규칙이 달라 다를 수 있습니다. 이 도구는 공백 기준이라는 단순한 규칙을 사용하며 그 기준을 화면에 명시합니다.' },
      { q: '숫자나 기호만 있는 덩어리도 단어로 세나요?', a: '네. 공백으로 구분된 모든 덩어리를 1개로 셉니다. 예를 들어 "-" 하나만 있어도 1개입니다.' },
      { q: '입력한 글은 저장되나요?', a: '저장하거나 전송하지 않습니다. 브라우저 메모리에서만 계산합니다.' },
    ],
    sources: [
      { label: 'MDN - String.prototype.split()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split' },
      { label: 'MDN - Intl.Segmenter', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter' },
      { label: 'Unicode Standard Annex #29 - Text Segmentation', url: 'https://unicode.org/reports/tr29/' },
    ],
    related: ['character-counter', 'text-cleaner', 'json-formatter'],
  },
  {
    slug: 'text-cleaner',
    name: '텍스트 공백·줄바꿈 정리',
    category: 'text',
    popular: false,
    title: '텍스트 공백·줄바꿈 정리 - 연속 공백, 빈 줄 제거',
    description:
      '연속 공백 줄이기, 줄 앞뒤 공백 제거, 빈 줄 정리, 줄바꿈 통일, 한 줄로 합치기를 옵션으로 골라 적용합니다. 맞춤법 교정은 하지 않습니다.',
    shortDescription: '연속 공백·빈 줄·줄바꿈을 옵션으로 정리 (맞춤법 교정 아님)',
    keywords: ['공백 제거', '줄바꿈 제거', '빈 줄 제거', '텍스트 정리', '띄어쓰기 정리', '공백 정리'],
    howTo: [
      '정리할 글을 입력 칸에 붙여 넣습니다.',
      '적용할 정리 옵션을 체크합니다. 결과는 즉시 아래에 표시됩니다.',
      '결과를 확인하고 "결과 복사"로 복사합니다.',
      '글자 내용은 바꾸지 않고 공백과 줄바꿈만 다룹니다.',
    ],
    example: {
      input: '"  안녕   하세요  " 다음에 빈 줄 3개, 그 뒤에 "반갑습니다"',
      output: '안녕 하세요 / (빈 줄 1개) / 반갑습니다',
      note: '기본 옵션: 연속 공백 1칸, 줄 앞뒤 공백 제거, 연속 빈 줄 1줄, 전체 앞뒤 공백 제거.',
    },
    details: [
      '이 도구는 공백과 줄바꿈 같은 "형식" 문자만 정리합니다. 맞춤법·띄어쓰기 교정은 검증된 공개 API 없이 정확하게 구현할 수 없어 제공하지 않습니다. 단어 사이의 띄어쓰기가 맞는지는 판단하지 않고, 이미 있는 공백만 정리합니다.',
      '투명 문자 제거 옵션은 폭이 없는 공백(U+200B), 워드 조이너(U+2060), 바이트 순서 표시(U+FEFF)를 지웁니다. 복사해 온 글에 눈에 보이지 않는 문자가 섞여 있을 때 사용합니다. 일부 언어와 이모지 조합에서 쓰이는 U+200C·U+200D는 건드리지 않습니다.',
      '"한 줄로 합치기"를 켜면 모든 줄바꿈이 공백 1칸으로 바뀌어 문단 구분도 사라집니다.',
    ],
    faq: [
      { q: '맞춤법 검사도 해 주나요?', a: '아니요. 검증된 맞춤법 검사 API 없이 정확한 교정을 제공할 수 없어 기능을 만들지 않았습니다. 공백·줄바꿈 정리만 지원합니다.' },
      { q: '내용 글자가 바뀌지는 않나요?', a: '공백, 줄바꿈, 지정한 투명 문자만 다룹니다. 그 외 글자는 그대로 유지됩니다.' },
      { q: 'PDF에서 복사한 글의 줄바꿈이 어색합니다.', a: '"줄바꿈을 공백으로 합치기"와 "연속 공백 줄이기"를 함께 켜 보세요. 문단 구분이 필요하면 합치기 옵션은 끄고 빈 줄 정리만 사용하세요.' },
    ],
    sources: [
      { label: 'MDN - 정규 표현식 문자 클래스(\\s 포함)', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Character_class' },
      { label: 'MDN - String.prototype.replace()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace' },
      { label: 'Unicode Standard Annex #44 - Unicode Character Database', url: 'https://www.unicode.org/reports/tr44/' },
    ],
    related: ['character-counter', 'word-counter', 'json-formatter'],
  },
  {
    slug: 'image-to-webp',
    name: '이미지 WebP 변환',
    category: 'image',
    popular: true,
    title: '이미지 WebP 변환 - JPG·PNG를 브라우저에서 WebP로',
    description:
      'JPG, PNG 등 이미지를 WebP로 변환합니다. 파일은 서버로 업로드되지 않고 브라우저 메모리에서만 처리되며, 품질 조절과 다운로드를 지원합니다.',
    shortDescription: 'JPG·PNG 등을 업로드 없이 브라우저에서 WebP로 변환·다운로드',
    keywords: ['webp 변환', 'png to webp', 'jpg to webp', '이미지 변환', '이미지 용량 줄이기', 'webp'],
    howTo: [
      '이미지 파일을 선택하거나 끌어다 놓습니다. (최대 20MB, 4천만 화소)',
      '품질(1~100)을 조절합니다. 낮을수록 용량이 줄고 화질이 떨어집니다.',
      '"WebP로 변환"을 누르면 변환 결과의 용량과 미리보기가 표시됩니다.',
      '"다운로드"로 WebP 파일을 저장합니다.',
    ],
    example: {
      input: 'photo.png, 품질 80',
      output: 'photo.webp (결과 용량은 이미지 내용에 따라 달라짐)',
      note: '변환 후 용량이 원본보다 커질 수도 있습니다. 결과 용량은 변환 후 화면에서 직접 확인하세요.',
    },
    details: [
      '변환은 브라우저의 Canvas API(canvas.toBlob)로 수행합니다. 이미지를 canvas에 그린 뒤 "image/webp" 형식으로 인코딩해 Blob을 만들고, 그 Blob을 다운로드 링크로 제공합니다. 어떤 데이터도 서버로 전송되지 않습니다.',
      'canvas.toBlob은 요청한 형식을 지원하지 않으면 PNG로 대체해 반환합니다. 이 도구는 결과 Blob의 실제 형식을 검사해 WebP로 만들어지지 않은 경우(WebP 인코딩 미지원 브라우저) 오류를 안내하고 파일을 제공하지 않습니다.',
      '투명한 PNG를 WebP로 변환하면 투명도가 유지됩니다. GIF·애니메이션 이미지는 첫 프레임만 변환됩니다.',
      '메모리 보호를 위해 입력 파일 20MB, 4천만 화소(예: 8000×5000)를 한도로 둡니다. 이 값은 이 사이트가 정한 안전 한도이며 브라우저·기기별 실제 한도는 더 낮을 수 있습니다. 한도를 넘거나 변환에 실패하면 오류 메시지를 표시합니다.',
      '사진의 EXIF 메타데이터(촬영 위치 등)는 canvas에 다시 그리는 과정에서 결과 파일에 포함되지 않는 것이 일반적입니다. 다만 개인정보 제거를 보장하지는 않으니 중요한 파일은 결과를 직접 확인하세요.',
    ],
    faq: [
      { q: '이미지가 서버에 업로드되나요?', a: '아니요. File API로 읽은 파일을 브라우저 메모리에서만 처리하고, 결과도 브라우저에서 바로 다운로드합니다.' },
      { q: '"이 브라우저는 WebP 인코딩을 지원하지 않습니다"라고 나옵니다.', a: '브라우저가 canvas에서 WebP 인코딩을 지원하지 않는 경우입니다. 다른 최신 브라우저에서 다시 시도해 보세요.' },
      { q: 'WebP로 바꾸면 항상 용량이 줄어드나요?', a: '그렇지 않습니다. 이미지 내용과 품질 설정에 따라 달라지며 오히려 커질 수 있습니다. 결과 용량을 화면에서 확인하세요.' },
      { q: '변환이 느리거나 실패합니다.', a: '큰 이미지는 시간이 걸리고 메모리가 부족하면 실패할 수 있습니다. 변환 중에는 로딩 상태가 표시되며, 실패하면 오류 메시지를 표시하니 더 작은 이미지를 사용해 보세요.' },
    ],
    sources: [
      { label: 'MDN - HTMLCanvasElement.toBlob()', url: 'https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob' },
      { label: 'WHATWG HTML Standard - canvas', url: 'https://html.spec.whatwg.org/multipage/canvas.html' },
      { label: 'MDN - File API', url: 'https://developer.mozilla.org/en-US/docs/Web/API/File_API' },
      { label: 'MDN - URL.createObjectURL()', url: 'https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static' },
      { label: 'Google for Developers - WebP', url: 'https://developers.google.com/speed/webp' },
    ],
    related: ['image-resizer', 'og-preview', 'character-counter'],
  },
  {
    slug: 'image-resizer',
    name: '이미지 리사이즈',
    category: 'image',
    popular: true,
    title: '이미지 리사이즈 - 가로·세로·비율로 크기 줄이기',
    description:
      '이미지의 가로·세로 크기를 픽셀이나 비율로 조절합니다. 업로드 없이 브라우저에서 처리하며 JPEG·PNG·WebP로 저장할 수 있습니다.',
    shortDescription: '픽셀·비율로 이미지 크기를 바꾸고 JPEG·PNG·WebP로 다운로드',
    keywords: ['이미지 리사이즈', '이미지 크기 조절', '사진 크기 줄이기', 'resize image', '이미지 축소'],
    howTo: [
      '이미지 파일을 선택하면 원본 크기가 표시됩니다.',
      '크기 지정 방식(가로 기준·세로 기준·비율·상자에 맞춤·정확한 크기)을 고르고 값을 입력합니다.',
      '저장 형식(JPEG·PNG·WebP)과 품질을 선택하고 "리사이즈"를 누릅니다.',
      '결과 크기·용량을 확인한 뒤 "다운로드"를 누릅니다.',
    ],
    example: {
      input: '4000×3000 사진, 가로 기준 1200px',
      output: '1200×900 (비율 유지)',
      note: '세로 = 3000 × 1200 ÷ 4000 = 900. 계산 결과는 반올림한 정수 픽셀입니다.',
    },
    details: [
      '크기 조절은 Canvas API로 원본 이미지를 목표 크기의 canvas에 다시 그려서 수행합니다. 줄일 때는 보통 화질 손실이 작지만, 원본보다 크게 만들면 흐려집니다. 기본적으로 확대는 막혀 있고 "확대 허용"을 선택해야 합니다.',
      'JPEG는 투명도를 지원하지 않으므로 투명한 PNG를 JPEG로 저장하면 투명 영역이 흰색 배경으로 채워집니다. PNG는 무손실이라 품질 설정이 적용되지 않습니다.',
      '파일 20MB, 입력 4천만 화소, 출력 4천만 화소와 한 변 8192px을 이 사이트의 안전 한도로 검증합니다. 브라우저·기기에 따라 실제 canvas 한도가 더 낮을 수 있으며, 실패하면 오류를 안내합니다.',
      'WebP 저장은 브라우저가 WebP 인코딩을 지원할 때만 가능하며, 지원하지 않으면 그 사실을 알리고 파일을 제공하지 않습니다. 이 경우 JPEG·PNG를 선택하세요.',
    ],
    faq: [
      { q: '이미지 비율을 유지하려면?', a: '"가로 기준", "세로 기준", "비율(%)", "상자에 맞춤" 방식은 비율을 유지합니다. "정확한 크기"에서는 비율 유지 체크 여부를 선택할 수 있습니다.' },
      { q: '크기를 키웠더니 흐려집니다.', a: '확대는 없던 정보를 만들어 내지 못하므로 화질이 떨어집니다. 가능하면 원본 해상도가 더 큰 이미지를 사용하세요.' },
      { q: '업로드되나요?', a: '아니요. 브라우저 메모리에서만 처리되고 결과도 브라우저에서 바로 다운로드합니다.' },
      { q: 'GIF 애니메이션도 되나요?', a: '첫 프레임만 처리되어 정지 이미지로 저장됩니다.' },
    ],
    sources: [
      { label: 'MDN - CanvasRenderingContext2D.drawImage()', url: 'https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage' },
      { label: 'MDN - HTMLCanvasElement.toBlob()', url: 'https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob' },
      { label: 'MDN - createImageBitmap()', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/createImageBitmap' },
      { label: 'MDN - File API', url: 'https://developer.mozilla.org/en-US/docs/Web/API/File_API' },
      { label: 'MDN - 이미지 파일 형식 가이드', url: 'https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types' },
    ],
    related: ['image-to-webp', 'og-preview', 'character-counter'],
  },
  {
    slug: 'json-formatter',
    name: 'JSON 포맷터',
    category: 'dev',
    popular: true,
    title: 'JSON 포맷터 - JSON 정렬·압축·오류 위치 확인',
    description:
      'JSON을 보기 좋게 정렬(Beautify)하거나 한 줄로 압축(Minify)하고, 문법 오류가 있으면 위치를 알려 줍니다. 입력은 서버로 전송되지 않습니다.',
    shortDescription: 'JSON 정렬·압축·키 정렬, 오류 위치 안내 (브라우저 내부 처리)',
    keywords: ['json', 'json formatter', 'json 정렬', 'json 압축', 'json 검증', 'json beautify', 'minify'],
    howTo: [
      '입력 칸에 JSON을 붙여 넣습니다.',
      '정렬(Beautify) 또는 압축(Minify) 모드와 들여쓰기(2칸·4칸·탭)를 선택합니다.',
      '필요하면 "객체 키 정렬"을 켭니다.',
      '문법 오류가 있으면 오류 메시지가 표시됩니다. 결과는 "결과 복사"로 복사합니다.',
    ],
    example: {
      input: '{"b":1,"a":[1,2]}',
      output: '들여쓰기 2칸으로 여러 줄 정렬, 키 정렬 시 "a"가 먼저 나옴',
      note: '배열의 순서는 키 정렬을 켜도 바뀌지 않습니다.',
    },
    details: [
      'JSON 문법은 RFC 8259에 정의되어 있습니다. 이 도구는 브라우저의 JSON.parse로 문법을 검사한 뒤 JSON.stringify로 다시 출력합니다. 따라서 주석, 마지막 쉼표, 작은따옴표 문자열처럼 표준 JSON이 아닌 형식은 오류로 처리됩니다.',
      '매우 큰 숫자(정밀도 한계를 넘는 정수)는 JavaScript 숫자로 읽히는 과정에서 값이 달라질 수 있습니다. 정밀한 큰 정수는 문자열로 다루는 것이 안전합니다.',
      '입력 크기는 500만 자로 제한해 브라우저가 멈추는 것을 막습니다.',
    ],
    faq: [
      { q: '입력한 JSON이 서버로 전송되나요?', a: '아니요. 모든 처리는 브라우저에서 이루어집니다.' },
      { q: '주석이 있는 JSON(JSONC)도 되나요?', a: '지원하지 않습니다. 표준 JSON(RFC 8259)만 처리합니다.' },
      { q: '중복된 키가 있으면 어떻게 되나요?', a: 'JSON.parse는 같은 이름의 키가 여러 번 나오면 마지막 값을 사용합니다. 앞의 값은 결과에서 사라집니다.' },
    ],
    sources: [
      { label: 'RFC 8259 - The JavaScript Object Notation (JSON) Data Interchange Format', url: 'https://www.rfc-editor.org/rfc/rfc8259' },
      { label: 'MDN - JSON.parse()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse' },
      { label: 'MDN - JSON.stringify()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify' },
    ],
    related: ['og-preview', 'text-cleaner', 'character-counter'],
  },
  {
    slug: 'og-preview',
    name: 'OG 태그 미리보기',
    category: 'dev',
    popular: false,
    title: 'OG 태그 미리보기 - HTML 붙여넣기로 공유 카드 확인',
    description:
      '페이지 HTML을 붙여 넣으면 og:title·og:description·og:image 등 Open Graph 태그를 추출해 공유 카드 미리보기와 점검 결과를 보여 줍니다.',
    shortDescription: 'HTML을 붙여 넣어 Open Graph 태그 추출·공유 카드 미리보기·필수 항목 점검',
    keywords: ['og 태그', 'open graph', '오픈그래프 미리보기', 'og:image', '링크 미리보기', 'twitter card'],
    howTo: [
      '확인할 페이지의 HTML 소스(<head> 부분만이어도 됨)를 입력 칸에 붙여 넣습니다.',
      '추출된 OG·트위터 카드 태그와 점검 결과가 표시됩니다.',
      '공유 카드 예시 미리보기를 확인합니다. 이미지가 절대 URL(https://…)이면 불러와 보여 줍니다.',
      '빠진 필수 태그가 있으면 수정한 뒤 다시 붙여 넣어 확인합니다.',
    ],
    example: {
      input: '<meta property="og:title" content="제목"> 등이 담긴 HTML',
      output: 'og:title 등 추출 값 + 공유 카드 모양 미리보기 + 누락 항목 안내',
    },
    details: [
      '다른 사이트의 URL을 입력받아 브라우저에서 직접 HTML을 가져오려고 하면 CORS(교차 출처 리소스 공유) 정책 때문에 대부분 차단됩니다. 서버 없이 정적으로 운영되는 이 사이트는 중계 서버를 두지 않으므로, URL 입력 방식 대신 HTML 소스를 붙여 넣는 방식으로 제공합니다. 페이지 소스는 브라우저의 "페이지 소스 보기"에서 복사할 수 있습니다.',
      'Open Graph 프로토콜은 og:title, og:type, og:image, og:url을 필수 속성으로 정의합니다. 이 도구는 이 네 가지가 있는지 점검하고, 없으면 오류로 표시합니다. og:description 등은 선택 속성입니다.',
      '실제 공유 카드의 모양과 규칙(이미지 비율, 글자 수 잘림 등)은 메신저·SNS 서비스마다 다르고 바뀔 수 있습니다. 이 미리보기는 일반적인 카드 형태를 보여 주는 참고용이며 각 서비스의 실제 표시와 같음을 보장하지 않습니다. 공유 서비스는 이전 결과를 캐시하므로 수정 후 반영이 늦을 수 있습니다.',
      '붙여 넣은 HTML은 문자열로만 분석하며 실행하지 않습니다. 스크립트와 주석 속의 태그는 무시합니다.',
    ],
    faq: [
      { q: 'URL만 입력하면 안 되나요?', a: '브라우저는 다른 도메인의 HTML을 CORS 정책 때문에 직접 가져오지 못하는 경우가 많습니다. 서버 없는 정적 사이트라 중계 서버도 없으므로 HTML을 붙여 넣는 방식만 제공합니다.' },
      { q: '미리보기에 이미지가 안 보입니다.', a: 'og:image가 상대 경로이거나, 이미지 서버가 다른 사이트에서의 불러오기를 막거나, 주소가 잘못된 경우일 수 있습니다. 절대 URL(https://…)인지 확인하세요.' },
      { q: '붙여 넣은 HTML이 서버로 전송되나요?', a: '아니요. 브라우저 안에서만 분석합니다.' },
    ],
    sources: [
      { label: 'The Open Graph protocol', url: 'https://ogp.me/' },
      { label: 'WHATWG HTML Standard - The meta element', url: 'https://html.spec.whatwg.org/multipage/semantics.html#the-meta-element' },
      { label: 'MDN - 교차 출처 리소스 공유(CORS)', url: 'https://developer.mozilla.org/ko/docs/Web/HTTP/Guides/CORS' },
    ],
    related: ['json-formatter', 'image-resizer', 'character-counter'],
  },
];

export function getTool(slug: string): ToolMeta | undefined {
  return TOOLS.find((t) => t.slug === slug);
}
