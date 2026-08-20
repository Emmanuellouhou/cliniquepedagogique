import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ShieldCheck, KeyRound, UserPlus, Sparkles } from "lucide-react";
import { Button, Field, Logo, inputCls, Avatar } from "../components/ui";
import { useApp } from "../lib/store";
import type { Role } from "../lib/data";

function AuthFrame({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex min-h-screen bg-paper">
      {/* Panneau brand */}
      <aside className="relative hidden w-[46%] overflow-hidden bg-pine-950 p-10 text-paper lg:flex lg:flex-col">
        <div className="absolute inset-0 bg-grid-soft opacity-30" aria-hidden="true" />
        <div className="absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-pine-600/25 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-marigold-500/10 blur-3xl" aria-hidden="true" />
        <Link to="/" className="relative w-fit">
          <Logo dark />
        </Link>
        <div className="relative mt-auto">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-marigold-300">
            <Sparkles size={14} /> Accompagner, soutenir et réussir
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight">
            Le point central de tous les parcours éducatifs.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-pine-300">
            Élèves, parents, professionnels et établissements suivent la progression sur une seule plateforme — sécurisée, claire et bienveillante.
          </p>
          <div className="mt-8 flex items-center gap-4 rounded-2xl border border-pine-800 bg-pine-900/70 p-4">
            <ShieldCheck size={22} className="shrink-0 text-marigold-300" />
            <p className="text-xs leading-relaxed text-pine-200">
              <strong className="text-paper">Données confidentielles.</strong> Chaque utilisateur n'accède qu'aux informations qui le concernent, selon son rôle.
            </p>
          </div>
        </div>
      </aside>

      {/* Formulaire */}
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-xs font-bold text-pine-600 hover:text-pine-800 transition-colors">
            <ArrowLeft size={15} /> Retour au site
          </Link>
          <div className="lg:hidden mb-8"><Logo /></div>
          <h1 className="font-display text-3xl font-bold text-pine-950">{title}</h1>
          <p className="mt-2 text-sm text-pine-600">{subtitle}</p>
          {children}
        </div>
      </main>
    </div>
  );
}

const DEMO_ACCOUNTS: { role: Role; label: string; desc: string; color: string; email: string }[] = [
  { role: "admin", label: "Administrateur", desc: "Vue globale, statistiques, gestion", color: "#1f6c57", email: "admin@clinique-education.fr" },
  { role: "professional", label: "Professionnel", desc: "Élèves, séances, comptes rendus", color: "#3f6577", email: "k.haddad@clinique-education.fr" },
  { role: "parent", label: "Parent", desc: "Suivi de votre enfant", color: "#b37413", email: "claire.moreau@email.fr" },
  { role: "student", label: "Élève", desc: "Espace simple et motivant", color: "#de7257", email: "emma@clinique-education.fr" },
];

export function LoginPage() {
  const login = useApp((s) => s.login);
  const loginAs = useApp((s) => s.loginAs);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { document.title = "Connexion — Clinique d'Éducation & de l'Innovation Pédagogique"; }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Veuillez saisir une adresse e-mail valide.");
    if (password.length < 6) return setError("Le mot de passe doit contenir au moins 6 caractères.");
    setLoading(true);
    setTimeout(() => {
      const res = login(email, password);
      setLoading(false);
      if (!res.ok) return setError(res.error ?? "Connexion impossible.");
      navigate("/dashboard");
    }, 500);
  };

  return (
    <AuthFrame title="Bon retour !" subtitle="Connectez-vous pour retrouver votre espace personnalisé.">
      <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
        <Field label="Adresse e-mail">
          <input type="email" autoComplete="email" className={inputCls()} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.fr" />
        </Field>
        <Field label="Mot de passe" hint="Pour la démo, tous les comptes utilisent « demo123 »">
          <input type="password" autoComplete="current-password" className={inputCls()} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </Field>
        {error && (
          <p className="rounded-xl border border-coral-200 bg-coral-50 px-4 py-3 text-[13px] font-medium text-coral-700 animate-fade-up" role="alert">
            {error}
          </p>
        )}
        <div className="flex items-center justify-between">
          <Link to="/register" className="text-[13px] font-semibold text-pine-700 hover:text-pine-600">Créer un compte</Link>
          <button type="button" className="text-[13px] font-semibold text-pine-500 hover:text-pine-700 transition-colors cursor-pointer">
            Mot de passe oublié ?
          </button>
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Connexion en cours…" : <>Se connecter <ArrowRight size={16} /></>}
        </Button>
      </form>

      <div className="mt-9">
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-pine-200" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-pine-400">Explorer la démo</span>
          <span className="h-px flex-1 bg-pine-200" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {DEMO_ACCOUNTS.map((d) => (
            <button
              key={d.role}
              onClick={() => { loginAs(d.role); navigate("/dashboard"); }}
              className="group flex items-center gap-3 rounded-xl border border-pine-100 bg-white px-3.5 py-3 text-left shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-pine-300 hover:shadow-lift cursor-pointer"
            >
              <Avatar name={d.label} size={34} color={d.color} />
              <span>
                <span className="block text-[13px] font-bold text-pine-900 group-hover:text-pine-700">{d.label}</span>
                <span className="block text-[10px] leading-tight text-pine-500">{d.desc}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </AuthFrame>
  );
}

export function RegisterPage() {
  const registerParent = useApp((s) => s.registerParent);
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => { document.title = "Créer un compte — Clinique d'Éducation & de l'Innovation Pédagogique"; }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.firstName.trim().length < 2) errs.firstName = "Prénom requis.";
    if (form.lastName.trim().length < 2) errs.lastName = "Nom requis.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "E-mail invalide.";
    if (form.password.length < 6) errs.password = "Au moins 6 caractères.";
    if (form.confirm !== form.password) errs.confirm = "Les mots de passe ne correspondent pas.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    setTimeout(() => {
      const res = registerParent({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password, phone: form.phone || undefined });
      setLoading(false);
      if (!res.ok) return setErrors({ email: res.error ?? "Inscription impossible." });
      navigate("/dashboard");
    }, 600);
  };

  return (
    <AuthFrame title="Créer un espace parent" subtitle="Suivez l'accompagnement de votre enfant en toute transparence.">
      <div className="mt-5 flex items-start gap-3 rounded-xl bg-marigold-50 border border-marigold-200 px-4 py-3">
        <KeyRound size={16} className="mt-0.5 shrink-0 text-marigold-600" />
        <p className="text-xs leading-relaxed text-pine-800">
          Vous êtes professionnel ou établissement ? Contactez la clinique pour l'ouverture d'un compte adapté à votre rôle.
        </p>
      </div>
      <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Prénom" error={errors.firstName}>
            <input className={inputCls(errors.firstName)} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="Claire" />
          </Field>
          <Field label="Nom" error={errors.lastName}>
            <input className={inputCls(errors.lastName)} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Moreau" />
          </Field>
        </div>
        <Field label="Adresse e-mail" error={errors.email}>
          <input type="email" className={inputCls(errors.email)} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="vous@exemple.fr" />
        </Field>
        <Field label="Téléphone (facultatif)">
          <input className={inputCls()} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="06 12 34 56 78" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Mot de passe" error={errors.password}>
            <input type="password" className={inputCls(errors.password)} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="6 caractères min." />
          </Field>
          <Field label="Confirmation" error={errors.confirm}>
            <input type="password" className={inputCls(errors.confirm)} value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} placeholder="••••••••" />
          </Field>
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Création du compte…" : <><UserPlus size={17} /> Créer mon compte parent</>}
        </Button>
        <p className="text-center text-[13px] text-pine-600">
          Déjà inscrit(e) ?{" "}
          <Link to="/login" className="font-bold text-pine-800 hover:text-pine-600">Se connecter</Link>
        </p>
      </form>
    </AuthFrame>
  );
}
