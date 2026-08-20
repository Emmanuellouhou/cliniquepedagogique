import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, UserPlus, Users, ArrowUpDown, Building2, Pencil, GraduationCap } from "lucide-react";
import { Avatar, Badge, Button, Card, EmptyState, Field, Modal, ProgressBar, Reveal, inputCls } from "../components/ui";
import { useApp, visibleStudents } from "../lib/store";
import { DIFFICULTIES, SCHOOL_LEVELS, fmtDate, fullName, studentProgress, todayISO, ageFrom, type Student, type StudentStatus } from "../lib/data";

const STATUS_META: Record<StudentStatus, { label: string; bg: string; fg: string }> = {
  actif: { label: "Actif", bg: "#dcebe4", fg: "#175745" },
  en_attente: { label: "En attente", bg: "#f8eccb", fg: "#8f5912" },
  suspendu: { label: "Suspendu", bg: "#f8dad3", fg: "#a84432" },
};

export function StudentsPage() {
  const state = useApp();
  const navigate = useNavigate();
  const me = state.currentUser!;
  const students = visibleStudents(state);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("tous");
  const [proFilter, setProFilter] = useState("tous");
  const [sortBy, setSortBy] = useState<"name" | "progress" | "recent">("recent");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);

  const pros = state.users.filter((u) => u.role === "professional");
  const parents = state.users.filter((u) => u.role === "parent");

  const filtered = useMemo(() => {
    let list = students.filter((s) => {
      const q = query.trim().toLowerCase();
      const matchQ = !q || fullName(s).toLowerCase().includes(q) || s.school.toLowerCase().includes(q) || s.schoolLevel.toLowerCase().includes(q);
      const matchS = statusFilter === "tous" || s.status === statusFilter;
      const matchP = proFilter === "tous" || s.professionalId === proFilter;
      return matchQ && matchS && matchP;
    });
    if (sortBy === "name") list = [...list].sort((a, b) => fullName(a).localeCompare(fullName(b)));
    if (sortBy === "progress") list = [...list].sort((a, b) => studentProgress(state.goals, b.id) - studentProgress(state.goals, a.id));
    if (sortBy === "recent") list = [...list].sort((a, b) => b.joinedAt.localeCompare(a.joinedAt));
    return list;
  }, [students, query, statusFilter, proFilter, sortBy, state.goals]);

  return (
    <div className="space-y-6">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-pine-500">{students.length} dossier{students.length > 1 ? "s" : ""}</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-pine-950 sm:text-3xl">Gestion des élèves</h2>
            <p className="mt-1 text-sm text-pine-600">Retrouvez chaque parcours, progression et historique en un clic.</p>
          </div>
          {(me.role === "admin" || me.role === "professional") && (
            <Button onClick={() => { setEditing(null); setModalOpen(true); }}><UserPlus size={16} /> Ajouter un élève</Button>
          )}
        </div>
      </Reveal>

      <Reveal delay={80}>
        <Card className="p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pine-400" />
              <input className={`${inputCls()} pl-10`} placeholder="Rechercher un élève, un établissement, un niveau…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Rechercher un élève" />
            </div>
            <select className={inputCls()} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filtrer par statut">
              <option value="tous">Tous les statuts</option>
              <option value="actif">Actif</option>
              <option value="en_attente">En attente</option>
              <option value="suspendu">Suspendu</option>
            </select>
            {me.role === "admin" && (
              <select className={inputCls()} value={proFilter} onChange={(e) => setProFilter(e.target.value)} aria-label="Filtrer par professionnel">
                <option value="tous">Tous les référents</option>
                {pros.map((p) => <option key={p.id} value={p.id}>{fullName(p)}</option>)}
              </select>
            )}
            <select className={inputCls()} value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} aria-label="Trier">
              <option value="recent">Plus récents</option>
              <option value="name">Nom (A → Z)</option>
              <option value="progress">Progression</option>
            </select>
          </div>
        </Card>
      </Reveal>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users size={26} />}
          title={query || statusFilter !== "tous" || proFilter !== "tous" ? "Aucun résultat" : "Aucun élève"}
          text={query || statusFilter !== "tous" || proFilter !== "tous" ? "Essayez de modifier votre recherche ou vos filtres." : "Ajoutez votre premier élève pour commencer un accompagnement."}
          action={
            query || statusFilter !== "tous" || proFilter !== "tous" ? (
              <Button variant="secondary" onClick={() => { setQuery(""); setStatusFilter("tous"); setProFilter("tous"); }}>Réinitialiser les filtres</Button>
            ) : (
              <Button onClick={() => setModalOpen(true)}><UserPlus size={15} /> Ajouter un élève</Button>
            )
          }
        />
      ) : (
        <>
          {/* Table desktop */}
          <Reveal delay={120}>
            <Card className="hidden overflow-hidden lg:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-pine-100 bg-pine-50/60 text-[11px] font-bold uppercase tracking-wider text-pine-500">
                    <th className="px-5 py-3.5">Élève</th>
                    <th className="px-4 py-3.5">Niveau</th>
                    <th className="px-4 py-3.5">Établissement</th>
                    <th className="px-4 py-3.5">Référent</th>
                    <th className="px-4 py-3.5">Statut</th>
                    <th className="px-4 py-3.5">Progression</th>
                    <th className="px-4 py-3.5">Dernière séance</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => {
                    const pro = pros.find((p) => p.id === s.professionalId);
                    const prog = studentProgress(state.goals, s.id);
                    const lastSession = state.sessions
                      .filter((x) => x.studentId === s.id && x.status === "realisee")
                      .sort((a, b) => b.date.localeCompare(a.date))[0];
                    return (
                      <tr key={s.id} className="group cursor-pointer border-b border-pine-50 transition-colors last:border-0 hover:bg-pine-50/50" onClick={() => navigate(`/dashboard/students/${s.id}`)}>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <Avatar name={fullName(s)} size={38} />
                            <div>
                              <p className="text-[13px] font-bold text-pine-900 group-hover:text-pine-700">{fullName(s)}</p>
                              <p className="text-[11px] text-pine-500">{ageFrom(s.birthDate)} ans · inscrit·e le {fmtDate(s.joinedAt)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5"><Badge bg="#dce7ec" fg="#3f6577">{s.schoolLevel}</Badge></td>
                        <td className="px-4 py-3.5 text-[12px] font-medium text-pine-700">{s.school}</td>
                        <td className="px-4 py-3.5">
                          {pro ? (
                            <span className="flex items-center gap-2 text-[12px] font-semibold text-pine-700">
                              <Avatar name={fullName(pro)} size={24} color={pro.avatarColor} /> {pro.firstName} {pro.lastName}
                            </span>
                          ) : (<span className="text-xs text-pine-400">—</span>)}
                        </td>
                        <td className="px-4 py-3.5"><Badge bg={STATUS_META[s.status].bg} fg={STATUS_META[s.status].fg}>{STATUS_META[s.status].label}</Badge></td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-24"><ProgressBar value={prog} height={6} color={prog >= 70 ? "#1f6c57" : prog >= 40 ? "#d2921a" : "#c75540"} /></div>
                            <span className="text-xs font-bold text-pine-700">{prog} %</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-[12px] text-pine-600">{lastSession ? fmtDate(lastSession.date) : "—"}</td>
                        <td className="px-4 py-3.5 text-right">
                          {me.role === "admin" && (
                            <button onClick={(e) => { e.stopPropagation(); setEditing(s); setModalOpen(true); }} aria-label={`Modifier ${fullName(s)}`} className="rounded-lg p-2 text-pine-500 opacity-0 transition-all hover:bg-pine-100 hover:text-pine-800 group-hover:opacity-100 cursor-pointer">
                              <Pencil size={15} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          </Reveal>

          {/* Cartes mobile */}
          <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
            {filtered.map((s, i) => {
              const pro = pros.find((p) => p.id === s.professionalId);
              const prog = studentProgress(state.goals, s.id);
              return (
                <Reveal key={s.id} delay={i * 50}>
                  <Link to={`/dashboard/students/${s.id}`} className="block rounded-2xl border border-pine-100 bg-white p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
                    <div className="flex items-center gap-3">
                      <Avatar name={fullName(s)} size={44} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-[15px] font-bold text-pine-900">{fullName(s)}</p>
                        <p className="text-[11px] text-pine-500">{ageFrom(s.birthDate)} ans · {s.schoolLevel} · {s.school}</p>
                      </div>
                      <Badge bg={STATUS_META[s.status].bg} fg={STATUS_META[s.status].fg}>{STATUS_META[s.status].label}</Badge>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex-1"><ProgressBar value={prog} height={7} color={prog >= 70 ? "#1f6c57" : prog >= 40 ? "#d2921a" : "#c75540"} /></div>
                      <span className="text-xs font-bold text-pine-700">{prog} %</span>
                    </div>
                    <p className="mt-3 flex items-center gap-1.5 text-[11px] text-pine-500">
                      <Building2 size={12} /> Référent : {pro ? `${pro.firstName} ${pro.lastName}` : "non attribué"}
                    </p>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </>
      )}

      {modalOpen && (
        <StudentFormModal key={editing?.id ?? "nouveau"} open onClose={() => setModalOpen(false)} editing={editing} pros={pros} parents={parents} />
      )}
    </div>
  );
}

/* Montée uniquement à l'ouverture (par le parent) : état initial toujours propre. */
function StudentFormModal({ open, onClose, editing, pros, parents }: {
  open: boolean; onClose: () => void; editing: Student | null;
  pros: { id: string; firstName: string; lastName: string }[];
  parents: { id: string; firstName: string; lastName: string }[];
}) {
  const state = useApp();
  const me = state.currentUser!;
  const navigate = useNavigate();
  const [form, setForm] = useState(() =>
    editing
      ? { firstName: editing.firstName, lastName: editing.lastName, birthDate: editing.birthDate, schoolLevel: editing.schoolLevel, school: editing.school, parentId: editing.parentId, professionalId: editing.professionalId, status: editing.status, difficulties: [...editing.difficulties] }
      : { firstName: "", lastName: "", birthDate: "", schoolLevel: "CM1", school: "", parentId: parents[0]?.id ?? "", professionalId: me.role === "professional" ? me.id : pros[0]?.id ?? "", status: "actif" as StudentStatus, difficulties: [] as string[] }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.firstName.trim().length < 2) errs.firstName = "Prénom requis.";
    if (form.lastName.trim().length < 2) errs.lastName = "Nom requis.";
    if (!form.birthDate) errs.birthDate = "Date de naissance requise.";
    if (form.school.trim().length < 3) errs.school = "Établissement requis.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    if (editing) {
      state.updateStudent(editing.id, { ...form });
    } else {
      const created = state.addStudent({ ...form, notes: "" });
      navigate(`/dashboard/students/${created.id}`);
    }
    onClose();
  };

  const toggleDiff = (id: string) =>
    setForm((f) => ({ ...f, difficulties: f.difficulties.includes(id) ? f.difficulties.filter((d) => d !== id) : [...f.difficulties, id] }));

  return (
    <Modal open={open} onClose={onClose} title={editing ? `Modifier ${fullName(editing)}` : "Ajouter un élève"} wide>
      <form onSubmit={submit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Prénom" error={errors.firstName}>
            <input className={inputCls(errors.firstName)} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="Emma" />
          </Field>
          <Field label="Nom" error={errors.lastName}>
            <input className={inputCls(errors.lastName)} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Moreau" />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Date de naissance" error={errors.birthDate}>
            <input type="date" max={todayISO()} className={inputCls(errors.birthDate)} value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} />
          </Field>
          <Field label="Niveau scolaire">
            <select className={inputCls()} value={form.schoolLevel} onChange={(e) => setForm({ ...form, schoolLevel: e.target.value })}>
              {SCHOOL_LEVELS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </Field>
          <Field label="Statut">
            <select className={inputCls()} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as StudentStatus })}>
              <option value="actif">Actif</option>
              <option value="en_attente">En attente</option>
              <option value="suspendu">Suspendu</option>
            </select>
          </Field>
        </div>
        <Field label="Établissement" error={errors.school}>
          <input className={inputCls(errors.school)} value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} placeholder="École Jean-Moulin" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Parent / tuteur">
            <select className={inputCls()} value={form.parentId} onChange={(e) => setForm({ ...form, parentId: e.target.value })}>
              {parents.map((p) => <option key={p.id} value={p.id}>{fullName(p)}</option>)}
            </select>
          </Field>
          <Field label="Professionnel référent">
            <select className={inputCls()} value={form.professionalId} onChange={(e) => setForm({ ...form, professionalId: e.target.value })}>
              {pros.map((p) => <option key={p.id} value={p.id}>{fullName(p)}</option>)}
            </select>
          </Field>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold text-pine-700">Difficultés identifiées</p>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTIES.map((d) => {
              const on = form.difficulties.includes(d.id);
              return (
                <button type="button" key={d.id} onClick={() => toggleDiff(d.id)} aria-pressed={on} className={`rounded-full border px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${on ? "border-transparent shadow-soft" : "border-pine-200 bg-white text-pine-600 hover:border-pine-400"}`} style={on ? { backgroundColor: d.bg, color: d.fg } : undefined}>
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-pine-100 pt-5">
          <Button type="button" variant="ghost" onClick={onClose}>Annuler</Button>
          <Button type="submit">{editing ? "Enregistrer les modifications" : "Créer le dossier élève"}</Button>
        </div>
      </form>
    </Modal>
  );
}

export { STATUS_META };
