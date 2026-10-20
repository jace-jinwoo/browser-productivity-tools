export interface Guide {
  id: string;
  title: string;
  summary: string;
  paragraphs: string[];
  date: string;
  toolSlug: string;
}

export const GUIDES: Guide[] = [
  {
    id: 'char-count-rules',
    title: '글자수 기준, 공백 포함·제외와 바이트는 어떻게 다를까',
    summary: '제출 양식의 글자수 제한을 확인할 때 알아 둘 공백·줄바꿈·바이트 기준 차이.',
    paragraphs: [
      '같은 글이라도 "공백 포함", "공백 제외", "바이트"에 따라 숫자가 달라집니다. 먼저 제출처가 어떤 기준을 쓰는지 안내문을 확인하세요.',
      '이 사이트의 글자수 세기는 공백 포함·제외 글자수, UTF-8 바이트, 줄 수를 구분해 보여 줍니다. UTF-8에서 한글 음절은 3바이트이므로 바이트 제한이 있는 입력란에서는 글자수보다 훨씬 빨리 한도에 도달할 수 있습니다. 줄바꿈 처리는 제출 사이트마다 다를 수 있어 최종 화면에서도 확인이 필요합니다.',
    ],
    date: '2026-10-20',
    toolSlug: 'character-counter',
  },
  {
    id: 'webp-basics',
    title: '이미지를 WebP로 바꾸기 전에 알아 둘 점',
    summary: '브라우저 변환의 원리, 품질 설정, 용량이 줄지 않을 수 있는 이유.',
    paragraphs: [
      '이 사이트의 이미지 도구는 파일을 서버에 올리지 않고 브라우저의 Canvas와 Blob으로 처리합니다. 그래서 가입이나 업로드 대기 없이 쓸 수 있지만, 매우 큰 이미지는 기기의 메모리에 따라 실패할 수 있어 파일 크기와 해상도 한도를 검사합니다.',
      'WebP로 바꿔도 항상 용량이 줄어드는 것은 아닙니다. 이미지 내용과 품질 값에 따라 달라지므로 변환 후 표시되는 결과 용량을 확인하고, 화질이 중요하면 미리보기를 보고 품질을 조정하세요.',
    ],
    date: '2026-10-20',
    toolSlug: 'image-to-webp',
  },
  {
    id: 'og-tags-check',
    title: 'OG 태그 점검 방법: URL 대신 HTML을 붙여 넣는 이유',
    summary: '브라우저의 CORS 제한과 Open Graph 필수 속성 확인 방법.',
    paragraphs: [
      '브라우저에서 다른 사이트의 HTML을 직접 불러오는 요청은 CORS 정책으로 막히는 경우가 많습니다. 서버가 없는 정적 사이트에서는 이를 우회하는 중계 기능을 제공할 수 없어, OG 태그 미리보기는 페이지 소스를 붙여 넣는 방식으로 동작합니다.',
      'Open Graph 프로토콜은 og:title, og:type, og:image, og:url 네 가지를 필수 속성으로 정의합니다. 미리보기 도구가 누락 여부를 알려 주지만, 실제 공유 카드는 서비스마다 다르게 표시되고 캐시될 수 있으니 각 서비스의 공유 디버거도 함께 확인하세요.',
    ],
    date: '2026-10-20',
    toolSlug: 'og-preview',
  },
];
