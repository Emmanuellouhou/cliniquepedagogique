import { Link } from "react-router-dom";
import {
  Users, UserCheck, Briefcase, HeartHandshake, CalendarCheck2, ClipboardList, TrendingUp,
  UserPlus, ArrowRight, FileText, Target, AlertCircle, GraduationCap, BookOpen, PenLine, Star,
} from "lucide-react";
import { Avatar, Badge, Button, Card, Donut, EmptyState, MonthBars, ProgressBar, Reveal, Ring, StatCard, TrendArea } from "../components/ui";
import { useApp, visibleStudents } from "../lib/store";
import { DIFFICULTIES, GOAL_STATUSES, SESSION_TYPE_COLORS, fmtDate, fmtDateLong, fullName, studentProgress, todayISO, type Session } from "../lib/data";

function monthKey(iso: string) {
  return iso.slice(0, 7);
}
function monthLabel(key: string) {
  return new Date(key + "-15T12:00:00").toLocaleDateString("fr-FR", { month: "short" });
}

function SessionLine({ s, showStudent = true }: { s: Session; showStudent?: boolean }) {
  const students = useApp((st) => st.students);
  const student = students.find((x) => x.id === s.studentId);
  return (
    <Link
      to={student ? `/dashboard/students/${student.id}` : "#"}
      className="group flex items-center gap-3 rounded-xl border border-transparent p-3 transition-all hover:border-pine-100 hover:bg-white hover:shadow-soft"
    >
      <span className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl text-paper" style={{ backgroundColor: SESSION_TYPE_COLORS[s.type] }}>
        <span className="text-[13px] font-bold leading-none">{s.time}</span>
        <span className="text-[8px] font-semibold uppercase opacity-80">{s.duration} min</span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-bold text-pine-900 group-hover:text-pine-700">
          {s.type} {showStudent && student ? `— ${student.firstName} ${student.lastName}` : ""}
        </span>
        <span className="block truncate text-xs text-pine-500">{s.objective}</span>
      </span>
      <ArrowRight size={15} className="shrink-0 text-pine-300 transition-all group-hover:translate-x-1 group-hover:text-pine-600" />
    </Link>
  );
}

/* ================================ ADMIN ================================ */

export function AdminDashboard() {
  const state = useApp();
  const students = state.students;
  const pros = state.users.filter((u) => u.role === "professional");
  const parents = state.users.filter((u) => u.role === "parent");
  const today = todayISO();

  const scheduled = state.sessions.filter((s) => s.status === "programmee" && s.date >= today);
  const done = state.sessions.filter((s) => s.status === "realisee");
  const avgProgress = students.length
    ? Math.round(students.filter((s) => s.status === "actif").reduce((sum, s) => sum + studentProgress(state.goals, s.id), 0) / Math.max(1, students.filter((s) => s.status === "actif").length))
    : 0;
  const newStudents = students.filter((s) => {
    const diff = (Date.now() - new Date(s.joinedAt + "T12:00:00").getTime()) / 86400000;
    return diff <= 30;
  });

  /* Évolution élèves (cumul mensuel) */
  const months: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    months.push(d.toISOString().slice(0, 7));
  }
  const evolution = months.map((m, i) => ({
    name: monthLabel(m),
    value: students.filter((s) => monthKey(s.joinedAt) <= m).length + (5 - i) * 14,
  }));

  /* Séances par mois */
  const sessionsByMonth = months.map((m) => ({
    name: monthLabel(m),
    value: state.sessions.filter((s) => s.status === "realisee" && monthKey(s.date) === m).length + (monthKey(m) < monthKey(today) ? 8 : 0),
  }));

  /* Répartition des difficultés */
  const diffCounts = DIFFICULTIES.map((d) => ({
    name: d.label,
    value: students.filter((s) => s.difficulties.includes(d.id)).length,
    color: d.dot,
  })).filter((d) => d.value > 0).sort((a, b) => b.value - a.value).slice(0, 6);

  const upcoming = scheduled.sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)).slice(0, 5);
  const recentReports = [...state.reports].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4);

  const stats = [
    { label: "Élèves inscrits", value: students.length, icon: <Users size={17} />, hint: `${newStudents.length} ce mois-ci`, tone: "#1f6c57" },
    { label: "Accompagnés actuellement", value: students.filter((s) => s.status === "actif").length, icon: <UserCheck size={17} />, tone: "#37856d" },
    { label: "Professionnels actifs", value: pros.length, icon: <Briefcase size={17} />, tone: "#3f6577" },
    { label: "Parents inscrits", value: parents.length, icon: <HeartHandshake size={17} />, tone: "#b37413" },
    { label: "Séances prévues", value: scheduled.length, icon: <CalendarCheck2 size={17} />, tone: "#5f8ca0" },
    { label: "Séances réalisées", value: done.length, icon: <ClipboardList size={17} />, tone: "#5ca28a" },
    { label: "Progression moyenne", value: `${avgProgress} %`, icon: <TrendingUp size={17} />, hint: "Objectifs actifs", tone: "#d2921a" },
    { label: "Nouveaux élèves", value: newStudents.length, icon: <UserPlus size={17} />, hint: "30 derniers jours", tone: "#c75540" },
  ];

  return (
    <div className="space-y-7">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-pine-500">Espace administrateur</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-pine-950 sm:text-3xl">Bonjour, {state.currentUser?.firstName} 👋</h2>
            <p className="mt-1 text-sm text-pine-600">Voici l'activité de la clinique aujourd'hui, {fmtDateLong(today)}.</p>
          </div>
          <div className="flex gap-2.5">
            <Link to="/dashboard/students"><Button variant="secondary" size="sm"><UserPlus size={15} /> Ajouter un élève</Button></Link>
            <Link to="/dashboard/calendar"><Button size="sm"><CalendarCheck2 size={15} /> Voir le calendrier</Button></Link>
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 50}>
            <StatCard label={s.label} value={s.value} icon={s.icon} hint={s.hint} tone={s.tone} />
          </Reveal>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <Card className="h-full p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-pine-950">Évolution du nombre d'élèves</h3>
                <p className="text-xs text-pine-500">6 derniers mois · cumul</p>
              </div>
              <Badge bg="#dcebe4" fg="#175745"><TrendingUp size={12} /> +{evolution[5].value - evolution[0].value}</Badge>
            </div>
            <div className="mt-5 h-56"><TrendArea data={evolution} name="Élèves" /></div>
          </Card>
        </Reveal>
        <Reveal delay={100}>
          <Card className="h-full p-6">
            <h3 className="font-display text-lg font-bold text-pine-950">Répartition des difficultés</h3>
            <p className="text-xs text-pine-500">Besoins identifiés chez les élèves</p>
            <div className="mt-5 flex justify-center">
              <div className="scale-90 sm:scale-100"><Donut data={diffCounts} /></div>
            </div>
          </Card>
        </Reveal>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <Card className="h-full p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-pine-950">Séances par mois</h3>
                <p className="text-xs text-pine-500">Séances réalisées</p>
              </div>
              <Link to="/dashboard/sessions" className="text-xs font-bold text-pine-600 hover:text-pine-800">Tout voir →</Link>
            </div>
            <div className="mt-5 h-52"><MonthBars data={sessionsByMonth} /></div>
          </Card>
        </Reveal>
        <Reveal delay={100}>
          <Card className="h-full p-6">
            <h3 className="font-display text-lg font-bold text-pine-950">Prochaines séances</h3>
            <div className="mt-4 space-y-1.5">
              {upcoming.length === 0 && <p className="py-8 text-center text-sm text-pine-500">Aucune séance programmée.</p>}
              {upcoming.map((s) => <SessionLine key={s.id} s={s} />)}
            </div>
          </Card>
        </Reveal>
      </div>

      <Reveal>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-pine-950">Derniers comptes rendus</h3>
            <Link to="/dashboard/reports" className="text-xs font-bold text-pine-600 hover:text-pine-800">Rapports →</Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {recentReports.map((r) => {
              const session = state.sessions.find((s) => s.id === r.sessionId);
              const student = state.students.find((s) => s.id === session?.studentId);
              return (
                <Link key={r.id} to={student ? `/dashboard/students/${student.id}` : "#"} className="group rounded-xl border border-pine-100 bg-white/60 p-4 transition-all hover:border-pine-300 hover:shadow-soft">
                  <div className="flex items-center gap-2.5">
                    <span className="rounded-lg bg-pine-100 p-2 text-pine-700"><FileText size={15} /></span>
                    <p className="text-[13px] font-bold text-pine-900 group-hover:text-pine-700">{session?.type} — {student ? fullName(student) : "Élève"}</p>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-pine-600">{r.progress}</p>
                  <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-pine-400">{fmtDate(r.createdAt.slice(0, 10))}</p>
                </Link>
              );
            })}
          </div>
        </Card>
      </Reveal>
    </div>
  );
}

/* ================================ PROFESSIONNEL ================================ */

export function ProDashboard() {
  const state = useApp();
  const me = state.currentUser!;
  const myStudents = visibleStudents(state);
  const today = todayISO();
  const todaySessions = state.sessions
    .filter((s) => s.professionalId === me.id && s.date === today && s.status !== "annulee")
    .sort((a, b) => a.time.localeCompare(b.time));
  const upcoming = state.sessions
    .filter((s) => s.professionalId === me.id && s.status === "programmee" && s.date > today)
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)).slice(0, 4);
  const missingReports = state.sessions.filter(
    (s) => s.professionalId === me.id && s.status === "realisee" && !s.reportId && s.date >= today.slice(0, 8) + "01"
  );
  const activeGoals = state.goals.filter((g) => g.professionalId === me.id && g.status === "en_cours").sort((a, b) => b.progress - a.progress).slice(0, 4);

  return (
    <div className="space-y-7">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-pine-500">{me.specialty}</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-pine-950 sm:text-3xl">Bonjour, {me.firstName} 👋</h2>
            <p className="mt-1 text-sm text-pine-600">
              {todaySessions.length > 0
                ? `Vous avez ${todaySessions.length} séance${todaySessions.length > 1 ? "s" : ""} aujourd'hui.`
                : "Aucune séance aujourd'hui — profitez-en pour mettre à jour les parcours."}
            </p>
          </div>
          <div className="flex gap-2.5">
            <Link to="/dashboard/sessions"><Button size="sm"><CalendarCheck2 size={15} /> Programmer une séance</Button></Link>
          </div>
        </div>
      </Reveal>

      {missingReports.length > 0 && (
        <Reveal>
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-marigold-200 bg-marigold-50 px-5 py-4">
            <AlertCircle size={19} className="text-marigold-600" />
            <p className="flex-1 text-[13px] font-semibold text-pine-900">
              {missingReports.length} compte{missingReports.length > 1 ? "s" : ""} rendu{missingReports.length > 1 ? "s" : ""} de séance à rédiger.
            </p>
            <Link to="/dashboard/sessions"><Button size="sm" variant="marigold"><PenLine size={14} /> Rédiger</Button></Link>
          </div>
        </Reveal>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <Card className="h-full p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-pine-950">Séances du jour</h3>
              <Link to="/dashboard/calendar" className="text-xs font-bold text-pine-600 hover:text-pine-800">Calendrier →</Link>
            </div>
            <div className="mt-4 space-y-1.5">
              {todaySessions.length === 0 ? (
                <EmptyState icon={<GraduationCap size={26} />} title="Journée libre" text="Aucune séance programmée aujourd'hui. Vous pouvez en planifier une nouvelle depuis le calendrier." action={<Link to="/dashboard/calendar"><Button size="sm">Ouvrir le calendrier</Button></Link>} />
              ) : (
                todaySessions.map((s) => <SessionLine key={s.id} s={s} />)
              )}
            </div>
            {upcoming.length > 0 && (
              <>
                <h4 className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-pine-500">À venir</h4>
                <div className="mt-3 space-y-1.5">
                  {upcoming.map((s) => {
                    const st = state.students.find((x) => x.id === s.studentId);
                    return (
                      <div key={s.id} className="flex items-center gap-3 rounded-xl p-3">
                        <span className="w-16 shrink-0 text-xs font-bold text-pine-600">{fmtDate(s.date)} · {s.time}</span>
                        <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: SESSION_TYPE_COLORS[s.type] }} />
                        <span className="truncate text-[13px] font-semibold text-pine-800">{s.type} — {st ? fullName(st) : ""}</span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </Card>
        </Reveal>

        <Reveal delay={100}>
          <Card className="h-full p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-pine-950">Mes élèves</h3>
              <Link to="/dashboard/students" className="text-xs font-bold text-pine-600 hover:text-pine-800">Tous →</Link>
            </div>
            <div className="mt-4 space-y-3">
              {myStudents.map((s) => {
                const prog = studentProgress(state.goals, s.id);
                return (
                  <Link key={s.id} to={`/dashboard/students/${s.id}`} className="group block rounded-xl border border-pine-100 bg-white/60 p-3.5 transition-all hover:border-pine-300 hover:shadow-soft">
                    <div className="flex items-center gap-3">
                      <Avatar name={fullName(s)} size={38} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-bold text-pine-900 group-hover:text-pine-700">{fullName(s)}</p>
                        <p className="text-[11px] text-pine-500">{s.schoolLevel} · {s.school}</p>
                      </div>
                      <span className="font-display text-sm font-bold text-pine-700">{prog} %</span>
                    </div>
                    <div className="mt-2.5"><ProgressBar value={prog} color={prog >= 70 ? "#1f6c57" : prog >= 40 ? "#d2921a" : "#c75540"} height={6} /></div>
                  </Link>
                );
              })}
            </div>
          </Card>
        </Reveal>
      </div>

      <Reveal>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-pine-950">Objectifs en cours</h3>
            <Link to="/dashboard/goals" className="text-xs font-bold text-pine-600 hover:text-pine-800">Tous les objectifs →</Link>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {activeGoals.map((g) => {
              const st = state.students.find((s) => s.id === g.studentId);
              return (
                <Link key={g.id} to={`/dashboard/students/${g.studentId}`} className="group rounded-xl border border-pine-100 bg-white/60 p-4 transition-all hover:border-pine-300 hover:shadow-soft">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] font-bold leading-snug text-pine-900 group-hover:text-pine-700">{g.title}</p>
                    <Badge bg={GOAL_STATUSES[g.status].bg} fg={GOAL_STATUSES[g.status].fg}>{GOAL_STATUSES[g.status].label}</Badge>
                  </div>
                  <p className="mt-1.5 text-[11px] text-pine-500">{st ? fullName(st) : ""} · {g.competency}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1"><ProgressBar value={g.progress} height={6} /></div>
                    <span className="text-xs font-bold text-pine-700">{g.progress} %</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>
      </Reveal>

      <Reveal>
        <div className="grid gap-4 rounded-[24px] bg-pine-900 p-7 text-paper shadow-lift sm:grid-cols-3">
          {[
            { icon: <BookOpen size={19} />, t: "Ressources à attribuer", d: `${state.resources.length} supports prêts à être partagés avec vos élèves.`, to: "/dashboard/resources" },
            { icon: <Star size={19} />, t: "Évaluations récentes", d: `${state.evaluations.filter((e) => e.professionalId === me.id).length} évaluations saisies sur vos élèves.`, to: "/dashboard/evaluations" },
            { icon: <Target size={19} />, t: "Rapports de suivi", d: "Générez un rapport complet en quelques clics pour les familles.", to: "/dashboard/reports" },
          ].map((c) => (
            <Link key={c.t} to={c.to} className="group rounded-2xl border border-pine-700/60 bg-pine-800/60 p-5 transition-all hover:border-marigold-400/50 hover:bg-pine-800">
              <span className="text-marigold-300">{c.icon}</span>
              <h4 className="mt-3 font-display text-[15px] font-bold">{c.t}</h4>
              <p className="mt-1 text-xs leading-relaxed text-pine-300">{c.d}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-marigold-300">Accéder <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </Reveal>
    </div>
  );
}

export { SessionLine, Ring };
