import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { parseRawText, type ParsedData } from '@/utils/dataParser';
import { DataAnalysisEngine } from '@/utils/analysis/dataAnalysisEngine';
import { AnalyticsEngineManager } from '@/utils/analytics/analyticsEngineManager';
import { generateRecommendations } from '@/utils/dashboardRecommendations';
import { analyzeData } from '@/utils/parsers/dataAnalyzer';
import Papa from 'papaparse';
import { BarChart3, Gauge, Rocket, Settings2, Zap } from 'lucide-react';

interface Metrics {
  parseMs: number;
  analysisMs: number;
  usedHeapBefore?: number;
  usedHeapAfter?: number;
}

const supportsMemory = typeof (performance as any).memory !== 'undefined';

const RealAnalysisE2E: React.FC = () => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'baseline' | 'optimized'>('baseline');
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [summary, setSummary] = useState<any | null>(null);
  const [recs, setRecs] = useState<any[]>([]);

  const runStreamingParse = useCallback(async (csvText: string): Promise<ParsedData> => {
    return await new Promise((resolve, reject) => {
      let headers: string[] = [];
      const rows: Record<string, any>[] = [];

      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        worker: false,
        step: (row, parser) => {
          if (!headers.length) headers = Object.keys(row.data as any);
          rows.push(row.data as any);
        },
        complete: () => {
          try {
            // Build ParsedData using existing analyzer
            const parsed: ParsedData = analyzeData(headers, rows);
            resolve(parsed);
          } catch (e) {
            reject(e);
          }
        },
        error: (err) => reject(err)
      });
    });
  }, []);

  const runE2E = useCallback(async () => {
    setIsRunning(true);
    setMetrics(null);
    setResults([]);
    setSummary(null);
    setRecs([]);

    try {
      const memBefore = supportsMemory ? (performance as any).memory.usedJSHeapSize : undefined;

      const csvText = await (await fetch('/fixtures/analysis_e2e_sample.csv')).text();

      const t0 = performance.now();
      const parsed: ParsedData = mode === 'baseline' 
        ? await parseRawText(csvText, 'csv')
        : await runStreamingParse(csvText);
      const t1 = performance.now();

      const engine = new DataAnalysisEngine(parsed, { enableLogging: true });
      const a0 = performance.now();
      const baseResults = engine.runCompleteAnalysis();

      // Ensure analytics manager results are included
      const mgr = new AnalyticsEngineManager(true);
      const mgrResults = await mgr.runCompleteAnalysis(parsed);
      const combined = [...baseResults, ...mgrResults];
      const a1 = performance.now();

      const recsOut = generateRecommendations(parsed);
      const summaryOut = mgr.getAnalysisSummary(combined);

      const memAfter = supportsMemory ? (performance as any).memory.usedJSHeapSize : undefined;

      setResults(combined);
      setSummary(summaryOut);
      setRecs(recsOut);
      setMetrics({ parseMs: t1 - t0, analysisMs: a1 - a0, usedHeapBefore: memBefore, usedHeapAfter: memAfter });

      toast({
        title: 'Analysis E2E completed',
        description: `Parsed ${parsed.rowCount} rows, ${parsed.columns.length} columns. Mode: ${mode}.`,
      });
    } catch (error: any) {
      console.error('RealAnalysisE2E error:', error);
      toast({ title: 'E2E failed', description: error?.message || 'Unknown error', variant: 'destructive' });
    } finally {
      setIsRunning(false);
    }
  }, [mode, runStreamingParse, toast]);

  const applyOptimizations = useCallback(() => {
    setMode('optimized');
    toast({ title: 'I/O optimization enabled', description: 'Streaming CSV parser will be used for subsequent runs.' });
  }, [toast]);

  const resetOptimizations = useCallback(() => {
    setMode('baseline');
    toast({ title: 'Baseline mode', description: 'Using current system parser.' });
  }, [toast]);

  const usedHeapDelta = useMemo(() => {
    if (!metrics?.usedHeapBefore || !metrics?.usedHeapAfter) return undefined;
    return metrics.usedHeapAfter - metrics.usedHeapBefore;
  }, [metrics]);

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-primary" /> Real Analysis E2E Probe
        </CardTitle>
        <CardDescription>
          Runs a real end-to-end analysis on a sample dataset and reports performance, memory, and recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={runE2E} disabled={isRunning} size="lg">
            <Zap className="w-4 h-4 mr-2" /> {isRunning ? 'Running…' : 'Run Real E2E'}
          </Button>
          <Button variant="secondary" onClick={applyOptimizations} disabled={mode==='optimized' || isRunning}>
            <Settings2 className="w-4 h-4 mr-2" /> Apply I/O Optimization
          </Button>
          <Button variant="outline" onClick={resetOptimizations} disabled={mode==='baseline' || isRunning}>
            Reset to Baseline
          </Button>
          <Badge variant="outline">Mode: {mode}</Badge>
        </div>

        {isRunning && (
          <div className="space-y-2">
            <Progress value={35} className="w-full" />
            <p className="text-sm text-muted-foreground">Parsing and analyzing dataset…</p>
          </div>
        )}

        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Parse Time</p>
                  <p className="text-2xl font-bold">{metrics.parseMs.toFixed(1)} ms</p>
                </div>
                <Gauge className="w-5 h-5 text-primary" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Analysis Time</p>
                  <p className="text-2xl font-bold">{metrics.analysisMs.toFixed(1)} ms</p>
                </div>
                <Gauge className="w-5 h-5 text-primary" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Memory</p>
                {supportsMemory ? (
                  <div className="text-sm">
                    <div>Before: {Math.round((metrics.usedHeapBefore || 0)/1024/1024)} MB</div>
                    <div>After: {Math.round((metrics.usedHeapAfter || 0)/1024/1024)} MB</div>
                    {typeof usedHeapDelta !== 'undefined' && (
                      <div className={usedHeapDelta > 0 ? 'text-destructive' : 'text-green-600'}>
                        Δ {Math.round(usedHeapDelta/1024/1024)} MB
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm">Not supported in this browser</div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {summary && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Analysis Summary</CardTitle>
              <CardDescription>High-confidence: {summary.highConfidenceResults} / {summary.totalResults} • Quality: {summary.dataQuality}</CardDescription>
            </CardHeader>
          </Card>
        )}

        {recs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><BarChart3 className="w-5 h-5"/> Recommendations</CardTitle>
              <CardDescription>Suggested charts to understand the dataset better</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recs.map((r, idx) => (
                  <div key={idx} className="p-3 border rounded-md">
                    <div className="font-medium">{r.title}</div>
                    <div className="text-sm text-muted-foreground">{r.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Insights</CardTitle>
              <CardDescription>Showing first 6 insights from the combined engines</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc pl-5">
                {results.slice(0, 6).map((r, i) => (
                  <li key={i}>
                    <span className="font-medium">{r.title}:</span> <span className="text-muted-foreground">{r.insight}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default RealAnalysisE2E;
