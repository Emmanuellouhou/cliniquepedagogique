import { useEffect } from "react";
import { HashRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Building2 } from "lucide-react";
import { ToastHost } from "./components/ui";
import { useApp } from "./lib/store";
import type { Role } from "./lib/data";
import { PublicLayout, HomePage, AboutPage, ApprochePage, ServicesPage, ResourcesPublicPage, FaqPage, ContactPage } from "./pages/public";
import { LoginPage, RegisterPage } from "./pages/auth";
import { AppShell } from "./app/shell";
import { AdminDashboard, ProDashboard } from "./pages/dashboards";
import { ParentDashboard, StudentSpace } from "./pages/spaces";
import { StudentsPage } from "./pages/students";
import { StudentProfilePage } from "./pages/student-profile";
import { SessionsPage } from "./pages/sessions";
import { CalendarPage } from "./pages/calendar";
import { MessagesPage } from "./pages/messages";
import { GoalsPage, EvaluationsPage, ResourcesPage, ReportsPage, SettingsPage } from "./pages/modules";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo({ top: 0 }), [pathname]);
  return null;
}

function Public({ children }: { children: React.ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const user = useApp((s) => s.currentUser);
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function Protected({ children }: { children: React.ReactNode }) {
  const user = useApp((s) => s.currentUser);
  if (!user) return <Navigate to="/login" replace />;
  return <AppShell>{children}</AppShell>;
}

function RoleRoute({ roles, children }: { roles: Role[]; children: React.ReactNode }) {
  const user = useApp((s) => s.currentUser);
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function TeacherSoon() {
  return (
    <div className="mx-auto max-w-xl py-16 text-center">
      <span className="mx-auto inline-flex rounded-2xl bg-pine-100 p-5 text-pine-600"><Building2 size={30} /></span>
      <h2 className="mt-5 font-display text-2xl font-bold text-pine-950">Espace établissement — bientôt disponible</h2>
      <p className="mt-3 text-sm leading-relaxed text-pine-600">
        L'intégration des enseignants et des établissements est prévue dans la prochaine évolution de la plateforme :
        partage d'observations, objectifs communs et coordination pédagogique. En attendant, la clinique reste votre interlocutrice directe.
      </p>
    </div>
  );
}

function DashboardHome() {
  const user = useApp((s) => s.currentUser);
  if (!user) return null;
  switch (user.role) {
    case "admin": return <AdminDashboard />;
    case "professional": return <ProDashboard />;
    case "parent": return <ParentDashboard />;
    case "student": return <StudentSpace />;
    case "teacher": return <TeacherSoon />;
    default: return null;
  }
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        {/* Pages publiques */}
        <Route path="/" element={<Public><HomePage /></Public>} />
        <Route path="/about" element={<Public><AboutPage /></Public>} />
        <Route path="/approche" element={<Public><ApprochePage /></Public>} />
        <Route path="/services" element={<Public><ServicesPage /></Public>} />
        <Route path="/resources" element={<Public><ResourcesPublicPage /></Public>} />
        <Route path="/faq" element={<Public><FaqPage /></Public>} />
        <Route path="/contact" element={<Public><ContactPage /></Public>} />

        {/* Authentification */}
        <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
        <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />

        {/* Espace protégé */}
        <Route path="/dashboard" element={<Protected><DashboardHome /></Protected>} />
        <Route path="/dashboard/students" element={<Protected><RoleRoute roles={["admin", "professional"]}><StudentsPage /></RoleRoute></Protected>} />
        <Route path="/dashboard/students/:id" element={<Protected><RoleRoute roles={["admin", "professional", "parent", "student"]}><StudentProfilePage /></RoleRoute></Protected>} />
        <Route path="/dashboard/goals" element={<Protected><RoleRoute roles={["admin", "professional", "parent"]}><GoalsPage /></RoleRoute></Protected>} />
        <Route path="/dashboard/sessions" element={<Protected><RoleRoute roles={["admin", "professional"]}><SessionsPage /></RoleRoute></Protected>} />
        <Route path="/dashboard/calendar" element={<Protected><CalendarPage /></Protected>} />
        <Route path="/dashboard/evaluations" element={<Protected><RoleRoute roles={["admin", "professional", "parent"]}><EvaluationsPage /></RoleRoute></Protected>} />
        <Route path="/dashboard/resources" element={<Protected><ResourcesPage /></Protected>} />
        <Route path="/dashboard/messages" element={<Protected><RoleRoute roles={["admin", "professional", "parent"]}><MessagesPage /></RoleRoute></Protected>} />
        <Route path="/dashboard/reports" element={<Protected><RoleRoute roles={["admin", "professional"]}><ReportsPage /></RoleRoute></Protected>} />
        <Route path="/dashboard/settings" element={<Protected><RoleRoute roles={["admin", "professional", "parent"]}><SettingsPage /></RoleRoute></Protected>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastHost />
    </HashRouter>
  );
}
