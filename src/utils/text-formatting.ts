/**
 * 일반적인 영어 띄어쓰기 오류 패턴 수정
 */
function fixCommonSpacingErrors(text: string): string {
  const commonPatterns = [
    { pattern: /React\.\s*Memo/g, replacement: 'React.memo' },
    { pattern: /React\.\s*Fragment/g, replacement: 'React.Fragment' },
    { pattern: /React\.\s*Component/g, replacement: 'React.Component' },
    { pattern: /React\.\s*PureComponent/g, replacement: 'React.PureComponent' },

    { pattern: /button(re-?renders?|clicked?|press|clicks?)/gi, replacement: 'button $1' },
    { pattern: /clicking?the/gi, replacement: 'clicking the' },
    { pattern: /click(the|on|here)/gi, replacement: 'click $1' },
    { pattern: /the(button|component|element|function)/gi, replacement: 'the $1' },

    {
      pattern: /component(re-?renders?|updated?|mounted?|unmounted?)/gi,
      replacement: 'component $1',
    },
    { pattern: /props?(don't|didn't|changed?|updated?|remain)/gi, replacement: 'props $1' },
    { pattern: /state(changed?|updated?|management|updates?)/gi, replacement: 'state $1' },
    { pattern: /([a-z])in\s*react/gi, replacement: '$1 in React' },
    { pattern: /actions?in\s*react/gi, replacement: 'Actions in React' },
    { pattern: /hooks?in\s*react/gi, replacement: 'Hooks in React' },
    { pattern: /use([A-Z][a-z]+)/g, replacement: 'use$1' },

    { pattern: /function(calls?|executed?|returns?|invoked?|in)/gi, replacement: 'function $1' },
    { pattern: /functions?in/gi, replacement: 'functions in' },
    { pattern: /value(changed?|updated?|returned?|stored?)/gi, replacement: 'value $1' },
    { pattern: /render(count|times?|cycle|process)/gi, replacement: 'render $1' },
    { pattern: /memory(leak|usage|allocation)/gi, replacement: 'memory $1' },
    { pattern: /performance(optimization|issue|improvement)/gi, replacement: 'performance $1' },
    { pattern: /async(functions?|await|operations?)/gi, replacement: 'async $1' },
    { pattern: /error(handling|handler|boundary)/gi, replacement: 'error $1' },
    { pattern: /optimistic(updates?|ui)/gi, replacement: 'optimistic $1' },

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

    { pattern: /([a-z])(<\/span>)([a-z])/gi, replacement: '$1$2 $3' },
    { pattern: /([a-z])(<span[^>]*>)([a-z])/gi, replacement: '$1 $2$3' },

    { pattern: /([a-z])\.([A-Z])/g, replacement: '$1. $2' }, // transitions.Automatically → transitions. Automatically
    { pattern: /([.!?])([A-Z])/g, replacement: '$1 $2' },
    { pattern: /([a-z])\.(\w+ly\s)/g, replacement: '$1. $2' },

    { pattern: /hook(allows?|enables?|provides?|can|that|which)/gi, replacement: 'Hook $1' },
    { pattern: /([)!])([a-zA-Z])/g, replacement: '$1 $2' }, // use() Hookallows → use() Hook allows
    { pattern: /the\s*new\s*use\(\)\s*hook/gi, replacement: 'the new use() Hook' },

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
  if (!text || text.length === 0) return text;

  text = decodeHTMLEntities(text);

  const htmlTagRegex = /<[^>]*>/g;
  const htmlTags: string[] = [];
  let processedText = text;

  processedText = processedText.replace(htmlTagRegex, (match) => {
    htmlTags.push(match);
    return `__HTML_TAG_${htmlTags.length - 1}__`;
  });

  const sentenceDelimiters = /([.!?:;]+\s*)/;

  const parts = processedText.split(sentenceDelimiters);

  let result = '';
  let isNewSentence = true;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    if (sentenceDelimiters.test(part)) {
      result += part;
      isNewSentence = true;
    } else if (part.trim()) {
      let sentence = part;

      if (isNewSentence) {
        const leadingWhitespace = sentence.match(/^\s*/)?.[0] || '';
        const trimmedSentence = sentence.trim();

        if (trimmedSentence.length > 0) {
          const firstWord = trimmedSentence.split(/\s+/)[0];

          if (!/^[a-z]/.test(firstWord)) {
            result += sentence;
          } else {
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

  result = result.replace(/__HTML_TAG_(\d+)__/g, (match, index) => {
    return htmlTags[parseInt(index)] || match;
  });

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
