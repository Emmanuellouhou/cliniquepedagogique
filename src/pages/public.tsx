import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight, ArrowUpRight, Menu, X, Sparkles, BookOpen, Users, Compass, TrendingUp,
  HeartHandshake, Target, CalendarCheck2, FileText, Library, MessageSquare, GraduationCap,
  Phone, Mail, MapPin, Clock, CheckCircle2, ChevronDown, Eye, Lightbulb, ShieldCheck, Search,
} from "lucide-react";
import { Button, Card, Logo, ProgressBar, Reveal, CountUp, Badge, Avatar, inputCls, Field, KenBurns, SectionTitle, VideoShowcase } from "../components/ui";
import { useApp } from "../lib/store";
import { DIFFICULTIES, IMAGES, RESOURCE_CATEGORIES, fmtDate } from "../lib/data";

/* ================================ Layout public ================================ */

const NAV_LINKS = [
  { to: "/", label: "Accueil" },
  { to: "/about", label: "La clinique" },
  { to: "/approche", label: "Notre approche" },
  { to: "/services", label: "Services" },
  { to: "/resources", label: "Ressources" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

export function PublicLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const currentUser = useApp((s) => s.currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "bg-paper/90 shadow-soft backdrop-blur-md" : "bg-transparent"}`}>
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" aria-label="Accueil">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
            {NAV_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className="rounded-lg px-3 py-2 text-[13px] font-semibold text-pine-700 transition-colors hover:bg-pine-100/70 hover:text-pine-900">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2.5 lg:flex">
            {currentUser ? (
              <Button onClick={() => navigate("/dashboard")} size="sm">
                Mon espace <ArrowRight size={15} />
              </Button>
            ) : (
              <>
                <Link to="/login" className="rounded-lg px-3 py-2 text-[13px] font-semibold text-pine-700 hover:bg-pine-100/70 transition-colors">
                  Connexion
                </Link>
                <Link to="/register">
                  <Button size="sm" variant="marigold">Commencer</Button>
                </Link>
              </>
            )}
          </div>
          <button className="rounded-lg p-2 text-pine-800 hover:bg-pine-100 lg:hidden cursor-pointer" onClick={() => setOpen(!open)} aria-label="Ouvrir le menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {open && (
          <div className="border-t border-pine-100 bg-paper px-4 pb-6 pt-3 shadow-lift lg:hidden animate-fade-up">
            {NAV_LINKS.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-sm font-semibold text-pine-800 hover:bg-pine-100">
                {l.label}
              </Link>
            ))}
            <div className="mt-4 flex gap-3">
              <Link to="/login" className="flex-1" onClick={() => setOpen(false)}>
                <Button variant="secondary" className="w-full">Connexion</Button>
              </Link>
              <Link to="/register" className="flex-1" onClick={() => setOpen(false)}>
                <Button variant="marigold" className="w-full">Commencer</Button>
              </Link>
            </div>
          </div>
        )}
      </header>
      <main className="pt-[72px]">{children}</main>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-24 bg-pine-950 text-pine-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo dark />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-pine-300">
            Accompagner, soutenir et réussir. Une plateforme de suivi pédagogique pour révéler le potentiel de chaque élève.
          </p>
        </div>
        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wider text-marigold-300">Plateforme</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/approche" className="hover:text-paper transition-colors">Notre approche</Link></li>
            <li><Link to="/services" className="hover:text-paper transition-colors">Nos services</Link></li>
            <li><Link to="/resources" className="hover:text-paper transition-colors">Ressources pédagogiques</Link></li>
            <li><Link to="/register" className="hover:text-paper transition-colors">Créer un compte</Link></li>
            <li><Link to="/login" className="hover:text-paper transition-colors">Espace de connexion</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wider text-marigold-300">Informations</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/about" className="hover:text-paper transition-colors">La clinique</Link></li>
            <li><Link to="/faq" className="hover:text-paper transition-colors">Questions fréquentes</Link></li>
            <li><Link to="/contact" className="hover:text-paper transition-colors">Nous contacter</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wider text-marigold-300">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2.5"><MapPin size={16} className="mt-0.5 shrink-0 text-marigold-300" /> 12 rue des Écoles, 75005 Paris</li>
            <li className="flex items-center gap-2.5"><Phone size={16} className="shrink-0 text-marigold-300" /> 01 84 20 45 67</li>
            <li className="flex items-center gap-2.5"><Mail size={16} className="shrink-0 text-marigold-300" /> contact@clinique-education.fr</li>
            <li className="flex items-center gap-2.5"><Clock size={16} className="shrink-0 text-marigold-300" /> Lun – Sam · 9h à 19h</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-pine-800/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-pine-400 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} Clinique d'Éducation & de l'Innovation Pédagogique. Tous droits réservés.</p>
          <p className="font-display italic text-marigold-300">Accompagner, soutenir et réussir.</p>
        </div>
      </div>
    </footer>
  );
}

function PageHero({ kicker, title, text }: { kicker: string; title: string; text: string }) {
  return (
    <section className="relative overflow-hidden bg-pine-900 py-20 text-paper">
      <div className="absolute inset-0 bg-grid-soft opacity-40" aria-hidden="true" />
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-pine-600/30 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-marigold-500/10 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-marigold-300">
            <Sparkles size={14} /> {kicker}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.08] sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-pine-200">{text}</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================ Accueil ================================ */

export function HomePage() {
  const resources = useApp((s) => s.resources);
  const [faqOpen, setFaqOpen] = useState(0);
  const [profile, setProfile] = useState(0);

  useEffect(() => {
    document.title = "Clinique d'Éducation & de l'Innovation Pédagogique — Accompagner, soutenir et réussir";
  }, []);

  const profiles = [
    {
      icon: <GraduationCap size={20} />, title: "Élèves", color: "#1f6c57",
      desc: "Un accompagnement adapté à leurs besoins, à leur rythme, avec des objectifs clairs et des encouragements à chaque étape.",
      points: ["Objectifs personnels et visuels", "Séances individuelles bienveillantes", "Ressources et activités ludiques", "Progrès valorisés, jamais sanctionnés"],
    },
    {
      icon: <HeartHandshake size={20} />, title: "Parents", color: "#b37413",
      desc: "Une meilleure compréhension des difficultés de votre enfant et un suivi transparent de sa progression, semaine après semaine.",
      points: ["Tableau de bord clair et rassurant", "Comptes rendus après chaque séance", "Recommandations concrètes pour la maison", "Messagerie directe avec le professionnel"],
    },
    {
      icon: <Compass size={20} />, title: "Professionnels", color: "#3f6577",
      desc: "Des outils qui structurent l'accompagnement : parcours, séances, évaluations et rapports, au même endroit.",
      points: ["Dossiers élèves complets et centralisés", "Planification et comptes rendus rapides", "Suivi des progrès mesurable", "Rapports prêts à partager"],
    },
    {
      icon: <Users size={20} />, title: "Établissements", color: "#c75540",
      desc: "Une collaboration facilitée autour de la réussite scolaire, avec des échanges simples et des objectifs partagés.",
      points: ["Coordination avec l'équipe pédagogique", "Objectifs alignés avec la classe", "Points d'étape structurés", "Espace dédié (en préparation)"],
    },
  ];

  const services = [
    { icon: <BookOpen size={22} />, title: "Accompagnement pédagogique", desc: "Des séances individuelles centrées sur les besoins réels de l'élève : lecture, compréhension, mathématiques, écriture, méthodologie.", big: true, tone: "#1f6c57" },
    { icon: <Search size={22} />, title: "Identification des difficultés", desc: "Un bilan initial précis pour comprendre l'origine des difficultés, sans jamais poser de diagnostic médical.", tone: "#3f6577" },
    { icon: <Target size={22} />, title: "Parcours personnalisé", desc: "Des objectifs pédagogiques construits sur mesure, réévalués en continu.", tone: "#b37413" },
    { icon: <CalendarCheck2 size={22} />, title: "Suivi des progrès", desc: "Des évaluations régulières et des graphiques lisibles par toute la famille.", tone: "#c75540" },
    { icon: <HeartHandshake size={22} />, title: "Accompagnement des parents", desc: "Conseils concrets, comptes rendus et échanges directs avec les professionnels.", tone: "#5f8ca0" },
    { icon: <Library size={22} />, title: "Ressources pédagogiques", desc: "Une bibliothèque de fiches, vidéos et activités attribuées à chaque élève.", tone: "#5ca28a" },
    { icon: <Sparkles size={22} />, title: "Innovation & IA pédagogique", desc: "Un assistant intelligent en préparation : suggestions d'activités et synthèse des parcours. Toujours au service de l'humain, jamais à la place.", tone: "#8f5912", soon: true },
  ];

  const steps = [
    { n: "01", icon: <Eye size={20} />, t: "Observer", d: "Un bilan initial complet pour comprendre le profil d'apprentissage de l'élève." },
    { n: "02", icon: <Lightbulb size={20} />, t: "Comprendre", d: "Identifier les difficultés précises et les leviers de motivation." },
    { n: "03", icon: <HeartHandshake size={20} />, t: "Accompagner", d: "Un parcours personnalisé avec des séances régulières et bienveillantes." },
    { n: "04", icon: <TrendingUp size={20} />, t: "Mesurer", d: "Des progrès objectivés, partagés avec la famille et l'école." },
  ];

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-60" aria-hidden="true" />
        <div className="absolute -left-40 top-10 h-[480px] w-[480px] rounded-full bg-pine-200/40 blur-3xl" aria-hidden="true" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-marigold-200/50 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-6">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-pine-200 bg-white/80 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-pine-700">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-pine-500 animate-ping-dot" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-pine-600" />
                </span>
                Plateforme de suivi pédagogique
              </span>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="mt-6 font-display text-[44px] font-bold leading-[1.02] text-pine-950 sm:text-6xl lg:text-[64px]">
                Accompagner.
                <br />
                Soutenir.
                <br />
                <span className="relative inline-block text-pine-600">
                  Réussir.
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 220 14" fill="none" aria-hidden="true">
                    <path d="M4 10C60 3 150 3 216 8" stroke="#e1ab35" strokeWidth="5" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-7 max-w-lg text-[15px] leading-relaxed text-pine-700/90">
                Un accompagnement pédagogique personnalisé pour aider chaque élève à révéler son potentiel et progresser à son rythme.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-8 flex flex-wrap gap-3.5">
                <Link to="/register">
                  <Button size="lg">
                    Commencer un accompagnement <ArrowRight size={17} />
                  </Button>
                </Link>
                <Link to="/approche">
                  <Button size="lg" variant="secondary">
                    Découvrir notre approche
                  </Button>
                </Link>
              </div>
            </Reveal>
            <Reveal delay={400}>
              <div className="mt-9 flex items-center gap-4">
                <div className="flex -space-x-2.5">
                  <Avatar name="Emma Moreau" size={34} color="#de7257" />
                  <Avatar name="Nathan Dubois" size={34} color="#37856d" />
                  <Avatar name="Sarah Khelifi" size={34} color="#b37413" />
                  <Avatar name="Lucas Petit" size={34} color="#3f6577" />
                </div>
                <p className="text-xs leading-relaxed text-pine-600">
                  <span className="font-bold text-pine-900">5 élèves</span> déjà accompagnés ·<br className="sm:hidden" /> 3 spécialistes · 1 plateforme commune
                </p>
              </div>
            </Reveal>
          </div>

          <div className="relative lg:col-span-6">
            <Reveal delay={200}>
              <div className="relative ml-2 sm:ml-6">
                <div className="absolute -left-6 -top-6 hidden h-full w-full rounded-[30px] border-2 border-dashed border-pine-300 sm:block" aria-hidden="true" />
                <img
                  src={IMAGES.hero}
                  alt="Une pédagogue congolaise accompagne une élève dans un atelier lumineux à Brazzaville"
                  className="relative w-full rounded-[30px] object-cover shadow-lift"
                  style={{ aspectRatio: "5/4" }}
                />
                <div className="absolute -right-2 top-8 w-[200px] rounded-2xl border border-pine-100 bg-white/95 p-4 shadow-lift backdrop-blur animate-float sm:-right-6">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-pine-500">Progression · Emma</p>
                  <p className="mt-1 flex items-baseline justify-between font-display text-sm font-bold text-pine-900">
                    Lecture <span className="text-pine-600">72 %</span>
                  </p>
                  <div className="mt-2"><ProgressBar value={72} /></div>
                  <p className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-pine-500">
                    <TrendingUp size={11} className="text-pine-600" /> +20 points en 3 mois
                  </p>
                </div>
                <div className="absolute -left-3 bottom-10 w-[220px] rounded-2xl border border-pine-100 bg-white/95 p-4 shadow-lift backdrop-blur animate-float-slow sm:-left-10">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-pine-500">Prochaine séance</p>
                    <CalendarCheck2 size={15} className="text-marigold-500" />
                  </div>
                  <p className="mt-1.5 font-display text-sm font-bold text-pine-900">Mercredi · 15h00</p>
                  <p className="text-xs text-pine-600">Compréhension — avec Karim</p>
                </div>
                <div className="absolute -bottom-5 right-6 hidden items-center gap-2 rounded-full bg-pine-800 px-4 py-2.5 text-xs font-bold text-paper shadow-lift sm:flex">
                  <CheckCircle2 size={15} className="text-marigold-300" /> Objectif atteint : confiance à l'oral
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Bandeau chiffres */}
        <div className="relative border-y border-pine-200/70 bg-white/70 backdrop-blur">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4">
            {[
              { v: 128, s: "+", l: "élèves accompagnés depuis l'ouverture" },
              { v: 3400, s: "+", l: "séances pédagogiques réalisées" },
              { v: 92, s: " %", l: "de familles satisfaites du suivi" },
              { v: 14, s: "", l: "établissements scolaires partenaires" },
            ].map((it, i) => (
              <Reveal key={it.l} delay={i * 90}>
                <p className="font-display text-3xl font-bold text-pine-800 sm:text-4xl">
                  <CountUp to={it.v} suffix={it.s} />
                </p>
                <p className="mt-1 text-xs leading-snug text-pine-600">{it.l}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Ticker compétences ---------- */}
      <div className="overflow-hidden bg-pine-900 py-3.5" aria-hidden="true">
        <div className="flex w-max animate-marquee gap-8">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center gap-8">
              {DIFFICULTIES.map((d) => (
                <span key={`${dup}-${d.id}`} className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-pine-200">
                  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M5 0l1.2 3.8L10 5 6.2 6.2 5 10 3.8 6.2 0 5l3.8-1.2z" fill="#e1ab35" /></svg>
                  {d.label}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Mission ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-pine-600">
                <HeartHandshake size={15} /> Notre mission
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-pine-950 sm:text-4xl">
                Chaque difficulté scolaire mérite une réponse <span className="text-pine-600">humaine et structurée</span>.
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-pine-700/90">
                La Clinique d'Éducation & de l'Innovation Pédagogique n'est pas une clinique médicale : c'est un lieu d'observation,
                de compréhension et d'accompagnement des apprentissages. Nous aidons les élèves en difficulté à retrouver confiance,
                méthode et plaisir d'apprendre — avec leurs parents et leurs enseignants.
              </p>
            </Reveal>
            <div className="mt-8 space-y-4">
              {[
                { t: "Écoute", d: "Partir de l'élève, de son vécu et de son ressenti." },
                { t: "Accompagnement", d: "Un professionnel référent qui suit l'élève dans la durée." },
                { t: "Personnalisation", d: "Un parcours construit sur mesure, jamais standardisé." },
                { t: "Confiance", d: "Restaurer l'estime de soi comme moteur des progrès." },
                { t: "Progression", d: "Mesurer objectivement chaque avancée, aussi petite soit-elle." },
              ].map((v, i) => (
                <Reveal key={v.t} delay={i * 80}>
                  <div className="group flex items-start gap-4 rounded-xl border border-transparent p-3 transition-all hover:border-pine-100 hover:bg-white hover:shadow-soft">
                    <span className="mt-0.5 font-display text-sm font-bold text-marigold-500">0{i + 1}</span>
                    <div>
                      <h3 className="font-display text-[15px] font-bold text-pine-900 group-hover:text-pine-700 transition-colors">{v.t}</h3>
                      <p className="text-[13px] text-pine-600">{v.d}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={150} className="relative">
            <div className="sticky top-28">
              <img src={IMAGES.group} alt="Un petit groupe d'élèves africains travaille ensemble avec un mentor" className="w-full rounded-[28px] object-cover shadow-lift" style={{ aspectRatio: "4/3.3" }} />
              <figure className="absolute -bottom-7 left-5 right-5 rounded-2xl border border-pine-100 bg-white/95 p-5 shadow-lift backdrop-blur">
                <blockquote className="text-[13px] italic leading-relaxed text-pine-800">
                  « Un élève ne progresse jamais aussi bien que lorsqu'il se sait attendu, compris et encouragé. »
                </blockquote>
                <figcaption className="mt-2.5 flex items-center gap-2.5">
                  <Avatar name="Amina Benali" size={30} color="#1f6c57" />
                  <span className="text-xs font-semibold text-pine-700">Amina Benali · Directrice pédagogique</span>
                </figcaption>
              </figure>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Pour qui ---------- */}
      <section className="bg-pine-950 py-20 text-paper lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-marigold-300">
              <Users size={15} /> Pour qui ?
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold leading-tight sm:text-4xl">
              Une plateforme pensée pour tout l'écosystème de l'élève.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-8 lg:grid-cols-12">
            <div className="flex flex-col gap-2 lg:col-span-5" role="tablist" aria-label="Profils utilisateurs">
              {profiles.map((p, i) => (
                <button
                  key={p.title}
                  role="tab"
                  aria-selected={profile === i}
                  onClick={() => setProfile(i)}
                  className={`group flex items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-300 cursor-pointer ${
                    profile === i ? "border-pine-600 bg-pine-800/80 shadow-lift" : "border-pine-800 bg-pine-900/50 hover:border-pine-700 hover:bg-pine-900"
                  }`}
                >
                  <span className="rounded-xl p-2.5 transition-transform group-hover:scale-110" style={{ backgroundColor: `${p.color}26`, color: p.color === "#b37413" ? "#e9c25f" : p.color === "#c75540" ? "#edaa9b" : p.color === "#3f6577" ? "#a3bfcb" : "#8fc0ad" }}>
                    {p.icon}
                  </span>
                  <span>
                    <span className="block font-display text-lg font-bold">{p.title}</span>
                    <span className="text-xs text-pine-300">{i === 0 ? "Le cœur de notre action" : i === 1 ? "Des partenaires informés" : i === 2 ? "Des outils qui structurent" : "Bientôt intégrés"}</span>
                  </span>
                  <ArrowRight size={18} className={`ml-auto shrink-0 transition-all ${profile === i ? "translate-x-0 text-marigold-300" : "-translate-x-2 opacity-0"}`} />
                </button>
              ))}
            </div>
            <div className="lg:col-span-7">
              <div key={profile} className="h-full rounded-[26px] border border-pine-700/60 bg-pine-900/70 p-7 shadow-lift animate-fade-up sm:p-10">
                <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: profiles[profile].color === "#b37413" ? "#e9c25f" : "#8fc0ad" }}>
                  Espace {profiles[profile].title.toLowerCase()}
                </p>
                <h3 className="mt-3 font-display text-2xl font-bold leading-snug sm:text-3xl">{profiles[profile].desc}</h3>
                <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                  {profiles[profile].points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5 rounded-xl bg-pine-800/70 px-4 py-3 text-[13px] font-medium text-pine-100">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-marigold-300" /> {pt}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/register">
                    <Button variant="marigold">Créer un compte</Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="ghost" className="text-pine-200 hover:bg-pine-800">
                      Explorer la démo <ArrowUpRight size={15} />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Démo vidéo ---------- */}
      <section className="bg-pine-950 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle
            dark
            kicker="La plateforme en action"
            title="Voyez le parcours d'un élève, en vingt secondes."
            text="Du bilan initial aux notifications familiales : cette démonstration animée résume notre façon de travailler, étape par étape."
          />
          <div className="mt-12">
            <VideoShowcase />
          </div>
        </div>
      </section>

      {/* ---------- Approche (teaser) ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-pine-600">
                <Compass size={15} /> Notre approche
              </p>
              <h2 className="mt-4 max-w-xl font-display text-3xl font-bold leading-tight text-pine-950 sm:text-4xl">
                Une méthode en quatre temps, éprouvée sur le terrain.
              </h2>
            </div>
            <Link to="/approche" className="group flex items-center gap-2 text-sm font-bold text-pine-700 hover:text-pine-600">
              Découvrir en détail <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
        <div className="relative mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="absolute left-0 right-0 top-9 hidden border-t-2 border-dashed border-pine-200 lg:block" aria-hidden="true" />
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 110}>
              <div className="relative rounded-2xl border border-pine-100 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                <span className="inline-flex rounded-xl bg-pine-800 p-3 text-marigold-300">{s.icon}</span>
                <p className="mt-4 font-display text-xs font-bold text-marigold-500">{s.n}</p>
                <h3 className="mt-1 font-display text-xl font-bold text-pine-900">{s.t}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-pine-600">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Services (bento) ---------- */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:pb-28">
        <Reveal>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-pine-600">
            <Target size={15} /> Nos services
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold leading-tight text-pine-950 sm:text-4xl">
            Tout ce qu'il faut pour structurer un accompagnement qui porte ses fruits.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-6">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 70} className={s.big ? "md:col-span-6 lg:col-span-4" : i < 5 ? "md:col-span-3 lg:col-span-2" : "md:col-span-3"}>
              <div className={`group relative h-full overflow-hidden rounded-[22px] border border-pine-100 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift ${s.big ? "lg:p-10" : ""}`}>
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-150" style={{ backgroundColor: s.tone }} aria-hidden="true" />
                <div className="flex items-center justify-between">
                  <span className="rounded-xl p-3" style={{ backgroundColor: `${s.tone}16`, color: s.tone }}>{s.icon}</span>
                  {s.soon && <Badge bg="#f8eccb" fg="#8f5912">En préparation</Badge>}
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-pine-900">{s.title}</h3>
                <p className={`mt-2.5 text-[13px] leading-relaxed text-pine-600 ${s.big ? "max-w-md text-sm" : ""}`}>{s.desc}</p>
                {s.big && (
                  <div className="mt-7 grid gap-3 sm:grid-cols-3">
                    {["Séances individuelles", "Bilan initial offert", "45 min par séance"].map((x) => (
                      <span key={x} className="rounded-xl bg-pine-50 px-4 py-3 text-xs font-bold text-pine-700">{x}</span>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Ressources aperçu ---------- */}
      <section className="bg-white/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-pine-600">
                  <Library size={15} /> Ressources pédagogiques
                </p>
                <h2 className="mt-4 max-w-xl font-display text-3xl font-bold leading-tight text-pine-950 sm:text-4xl">
                  Une bibliothèque vivante, attribuée à chaque élève.
                </h2>
              </div>
              <Link to="/resources" className="group flex items-center gap-2 text-sm font-bold text-pine-700 hover:text-pine-600">
                Explorer la bibliothèque <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {resources.slice(0, 3).map((r, i) => (
              <Reveal key={r.id} delay={i * 90}>
                <div className="group h-full rounded-[22px] border border-pine-100 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                  <div className="flex items-center justify-between">
                    <Badge bg="#dcebe4" fg="#175745">{r.category}</Badge>
                    <span className="text-[11px] font-bold uppercase tracking-wide text-marigold-600">{r.type}</span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold leading-snug text-pine-900 group-hover:text-pine-700 transition-colors">{r.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-pine-600">{r.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Réussites ---------- */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:pb-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative">
              <div className="absolute -left-5 -top-5 hidden h-full w-full rounded-[30px] border-2 border-dashed border-marigold-300 sm:block" aria-hidden="true" />
              <KenBurns src={IMAGES.reussite} alt="Un élève congolais brandit fièrement son certificat de réussite" className="relative rounded-[30px] shadow-lift" ratio="4 / 3.4" />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-marigold-600">
              <TrendingUp size={15} /> Ils progressent
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-pine-950 sm:text-4xl">
              Chaque trimestre, des élèves retrouvent le goût d'apprendre.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-pine-600">
              À Brazzaville et dans tout le Congo, nos élèves gagnent en confiance, en autonomie et en résultats.
              La plateforme rend chacun de ces progrès visible et partageable avec toute la famille.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { v: 92, s: " %", l: "d'élèves en progression" },
                { v: 6, s: " mois", l: "de suivi en moyenne" },
                { v: 14, s: "", l: "écoles partenaires" },
              ].map((x) => (
                <div key={x.l} className="rounded-2xl border border-pine-100 bg-white p-4 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <p className="font-display text-2xl font-bold text-pine-800 sm:text-3xl"><CountUp to={x.v} suffix={x.s} /></p>
                  <p className="mt-1 text-[11px] font-semibold text-pine-500">{x.l}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Témoignages ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-[26px] bg-pine-800 p-8 text-paper shadow-lift sm:p-10">
              <svg width="40" height="32" viewBox="0 0 40 32" aria-hidden="true"><path d="M0 32V20.8C0 8.9 6.4 1.6 17.6 0l2.4 5.6C12.8 7.2 9.6 11.2 9.6 16H18v16H0zm22 0V20.8C22 8.9 28.4 1.6 39.6 0L42 5.6c-7.2 1.6-10.4 5.6-10.4 10.4H40v16H22z" fill="#e1ab35" transform="scale(0.92)" /></svg>
              <p className="mt-5 font-display text-xl font-medium leading-relaxed sm:text-2xl">
                En six mois, Emma est passée de « je n'aime pas lire » à un chapitre entier chaque soir. Le suivi sur la plateforme nous a permis de voir chaque progrès, et d'y croire avec elle.
              </p>
              <div className="mt-7 flex items-center gap-3">
                <Avatar name="Claire Moreau" size={42} color="#5f8ca0" />
                <div>
                  <p className="font-bold">Claire Moreau</p>
                  <p className="text-xs text-pine-300">Maman d'Emma, CM1</p>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="flex h-full flex-col gap-6">
              <div className="flex-1 rounded-[26px] border border-pine-100 bg-white p-8 shadow-soft">
                <p className="text-[15px] leading-relaxed text-pine-700">
                  « Les comptes rendus structurés et les objectifs partagés nous font gagner un temps précieux. La coordination avec la clinique est enfin fluide. »
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <Avatar name="Julien Perrin" size={38} color="#5ca28a" />
                  <div>
                    <p className="text-sm font-bold text-pine-900">Julien Perrin</p>
                    <p className="text-xs text-pine-500">Professeur des écoles, partenaire</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 rounded-[26px] border border-pine-100 bg-white p-8 shadow-soft">
                <p className="text-[15px] leading-relaxed text-pine-700">
                  « En tant que pédagogue, j'ai enfin un outil qui suit réellement le parcours : objectifs, séances, évaluations, rapports. Tout est là. »
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <Avatar name="Sophie Lambert" size={38} color="#b37413" />
                  <div>
                    <p className="text-sm font-bold text-pine-900">Sophie Lambert</p>
                    <p className="text-xs text-pine-500">Pédagogue spécialisée</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <FaqSection open={faqOpen} setOpen={setFaqOpen} />

      {/* ---------- CTA final ---------- */}
      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[30px] bg-pine-900 px-7 py-14 text-paper shadow-lift sm:px-14 sm:py-16">
            <div className="absolute inset-0 bg-grid-soft opacity-30" aria-hidden="true" />
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-marigold-500/15 blur-3xl" aria-hidden="true" />
            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div>
                <h2 className="max-w-xl font-display text-3xl font-bold leading-tight sm:text-4xl">
                  Prêt à révéler le potentiel de votre enfant&nbsp;?
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-pine-200">
                  Créez votre espace parent, ou explorez la plateforme avec un compte de démonstration : administrateur, professionnel, parent ou élève.
                </p>
              </div>
              <div className="flex flex-wrap gap-3.5">
                <Link to="/register"><Button variant="marigold" size="lg">Créer un compte parent</Button></Link>
                <Link to="/login"><Button variant="ghost" size="lg" className="text-pine-100 hover:bg-pine-800">Tester la démo</Button></Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

/* ================================ FAQ ================================ */

export const FAQ_ITEMS = [
  { q: "Qu'est-ce qu'une « clinique pédagogique » ?", a: "C'est un centre d'observation et d'accompagnement des apprentissages — sans aucune dimension médicale. Nous identifions les difficultés scolaires (lecture, compréhension, mathématiques, concentration…) et construisons un parcours d'accompagnement personnalisé. Nous ne posons jamais de diagnostic médical ou psychologique." },
  { q: "Comment se passe l'inscription de mon enfant ?", a: "Vous créez un compte parent en quelques minutes. Un premier entretien téléphonique permet de comprendre la situation, puis un bilan pédagogique initial est programmé. À l'issue du bilan, un parcours personnalisé avec des objectifs clairs vous est présenté." },
  { q: "Comment puis-je suivre les progrès de mon enfant ?", a: "Votre espace parent affiche en temps réel la progression, les objectifs, les prochains rendez-vous, les comptes rendus de séance et les recommandations du professionnel. Vous recevez également des notifications à chaque étape importante." },
  { q: "Travaillez-vous avec les établissements scolaires ?", a: "Oui. Avec votre accord, nous coordonnons les objectifs avec l'enseignant de votre enfant : partage d'observations, objectifs alignés avec la classe et points d'étape réguliers. Un espace établissement dédié est en préparation sur la plateforme." },
  { q: "Que se passe-t-il pendant une séance ?", a: "Chaque séance de 45 minutes est préparée autour d'un objectif précis. Après la séance, le professionnel rédige un compte rendu : activités réalisées, difficultés rencontrées, progrès observés, niveau d'engagement et prochaines étapes. Vous le retrouvez dans votre espace." },
  { q: "Les données de mon enfant sont-elles protégées ?", a: "Absolument. Les données sont confidentielles et l'accès est strictement limité : chaque utilisateur (parent, professionnel, administrateur) ne voit que ce qui le concerne, grâce à un contrôle des rôles et des permissions appliqué sur toute la plateforme." },
];

export function FaqSection({ open, setOpen }: { open: number; setOpen: (i: number) => void }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Reveal>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-pine-600">
              <MessageSquare size={15} /> Questions fréquentes
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-pine-950 sm:text-4xl">
              Tout ce que les familles nous demandent.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-pine-600">
              Une autre question ? Notre équipe vous répond du lundi au samedi.
            </p>
            <Link to="/contact" className="mt-5 inline-block">
              <Button variant="secondary">Nous contacter</Button>
            </Link>
          </Reveal>
        </div>
        <div className="lg:col-span-8">
          <div className="space-y-3">
            {FAQ_ITEMS.map((f, i) => (
              <Reveal key={f.q} delay={i * 60}>
                <div className={`overflow-hidden rounded-2xl border transition-all duration-300 ${open === i ? "border-pine-300 bg-white shadow-soft" : "border-pine-100 bg-white/70 hover:border-pine-200"}`}>
                  <button className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                    <span className="font-display text-[15px] font-bold text-pine-900">{f.q}</span>
                    <ChevronDown size={19} className={`shrink-0 text-pine-500 transition-transform duration-300 ${open === i ? "rotate-180 text-pine-700" : ""}`} />
                  </button>
                  <div className={`grid transition-all duration-300 ${open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-relaxed text-pine-600">{f.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================ Pages secondaires ================================ */

export function AboutPage() {
  const users = useApp((s) => s.users);
  useEffect(() => { document.title = "La clinique — Clinique d'Éducation & de l'Innovation Pédagogique"; }, []);
  const team = users.filter((u) => u.role === "professional" || u.id === "u-admin");
  return (
    <>
      <PageHero
        kicker="La clinique"
        title="Un lieu d'observation et d'accompagnement des apprentissages."
        text="Née d'un constat simple — trop d'élèves décrochent faute d'accompagnement adapté — la Clinique d'Éducation & de l'Innovation Pédagogique combine expertise humaine et outils numériques pour suivre chaque parcours de bout en bout."
      />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2 className="font-display text-3xl font-bold text-pine-950">Notre histoire</h2>
            <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-pine-700/90">
              <p>
                Fondée par des pédagogues spécialisés et des enseignants, la clinique est née de la rencontre entre deux mondes :
                celui de l'accompagnement individualisé, et celui de l'innovation numérique. Notre conviction : un élève progresse
                d'autant mieux que tous les adultes qui l'entourent — parents, professionnels, enseignants — partagent la même vision de son parcours.
              </p>
              <p>
                C'est pourquoi nous avons construit une plateforme où chaque séance, chaque objectif et chaque progrès est tracé,
                expliqué et partagé. Pas de jargon, pas de jugement : des faits, des étapes, et beaucoup de bienveillance.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { v: 128, s: "+", l: "élèves accompagnés" },
                { v: 14, s: "", l: "écoles partenaires" },
                { v: 3, s: "", l: "pôles d'expertise" },
              ].map((x) => (
                <div key={x.l} className="rounded-2xl border border-pine-100 bg-white p-4 text-center shadow-soft">
                  <p className="font-display text-2xl font-bold text-pine-800 sm:text-3xl"><CountUp to={x.v} suffix={x.s} /></p>
                  <p className="mt-1 text-[11px] font-semibold text-pine-500">{x.l}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-[26px] border border-pine-100 bg-white p-7 shadow-soft sm:p-9">
              <h3 className="font-display text-2xl font-bold text-pine-950">Nos engagements</h3>
              <ul className="mt-5 space-y-4">
                {[
                  { icon: <ShieldCheck size={18} />, t: "Confidentialité absolue", d: "Les données des élèves sont traitées comme des données sensibles, avec un accès strictement limité par rôle." },
                  { icon: <HeartHandshake size={18} />, t: "Bienveillance systématique", d: "Chaque élève avance à son rythme. Nous valorisons les progrès, jamais les écarts." },
                  { icon: <Eye size={18} />, t: "Transparence avec les familles", d: "Comptes rendus, objectifs et recommandations sont accessibles aux parents en temps réel." },
                  { icon: <Sparkles size={18} />, t: "Innovation responsable", d: "L'IA viendra assister les professionnels — jamais diagnostiquer, jamais remplacer l'humain." },
                ].map((e) => (
                  <li key={e.t} className="flex gap-3.5">
                    <span className="mt-0.5 h-fit rounded-xl bg-pine-100 p-2 text-pine-700">{e.icon}</span>
                    <div>
                      <h4 className="font-display text-[15px] font-bold text-pine-900">{e.t}</h4>
                      <p className="mt-0.5 text-[13px] leading-relaxed text-pine-600">{e.d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-16">
          <div className="relative overflow-hidden rounded-[30px] shadow-lift">
            <KenBurns src={IMAGES.team} alt="L'équipe de la clinique, des professionnels africains réunis dans leurs locaux de Brazzaville" className="rounded-[30px]" ratio="16 / 6.5" />
            <div className="absolute inset-0 bg-gradient-to-t from-pine-950/80 via-pine-950/10 to-transparent" aria-hidden="true" />
            <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-marigold-300">Une équipe, une conviction</p>
              <p className="mt-2 max-w-2xl font-display text-xl font-bold text-paper sm:text-2xl">
                « Chaque élève qui franchit notre porte mérite un regard attentif et un plan clair. »
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-16">
          <h2 className="font-display text-3xl font-bold text-pine-950">L'équipe</h2>
          <p className="mt-2 max-w-xl text-sm text-pine-600">Des spécialistes complémentaires, unis par la même conviction : chaque élève peut progresser.</p>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m, i) => (
            <Reveal key={m.id} delay={i * 80}>
              <div className="group h-full rounded-[22px] border border-pine-100 bg-white p-6 text-center shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                <div className="mx-auto w-fit transition-transform duration-300 group-hover:scale-105"><Avatar name={`${m.firstName} ${m.lastName}`} size={72} color={m.avatarColor} /></div>
                <h3 className="mt-4 font-display text-lg font-bold text-pine-900">{m.firstName} {m.lastName}</h3>
                <p className="text-xs font-bold uppercase tracking-wide text-marigold-600">{m.id === "u-admin" ? "Direction pédagogique" : m.specialty}</p>
                <p className="mt-3 text-[12px] leading-relaxed text-pine-600">{m.id === "u-admin" ? "Fondatrice de la clinique, spécialiste des parcours d'apprentissage et de la coordination familles-écoles." : m.bio}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

export function ApprochePage() {
  useEffect(() => { document.title = "Notre approche — Clinique d'Éducation & de l'Innovation Pédagogique"; }, []);
  const details = [
    { n: "01", t: "Observer", d: "Le bilan initial", pts: ["Entretien familial approfondi", "Tests pédagogiques adaptés à l'âge", "Analyse des productions scolaires", "Observation du comportement en tâche"] },
    { n: "02", t: "Comprendre", d: "Le profil d'apprentissage", pts: ["Cartographie précise des difficultés", "Identification des leviers de motivation", "Hypothèses pédagogiques partagées", "Orientation vers un spécialiste si besoin"] },
    { n: "03", t: "Accompagner", d: "Le parcours personnalisé", pts: ["Objectifs SMART co-construits", "Séances individuelles hebdomadaires", "Ressources adaptées entre les séances", "Recommandations concrètes pour la maison"] },
    { n: "04", t: "Mesurer", d: "La progression objectivée", pts: ["Évaluations régulières par compétence", "Graphiques de progression partagés", "Comptes rendus après chaque séance", "Rapports d'étape pour l'école"] },
  ];
  return (
    <>
      <PageHero
        kicker="Notre approche"
        title="Comprendre avant d'accompagner, mesurer pour encourager."
        text="Notre méthode repose sur un principe : on n'accompagne bien que ce que l'on comprend précisément. Chaque parcours commence par une observation fine, et chaque progrès est rendu visible."
      />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="space-y-6">
          {details.map((d, i) => (
            <Reveal key={d.n} delay={i * 60}>
              <div className={`grid gap-6 rounded-[26px] border border-pine-100 bg-white p-7 shadow-soft sm:p-9 lg:grid-cols-12 ${i % 2 === 1 ? "lg:bg-pine-50/60" : ""}`}>
                <div className="lg:col-span-4">
                  <p className="font-display text-5xl font-bold text-pine-200">{d.n}</p>
                  <h2 className="mt-1 font-display text-3xl font-bold text-pine-950">{d.t}</h2>
                  <p className="mt-1 text-sm font-bold text-marigold-600">{d.d}</p>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
                  {d.pts.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 rounded-xl bg-pine-50 px-4 py-3.5 text-[13px] font-medium text-pine-800">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-pine-600" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-12">
          <div className="flex items-start gap-4 rounded-[22px] border border-marigold-200 bg-marigold-50 p-6 sm:p-7">
            <ShieldCheck size={24} className="mt-0.5 shrink-0 text-marigold-600" />
            <div>
              <h3 className="font-display text-lg font-bold text-pine-950">Un cadre éthique clair</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-pine-700">
                La clinique est un lieu pédagogique, pas médical. Nous ne posons <strong>aucun diagnostic médical ou psychologique</strong>.
                Lorsque nos observations le suggèrent, nous orientons les familles vers les professionnels de santé compétents, avec leur accord et en toute transparence.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal delay={120} className="order-2 lg:order-1">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-marigold-600">
              <HeartHandshake size={15} /> Le rôle de la famille
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-pine-950 sm:text-4xl">
              Les parents sont nos premiers partenaires.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-pine-600">
              Un accompagnement réussit quand la maison et la clinique parlent le même langage. Nous prenons le temps
              d'expliquer chaque étape, de répondre aux inquiétudes et de donner aux parents des gestes concrets pour
              soutenir leur enfant au quotidien.
            </p>
            <ul className="mt-6 space-y-3">
              {["Points d'étape réguliers avec la famille", "Recommandations concrètes pour la maison", "Un espace parent accessible à tout moment"].map((p) => (
                <li key={p} className="flex items-start gap-2.5 rounded-xl bg-pine-50 px-4 py-3 text-[13px] font-semibold text-pine-800">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-pine-600" /> {p}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="order-1 lg:order-2">
            <div className="relative">
              <div className="absolute -right-5 -top-5 hidden h-full w-full rounded-[30px] border-2 border-dashed border-pine-300 sm:block" aria-hidden="true" />
              <KenBurns src={IMAGES.famille} alt="Des parents congolais rencontrent une éducatrice pour faire le point sur les progrès de leur enfant" className="relative rounded-[30px] shadow-lift" ratio="4 / 3.4" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export function ServicesPage() {
  useEffect(() => { document.title = "Nos services — Clinique d'Éducation & de l'Innovation Pédagogique"; }, []);
  const rows = [
    { t: "Accompagnement pédagogique individualisé", d: "Séances de 45 minutes en individuel, centrées sur les besoins identifiés lors du bilan : lecture, compréhension, écriture, mathématiques, méthodologie.", pts: ["1 séance hebdomadaire", "Professionnel référent stable", "Compte rendu systématique"] },
    { t: "Bilan pédagogique initial", d: "Deux heures d'observation et d'échanges pour dresser un profil d'apprentissage complet et définir un plan d'action clair avec la famille.", pts: ["Restitution orale détaillée", "Document de synthèse", "Parcours personnalisé proposé"] },
    { t: "Suivi de progression numérique", d: "Chaque famille accède à un espace dédié : objectifs, séances, progrès par compétence, comptes rendus et recommandations, mis à jour en continu.", pts: ["Tableau de bord parent", "Notifications automatiques", "Historique complet"] },
    { t: "Coordination avec l'école", d: "Avec votre accord, nous alignons nos objectifs avec ceux de la classe et partageons les observations utiles à l'équipe pédagogique.", pts: ["Objectifs partagés", "Points d'étape trimestriels", "Espace établissement (bientôt)"] },
    { t: "Ateliers confiance & motivation", d: "Des ateliers en petit groupe pour restaurer l'estime de soi, apprivoiser l'erreur et retrouver le plaisir d'apprendre.", pts: ["Groupes de 4 élèves max", "Pédagogie de la réussite", "Célébration des progrès"] },
  ];
  return (
    <>
      <PageHero
        kicker="Nos services"
        title="Des accompagnements concrets, du bilan à la réussite."
        text="Chaque service est pensé pour s'articuler avec les autres : c'est la cohérence du parcours qui fait la force de la clinique."
      />
      <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative">
              <div className="absolute -left-5 -top-5 hidden h-full w-full rounded-[30px] border-2 border-dashed border-marigold-300 sm:block" aria-hidden="true" />
              <KenBurns src={IMAGES.seance} alt="Un pédagogue accompagne une élève en séance individuelle de soutien scolaire" className="relative rounded-[30px] shadow-lift" ratio="4 / 3.2" />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-marigold-600">
              <Target size={15} /> Notre savoir-faire
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-pine-950 sm:text-4xl">
              Un accompagnement humain, structuré par le numérique.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-pine-600">
              Derrière chaque service, il y a une séance réelle, un professionnel engagé et un élève qui avance.
              La plateforme, elle, garde la trace de tout : pour que rien ne se perde et que chaque progrès compte.
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              {["45 min par séance", "Référent stable", "Compte rendu systématique"].map((x) => (
                <span key={x} className="rounded-full bg-pine-100 px-4 py-2 text-xs font-bold text-pine-700">{x}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="space-y-5">
          {rows.map((r, i) => (
            <Reveal key={r.t} delay={i * 60}>
              <div className="group grid gap-6 rounded-[24px] border border-pine-100 bg-white p-7 shadow-soft transition-all duration-300 hover:border-pine-300 hover:shadow-lift lg:grid-cols-12 lg:p-9">
                <div className="lg:col-span-7">
                  <span className="font-display text-xs font-bold text-marigold-500">Service {String(i + 1).padStart(2, "0")}</span>
                  <h2 className="mt-1.5 font-display text-2xl font-bold text-pine-950 group-hover:text-pine-800 transition-colors">{r.t}</h2>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-pine-600">{r.d}</p>
                </div>
                <ul className="space-y-2.5 lg:col-span-5">
                  {r.pts.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 rounded-xl bg-pine-50 px-4 py-3 text-[13px] font-semibold text-pine-800">
                      <ArrowRight size={15} className="shrink-0 text-pine-500" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-12">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[26px] bg-pine-900 p-8 text-paper shadow-lift sm:flex-row sm:items-center sm:p-10">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-marigold-300"><Sparkles size={14} /> Bientôt</p>
              <h3 className="mt-2 font-display text-2xl font-bold">L'assistant pédagogique intelligent</h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-pine-200">
                Analyse des observations, suggestions d'activités, synthèse automatique des parcours : l'IA assistera bientôt nos professionnels — toujours sous leur contrôle, jamais en remplacement.
              </p>
            </div>
            <Link to="/register"><Button variant="marigold" size="lg">Rejoindre l'aventure</Button></Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

export function ResourcesPublicPage() {
  const resources = useApp((s) => s.resources);
  const [cat, setCat] = useState<string>("Toutes");
  useEffect(() => { document.title = "Ressources — Clinique d'Éducation & de l'Innovation Pédagogique"; }, []);
  const filtered = cat === "Toutes" ? resources : resources.filter((r) => r.category === cat);
  return (
    <>
      <PageHero
        kicker="Ressources pédagogiques"
        title="Fiches, vidéos, activités : une bibliothèque au service du parcours."
        text="Les ressources sont sélectionnées par nos pédagogues puis attribuées à chaque élève selon ses objectifs. Connectez-vous pour accéder à la bibliothèque complète et aux ressources de votre enfant."
      />
      <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal delay={120} className="order-2 lg:order-1">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-marigold-600">
              <Library size={15} /> Choisies avec soin
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-pine-950 sm:text-4xl">
              Des supports concrets, pensés pour les élèves congolais.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-pine-600">
              Fiches de lecture illustrées, jeux de calcul, activités de concentration : chaque ressource est testée
              en séance avant d'être proposée, puis attribuée à l'élève dont elle servira le parcours.
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              {RESOURCE_CATEGORIES.slice(0, 4).map((c) => (
                <span key={c} className="rounded-full bg-pine-100 px-4 py-2 text-xs font-bold text-pine-700">{c}</span>
              ))}
            </div>
          </Reveal>
          <Reveal className="order-1 lg:order-2">
            <div className="relative">
              <div className="absolute -right-5 -top-5 hidden h-full w-full rounded-[30px] border-2 border-dashed border-pine-300 sm:block" aria-hidden="true" />
              <KenBurns src={IMAGES.ressources} alt="Des mains d'enfants feuillètent un livre illustré entouré de matériel pédagogique" className="relative rounded-[30px] shadow-lift" ratio="4 / 3.2" />
            </div>
          </Reveal>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {["Toutes", ...RESOURCE_CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                cat === c ? "bg-pine-800 text-paper shadow-soft" : "bg-pine-100/80 text-pine-700 hover:bg-pine-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r, i) => (
            <Reveal key={r.id} delay={i * 60}>
              <div className="group h-full rounded-[22px] border border-pine-100 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                <div className="flex items-center justify-between">
                  <Badge bg="#dcebe4" fg="#175745">{r.category}</Badge>
                  <span className="text-[11px] font-bold uppercase tracking-wide text-marigold-600">{r.type}</span>
                </div>
                <h3 className="mt-4 font-display text-lg font-bold leading-snug text-pine-900 group-hover:text-pine-700 transition-colors">{r.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-pine-600">{r.description}</p>
                <p className="mt-4 text-[11px] font-semibold text-pine-400">Ajoutée le {fmtDate(r.createdAt)}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-12">
          <div className="rounded-[24px] border-2 border-dashed border-pine-200 bg-pine-50/50 p-8 text-center">
            <h3 className="font-display text-xl font-bold text-pine-900">La bibliothèque complète est réservée aux familles accompagnées</h3>
            <p className="mx-auto mt-2 max-w-lg text-sm text-pine-600">Créez votre compte parent pour découvrir les ressources attribuées à votre enfant et les recommandations du professionnel.</p>
            <div className="mt-5 flex justify-center gap-3">
              <Link to="/register"><Button>Créer un compte</Button></Link>
              <Link to="/login"><Button variant="secondary">Se connecter</Button></Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

export function FaqPage() {
  const [open, setOpen] = useState(0);
  useEffect(() => { document.title = "FAQ — Clinique d'Éducation & de l'Innovation Pédagogique"; }, []);
  return (
    <>
      <PageHero
        kicker="FAQ"
        title="Des réponses claires pour les familles."
        text="Retrouvez les questions les plus fréquentes sur l'accompagnement, le suivi et la protection des données."
      />
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <FaqSection open={open} setOpen={setOpen} />
      </div>
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[30px] shadow-lift">
            <KenBurns src={IMAGES.accueil} alt="L'accueil chaleureux de la clinique à Brazzaville" className="rounded-[30px]" ratio="16 / 5.5" />
            <div className="absolute inset-0 bg-gradient-to-r from-pine-950/85 via-pine-950/40 to-transparent" aria-hidden="true" />
            <div className="absolute inset-0 flex items-center p-8 sm:p-12">
              <div className="max-w-xl">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-marigold-300">Vous hésitez encore ?</p>
                <h2 className="mt-3 font-display text-2xl font-bold leading-tight text-paper sm:text-3xl">
                  Venez nous rencontrer, le premier échange est sans engagement.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-pine-100/85">
                  Notre équipe vous accueille du lundi au samedi pour comprendre la situation de votre enfant et répondre à toutes vos questions.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/contact"><Button variant="marigold">Nous contacter</Button></Link>
                  <Link to="/register"><Button variant="ghost" className="text-pine-100 hover:bg-pine-800/60">Créer un compte</Button></Link>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

export function ContactPage() {
  const toast = useApp((s) => s.toast);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  useEffect(() => { document.title = "Contact — Clinique d'Éducation & de l'Innovation Pédagogique"; }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = "Veuillez indiquer votre nom.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Veuillez saisir un e-mail valide.";
    if (form.subject.trim().length < 3) errs.subject = "Veuillez préciser l'objet de votre message.";
    if (form.message.trim().length < 10) errs.message = "Votre message doit contenir au moins 10 caractères.";
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSent(true);
      toast("Message envoyé ! Nous vous répondrons sous 24h ouvrées.", "success");
    }
  };

  return (
    <>
      <PageHero
        kicker="Contact"
        title="Parlons de votre enfant."
        text="Une question, un doute, une situation scolaire difficile ? Écrivez-nous : nous répondons sous 24h ouvrées, en toute confidentialité."
      />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <Card className="p-7 sm:p-9">
              {sent ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <span className="rounded-full bg-pine-100 p-5 text-pine-700 animate-pop"><CheckCircle2 size={40} /></span>
                  <h2 className="mt-6 font-display text-2xl font-bold text-pine-950">Message bien reçu !</h2>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-pine-600">
                    Merci {form.name.split(" ")[0]}. Notre équipe vous répondra à <strong>{form.email}</strong> sous 24h ouvrées.
                  </p>
                  <Button variant="secondary" className="mt-7" onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}>
                    Envoyer un autre message
                  </Button>
                </div>
              ) : (
                <form onSubmit={submit} noValidate>
                  <h2 className="font-display text-2xl font-bold text-pine-950">Écrivez-nous</h2>
                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <Field label="Votre nom" error={errors.name}>
                      <input className={inputCls(errors.name)} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex. : Claire Moreau" />
                    </Field>
                    <Field label="Votre e-mail" error={errors.email}>
                      <input type="email" className={inputCls(errors.email)} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="vous@exemple.fr" />
                    </Field>
                  </div>
                  <div className="mt-5">
                    <Field label="Objet" error={errors.subject}>
                      <input className={inputCls(errors.subject)} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Ex. : Demande de bilan pour mon enfant" />
                    </Field>
                  </div>
                  <div className="mt-5">
                    <Field label="Votre message" error={errors.message}>
                      <textarea rows={6} className={inputCls(errors.message)} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Décrivez la situation de votre enfant, sa classe, ses difficultés éventuelles…" />
                    </Field>
                  </div>
                  <Button type="submit" size="lg" className="mt-6 w-full sm:w-auto">Envoyer le message <ArrowRight size={16} /></Button>
                </form>
              )}
            </Card>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-5">
            <div className="space-y-5">
              <div className="relative overflow-hidden rounded-[22px] shadow-soft">
                <KenBurns src={IMAGES.accueil} alt="L'accueil de la clinique, à Brazzaville" className="rounded-[22px]" ratio="16 / 9" />
                <div className="absolute inset-0 bg-gradient-to-t from-pine-950/70 to-transparent" aria-hidden="true" />
                <p className="absolute bottom-0 left-0 right-0 p-5 font-display text-lg font-bold text-paper">
                  Une porte ouverte sur la réussite de votre enfant.
                </p>
              </div>
              <Card className="p-7">
                <h3 className="font-display text-lg font-bold text-pine-950">Nos coordonnées</h3>
                <ul className="mt-5 space-y-4 text-sm text-pine-700">
                  <li className="flex items-start gap-3"><span className="rounded-lg bg-pine-100 p-2 text-pine-700"><MapPin size={16} /></span> Avenue Amílcar Cabral, Centre-ville, Brazzaville — République du Congo</li>
                  <li className="flex items-center gap-3"><span className="rounded-lg bg-pine-100 p-2 text-pine-700"><Phone size={16} /></span> +242 06 612 34 56</li>
                  <li className="flex items-center gap-3"><span className="rounded-lg bg-pine-100 p-2 text-pine-700"><Mail size={16} /></span> contact@clinique-education.cg</li>
                </ul>
              </Card>
              <Card className="p-7">
                <h3 className="font-display text-lg font-bold text-pine-950">Horaires d'ouverture</h3>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {[["Lundi – Vendredi", "9h00 – 19h00"], ["Samedi", "9h00 – 13h00"], ["Dimanche", "Fermé"]].map(([d, h]) => (
                    <li key={d} className="flex items-center justify-between rounded-lg bg-pine-50 px-4 py-2.5">
                      <span className="font-semibold text-pine-800">{d}</span>
                      <span className="text-pine-600">{h}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              <div className="overflow-hidden rounded-[22px] border border-pine-100 shadow-soft">
                <div className="bg-pine-900 p-6 text-paper">
                  <p className="font-display text-lg font-bold">Premier contact sans engagement</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-pine-200">Un échange téléphonique de 15 minutes pour comprendre la situation de votre enfant et répondre à vos questions.</p>
                  <Link to="/register" className="mt-4 inline-block"><Button variant="marigold" size="sm">Planifier un échange</Button></Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
