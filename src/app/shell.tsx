import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Target, CalendarDays, ClipboardList, BarChart3, Library,
  MessageSquare, FileText, Settings, LogOut, Bell, Menu, X, Sparkles, GraduationCap,
  CheckCircle2, Info, AlertTriangle,
} from "lucide-react";
import { Avatar, Badge, Button, Logo } from "../components/ui";
import { unreadMessages, unreadNotifications, useApp } from "../lib/store";
import { fmtDateTime, fullName } from "../lib/data";

const NAV: { to: string; label: string; icon: ReactNode; roles: string[] }[] = [
  { to: "/dashboard", label: "Tableau de bord", icon: <LayoutDashboard size={18} />, roles: ["admin", "professional", "parent", "student", "teacher"] },
  { to: "/dashboard/students", label: "Élèves", icon: <Users size={18} />, roles: ["admin", "professional"] },
  { to: "/dashboard/goals", label: "Objectifs", icon: <Target size={18} />, roles: ["admin", "professional", "parent"] },
  { to: "/dashboard/sessions", label: "Séances", icon: <ClipboardList size={18} />, roles: ["admin", "professional"] },
  { to: "/dashboard/calendar", label: "Calendrier", icon: <CalendarDays size={18} />, roles: ["admin", "professional", "parent", "student"] },
  { to: "/dashboard/evaluations", label: "Évaluations", icon: <BarChart3 size={18} />, roles: ["admin", "professional", "parent"] },
  { to: "/dashboard/resources", label: "Ressources", icon: <Library size={18} />, roles: ["admin", "professional", "parent", "student"] },
  { to: "/dashboard/messages", label: "Messagerie", icon: <MessageSquare size={18} />, roles: ["admin", "professional", "parent", "teacher"] },
  { to: "/dashboard/reports", label: "Rapports", icon: <FileText size={18} />, roles: ["admin", "professional"] },
  { to: "/dashboard/settings", label: "Paramètres", icon: <Settings size={18} />, roles: ["admin", "professional", "parent"] },
];

const TITLES: Record<string, string> = {
  "/dashboard": "Tableau de bord",
  "/dashboard/students": "Gestion des élèves",
  "/dashboard/goals": "Objectifs pédagogiques",
  "/dashboard/sessions": "Séances pédagogiques",
  "/dashboard/calendar": "Calendrier",
  "/dashboard/evaluations": "Évaluations",
  "/dashboard/resources": "Ressources pédagogiques",
  "/dashboard/messages": "Messagerie",
  "/dashboard/reports": "Rapports de suivi",
  "/dashboard/settings": "Paramètres",
};

const ROLE_LABEL: Record<string, string> = {
  admin: "Administrateur",
  professional: "Professionnel",
  parent: "Parent",
  student: "Élève",
  teacher: "Enseignant",
};

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useApp((s) => s.currentUser);
  const logout = useApp((s) => s.logout);
  const notifications = useApp((s) => s.notifications);
  const markAllNotificationsRead = useApp((s) => s.markAllNotificationsRead);
  const markNotificationRead = useApp((s) => s.markNotificationRead);
  const toast = useApp((s) => s.toast);
  const unreadNotifs = useApp(unreadNotifications);
  const unreadMsgs = useApp(unreadMessages);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    const title = Object.keys(TITLES).find((k) => location.pathname.startsWith(k));
    document.title = `${title ? TITLES[title] : "Espace"} — Clinique d'Éducation`;
  }, [location.pathname]);

  if (!currentUser) return null;

  const items = NAV.filter((n) => n.roles.includes(currentUser.role));
  const myNotifs = notifications.filter((n) => n.userId === currentUser.id).slice(0, 12);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="px-5 py-5">
        <Link to="/"><Logo size="sm" /></Link>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto nice-scroll px-3 py-2" aria-label="Navigation principale">
        {items.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.to === "/dashboard"}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-pine-800 text-paper shadow-soft"
                  : "text-pine-600 hover:bg-pine-100/80 hover:text-pine-900 hover:translate-x-0.5"
              }`
            }
          >
            {n.icon}
            {n.label}
            {n.to === "/dashboard/messages" && unreadMsgs > 0 && (
              <span className="ml-auto rounded-full bg-marigold-400 px-2 py-0.5 text-[10px] font-bold text-pine-950">{unreadMsgs}</span>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-pine-100 p-4">
        <button
          onClick={() => toast("L'assistant IA pédagogique arrive bientôt : suggestions d'activités, synthèses de parcours…", "info")}
          className="flex w-full items-center gap-3 rounded-xl border border-dashed border-marigold-300 bg-marigold-50 px-3.5 py-3 text-left transition-all hover:bg-marigold-100 cursor-pointer"
        >
          <Sparkles size={17} className="shrink-0 text-marigold-600" />
          <span>
            <span className="block text-xs font-bold text-pine-900">Assistant IA pédagogique</span>
            <span className="block text-[10px] text-pine-600">En préparation · bientôt disponible</span>
          </span>
        </button>
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-pine-50 p-3">
          <Avatar name={fullName(currentUser)} size={38} color={currentUser.avatarColor} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-bold text-pine-900">{fullName(currentUser)}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-pine-500">{ROLE_LABEL[currentUser.role]}</p>
          </div>
          <button onClick={() => { logout(); navigate("/"); }} aria-label="Se déconnecter" className="rounded-lg p-2 text-pine-500 hover:bg-pine-100 hover:text-coral-600 transition-colors cursor-pointer">
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-paper">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] border-r border-pine-100 bg-white/85 backdrop-blur lg:block">
        {sidebar}
      </aside>

      {/* Sidebar mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-pine-950/50 backdrop-blur-[2px]" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[280px] bg-paper shadow-lift animate-fade-up">
            <button onClick={() => setMobileOpen(false)} aria-label="Fermer le menu" className="absolute right-3 top-5 rounded-lg p-2 text-pine-600 hover:bg-pine-100 cursor-pointer">
              <X size={19} />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      {/* Zone principale */}
      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-30 border-b border-pine-100 bg-paper/90 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-7">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileOpen(true)} aria-label="Ouvrir le menu" className="rounded-lg p-2 text-pine-700 hover:bg-pine-100 lg:hidden cursor-pointer">
                <Menu size={21} />
              </button>
              <div>
                <h1 className="font-display text-lg font-bold text-pine-950 leading-tight">
                  {Object.keys(TITLES).find((k) => location.pathname.startsWith(k)) ? TITLES[Object.keys(TITLES).find((k) => location.pathname.startsWith(k))!] : "Profil élève"}
                </h1>
                <p className="hidden text-[11px] text-pine-500 sm:block">
                  {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setNotifOpen(true)}
                aria-label={`Notifications${unreadNotifs > 0 ? ` (${unreadNotifs} non lues)` : ""}`}
                className="relative rounded-xl p-2.5 text-pine-600 transition-colors hover:bg-pine-100 cursor-pointer"
              >
                <Bell size={19} />
                {unreadNotifs > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-coral-600 px-1 text-[10px] font-bold text-paper">
                    {unreadNotifs}
                  </span>
                )}
              </button>
              <div className="relative">
                <button onClick={() => setUserOpen(!userOpen)} className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-pine-100 transition-colors cursor-pointer" aria-label="Menu utilisateur">
                  <Avatar name={fullName(currentUser)} size={34} color={currentUser.avatarColor} />
                  <span className="hidden text-left sm:block">
                    <span className="block text-xs font-bold text-pine-900 leading-tight">{currentUser.firstName}</span>
                    <span className="block text-[10px] text-pine-500">{ROLE_LABEL[currentUser.role]}</span>
                  </span>
                </button>
                {userOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserOpen(false)} />
                    <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-pine-100 bg-white p-1.5 shadow-lift animate-pop">
                      <p className="px-3 py-2 text-[11px] text-pine-500 truncate">{currentUser.email}</p>
                      <Link to="/dashboard/settings" className="block rounded-lg px-3 py-2 text-[13px] font-semibold text-pine-800 hover:bg-pine-50">Mon profil</Link>
                      <button onClick={() => { setUserOpen(false); logout(); navigate("/"); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold text-coral-600 hover:bg-coral-50 cursor-pointer">
                        <LogOut size={15} /> Se déconnecter
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1200px] px-4 py-7 sm:px-7">{children}</main>
      </div>

      {/* Tiroir notifications */}
      {notifOpen && (
        <div className="fixed inset-0 z-[75]">
          <div className="absolute inset-0 bg-pine-950/40 backdrop-blur-[2px]" onClick={() => setNotifOpen(false)} />
          <aside className="absolute inset-y-0 right-0 flex w-[min(94vw,380px)] flex-col bg-paper shadow-lift animate-fade-up" aria-label="Notifications">
            <div className="flex items-center justify-between border-b border-pine-100 px-5 py-4">
              <h2 className="font-display text-lg font-bold text-pine-950">Notifications</h2>
              <div className="flex items-center gap-2">
                {unreadNotifs > 0 && (
                  <Button size="sm" variant="ghost" onClick={() => markAllNotificationsRead(currentUser.id)}>Tout marquer lu</Button>
                )}
                <button onClick={() => setNotifOpen(false)} aria-label="Fermer" className="rounded-lg p-2 text-pine-600 hover:bg-pine-100 cursor-pointer">
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 space-y-2.5 overflow-y-auto nice-scroll p-4">
              {myNotifs.length === 0 && (
                <p className="px-4 py-10 text-center text-sm text-pine-500">Aucune notification pour le moment.</p>
              )}
              {myNotifs.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      markNotificationRead(n.id);
                      if (n.link) {
                        setNotifOpen(false);
                        navigate(n.link);
                      }
                    }}
                    className={`flex w-full gap-3 rounded-xl border p-3.5 text-left transition-all cursor-pointer hover:border-pine-300 hover:shadow-soft ${n.read ? "border-pine-100 bg-white/60" : "border-pine-200 bg-white shadow-soft"}`}
                  >
                    <span className={`mt-0.5 shrink-0 rounded-lg p-2 ${n.kind === "success" ? "bg-pine-100 text-pine-700" : n.kind === "warning" ? "bg-marigold-100 text-marigold-700" : "bg-sea-100 text-sea-700"}`}>
                      {n.kind === "success" ? <CheckCircle2 size={16} /> : n.kind === "warning" ? <AlertTriangle size={16} /> : <Info size={16} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-[13px] font-bold text-pine-900">{n.title}</span>
                        {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-marigold-500" />}
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-pine-600">{n.message}</span>
                      <span className="mt-1.5 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wide text-pine-400">
                        {fmtDateTime(n.createdAt)}
                        {n.link && <span className="text-pine-600">Ouvrir →</span>}
                      </span>
                    </span>
                  </button>
              ))}
            </div>
          </aside>
        </div>
      )}

    </div>
  );
}
