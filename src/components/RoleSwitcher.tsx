import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, User, GraduationCap, HeartHandshake, School, X } from "lucide-react";
import { useApp } from "../lib/store";
import type { Role } from "../lib/data";

const ROLES: { role: Role; label: string; icon: React.ReactNode; color: string; email: string }[] = [
  { role: "admin", label: "Administrateur", icon: <Users size={18} />, color: "#1f6c57", email: "admin@clinique-education.fr" },
  { role: "professional", label: "Professionnel", icon: <User size={18} />, color: "#3f6577", email: "k.haddad@clinique-education.fr" },
  { role: "parent", label: "Parent", icon: <HeartHandshake size={18} />, color: "#b37413", email: "claire.moreau@email.fr" },
  { role: "student", label: "Élève", icon: <GraduationCap size={18} />, color: "#de7257", email: "emma@clinique-education.fr" },
  { role: "teacher", label: "Enseignant", icon: <School size={18} />, color: "#5ca28a", email: "j.perrin@ac-paris.fr" },
];

export function RoleSwitcher() {
  const [open, setOpen] = useState(false);
  const loginAs = useApp((s) => s.loginAs);
  const currentUser = useApp((s) => s.currentUser);
  const navigate = useNavigate();

  const handleSwitch = (role: Role) => {
    loginAs(role);
    setOpen(false);
    navigate("/dashboard");
  };

  const currentRole = ROLES.find((r) => r.role === currentUser?.role);

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-pine-700 text-paper shadow-lift transition-all hover:scale-110 hover:bg-pine-600 active:scale-95"
        aria-label="Changer de rôle"
      >
        {open ? <X size={24} /> : currentRole ? currentRole.icon : <Users size={24} />}
      </button>

      {/* Menu déroulant */}
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-pine-950/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="fixed bottom-24 right-6 z-50 w-72 rounded-2xl border border-pine-100 bg-white p-3 shadow-lift animate-fade-up">
            <p className="mb-3 px-2 text-xs font-bold uppercase tracking-wider text-pine-500">Basculer vers</p>
            <div className="space-y-1">
              {ROLES.map((r) => (
                <button
                  key={r.role}
                  onClick={() => handleSwitch(r.role)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all hover:bg-pine-50 ${
                    currentUser?.role === r.role ? "bg-pine-100 font-semibold" : ""
                  }`}
                >
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-paper"
                    style={{ backgroundColor: r.color }}
                  >
                    {r.icon}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-pine-900">{r.label}</span>
                    <span className="block text-[11px] text-pine-500">{r.email}</span>
                  </span>
                  {currentUser?.role === r.role && (
                    <span className="rounded-full bg-pine-600 px-2 py-0.5 text-[10px] font-bold text-paper">Actif</span>
                  )}
                </button>
              ))}
            </div>
            <p className="mt-3 border-t border-pine-100 px-2 pt-3 text-[11px] leading-relaxed text-pine-500">
              Mot de passe pour tous les comptes : <strong className="text-pine-700">demo123</strong>
            </p>
          </div>
        </>
      )}
    </>
  );
}
