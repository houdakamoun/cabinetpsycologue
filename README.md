# Cabinet Psychologique — Guide de démarrage

## Architecture

```
psycologie cabinet/
├── backend/          Express + Prisma + MySQL + JWT
│   ├── prisma/schema.prisma
│   └── src/
│       ├── controllers/   auth, patients, appointments, payments, notes, stats
│       ├── routes/
│       └── middleware/    JWT auth
└── frontend/         Angular 21 + Material + TailwindCSS
    └── src/app/
        ├── public/        Site vitrine (accueil, à propos, contact)
        ├── modules/       Auth, patients, RDV, paiements
        └── layout/        Dashboard admin avec sidebar
```

## Palette de couleurs

| Couleur   | Hex       | Usage                    |
|-----------|-----------|--------------------------|
| Primary   | `#099078` | Boutons, titres, liens   |
| Accent    | `#FFD6D1` | Badges, avatars, fonds    |
| Cream     | `#F9ECE5` | Fond général             |

## Base de données (Prisma)

Tables : `User`, `Patient`, `Appointment`, `SessionNote`, `Payment`

### Démarrer MySQL puis migrer

```bash
cd backend
npx prisma migrate dev --name init_full_schema
```

## Lancer le projet

**Terminal 1 — Backend**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend**
```bash
cd frontend
npm start
```

- Site public : http://localhost:4200/accueil
- Connexion admin : http://localhost:4200/login
- Dashboard : http://localhost:4200/admin/dashboard

## Première utilisation

1. Créer un compte sur `/register`
2. Se connecter sur `/login`
3. Ajouter des patients, rendez-vous et paiements

## Phase 2 / 3 (à venir)

- FullCalendar drag & drop
- Notifications email/SMS
- Génération PDF
- Dark mode
- Upload documents patients
