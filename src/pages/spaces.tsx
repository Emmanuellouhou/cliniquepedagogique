import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck2, Target, MessageSquare, Lightbulb, CheckCircle2, TrendingUp, BookOpen,
  Trophy, Star, HeartHandshake, Sparkles, ArrowRight, ClipboardList, PartyPopper, PlayCircle,
} from "lucide-react";
import { Avatar, Badge, Card, EmptyState, ProgressBar, Reveal, Ring } from "../components/ui";
import { useApp, visibleStudents } from "../lib/store";
import { DIFFICULTIES, GOAL_STATUSES, SESSION_TYPE_COLORS, fmtDate, fmtDateLong, fullName, studentProgress, todayISO } from "../lib/data";

/* ================================ ESPACE PARENT ================================ */

export function ParentDashboard() {
  const state = useApp();
  const me = state.currentUser!;
  const children = visibleStudents(state);
  const [childIdx, setChildIdx] = useState(0);
  const child = children[childIdx];
  const today = todayISO();

  if (!child) {
    return (
      <div className="mx-auto max-w-xl py-16">
        <EmptyState
          icon={<HeartHandshake size={28} />}
          title={`Bienvenue, ${me.firstName} !`}
          text="Votre espace parent est prêt. Dès que la clinique aura rattaché le dossier de votre enfant, vous retrouverez ici sa progression, ses rendez-vous et les recommandations du professionnel."
          action={<Link to="/dashboard/messages"><ButtonLink>Contacter la clinique</ButtonLink></Link>}
        />
      </div>
    );
  }

  const pro = state.users.find((u) => u.id === child.professionalId);
  const prog = studentProgress(state.goals, child.id);
  const goals = state.goals.filter((g) => g.studentId === child.id && g.status !== "atteint");
  const nextSession = state.sessions
    .filter((s) => s.studentId === child.id && s.status === "programmee" && s.date >= today)
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))[0];
  const lastReport = state.reports
    .filter((r) => state.sessions.some((s) => s.id === r.sessionId && s.studentId === child.id))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  const childResources = state.resources.filter((r) => r.assignedTo.includes(child.id));
  const lastEval = [...state.evaluations].filter((e) => e.studentId === child.id).sort((a, b) => b.date.localeCompare(a.date))[0];

  const tips = [
    ...(lastReport ? [{ icon: <BookOpen size={18} />, t: "À la maison cette semaine", d: lastReport.recommendations }] : []),
    { icon: <Lightbulb size={18} />, t: "Le rituel des 10 minutes", d: "Dix minutes de lecture partagée chaque soir, sans pression de performance : c'est la régularité qui crée le déclic." },
    { icon: <Star size={18} />, t: "Célébrez les petites victoires", d: `Valorisez chaque progrès de ${child.firstName}, même minime. Le « mur des réussites » à la maison renforce la confiance.` },
  ];

  return (
    <div className="space-y-7">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-pine-500">Espace parent</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-pine-950 sm:text-3xl">Bonjour, {me.firstName} 👋</h2>
            <p className="mt-1 text-sm text-pine-600">Voici où en est {child.firstName} dans son accompagnement.</p>
          </div>
          {children.length > 1 && (
            <div className="flex gap-2">
              {children.map((c, i) => (
                <button key={c.id} onClick={() => setChildIdx(i)} className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${i === childIdx ? "bg-pine-800 text-paper" : "bg-pine-100 text-pine-700 hover:bg-pine-200"}`}>
                  {c.firstName}
                </button>
              ))}
            </div>
          )}
        </div>
      </Reveal>

      <div className="grid gap-5 lg:grid-cols-3">
        <Reveal>
          <Card className="flex h-full flex-col items-center justify-center p-7 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-pine-500">Progression globale</p>
            <div className="my-5"><Ring value={prog} size={140} stroke={13} color={prog >= 70 ? "#1f6c57" : prog >= 40 ? "#d2921a" : "#c75540"} /></div>
            <p className="font-display text-lg font-bold text-pine-900">{fullName(child)}</p>
            <p className="text-xs text-pine-500">{child.schoolLevel} · {child.school}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-1.5">
              {child.difficulties.map((d) => {
                const dd = DIFFICULTIES.find((x) => x.id === d);
                return dd ? <Badge key={d} bg={dd.bg} fg={dd.fg}>{dd.label}</Badge> : null;
              })}
            </div>
            <Link to={`/dashboard/students/${child.id}`} className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-pine-600 hover:text-pine-800">
              Voir le parcours complet <ArrowRight size={13} />
            </Link>
          </Card>
        </Reveal>

        <Reveal delay={80}>
          <Card className="h-full p-6">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-pine-950"><CalendarCheck2 size={18} className="text-pine-600" /> Prochain rendez-vous</h3>
            {nextSession ? (
              <>
                <div className="mt-4 rounded-2xl p-5 text-paper" style={{ backgroundColor: SESSION_TYPE_COLORS[nextSession.type] }}>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] opacity-80">{fmtDateLong(nextSession.date)}</p>
                  <p className="mt-1 font-display text-3xl font-bold">{nextSession.time}</p>
                  <p className="mt-1 text-sm font-semibold opacity-90">{nextSession.type} · {nextSession.duration} min</p>
                </div>
                <p className="mt-4 text-[13px] leading-relaxed text-pine-600"><strong className="text-pine-800">Objectif :</strong> {nextSession.objective}</p>
                <p className="mt-2 flex items-center gap-2 text-[13px] text-pine-600">
                  <Avatar name={pro ? fullName(pro) : "?"} size={24} color={pro?.avatarColor} /> avec {pro ? `${pro.firstName} ${pro.lastName}` : "le professionnel"}
                </p>
              </>
            ) : (
              <EmptyState icon={<CalendarCheck2 size={22} />} title="Aucun rendez-vous prévu" text="Le professionnel planifiera la prochaine séance prochainement. Vous serez notifié(e)." />
            )}
          </Card>
        </Reveal>

        <Reveal delay={160}>
          <Card className="h-full p-6">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-pine-950"><Target size={18} className="text-pine-600" /> Objectifs actuels</h3>
            <div className="mt-4 space-y-4">
              {goals.length === 0 && <p className="py-6 text-center text-sm text-pine-500">Tous les objectifs sont atteints. Bravo !</p>}
              {goals.map((g) => (
                <div key={g.id}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-bold leading-snug text-pine-900">{g.title}</p>
                    <Badge bg={GOAL_STATUSES[g.status].bg} fg={GOAL_STATUSES[g.status].fg}>{GOAL_STATUSES[g.status].label}</Badge>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex-1"><ProgressBar value={g.progress} height={6} /></div>
                    <span className="text-xs font-bold text-pine-700">{g.progress} %</span>
                  </div>
                </div>
              ))}
            </div>
            {lastEval && (
              <p className="mt-5 rounded-xl bg-pine-50 px-4 py-3 text-xs leading-relaxed text-pine-700">
                <strong>Dernière évaluation ({lastEval.competency}) :</strong> {lastEval.score}/10 — « {lastEval.comment} »
              </p>
            )}
          </Card>
        </Reveal>
      </div>

      {lastReport && (
        <Reveal>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-display text-lg font-bold text-pine-950"><ClipboardList size={18} className="text-pine-600" /> Dernières observations</h3>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-pine-400">{fmtDate(lastReport.createdAt.slice(0, 10))}</span>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-pine-50 p-4">
                <p className="text-[11px] font-bold uppercase tracking-wide text-pine-500">Progrès observés</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-pine-800">{lastReport.progress}</p>
              </div>
              <div className="rounded-xl bg-marigold-50 p-4">
                <p className="text-[11px] font-bold uppercase tracking-wide text-marigold-700">Points de vigilance</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-pine-800">{lastReport.difficulties}</p>
              </div>
              <div className="rounded-xl bg-sea-100/60 p-4">
                <p className="text-[11px] font-bold uppercase tracking-wide text-sea-700">Prochaine étape</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-pine-800">{lastReport.nextSteps}</p>
              </div>
            </div>
          </Card>
        </Reveal>
      )}

      <Reveal>
        <div className="rounded-[24px] bg-pine-900 p-7 text-paper shadow-lift sm:p-9">
          <h3 className="flex items-center gap-2.5 font-display text-xl font-bold sm:text-2xl">
            <HeartHandshake size={22} className="text-marigold-300" /> Comment aider mon enfant ?
          </h3>
          <p className="mt-1.5 max-w-xl text-sm text-pine-300">Les recommandations du professionnel, concrètes et faciles à appliquer à la maison.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {tips.map((t) => (
              <div key={t.t} className="rounded-2xl border border-pine-700/60 bg-pine-800/60 p-5 transition-all hover:border-marigold-400/50 hover:-translate-y-1">
                <span className="inline-flex rounded-xl bg-pine-700 p-2.5 text-marigold-300">{t.icon}</span>
                <h4 className="mt-3 font-display text-[15px] font-bold">{t.t}</h4>
                <p className="mt-1.5 text-xs leading-relaxed text-pine-200">{t.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-pine-300">{childResources.length} ressource{childResources.length > 1 ? "s" : ""} attribuée{childResources.length > 1 ? "s" : ""} à {child.firstName}</p>
            <div className="flex gap-2.5">
              <Link to="/dashboard/resources"><ButtonLink variant="marigold">Voir les ressources</ButtonLink></Link>
              {pro && <Link to={`/dashboard/messages?to=${pro.id}`}><ButtonLink variant="dark">Écrire à {pro.firstName}</ButtonLink></Link>}
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function ButtonLink({ children, variant = "light" }: { children: React.ReactNode; variant?: "light" | "marigold" | "dark" }) {
  const styles = {
    light: "bg-pine-100 text-pine-800 hover:bg-pine-200",
    marigold: "bg-marigold-400 text-pine-950 hover:bg-marigold-300",
    dark: "bg-pine-800 text-paper hover:bg-pine-700",
  };
  return <span className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all hover:-translate-y-px cursor-pointer ${styles[variant]}`}>{children}</span>;
}

/* ================================ ESPACE ÉLÈVE ================================ */

const ENCOURAGEMENTS = [
  "Chaque petit pas compte. Tu avances, et ça se voit !",
  "Les champions ne naissent pas champions : ils s'entraînent. Bravo pour ton travail !",
  "Ton cerveau grandit à chaque effort. Continue, tu es sur la bonne voie !",
  "Aujourd'hui est une nouvelle occasion de montrer tout ce que tu sais faire.",
];

export function StudentSpace() {
  const state = useApp();
  const me = state.currentUser!;
  const student = state.students.find((s) => s.id === me.studentId);
  const [msgIdx, setMsgIdx] = useState(0);
  const today = todayISO();

  useEffect(() => {
    const t = setInterval(() => setMsgIdx((i) => (i + 1) % ENCOURAGEMENTS.length), 6000);
    return () => clearInterval(t);
  }, []);

  if (!student) {
    return <EmptyState icon={<Sparkles size={26} />} title="Bienvenue !" text="Ton espace sera prêt très bientôt." />;
  }

  const myGoals = state.goals.filter((g) => g.studentId === student.id);
  const prog = studentProgress(state.goals, student.id);
  const nextSession = state.sessions
    .filter((s) => s.studentId === student.id && s.status === "programmee" && s.date >= today)
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))[0];
  const myResources = state.resources.filter((r) => r.assignedTo.includes(student.id));
  const activities = myResources.filter((r) => r.type === "Activité" || r.type === "Fiche");
  const completed = state.completedActivities.filter((id) => myResources.some((r) => r.id === id));
  const wonGoals = myGoals.filter((g) => g.status === "atteint");
  const lastEvals = [...state.evaluations].filter((e) => e.studentId === student.id && e.score >= 6.5).sort((a, b) => b.date.localeCompare(a.date));

  const badges = [
    ...wonGoals.map((g) => ({ icon: <Trophy size={17} />, label: g.title, tone: "#d2921a" })),
    { icon: <BookOpen size={17} />, label: `${completed.length} activité${completed.length > 1 ? "s" : ""} terminée${completed.length > 1 ? "s" : ""}`, tone: "#1f6c57" },
    ...(lastEvals[0] ? [{ icon: <Star size={17} />, label: `Évaluation réussie en ${lastEvals[0].competency.toLowerCase()}`, tone: "#3f6577" }] : []),
  ];

  const skills = [...new Set(state.evaluations.filter((e) => e.studentId === student.id).map((e) => e.competency))].map((c) => {
    const ev = state.evaluations.filter((e) => e.studentId === student.id && e.competency === c).sort((a, b) => b.date.localeCompare(a.date))[0];
    return { c, score: ev.score };
  }).sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-7">
      <Reveal>
        <div className="relative overflow-hidden rounded-[26px] bg-pine-800 p-7 text-paper shadow-lift sm:p-9">
          <div className="absolute inset-0 bg-dots opacity-20" aria-hidden="true" />
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-marigold-400/20 blur-3xl" aria-hidden="true" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-marigold-300">Ton espace</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Bonjour {me.firstName} 👋</h2>
            <p key={msgIdx} className="mt-3 max-w-lg text-sm leading-relaxed text-pine-100 animate-fade-up">{ENCOURAGEMENTS[msgIdx]}</p>
            <div className="mt-6 flex flex-wrap items-center gap-5">
              <div className="rounded-2xl bg-pine-700/70 px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-pine-200">Ma progression</p>
                <p className="font-display text-3xl font-bold text-marigold-300">{prog} %</p>
              </div>
              <div className="rounded-2xl bg-pine-700/70 px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-pine-200">Objectifs atteints</p>
                <p className="font-display text-3xl font-bold text-marigold-300">{wonGoals.length}</p>
              </div>
              <div className="rounded-2xl bg-pine-700/70 px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-pine-200">Activités finies</p>
                <p className="font-display text-3xl font-bold text-marigold-300">{completed.length}</p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="grid gap-5 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <Card className="h-full p-6">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-pine-950"><Target size={18} className="text-pine-600" /> Mes objectifs</h3>
            <div className="mt-4 space-y-4">
              {myGoals.map((g) => (
                <div key={g.id} className={`rounded-2xl border p-4 transition-all ${g.status === "atteint" ? "border-pine-200 bg-pine-50/70" : "border-pine-100 bg-white"}`}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="flex items-center gap-2 text-[14px] font-bold text-pine-900">
                      {g.status === "atteint" && <PartyPopper size={16} className="text-marigold-500" />}
                      {g.title}
                    </p>
                    <Badge bg={GOAL_STATUSES[g.status].bg} fg={GOAL_STATUSES[g.status].fg}>{GOAL_STATUSES[g.status].label}</Badge>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1"><ProgressBar value={g.progress} color={g.status === "atteint" ? "#37856d" : "#d2921a"} height={9} /></div>
                    <span className="font-display text-sm font-bold text-pine-700">{g.progress} %</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Reveal>

        <div className="space-y-5">
          <Reveal delay={80}>
            <Card className="p-6">
              <h3 className="flex items-center gap-2 font-display text-lg font-bold text-pine-950"><CalendarCheck2 size={18} className="text-pine-600" /> Mon prochain rendez-vous</h3>
              {nextSession ? (
                <div className="mt-4 rounded-2xl p-5 text-paper" style={{ backgroundColor: SESSION_TYPE_COLORS[nextSession.type] }}>
                  <p className="text-[11px] font-bold uppercase tracking-wider opacity-80">{fmtDateLong(nextSession.date)}</p>
                  <p className="mt-1 font-display text-4xl font-bold">{nextSession.time}</p>
                  <p className="mt-2 text-sm font-semibold opacity-90">{nextSession.type} · {nextSession.duration} minutes</p>
                </div>
              ) : (
                <p className="mt-4 rounded-xl bg-pine-50 px-4 py-6 text-center text-sm text-pine-600">Aucune séance prévue pour le moment.</p>
              )}
            </Card>
          </Reveal>
          <Reveal delay={140}>
            <Card className="p-6">
              <h3 className="flex items-center gap-2 font-display text-lg font-bold text-pine-950"><TrendingUp size={18} className="text-pine-600" /> Mes progrès</h3>
              <div className="mt-4 space-y-3.5">
                {skills.map((s) => (
                  <div key={s.c}>
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-pine-800">{s.c}</span>
                      <span className="text-pine-600">{Math.round(s.score * 10)} %</span>
                    </div>
                    <div className="mt-1.5"><ProgressBar value={s.score * 10} height={8} color={s.score >= 7 ? "#1f6c57" : s.score >= 5 ? "#d2921a" : "#c75540"} /></div>
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Reveal>
          <Card className="h-full p-6">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-pine-950"><PlayCircle size={18} className="text-pine-600" /> Mes activités</h3>
            <p className="mt-1 text-xs text-pine-500">Coche chaque activité quand tu l'as terminée.</p>
            <div className="mt-4 space-y-2.5">
              {activities.length === 0 && <p className="py-6 text-center text-sm text-pine-500">Aucune activité pour le moment.</p>}
              {activities.map((r) => {
                const done = state.completedActivities.includes(r.id);
                return (
                  <button
                    key={r.id}
                    onClick={() => state.toggleActivity(r.id)}
                    className={`flex w-full items-center gap-3.5 rounded-xl border px-4 py-3.5 text-left transition-all cursor-pointer ${
                      done ? "border-pine-200 bg-pine-50" : "border-pine-100 bg-white hover:border-pine-300 hover:shadow-soft"
                    }`}
                  >
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${done ? "border-pine-600 bg-pine-600 text-paper" : "border-pine-300"}`}>
                      {done && <CheckCircle2 size={15} className="animate-pop" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block truncate text-[13px] font-bold ${done ? "text-pine-500 line-through" : "text-pine-900"}`}>{r.title}</span>
                      <span className="text-[11px] text-pine-500">{r.category} · {r.type}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>
        </Reveal>
        <Reveal delay={100}>
          <Card className="h-full p-6">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-pine-950"><Trophy size={18} className="text-marigold-500" /> Mes réussites</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {badges.map((b) => (
                <div key={b.label} className="flex items-center gap-3 rounded-xl border border-pine-100 bg-white p-3.5 transition-all hover:-translate-y-0.5 hover:shadow-soft">
                  <span className="rounded-xl p-2.5" style={{ backgroundColor: `${b.tone}18`, color: b.tone }}>{b.icon}</span>
                  <p className="text-xs font-bold leading-snug text-pine-800">{b.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl bg-marigold-50 border border-marigold-200 p-4">
              <p className="flex items-center gap-1.5 text-[13px] font-semibold text-pine-900"><Lightbulb size={14} className="text-marigold-600" /> Le savais-tu ?</p>
              <p className="mt-1 text-xs leading-relaxed text-pine-700">Ton cerveau crée de nouvelles connexions à chaque fois que tu t'entraînes. S'entraîner, c'est littéralement devenir plus fort !</p>
            </div>
          </Card>
        </Reveal>
      </div>
    </div>
  );
}
