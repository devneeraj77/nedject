import { NextRequest, NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const ConvertHandler = require('../../../../controllers/convertHandler.js');

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get('input') ?? '';

  const convertHandler = new ConvertHandler();
  const initNum = convertHandler.getNum(input);
  const initUnit = convertHandler.getUnit(input);

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (initNum === undefined && initUnit === undefined) {
    return new NextResponse('invalid number and unit', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        ...corsHeaders,
      },
    });
  }

  if (initNum === undefined) {
    return new NextResponse('invalid number', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        ...corsHeaders,
      },
    });
  }

  if (initUnit === undefined) {
    return new NextResponse('invalid unit', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        ...corsHeaders,
      },
    });
  }

  const returnNum = convertHandler.convert(initNum, initUnit);
  const returnUnit = convertHandler.getReturnUnit(initUnit);
  const toString = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);

  return NextResponse.json(
    {
      initNum,
      initUnit,
      returnNum,
      returnUnit,
      string: toString,
    },
    {
      status: 200,
      headers: corsHeaders,
    }
  );
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
