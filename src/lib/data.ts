/* ------------------------------------------------------------------ */
/*  Modèle de données — Clinique d'Éducation & de l'Innovation Péd.    */
/*  Mirroir du schéma PostgreSQL prévu (Supabase) pour le MVP.         */
/* ------------------------------------------------------------------ */

export type Role = "admin" | "professional" | "parent" | "student" | "teacher";
export type StudentStatus = "actif" | "en_attente" | "suspendu";
export type GoalStatus = "a_commencer" | "en_cours" | "atteint";
export type SessionStatus = "programmee" | "realisee" | "annulee" | "reportee";
export type SessionType =
  | "Lecture"
  | "Compréhension"
  | "Mathématiques"
  | "Écriture"
  | "Méthodologie"
  | "Concentration"
  | "Confiance en soi"
  | "Bilan";
export type ResourceType = "PDF" | "Fiche" | "Vidéo" | "Lien" | "Activité";
export type ResourceCategory =
  | "Lecture"
  | "Écriture"
  | "Mathématiques"
  | "Compréhension"
  | "Concentration"
  | "Méthodologie"
  | "Organisation"
  | "Confiance en soi";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string; // démo uniquement — remplacé par Supabase Auth en production
  role: Role;
  avatarColor: string;
  specialty?: string;
  bio?: string;
  childIds?: string[];
  studentId?: string;
  phone?: string;
  createdAt: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  schoolLevel: string;
  school: string;
  parentId: string;
  professionalId: string;
  status: StudentStatus;
  difficulties: string[];
  notes: string;
  joinedAt: string;
}

export interface Goal {
  id: string;
  studentId: string;
  professionalId: string;
  title: string;
  description: string;
  competency: string;
  progress: number;
  status: GoalStatus;
  startDate: string;
  targetDate: string;
  observations: string;
  nextSteps: string;
}

export interface Session {
  id: string;
  studentId: string;
  professionalId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: number; // minutes
  type: SessionType;
  objective: string;
  status: SessionStatus;
  reportId?: string;
}

export interface SessionReport {
  id: string;
  sessionId: string;
  objective: string;
  activities: string;
  difficulties: string;
  progress: string;
  engagement: number; // 1 à 5
  recommendations: string;
  nextSteps: string;
  createdAt: string;
}

export interface Evaluation {
  id: string;
  studentId: string;
  professionalId: string;
  competency: string;
  score: number; // sur 10
  comment: string;
  date: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  type: ResourceType;
  assignedTo: string[];
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  attachment?: string;
  createdAt: string;
  read: boolean;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  kind: "info" | "success" | "warning";
  link?: string; // route interne ouverte au clic
  read: boolean;
  createdAt: string;
}

export interface Toast {
  id: string;
  message: string;
  kind: "success" | "info" | "error";
}

/* ------------------------------- Helpers ------------------------------- */

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-3);

const base = new Date();
export function addDaysISO(days: number, from: Date = base): string {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
export const todayISO = () => addDaysISO(0);

export function fmtDate(iso: string): string {
  return new Date(iso + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}
export function fmtDateLong(iso: string): string {
  return new Date(iso + "T12:00:00").toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
export function fmtDateFull(iso: string): string {
  return new Date(iso + "T12:00:00").toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
export function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}
export function ageFrom(birthDate: string): number {
  const b = new Date(birthDate + "T00:00:00");
  const diff = Date.now() - b.getTime();
  return Math.floor(diff / (365.25 * 24 * 3600 * 1000));
}

/* --------------------------- Référentiels visuels --------------------------- */

export const DIFFICULTIES: { id: string; label: string; bg: string; fg: string; dot: string; description: string }[] = [
  { id: "lecture", label: "Lecture", bg: "#dcebe4", fg: "#175745", dot: "#1f6c57", description: "Décodage, fluidité et plaisir de lire" },
  { id: "comprehension", label: "Compréhension", bg: "#dce7ec", fg: "#3f6577", dot: "#5f8ca0", description: "Compréhension orale et écrite des consignes et des textes" },
  { id: "ecriture", label: "Écriture", bg: "#f8dad3", fg: "#a84432", dot: "#c75540", description: "Geste graphique, orthographe et production d'écrits" },
  { id: "concentration", label: "Concentration", bg: "#f8eccb", fg: "#8f5912", dot: "#d2921a", description: "Attention soutenue et gestion des distractions" },
  { id: "organisation", label: "Organisation", bg: "#dce7ec", fg: "#3f6577", dot: "#5f8ca0", description: "Gestion du matériel, du temps et des devoirs" },
  { id: "mathematiques", label: "Mathématiques", bg: "#f8eccb", fg: "#8f5912", dot: "#d2921a", description: "Numération, calcul et raisonnement logique" },
  { id: "confiance", label: "Confiance en soi", bg: "#f8dad3", fg: "#a84432", dot: "#de7257", description: "Image de soi et osée de participer" },
  { id: "motivation", label: "Motivation", bg: "#dcebe4", fg: "#175745", dot: "#37856d", description: "Envie d'apprendre et persévérance" },
];

export const SESSION_TYPE_COLORS: Record<SessionType, string> = {
  Lecture: "#1f6c57",
  "Compréhension": "#3f6577",
  "Mathématiques": "#b37413",
  "Écriture": "#c75540",
  "Méthodologie": "#5ca28a",
  Concentration: "#5f8ca0",
  "Confiance en soi": "#de7257",
  Bilan: "#124437",
};

export const SESSION_STATUSES: Record<SessionStatus, { label: string; bg: string; fg: string }> = {
  programmee: { label: "Programmée", bg: "#dce7ec", fg: "#3f6577" },
  realisee: { label: "Réalisée", bg: "#dcebe4", fg: "#175745" },
  annulee: { label: "Annulée", bg: "#f8dad3", fg: "#a84432" },
  reportee: { label: "Reportée", bg: "#f8eccb", fg: "#8f5912" },
};

export const GOAL_STATUSES: Record<GoalStatus, { label: string; bg: string; fg: string }> = {
  a_commencer: { label: "À commencer", bg: "#f8eccb", fg: "#8f5912" },
  en_cours: { label: "En cours", bg: "#dce7ec", fg: "#3f6577" },
  atteint: { label: "Atteint", bg: "#dcebe4", fg: "#175745" },
};

export const COMPETENCIES = [
  "Lecture",
  "Compréhension écrite",
  "Compréhension orale",
  "Écriture",
  "Mathématiques",
  "Concentration",
  "Organisation",
  "Confiance en soi",
  "Motivation",
  "Méthodologie",
];

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  "Lecture",
  "Écriture",
  "Mathématiques",
  "Compréhension",
  "Concentration",
  "Méthodologie",
  "Organisation",
  "Confiance en soi",
];

export const SCHOOL_LEVELS = ["CP", "CE1", "CE2", "CM1", "CM2", "6e", "5e", "4e", "3e"];

export const IMAGES = {
  hero: "https://image.qwenlm.ai/generated-images/ac12f8c6-692d-4a6e-83e2-fb31cd731c5d/_result.png",
  group: "https://image.qwenlm.ai/generated-images/5f793a33-5efd-4bc9-966a-7afa491a0962/_result.png",
  team: "https://image.qwenlm.ai/generated-images/ef42347c-12eb-4230-a2f8-12a8d26fcd83/_result.png",
  famille: "https://image.qwenlm.ai/generated-images/d8146e06-faa7-47bd-93a0-1485db91e757/_result.png",
  seance: "https://image.qwenlm.ai/generated-images/51e913cf-ae42-4322-980c-aa35fe6b6062/_result.png",
  ressources: "https://image.qwenlm.ai/generated-images/8915678c-9fe2-4d13-9afd-b5df150cbf93/_result.png",
  accueil: "https://image.qwenlm.ai/generated-images/9610eaab-8f84-4cae-8322-b48c4c3bf9d2/_result.png",
  reussite: "https://image.qwenlm.ai/generated-images/d8292d07-0a41-4be7-bdf0-f0355fad603c/_result.png",
};

/* ------------------------------ Données démo ------------------------------ */

const users: User[] = [
  { id: "u-admin", firstName: "Amina", lastName: "Benali", email: "admin@clinique-education.fr", password: "demo123", role: "admin", avatarColor: "#1f6c57", phone: "01 84 20 45 67", createdAt: addDaysISO(-420) },
  { id: "u-pro1", firstName: "Karim", lastName: "Haddad", email: "k.haddad@clinique-education.fr", password: "demo123", role: "professional", avatarColor: "#3f6577", specialty: "Lecture & compréhension", bio: "Pédagogue spécialisé dans les troubles de la lecture, 12 ans d'expérience en accompagnement individualisé.", createdAt: addDaysISO(-400) },
  { id: "u-pro2", firstName: "Sophie", lastName: "Lambert", email: "s.lambert@clinique-education.fr", password: "demo123", role: "professional", avatarColor: "#b37413", specialty: "Mathématiques & méthodologie", bio: "Enseignante spécialisée, passionnée par les stratégies d'apprentissage et l'autonomie des élèves.", createdAt: addDaysISO(-380) },
  { id: "u-pro3", firstName: "Yanis", lastName: "Meziane", email: "y.meziane@clinique-education.fr", password: "demo123", role: "professional", avatarColor: "#c75540", specialty: "Psychopédagogie & confiance en soi", bio: "Accompagne les élèves sur la motivation, l'estime de soi et le rapport aux apprentissages.", createdAt: addDaysISO(-300) },
  { id: "u-parent", firstName: "Claire", lastName: "Moreau", email: "claire.moreau@email.fr", password: "demo123", role: "parent", avatarColor: "#5f8ca0", childIds: ["st-emma"], phone: "06 12 45 78 90", createdAt: addDaysISO(-150) },
  { id: "u-parent2", firstName: "Marc", lastName: "Dubois", email: "marc.dubois@email.fr", password: "demo123", role: "parent", avatarColor: "#37856d", childIds: ["st-nathan"], phone: "06 98 32 11 04", createdAt: addDaysISO(-120) },
  { id: "u-parent3", firstName: "Nadia", lastName: "Khelifi", email: "nadia.khelifi@email.fr", password: "demo123", role: "parent", avatarColor: "#8f5912", childIds: ["st-sarah"], createdAt: addDaysISO(-90) },
  { id: "u-parent4", firstName: "Julie", lastName: "Petit", email: "julie.petit@email.fr", password: "demo123", role: "parent", avatarColor: "#a84432", childIds: ["st-lucas"], createdAt: addDaysISO(-60) },
  { id: "u-eleve", firstName: "Emma", lastName: "Moreau", email: "emma@clinique-education.fr", password: "demo123", role: "student", avatarColor: "#de7257", studentId: "st-emma", createdAt: addDaysISO(-150) },
  { id: "u-teacher", firstName: "Julien", lastName: "Perrin", email: "j.perrin@ac-paris.fr", password: "demo123", role: "teacher", avatarColor: "#5ca28a", createdAt: addDaysISO(-45) },
];

const students: Student[] = [
  { id: "st-emma", firstName: "Emma", lastName: "Moreau", birthDate: "2016-04-12", schoolLevel: "CM1", school: "École Jean-Moulin", parentId: "u-parent", professionalId: "u-pro1", status: "actif", difficulties: ["lecture", "comprehension", "confiance"], notes: "Emma est volontaire et créative. Elle progresse nettement lorsqu'elle se sent en confiance.", joinedAt: addDaysISO(-150) },
  { id: "st-nathan", firstName: "Nathan", lastName: "Dubois", birthDate: "2014-09-03", schoolLevel: "6e", school: "Collège Albert-Camus", parentId: "u-parent2", professionalId: "u-pro2", status: "actif", difficulties: ["mathematiques", "organisation", "concentration"], notes: "Nathan a besoin de routines claires et de supports visuels pour structurer son travail.", joinedAt: addDaysISO(-120) },
  { id: "st-sarah", firstName: "Sarah", lastName: "Khelifi", birthDate: "2015-01-22", schoolLevel: "CM2", school: "École Jules-Ferry", parentId: "u-parent3", professionalId: "u-pro1", status: "actif", difficulties: ["ecriture", "concentration", "motivation"], notes: "Sarah adore les histoires. Utiliser l'imaginaire comme levier d'entrée dans l'écrit.", joinedAt: addDaysISO(-90) },
  { id: "st-lucas", firstName: "Lucas", lastName: "Petit", birthDate: "2013-06-15", schoolLevel: "5e", school: "Collège Albert-Camus", parentId: "u-parent4", professionalId: "u-pro3", status: "actif", difficulties: ["motivation", "confiance", "organisation"], notes: "Lucas se décourage vite face à l'échec. Valoriser chaque petite victoire.", joinedAt: addDaysISO(-60) },
  { id: "st-chloe", firstName: "Chloé", lastName: "Martin", birthDate: "2016-11-30", schoolLevel: "CM1", school: "École Jean-Moulin", parentId: "u-parent2", professionalId: "u-pro1", status: "en_attente", difficulties: ["lecture", "comprehension"], notes: "Bilan initial à programmer avec la famille.", joinedAt: addDaysISO(-6) },
];

const goals: Goal[] = [
  { id: "g-emma-1", studentId: "st-emma", professionalId: "u-pro1", title: "Améliorer la compréhension écrite", description: "Identifier les informations principales d'un texte et répondre à des questions explicites puis implicites.", competency: "Compréhension écrite", progress: 65, status: "en_cours", startDate: addDaysISO(-60), targetDate: addDaysISO(30), observations: "Emma repère de mieux en mieux les idées principales. Les questions implicites restent fragiles.", nextSteps: "Travailler les inférences à partir d'albums courts, puis de textes documentaires." },
  { id: "g-emma-2", studentId: "st-emma", professionalId: "u-pro1", title: "Fluidité de lecture à voix haute", description: "Lire un texte de 120 mots avec aisance, en respectant la ponctuation.", competency: "Lecture", progress: 82, status: "en_cours", startDate: addDaysISO(-75), targetDate: addDaysISO(15), observations: "Très belle progression du débit. Reste à stabiliser la lecture des mots longs.", nextSteps: "Lecture chronométrée hebdomadaire avec tableau de suivi." },
  { id: "g-emma-3", studentId: "st-emma", professionalId: "u-pro3", title: "Gagner en confiance à l'oral", description: "Prendre la parole devant le groupe sans appréhension.", competency: "Confiance en soi", progress: 100, status: "atteint", startDate: addDaysISO(-120), targetDate: addDaysISO(-20), observations: "Emma s'est portée volontaire pour lire devant la classe. Objectif atteint !", nextSteps: "Entretenir par des exposés courts une fois par mois." },
  { id: "g-nathan-1", studentId: "st-nathan", professionalId: "u-pro2", title: "Maîtriser les fractions", description: "Comparer, additionner et représenter des fractions simples.", competency: "Mathématiques", progress: 45, status: "en_cours", startDate: addDaysISO(-45), targetDate: addDaysISO(40), observations: "La manipulation avec les disques de fractions porte ses fruits.", nextSteps: "Passer aux additions de fractions de même dénominateur." },
  { id: "g-nathan-2", studentId: "st-nathan", professionalId: "u-pro2", title: "Organiser son travail personnel", description: "Préparer son cartable et tenir son agenda sans aide.", competency: "Organisation", progress: 70, status: "en_cours", startDate: addDaysISO(-60), targetDate: addDaysISO(20), observations: "Le rituel du soir est acquis 4 jours sur 5.", nextSteps: "Ajouter une checklist hebdomadaire pour les évaluations." },
  { id: "g-sarah-1", studentId: "st-sarah", professionalId: "u-pro1", title: "Écrire un récit structuré", description: "Produire un récit de 10 lignes avec un début, un milieu et une fin.", competency: "Écriture", progress: 30, status: "en_cours", startDate: addDaysISO(-30), targetDate: addDaysISO(50), observations: "Sarah aime inventer des personnages. Le plan visuel l'aide à structurer.", nextSteps: "Écrire la suite d'une histoire commencée en séance." },
  { id: "g-sarah-2", studentId: "st-sarah", professionalId: "u-pro1", title: "Soutenir l'attention en tâche longue", description: "Rester concentrée 20 minutes sur une même activité.", competency: "Concentration", progress: 0, status: "a_commencer", startDate: addDaysISO(7), targetDate: addDaysISO(70), observations: "Démarrage prévu après le bilan d'attention.", nextSteps: "Mettre en place un minuteur visuel et des pauses actives." },
  { id: "g-lucas-1", studentId: "st-lucas", professionalId: "u-pro3", title: "Retrouver le goût d'apprendre", description: "S'engager dans une activité scolaire avec envie plutôt que par contrainte.", competency: "Motivation", progress: 40, status: "en_cours", startDate: addDaysISO(-40), targetDate: addDaysISO(45), observations: "Le projet « jeu de rôle historique » a relancé son intérêt.", nextSteps: "Relier chaque notion scolaire à un projet concret qui le passionne." },
  { id: "g-lucas-2", studentId: "st-lucas", professionalId: "u-pro3", title: "Méthode de révision autonome", description: "Construire et utiliser des fiches de révision sans assistance.", competency: "Méthodologie", progress: 55, status: "en_cours", startDate: addDaysISO(-35), targetDate: addDaysISO(35), observations: "Lucas commence à créer ses fiches seul, avec un modèle.", nextSteps: "Généraliser la méthode à toutes les matières." },
  { id: "g-chloe-1", studentId: "st-chloe", professionalId: "u-pro1", title: "Bilan des prérequis de lecture", description: "Évaluer le décodage, la fluence et la compréhension de base.", competency: "Lecture", progress: 0, status: "a_commencer", startDate: addDaysISO(5), targetDate: addDaysISO(25), observations: "En attente de validation de l'accompagnement.", nextSteps: "Première rencontre avec Chloé et ses parents." },
];

/* --- Séances passées générées (20 semaines d'historique vivant) --- */
const pastPatterns: { st: string; pro: string; type: SessionType }[] = [
  { st: "st-emma", pro: "u-pro1", type: "Lecture" },
  { st: "st-nathan", pro: "u-pro2", type: "Mathématiques" },
  { st: "st-emma", pro: "u-pro1", type: "Compréhension" },
  { st: "st-sarah", pro: "u-pro1", type: "Écriture" },
  { st: "st-nathan", pro: "u-pro2", type: "Méthodologie" },
  { st: "st-lucas", pro: "u-pro3", type: "Confiance en soi" },
  { st: "st-emma", pro: "u-pro1", type: "Lecture" },
  { st: "st-nathan", pro: "u-pro2", type: "Concentration" },
];
const timeSlots = ["14:00", "15:00", "16:30", "17:30"];
const pastObjectives: Record<string, string> = {
  Lecture: "Travail de fluence sur un texte adapté au niveau.",
  "Compréhension": "Questions explicites et implicites sur un album.",
  "Mathématiques": "Manipulation et exercices progressifs de calcul.",
  "Écriture": "Production d'un court écrit à partir d'un support imagé.",
  "Méthodologie": "Organisation du cahier de textes et des devoirs.",
  Concentration: "Exercices d'attention avec minuteur visuel.",
  "Confiance en soi": "Mise en situation de réussite et verbalisation.",
};

function buildPastSessions(): Session[] {
  const list: Session[] = [];
  for (let w = 20; w >= 1; w--) {
    const p = pastPatterns[(20 - w) % pastPatterns.length];
    const idx = 20 - w;
    // Une séance par semaine, décalée dans la semaine
    list.push({
      id: `se-p${idx}`,
      studentId: p.st,
      professionalId: p.pro,
      date: addDaysISO(-w * 7 + (idx % 4)),
      time: timeSlots[idx % timeSlots.length],
      duration: 45,
      type: p.type,
      objective: pastObjectives[p.type],
      status: "realisee",
    });
  }
  return list;
}

const reports: SessionReport[] = [
  { id: "r-1", sessionId: "se-p19", objective: "Fluidité de lecture sur un chapitre d'album.", activities: "Lecture chronométrée, repérage des mots longs, lecture en écho puis lecture autonome du chapitre 3.", difficulties: "Hésitations sur les mots de plus de trois syllabes en fin de texte, quand la fatigue s'installe.", progress: "Débit passé de 62 à 71 mots/minute. Emma a respecté la ponctuation sur 90 % du texte.", engagement: 5, recommendations: "Poursuivre la lecture partagée 10 minutes chaque soir, sans pression de performance.", nextSteps: "Introduire la lecture à voix haute devant un petit groupe pour consolider la confiance.", createdAt: new Date(addDaysISO(-3) + "T18:20:00").toISOString() },
  { id: "r-2", sessionId: "se-p17", objective: "Compréhension : identifier les informations principales.", activities: "Lecture d'un texte documentaire sur les volcans, surlignage des idées clés, quiz de compréhension en 6 questions.", difficulties: "Les questions « pourquoi » demandent encore un étayage fort.", progress: "5 bonnes réponses sur 6. Emma reformule désormais avec ses propres mots.", engagement: 4, recommendations: "Proposer des textes plus courts mais plus denses, avec un surlignage guidé.", nextSteps: "Travailler les inférences à partir de courtes bandes dessinées.", createdAt: new Date(addDaysISO(-10) + "T18:05:00").toISOString() },
  { id: "r-3", sessionId: "se-p18", objective: "Fractions : comparer et représenter.", activities: "Disques de fractions, bataille de fractions, fiche d'exercices progressive.", difficulties: "Confusion entre numérateur et dénominateur quand les fractions sont proches.", progress: "Nathan compare correctement 8 comparaisons sur 10 avec le support visuel.", engagement: 4, recommendations: "Laisser les disques de fractions disponibles pendant les devoirs.", nextSteps: "Additions de fractions de même dénominateur la prochaine fois.", createdAt: new Date(addDaysISO(-9) + "T17:40:00").toISOString() },
];

/* Relier les rapports aux séances les plus récentes */
const sessions: Session[] = buildPastSessions();
sessions[19] = { ...sessions[19], reportId: "r-1" };
sessions[17] = { ...sessions[17], reportId: "r-2" };
sessions[18] = { ...sessions[18], reportId: "r-3" };

const upcoming: Session[] = [
  { id: "se-u1", studentId: "st-emma", professionalId: "u-pro1", date: todayISO(), time: "15:00", duration: 45, type: "Lecture", objective: "Lecture fluence : un chapitre d'album complet.", status: "programmee" },
  { id: "se-u2", studentId: "st-nathan", professionalId: "u-pro2", date: addDaysISO(1), time: "16:00", duration: 45, type: "Mathématiques", objective: "Additions de fractions de même dénominateur.", status: "programmee" },
  { id: "se-u3", studentId: "st-emma", professionalId: "u-pro1", date: addDaysISO(2), time: "15:00", duration: 45, type: "Compréhension", objective: "Inférences à partir d'une bande dessinée.", status: "programmee" },
  { id: "se-u4", studentId: "st-lucas", professionalId: "u-pro3", date: addDaysISO(3), time: "17:30", duration: 45, type: "Confiance en soi", objective: "Préparer un exposé court sur son projet historique.", status: "programmee" },
  { id: "se-u5", studentId: "st-sarah", professionalId: "u-pro1", date: addDaysISO(4), time: "14:00", duration: 45, type: "Écriture", objective: "Écrire la suite de l'histoire commencée en séance.", status: "programmee" },
  { id: "se-u6", studentId: "st-emma", professionalId: "u-pro1", date: addDaysISO(7), time: "15:00", duration: 45, type: "Lecture", objective: "Lecture chronométrée + tableau de suivi mensuel.", status: "programmee" },
  { id: "se-u7", studentId: "st-nathan", professionalId: "u-pro2", date: addDaysISO(8), time: "16:00", duration: 45, type: "Méthodologie", objective: "Checklist hebdomadaire avant évaluation.", status: "programmee" },
];
sessions.push(...upcoming);

const evaluations: Evaluation[] = [
  { id: "ev-1", studentId: "st-emma", professionalId: "u-pro1", competency: "Lecture", score: 5.2, comment: "Décodage correct mais lent, fatigue en fin de texte.", date: addDaysISO(-70) },
  { id: "ev-2", studentId: "st-emma", professionalId: "u-pro1", competency: "Lecture", score: 6.4, comment: "La fluence progresse nettement, la ponctuation est mieux respectée.", date: addDaysISO(-35) },
  { id: "ev-3", studentId: "st-emma", professionalId: "u-pro1", competency: "Lecture", score: 7.2, comment: "Lecture fluide sur textes adaptés. Belle aisance à voix haute.", date: addDaysISO(-5) },
  { id: "ev-4", studentId: "st-emma", professionalId: "u-pro1", competency: "Compréhension écrite", score: 4.1, comment: "Les informations principales sont repérées avec aide.", date: addDaysISO(-70) },
  { id: "ev-5", studentId: "st-emma", professionalId: "u-pro1", competency: "Compréhension écrite", score: 5.3, comment: "Repérage autonome sur questions explicites.", date: addDaysISO(-35) },
  { id: "ev-6", studentId: "st-emma", professionalId: "u-pro1", competency: "Compréhension écrite", score: 6.1, comment: "L'élève progresse dans l'identification des informations principales.", date: addDaysISO(-5) },
  { id: "ev-7", studentId: "st-emma", professionalId: "u-pro1", competency: "Concentration", score: 5.5, comment: "Attention de 12 minutes sur tâche de lecture.", date: addDaysISO(-70) },
  { id: "ev-8", studentId: "st-emma", professionalId: "u-pro1", competency: "Concentration", score: 7.5, comment: "Attention soutenue de 20 minutes, pauses autonomes bien gérées.", date: addDaysISO(-5) },
  { id: "ev-9", studentId: "st-emma", professionalId: "u-pro2", competency: "Mathématiques", score: 6.8, comment: "Bonne logique, calcul mental en progrès.", date: addDaysISO(-5) },
  { id: "ev-10", studentId: "st-nathan", professionalId: "u-pro2", competency: "Mathématiques", score: 3.4, comment: "Notion de fraction très fragile, refus de manipuler.", date: addDaysISO(-70) },
  { id: "ev-11", studentId: "st-nathan", professionalId: "u-pro2", competency: "Mathématiques", score: 4.6, comment: "Accepte la manipulation, compare des fractions simples.", date: addDaysISO(-35) },
  { id: "ev-12", studentId: "st-nathan", professionalId: "u-pro2", competency: "Mathématiques", score: 5.8, comment: "Représente et compare avec le support visuel.", date: addDaysISO(-5) },
  { id: "ev-13", studentId: "st-nathan", professionalId: "u-pro2", competency: "Organisation", score: 3.8, comment: "Cartable et agenda non tenus sans rappel adulte.", date: addDaysISO(-70) },
  { id: "ev-14", studentId: "st-nathan", professionalId: "u-pro2", competency: "Organisation", score: 6.2, comment: "Rituel du soir acquis la plupart des jours.", date: addDaysISO(-5) },
  { id: "ev-15", studentId: "st-sarah", professionalId: "u-pro1", competency: "Écriture", score: 3.5, comment: "Production d'écrits très courte, geste graphique tendu.", date: addDaysISO(-55) },
  { id: "ev-16", studentId: "st-sarah", professionalId: "u-pro1", competency: "Écriture", score: 4.4, comment: "Récits plus longs avec le plan visuel.", date: addDaysISO(-25) },
  { id: "ev-17", studentId: "st-sarah", professionalId: "u-pro1", competency: "Écriture", score: 5.1, comment: "Structure début/milieu/fin respectée sur un récit guidé.", date: addDaysISO(-4) },
  { id: "ev-18", studentId: "st-sarah", professionalId: "u-pro1", competency: "Concentration", score: 4.8, comment: "Attention de 12 à 15 minutes selon l'activité.", date: addDaysISO(-10) },
  { id: "ev-19", studentId: "st-lucas", professionalId: "u-pro3", competency: "Confiance en soi", score: 3.2, comment: "Évite les situations d'exposition, autocritique forte.", date: addDaysISO(-50) },
  { id: "ev-20", studentId: "st-lucas", professionalId: "u-pro3", competency: "Confiance en soi", score: 5.4, comment: "Participe davantage, verbalise ses réussites.", date: addDaysISO(-6) },
  { id: "ev-21", studentId: "st-lucas", professionalId: "u-pro3", competency: "Motivation", score: 3.6, comment: "Engagement uniquement sur les sujets qui le passionnent.", date: addDaysISO(-50) },
  { id: "ev-22", studentId: "st-lucas", professionalId: "u-pro3", competency: "Motivation", score: 5.1, comment: "Se projette dans ses projets, initie des activités.", date: addDaysISO(-6) },
];

const resources: Resource[] = [
  { id: "re-1", title: "Fiches de lecture progressives — Niveau CM", description: "20 fiches progressives pour travailler la fluence, avec tableau de suivi pour l'élève et la famille.", category: "Lecture", type: "PDF", assignedTo: ["st-emma"], createdAt: addDaysISO(-40) },
  { id: "re-2", title: "La course aux fractions", description: "Jeu de cartes pour comparer et ordonner les fractions en s'amusant, à faire en famille.", category: "Mathématiques", type: "Activité", assignedTo: ["st-nathan"], createdAt: addDaysISO(-30) },
  { id: "re-3", title: "Comprendre un texte en 4 étapes", description: "Vidéo courte et méthodique : survoler, questionner, lire, résumer.", category: "Compréhension", type: "Vidéo", assignedTo: ["st-emma", "st-sarah"], createdAt: addDaysISO(-25) },
  { id: "re-4", title: "Fiche méthode : le cartable du soir", description: "Rituel visuel en 5 étapes pour préparer son cartable et son agenda sans stress.", category: "Organisation", type: "Fiche", assignedTo: ["st-nathan", "st-lucas"], createdAt: addDaysISO(-20) },
  { id: "re-5", title: "Exercices de copie intelligente", description: "Série d'exercices pour automatiser le geste d'écriture sans se crisper.", category: "Écriture", type: "PDF", assignedTo: ["st-sarah"], createdAt: addDaysISO(-18) },
  { id: "re-6", title: "Le jeu du détective de texte", description: "Activité ludique pour repérer indices et informations cachées dans un récit.", category: "Compréhension", type: "Activité", assignedTo: ["st-emma"], createdAt: addDaysISO(-12) },
  { id: "re-7", title: "Respiration & concentration — audio guidé", description: "Audio de 5 minutes pour se recentrer avant les devoirs.", category: "Concentration", type: "Lien", assignedTo: [], createdAt: addDaysISO(-15) },
  { id: "re-8", title: "Le mur des réussites", description: "Affiche à compléter à la maison pour rendre visibles les petites victoires du quotidien.", category: "Confiance en soi", type: "Activité", assignedTo: ["st-lucas"], createdAt: addDaysISO(-10) },
  { id: "re-9", title: "Lecture chronométrée — tableau de suivi", description: "Tableau pour mesurer ses progrès de fluence semaine après semaine.", category: "Lecture", type: "Fiche", assignedTo: ["st-emma"], createdAt: addDaysISO(-8) },
  { id: "re-10", title: "Mémo multiplications illustré", description: "Aide-mémoire visuel des tables, avec astuces de calcul.", category: "Mathématiques", type: "PDF", assignedTo: ["st-nathan"], createdAt: addDaysISO(-6) },
  { id: "re-11", title: "Organiser ses révisions en 3 temps", description: "Méthode simple : comprendre, mémoriser, s'auto-évaluer.", category: "Méthodologie", type: "Fiche", assignedTo: ["st-lucas"], createdAt: addDaysISO(-4) },
];

const messages: Message[] = [
  { id: "me-1", senderId: "u-parent", receiverId: "u-pro1", content: "Bonjour, comment s'est passée la séance d'Emma cette semaine ?", createdAt: new Date(addDaysISO(-3) + "T09:12:00").toISOString(), read: true },
  { id: "me-2", senderId: "u-pro1", receiverId: "u-parent", content: "Bonjour Claire, une très bonne séance ! Emma a lu un chapitre complet sans se décourager, et elle a respecté la ponctuation presque partout. Je vous joins le compte rendu.", attachment: "Compte-rendu-Emma.pdf", createdAt: new Date(addDaysISO(-3) + "T18:30:00").toISOString(), read: true },
  { id: "me-3", senderId: "u-parent", receiverId: "u-pro1", content: "Merci beaucoup ! Nous ferons la lecture partagée ce week-end comme conseillé.", createdAt: new Date(addDaysISO(-2) + "T08:45:00").toISOString(), read: true },
  { id: "me-4", senderId: "u-pro1", receiverId: "u-parent", content: "Parfait. Je lui attribuerai une nouvelle fiche de lecture mercredi, elle pourra choisir son album préféré.", createdAt: new Date(addDaysISO(-1) + "T19:02:00").toISOString(), read: false },
  { id: "me-5", senderId: "u-admin", receiverId: "u-pro1", content: "Bonjour Karim, peux-tu prendre en charge le bilan initial de Chloé Martin ? Son dossier est en attente de validation.", createdAt: new Date(addDaysISO(-2) + "T10:20:00").toISOString(), read: true },
  { id: "me-6", senderId: "u-pro1", receiverId: "u-admin", content: "Oui, je peux proposer un bilan jeudi après-midi. Je te confirme dès que la famille aura choisi le créneau.", createdAt: new Date(addDaysISO(-1) + "T11:05:00").toISOString(), read: true },
  { id: "me-7", senderId: "u-pro2", receiverId: "u-admin", content: "Amina, le rapport trimestriel de Nathan est prêt. Merci de le relire avant envoi à la famille.", createdAt: new Date(addDaysISO(-4) + "T16:44:00").toISOString(), read: false },
  { id: "me-8", senderId: "u-parent2", receiverId: "u-pro2", content: "Bonjour, Nathan a utilisé le jeu de fractions hier soir, il a adoré ! Merci pour ce support.", createdAt: new Date(addDaysISO(-1) + "T20:15:00").toISOString(), read: false },
];

const notifications: AppNotification[] = [
  { id: "no-1", userId: "u-parent", title: "Séance demain", message: "Votre enfant a une séance demain à 15h00.", kind: "info", link: "/dashboard/calendar", read: false, createdAt: new Date(addDaysISO(-1) + "T18:00:00").toISOString() },
  { id: "no-2", userId: "u-parent", title: "Nouveau compte rendu", message: "Un nouveau compte rendu est disponible pour Emma.", kind: "success", link: "/dashboard/students/st-emma", read: false, createdAt: new Date(addDaysISO(-3) + "T18:35:00").toISOString() },
  { id: "no-3", userId: "u-parent", title: "Nouvelle ressource", message: "Une nouvelle ressource a été attribuée à Emma : tableau de suivi de lecture.", kind: "info", link: "/dashboard/resources", read: true, createdAt: new Date(addDaysISO(-8) + "T10:00:00").toISOString() },
  { id: "no-4", userId: "u-pro1", title: "Bilan à programmer", message: "Chloé Martin attend un bilan initial de lecture.", kind: "warning", link: "/dashboard/students/st-chloe", read: false, createdAt: new Date(addDaysISO(-2) + "T10:25:00").toISOString() },
  { id: "no-5", userId: "u-pro1", title: "Nouvel objectif atteint", message: "Emma a atteint son objectif « Gagner en confiance à l'oral ». Bravo !", kind: "success", link: "/dashboard/students/st-emma", read: true, createdAt: new Date(addDaysISO(-20) + "T17:00:00").toISOString() },
  { id: "no-6", userId: "u-admin", title: "Nouvel élève", message: "L'inscription de Chloé Martin est en attente de validation.", kind: "info", link: "/dashboard/students", read: false, createdAt: new Date(addDaysISO(-6) + "T09:30:00").toISOString() },
  { id: "no-7", userId: "u-admin", title: "Séances du jour", message: "Une séance est programmée aujourd'hui avec Emma à 15h00.", kind: "info", link: "/dashboard/calendar", read: false, createdAt: new Date(addDaysISO(0) + "T08:00:00").toISOString() },
  { id: "no-8", userId: "u-eleve", title: "Nouvelle activité", message: "Une nouvelle activité t'attend : Le jeu du détective de texte.", kind: "success", link: "/dashboard", read: false, createdAt: new Date(addDaysISO(-1) + "T17:30:00").toISOString() },
  { id: "no-9", userId: "u-eleve", title: "Bravo Emma !", message: "Tu as atteint ton objectif « Gagner en confiance à l'oral ».", kind: "success", link: "/dashboard", read: true, createdAt: new Date(addDaysISO(-20) + "T17:05:00").toISOString() },
];

/* ------------------------------- Seed global ------------------------------- */

export interface SeedData {
  users: User[];
  students: Student[];
  goals: Goal[];
  sessions: Session[];
  reports: SessionReport[];
  evaluations: Evaluation[];
  resources: Resource[];
  messages: Message[];
  notifications: AppNotification[];
}

export function buildSeed(): SeedData {
  return {
    users,
    students,
    goals,
    sessions,
    reports,
    evaluations,
    resources,
    messages,
    notifications,
  };
}

/* ------------------------------ Sélecteurs purs ------------------------------ */

export function studentProgress(goals: Goal[], studentId: string): number {
  const list = goals.filter((g) => g.studentId === studentId);
  if (list.length === 0) return 0;
  return Math.round(list.reduce((s, g) => s + g.progress, 0) / list.length);
}

export function latestEvaluation(evaluations: Evaluation[], studentId: string, competency: string): Evaluation | undefined {
  return evaluations
    .filter((e) => e.studentId === studentId && e.competency === competency)
    .sort((a, b) => b.date.localeCompare(a.date))[0];
}

export function fullName(u: { firstName: string; lastName: string }): string {
  return `${u.firstName} ${u.lastName}`;
}
