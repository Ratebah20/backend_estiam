# 🚀 Guide de Démarrage Rapide

## 1. Démarrer la Base de Données

```bash
cd /Users/aniki/Documents/Dev/docker
docker-compose -f docker-compose-postgres.yml up -d
```

## 2. Peupler la Base avec des Données de Test

```bash
cd /Users/aniki/Documents/Dev/eval_estiam/backend
npx prisma db seed
```

Cela va créer :
- 2 utilisateurs : `admin@btp.com` et `user@btp.com` (mot de passe : `password123`)
- 2 clients
- 2 projets
- 3 salariés
- 3 équipements
- 2 interventions

## 3. Démarrer le Backend

```bash
cd /Users/aniki/Documents/Dev/eval_estiam/backend
npm run start:dev
```

✅ Backend disponible sur http://localhost:3000
✅ GraphQL Playground sur http://localhost:3000/graphql

## 4. Démarrer le Frontend

Dans un nouveau terminal :

```bash
cd /Users/aniki/Documents/Dev/eval_estiam/frontend
npm start
```

✅ Application Angular sur http://localhost:4200

## 5. Se Connecter

1. Accédez à http://localhost:4200
2. Vous serez redirigé vers `/login`
3. Utilisez un des comptes :
   - **Admin** : `admin@btp.com` / `password123`
   - **User** : `user@btp.com` / `password123`

## 6. Tester l'API GraphQL

Accédez à http://localhost:3000/graphql et testez :

### Login
```graphql
mutation {
  login(input: {
    email: "admin@btp.com"
    password: "password123"
  }) {
    accessToken
    user {
      id
      email
      nom
      prenom
      role
    }
  }
}
```

### Liste des Clients
```graphql
query {
  clients {
    id
    adresse
  }
}
```

### Liste des Projets avec Temps
```graphql
query {
  projets {
    id
    nom
    tempsTotal
    tempsRestant
  }
}
```

### Planning d'un Salarié
```graphql
query {
  salaries {
    id
    nom
    prenom
  }
}

# Puis utilisez un ID :
query {
  planningSalarie(salarieId: "ID_DU_SALARIE") {
    id
    date
    duree
    projet {
      nom
    }
  }
}
```

## 🛠️ Commandes Utiles

### Backend
```bash
# Visualiser la base de données
npx prisma studio

# Réinitialiser la base
npx prisma migrate reset

# Relancer le seed
npx prisma db seed
```

### Frontend
```bash
# Build production
ng build
```

## 📊 Structure du Projet

```
eval_estiam/
├── backend/              # NestJS + GraphQL + Prisma
│   ├── src/
│   │   ├── auth/        # Authentification JWT
│   │   ├── client/      # Gestion clients
│   │   ├── projet/      # Gestion projets
│   │   ├── salarie/     # Gestion salariés
│   │   ├── materiel/    # Gestion matériel
│   │   └── intervention/# Gestion interventions
│   └── prisma/
│       ├── schema.prisma # Schéma DB
│       └── seed.ts      # Données de test
│
└── frontend/            # Angular + Apollo
    └── src/app/
        ├── core/        # Services & Models
        └── features/    # Composants
```

## 🎯 Prochaines Étapes

Vous pouvez maintenant :
- ✅ Développer de nouveaux composants Angular
- ✅ Ajouter des queries/mutations GraphQL
- ✅ Créer de nouvelles entités dans Prisma
- ✅ Implémenter les pages CRUD complètes
- ✅ Ajouter des fonctionnalités avancées

Consultez le README.md complet pour plus de détails !
