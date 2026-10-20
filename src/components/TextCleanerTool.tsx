'use client';

import { useDeferredValue, useId, useMemo, useState } from 'react';
import CopyButton from './CopyButton';
import { analyzeText } from '@/lib/text';
import { cleanText, DEFAULT_CLEAN_OPTIONS, type CleanOptions } from '@/lib/textClean';

const OPTION_LABELS: { key: keyof CleanOptions; label: string }[] = [
  { key: 'normalizeNewlines', label: '줄바꿈 통일 (CRLF/CR → LF)' },
  { key: 'nbspToSpace', label: '줄바꿈 없는 공백(NBSP)을 일반 공백으로' },
  { key: 'tabsToSpace', label: '탭을 공백 1칸으로' },
  { key: 'removeInvisible', label: '투명 문자 제거 (U+200B, U+2060, U+FEFF)' },
  { key: 'collapseSpaces', label: '연속 공백을 1칸으로' },
  { key: 'trimLines', label: '각 줄 앞뒤 공백 제거' },
  { key: 'collapseBlankLines', label: '연속 빈 줄을 1줄로' },
  { key: 'removeBlankLines', label: '모든 빈 줄 제거' },
  { key: 'joinLines', label: '줄바꿈을 공백으로 바꿔 한 줄로 합치기' },
  { key: 'trimAll', label: '전체 앞뒤 공백·줄바꿈 제거' },
];

export default function TextCleanerTool() {
  const uid = useId();
  const [text, setText] = useState('');
  const [opts, setOpts] = useState<CleanOptions>(DEFAULT_CLEAN_OPTIONS);
  const deferred = useDeferredValue(text);
  const pending = deferred !== text;
  const output = useMemo(() => cleanText(deferred, opts), [deferred, opts]);
  const before = useMemo(() => analyzeText(deferred), [deferred]);
  const after = useMemo(() => analyzeText(output), [output]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <label htmlFor={`${uid}-in`} className="mb-1 block text-sm font-medium text-gray-700">
        정리할 텍스트
      </label>
      <textarea
        id={`${uid}-in`}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        spellCheck={false}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-200"
      />
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" onClick={() => setText('  안녕   하세요  \n\n\n\n 반갑습니다\t\t! ')} className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">
          예제 불러오기
        </button>
        <button type="button" onClick={() => setText('')} className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">
          지우기
        </button>
      </div>

      <fieldset className="mt-4">
        <legend className="mb-2 text-sm font-medium text-gray-700">정리 옵션</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {OPTION_LABELS.map(({ key, label }) => (
            <label key={key} className="flex items-start gap-2 text-sm text-gray-800">
              <input
                type="checkbox"
                checked={opts[key]}
                onChange={(e) => setOpts((o) => ({ ...o, [key]: e.target.checked }))}
                className="mt-0.5 h-4 w-4 accent-brand-600"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <p className="mt-4 min-h-[1.25rem] text-sm text-gray-500" aria-live="polite">
        {pending ? '처리 중…' : `글자수(공백 포함) ${before.chars.toLocaleString('ko-KR')}자 → ${after.chars.toLocaleString('ko-KR')}자, ${before.lines}줄 → ${after.lines}줄`}
      </p>
      <label htmlFor={`${uid}-out`} className="mb-1 block text-sm font-medium text-gray-700">
        결과
      </label>
      <textarea id={`${uid}-out`} value={output} readOnly rows={8} spellCheck={false} className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-base" />
      <div className="mt-2">
        <CopyButton text={output} label="결과 복사" />
      </div>
      <p className="mt-3 text-xs text-gray-500">공백과 줄바꿈만 정리하며 맞춤법·띄어쓰기는 교정하지 않습니다. 입력한 글은 서버로 전송되지 않습니다.</p>
    </div>
  );
}
