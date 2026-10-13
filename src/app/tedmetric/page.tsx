'use client';

import React, { useState } from 'react';
import { ArrowRightLeft, Sparkles, Terminal, Copy, Check, Info, ShieldCheck } from 'lucide-react';

export default function TedmetricPage() {
  const [inputVal, setInputVal] = useState<string>('3.1mi');
  const [resultText, setResultText] = useState<string>('');
  const [jsonResult, setJsonResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setIsError(false);

    try {
      const res = await fetch(`/api/convert?input=${encodeURIComponent(inputVal)}`);
      const contentType = res.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        const data = await res.json();
        setResultText(data.string || JSON.stringify(data));
        setJsonResult(JSON.stringify(data));
        setIsError(false);
      } else {
        const text = await res.text();
        setResultText(text);
        setJsonResult(JSON.stringify(text));
        setIsError(text.startsWith('invalid'));
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error occurred during conversion';
      setResultText(message);
      setJsonResult(JSON.stringify({ error: message }));
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyJson = () => {
    if (!jsonResult) return;
    navigator.clipboard.writeText(jsonResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickPresets = [
    { label: '4gal (Gallons to Liters)', val: '4gal' },
    { label: '10L (Liters to Gallons)', val: '10L' },
    { label: '1/2km (Fractional km)', val: '1/2km' },
    { label: '3.1mi (Decimal miles)', val: '3.1mi' },
    { label: '5.4/3lbs (Decimal fraction lbs)', val: '5.4/3lbs' },
    { label: 'kg (Default number 1)', val: 'kg' },
    { label: '32g (Invalid unit test)', val: '32g' },
    { label: '3/7.2/4kg (Invalid number test)', val: '3/7.2/4kg' },
    { label: '3/7.2/4kilomegagram (Invalid both)', val: '3/7.2/4kilomegagram' },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-black font-mono py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="border-4 border-black bg-white p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-[#ccff00] border-2 border-black px-2 py-0.5 text-xs font-black uppercase tracking-wider">
              FCC Quality Assurance
            </span>
            <span className="text-xs text-neutral-600 font-semibold">Endpoint: /api/convert</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight flex items-center gap-3">
            <ArrowRightLeft className="w-8 h-8 sm:w-10 h-10 text-black stroke-[2.5]" />
            Metric/Imperial Converter
          </h1>
          <p className="mt-2 text-sm sm:text-base text-neutral-700">
            Bidirectional unit converter between metric and imperial systems with fraction handling, 5-decimal precision, and full API compliance.
          </p>
        </header>

        {/* Example Usage & Return */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3">
            <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2 border-b-2 border-black pb-2">
              <Terminal className="w-5 h-5" />
              Example Usage
            </h3>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="p-2 bg-[#f5f5f0] border-2 border-black font-semibold">
                <code>/api/convert?input=4gal</code>
              </div>
              <div className="p-2 bg-[#f5f5f0] border-2 border-black font-semibold">
                <code>/api/convert?input=1/2km</code>
              </div>
              <div className="p-2 bg-[#f5f5f0] border-2 border-black font-semibold">
                <code>/api/convert?input=5.4/3lbs</code>
              </div>
              <div className="p-2 bg-[#f5f5f0] border-2 border-black font-semibold">
                <code>/api/convert?input=kg</code>
              </div>
            </div>
          </section>

          <section className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3">
            <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2 border-b-2 border-black pb-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Example Return
            </h3>
            <div className="p-3 bg-neutral-900 text-neutral-100 border-2 border-black text-xs sm:text-sm rounded-none overflow-x-auto">
              <code>{`{ initNum: 3.1, initUnit: 'mi', returnNum: 4.98895, returnUnit: 'km', string: '3.1 miles converts to 4.98895 kilometers' }`}</code>
            </div>
            <div className="text-xs text-neutral-600 space-y-1">
              <p>• gal ↔ L (factor: 3.78541)</p>
              <p>• lbs ↔ kg (factor: 0.453592)</p>
              <p>• mi ↔ km (factor: 1.60934)</p>
            </div>
          </section>
        </div>

        {/* Front-End Interactive Form */}
        <section className="border-4 border-black bg-white p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div id="testui" className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-3">
              <h3 className="text-xl font-black uppercase tracking-tight">Front-End Interactive Tester</h3>
              <span className="text-xs bg-black text-white px-2 py-0.5 font-bold">Standard FCC Form</span>
            </div>

            {/* Quick Test Presets */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase text-neutral-600">Quick Test Cases:</span>
              <div className="flex flex-wrap gap-2">
                {quickPresets.map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => {
                      setInputVal(preset.val);
                    }}
                    className={`text-xs px-2.5 py-1 border-2 border-black transition-all cursor-pointer font-bold ${
                      inputVal === preset.val
                        ? 'bg-[#ccff00] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-white hover:bg-neutral-100'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversion Form */}
            <form id="convertForm" onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-stretch">
              <div className="flex-1">
                <label htmlFor="convertField" className="sr-only">Input conversion value</label>
                <input
                  type="text"
                  id="convertField"
                  name="input"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="3.1mi"
                  className="w-full px-4 py-3 bg-[#f5f5f0] border-3 border-black text-black font-mono text-base font-bold focus:outline-none focus:bg-white focus:ring-2 focus:ring-black"
                />
              </div>
              <input
                id="convert"
                type="submit"
                value={isLoading ? 'Converting...' : 'Convert!'}
                disabled={isLoading}
                className="px-6 py-3 bg-[#ccff00] hover:bg-[#b8e600] active:translate-x-0.5 active:translate-y-0.5 text-black border-3 border-black font-black uppercase text-sm sm:text-base cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform"
              />
            </form>

            {/* Result Displays */}
            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">Human-Readable Result:</span>
                <div className={`p-4 border-3 border-black min-h-[52px] flex items-center ${
                  isError ? 'bg-red-50 text-red-700' : 'bg-[#e6ffe6] text-black'
                }`}>
                  <p id="result" className="font-bold text-sm sm:text-base">
                    {resultText || <span className="text-neutral-400 italic">Submit conversion or select a preset above</span>}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">JSON Payload:</span>
                  {jsonResult && (
                    <button
                      type="button"
                      onClick={handleCopyJson}
                      className="text-xs flex items-center gap-1 font-bold text-neutral-600 hover:text-black"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied' : 'Copy JSON'}
                    </button>
                  )}
                </div>
                <div className="p-4 bg-neutral-900 text-[#ccff00] border-3 border-black min-h-[52px] flex items-center overflow-x-auto">
                  <code id="jsonResult" className="text-xs sm:text-sm font-mono whitespace-pre-wrap break-all">
                    {jsonResult || <span className="text-neutral-500 italic">&#47;&#47; JSON output will appear here</span>}
                  </code>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Verification Matrix & Rules */}
        <section className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
          <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2 border-b-2 border-black pb-2">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            Conversion Specifications & Rules
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-[#f5f5f0] border-2 border-black space-y-1">
              <span className="font-bold block uppercase">Gallons ↔ Liters</span>
              <p className="text-neutral-700">1 gal = 3.78541 L</p>
              <p className="text-neutral-700">Liters is formatted with capital &apos;L&apos;, gallons as lowercase &apos;gal&apos;.</p>
            </div>
            <div className="p-3 bg-[#f5f5f0] border-2 border-black space-y-1">
              <span className="font-bold block uppercase">Pounds ↔ Kilograms</span>
              <p className="text-neutral-700">1 lbs = 0.453592 kg</p>
              <p className="text-neutral-700">Rounded to 5 decimal places precision.</p>
            </div>
            <div className="p-3 bg-[#f5f5f0] border-2 border-black space-y-1">
              <span className="font-bold block uppercase">Miles ↔ Kilometers</span>
              <p className="text-neutral-700">1 mi = 1.60934 km</p>
              <p className="text-neutral-700">Supports whole, decimal, and fractional inputs (e.g., 5.4/3).</p>
            </div>
          </div>
          <div className="p-3 bg-neutral-100 border-2 border-black text-xs space-y-1 flex items-start gap-2">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-neutral-600" />
            <div>
              <p className="font-bold">Automated Test Execution:</p>
              <p className="text-neutral-700">
                Run <code className="bg-white px-1 border border-black font-bold">npm run test</code> in the console to execute all 16 Unit Tests and 5 Functional Tests via Mocha & Chai TDD suite.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
