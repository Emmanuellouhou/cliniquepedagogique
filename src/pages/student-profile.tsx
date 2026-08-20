import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, Building2, Cake, GraduationCap, HeartHandshake, UserCheck, FileText, Target,
  TrendingUp, ClipboardList, Plus, CalendarPlus, PenLine, Eye, Award, BookOpen, Sparkles,
} from "lucide-react";
import { Avatar, Badge, Button, Card, EmptyState, Field, Modal, ProgressBar, Reveal, Ring, Tabs, TrendArea, inputCls } from "../components/ui";
import { useApp } from "../lib/store";
import {
  COMPETENCIES, DIFFICULTIES, GOAL_STATUSES, SESSION_STATUSES, SESSION_TYPE_COLORS,
  ageFrom, fmtDate, fmtDateFull, fmtDateLong, fullName, studentProgress, todayISO,
  type Goal, type GoalStatus,
} from "../lib/data";
import { STATUS_META } from "./students";
import { SessionFormModal, ReportModal, ReportViewModal } from "./sessions";
import { ReportPreview, buildReport } from "./modules";

export function StudentProfilePage() {
  const { id } = useParams();
  const state = useApp();
  const me = state.currentUser!;
  const student = state.students.find((s) => s.id === id);
  const [tab, setTab] = useState("apercu");
  const [goalModal, setGoalModal] = useState(false);
  const [sessionModal, setSessionModal] = useState(false);
  const [reportSession, setReportSession] = useState<string | null>(null);
  const [viewReport, setViewReport] = useState<string | null>(null);
  const [reportOpen, setReportOpen] = useState(false);

  const canEdit = me.role === "admin" || (me.role === "professional" && student?.professionalId === me.id);

  const goals = useMemo(() => (student ? state.goals.filter((g) => g.studentId === student.id) : []), [state.goals, student]);
  const sessions = useMemo(
    () => (student ? state.sessions.filter((s) => s.studentId === student.id).sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`)) : []),
    [state.sessions, student]
  );
  const evals = useMemo(
    () => (student ? state.evaluations.filter((e) => e.studentId === student.id).sort((a, b) => b.date.localeCompare(a.date)) : []),
    [state.evaluations, student]
  );

  if (!student) {
    return (
      <EmptyState
        icon={<GraduationCap size={26} />}
        title="Élève introuvable"
        text="Ce dossier n'existe pas ou vous n'avez pas l'autorisation d'y accéder."
        action={<Link to="/dashboard/students"><Button variant="secondary"><ArrowLeft size={15} /> Retour aux élèves</Button></Link>}
      />
    );
  }

  const pro = state.users.find((u) => u.id === student.professionalId);
  const parent = state.users.find((u) => u.id === student.parentId);
  const prog = studentProgress(state.goals, student.id);
  const reportSessionObj = sessions.find((s) => s.id === reportSession) ?? null;

  const skills = [...new Set(evals.map((e) => e.competency))].map((c) => {
    const latest = evals.filter((e) => e.competency === c).sort((a, b) => b.date.localeCompare(a.date))[0];
    const first = evals.filter((e) => e.competency === c).sort((a, b) => a.date.localeCompare(b.date))[0];
    return { c, score: latest.score, delta: latest.score - first.score };
  }).sort((a, b) => b.score - a.score);

  const evolution = [...evals].sort((a, b) => a.date.localeCompare(b.date)).map((e, i) => ({ name: `S${i + 1}`, value: e.score }));

  return (
    <div className="space-y-6">
      <Reveal>
        <Link to="/dashboard/students" className="inline-flex items-center gap-2 text-xs font-bold text-pine-600 hover:text-pine-800">
          <ArrowLeft size={14} /> Retour aux élèves
        </Link>
      </Reveal>

      {/* En-tête profil */}
      <Reveal>
        <Card className="overflow-hidden">
          <div className="h-20 bg-pine-800 relative">
            <div className="absolute inset-0 bg-grid-soft opacity-30" />
          </div>
          <div className="flex flex-col gap-5 px-6 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-wrap items-end gap-4 -mt-10">
              <span className="rounded-full ring-4 ring-white"><Avatar name={fullName(student)} size={84} /></span>
              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="font-display text-2xl font-bold text-pine-950 sm:text-3xl">{fullName(student)}</h2>
                  <Badge bg={STATUS_META[student.status].bg} fg={STATUS_META[student.status].fg}>{STATUS_META[student.status].label}</Badge>
                </div>
                <p className="mt-1 text-sm text-pine-600">{ageFrom(student.birthDate)} ans · {student.schoolLevel} · {student.school}</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="text-right">
                <p className="text-[11px] font-bold uppercase tracking-wider text-pine-500">Progression globale</p>
                <p className="font-display text-xl font-bold text-pine-800">{prog} %</p>
              </div>
              <Ring value={prog} size={76} stroke={8} color={prog >= 70 ? "#1f6c57" : prog >= 40 ? "#d2921a" : "#c75540"} />
            </div>
          </div>
          {canEdit && (
            <div className="flex flex-wrap gap-2.5 border-t border-pine-100 bg-pine-50/50 px-6 py-4">
              <Button size="sm" onClick={() => setSessionModal(true)}><CalendarPlus size={14} /> Programmer une séance</Button>
              <Button size="sm" variant="secondary" onClick={() => setGoalModal(true)}><Plus size={14} /> Nouvel objectif</Button>
              <Button size="sm" variant="secondary" onClick={() => setReportOpen(true)}><FileText size={14} /> Générer un rapport</Button>
            </div>
          )}
        </Card>
      </Reveal>

      <Reveal delay={80}>
        <Tabs
          tabs={[
            { id: "apercu", label: "Aperçu" },
            { id: "parcours", label: "Parcours", count: goals.length },
            { id: "progres", label: "Progrès", count: evals.length },
            { id: "seances", label: "Séances", count: sessions.length },
          ]}
          active={tab}
          onChange={setTab}
        />
      </Reveal>

      {/* ---------------- APERÇU ---------------- */}
      {tab === "apercu" && (
        <div className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-3">
            <Reveal className="lg:col-span-2">
              <Card className="p-6">
                <h3 className="font-display text-lg font-bold text-pine-950">Informations générales</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {[
                    { icon: <Cake size={16} />, l: "Date de naissance", v: `${fmtDateFull(student.birthDate)} (${ageFrom(student.birthDate)} ans)` },
                    { icon: <GraduationCap size={16} />, l: "Niveau scolaire", v: student.schoolLevel },
                    { icon: <Building2 size={16} />, l: "Établissement", v: student.school },
                    { icon: <HeartHandshake size={16} />, l: "Parent / tuteur", v: parent ? `${fullName(parent)}${parent.phone ? ` · ${parent.phone}` : ""}` : "—" },
                    { icon: <UserCheck size={16} />, l: "Professionnel référent", v: pro ? `${fullName(pro)} — ${pro.specialty}` : "Non attribué" },
                    { icon: <TrendingUp size={16} />, l: "Accompagné depuis", v: fmtDateFull(student.joinedAt) },
                  ].map((x) => (
                    <div key={x.l} className="flex items-start gap-3 rounded-xl bg-pine-50/70 p-3.5">
                      <span className="mt-0.5 rounded-lg bg-pine-100 p-1.5 text-pine-700">{x.icon}</span>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-pine-500">{x.l}</p>
                        <p className="mt-0.5 text-[13px] font-semibold text-pine-900">{x.v}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <h4 className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-pine-500">Difficultés identifiées</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {student.difficulties.map((d) => {
                    const dd = DIFFICULTIES.find((x) => x.id === d);
                    return dd ? (
                      <span key={d} title={dd.description} className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-bold transition-transform hover:scale-105" style={{ backgroundColor: dd.bg, color: dd.fg }}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: dd.dot }} /> {dd.label}
                      </span>
                    ) : null;
                  })}
                </div>
                {student.notes && (
                  <div className="mt-5 rounded-xl border border-marigold-200 bg-marigold-50 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-marigold-700">Note du professionnel</p>
                    <p className="mt-1.5 text-[13px] italic leading-relaxed text-pine-800">« {student.notes} »</p>
                  </div>
                )}
              </Card>
            </Reveal>
            <div className="space-y-5">
              <Reveal delay={80}>
                <Card className="p-6">
                  <h3 className="font-display text-lg font-bold text-pine-950">Dernières évaluations</h3>
                  <div className="mt-4 space-y-3">
                    {evals.slice(0, 4).map((e) => (
                      <div key={e.id} className="rounded-xl border border-pine-100 bg-white/70 p-3.5">
                        <div className="flex items-center justify-between">
                          <p className="text-[12px] font-bold text-pine-900">{e.competency}</p>
                          <span className="font-display text-sm font-bold text-pine-700">{e.score}/10</span>
                        </div>
                        <div className="mt-2"><ProgressBar value={e.score * 10} height={5} color={e.score >= 7 ? "#1f6c57" : e.score >= 5 ? "#d2921a" : "#c75540"} /></div>
                        <p className="mt-2 text-[11px] text-pine-500">{fmtDate(e.date)}</p>
                      </div>
                    ))}
                    {evals.length === 0 && <p className="py-4 text-center text-sm text-pine-500">Aucune évaluation pour l'instant.</p>}
                  </div>
                </Card>
              </Reveal>
              <Reveal delay={140}>
                <Card className="p-6">
                  <h3 className="font-display text-lg font-bold text-pine-950">Dernière séance</h3>
                  {sessions.filter((s) => s.status === "realisee")[0] ? (
                    (() => {
                      const s = sessions.filter((x) => x.status === "realisee")[0];
                      const rep = state.reports.find((r) => r.id === s.reportId);
                      return (
                        <div>
                          <p className="text-[13px] font-bold text-pine-900">{s.type}</p>
                          <p className="text-xs text-pine-500">{fmtDateLong(s.date)} à {s.time}</p>
                          {rep ? (
                            <>
                              <p className="mt-3 line-clamp-3 text-[12px] leading-relaxed text-pine-600">{rep.progress}</p>
                              <Button size="sm" variant="secondary" className="mt-3" onClick={() => setViewReport(rep.id)}><Eye size={13} /> Voir le compte rendu</Button>
                            </>
                          ) : (
                            <p className="mt-3 text-xs text-pine-500">Compte rendu non disponible.</p>
                          )}
                        </div>
                      );
                    })()
                  ) : (
                    <p className="py-4 text-center text-sm text-pine-500">Aucune séance réalisée.</p>
                  )}
                </Card>
              </Reveal>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- PARCOURS ---------------- */}
      {tab === "parcours" && (
        <div className="space-y-5">
          {canEdit && (
            <Reveal>
              <div className="flex justify-end">
                <Button size="sm" onClick={() => setGoalModal(true)}><Plus size={14} /> Ajouter un objectif</Button>
              </div>
            </Reveal>
          )}
          {goals.length === 0 ? (
            <EmptyState icon={<Target size={26} />} title="Aucun objectif défini" text="Construisez le parcours d'accompagnement en ajoutant un premier objectif pédagogique." action={canEdit ? <Button onClick={() => setGoalModal(true)}><Plus size={15} /> Créer un objectif</Button> : undefined} />
          ) : (
            goals.map((g, i) => <GoalCard key={g.id} goal={g} canEdit={canEdit} delay={i * 60} />)
          )}
        </div>
      )}

      {/* ---------------- PROGRÈS ---------------- */}
      {tab === "progres" && (
        <div className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <Reveal>
              <Card className="p-6">
                <h3 className="font-display text-lg font-bold text-pine-950">Progression par compétence</h3>
                <p className="text-xs text-pine-500">Dernières évaluations</p>
                <div className="mt-5 space-y-4">
                  {skills.map((s) => (
                    <div key={s.c}>
                      <div className="flex items-center justify-between text-[13px]">
                        <span className="font-bold text-pine-900">{s.c}</span>
                        <span className="flex items-center gap-2">
                          {s.delta > 0 && <Badge bg="#dcebe4" fg="#175745">+{(s.delta * 10).toFixed(0)} pts</Badge>}
                          <span className="font-display font-bold text-pine-700">{Math.round(s.score * 10)} %</span>
                        </span>
                      </div>
                      <div className="mt-1.5"><ProgressBar value={s.score * 10} color={s.score >= 7 ? "#1f6c57" : s.score >= 5 ? "#d2921a" : "#c75540"} /></div>
                    </div>
                  ))}
                  {skills.length === 0 && <p className="py-6 text-center text-sm text-pine-500">Aucune évaluation enregistrée.</p>}
                </div>
              </Card>
            </Reveal>
            <Reveal delay={100}>
              <Card className="p-6">
                <h3 className="font-display text-lg font-bold text-pine-950">Évolution dans le temps</h3>
                <p className="text-xs text-pine-500">Scores d'évaluation (sur 10)</p>
                <div className="mt-5 h-56">
                  {evolution.length > 1 ? (
                    <TrendArea data={evolution} color="#3f6577" name="Score" />
                  ) : (
                    <p className="flex h-full items-center justify-center text-sm text-pine-500">Au moins deux évaluations sont nécessaires pour tracer une courbe.</p>
                  )}
                </div>
              </Card>
            </Reveal>
          </div>

          <Reveal>
            <Card className="p-6">
              <h3 className="font-display text-lg font-bold text-pine-950">Historique des évaluations</h3>
              <div className="mt-4 space-y-2.5">
                {evals.map((e) => {
                  const p = state.users.find((u) => u.id === e.professionalId);
                  return (
                    <div key={e.id} className="flex flex-col gap-2 rounded-xl border border-pine-100 bg-white/70 p-4 sm:flex-row sm:items-center sm:gap-4">
                      <span className="w-40 shrink-0 text-[13px] font-bold text-pine-900">{e.competency}</span>
                      <div className="flex flex-1 items-center gap-3">
                        <div className="max-w-52 flex-1"><ProgressBar value={e.score * 10} height={6} color={e.score >= 7 ? "#1f6c57" : e.score >= 5 ? "#d2921a" : "#c75540"} /></div>
                        <span className="font-display text-sm font-bold text-pine-700">{e.score}/10</span>
                      </div>
                      <p className="flex-1 text-[12px] italic text-pine-600">« {e.comment} »</p>
                      <p className="w-32 shrink-0 text-right text-[11px] text-pine-500">{fmtDate(e.date)}{p ? ` · ${p.firstName}` : ""}</p>
                    </div>
                  );
                })}
                {evals.length === 0 && <p className="py-6 text-center text-sm text-pine-500">Aucune évaluation pour l'instant.</p>}
              </div>
            </Card>
          </Reveal>

          {goals.some((g) => g.status === "atteint") && (
            <Reveal>
              <Card className="p-6">
                <h3 className="flex items-center gap-2 font-display text-lg font-bold text-pine-950"><Award size={18} className="text-marigold-500" /> Objectifs atteints</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {goals.filter((g) => g.status === "atteint").map((g) => (
                    <div key={g.id} className="flex items-center gap-3 rounded-xl border border-pine-200 bg-pine-50 p-4">
                      <span className="rounded-xl bg-marigold-200 p-2.5 text-marigold-800"><Award size={17} /></span>
                      <div>
                        <p className="text-[13px] font-bold text-pine-900">{g.title}</p>
                        <p className="text-[11px] text-pine-500">Atteint le {fmtDate(g.targetDate)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Reveal>
          )}
        </div>
      )}

      {/* ---------------- SÉANCES ---------------- */}
      {tab === "seances" && (
        <div className="space-y-3">
          {sessions.length === 0 ? (
            <EmptyState icon={<ClipboardList size={26} />} title="Aucune séance" text="Les séances de cet élève apparaîtront ici." action={canEdit ? <Button onClick={() => setSessionModal(true)}><CalendarPlus size={15} /> Programmer</Button> : undefined} />
          ) : (
            sessions.map((s, i) => {
              const meta = SESSION_STATUSES[s.status];
              const rep = state.reports.find((r) => r.id === s.reportId);
              return (
                <Reveal key={s.id} delay={Math.min(i, 6) * 40}>
                  <Card className="p-5 transition-all hover:shadow-lift">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl text-paper" style={{ backgroundColor: SESSION_TYPE_COLORS[s.type] }}>
                        <span className="text-[13px] font-bold leading-none">{s.time}</span>
                        <span className="text-[8px] uppercase opacity-80">{s.duration}min</span>
                      </span>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[14px] font-bold text-pine-900">{s.type}</p>
                          <Badge bg={meta.bg} fg={meta.fg}>{meta.label}</Badge>
                        </div>
                        <p className="mt-0.5 text-xs text-pine-500">{fmtDateLong(s.date)} · {s.objective}</p>
                        {rep && <p className="mt-1 line-clamp-1 text-[12px] text-pine-600">Progrès : {rep.progress}</p>}
                      </div>
                      <div className="flex shrink-0 gap-2">
                        {rep && <Button size="sm" variant="secondary" onClick={() => setViewReport(rep.id)}><Eye size={13} /> Compte rendu</Button>}
                        {canEdit && s.status === "realisee" && !s.reportId && (
                          <Button size="sm" variant="marigold" onClick={() => setReportSession(s.id)}><PenLine size={13} /> Rédiger</Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </Reveal>
              );
            })
          )}
        </div>
      )}

      {/* Modales */}
      <GoalFormModal open={goalModal} onClose={() => setGoalModal(false)} studentId={student.id} professionalId={student.professionalId} />
      <SessionFormModal open={sessionModal} onClose={() => setSessionModal(false)} presetDate={todayISO()} />
      <ReportModal open={reportSession !== null} onClose={() => setReportSession(null)} session={reportSessionObj} />
      <ReportViewModal open={viewReport !== null} onClose={() => setViewReport(null)} reportId={viewReport} />
      {reportOpen && (
        <ReportPreview report={buildReport(state, student.id)} onClose={() => setReportOpen(false)} />
      )}
    </div>
  );
}

/* ------------------------- Carte objectif ------------------------- */

function GoalCard({ goal, canEdit, delay }: { goal: Goal; canEdit: boolean; delay: number }) {
  const state = useApp();
  const pro = state.users.find((u) => u.id === goal.professionalId);
  const st = GOAL_STATUSES[goal.status];
  return (
    <Reveal delay={delay}>
      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-marigold-600">{goal.competency}</p>
            <h3 className="mt-1 font-display text-lg font-bold text-pine-950">{goal.title}</h3>
            <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-pine-600">{goal.description}</p>
          </div>
          <Badge bg={st.bg} fg={st.fg}>{st.label}</Badge>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1"><ProgressBar value={goal.progress} height={9} color={goal.status === "atteint" ? "#37856d" : "#d2921a"} /></div>
          <span className="font-display text-base font-bold text-pine-800">{goal.progress} %</span>
        </div>
        {canEdit && goal.status !== "atteint" && (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <input
              type="range" min={0} max={100} step={5} value={goal.progress}
              onChange={(e) => state.updateGoal(goal.id, { progress: Number(e.target.value), status: Number(e.target.value) >= 100 ? "atteint" : Number(e.target.value) > 0 ? "en_cours" : goal.status })}
              className="flex-1 accent-pine-700" aria-label={`Ajuster la progression de ${goal.title}`}
            />
            <select
              value={goal.status}
              onChange={(e) => {
                const status = e.target.value as GoalStatus;
                state.updateGoal(goal.id, { status, progress: status === "atteint" ? 100 : goal.progress });
              }}
              className={`${inputCls()} w-auto py-1.5 text-xs`} aria-label="Changer le statut"
            >
              <option value="a_commencer">À commencer</option>
              <option value="en_cours">En cours</option>
              <option value="atteint">Atteint</option>
            </select>
          </div>
        )}
        <div className="mt-4 grid gap-3 text-[12px] sm:grid-cols-4">
          <p className="text-pine-500"><strong className="block text-[10px] uppercase tracking-wider">Début</strong>{fmtDate(goal.startDate)}</p>
          <p className="text-pine-500"><strong className="block text-[10px] uppercase tracking-wider">Échéance</strong>{fmtDate(goal.targetDate)}</p>
          <p className="text-pine-500"><strong className="block text-[10px] uppercase tracking-wider">Responsable</strong>{pro ? fullName(pro) : "—"}</p>
          <p className="text-pine-500"><strong className="block text-[10px] uppercase tracking-wider">Prochaines étapes</strong>{goal.nextSteps}</p>
        </div>
        {goal.observations && (
          <p className="mt-4 rounded-xl bg-pine-50 px-4 py-3 text-[12px] italic leading-relaxed text-pine-700">
            <BookOpen size={13} className="mr-1.5 inline text-pine-600" /> {goal.observations}
          </p>
        )}
      </Card>
    </Reveal>
  );
}

/* ------------------------- Modale objectif ------------------------- */

function GoalFormModal({ open, onClose, studentId, professionalId }: { open: boolean; onClose: () => void; studentId: string; professionalId: string }) {
  const state = useApp();
  const me = state.currentUser!;
  const [form, setForm] = useState({ title: "", description: "", competency: COMPETENCIES[0], startDate: todayISO(), targetDate: "", nextSteps: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.title.trim().length < 5) errs.title = "Titre requis (5 caractères min.).";
    if (form.description.trim().length < 10) errs.description = "Décrivez l'objectif.";
    if (!form.targetDate) errs.targetDate = "Échéance requise.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    state.addGoal({
      studentId,
      professionalId: me.role === "professional" ? me.id : professionalId,
      title: form.title.trim(),
      description: form.description.trim(),
      competency: form.competency,
      progress: 0,
      status: "a_commencer",
      startDate: form.startDate,
      targetDate: form.targetDate,
      observations: "",
      nextSteps: form.nextSteps.trim(),
    });
    setForm({ title: "", description: "", competency: COMPETENCIES[0], startDate: todayISO(), targetDate: "", nextSteps: "" });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Nouvel objectif pédagogique">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Titre de l'objectif" error={errors.title}>
          <input className={inputCls(errors.title)} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex. : Améliorer la compréhension écrite" />
        </Field>
        <Field label="Description" error={errors.description}>
          <textarea rows={3} className={inputCls(errors.description)} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Ce que l'élève saura faire une fois l'objectif atteint…" />
        </Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Compétence">
            <select className={inputCls()} value={form.competency} onChange={(e) => setForm({ ...form, competency: e.target.value })}>
              {COMPETENCIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Début">
            <input type="date" className={inputCls()} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          </Field>
          <Field label="Échéance" error={errors.targetDate}>
            <input type="date" min={form.startDate} className={inputCls(errors.targetDate)} value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} />
          </Field>
        </div>
        <Field label="Prochaines étapes">
          <input className={inputCls()} value={form.nextSteps} onChange={(e) => setForm({ ...form, nextSteps: e.target.value })} placeholder="Première action à mener…" />
        </Field>
        <div className="flex justify-end gap-3 border-t border-pine-100 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>Annuler</Button>
          <Button type="submit"><Sparkles size={14} /> Créer l'objectif</Button>
        </div>
      </form>
    </Modal>
  );
}
