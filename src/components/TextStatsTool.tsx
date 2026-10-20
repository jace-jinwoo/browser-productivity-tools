'use client';

import { useDeferredValue, useId, useMemo, useState } from 'react';
import { analyzeText } from '@/lib/text';

const fmt = (n: number) => n.toLocaleString('ko-KR');

function Stat({ label, value, unit, primary, note }: { label: string; value: string; unit: string; primary?: boolean; note?: string }) {
  return (
    <div className={`rounded-lg border p-3 ${primary ? 'border-brand-600 bg-brand-50' : 'border-gray-200 bg-white'}`}>
      <dt className="text-sm text-gray-600">{label}</dt>
      <dd className="mt-1 text-2xl font-bold text-gray-900">
        {value}
        <span className="ml-1 text-sm font-normal text-gray-500">{unit}</span>
      </dd>
      {note && <p className="mt-1 text-xs text-gray-500">{note}</p>}
    </div>
  );
}

export default function TextStatsTool({ mode }: { mode: 'char' | 'word' }) {
  const uid = useId();
  const [text, setText] = useState('');
  const deferred = useDeferredValue(text);
  const pending = deferred !== text;
  const s = useMemo(() => analyzeText(deferred), [deferred]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <label htmlFor={`${uid}-in`} className="mb-1 block text-sm font-medium text-gray-700">
        텍스트 입력
      </label>
      <textarea
        id={`${uid}-in`}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        spellCheck={false}
        placeholder="여기에 글을 입력하거나 붙여 넣으세요."
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-200"
      />
      <div className="mt-2 flex items-center gap-3">
        <button type="button" onClick={() => setText('')} className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">
          지우기
        </button>
        <p className="text-sm text-gray-500" aria-live="polite">{pending ? '계산 중…' : '입력한 글은 서버로 전송되지 않습니다.'}</p>
      </div>

      <h3 className="mt-5 text-base font-semibold text-gray-900">결과</h3>
      {mode === 'char' ? (
        <dl className="mt-2 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="공백 포함" value={fmt(s.chars)} unit="자" primary />
          <Stat label="공백 제외" value={fmt(s.charsNoSpace)} unit="자" primary />
          <Stat label="UTF-8 바이트" value={fmt(s.utf8Bytes)} unit="byte" />
          <Stat label="줄 수" value={fmt(s.lines)} unit="줄" note={`내용 있는 줄 ${fmt(s.nonEmptyLines)}줄`} />
        </dl>
      ) : (
        <dl className="mt-2 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="단어(어절)" value={fmt(s.words)} unit="개" primary note="공백으로 구분한 덩어리" />
          <Stat label="문단" value={fmt(s.paragraphs)} unit="개" note="빈 줄로 구분" />
          <Stat label="줄 수" value={fmt(s.lines)} unit="줄" note={`내용 있는 줄 ${fmt(s.nonEmptyLines)}줄`} />
          <Stat label="글자(공백 포함)" value={fmt(s.chars)} unit="자" />
        </dl>
      )}
      {mode === 'char' && (
        <p className="mt-3 text-xs text-gray-500">
          글자수는 유니코드 코드 포인트 기준입니다(이모지 1개 = 1자).
          {s.graphemes !== null && s.graphemes !== s.chars ? ` 사용자 인지 글자(grapheme) 기준은 ${fmt(s.graphemes)}자입니다.` : ''} 줄바꿈은 공백 포함 글자수에 1자로 들어가고 공백 제외에서는 빠집니다.
        </p>
      )}
    </div>
  );
}
