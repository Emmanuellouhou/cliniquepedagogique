import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarPlus } from "lucide-react";
import { Badge, Button, Card, Reveal, Tabs } from "../components/ui";
import { useApp, visibleStudents } from "../lib/store";
import { SESSION_STATUSES, SESSION_TYPE_COLORS, fullName, todayISO, type Session, type SessionType } from "../lib/data";
import { SessionFormModal } from "./sessions";

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

function toISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // lundi = 0
  x.setDate(x.getDate() - day);
  x.setHours(12, 0, 0, 0);
  return x;
}
function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function SessionChip({ s, onClick, compact }: { s: Session; onClick: () => void; compact?: boolean }) {
  const cancelled = s.status === "annulee";
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`block w-full truncate rounded-md px-1.5 py-1 text-left text-[10px] font-bold text-paper transition-all hover:brightness-110 hover:scale-[1.02] cursor-pointer ${cancelled ? "opacity-40 line-through" : ""}`}
      style={{ backgroundColor: SESSION_TYPE_COLORS[s.type] }}
      title={`${s.time} · ${s.type}`}
    >
      {s.time} {!compact && `· ${s.type}`}
    </button>
  );
}

export function CalendarPage() {
  const state = useApp();
  const me = state.currentUser!;
  const students = visibleStudents(state);
  const canEdit = me.role === "admin" || me.role === "professional";
  const [view, setView] = useState<"mois" | "semaine" | "jour">("mois");
  const [cursor, setCursor] = useState(() => new Date());
  const [createOpen, setCreateOpen] = useState(false);
  const [presetDate, setPresetDate] = useState<string | undefined>(undefined);
  const [editing, setEditing] = useState<Session | null>(null);
  const today = todayISO();

  const sessions = useMemo(
    () => state.sessions.filter((s) => students.some((st) => st.id === s.studentId) && (me.role === "professional" ? s.professionalId === me.id || students.some((st) => st.id === s.studentId && st.professionalId === me.id) : true)),
    [state.sessions, students, me]
  );
  const byDate = useMemo(() => {
    const map: Record<string, Session[]> = {};
    sessions.forEach((s) => {
      (map[s.date] ||= []).push(s);
      map[s.date].sort((a, b) => a.time.localeCompare(b.time));
    });
    return map;
  }, [sessions]);

  /* ---- Grille mois ---- */
  const monthCells = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1, 12);
    const start = startOfWeek(first);
    return Array.from({ length: 42 }, (_, i) => addDays(start, i));
  }, [cursor]);

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(cursor), i)), [cursor]);

  const nav = (dir: -1 | 1) => {
    if (view === "mois") setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + dir, 1, 12));
    else if (view === "semaine") setCursor(addDays(cursor, dir * 7));
    else setCursor(addDays(cursor, dir));
  };

  const headerLabel =
    view === "mois"
      ? `${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`
      : view === "semaine"
        ? `Semaine du ${weekDays[0].toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} au ${weekDays[6].toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}`
        : cursor.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const openCreate = (date?: string) => {
    setEditing(null);
    setPresetDate(date);
    setCreateOpen(true);
  };

  const dayList = byDate[toISO(cursor)] ?? [];

  return (
    <div className="space-y-6">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-pine-500">Planning des séances</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-pine-950 sm:text-3xl">Calendrier</h2>
          </div>
          {canEdit && <Button onClick={() => openCreate()}><CalendarPlus size={16} /> Nouvelle séance</Button>}
        </div>
      </Reveal>

      <Reveal delay={80}>
        <Card className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <button onClick={() => nav(-1)} aria-label="Période précédente" className="rounded-lg p-2 text-pine-600 hover:bg-pine-100 transition-colors cursor-pointer"><ChevronLeft size={19} /></button>
              <Button variant="secondary" size="sm" onClick={() => setCursor(new Date())}>Aujourd'hui</Button>
              <button onClick={() => nav(1)} aria-label="Période suivante" className="rounded-lg p-2 text-pine-600 hover:bg-pine-100 transition-colors cursor-pointer"><ChevronRight size={19} /></button>
            </div>
            <h3 className="order-first w-full text-center font-display text-lg font-bold capitalize text-pine-900 sm:order-none sm:w-auto">{headerLabel}</h3>
            <Tabs tabs={[{ id: "mois", label: "Mois" }, { id: "semaine", label: "Semaine" }, { id: "jour", label: "Jour" }]} active={view} onChange={(v) => setView(v as typeof view)} />
          </div>

          {/* Légende */}
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-pine-100 pt-3.5">
            {(Object.keys(SESSION_TYPE_COLORS) as SessionType[]).map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-[10px] font-bold text-pine-600">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: SESSION_TYPE_COLORS[t] }} /> {t}
              </span>
            ))}
          </div>
        </Card>
      </Reveal>

      {/* ---- Vue mois ---- */}
      {view === "mois" && (
        <Reveal delay={120}>
          <Card className="overflow-hidden">
            <div className="grid grid-cols-7 border-b border-pine-100 bg-pine-50/60">
              {WEEKDAYS.map((d) => <p key={d} className="px-2 py-2.5 text-center text-[11px] font-bold uppercase tracking-wider text-pine-500">{d}</p>)}
            </div>
            <div className="grid grid-cols-7">
              {monthCells.map((d, i) => {
                const iso = toISO(d);
                const inMonth = d.getMonth() === cursor.getMonth();
                const isToday = iso === today;
                const list = byDate[iso] ?? [];
                return (
                  <div
                    key={i}
                    onClick={() => (canEdit ? openCreate(iso) : (setCursor(new Date(d)), setView("jour")))}
                    className={`min-h-[92px] border-b border-r border-pine-50 p-1.5 transition-colors sm:min-h-[110px] ${inMonth ? "bg-white" : "bg-pine-50/40"} cursor-pointer ${canEdit ? "hover:bg-marigold-50/50" : "hover:bg-pine-50"} ${i % 7 === 6 ? "border-r-0" : ""}`}
                  >
                    <p className={`mb-1 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${isToday ? "bg-pine-700 text-paper" : inMonth ? "text-pine-800" : "text-pine-300"}`}>
                      {d.getDate()}
                    </p>
                    <div className="space-y-1">
                      {list.slice(0, 3).map((s) => <SessionChip key={s.id} s={s} onClick={() => (canEdit ? setEditing(s) : (setCursor(new Date(s.date + "T12:00:00")), setView("jour")))} compact />)}
                      {list.length > 3 && <p className="px-1 text-[9px] font-bold text-pine-400">+{list.length - 3} autre{list.length - 3 > 1 ? "s" : ""}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </Reveal>
      )}

      {/* ---- Vue semaine ---- */}
      {view === "semaine" && (
        <Reveal delay={120}>
          <Card className="overflow-hidden">
            <div className="grid grid-cols-7 border-b border-pine-100 bg-pine-50/60">
              {weekDays.map((d) => {
                const iso = toISO(d);
                return (
                  <p key={iso} className={`px-1 py-2.5 text-center ${iso === today ? "bg-pine-700 text-paper" : ""}`}>
                    <span className="block text-[10px] font-bold uppercase tracking-wider opacity-70">{WEEKDAYS[(d.getDay() + 6) % 7]}</span>
                    <span className="block font-display text-sm font-bold">{d.getDate()}</span>
                  </p>
                );
              })}
            </div>
            <div className="grid grid-cols-7">
              {weekDays.map((d) => {
                const iso = toISO(d);
                const list = byDate[iso] ?? [];
                return (
                  <div key={iso} onClick={() => (canEdit ? openCreate(iso) : (setCursor(new Date(d)), setView("jour")))} className={`min-h-[160px] space-y-1.5 border-r border-pine-50 p-1.5 last:border-r-0 ${iso === today ? "bg-pine-50/50" : "bg-white"} cursor-pointer ${canEdit ? "hover:bg-marigold-50/40" : "hover:bg-pine-50"}`}>
                    {list.map((s) => <SessionChip key={s.id} s={s} onClick={() => (canEdit ? setEditing(s) : (setCursor(new Date(s.date + "T12:00:00")), setView("jour")))} />)}
                    {list.length === 0 && <p className="pt-6 text-center text-[10px] text-pine-300">—</p>}
                  </div>
                );
              })}
            </div>
          </Card>
        </Reveal>
      )}

      {/* ---- Vue jour ---- */}
      {view === "jour" && (
        <Reveal delay={120}>
          <div className="space-y-3">
            {dayList.length === 0 ? (
              <Card className="p-10 text-center">
                <p className="font-display text-lg font-bold text-pine-900">Aucune séance ce jour</p>
                <p className="mt-1 text-sm text-pine-500">Cette journée est libre pour l'accompagnement.</p>
                {canEdit && <Button className="mt-5" onClick={() => openCreate(toISO(cursor))}><CalendarPlus size={15} /> Programmer ici</Button>}
              </Card>
            ) : (
              dayList.map((s) => {
                const st = state.students.find((x) => x.id === s.studentId);
                const pro = state.users.find((u) => u.id === s.professionalId);
                const meta = SESSION_STATUSES[s.status];
                return (
                  <Card key={s.id} className="p-5 transition-all hover:shadow-lift">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <span className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl text-paper" style={{ backgroundColor: SESSION_TYPE_COLORS[s.type] }}>
                        <span className="text-sm font-bold leading-none">{s.time}</span>
                        <span className="mt-0.5 text-[9px] uppercase opacity-80">{s.duration}min</span>
                      </span>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[14px] font-bold text-pine-900">{s.type} — {st ? fullName(st) : ""}</p>
                          <Badge bg={meta.bg} fg={meta.fg}>{meta.label}</Badge>
                        </div>
                        <p className="mt-1 text-xs text-pine-500">avec {pro ? fullName(pro) : "—"} · {s.objective}</p>
                      </div>
                      {canEdit && (
                        <div className="flex shrink-0 gap-2">
                          <Button size="sm" variant="secondary" onClick={() => setEditing(s)}>Modifier</Button>
                          {s.status === "programmee" && (
                            <>
                              <Button size="sm" variant="ghost" onClick={() => state.setSessionStatus(s.id, "realisee")}>Réalisée</Button>
                              <Button size="sm" variant="ghost" onClick={() => state.setSessionStatus(s.id, "annulee")}>Annuler</Button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </Reveal>
      )}

      {(createOpen || editing !== null) && (
        <SessionFormModal
          key={editing?.id ?? presetDate ?? "nouvelle"}
          open
          onClose={() => { setCreateOpen(false); setEditing(null); }}
          editing={editing}
          presetDate={presetDate}
        />
      )}
    </div>
  );
}
