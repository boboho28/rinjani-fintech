import React, { useState } from 'react';
import { RefreshCw, ExternalLink, Activity, BarChart2, Layers } from 'lucide-react';

interface AdvancedChartProps {
  symbol: string;
  height?: number;
  theme?: 'dark' | 'light';
  interval?: string;
}

export function normalizeSymbol(sym: string): string {
  if (!sym) return 'OANDA:XAUUSD';
  const clean = sym.trim();
  
  if (clean.includes('XAUUSD') || clean.includes('XAU') || clean.includes('GOLD') || clean.includes('Emas')) {
    if (clean.includes('COMEX') || clean.includes('GC1!')) return 'COMEX:GC1!';
    if (clean.includes('TVC')) return 'TVC:GOLD';
    if (clean.includes('FOREXCOM')) return 'FOREXCOM:XAUUSD';
    return 'OANDA:XAUUSD';
  }
  
  if (!clean.includes(':')) {
    if (clean.endsWith('USDT')) return `BINANCE:${clean}`;
    if (['BTC', 'ETH', 'SOL', 'XRP', 'BNB', 'DOGE'].includes(clean.toUpperCase())) return `BINANCE:${clean.toUpperCase()}USDT`;
    if (['BBCA', 'BBRI', 'BMRI', 'TLKM', 'ASII', 'GOTO'].includes(clean.toUpperCase())) return `IDX:${clean.toUpperCase()}`;
    return `OANDA:${clean}`;
  }
  
  return clean;
}

export function TradingViewAdvancedChart({
  symbol: initialSymbol,
  height = 480,
  theme = 'dark',
  interval: initialInterval = 'D',
}: AdvancedChartProps) {
  const [activeSymbol, setActiveSymbol] = useState<string>(normalizeSymbol(initialSymbol));
  const [activeInterval, setActiveInterval] = useState<string>(initialInterval);
  const [chartStyle, setChartStyle] = useState<string>('1'); // 1: Candle, 2: Line, 3: Area, 8: Heikin Ashi
  const [reloadKey, setReloadKey] = useState<number>(0);
  const [useSecondaryMirror, setUseSecondaryMirror] = useState<boolean>(false);

  // Sync if initialSymbol changes externally
  React.useEffect(() => {
    setActiveSymbol(normalizeSymbol(initialSymbol));
  }, [initialSymbol]);

  const handleRefresh = () => {
    setReloadKey((prev) => prev + 1);
  };

  // Build high-performance, resilient TradingView Widget Iframe URLs
  const primaryIframeUrl = `https://s.tradingview.com/widgetembed/?frameElementId=tv_frame_${reloadKey}&symbol=${encodeURIComponent(
    activeSymbol
  )}&interval=${activeInterval}&symboledit=1&saveimage=1&toolbarbg=0c0717&theme=${theme}&style=${chartStyle}&timezone=Asia%2FJakarta&studies=%5B%5D&locale=id&utm_source=rinjani&utm_medium=widget&utm_campaign=advanced-chart&hide_side_toolbar=0&allow_symbol_change=1&details=1&calendar=0&hotlist=0`;

  const secondaryIframeUrl = `https://www.tradingview-widget.com/embed-widget/advanced-chart/?locale=id&symbol=${encodeURIComponent(
    activeSymbol
  )}&interval=${activeInterval}&theme=${theme}&style=${chartStyle}&timezone=Asia%2FJakarta`;

  const currentIframeSrc = useSecondaryMirror ? secondaryIframeUrl : primaryIframeUrl;

  const quickPairs = [
    { label: 'XAU/USD Spot', value: 'OANDA:XAUUSD' },
    { label: 'Gold Futures', value: 'COMEX:GC1!' },
    { label: 'TVC Gold', value: 'TVC:GOLD' },
    { label: 'BTC/USDT', value: 'BINANCE:BTCUSDT' },
    { label: 'BBCA (IDX)', value: 'IDX:BBCA' },
  ];

  const timeframes = [
    { label: '1m', value: '1' },
    { label: '5m', value: '5' },
    { label: '15m', value: '15' },
    { label: '1h', value: '60' },
    { label: '4h', value: '240' },
    { label: '1D', value: 'D' },
    { label: '1W', value: 'W' },
  ];

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-purple-500/35 bg-[#0b0616] shadow-[0_0_25px_rgba(168,85,247,0.15)] flex flex-col">
      
      {/* Top Toolbar Controls */}
      <div className="bg-[#120a24] border-b border-purple-500/25 px-3 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Pair Badges & Symbol Selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1.5 mr-1">
            <Activity className="w-4 h-4 text-fuchsia-400 animate-pulse" />
            <span className="font-orbitron font-black text-xs text-purple-200 uppercase tracking-wider">
              {activeSymbol}
            </span>
          </div>

          <div className="h-4 w-[1px] bg-purple-500/30 hidden sm:block mx-1" />

          {/* Quick Pairs */}
          <div className="flex items-center gap-1 flex-wrap">
            {quickPairs.map((p) => (
              <button
                key={p.value}
                onClick={() => setActiveSymbol(p.value)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-orbitron font-bold transition-all cursor-pointer ${
                  activeSymbol === p.value
                    ? 'bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-600 text-white shadow-[0_0_8px_rgba(217,70,239,0.4)]'
                    : 'bg-[#0a0514] text-purple-200/70 hover:text-white border border-purple-500/20 hover:border-purple-400/40'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Timeframe & Controls */}
        <div className="flex items-center gap-2 flex-wrap ml-auto">
          
          {/* Timeframe Buttons */}
          <div className="flex items-center gap-0.5 bg-[#090412] p-0.5 rounded-xl border border-purple-500/20">
            {timeframes.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setActiveInterval(tf.value)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-orbitron font-bold transition-all cursor-pointer ${
                  activeInterval === tf.value
                    ? 'bg-purple-500/40 text-purple-100 border border-purple-400'
                    : 'text-purple-300/60 hover:text-purple-100'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          {/* Chart Style Toggle */}
          <div className="flex items-center gap-1 bg-[#090412] p-0.5 rounded-xl border border-purple-500/20">
            <button
              onClick={() => setChartStyle('1')}
              title="Lilim (Candlesticks)"
              className={`p-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                chartStyle === '1' ? 'bg-fuchsia-500/40 text-fuchsia-200' : 'text-purple-300/60'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartStyle('3')}
              title="Area Chart"
              className={`p-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                chartStyle === '3' ? 'bg-fuchsia-500/40 text-fuchsia-200' : 'text-purple-300/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mirror Toggle */}
          <button
            onClick={() => setUseSecondaryMirror((prev) => !prev)}
            title="Ganti Mirror Server TradingView"
            className={`px-2 py-1 rounded-xl text-[10px] font-orbitron font-bold border transition-all cursor-pointer ${
              useSecondaryMirror
                ? 'bg-amber-500/30 text-amber-200 border-amber-400'
                : 'bg-[#090412] text-purple-200/70 border-purple-500/20 hover:text-white'
            }`}
          >
            {useSecondaryMirror ? 'Mirror 2' : 'Mirror 1'}
          </button>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            title="Muat Ulang Chart"
            className="p-1.5 rounded-xl bg-[#090412] text-purple-300/80 hover:text-white border border-purple-500/20 hover:border-purple-400 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* External Link */}
          <a
            href={`https://www.tradingview.com/chart/?symbol=${encodeURIComponent(activeSymbol)}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Buka Langsung di TradingView"
            className="p-1.5 rounded-xl bg-purple-600/30 text-purple-200 hover:text-white border border-purple-500/40 hover:bg-purple-600/50 transition-all cursor-pointer flex items-center gap-1 text-[10px] font-orbitron font-bold"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">TradingView</span>
          </a>

        </div>

      </div>

      {/* Main TradingView Live Interactive Iframe Canvas */}
      <div className="w-full relative bg-[#090412]" style={{ height: `${height}px` }}>
        <iframe
          key={`${activeSymbol}_${activeInterval}_${chartStyle}_${reloadKey}_${useSecondaryMirror}`}
          title={`TradingView Chart ${activeSymbol}`}
          src={currentIframeSrc}
          className="w-full h-full border-0 rounded-b-2xl"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Sub-Footer Ticker Info */}
      <div className="bg-[#0b0517] border-t border-purple-500/20 px-3 py-1.5 flex items-center justify-between text-[10px] font-mono text-purple-300/70">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          Live Real-time Feed: <strong className="text-purple-100">{activeSymbol}</strong>
        </span>
        <span className="hidden sm:inline text-purple-400/80">
          Gunakan tombol mouse / pinch untuk zoom & geser grafik
        </span>
      </div>

    </div>
  );
}

interface MiniChartProps {
  symbol: string;
  height?: number;
}

export function TradingViewMiniChart({ symbol, height = 220 }: MiniChartProps) {
  const cleanSym = normalizeSymbol(symbol);
  const miniUrl = `https://s.tradingview.com/embed-widget/mini-symbol-overview/?locale=id&symbol=${encodeURIComponent(
    cleanSym
  )}&dateRange=12M&colorTheme=dark&trendLineColor=rgba(168,85,247,1)&underLineColor=rgba(168,85,247,0.15)&isTransparent=true&autosize=true`;

  return (
    <div
      className="w-full rounded-xl overflow-hidden border border-purple-500/30 bg-[#0c0718] relative shadow-[0_0_12px_rgba(168,85,247,0.12)]"
      style={{ height: `${height}px` }}
    >
      <iframe
        title={`Mini Chart ${cleanSym}`}
        src={miniUrl}
        className="w-full h-full border-0"
        allowFullScreen
      />
    </div>
  );
}
