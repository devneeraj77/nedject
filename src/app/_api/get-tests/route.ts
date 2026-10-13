import { NextRequest, NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const runner = require('../../../../test-runner');

export const dynamic = 'force-dynamic';

interface TestCaseReport {
  title: string;
  context: string;
  state: string;
  assertions: Array<{ method: string; args: string[] }>;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || undefined;
  const n = searchParams.get('n') ? parseInt(searchParams.get('n')!, 10) : undefined;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (process.env.NODE_ENV !== 'test') {
    return NextResponse.json({ status: 'unavailable' }, { headers: corsHeaders });
  }

  const getFiltered = (tests: TestCaseReport[]) => {
    let out;
    switch (type) {
      case 'unit':
        out = tests.filter((t) => t.context && t.context.match('Unit Tests'));
        break;
      case 'functional':
        out = tests.filter((t) => t.context && t.context.match('Functional Tests') && !t.title.match('#example'));
        break;
      default:
        out = tests;
    }
    if (n !== undefined) {
      return out[n] || out;
    }
    return out;
  };

  if (runner.report && runner.report.length > 0) {
    return NextResponse.json(getFiltered(runner.report), { headers: corsHeaders });
  }

  return new Promise<NextResponse>((resolve) => {
    runner.on('done', (report: TestCaseReport[]) => {
      resolve(NextResponse.json(getFiltered(report), { headers: corsHeaders }));
    });
    try {
      runner.run();
    } catch {
      resolve(NextResponse.json({ status: 'unavailable' }, { headers: corsHeaders }));
    }
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
