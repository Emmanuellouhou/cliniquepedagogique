import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AppNotification,
  Evaluation,
  Goal,
  Message,
  Resource,
  Role,
  Session,
  SessionReport,
  SessionStatus,
  Student,
  Toast,
  User,
} from "./data";
import { addDaysISO, buildSeed, uid } from "./data";

/* ------------------------------------------------------------------ */
/*  Store applicatif — architecture prête pour Supabase :              */
/*  chaque action correspond à un appel API futur (auth, tables, RLS). */
/* ------------------------------------------------------------------ */

export interface AppState {
  users: User[];
  students: Student[];
  goals: Goal[];
  sessions: Session[];
  reports: SessionReport[];
  evaluations: Evaluation[];
  resources: Resource[];
  messages: Message[];
  notifications: AppNotification[];
  completedActivities: string[]; // espace élève
  currentUser: User | null;
  toasts: Toast[];

  /* ---- Auth ---- */
  login: (email: string, password: string) => { ok: boolean; error?: string };
  loginAs: (role: Role) => void;
  logout: () => void;
  registerParent: (data: { firstName: string; lastName: string; email: string; password: string; phone?: string }) => { ok: boolean; error?: string };

  /* ---- UI ---- */
  toast: (message: string, kind?: Toast["kind"]) => void;
  dismissToast: (id: string) => void;

  /* ---- Élèves ---- */
  addStudent: (s: Omit<Student, "id" | "joinedAt">) => Student;
  updateStudent: (id: string, patch: Partial<Student>) => void;

  /* ---- Objectifs ---- */
  addGoal: (g: Omit<Goal, "id">) => void;
  updateGoal: (id: string, patch: Partial<Goal>) => void;

  /* ---- Séances & comptes rendus ---- */
  addSession: (s: Omit<Session, "id">) => void;
  updateSession: (id: string, patch: Partial<Session>) => void;
  setSessionStatus: (id: string, status: SessionStatus) => void;
  saveReport: (sessionId: string, data: Omit<SessionReport, "id" | "sessionId" | "createdAt">) => void;

  /* ---- Évaluations ---- */
  addEvaluation: (e: Omit<Evaluation, "id">) => void;

  /* ---- Ressources ---- */
  addResource: (r: Omit<Resource, "id" | "createdAt">) => void;
  assignResource: (id: string, studentIds: string[]) => void;

  /* ---- Messagerie & notifications ---- */
  sendMessage: (senderId: string, receiverId: string, content: string, attachment?: string) => void;
  markThreadRead: (meId: string, otherId: string) => void;
  markAllNotificationsRead: (userId: string) => void;

  /* ---- Utilisateurs ---- */
  updateUser: (id: string, patch: Partial<User>) => void;

  /* ---- Espace élève ---- */
  toggleActivity: (resourceId: string) => void;

  /* ---- Démo ---- */
  resetDemo: () => void;
}

function notify(state: AppState, userId: string, title: string, message: string, kind: AppNotification["kind"]): AppNotification[] {
  return [
    { id: uid(), userId, title, message, kind, read: false, createdAt: new Date().toISOString() },
    ...state.notifications,
  ];
}

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      ...buildSeed(),
      completedActivities: ["re-6", "re-1"],
      currentUser: null,
      toasts: [],

      /* ---- Auth ---- */
      login: (email, password) => {
        const user = get().users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
        if (!user) return { ok: false, error: "Aucun compte ne correspond à cet e-mail." };
        if (user.password !== password) return { ok: false, error: "Mot de passe incorrect. Veuillez réessayer." };
        if (user.role === "teacher") return { ok: false, error: "L'espace établissement ouvrira prochainement. Contactez la clinique." };
        set({ currentUser: user });
        get().toast(`Bienvenue, ${user.firstName} !`, "success");
        return { ok: true };
      },

      loginAs: (role) => {
        const map: Record<string, string> = {
          admin: "u-admin",
          professional: "u-pro1",
          parent: "u-parent",
          student: "u-eleve",
          teacher: "u-teacher",
        };
        const user = get().users.find((u) => u.id === map[role]);
        if (user) {
          set({ currentUser: user });
          get().toast(`Bienvenue, ${user.firstName} !`, "success");
        }
      },

      logout: () => {
        set({ currentUser: null });
        get().toast("Vous êtes déconnecté(e).", "info");
      },

      registerParent: (data) => {
        if (get().users.some((u) => u.email.toLowerCase() === data.email.trim().toLowerCase())) {
          return { ok: false, error: "Un compte existe déjà avec cet e-mail." };
        }
        const user: User = {
          id: uid(),
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          email: data.email.trim().toLowerCase(),
          password: data.password,
          role: "parent",
          avatarColor: "#5f8ca0",
          phone: data.phone,
          childIds: [],
          createdAt: new Date().toISOString().slice(0, 10),
        };
        set((s) => ({
          users: [...s.users, user],
          currentUser: user,
          notifications: notify(s, user.id, "Bienvenue !", "Votre espace parent est prêt. La clinique vous contactera pour rattacher votre enfant.", "success"),
        }));
        get().toast("Compte créé avec succès. Bienvenue !", "success");
        return { ok: true };
      },

      /* ---- UI ---- */
      toast: (message, kind = "success") => {
        const t: Toast = { id: uid(), message, kind };
        set((s) => ({ toasts: [...s.toasts, t] }));
        setTimeout(() => get().dismissToast(t.id), 4200);
      },
      dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      /* ---- Élèves ---- */
      addStudent: (s) => {
        const student: Student = { ...s, id: uid(), joinedAt: addDaysISO(0) };
        set((st) => ({
          students: [...st.students, student],
          notifications: notify(st, s.parentId, "Dossier créé", `Le dossier de ${student.firstName} a été créé par la clinique.`, "info"),
        }));
        get().toast(`${student.firstName} ${student.lastName} a été ajouté(e).`, "success");
        return student;
      },
      updateStudent: (id, patch) => {
        set((s) => ({ students: s.students.map((st) => (st.id === id ? { ...st, ...patch } : st)) }));
        get().toast("Profil mis à jour.", "success");
      },

      /* ---- Objectifs ---- */
      addGoal: (g) => {
        set((s) => ({
          goals: [...s.goals, { ...g, id: uid() }],
          notifications: notify(
            s,
            s.students.find((st) => st.id === g.studentId)?.parentId ?? "",
            "Nouvel objectif pédagogique",
            `Un nouvel objectif a été ajouté : « ${g.title} ».`,
            "info"
          ),
        }));
        get().toast("Objectif créé.", "success");
      },
      updateGoal: (id, patch) => {
        set((s) => ({ goals: s.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)) }));
        if (patch.progress !== undefined || patch.status !== undefined) get().toast("Objectif mis à jour.", "success");
      },

      /* ---- Séances ---- */
      addSession: (se) => {
        set((s) => ({
          sessions: [...s.sessions, { ...se, id: uid() }],
          notifications: notify(
            s,
            s.students.find((st) => st.id === se.studentId)?.parentId ?? "",
            "Séance programmée",
            `Une séance de ${se.type.toLowerCase()} est programmée le ${se.date.slice(8, 10)}/${se.date.slice(5, 7)} à ${se.time}.`,
            "info"
          ),
        }));
        get().toast("Séance programmée.", "success");
      },
      updateSession: (id, patch) => {
        set((s) => ({ sessions: s.sessions.map((se) => (se.id === id ? { ...se, ...patch } : se)) }));
        get().toast("Séance mise à jour.", "success");
      },
      setSessionStatus: (id, status) => {
        set((s) => ({
          sessions: s.sessions.map((se) => {
            if (se.id !== id) return se;
            if (status === "reportee") return { ...se, status, date: addDaysISO(1, new Date(se.date + "T12:00:00")) };
            return { ...se, status };
          }),
        }));
        const labels: Record<SessionStatus, string> = {
          programmee: "Séance reprogrammée.",
          realisee: "Séance marquée comme réalisée.",
          annulee: "Séance annulée.",
          reportee: "Séance reportée à demain.",
        };
        get().toast(labels[status], status === "annulee" ? "info" : "success");
      },

      saveReport: (sessionId, data) => {
        const session = get().sessions.find((se) => se.id === sessionId);
        const report: SessionReport = { ...data, id: uid(), sessionId, createdAt: new Date().toISOString() };
        set((s) => {
          const student = s.students.find((st) => st.id === session?.studentId);
          return {
            reports: [...s.reports, report],
            sessions: s.sessions.map((se) => (se.id === sessionId ? { ...se, status: "realisee" as SessionStatus, reportId: report.id } : se)),
            notifications: student
              ? notify(s, student.parentId, "Nouveau compte rendu", `Un nouveau compte rendu est disponible pour ${student.firstName}.`, "success")
              : s.notifications,
          };
        });
        get().toast("Compte rendu enregistré. Le parent a été notifié.", "success");
      },

      /* ---- Évaluations ---- */
      addEvaluation: (e) => {
        set((s) => ({ evaluations: [...s.evaluations, { ...e, id: uid() }] }));
        get().toast("Évaluation enregistrée.", "success");
      },

      /* ---- Ressources ---- */
      addResource: (r) => {
        set((s) => ({ resources: [...s.resources, { ...r, id: uid(), createdAt: addDaysISO(0) }] }));
        get().toast("Ressource ajoutée à la bibliothèque.", "success");
      },
      assignResource: (id, studentIds) => {
        const resource = get().resources.find((r) => r.id === id);
        set((s) => {
          let notifications = s.notifications;
          studentIds.forEach((stId) => {
            const student = s.students.find((st) => st.id === stId);
            if (!student) return;
            notifications = notify(
              { ...s, notifications },
              student.parentId,
              "Nouvelle ressource",
              `Une nouvelle ressource a été attribuée à ${student.firstName} : « ${resource?.title ?? ""} ».`,
              "info"
            );
            const studentUser = s.users.find((u) => u.studentId === stId);
            if (studentUser) {
              notifications = notify(
                { ...s, notifications },
                studentUser.id,
                "Nouvelle activité",
                `Une nouvelle activité t'attend : ${resource?.title ?? ""}.`,
                "success"
              );
            }
          });
          return {
            resources: s.resources.map((r) => (r.id === id ? { ...r, assignedTo: Array.from(new Set([...r.assignedTo, ...studentIds])) } : r)),
            notifications,
          };
        });
        get().toast("Ressource attribuée. Les familles ont été notifiées.", "success");
      },

      /* ---- Messagerie ---- */
      sendMessage: (senderId, receiverId, content, attachment) => {
        const msg: Message = { id: uid(), senderId, receiverId, content, attachment, createdAt: new Date().toISOString(), read: false };
        set((s) => ({
          messages: [...s.messages, msg],
          notifications: notify(s, receiverId, "Nouveau message", content.length > 80 ? content.slice(0, 80) + "…" : content, "info"),
        }));
      },
      markThreadRead: (meId, otherId) => {
        set((s) => ({
          messages: s.messages.map((m) =>
            m.senderId === otherId && m.receiverId === meId && !m.read ? { ...m, read: true } : m
          ),
        }));
      },
      markAllNotificationsRead: (userId) => {
        set((s) => ({
          notifications: s.notifications.map((n) => (n.userId === userId ? { ...n, read: true } : n)),
        }));
      },

      /* ---- Utilisateurs ---- */
      updateUser: (id, patch) => {
        set((s) => ({
          users: s.users.map((u) => (u.id === id ? { ...u, ...patch } : u)),
          currentUser: s.currentUser?.id === id ? { ...s.currentUser, ...patch } : s.currentUser,
        }));
        get().toast("Profil mis à jour.", "success");
      },

      /* ---- Espace élève ---- */
      toggleActivity: (resourceId) => {
        set((s) => ({
          completedActivities: s.completedActivities.includes(resourceId)
            ? s.completedActivities.filter((a) => a !== resourceId)
            : [...s.completedActivities, resourceId],
        }));
        if (!get().completedActivities.includes(resourceId)) {
          get().toast("Bravo ! Activité terminée, continue comme ça !", "success");
        }
      },

      resetDemo: () => {
        const user = get().currentUser;
        set({ ...buildSeed(), completedActivities: ["re-6", "re-1"], currentUser: user });
        get().toast("Données de démonstration réinitialisées.", "info");
      },
    }),
    {
      name: "ceip-store-v1",
      version: 1,
      partialize: (s) => ({
        users: s.users,
        students: s.students,
        goals: s.goals,
        sessions: s.sessions,
        reports: s.reports,
        evaluations: s.evaluations,
        resources: s.resources,
        messages: s.messages,
        notifications: s.notifications,
        completedActivities: s.completedActivities,
        currentUser: s.currentUser,
      }),
    }
  )
);

/* --------------------------- Accès dérivés (permissions) --------------------------- */

export function visibleStudents(state: Pick<AppState, "students" | "currentUser">): Student[] {
  const u = state.currentUser;
  if (!u) return [];
  if (u.role === "admin") return state.students;
  if (u.role === "professional") return state.students.filter((s) => s.professionalId === u.id);
  if (u.role === "parent") return state.students.filter((s) => u.childIds?.includes(s.id));
  if (u.role === "student") return state.students.filter((s) => s.id === u.studentId);
  return [];
}

export function unreadNotifications(state: Pick<AppState, "notifications" | "currentUser">): number {
  if (!state.currentUser) return 0;
  return state.notifications.filter((n) => n.userId === state.currentUser!.id && !n.read).length;
}

export function unreadMessages(state: Pick<AppState, "messages" | "currentUser">): number {
  if (!state.currentUser) return 0;
  return state.messages.filter((m) => m.receiverId === state.currentUser!.id && !m.read).length;
}
