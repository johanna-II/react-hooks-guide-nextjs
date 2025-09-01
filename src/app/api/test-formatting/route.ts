import { NextRequest, NextResponse } from 'next/server';
import { capitalizeEnglishSentences } from '@/utils/text-formatting';

// 테스트용 엔드포인트 - 띄어쓰기 수정 기능 확인
export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const processed = capitalizeEnglishSentences(text);
    
    return NextResponse.json({
      original: text,
      processed: processed,
      changes: text !== processed
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 테스트 케이스 제공
export async function GET() {
  const testCases = [
    'buttonre-renders the component',
    'Clicking the Count buttonre-renders only the parent component',
    'the buttonclicked event fires',
    'componentre-renders twice',
    'propsdon\'t change',
    'click the<span>button</span>now',
    'Clicking the Count buttonre-renders only the parent component, while clicking the Expensive buttonre-renders both the parent and child components. React. Memo prevents unnecessary calculations by reusing previous render results if props don\'t change.',
    'Actions in React 19 makes it possible to use async functions in transitions. Automatically manage pending status, error handling, and optimistic updates.',
    'The new use() Hook allows you to read Promises directly.',
    'makesit possible to handle stateupdates efficiently',
    'functionsin React can be optimized with useCallback',
    'Step one is installation, step two is configuration',
    'transitions.Automatically manage state',
    'Form handling is much simpler &lt;strong&gt;with useActionState and&lt;/strong&gt; &lt;strong&gt;Form Actions&lt;/strong&gt;',
  ];

  const results = testCases.map(test => ({
    original: test,
    processed: capitalizeEnglishSentences(test),
  }));

  return NextResponse.json({ testCases: results });
}
