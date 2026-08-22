import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle2, Info, AlertCircle, RotateCcw } from "lucide-react";
import { useApp } from "../lib/store";

/* ------------------------------- Logo ------------------------------- */

export function Logo({ dark = false, size = "md" }: { dark?: boolean; size?: "sm" | "md" | "lg" }) {
  const s = size === "sm" ? 30 : size === "lg" ? 46 : 38;
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width={s} height={s} viewBox="0 0 40 40" aria-hidden="true">
        <rect width="40" height="40" rx="11" fill={dark ? "#f1d997" : "#175745"} />
        <path
          d="M20 30c-5.6-1.5-8.8-5-8.8-11.2V11.5c3.1 0 6.3 1.2 8.8 3.7 2.5-2.5 5.7-3.7 8.8-3.7v7.3C28.8 25 25.6 28.5 20 30z"
          fill={dark ? "#175745" : "#f1d997"}
        />
        <path d="M20 15.2V30" stroke={dark ? "#f1d997" : "#175745"} strokeWidth="1.8" />
        <path d="M20 20.5c1.4-1.6 3-2.3 4.8-2.5M20 24c-1.4-1.6-3-2.3-4.8-2.5" stroke={dark ? "#f1d997" : "#175745"} strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <span className="leading-tight">
        <span className={`block font-display font-bold ${size === "sm" ? "text-sm" : "text-base"} ${dark ? "text-paper" : "text-pine-800"}`}>
          Clinique d'Éducation
        </span>
        <span className={`block text-[10px] uppercase tracking-[0.14em] font-semibold ${dark ? "text-marigold-300" : "text-pine-500"}`}>
          Innovation Pédagogique
        </span>
      </span>
    </span>
  );
}

/* ------------------------------- Boutons ------------------------------- */

type BtnVariant = "primary" | "secondary" | "ghost" | "danger" | "marigold";
export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; size?: "sm" | "md" | "lg" }) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine-600 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer";
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2.5 text-sm", lg: "px-6 py-3.5 text-[15px]" };
  const variants: Record<BtnVariant, string> = {
    primary: "bg-pine-700 text-paper hover:bg-pine-600 shadow-soft hover:shadow-lift hover:-translate-y-px",
    marigold: "bg-marigold-400 text-pine-950 hover:bg-marigold-300 shadow-soft hover:-translate-y-px",
    secondary: "bg-pine-100 text-pine-800 hover:bg-pine-200",
    ghost: "text-pine-700 hover:bg-pine-100/70",
    danger: "bg-coral-600 text-paper hover:bg-coral-500",
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

/* ------------------------------- Badges & tags ------------------------------- */

export function Badge({ bg, fg, children }: { bg: string; fg: string; children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap"
      style={{ backgroundColor: bg, color: fg }}
    >
      {children}
    </span>
  );
}

export function StatusDot({ color }: { color: string }) {
  return <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />;
}

/* ------------------------------- Avatar ------------------------------- */

const AVATAR_TONES = ["#1f6c57", "#3f6577", "#b37413", "#c75540", "#5ca28a", "#5f8ca0"];
export function Avatar({ name, color, size = 40 }: { name: string; color?: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const tone = color ?? AVATAR_TONES[(name.charCodeAt(0) + name.length) % AVATAR_TONES.length];
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full font-display font-bold text-paper select-none"
      style={{ width: size, height: size, backgroundColor: tone, fontSize: size * 0.36 }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

/* ------------------------------- Progression ------------------------------- */

export function ProgressBar({ value, color = "#1f6c57", height = 8 }: { value: number; color?: string; height?: number }) {
  return (
    <div className="w-full overflow-hidden rounded-full bg-pine-100" style={{ height }}>
      <div
        className="h-full origin-left rounded-full animate-grow-bar transition-all duration-700"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: color }}
      />
    </div>
  );
}

export function Ring({ value, size = 92, stroke = 9, color = "#1f6c57", label }: { value: number; size?: number; stroke?: number; color?: string; label?: ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [offset, setOffset] = useState(c);
  useEffect(() => {
    const t = setTimeout(() => setOffset(c - (c * Math.min(100, value)) / 100), 80);
    return () => clearTimeout(t);
  }, [c, value]);
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#dcebe4" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22,0.61,0.36,1)" }}
        />
      </svg>
      <span className="absolute font-display font-bold text-pine-800" style={{ fontSize: size * 0.24 }}>
        {label ?? `${Math.round(value)}%`}
      </span>
    </div>
  );
}

/* ------------------------------- Cartes & stats ------------------------------- */

export function Card({ className = "", children, style }: { className?: string; children: ReactNode; style?: React.CSSProperties }) {
  return <div className={`rounded-2xl border border-pine-100 bg-white/90 shadow-soft ${className}`} style={style}>{children}</div>;
}

export function StatCard({ label, value, icon, hint, tone = "#1f6c57" }: { label: string; value: ReactNode; icon: ReactNode; hint?: string; tone?: string }) {
  return (
    <div className="group rounded-2xl border border-pine-100 bg-white/90 p-4 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold text-pine-500/80 uppercase tracking-wide">{label}</p>
        <span className="rounded-lg p-1.5 transition-colors" style={{ backgroundColor: `${tone}18`, color: tone }}>
          {icon}
        </span>
      </div>
      <p className="mt-1 font-display text-3xl font-bold text-pine-900">{value}</p>
      {hint && <p className="mt-1 text-[11px] text-pine-500/70">{hint}</p>}
    </div>
  );
}

/* ------------------------------- Modale ------------------------------- */

export function Modal({ open, onClose, title, children, wide = false }: { open: boolean; onClose: () => void; title: ReactNode; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-pine-950/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className={`relative w-full ${wide ? "max-w-3xl" : "max-w-lg"} max-h-[92vh] overflow-y-auto nice-scroll rounded-t-2xl sm:rounded-2xl bg-paper shadow-lift animate-pop`}>
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-pine-100 bg-paper/95 px-6 py-4 backdrop-blur">
          <h3 className="font-display text-lg font-bold text-pine-900">{title}</h3>
          <button onClick={onClose} aria-label="Fermer" className="rounded-lg p-1.5 text-pine-500 hover:bg-pine-100 hover:text-pine-800 transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>,
    document.body
  );
}

/* ------------------------------- Formulaires ------------------------------- */

export function Field({ label, error, children, hint }: { label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-pine-700">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-[11px] text-pine-500/70">{hint}</span>}
      {error && (
        <span className="mt-1 flex items-center gap-1 text-[11px] font-medium text-coral-600">
          <AlertCircle size={12} /> {error}
        </span>
      )}
    </label>
  );
}

export const inputCls = (error?: string) =>
  `w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-pine-300 transition-all focus:outline-none focus:ring-2 ${
    error ? "border-coral-500 focus:ring-coral-200" : "border-pine-200 focus:border-pine-500 focus:ring-pine-100"
  }`;

/* ------------------------------- État vide ------------------------------- */

export function EmptyState({ icon, title, text, action }: { icon: ReactNode; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-pine-200 bg-pine-50/50 px-6 py-14 text-center">
      <span className="mb-4 rounded-2xl bg-pine-100 p-4 text-pine-600">{icon}</span>
      <h3 className="font-display text-lg font-bold text-pine-800">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-pine-500/80">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ------------------------------- Onglets ------------------------------- */

export function Tabs({ tabs, active, onChange }: { tabs: { id: string; label: string; count?: number }[]; active: string; onChange: (id: string) => void }) {
  return (
    <div className="flex gap-1 overflow-x-auto nice-scroll rounded-xl bg-pine-100/70 p-1" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          onClick={() => onChange(t.id)}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
            active === t.id ? "bg-white text-pine-800 shadow-soft" : "text-pine-600 hover:text-pine-800"
          }`}
        >
          {t.label}
          {t.count !== undefined && (
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${active === t.id ? "bg-pine-100 text-pine-700" : "bg-pine-200/70 text-pine-600"}`}>{t.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------- Scroll reveal & compteurs ------------------------------- */

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${inView ? "is-in" : ""} ${className}`} style={{ ["--reveal-delay" as string]: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function CountUp({ to, suffix = "", duration = 1600 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const t0 = performance.now();
          const tick = (t: number) => {
            const p = Math.min(1, (t - t0) / duration);
            setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration]);
  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

/* ------------------------------- Graphiques (SVG artisanaux, zéro dépendance) ------------------------------- */

export function TrendArea({ data, color = "#1f6c57", name = "Valeur" }: { data: { name: string; value: number }[]; color?: string; name?: string }) {
  const gid = useId();
  const [hover, setHover] = useState<number | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  if (data.length === 0) return null;

  const values = data.map((d) => d.value);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const pad = rawMax === rawMin ? 1 : (rawMax - rawMin) * 0.18;
  const min = Math.max(0, rawMin - pad);
  const max = rawMax + pad;
  const W = 300;
  const H = 120;
  const px = (i: number) => (data.length === 1 ? W / 2 : (i / (data.length - 1)) * (W - 16) + 8);
  const py = (v: number) => H - 10 - ((v - min) / (max - min)) * (H - 24);
  const pts = data.map((d, i) => ({ x: px(i), y: py(d.value) }));
  const line = pts
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = pts[i - 1];
      const cx = (prev.x + p.x) / 2;
      return `C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
    })
    .join(" ");
  const area = `${line} L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`;

  const onMove = (e: React.MouseEvent) => {
    const rect = boxRef.current?.getBoundingClientRect();
    if (!rect) return;
    const rel = (e.clientX - rect.left) / rect.width;
    setHover(Math.max(0, Math.min(data.length - 1, Math.round(rel * (data.length - 1)))));
  };

  return (
    <div className="flex h-full flex-col">
      <div ref={boxRef} className="relative min-h-0 flex-1" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
        {[0.25, 0.5, 0.75].map((g) => (
          <span key={g} className="absolute left-0 right-0 border-t border-dashed border-pine-100" style={{ top: `${g * 100}%` }} />
        ))}
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <linearGradient id={`grad-${gid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#grad-${gid})`} style={{ animation: "chartFade 0.9s ease 0.15s both" }} />
          <path
            d={line} fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round" vectorEffect="non-scaling-stroke"
            pathLength={1} strokeDasharray={1} strokeDashoffset={0}
            style={{ animation: "drawLine 1.2s cubic-bezier(0.22,0.61,0.36,1) both" }}
          />
          {hover !== null && <line x1={pts[hover].x} y1={8} x2={pts[hover].x} y2={H - 6} stroke={color} strokeOpacity={0.25} strokeWidth={1.4} vectorEffect="non-scaling-stroke" />}
        </svg>
        {pts.map((p, i) => (
          <span
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white"
            style={{
              left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%`,
              width: hover === i ? 13 : 9, height: hover === i ? 13 : 9,
              borderColor: color,
              animation: `chartFade 0.4s ease ${0.25 + i * 0.06}s both`,
              transition: "width 0.15s ease, height 0.15s ease",
            }}
          />
        ))}
        {hover !== null && (
          <div
            className="pointer-events-none absolute z-10 whitespace-nowrap rounded-lg border border-pine-100 bg-white px-2.5 py-1.5 text-[11px] font-bold text-pine-800 shadow-lift"
            style={{ left: `${(pts[hover].x / W) * 100}%`, top: `${(pts[hover].y / H) * 100}%`, transform: "translate(-50%, -170%)" }}
          >
            {name} · <span style={{ color }}>{data[hover].value}</span>
          </div>
        )}
      </div>
      <div className="mt-2 flex justify-between gap-2">
        {data.map((d, i) => (
          <button
            key={i} type="button" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
            className={`cursor-pointer rounded-md px-1 py-0.5 text-[10px] font-semibold transition-colors ${hover === i ? "bg-pine-100 text-pine-900" : "text-pine-400"}`}
          >
            {d.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export function MonthBars({ data, color = "#d2921a", name = "Séances" }: { data: { name: string; value: number }[]; color?: string; name?: string }) {
  const [hover, setHover] = useState<number | null>(null);
  if (data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex h-full flex-col">
      <div className="flex min-h-0 flex-1 items-end gap-2 sm:gap-3">
        {data.map((d, i) => (
          <div
            key={d.name}
            className="relative flex h-full flex-1 cursor-pointer flex-col justify-end"
            onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
          >
            <span
              className={`pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-pine-100 bg-white px-2 py-1 text-[10px] font-bold text-pine-800 shadow-lift transition-opacity duration-200 ${hover === i ? "opacity-100" : "opacity-0"}`}
              style={{ bottom: `calc(${Math.max(6, (d.value / max) * 86)}% + 10px)` }}
            >
              {d.value} {name.toLowerCase()}
            </span>
            <div className="relative w-full overflow-hidden rounded-t-lg bg-pine-50" style={{ height: "86%" }}>
              <span
                className="absolute inset-x-0 bottom-0 rounded-t-lg"
                style={{
                  height: `${(d.value / max) * 100}%`,
                  backgroundColor: color,
                  opacity: hover === null || hover === i ? 1 : 0.35,
                  animation: `growUp 0.9s cubic-bezier(0.22,0.61,0.36,1) ${i * 70}ms both`,
                  transition: "opacity 0.25s ease",
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2 sm:gap-3">
        {data.map((d) => (
          <span key={d.name} className={`flex-1 text-center text-[10px] font-semibold transition-colors ${hover !== null && data[hover]?.name === d.name ? "text-pine-900" : "text-pine-400"}`}>{d.name}</span>
        ))}
      </div>
    </div>
  );
}

export function Donut({ data }: { data: { name: string; value: number; color: string }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const total = data.reduce((s, d) => s + d.value, 0);
  const R = 56;
  const C = 2 * Math.PI * R;
  let acc = 0;

  return (
    <div className="flex flex-wrap items-center justify-center gap-5">
      <div className="relative h-40 w-40 shrink-0">
        <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
          <circle cx={70} cy={70} r={R} fill="none" stroke="#eff6f3" strokeWidth={20} />
          {data.map((d, i) => {
            const frac = total === 0 ? 0 : d.value / total;
            const dash = Math.max(0, frac * C - 3);
            const offset = -acc * C;
            acc += frac;
            return (
              <circle
                key={d.name} cx={70} cy={70} r={R} fill="none" stroke={d.color} strokeLinecap="round"
                strokeWidth={hover === i ? 25 : 20}
                strokeDasharray={`${dash} ${C}`} strokeDashoffset={offset}
                className="cursor-pointer"
                style={{ animation: `dashIn 1s cubic-bezier(0.22,0.61,0.36,1) ${i * 90}ms both`, transition: "stroke-width 0.2s ease, opacity 0.2s ease", opacity: hover === null || hover === i ? 1 : 0.3 }}
                onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
              />
            );
          })}
        </svg>
        <span className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-bold text-pine-900">{hover !== null ? data[hover].value : total}</span>
          <span className="max-w-[84px] truncate text-[10px] font-semibold uppercase tracking-wide text-pine-500/70">{hover !== null ? data[hover].name : "besoins"}</span>
        </span>
      </div>
      <ul className="space-y-1 text-xs">
        {data.map((d, i) => (
          <li
            key={d.name} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
            className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 transition-colors ${hover === i ? "bg-pine-50" : ""}`}
          >
            <StatusDot color={d.color} />
            <span className="font-medium text-pine-800">{d.name}</span>
            <span className="text-pine-500/70">· {d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------- Image vivante & titres ------------------------------- */

export function KenBurns({ src, alt, className = "", ratio = "4 / 3" }: { src: string; alt: string; className?: string; ratio?: string }) {
  return (
    <div className={`overflow-hidden ${className}`} style={{ aspectRatio: ratio }}>
      <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover animate-kenburns" />
    </div>
  );
}

export function SectionTitle({ kicker, title, text, align = "center", dark = false }: { kicker: string; title: ReactNode; text?: ReactNode; align?: "center" | "left"; dark?: boolean }) {
  const centered = align === "center";
  return (
    <Reveal className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className={`text-xs font-bold uppercase tracking-[0.2em] ${dark ? "text-marigold-300" : "text-marigold-600"}`}>{kicker}</p>
      <h2 className={`mt-2.5 font-display text-3xl font-bold leading-tight sm:text-[2.6rem] ${dark ? "text-paper" : "text-pine-950"}`}>{title}</h2>
      <span className={`mt-4 inline-block h-1 w-16 rounded-full bg-marigold-400 ${centered ? "" : ""}`} />
      {text && <p className={`mt-4 text-[15px] leading-relaxed ${dark ? "text-pine-100/80" : "text-pine-600"}`}>{text}</p>}
    </Reveal>
  );
}

/* ------------------------------- Démo cinématique (façon vidéo) ------------------------------- */

const SCENES = [
  { title: "Bilan initial", caption: "Chaque élève démarre par une évaluation complète de ses besoins." },
  { title: "Parcours personnalisé", caption: "Des objectifs clairs, adaptés au rythme de l'enfant." },
  { title: "Séances planifiées", caption: "Un calendrier lisible pour l'élève, la famille et le pédagogue." },
  { title: "Progrès mesurés", caption: "Chaque compétence progresse, séance après séance." },
  { title: "Famille informée", caption: "Les parents suivent chaque étape en temps réel." },
];
const SCENE_DUR = 4;
const TOTAL_DUR = SCENES.length * SCENE_DUR;

function SceneStage({ index }: { index: number }) {
  return (
    <div key={index} className="absolute inset-0 flex flex-col items-center justify-center px-6">
      {index === 0 && (
        <div className="anim-up w-[290px] rounded-2xl bg-white/95 p-4 text-left shadow-lift">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-marigold-200 font-display text-lg font-bold text-marigold-800">E</span>
            <div>
              <p className="text-sm font-bold text-pine-900">Emma, 9 ans</p>
              <p className="text-[11px] text-pine-500">CM1 · Brazzaville</p>
            </div>
          </div>
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {["Lecture", "Concentration", "Confiance"].map((t, i) => (
              <span key={t} className="anim-pop rounded-full bg-pine-100 px-2.5 py-1 text-[10px] font-semibold text-pine-700" style={{ animationDelay: `${0.35 + i * 0.16}s` }}>{t}</span>
            ))}
          </div>
        </div>
      )}
      {index === 1 && (
        <div className="anim-up w-[290px] space-y-3 rounded-2xl bg-white/95 p-4 text-left shadow-lift">
          {[{ t: "Compréhension écrite", p: 65, d: "0.2s" }, { t: "Concentration", p: 75, d: "0.45s" }, { t: "Confiance en soi", p: 50, d: "0.7s" }].map((g) => (
            <div key={g.t}>
              <div className="flex items-center justify-between text-[11px] font-semibold text-pine-700">
                <span>{g.t}</span><span>{g.p} %</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-pine-100">
                <div className="anim-bar h-full rounded-full bg-pine-600" style={{ width: `${g.p}%`, animationDelay: g.d }} />
              </div>
            </div>
          ))}
        </div>
      )}
      {index === 2 && (
        <div className="anim-up w-[290px] rounded-2xl bg-white/95 p-4 text-left shadow-lift">
          <p className="text-[11px] font-bold uppercase tracking-wide text-pine-500">Semaine · Séances</p>
          <div className="mt-2.5 grid grid-cols-5 gap-1.5">
            {Array.from({ length: 10 }).map((_, i) => {
              const hot = i === 1 || i === 4 || i === 7;
              return <span key={i} className={hot ? "anim-pop h-9 rounded-lg bg-marigold-300" : "h-9 rounded-lg bg-pine-50"} style={hot ? { animationDelay: `${0.2 + i * 0.08}s` } : undefined} />;
            })}
          </div>
        </div>
      )}
      {index === 3 && (
        <svg viewBox="0 0 260 120" className="anim-up w-[290px]">
          <path d="M10 100 L60 88 L110 92 L160 62 L210 40 L250 22" fill="none" stroke="#f1d997" strokeWidth="4" strokeLinecap="round" className="anim-draw" />
          {[[10, 100], [60, 88], [110, 92], [160, 62], [210, 40], [250, 22]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="5" fill="#1f6c57" className="anim-pop" style={{ animationDelay: `${0.3 + i * 0.15}s` }} />
          ))}
        </svg>
      )}
      {index === 4 && (
        <div className="w-[290px] space-y-2.5">
          {[{ t: "Nouveau compte rendu", m: "La séance d'Emma est en ligne.", d: "0.15s" }, { t: "Prochaine séance", m: "Jeudi à 15 h 00.", d: "0.45s" }].map((n) => (
            <div key={n.t} className="anim-notif flex items-start gap-2.5 rounded-xl bg-white/95 p-3 text-left shadow-lift" style={{ animationDelay: n.d }}>
              <span className="mt-0.5 rounded-lg bg-pine-100 p-1.5 text-pine-700"><CheckCircle2 size={14} /></span>
              <div>
                <p className="text-[12px] font-bold text-pine-900">{n.t}</p>
                <p className="text-[11px] text-pine-500">{n.m}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function VideoShowcase() {
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const ended = elapsed >= TOTAL_DUR;

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    let id = 0;
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setElapsed((e) => Math.min(TOTAL_DUR, e + dt));
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [playing]);

  useEffect(() => {
    if (ended && playing) setPlaying(false);
  }, [ended, playing]);

  const sceneIndex = Math.min(SCENES.length - 1, Math.floor(elapsed / SCENE_DUR));
  const started = elapsed > 0;
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  const toggle = () => {
    if (ended) {
      setElapsed(0);
      setPlaying(true);
      return;
    }
    setPlaying((p) => !p);
  };
  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rel = (e.clientX - rect.left) / rect.width;
    setElapsed(Math.max(0, Math.min(TOTAL_DUR, rel * TOTAL_DUR)));
  };

  return (
    <Reveal>
      <div className="mx-auto max-w-3xl overflow-hidden rounded-[26px] border border-pine-800 bg-pine-950 shadow-lift">
        <div className="flex items-center gap-2 border-b border-pine-800/70 px-5 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-coral-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-marigold-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-pine-400/80" />
          <p className="ml-2 truncate text-[11px] font-semibold uppercase tracking-wider text-pine-200/70">La plateforme en 20 secondes</p>
        </div>

        <div className="bg-dots relative aspect-[16/9] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgb(31_108_87/0.35),transparent_60%)]" aria-hidden="true" />
          {started && !ended ? (
            <SceneStage index={sceneIndex} />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <p className="font-display text-xl font-bold text-paper sm:text-2xl">{ended ? "Merci d'avoir regardé" : "Découvrez le parcours d'un élève"}</p>
              <p className="mt-1.5 max-w-sm text-[13px] text-pine-100/70">{ended ? "Rejouez la démonstration ou explorez la plateforme." : "Du bilan initial au suivi familial, en cinq étapes."}</p>
            </div>
          )}

          {started && !ended && (
            <div className="anim-up pointer-events-none absolute bottom-4 left-1/2 w-[min(88%,360px)] -translate-x-1/2 rounded-xl bg-pine-950/70 px-4 py-2.5 text-center backdrop-blur">
              <p key={sceneIndex} className="anim-pop text-[13px] font-bold text-paper">{SCENES[sceneIndex].title}</p>
              <p className="mt-0.5 text-[11px] text-pine-100/75">{SCENES[sceneIndex].caption}</p>
            </div>
          )}

          <button
            onClick={toggle}
            aria-label={playing ? "Mettre en pause" : ended ? "Rejouer la démonstration" : "Lancer la démonstration"}
            className="absolute inset-0 m-auto flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-marigold-400 text-pine-950 shadow-lift transition-transform hover:scale-110 active:scale-95"
          >
            {playing ? (
              <span className="flex gap-1.5"><span className="h-5 w-1.5 rounded-sm bg-pine-950" /><span className="h-5 w-1.5 rounded-sm bg-pine-950" /></span>
            ) : ended ? (
              <RotateCcw size={22} />
            ) : (
              <span className="ml-1 h-0 w-0 border-y-[11px] border-l-[18px] border-y-transparent border-l-pine-950" />
            )}
          </button>
        </div>

        <div className="space-y-2.5 border-t border-pine-800/70 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <span className="w-10 shrink-0 text-[11px] font-semibold tabular-nums text-pine-200/80">{fmt(elapsed)}</span>
            <div onClick={seek} className="group relative h-1.5 flex-1 cursor-pointer rounded-full bg-pine-800">
              <div className="absolute inset-y-0 left-0 rounded-full bg-marigold-400" style={{ width: `${(elapsed / TOTAL_DUR) * 100}%` }} />
              {SCENES.map((_, i) => (
                <span key={i} className="absolute top-1/2 h-2.5 w-0.5 -translate-y-1/2 rounded bg-pine-600" style={{ left: `${((i + 1) / SCENES.length) * 100}%` }} />
              ))}
            </div>
            <span className="w-10 shrink-0 text-right text-[11px] font-semibold tabular-nums text-pine-200/50">{fmt(TOTAL_DUR)}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SCENES.map((s, i) => (
              <button
                key={s.title}
                onClick={() => { setElapsed(i * SCENE_DUR); setPlaying(true); }}
                className={`cursor-pointer rounded-full px-3 py-1 text-[10px] font-bold transition-colors ${i === sceneIndex && started ? "bg-marigold-400 text-pine-950" : "bg-pine-800/70 text-pine-200/70 hover:bg-pine-700 hover:text-paper"}`}
              >
                {i + 1}. {s.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ------------------------------- Toasts ------------------------------- */

export function ToastHost() {
  const toasts = useApp((s) => s.toasts);
  const dismiss = useApp((s) => s.dismissToast);
  return createPortal(
    <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-[min(92vw,360px)] flex-col gap-2.5">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto flex items-start gap-3 rounded-xl border border-pine-100 bg-white px-4 py-3 shadow-lift animate-toast-in">
          <span className={t.kind === "success" ? "text-pine-600" : t.kind === "error" ? "text-coral-600" : "text-sea-500"}>
            {t.kind === "success" ? <CheckCircle2 size={19} /> : t.kind === "error" ? <AlertCircle size={19} /> : <Info size={19} />}
          </span>
          <p className="flex-1 text-[13px] font-medium leading-snug text-ink">{t.message}</p>
          <button onClick={() => dismiss(t.id)} aria-label="Fermer la notification" className="text-pine-300 hover:text-pine-700 transition-colors cursor-pointer">
            <X size={15} />
          </button>
        </div>
      ))}
    </div>,
    document.body
  );
}
