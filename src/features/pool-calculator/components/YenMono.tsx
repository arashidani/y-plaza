interface YenMonoProps {
  value: number;
  className?: string;
}

export function YenMono({ value, className }: YenMonoProps) {
  const parts = new Intl.NumberFormat("ja-JP", { 
    style: "currency", 
    currency: "JPY" 
  }).formatToParts(value);
  
  const currency = parts.find(p => p.type === "currency")?.value ?? "¥";
  const number = parts.filter(p => p.type !== "currency").map(p => p.value).join("");
  
  return (
    <span className={`text-right ${className || ""}`}>
      <span className="align-baseline">{currency}</span>
      <span className="font-mono tabular-nums">{number}</span>
    </span>
  );
}