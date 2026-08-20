import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Target, Plus, BarChart3, Library, FileText, Settings, Printer, X, Users, Search,
  Sparkles, ShieldCheck, RotateCcw, Eye, PenLine, Award, CheckCircle2,
} from "lucide-react";
import { Avatar, Badge, Button, Card, EmptyState, Field, Modal, ProgressBar, Reveal, Tabs, inputCls } from "../components/ui";
import { useApp, visibleStudents } from "../lib/store";
import {
  COMPETENCIES, DIFFICULTIES, GOAL_STATUSES, RESOURCE_CATEGORIES, fmtDate, fmtDateFull, fmtDateLong, fullName, studentProgress, todayISO,
  type Goal, type GoalStatus, type Resource, type ResourceCategory, type ResourceType,
} from "../lib/data";

/* ================================ OBJECTIFS ================================ */

export function GoalsPage() {
  const state = useApp();
  const me = state.currentUser!;
  const students = visibleStudents(state);
  const [statusFilter, setStatusFilter] = useState("tous");
  const canEdit = me.role === "admin" || me.role === "professional";

  const goals = state.goals
    .filter((g) => students.some((s) => s.id === g.studentId))
    .filter((g) => statusFilter === "tous" || g.status === statusFilter)
    .sort((a, b) => a.status.localeCompare(b.status) || b.progress - a.progress);

  const counts = {
    tous: state.goals.filter((g) => students.some((s) => s.id === g.studentId)).length,
    a_commencer: state.goals.filter((g) => students.some((s) => s.id === g.studentId) && g.status === "a_commencer").length,
    en_cours: state.goals.filter((g) => students.some((s) => s.id === g.studentId) && g.status === "en_cours").length,
    atteint: state.goals.filter((g) => students.some((s) => s.id === g.studentId) && g.status === "atteint").length,
  };

  return (
    <div className="space-y-6">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-pine-500">Parcours d'accompagnement</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-pine-950 sm:text-3xl">Objectifs pédagogiques</h2>
            <p className="mt-1 text-sm text-pine-600">Chaque objectif est personnel, mesurable et partagé avec la famille.</p>
          </div>
        </div>
      </Reveal>
      <Reveal delay={80}>
        <Tabs
          tabs={[
            { id: "tous", label: "Tous", count: counts.tous },
            { id: "a_commencer", label: "À commencer", count: counts.a_commencer },
            { id: "en_cours", label: "En cours", count: counts.en_cours },
            { id: "atteint", label: "Atteints", count: counts.atteint },
          ]}
          active={statusFilter}
          onChange={setStatusFilter}
        />
      </Reveal>
      {goals.length === 0 ? (
        <EmptyState icon={<Target size={26} />} title="Aucun objectif dans cette vue" text="Modifiez le filtre ou consultez la fiche d'un élève pour créer un objectif." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {goals.map((g, i) => {
            const st = state.students.find((s) => s.id === g.studentId);
            const meta = GOAL_STATUSES[g.status];
            return (
              <Reveal key={g.id} delay={Math.min(i, 6) * 50}>
                <Card className="h-full p-5 transition-all hover:shadow-lift">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-marigold-600">{g.competency}</p>
                      <h3 className="mt-0.5 font-display text-[15px] font-bold leading-snug text-pine-950">{g.title}</h3>
                    </div>
                    <Badge bg={meta.bg} fg={meta.fg}>{meta.label}</Badge>
                  </div>
                  <Link to={`/dashboard/students/${g.studentId}`} className="mt-2 flex w-fit items-center gap-2 rounded-full bg-pine-50 py-1 pl-1 pr-3 text-[11px] font-bold text-pine-700 transition-colors hover:bg-pine-100">
                    <Avatar name={st ? fullName(st) : "?"} size={20} /> {st ? fullName(st) : ""} · {st?.schoolLevel}
                  </Link>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1"><ProgressBar value={g.progress} height={7} color={g.status === "atteint" ? "#37856d" : "#d2921a"} /></div>
                    <span className="text-xs font-bold text-pine-700">{g.progress} %</span>
                  </div>
                  {canEdit && g.status !== "atteint" && (
                    <input
                      type="range" min={0} max={100} step={5} value={g.progress}
                      onChange={(e) => state.updateGoal(g.id, { progress: Number(e.target.value), status: Number(e.target.value) >= 100 ? "atteint" : Number(e.target.value) > 0 ? "en_cours" : g.status })}
                      className="mt-2 w-full accent-pine-700" aria-label={`Ajuster la progression de ${g.title}`}
                    />
                  )}
                  <div className="mt-3 flex items-center justify-between text-[11px] text-pine-500">
                    <span>Du {fmtDate(g.startDate)} au {fmtDate(g.targetDate)}</span>
                    {g.status === "atteint" && <span className="flex items-center gap-1 font-bold text-pine-700"><Award size={12} className="text-marigold-500" /> Bravo !</span>}
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ================================ ÉVALUATIONS ================================ */

export function EvaluationsPage() {
  const state = useApp();
  const me = state.currentUser!;
  const students = visibleStudents(state);
  const [studentFilter, setStudentFilter] = useState("tous");
  const [compFilter, setCompFilter] = useState("toutes");
  const [modal, setModal] = useState(false);
  const canEdit = me.role === "admin" || me.role === "professional";

  const evals = state.evaluations
    .filter((e) => students.some((s) => s.id === e.studentId))
    .filter((e) => (studentFilter === "tous" || e.studentId === studentFilter) && (compFilter === "toutes" || e.competency === compFilter))
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-pine-500">{evals.length} évaluation{evals.length > 1 ? "s" : ""}</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-pine-950 sm:text-3xl">Évaluations</h2>
            <p className="mt-1 text-sm text-pine-600">Des mesures régulières et bienveillantes, par compétence.</p>
          </div>
          {canEdit && <Button onClick={() => setModal(true)}><Plus size={16} /> Nouvelle évaluation</Button>}
        </div>
      </Reveal>
      <Reveal delay={80}>
        <div className="grid gap-3 sm:grid-cols-2 lg:max-w-xl">
          <select className={inputCls()} value={studentFilter} onChange={(e) => setStudentFilter(e.target.value)} aria-label="Filtrer par élève">
            <option value="tous">Tous les élèves</option>
            {students.map((s) => <option key={s.id} value={s.id}>{fullName(s)}</option>)}
          </select>
          <select className={inputCls()} value={compFilter} onChange={(e) => setCompFilter(e.target.value)} aria-label="Filtrer par compétence">
            <option value="toutes">Toutes les compétences</option>
            {COMPETENCIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </Reveal>
      {evals.length === 0 ? (
        <EmptyState icon={<BarChart3 size={26} />} title="Aucune évaluation" text="Les évaluations permettent d'objectiver les progrès et d'ajuster le parcours." action={canEdit ? <Button onClick={() => setModal(true)}><Plus size={15} /> Évaluer</Button> : undefined} />
      ) : (
        <div className="space-y-3">
          {evals.map((e, i) => {
            const st = state.students.find((s) => s.id === e.studentId);
            const p = state.users.find((u) => u.id === e.professionalId);
            return (
              <Reveal key={e.id} delay={Math.min(i, 8) * 40}>
                <Card className="p-5 transition-all hover:shadow-lift">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex w-44 shrink-0 items-center gap-3">
                      <Avatar name={st ? fullName(st) : "?"} size={38} />
                      <div>
                        <p className="text-[13px] font-bold text-pine-900">{st ? fullName(st) : ""}</p>
                        <p className="text-[11px] text-pine-500">{st?.schoolLevel}</p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-[13px] font-bold text-pine-900">{e.competency}</p>
                        <span className="font-display text-lg font-bold text-pine-800">{e.score}<span className="text-xs text-pine-400">/10</span></span>
                      </div>
                      <div className="mt-1.5"><ProgressBar value={e.score * 10} height={7} color={e.score >= 7 ? "#1f6c57" : e.score >= 5 ? "#d2921a" : "#c75540"} /></div>
                      <p className="mt-2 text-[12px] italic text-pine-600">« {e.comment} »</p>
                    </div>
                    <p className="shrink-0 text-right text-[11px] text-pine-500">{fmtDateFull(e.date)}<br />{p ? `par ${p.firstName} ${p.lastName}` : ""}</p>
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </div>
      )}
      {canEdit && <EvaluationModal open={modal} onClose={() => setModal(false)} students={students.map((s) => ({ id: s.id, name: fullName(s) }))} />}
    </div>
  );
}

function EvaluationModal({ open, onClose, students }: { open: boolean; onClose: () => void; students: { id: string; name: string }[] }) {
  const state = useApp();
  const me = state.currentUser!;
  const [form, setForm] = useState({ studentId: students[0]?.id ?? "", competency: COMPETENCIES[0], score: 5, comment: "", date: todayISO() });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.comment.trim().length < 10) errs.comment = "Ajoutez une observation (10 caractères min.).";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    state.addEvaluation({ ...form, professionalId: me.id, score: form.score });
    setForm({ ...form, comment: "", score: 5 });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Nouvelle évaluation">
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Élève">
            <select className={inputCls()} value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })}>
              {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </Field>
          <Field label="Compétence">
            <select className={inputCls()} value={form.competency} onChange={(e) => setForm({ ...form, competency: e.target.value })}>
              {COMPETENCIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label={`Score : ${form.score}/10`}>
            <input type="range" min={0} max={10} step={0.5} value={form.score} onChange={(e) => setForm({ ...form, score: Number(e.target.value) })} className="mt-3 w-full accent-pine-700" aria-label="Score sur 10" />
          </Field>
          <Field label="Date">
            <input type="date" max={todayISO()} className={inputCls()} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </Field>
        </div>
        <Field label="Observation" error={errors.comment}>
          <textarea rows={3} className={inputCls(errors.comment)} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="Ex. : L'élève progresse dans l'identification des informations principales." />
        </Field>
        <div className="flex justify-end gap-3 border-t border-pine-100 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>Annuler</Button>
          <Button type="submit"><BarChart3 size={15} /> Enregistrer</Button>
        </div>
      </form>
    </Modal>
  );
}

/* ================================ RESSOURCES ================================ */

export function ResourcesPage() {
  const state = useApp();
  const me = state.currentUser!;
  const students = visibleStudents(state);
  const [cat, setCat] = useState("Toutes");
  const [query, setQuery] = useState("");
  const [assignTarget, setAssignTarget] = useState<Resource | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const canEdit = me.role === "admin" || me.role === "professional";

  const mineIds = students.map((s) => s.id);
  const resources = state.resources.filter((r) => {
    if (!canEdit) {
      if (r.assignedTo.length > 0 && !r.assignedTo.some((id) => mineIds.includes(id))) return false;
    }
    const matchCat = cat === "Toutes" || r.category === cat;
    const q = query.trim().toLowerCase();
    const matchQ = !q || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  const typeColor: Record<ResourceType, string> = { PDF: "#c75540", Fiche: "#3f6577", "Vidéo": "#b37413", Lien: "#5f8ca0", "Activité": "#1f6c57" };

  return (
    <div className="space-y-6">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-pine-500">Bibliothèque pédagogique</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-pine-950 sm:text-3xl">Ressources</h2>
            <p className="mt-1 text-sm text-pine-600">
              {canEdit ? "Sélectionnez et attribuez des supports adaptés à chaque élève." : "Les ressources attribuées par votre professionnel, à utiliser à la maison."}
            </p>
          </div>
          {canEdit && <Button onClick={() => setCreateOpen(true)}><Plus size={16} /> Ajouter une ressource</Button>}
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="space-y-3">
          <div className="relative lg:max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pine-400" />
            <input className={`${inputCls()} pl-10`} placeholder="Rechercher une ressource…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Rechercher une ressource" />
          </div>
          <div className="flex flex-wrap gap-2">
            {["Toutes", ...RESOURCE_CATEGORIES].map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${cat === c ? "bg-pine-800 text-paper shadow-soft" : "bg-pine-100/80 text-pine-700 hover:bg-pine-200"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {resources.length === 0 ? (
        <EmptyState icon={<Library size={26} />} title="Aucune ressource trouvée" text="Modifiez votre recherche ou explorez une autre catégorie." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((r, i) => {
            const assigned = state.students.filter((s) => r.assignedTo.includes(s.id));
            return (
              <Reveal key={r.id} delay={Math.min(i, 8) * 50}>
                <Card className="flex h-full flex-col p-5 transition-all hover:-translate-y-1 hover:shadow-lift">
                  <div className="flex items-center justify-between">
                    <Badge bg="#dcebe4" fg="#175745">{r.category}</Badge>
                    <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide" style={{ backgroundColor: `${typeColor[r.type]}18`, color: typeColor[r.type] }}>{r.type}</span>
                  </div>
                  <h3 className="mt-3.5 font-display text-[15px] font-bold leading-snug text-pine-950">{r.title}</h3>
                  <p className="mt-2 flex-1 text-[12px] leading-relaxed text-pine-600">{r.description}</p>
                  <div className="mt-4 border-t border-pine-100 pt-3.5">
                    {assigned.length > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <div className="flex -space-x-2">
                          {assigned.slice(0, 3).map((s) => <Avatar key={s.id} name={fullName(s)} size={24} />)}
                        </div>
                        <p className="text-[11px] font-semibold text-pine-500">Attribuée à {assigned.map((s) => s.firstName).join(", ")}</p>
                      </div>
                    ) : (
                      <p className="text-[11px] font-semibold text-pine-400">Non attribuée</p>
                    )}
                    {canEdit && (
                      <Button size="sm" variant="secondary" className="mt-3 w-full" onClick={() => setAssignTarget(r)}>
                        <Users size={13} /> Attribuer à un élève
                      </Button>
                    )}
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </div>
      )}

      {assignTarget && (
        <AssignModal resource={assignTarget} onClose={() => setAssignTarget(null)} candidates={visibleStudents(state)} />
      )}
      <ResourceFormModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}

function AssignModal({ resource, onClose, candidates }: { resource: Resource; onClose: () => void; candidates: { id: string; firstName: string; lastName: string; schoolLevel: string }[] }) {
  const state = useApp();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <Modal open onClose={onClose} title={`Attribuer « ${resource.title} »`}>
      <p className="text-xs text-pine-500">Les familles et les élèves concernés recevront une notification.</p>
      <div className="mt-4 space-y-2">
        {candidates.map((s) => {
          const already = resource.assignedTo.includes(s.id);
          const on = selected.includes(s.id) || already;
          return (
            <button key={s.id} onClick={() => !already && toggle(s.id)} disabled={already} aria-pressed={on} className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all cursor-pointer disabled:cursor-default ${on ? "border-pine-300 bg-pine-50" : "border-pine-100 bg-white hover:border-pine-300"}`}>
              <Avatar name={fullName(s)} size={32} />
              <span className="flex-1">
                <span className="block text-[13px] font-bold text-pine-900">{fullName(s)}</span>
                <span className="text-[11px] text-pine-500">{s.schoolLevel}</span>
              </span>
              {already ? <Badge bg="#dcebe4" fg="#175745">Déjà attribuée</Badge> : <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${on ? "border-pine-600 bg-pine-600 text-paper" : "border-pine-300"}`}>{on && <CheckCircle2 size={13} />}</span>}
            </button>
          );
        })}
        {candidates.length === 0 && <p className="py-6 text-center text-sm text-pine-500">Aucun élève disponible.</p>}
      </div>
      <div className="mt-5 flex justify-end gap-3 border-t border-pine-100 pt-4">
        <Button variant="ghost" onClick={onClose}>Fermer</Button>
        <Button disabled={selected.length === 0} onClick={() => { state.assignResource(resource.id, selected); onClose(); }}>
          <Users size={14} /> Attribuer ({selected.length})
        </Button>
      </div>
    </Modal>
  );
}

function ResourceFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const state = useApp();
  const [form, setForm] = useState({ title: "", description: "", category: "Lecture" as ResourceCategory, type: "PDF" as ResourceType });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.title.trim().length < 4) errs.title = "Titre requis.";
    if (form.description.trim().length < 10) errs.description = "Description requise.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    state.addResource({ ...form, assignedTo: [] });
    setForm({ title: "", description: "", category: "Lecture", type: "PDF" });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Ajouter une ressource">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Titre" error={errors.title}>
          <input className={inputCls(errors.title)} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex. : Fiches de lecture progressives" />
        </Field>
        <Field label="Description" error={errors.description}>
          <textarea rows={3} className={inputCls(errors.description)} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="À quoi sert cette ressource, pour quel niveau…" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Catégorie">
            <select className={inputCls()} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ResourceCategory })}>
              {RESOURCE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Type">
            <select className={inputCls()} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ResourceType })}>
              {(["PDF", "Fiche", "Vidéo", "Lien", "Activité"] as ResourceType[]).map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
        </div>
        <div className="flex justify-end gap-3 border-t border-pine-100 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>Annuler</Button>
          <Button type="submit"><Plus size={15} /> Ajouter</Button>
        </div>
      </form>
    </Modal>
  );
}

/* ================================ RAPPORTS ================================ */

export interface ReportData {
  student: { name: string; age: number; level: string; school: string; parent: string; professional: string; since: string };
  difficulties: string[];
  goals: { title: string; competency: string; progress: number; status: string; target: string }[];
  evaluations: { competency: string; score: number; comment: string; date: string }[];
  sessionsDone: number;
  lastReports: { date: string; type: string; progress: string; recommendations: string; nextSteps: string }[];
  recommendations: string[];
  globalProgress: number;
  generatedAt: string;
}

export function buildReport(state: ReturnType<typeof useApp.getState>, studentId: string): ReportData {
  const student = state.students.find((s) => s.id === studentId)!;
  const pro = state.users.find((u) => u.id === student.professionalId);
  const parent = state.users.find((u) => u.id === student.parentId);
  const goals = state.goals.filter((g) => g.studentId === studentId);
  const evals = state.evaluations.filter((e) => e.studentId === studentId).sort((a, b) => b.date.localeCompare(a.date));
  const done = state.sessions.filter((s) => s.studentId === studentId && s.status === "realisee");
  const reps = done
    .filter((s) => s.reportId)
    .map((s) => ({ session: s, report: state.reports.find((r) => r.id === s.reportId)! }))
    .sort((a, b) => b.session.date.localeCompare(a.session.date))
    .slice(0, 3);
  const recommendations = Array.from(new Set(reps.map((r) => r.report.recommendations).filter(Boolean)));
  return {
    student: {
      name: fullName(student),
      age: Math.floor((Date.now() - new Date(student.birthDate + "T00:00:00").getTime()) / (365.25 * 86400000)),
      level: student.schoolLevel,
      school: student.school,
      parent: parent ? fullName(parent) : "—",
      professional: pro ? `${fullName(pro)} — ${pro.specialty}` : "—",
      since: fmtDateFull(student.joinedAt),
    },
    difficulties: student.difficulties.map((d) => DIFFICULTIES.find((x) => x.id === d)?.label ?? d),
    goals: goals.map((g) => ({ title: g.title, competency: g.competency, progress: g.progress, status: GOAL_STATUSES[g.status].label, target: fmtDate(g.targetDate) })),
    evaluations: evals.slice(0, 6).map((e) => ({ competency: e.competency, score: e.score, comment: e.comment, date: fmtDate(e.date) })),
    sessionsDone: done.length,
    lastReports: reps.map((r) => ({ date: fmtDateLong(r.session.date), type: r.session.type, progress: r.report.progress, recommendations: r.report.recommendations, nextSteps: r.report.nextSteps })),
    recommendations,
    globalProgress: studentProgress(state.goals, studentId),
    generatedAt: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
  };
}

export function ReportPreview({ report, onClose }: { report: ReportData; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[85] overflow-y-auto nice-scroll bg-pine-950/60 p-0 backdrop-blur-[2px] sm:p-8" role="dialog" aria-modal="true" aria-label="Aperçu du rapport">
      <div className="mx-auto max-w-3xl">
        <div className="no-print sticky top-0 z-10 flex items-center justify-between gap-3 bg-paper/95 px-5 py-3.5 shadow-soft sm:rounded-t-2xl">
          <p className="font-display text-sm font-bold text-pine-900">Rapport de suivi — {report.student.name}</p>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => window.print()}><Printer size={14} /> Imprimer / PDF</Button>
            <Button size="sm" variant="ghost" onClick={onClose} aria-label="Fermer"><X size={16} /></Button>
          </div>
        </div>
        <div id="print-area" className="bg-white px-7 py-8 shadow-lift sm:rounded-b-2xl sm:px-10 sm:py-10">
          <div className="border-b-2 border-pine-800 pb-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-pine-600">Clinique d'Éducation & de l'Innovation Pédagogique</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-pine-950 sm:text-3xl">Rapport de suivi pédagogique</h2>
            <p className="mt-1 text-sm text-pine-600">Généré le {report.generatedAt} · Document confidentiel</p>
          </div>

          <section className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2.5 text-[13px] sm:grid-cols-3">
            {[["Élève", report.student.name], ["Âge", `${report.student.age} ans`], ["Niveau", report.student.level], ["Établissement", report.student.school], ["Parent / tuteur", report.student.parent], ["Professionnel référent", report.student.professional], ["Accompagné depuis", report.student.since], ["Séances réalisées", String(report.sessionsDone)], ["Progression globale", `${report.globalProgress} %`]].map(([l, v]) => (
              <p key={l}><span className="block text-[10px] font-bold uppercase tracking-wider text-pine-500">{l}</span><span className="font-semibold text-pine-900">{v}</span></p>
            ))}
          </section>

          <section className="mt-7">
            <h3 className="font-display text-base font-bold text-pine-900">1 · Difficultés identifiées</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {report.difficulties.map((d) => <span key={d} className="rounded-full bg-pine-100 px-3 py-1 text-xs font-bold text-pine-800">{d}</span>)}
            </div>
          </section>

          <section className="mt-7">
            <h3 className="font-display text-base font-bold text-pine-900">2 · Objectifs du parcours</h3>
            <div className="mt-3 space-y-2.5">
              {report.goals.map((g) => (
                <div key={g.title} className="rounded-xl border border-pine-100 p-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[13px] font-bold text-pine-900">{g.title} <span className="font-normal text-pine-500">· {g.competency}</span></p>
                    <span className="shrink-0 text-xs font-bold text-pine-700">{g.status} — {g.progress} %</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-pine-100"><div className="h-full rounded-full bg-pine-600" style={{ width: `${g.progress}%` }} /></div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-7">
            <h3 className="font-display text-base font-bold text-pine-900">3 · Évaluations récentes</h3>
            <table className="mt-3 w-full text-left text-[12px]">
              <thead><tr className="border-b border-pine-200 text-[10px] uppercase tracking-wider text-pine-500"><th className="py-2 pr-3">Compétence</th><th className="py-2 pr-3">Score</th><th className="py-2 pr-3">Observation</th><th className="py-2">Date</th></tr></thead>
              <tbody>
                {report.evaluations.map((e, i) => (
                  <tr key={i} className="border-b border-pine-50 align-top">
                    <td className="py-2.5 pr-3 font-bold text-pine-900">{e.competency}</td>
                    <td className="py-2.5 pr-3 font-display font-bold text-pine-700">{e.score}/10</td>
                    <td className="py-2.5 pr-3 text-pine-600">{e.comment}</td>
                    <td className="py-2.5 text-pine-500">{e.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="mt-7">
            <h3 className="font-display text-base font-bold text-pine-900">4 · Dernières séances & progrès</h3>
            <div className="mt-3 space-y-3">
              {report.lastReports.map((r, i) => (
                <div key={i} className="rounded-xl bg-pine-50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-pine-500">{r.type} · {r.date}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-pine-800"><strong>Progrès :</strong> {r.progress}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-pine-800"><strong>Prochaine étape :</strong> {r.nextSteps}</p>
                </div>
              ))}
              {report.lastReports.length === 0 && <p className="text-sm text-pine-500">Aucun compte rendu disponible pour la période.</p>}
            </div>
          </section>

          <section className="mt-7">
            <h3 className="font-display text-base font-bold text-pine-900">5 · Recommandations pour la famille</h3>
            <ul className="mt-3 space-y-2">
              {report.recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-pine-800">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-marigold-500" /> {r}
                </li>
              ))}
              {report.recommendations.length === 0 && <li className="text-sm text-pine-500">Les recommandations apparaîtront après les premières séances.</li>}
            </ul>
          </section>

          <p className="mt-9 border-t border-pine-100 pt-4 text-[11px] leading-relaxed text-pine-500">
            Ce rapport est un document pédagogique interne à la Clinique d'Éducation & de l'Innovation Pédagogique. Il ne constitue en aucun cas un diagnostic médical ou psychologique.
            « Accompagner, soutenir et réussir. »
          </p>
        </div>
      </div>
    </div>
  );
}

export function ReportsPage() {
  const state = useApp();
  const students = visibleStudents(state);
  const [preview, setPreview] = useState<ReportData | null>(null);

  const reportSessions = state.reports
    .map((r) => ({ r, s: state.sessions.find((s) => s.id === r.sessionId) }))
    .filter((x) => x.s && students.some((st) => st.id === x.s!.studentId))
    .sort((a, b) => b.r.createdAt.localeCompare(a.r.createdAt));

  return (
    <div className="space-y-6">
      <Reveal>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-pine-500">Synthèses & exports</p>
          <h2 className="mt-1 font-display text-2xl font-bold text-pine-950 sm:text-3xl">Rapports de suivi</h2>
          <p className="mt-1 text-sm text-pine-600">Générez une synthèse complète du parcours d'un élève, prête à imprimer ou à partager avec la famille.</p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <Card className="p-6">
          <h3 className="font-display text-lg font-bold text-pine-950">Générer un rapport</h3>
          <p className="mt-1 text-xs text-pine-500">Le rapport compile automatiquement objectifs, évaluations, comptes rendus et recommandations.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {students.map((s) => (
              <div key={s.id} className="flex items-center gap-3 rounded-xl border border-pine-100 bg-white/70 p-3.5 transition-all hover:border-pine-300 hover:shadow-soft">
                <Avatar name={fullName(s)} size={38} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-pine-900">{fullName(s)}</p>
                  <p className="text-[11px] text-pine-500">{studentProgress(state.goals, s.id)} % de progression</p>
                </div>
                <Button size="sm" variant="secondary" onClick={() => setPreview(buildReport(state, s.id))}><FileText size={13} /> Générer</Button>
              </div>
            ))}
          </div>
        </Card>
      </Reveal>

      <Reveal delay={140}>
        <Card className="p-6">
          <h3 className="font-display text-lg font-bold text-pine-950">Comptes rendus disponibles ({reportSessions.length})</h3>
          <div className="mt-4 space-y-2.5">
            {reportSessions.map(({ r, s }) => {
              const st = state.students.find((x) => x.id === s!.studentId);
              return (
                <div key={r.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-pine-100 bg-white/70 p-4">
                  <span className="rounded-lg bg-pine-100 p-2 text-pine-700"><PenLine size={15} /></span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold text-pine-900">{s!.type} — {st ? fullName(st) : ""}</p>
                    <p className="truncate text-[11px] text-pine-500">{fmtDateLong(s!.date)} · {r.progress}</p>
                  </div>
                  <ReportQuickView reportId={r.id} />
                </div>
              );
            })}
            {reportSessions.length === 0 && <p className="py-6 text-center text-sm text-pine-500">Aucun compte rendu pour le moment.</p>}
          </div>
        </Card>
      </Reveal>

      {preview && <ReportPreview report={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}

function ReportQuickView({ reportId }: { reportId: string }) {
  const [open, setOpen] = useState(false);
  const state = useApp();
  const report = state.reports.find((r) => r.id === reportId);
  if (!report) return null;
  return (
    <>
      <Button size="sm" variant="ghost" onClick={() => setOpen(true)}><Eye size={13} /> Voir</Button>
      {open && (
        <Modal open onClose={() => setOpen(false)} title="Compte rendu de séance">
          <div className="space-y-3">
            {[["Objectif", report.objective], ["Activités", report.activities], ["Progrès observés", report.progress], ["Recommandations", report.recommendations], ["Prochaine étape", report.nextSteps]].map(([l, v]) => (
              <div key={l} className="rounded-xl border border-pine-100 bg-white p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-pine-500">{l}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-pine-800">{v}</p>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
}

/* ================================ PARAMÈTRES ================================ */

export function SettingsPage() {
  const state = useApp();
  const me = state.currentUser!;
  const [form, setForm] = useState({ firstName: me.firstName, lastName: me.lastName, email: me.email, phone: me.phone ?? "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [prefs, setPrefs] = useState({ emailNotif: true, smsNotif: false, weeklySummary: true });

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.firstName.trim().length < 2) errs.firstName = "Prénom requis.";
    if (form.lastName.trim().length < 2) errs.lastName = "Nom requis.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "E-mail invalide.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    state.updateUser(me.id, { firstName: form.firstName.trim(), lastName: form.lastName.trim(), email: form.email.trim(), phone: form.phone || undefined });
  };

  const Toggle = ({ on, onChange, label, desc }: { on: boolean; onChange: () => void; label: string; desc: string }) => (
    <button onClick={onChange} className="flex w-full items-center justify-between gap-4 rounded-xl border border-pine-100 bg-white/70 p-4 text-left transition-all hover:border-pine-300 cursor-pointer" role="switch" aria-checked={on}>
      <span>
        <span className="block text-[13px] font-bold text-pine-900">{label}</span>
        <span className="block text-[11px] text-pine-500">{desc}</span>
      </span>
      <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? "bg-pine-700" : "bg-pine-200"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-soft transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
      </span>
    </button>
  );

  return (
    <div className="space-y-6">
      <Reveal>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-pine-500">Compte & plateforme</p>
          <h2 className="mt-1 font-display text-2xl font-bold text-pine-950 sm:text-3xl">Paramètres</h2>
        </div>
      </Reveal>
      <div className="grid gap-5 lg:grid-cols-2">
        <Reveal>
          <Card className="p-6">
            <h3 className="font-display text-lg font-bold text-pine-950">Mon profil</h3>
            <form onSubmit={saveProfile} className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Prénom" error={errors.firstName}><input className={inputCls(errors.firstName)} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></Field>
                <Field label="Nom" error={errors.lastName}><input className={inputCls(errors.lastName)} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></Field>
              </div>
              <Field label="E-mail" error={errors.email}><input type="email" className={inputCls(errors.email)} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
              <Field label="Téléphone"><input className={inputCls()} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="06 12 34 56 78" /></Field>
              <Button type="submit">Enregistrer les modifications</Button>
            </form>
          </Card>
        </Reveal>
        <div className="space-y-5">
          <Reveal delay={80}>
            <Card className="p-6">
              <h3 className="font-display text-lg font-bold text-pine-950">Notifications</h3>
              <div className="mt-4 space-y-2.5">
                <Toggle on={prefs.emailNotif} onChange={() => setPrefs({ ...prefs, emailNotif: !prefs.emailNotif })} label="Notifications par e-mail" desc="Séances, comptes rendus et nouvelles ressources." />
                <Toggle on={prefs.smsNotif} onChange={() => setPrefs({ ...prefs, smsNotif: !prefs.smsNotif })} label="Rappels par SMS" desc="Rappel la veille de chaque séance." />
                <Toggle on={prefs.weeklySummary} onChange={() => setPrefs({ ...prefs, weeklySummary: !prefs.weeklySummary })} label="Résumé hebdomadaire" desc="Un point de progression chaque dimanche soir." />
              </div>
            </Card>
          </Reveal>
          <Reveal delay={140}>
            <div className="rounded-2xl border border-dashed border-marigold-300 bg-marigold-50 p-6">
              <p className="flex items-center gap-2 font-display text-base font-bold text-pine-950"><Sparkles size={17} className="text-marigold-600" /> Assistant IA pédagogique</p>
              <p className="mt-2 text-[12px] leading-relaxed text-pine-700">
                Analyse des observations, suggestions d'activités, synthèse des parcours et détection de tendances : l'architecture de la plateforme est prête à accueillir l'assistant.
                Il restera un outil d'aide pédagogique — <strong>jamais de diagnostic médical ou psychologique</strong>.
              </p>
              <Badge bg="#f8eccb" fg="#8f5912">En préparation — non activé</Badge>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <Card className="p-6">
              <h3 className="flex items-center gap-2 font-display text-lg font-bold text-pine-950"><ShieldCheck size={17} className="text-pine-600" /> Sécurité & données</h3>
              <ul className="mt-3 space-y-2 text-[12px] leading-relaxed text-pine-600">
                <li>• Authentification avec contrôle des rôles (administrateur, professionnel, parent, élève).</li>
                <li>• Chaque utilisateur n'accède qu'aux élèves qui lui sont rattachés.</li>
                <li>• Les données des élèves sont confidentielles et exportables sur demande.</li>
                <li>• Architecture prête pour Supabase (PostgreSQL + Auth + RLS) en production.</li>
              </ul>
              {me.role === "admin" && (
                <Button variant="danger" size="sm" className="mt-4" onClick={() => state.resetDemo()}>
                  <RotateCcw size={14} /> Réinitialiser les données de démonstration
                </Button>
              )}
            </Card>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
