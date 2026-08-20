# Clinique d'Éducation & de l'Innovation Pédagogique

> *Accompagner, soutenir et réussir.*

Plateforme EdTech de suivi pédagogique : profils élèves, parcours personnalisés, objectifs, séances, comptes rendus, évaluations, progrès, ressources, messagerie et rapports — avec quatre espaces distincts (administrateur, professionnel, parent, élève).

---

## 🧱 Stack

| Couche | Technologie |
| --- | --- |
| Framework | React 18 + Vite 6 |
| Langage | TypeScript (strict) |
| Styles | Tailwind CSS v4 |
| Routage | react-router-dom (HashRouter) |
| État global | Zustand (persisté en `localStorage`) |
| Icônes | lucide-react |
| Graphiques | SVG natifs (aucune dépendance de charts) |

> L'architecture du store (`src/lib/store.ts`) et du modèle de données (`src/lib/data.ts`) est un miroir du schéma PostgreSQL/Supabase prévu : chaque action correspond à un futur appel API (Auth, tables, RLS, Storage).

---

## ⚙️ Prérequis

- **Node.js ≥ 18** (Vite 6 l'exige). Vérifiez avec `node -v`.
- **npm ≥ 9**.

---

## 🚀 Installation propre (première fois)

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement
npm run dev
```

L'application démarre sur **http://localhost:3000**.

### 🔁 Si l'application se lance mal ou affiche des erreurs étranges

Le coupable est presque toujours le **cache de pré-bundling de Vite** ou un **port occupé**. Dans l'ordre :

```bash
# 1. Vider le cache de dépendances de Vite (corrige « destroy is not a function »)
rm -rf node_modules/.vite

# 2. Relancer en forçant la ré-optimisation des dépendances
npm run dev -- --force
```

Si le problème persiste, repartez de zéro :

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev -- --force
```

---

## 🐞 Dépannage courant

| Symptôme | Cause probable | Solution |
| --- | --- | --- |
| `Port 3000 is already in use` / le serveur ne démarre pas | Une autre instance tourne déjà (le port est verrouillé par `strictPort`) | Tuez le processus : `npx kill-port 3000` (ou `lsof -ti:3000 \| xargs kill`), puis relancez |
| `destroy is not a function` / erreurs React au montage | Cache `.vite/deps` corrompu | `rm -rf node_modules/.vite` puis `npm run dev -- --force` |
| `npm install` très lent | Dépendances lourdes inutilisées (voir ci-dessous) | Normal au premier coup ; le cache npm accélère les suivantes |
| Page blanche / erreur au chargement | Ancienne version en cache navigateur | Rechargement forcé : `Ctrl + Maj + R` (ou `Cmd + Maj + R`) |
| `vite: command not found` | Dépendances non installées | `npm install` |

### 🪶 Alléger l'installation (recommandé)

Plusieurs dépendances du `package.json` ne sont **plus utilisées** par le code (les graphiques sont désormais en SVG natif et le store est 100 % local). Elles alourdissent inutilement `node_modules` et ralentissent le premier `npm install` :

- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- `@supabase/supabase-js`
- `canvas-confetti`
- `date-fns`
- `framer-motion`
- `recharts`
- `uuid`

Vous pouvez les retirer sans risque pour gagner en vitesse d'installation :

```bash
npm uninstall @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities @supabase/supabase-js canvas-confetti date-fns framer-motion recharts uuid
```

> ⚠️ Elles ont été laissées en place dans ce dépôt pour ne pas toucher à la configuration ; le code n'en importe **aucune**.

---

## 📦 Build de production

```bash
npm run build      # génère dist/
npm run preview    # sert le build de production localement
npm run typecheck  # vérification TypeScript sans émission
```

---

## 🔑 Comptes de démonstration

Mot de passe commun : **`demo123`**

| Rôle | E-mail | Ce que vous verrez |
| --- | --- | --- |
| Administrateur | `admin@clinique-education.fr` | Statistiques globales, tous les élèves, rapports |
| Professionnel | `k.haddad@clinique-education.fr` | Ses élèves, séances, comptes rendus, évaluations |
| Parent | `claire.moreau@exemple.fr` | Espace simple centré sur son enfant (Emma) |
| Élève | `emma@exemple.fr` | Interface motivante : objectifs, activités, réussites |

Des boutons « Explorer la démo » sur la page de connexion permettent aussi de se connecter en un clic, sans saisir d'identifiants.

---

## 🗂️ Structure du projet

```
src/
├── App.tsx                  # Routage + garde-fou d'erreurs (ErrorBoundary)
├── main.tsx                 # Point d'entrée + journalisation globale
├── index.css                # Design system Tailwind v4 (thème, animations)
├── lib/
│   ├── data.ts              # Modèle de données + données de démo réalistes
│   └── store.ts             # Store Zustand (actions = futurs appels Supabase)
├── components/
│   └── ui.tsx               # Kit UI : boutons, modales, graphiques SVG, toasts…
├── app/
│   └── shell.tsx            # Coquille applicative (sidebar, notifications, rôles)
└── pages/
    ├── public.tsx           # Landing + pages publiques
    ├── auth.tsx             # Connexion / inscription
    ├── dashboards.tsx       # Tableaux de bord admin & professionnel
    ├── spaces.tsx           # Espaces parent & élève
    ├── students.tsx         # Gestion des élèves
    ├── student-profile.tsx  # Fiche élève complète
    ├── sessions.tsx         # Séances + comptes rendus
    ├── calendar.tsx         # Calendrier (mois / semaine / jour)
    ├── messages.tsx         # Messagerie interne
    └── modules.tsx          # Objectifs, évaluations, ressources, rapports, réglages
```

---

## 🔒 Confidentialité

Les données des élèves sont traitées comme sensibles : chaque rôle n'accède qu'aux élèves qui lui sont rattachés (`visibleStudents` dans le store), et les permissions sont appliquées sur toutes les pages. Aucun diagnostic médical ou psychologique n'est jamais produit — la plateforme reste strictement pédagogique.
