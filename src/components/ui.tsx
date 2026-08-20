import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle2, Info, AlertCircle } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
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

/* ------------------------------- Graphiques ------------------------------- */

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #dcebe4",
  background: "#fdfdfb",
  fontSize: 12,
  fontFamily: "Poppins, sans-serif",
  color: "#17251f",
  boxShadow: "0 10px 28px -14px rgb(13 51 42 / 0.25)",
};

export function TrendArea({ data, color = "#1f6c57", name = "Valeur" }: { data: { name: string; value: number }[]; color?: string; name?: string }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.28} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#dcebe4" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#5f8ca0" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#5f8ca0" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [v, name]} />
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} fill={`url(#grad-${color.replace("#", "")})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function MonthBars({ data, color = "#d2921a", name = "Séances" }: { data: { name: string; value: number }[]; color?: string; name?: string }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#dcebe4" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#5f8ca0" }} axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#5f8ca0" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgb(23 87 69 / 0.05)" }} formatter={(v: number) => [v, name]} />
        <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} maxBarSize={34} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function Donut({ data }: { data: { name: string; value: number; color: string }[] }) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-40 w-40 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={52} outerRadius={74} paddingAngle={3} strokeWidth={0}>
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
        <span className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-bold text-pine-900">{data.reduce((s, d) => s + d.value, 0)}</span>
          <span className="text-[10px] font-semibold uppercase tracking-wide text-pine-500/70">besoins</span>
        </span>
      </div>
      <ul className="space-y-1.5 text-xs">
        {data.map((d) => (
          <li key={d.name} className="flex items-center gap-2">
            <StatusDot color={d.color} />
            <span className="font-medium text-pine-800">{d.name}</span>
            <span className="text-pine-500/70">· {d.value}</span>
          </li>
        ))}
      </ul>
    </div>
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
