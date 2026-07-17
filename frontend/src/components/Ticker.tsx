const TICKER_ITEMS = [
  { symbol: "MERN", delta: "+" },
  { symbol: "NEXT.JS", delta: "+" },
  { symbol: "TYPESCRIPT", delta: "+" },
  { symbol: "MONGODB", delta: "+" },
  { symbol: "AWS", delta: "+" },
  { symbol: "DOCKER", delta: "+" },
  { symbol: "KUBERNETES", delta: "+" },
  { symbol: "JWT AUTH", delta: "+" },
  { symbol: "REST APIS", delta: "+" },
  { symbol: "LEETCODE 200+", delta: "+" },
  { symbol: "PRISMA", delta: "+" },
  { symbol: "GITHUB ACTIONS", delta: "+" },
];

export default function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="w-full overflow-hidden border-y border-panelBorder bg-panel/60 py-2.5">
      <div className="flex w-max animate-ticker gap-8 font-mono text-xs tracking-wide text-muted">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-signal">▲</span>
            <span>{item.symbol}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
