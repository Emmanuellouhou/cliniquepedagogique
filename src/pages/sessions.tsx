import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarPlus, ClipboardList, Eye, PenLine, Check, Ban, CalendarClock, Star } from "lucide-react";
import { Avatar, Badge, Button, Card, EmptyState, Field, Modal, Reveal, Tabs, inputCls } from "../components/ui";
import { useApp, visibleStudents } from "../lib/store";
import {
  SESSION_STATUSES, SESSION_TYPE_COLORS, fmtDateLong, fullName, todayISO, type Session, type SessionStatus, type SessionType,
} from "../lib/data";

const TYPES: SessionType[] = ["Lecture", "Compréhension", "Mathématiques", "Écriture", "Méthodologie", "Concentration", "Confiance en soi", "Bilan"];

/* ------------------------- Modale création / édition séance ------------------------- */

/* Le composant est monté uniquement à l'ouverture (par le parent) :
   l'état initial est donc toujours propre, sans réinitialisation en cours de rendu. */
export function SessionFormModal({ open, onClose, editing, presetDate }: { open: boolean; onClose: () => void; editing?: Session | null; presetDate?: string }) {
  const state = useApp();
  const me = state.currentUser!;
  const students = visibleStudents(state);
  const pros = state.users.filter((u) => u.role === "professional");
  const [form, setForm] = useState(() =>
    editing
      ? { studentId: editing.studentId, professionalId: editing.professionalId, date: editing.date, time: editing.time, duration: editing.duration, type: editing.type, objective: editing.objective }
      : { studentId: students[0]?.id ?? "", professionalId: me.role === "professional" ? me.id : pros[0]?.id ?? "", date: presetDate ?? todayISO(), time: "15:00", duration: 45, type: "Lecture" as SessionType, objective: "" }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.studentId) errs.studentId = "Sélectionnez un élève.";
    if (!form.date) errs.date = "Date requise.";
    if (!form.time) errs.time = "Heure requise.";
    if (form.objective.trim().length < 5) errs.objective = "Décrivez l'objectif de la séance (5 caractères min.).";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    if (editing) state.updateSession(editing.id, { ...form });
    else state.addSession({ ...form, status: "programmee" });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={editing ? "Modifier la séance" : "Programmer une séance"}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Élève" error={errors.studentId}>
          <select className={inputCls(errors.studentId)} value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })}>
            {students.map((s) => <option key={s.id} value={s.id}>{fullName(s)} · {s.schoolLevel}</option>)}
          </select>
        </Field>
        <Field label="Professionnel">
          <select className={inputCls()} value={form.professionalId} onChange={(e) => setForm({ ...form, professionalId: e.target.value })} disabled={me.role === "professional"}>
            {pros.map((p) => <option key={p.id} value={p.id}>{fullName(p)} — {p.specialty}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Date" error={errors.date}>
            <input type="date" min={todayISO()} className={inputCls(errors.date)} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </Field>
          <Field label="Heure" error={errors.time}>
            <input type="time" className={inputCls(errors.time)} value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
          </Field>
          <Field label="Durée (min)">
            <select className={inputCls()} value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}>
              <option value={30}>30</option><option value={45}>45</option><option value={60}>60</option><option value={90}>90</option>
            </select>
          </Field>
        </div>
        <Field label="Type de séance">
          <select className={inputCls()} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as SessionType })}>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Objectif de la séance" error={errors.objective}>
          <textarea rows={3} className={inputCls(errors.objective)} value={form.objective} onChange={(e) => setForm({ ...form, objective: e.target.value })} placeholder="Ex. : Travailler la fluence sur un chapitre d'album." />
        </Field>
        <div className="flex justify-end gap-3 border-t border-pine-100 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>Annuler</Button>
          <Button type="submit"><CalendarPlus size={15} /> {editing ? "Enregistrer" : "Programmer"}</Button>
        </div>
      </form>
    </Modal>
  );
}

/* ------------------------- Modale compte rendu ------------------------- */

export function ReportModal({ open, onClose, session }: { open: boolean; onClose: () => void; session: Session | null }) {
  const state = useApp();
  const [form, setForm] = useState({ objective: "", activities: "", difficulties: "", progress: "", engagement: 4, recommendations: "", nextSteps: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && session) {
      setForm({ objective: session.objective, activities: "", difficulties: "", progress: "", engagement: 4, recommendations: "", nextSteps: "" });
      setErrors({});
    }
  }, [open, session]);

  if (!session) return null;
  const student = state.students.find((s) => s.id === session.studentId);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.activities.trim().length < 10) errs.activities = "Décrivez les activités réalisées.";
    if (form.progress.trim().length < 10) errs.progress = "Décrivez les progrès observés.";
    if (form.recommendations.trim().length < 10) errs.recommendations = "Ajoutez au moins une recommandation.";
    if (form.nextSteps.trim().length < 5) errs.nextSteps = "Indiquez la prochaine étape.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    state.saveReport(session.id, form);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={`Compte rendu — ${student ? fullName(student) : ""}`} wide>
      <p className="mb-5 rounded-xl bg-pine-50 px-4 py-3 text-xs text-pine-700">
        Séance de <strong>{session.type.toLowerCase()}</strong> du <strong>{fmtDateLong(session.date)}</strong> à {session.time}.
      </p>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Objectif de la séance">
          <input className={inputCls()} value={form.objective} onChange={(e) => setForm({ ...form, objective: e.target.value })} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Activités réalisées" error={errors.activities}>
            <textarea rows={3} className={inputCls(errors.activities)} value={form.activities} onChange={(e) => setForm({ ...form, activities: e.target.value })} placeholder="Lecture chronométrée, quiz de compréhension…" />
          </Field>
          <Field label="Difficultés rencontrées">
            <textarea rows={3} className={inputCls()} value={form.difficulties} onChange={(e) => setForm({ ...form, difficulties: e.target.value })} placeholder="Hésitations sur les mots longs…" />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Progrès observés" error={errors.progress}>
            <textarea rows={3} className={inputCls(errors.progress)} value={form.progress} onChange={(e) => setForm({ ...form, progress: e.target.value })} placeholder="Débit en hausse, meilleure ponctuation…" />
          </Field>
          <div className="space-y-4">
            <Field label="Niveau d'engagement">
              <div className="flex gap-1.5 pt-1" role="radiogroup" aria-label="Niveau d'engagement">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setForm({ ...form, engagement: n })} aria-label={`Engagement ${n} sur 5`} className="cursor-pointer transition-transform hover:scale-110">
                    <Star size={26} className={n <= form.engagement ? "fill-marigold-400 text-marigold-400" : "text-pine-200"} />
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Prochaine étape" error={errors.nextSteps}>
              <input className={inputCls(errors.nextSteps)} value={form.nextSteps} onChange={(e) => setForm({ ...form, nextSteps: e.target.value })} placeholder="Introduire la lecture en groupe…" />
            </Field>
          </div>
        </div>
        <Field label="Recommandations (pour la famille)" error={errors.recommendations}>
          <textarea rows={2} className={inputCls(errors.recommendations)} value={form.recommendations} onChange={(e) => setForm({ ...form, recommendations: e.target.value })} placeholder="Poursuivre la lecture partagée 10 min chaque soir…" />
        </Field>
        <div className="flex justify-end gap-3 border-t border-pine-100 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>Annuler</Button>
          <Button type="submit"><PenLine size={15} /> Enregistrer le compte rendu</Button>
        </div>
      </form>
    </Modal>
  );
}

/* ------------------------- Lecture d'un compte rendu ------------------------- */

export function ReportViewModal({ open, onClose, reportId }: { open: boolean; onClose: () => void; reportId: string | null }) {
  const state = useApp();
  const report = state.reports.find((r) => r.id === reportId);
  if (!reportId || !report) return null;
  const session = state.sessions.find((s) => s.id === report.sessionId);
  const student = state.students.find((s) => s.id === session?.studentId);
  const rows = [
    { l: "Objectif de la séance", v: report.objective },
    { l: "Activités réalisées", v: report.activities },
    { l: "Difficultés rencontrées", v: report.difficulties || "Aucune difficulté particulière signalée." },
    { l: "Progrès observés", v: report.progress },
    { l: "Recommandations", v: report.recommendations },
    { l: "Prochaine étape", v: report.nextSteps },
  ];
  return (
    <Modal open={open} onClose={onClose} title={`Compte rendu — ${student ? fullName(student) : ""}`}>
      <p className="mb-4 text-xs text-pine-500">
        {session ? `${session.type} · ${fmtDateLong(session.date)} à ${session.time}` : ""} · Engagement : {"★".repeat(report.engagement)}{"☆".repeat(5 - report.engagement)}
      </p>
      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.l} className="rounded-xl bg-white border border-pine-100 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-pine-500">{r.l}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-pine-800">{r.v}</p>
          </div>
        ))}
      </div>
    </Modal>
  );
}

/* ------------------------- Page Séances ------------------------- */

export function SessionsPage() {
  const state = useApp();
  const me = state.currentUser!;
  const students = visibleStudents(state);
  const [tab, setTab] = useState("upcoming");
  const [typeFilter, setTypeFilter] = useState("tous");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Session | null>(null);
  const [reportSession, setReportSession] = useState<Session | null>(null);
  const [viewReport, setViewReport] = useState<string | null>(null);
  const today = todayISO();

  const mine = useMemo(
    () => state.sessions.filter((s) => students.some((st) => st.id === s.studentId)).filter((s) => (me.role === "professional" ? s.professionalId === me.id : true)),
    [state.sessions, students, me]
  );
  const filtered = mine.filter((s) => typeFilter === "tous" || s.type === typeFilter);
  const upcoming = filtered.filter((s) => s.status === "programmee" && s.date >= today).sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
  const past = filtered.filter((s) => s.status !== "programmee" || s.date < today).sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`));
  const list = tab === "upcoming" ? upcoming : past;

  return (
    <div className="space-y-6">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-pine-500">{upcoming.length} à venir · {past.length} passées</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-pine-950 sm:text-3xl">Séances pédagogiques</h2>
            <p className="mt-1 text-sm text-pine-600">Planifiez, suivez et documentez chaque séance d'accompagnement.</p>
          </div>
          <Button onClick={() => { setEditing(null); setCreateOpen(true); }}><CalendarPlus size={16} /> Programmer une séance</Button>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="flex flex-wrap items-center gap-3">
          <Tabs tabs={[{ id: "upcoming", label: "À venir", count: upcoming.length }, { id: "past", label: "Historique", count: past.length }]} active={tab} onChange={setTab} />
          <select className={`${inputCls()} w-auto`} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} aria-label="Filtrer par type">
            <option value="tous">Tous les types</option>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
      </Reveal>

      {list.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={26} />}
          title={tab === "upcoming" ? "Aucune séance à venir" : "Aucune séance dans l'historique"}
          text={tab === "upcoming" ? "Programmez une nouvelle séance pour continuer l'accompagnement." : "Les séances réalisées apparaîtront ici avec leurs comptes rendus."}
          action={tab === "upcoming" ? <Button onClick={() => setCreateOpen(true)}><CalendarPlus size={15} /> Programmer</Button> : undefined}
        />
      ) : (
        <div className="space-y-3">
          {list.map((s, i) => {
            const student = state.students.find((x) => x.id === s.studentId);
            const pro = state.users.find((u) => u.id === s.professionalId);
            const meta = SESSION_STATUSES[s.status];
            const needsReport = s.status === "realisee" && !s.reportId;
            const isPastProg = s.status === "programmee" && s.date < today;
            return (
              <Reveal key={s.id} delay={Math.min(i, 6) * 40}>
                <Card className="overflow-hidden transition-all hover:shadow-lift">
                  <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl text-paper" style={{ backgroundColor: SESSION_TYPE_COLORS[s.type] }}>
                      <span className="text-sm font-bold leading-none">{s.time}</span>
                      <span className="mt-0.5 text-[9px] font-semibold uppercase opacity-80">{s.duration}min</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[14px] font-bold text-pine-900">{s.type} — {student ? fullName(student) : "Élève"}</p>
                        <Badge bg={meta.bg} fg={meta.fg}>{isPastProg ? "À réaliser" : meta.label}</Badge>
                        {needsReport && <Badge bg="#f8eccb" fg="#8f5912">Compte rendu à rédiger</Badge>}
                      </div>
                      <p className="mt-1 text-xs text-pine-500">{fmtDateLong(s.date)} · avec {pro ? fullName(pro) : "—"}</p>
                      <p className="mt-1 truncate text-[12px] text-pine-600"><strong>Objectif :</strong> {s.objective}</p>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      {s.reportId && (
                        <Button size="sm" variant="secondary" onClick={() => setViewReport(s.reportId!)}><Eye size={13} /> Compte rendu</Button>
                      )}
                      {needsReport && me.role !== "admin" && (
                        <Button size="sm" variant="marigold" onClick={() => setReportSession(s)}><PenLine size={13} /> Rédiger</Button>
                      )}
                      {s.status === "programmee" && s.date >= today && (
                        <>
                          <Button size="sm" variant="ghost" onClick={() => { setEditing(s); setCreateOpen(true); }}>Modifier</Button>
                          <Button size="sm" variant="ghost" onClick={() => state.setSessionStatus(s.id, "realisee")} aria-label="Marquer réalisée"><Check size={14} className="text-pine-600" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => state.setSessionStatus(s.id, "reportee")} aria-label="Reporter"><CalendarClock size={14} className="text-marigold-600" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => state.setSessionStatus(s.id, "annulee")} aria-label="Annuler"><Ban size={14} className="text-coral-600" /></Button>
                        </>
                      )}
                      {isPastProg && (
                        <>
                          <Button size="sm" variant="secondary" onClick={() => state.setSessionStatus(s.id, "realisee")}><Check size={13} /> Réalisée</Button>
                          <Button size="sm" variant="ghost" onClick={() => state.setSessionStatus(s.id, "annulee")}><Ban size={13} /> Annuler</Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </div>
      )}

      {createOpen && (
        <SessionFormModal key={editing?.id ?? "nouvelle"} open onClose={() => setCreateOpen(false)} editing={editing} />
      )}
      <ReportModal open={reportSession !== null} onClose={() => setReportSession(null)} session={reportSession} />
      <ReportViewModal open={viewReport !== null} onClose={() => setViewReport(null)} reportId={viewReport} />
    </div>
  );
}
