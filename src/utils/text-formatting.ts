/**
 * 일반적인 영어 띄어쓰기 오류 패턴 수정
 */
function fixCommonSpacingErrors(text: string): string {
  // buttonre-renders → button re-renders 같은 패턴 수정
  const commonPatterns = [
    // React 고유명사 대소문자 수정 (React.memo 등)
    { pattern: /React\.\s*Memo/g, replacement: 'React.memo' },
    { pattern: /React\.\s*Fragment/g, replacement: 'React.Fragment' },
    { pattern: /React\.\s*Component/g, replacement: 'React.Component' },
    { pattern: /React\.\s*PureComponent/g, replacement: 'React.PureComponent' },

    // 일반적인 UI 요소와 동작
    { pattern: /button(re-?renders?|clicked?|press|clicks?)/gi, replacement: 'button $1' },
    { pattern: /clicking?the/gi, replacement: 'clicking the' },
    { pattern: /click(the|on|here)/gi, replacement: 'click $1' },
    { pattern: /the(button|component|element|function)/gi, replacement: 'the $1' },

    // React 관련 용어
    {
      pattern: /component(re-?renders?|updated?|mounted?|unmounted?)/gi,
      replacement: 'component $1',
    },
    { pattern: /props?(don't|didn't|changed?|updated?|remain)/gi, replacement: 'props $1' },
    { pattern: /state(changed?|updated?|management|updates?)/gi, replacement: 'state $1' },
    { pattern: /([a-z])in\s*react/gi, replacement: '$1 in React' }, // 더 일반적인 패턴
    { pattern: /actions?in\s*react/gi, replacement: 'Actions in React' },
    { pattern: /hooks?in\s*react/gi, replacement: 'Hooks in React' },
    { pattern: /use([A-Z][a-z]+)/g, replacement: 'use$1' }, // useActionState 같은 hook 이름 보존

    // 일반적인 프로그래밍 용어
    { pattern: /function(calls?|executed?|returns?|invoked?|in)/gi, replacement: 'function $1' },
    { pattern: /functions?in/gi, replacement: 'functions in' },
    { pattern: /value(changed?|updated?|returned?|stored?)/gi, replacement: 'value $1' },
    { pattern: /render(count|times?|cycle|process)/gi, replacement: 'render $1' },
    { pattern: /memory(leak|usage|allocation)/gi, replacement: 'memory $1' },
    { pattern: /performance(optimization|issue|improvement)/gi, replacement: 'performance $1' },
    { pattern: /async(functions?|await|operations?)/gi, replacement: 'async $1' },
    { pattern: /error(handling|handler|boundary)/gi, replacement: 'error $1' },
    { pattern: /optimistic(updates?|ui)/gi, replacement: 'optimistic $1' },

    // 기타 일반적인 패턴
    { pattern: /only(the|when|if|after)/gi, replacement: 'only $1' },
    { pattern: /both(the|components?|parent|child)/gi, replacement: 'both $1' },
    { pattern: /while(clicking|rendering|processing)/gi, replacement: 'while $1' },
    { pattern: /makes?it/gi, replacement: 'makes it' },
    { pattern: /pending(status|state|request)/gi, replacement: 'pending $1' },
    { pattern: /manage(state|props|data)/gi, replacement: 'manage $1' },
    { pattern: /automatically(manage|update|handle)/gi, replacement: 'automatically $1' },
    { pattern: /transitions?in/gi, replacement: 'transitions in' },
    { pattern: /possible(to|for|with)/gi, replacement: 'possible $1' },
    { pattern: /state(updates?|changes?)/gi, replacement: 'state $1' }, // stateupdates → state updates
    { pattern: /handle(state|props|events?)/gi, replacement: 'handle $1' },

    // HTML 태그 주변 띄어쓰기 (보수적으로 처리)
    { pattern: /([a-z])(<\/span>)([a-z])/gi, replacement: '$1$2 $3' },
    { pattern: /([a-z])(<span[^>]*>)([a-z])/gi, replacement: '$1 $2$3' },

    // 문장 끝 마침표 후 띄어쓰기 부족 수정 (더 구체적인 패턴)
    { pattern: /([a-z])\.([A-Z])/g, replacement: '$1. $2' }, // transitions.Automatically → transitions. Automatically
    { pattern: /([.!?])([A-Z])/g, replacement: '$1 $2' },
    { pattern: /([a-z])\.(\w+ly\s)/g, replacement: '$1. $2' }, // specifically.Automatically 같은 패턴

    // Hook 관련 띄어쓰기
    { pattern: /hook(allows?|enables?|provides?|can|that|which)/gi, replacement: 'Hook $1' },
    { pattern: /([)!])([a-zA-Z])/g, replacement: '$1 $2' }, // use() Hookallows → use() Hook allows
    { pattern: /the\s*new\s*use\(\)\s*hook/gi, replacement: 'the new use() Hook' },

    // Step 번호 일관성 (Step one/two/three를 숫자로 변환)
    { pattern: /step\s+one/gi, replacement: 'Step 1' },
    { pattern: /step\s+two/gi, replacement: 'Step 2' },
    { pattern: /step\s+three/gi, replacement: 'Step 3' },
    { pattern: /step\s+four/gi, replacement: 'Step 4' },
    { pattern: /step\s+five/gi, replacement: 'Step 5' },
  ];

  let result = text;
  for (const { pattern, replacement } of commonPatterns) {
    result = result.replace(pattern, replacement);
  }

  // 중복 공백 제거
  result = result.replace(/\s+/g, ' ');

  return result;
}

/**
 * HTML 엔티티를 디코드하는 함수
 */
function decodeHTMLEntities(text: string): string {
  const entities: Record<string, string> = {
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' ',
  };

  return text.replace(/&[a-z]+;|&#\d+;/gi, (match) => entities[match] || match);
}

/**
 * 영어 텍스트의 문장 첫 글자를 대문자로 변환하고 띄어쓰기 오류 수정
 * 고유명사와 고유어는 제외하고 처리
 */
export function capitalizeEnglishSentences(text: string): string {
  // 이미 처리된 텍스트인지 확인 (성능 최적화)
  if (!text || text.length === 0) return text;

  // HTML 엔티티 디코드
  text = decodeHTMLEntities(text);

  // HTML 태그 보존을 위한 처리
  const htmlTagRegex = /<[^>]*>/g;
  const htmlTags: string[] = [];
  let processedText = text;

  // HTML 태그를 임시로 제거하고 저장
  processedText = processedText.replace(htmlTagRegex, (match) => {
    htmlTags.push(match);
    return `__HTML_TAG_${htmlTags.length - 1}__`;
  });

  // 문장 구분자 정의 (. ! ? : ; 등)
  const sentenceDelimiters = /([.!?:;]+\s*)/;

  // 문장 단위로 분리
  const parts = processedText.split(sentenceDelimiters);

  let result = '';
  let isNewSentence = true;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    if (sentenceDelimiters.test(part)) {
      // 구분자인 경우
      result += part;
      isNewSentence = true;
    } else if (part.trim()) {
      // 문장인 경우
      let sentence = part;

      if (isNewSentence) {
        // 문장의 시작 부분 찾기 (공백 제거)
        const leadingWhitespace = sentence.match(/^\s*/)?.[0] || '';
        const trimmedSentence = sentence.trim();

        if (trimmedSentence.length > 0) {
          // 첫 단어가 고유명사나 특수한 경우인지 확인
          const firstWord = trimmedSentence.split(/\s+/)[0];

          // 이미 대문자로 시작하거나, 숫자로 시작하거나, 특수문자로 시작하는 경우는 유지
          if (!/^[a-z]/.test(firstWord)) {
            result += sentence;
          } else {
            // 소문자로 시작하는 경우만 첫 글자를 대문자로 변환
            sentence =
              leadingWhitespace +
              trimmedSentence.charAt(0).toUpperCase() +
              trimmedSentence.slice(1);
            result += sentence;
          }
        } else {
          result += sentence;
        }

        isNewSentence = false;
      } else {
        result += sentence;
      }
    } else {
      result += part;
    }
  }

  // HTML 태그 복원
  result = result.replace(/__HTML_TAG_(\d+)__/g, (match, index) => {
    return htmlTags[parseInt(index)] || match;
  });

  // 띄어쓰기 오류 수정
  result = fixCommonSpacingErrors(result);

  return result;
}

/**
 * 배치 텍스트 처리
 */
export function capitalizeEnglishBatch(texts: string[]): string[] {
  return texts.map((text) => capitalizeEnglishSentences(text));
}

/**
 * 키-값 형태의 번역 결과 처리
 */
export function capitalizeEnglishTranslations(
  translations: Record<string, string>
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(translations)) {
    result[key] = capitalizeEnglishSentences(value);
  }

  return result;
}
