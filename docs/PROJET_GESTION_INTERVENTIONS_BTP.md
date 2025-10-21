# Projet de Gestion des Interventions BTP

## 📋 Vue d'ensemble

Application de gestion des interventions pour une entreprise de BTP généraliste. Le système permet de gérer les projets clients, planifier les interventions et affecter les ressources (salariés et matériel).

### Stack Technique
- **Backend**: NestJS avec GraphQL
- **Frontend**: Angular
- **Base de données**: PostgreSQL
- **Architecture**: 3-tiers (Client / Serveur / BDD)

---

## 🎯 Objectifs Fonctionnels

### Fonctionnalités Principales

1. **Gestion des Interventions**
   - Création d'interventions avec date et durée
   - Association à un projet
   - Affectation de salariés et matériel

2. **Planning Salarié**
   - Visualisation de toutes les interventions à venir pour un salarié donné
   - Affichage sous forme de planning/calendrier
   - Vue chronologique des affectations

3. **Suivi Client**
   - Consultation des interventions liées à un projet spécifique
   - Affichage du temps restant sur le projet
   - Transparence pour le client

---

## 🗂️ Modèle de Données

### Entités et Relations

```
┌─────────────────┐
│   Client        │
│─────────────────│
│ id: UUID        │
│ adresse: String │
└────────┬────────┘
         │ 1
         │
         │ 0..*
┌────────▼────────┐
│   Projet        │
│─────────────────│
│ id: UUID        │
│ nom: String     │
│ clientId: UUID  │
└────────┬────────┘
         │ 1
         │
         │ 0..*
┌────────▼────────────┐
│   Intervention      │
│─────────────────────│
│ id: UUID            │
│ date: DateTime      │
│ duree: Float        │ (en heures)
│ projetId: UUID      │
└─────────────────────┘
         │ 0..*
         ├──────────────────┐
         │ 0..*             │ 0..*
┌────────▼────────┐  ┌──────▼──────────┐
│   Salarie       │  │   Materiel      │
│─────────────────│  │─────────────────│
│ id: UUID        │  │ id: UUID        │
│ nom: String     │  │ designation:    │
│ prenom: String  │  │   String        │
└─────────────────┘  └─────────────────┘
```

### Tables de Jointure (Many-to-Many)

- **intervention_salaries**: Lie Intervention ↔ Salarie
- **intervention_materiels**: Lie Intervention ↔ Materiel

---

## 📊 Schéma Base de Données PostgreSQL

### Script de Création des Tables

```sql
-- Table Client
CREATE TABLE client (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adresse VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Projet
CREATE TABLE projet (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(255) NOT NULL,
    client_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES client(id) ON DELETE CASCADE
);

-- Table Salarie
CREATE TABLE salarie (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Materiel
CREATE TABLE materiel (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    designation VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Intervention
CREATE TABLE intervention (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date TIMESTAMP NOT NULL,
    duree FLOAT NOT NULL, -- durée en heures
    projet_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (projet_id) REFERENCES projet(id) ON DELETE CASCADE
);

-- Table de jointure Intervention - Salarie
CREATE TABLE intervention_salaries (
    intervention_id UUID NOT NULL,
    salarie_id UUID NOT NULL,
    PRIMARY KEY (intervention_id, salarie_id),
    FOREIGN KEY (intervention_id) REFERENCES intervention(id) ON DELETE CASCADE,
    FOREIGN KEY (salarie_id) REFERENCES salarie(id) ON DELETE CASCADE
);

-- Table de jointure Intervention - Materiel
CREATE TABLE intervention_materiels (
    intervention_id UUID NOT NULL,
    materiel_id UUID NOT NULL,
    PRIMARY KEY (intervention_id, materiel_id),
    FOREIGN KEY (intervention_id) REFERENCES intervention(id) ON DELETE CASCADE,
    FOREIGN KEY (materiel_id) REFERENCES materiel(id) ON DELETE CASCADE
);

-- Index pour optimiser les requêtes
CREATE INDEX idx_projet_client ON projet(client_id);
CREATE INDEX idx_intervention_projet ON intervention(projet_id);
CREATE INDEX idx_intervention_date ON intervention(date);
CREATE INDEX idx_intervention_salaries_salarie ON intervention_salaries(salarie_id);
CREATE INDEX idx_intervention_materiels_materiel ON intervention_materiels(materiel_id);
```

---

## 🔌 API GraphQL

### Schéma GraphQL

```graphql
# Types

type Client {
  id: ID!
  adresse: String!
  projets: [Projet!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Projet {
  id: ID!
  nom: String!
  client: Client!
  interventions: [Intervention!]!
  tempsTotal: Float!        # Somme des durées de toutes les interventions
  tempsRestant: Float!      # Temps des interventions à venir
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Salarie {
  id: ID!
  nom: String!
  prenom: String!
  interventions: [Intervention!]!
  interventionsAvenir: [Intervention!]!  # Filtrées par date >= aujourd'hui
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Materiel {
  id: ID!
  designation: String!
  interventions: [Intervention!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Intervention {
  id: ID!
  date: DateTime!
  duree: Float!             # Durée en heures
  projet: Projet!
  salaries: [Salarie!]!
  materiels: [Materiel!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

# Inputs

input CreateClientInput {
  adresse: String!
}

input CreateProjetInput {
  nom: String!
  clientId: ID!
}

input CreateSalarieInput {
  nom: String!
  prenom: String!
}

input CreateMaterielInput {
  designation: String!
}

input CreateInterventionInput {
  date: DateTime!
  duree: Float!
  projetId: ID!
  salarieIds: [ID!]!
  materielIds: [ID!]!
}

input UpdateInterventionInput {
  date: DateTime
  duree: Float
  projetId: ID
  salarieIds: [ID!]
  materielIds: [ID!]
}

# Queries

type Query {
  # Clients
  clients: [Client!]!
  client(id: ID!): Client

  # Projets
  projets: [Projet!]!
  projet(id: ID!): Projet
  projetsByClient(clientId: ID!): [Projet!]!

  # Salariés
  salaries: [Salarie!]!
  salarie(id: ID!): Salarie
  planningSalarie(salarieId: ID!): [Intervention!]!  # Interventions à venir

  # Matériel
  materiels: [Materiel!]!
  materiel(id: ID!): Materiel

  # Interventions
  interventions: [Intervention!]!
  intervention(id: ID!): Intervention
  interventionsByProjet(projetId: ID!): [Intervention!]!
  interventionsAvenir: [Intervention!]!              # date >= aujourd'hui
}

# Mutations

type Mutation {
  # Clients
  createClient(input: CreateClientInput!): Client!
  updateClient(id: ID!, adresse: String!): Client!
  deleteClient(id: ID!): Boolean!

  # Projets
  createProjet(input: CreateProjetInput!): Projet!
  updateProjet(id: ID!, nom: String): Projet!
  deleteProjet(id: ID!): Boolean!

  # Salariés
  createSalarie(input: CreateSalarieInput!): Salarie!
  updateSalarie(id: ID!, nom: String, prenom: String): Salarie!
  deleteSalarie(id: ID!): Boolean!

  # Matériel
  createMateriel(input: CreateMaterielInput!): Materiel!
  updateMateriel(id: ID!, designation: String!): Materiel!
  deleteMateriel(id: ID!): Boolean!

  # Interventions
  createIntervention(input: CreateInterventionInput!): Intervention!
  updateIntervention(id: ID!, input: UpdateInterventionInput!): Intervention!
  deleteIntervention(id: ID!): Boolean!
}

scalar DateTime
```

---

## 🏗️ Architecture Backend (NestJS)

### Structure des Dossiers

```
backend/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   │
│   ├── common/
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   └── pipes/
│   │
│   ├── config/
│   │   ├── database.config.ts
│   │   └── graphql.config.ts
│   │
│   ├── modules/
│   │   ├── client/
│   │   │   ├── client.module.ts
│   │   │   ├── client.resolver.ts
│   │   │   ├── client.service.ts
│   │   │   ├── entities/
│   │   │   │   └── client.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-client.input.ts
│   │   │       └── update-client.input.ts
│   │   │
│   │   ├── projet/
│   │   │   ├── projet.module.ts
│   │   │   ├── projet.resolver.ts
│   │   │   ├── projet.service.ts
│   │   │   ├── entities/
│   │   │   │   └── projet.entity.ts
│   │   │   └── dto/
│   │   │
│   │   ├── salarie/
│   │   │   ├── salarie.module.ts
│   │   │   ├── salarie.resolver.ts
│   │   │   ├── salarie.service.ts
│   │   │   ├── entities/
│   │   │   │   └── salarie.entity.ts
│   │   │   └── dto/
│   │   │
│   │   ├── materiel/
│   │   │   ├── materiel.module.ts
│   │   │   ├── materiel.resolver.ts
│   │   │   ├── materiel.service.ts
│   │   │   ├── entities/
│   │   │   │   └── materiel.entity.ts
│   │   │   └── dto/
│   │   │
│   │   └── intervention/
│   │       ├── intervention.module.ts
│   │       ├── intervention.resolver.ts
│   │       ├── intervention.service.ts
│   │       ├── entities/
│   │       │   └── intervention.entity.ts
│   │       └── dto/
│   │           ├── create-intervention.input.ts
│   │           └── update-intervention.input.ts
│   │
│   └── database/
│       ├── migrations/
│       └── seeds/
│
├── test/
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

### Configuration TypeORM

**src/config/database.config.ts**
```typescript
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'interventions_btp',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
};
```

### Exemple d'Entité TypeORM

**intervention.entity.ts**
```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Projet } from '../../projet/entities/projet.entity';
import { Salarie } from '../../salarie/entities/salarie.entity';
import { Materiel } from '../../materiel/entities/materiel.entity';

@ObjectType()
@Entity()
export class Intervention {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'timestamp' })
  date: Date;

  @Field(() => Float)
  @Column({ type: 'float' })
  duree: number;

  @Field(() => Projet)
  @ManyToOne(() => Projet, (projet) => projet.interventions, { eager: true })
  projet: Projet;

  @Field(() => [Salarie])
  @ManyToMany(() => Salarie, (salarie) => salarie.interventions, { eager: true })
  @JoinTable({ name: 'intervention_salaries' })
  salaries: Salarie[];

  @Field(() => [Materiel])
  @ManyToMany(() => Materiel, (materiel) => materiel.interventions, { eager: true })
  @JoinTable({ name: 'intervention_materiels' })
  materiels: Materiel[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
```

---

## 🎨 Architecture Frontend (Angular)

### Structure des Dossiers

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── services/
│   │   │   │   ├── graphql.service.ts
│   │   │   │   └── auth.service.ts (optionnel)
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   └── models/
│   │   │       ├── client.model.ts
│   │   │       ├── projet.model.ts
│   │   │       ├── salarie.model.ts
│   │   │       ├── materiel.model.ts
│   │   │       └── intervention.model.ts
│   │   │
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   ├── header/
│   │   │   │   ├── sidebar/
│   │   │   │   └── loading/
│   │   │   ├── directives/
│   │   │   └── pipes/
│   │   │
│   │   ├── features/
│   │   │   ├── clients/
│   │   │   │   ├── client-list/
│   │   │   │   ├── client-detail/
│   │   │   │   └── clients.module.ts
│   │   │   │
│   │   │   ├── projets/
│   │   │   │   ├── projet-list/
│   │   │   │   ├── projet-detail/
│   │   │   │   └── projets.module.ts
│   │   │   │
│   │   │   ├── salaries/
│   │   │   │   ├── salarie-list/
│   │   │   │   ├── salarie-planning/    # Planning salarié
│   │   │   │   └── salaries.module.ts
│   │   │   │
│   │   │   ├── materiels/
│   │   │   │   ├── materiel-list/
│   │   │   │   └── materiels.module.ts
│   │   │   │
│   │   │   └── interventions/
│   │   │       ├── intervention-list/
│   │   │       ├── intervention-form/   # Création d'intervention
│   │   │       ├── intervention-detail/
│   │   │       └── interventions.module.ts
│   │   │
│   │   ├── graphql/
│   │   │   ├── queries/
│   │   │   │   ├── clients.queries.ts
│   │   │   │   ├── projets.queries.ts
│   │   │   │   ├── salaries.queries.ts
│   │   │   │   └── interventions.queries.ts
│   │   │   └── mutations/
│   │   │       ├── clients.mutations.ts
│   │   │       ├── projets.mutations.ts
│   │   │       └── interventions.mutations.ts
│   │   │
│   │   ├── app-routing.module.ts
│   │   ├── app.component.ts
│   │   └── app.module.ts
│   │
│   ├── assets/
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   │
│   └── styles.scss
│
├── angular.json
├── package.json
└── tsconfig.json
```

### Configuration Apollo Client

**app.module.ts**
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ApolloModule,
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: 'http://localhost:3000/graphql',
          }),
        };
      },
      deps: [HttpLink],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

### Exemple de Query GraphQL (Angular)

**interventions.queries.ts**
```typescript
import { gql } from 'apollo-angular';

export const GET_PLANNING_SALARIE = gql`
  query GetPlanningSalarie($salarieId: ID!) {
    planningSalarie(salarieId: $salarieId) {
      id
      date
      duree
      projet {
        id
        nom
        client {
          adresse
        }
      }
      salaries {
        id
        nom
        prenom
      }
      materiels {
        id
        designation
      }
    }
  }
`;

export const GET_INTERVENTIONS_BY_PROJET = gql`
  query GetInterventionsByProjet($projetId: ID!) {
    interventionsByProjet(projetId: $projetId) {
      id
      date
      duree
    }
    projet(id: $projetId) {
      id
      nom
      tempsTotal
      tempsRestant
    }
  }
`;
```

---

## 📱 Pages et Composants Principaux

### 1. Page de Création d'Intervention

**Fonctionnalités:**
- Formulaire avec sélection de projet
- Sélection de date et durée
- Multi-sélection de salariés
- Multi-sélection de matériel
- Validation des champs

**Composants:**
- `InterventionFormComponent`
- `ProjetSelectorComponent`
- `SalarieSelectorComponent`
- `MaterielSelectorComponent`

### 2. Planning Salarié

**Fonctionnalités:**
- Sélection d'un salarié
- Affichage calendrier/planning
- Liste des interventions à venir
- Détails de chaque intervention (projet, durée, autres ressources)

**Composants:**
- `SalariePlanningComponent`
- `CalendarViewComponent` (utiliser une lib comme FullCalendar)
- `InterventionCardComponent`

### 3. Tableau de Bord Client

**Fonctionnalités:**
- Sélection d'un projet
- Liste des interventions liées au projet
- Affichage du temps total et temps restant
- Progression visuelle (barre de progression)

**Composants:**
- `ClientDashboardComponent`
- `ProjetProgressComponent`
- `InterventionTimelineComponent`

---

## 🚀 Guide d'Implémentation

### Phase 1: Configuration Initiale (Jour 1)

1. **Setup Backend**
   ```bash
   npm i -g @nestjs/cli
   nest new backend
   cd backend
   npm install @nestjs/graphql @nestjs/apollo graphql apollo-server-express
   npm install @nestjs/typeorm typeorm pg
   npm install class-validator class-transformer
   ```

2. **Setup Frontend**
   ```bash
   ng new frontend
   cd frontend
   npm install apollo-angular @apollo/client graphql
   npm install @angular/material (optionnel pour UI)
   ```

3. **Configuration PostgreSQL**
   - Créer la base de données
   - Exécuter le script de création des tables
   - Configurer les variables d'environnement

### Phase 2: Backend - Entities et Modules (Jour 2-3)

1. Créer toutes les entités TypeORM
2. Créer les modules NestJS (Client, Projet, Salarie, Materiel, Intervention)
3. Implémenter les services avec la logique métier
4. Créer les resolvers GraphQL
5. Tester avec GraphQL Playground

### Phase 3: Backend - Logique Métier (Jour 4)

1. **Service Intervention**
   - Méthode pour créer une intervention avec salariés et matériel
   - Validation des disponibilités (optionnel)
   
2. **Service Salarie**
   - Méthode pour récupérer le planning (interventions futures)
   - Tri par date

3. **Service Projet**
   - Calcul du temps total (somme des durées)
   - Calcul du temps restant (interventions à venir)

### Phase 4: Frontend - Structure et Routing (Jour 5)

1. Créer la structure des modules
2. Configurer le routing
3. Mettre en place Apollo Client
4. Créer les services GraphQL

### Phase 5: Frontend - Composants (Jour 6-8)

1. **Formulaire d'intervention**
   - Reactive Forms
   - Validators
   - Appel mutation GraphQL

2. **Planning Salarié**
   - Intégration FullCalendar ou Angular Calendar
   - Récupération des données via query
   - Affichage en mode calendrier et liste

3. **Dashboard Client**
   - Sélection de projet
   - Affichage progression
   - Liste des interventions

### Phase 6: Tests et Finitions (Jour 9-10)

1. Tests unitaires backend (Jest)
2. Tests E2E frontend (Cypress ou Protractor)
3. Amélioration de l'UI/UX
4. Documentation
5. Déploiement (optionnel)

---

## 📦 Dépendances Principales

### Backend (package.json)

```json
{
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/graphql": "^12.0.0",
    "@nestjs/apollo": "^12.0.0",
    "@nestjs/typeorm": "^10.0.0",
    "typeorm": "^0.3.17",
    "pg": "^8.11.0",
    "graphql": "^16.8.0",
    "apollo-server-express": "^3.12.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1"
  }
}
```

### Frontend (package.json)

```json
{
  "dependencies": {
    "@angular/core": "^17.0.0",
    "@angular/common": "^17.0.0",
    "@angular/forms": "^17.0.0",
    "@angular/router": "^17.0.0",
    "apollo-angular": "^6.0.0",
    "@apollo/client": "^3.8.0",
    "graphql": "^16.8.0",
    "@angular/material": "^17.0.0",
    "@fullcalendar/angular": "^6.1.0" (optionnel)
  }
}
```

---

## 🔒 Sécurisation (Optionnelle)

Si vous décidez d'implémenter la sécurité:

### Backend
- JWT Authentication
- Guards NestJS
- Rôles (Admin, Salarié, Client)

### Frontend
- Auth Guard
- JWT Interceptor
- Login/Logout

**Modules à ajouter:**
```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
```

---

## 🧪 Tests

### Backend (Jest)

```typescript
// intervention.service.spec.ts
describe('InterventionService', () => {
  it('should create an intervention', async () => {
    // Test logique
  });

  it('should calculate remaining time for projet', async () => {
    // Test calcul
  });
});
```

### Frontend (Jasmine/Karma)

```typescript
// intervention-form.component.spec.ts
describe('InterventionFormComponent', () => {
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit valid form', () => {
    // Test soumission
  });
});
```

---

## 📝 Variables d'Environnement

### Backend (.env)

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=interventions_btp

# Server
PORT=3000
NODE_ENV=development

# GraphQL
GRAPHQL_PLAYGROUND=true
```

### Frontend (environment.ts)

```typescript
export const environment = {
  production: false,
  graphqlUrl: 'http://localhost:3000/graphql',
};
```

---

## 🎯 Points d'Attention

### Backend
1. ✅ Utiliser les transactions pour la création d'interventions avec relations
2. ✅ Implémenter la pagination pour les listes longues
3. ✅ Ajouter des validations sur les dates (pas d'intervention dans le passé)
4. ✅ Gérer les erreurs avec des exceptions personnalisées
5. ✅ Documenter le schéma GraphQL

### Frontend
1. ✅ Implémenter un système de loading pour les requêtes
2. ✅ Gérer les erreurs GraphQL avec des messages utilisateur
3. ✅ Optimiser avec les queries/mutations Apollo (cache)
4. ✅ Rendre l'interface responsive
5. ✅ Ajouter des confirmations pour les suppressions

### Base de Données
1. ✅ Créer les index pour optimiser les performances
2. ✅ Utiliser les cascades pour les suppressions
3. ✅ Prévoir des données de seed pour les tests

---

## 🎨 Suggestions UI/UX

### Couleurs (Thème BTP)
- Primaire: Bleu construction (#1976D2)
- Secondaire: Orange sécurité (#FF9800)
- Succès: Vert (#4CAF50)
- Danger: Rouge (#F44336)

### Bibliothèques UI Recommandées
- **Angular Material**: Components Material Design
- **PrimeNG**: Suite complète de composants
- **FullCalendar**: Affichage calendrier professionnel
- **Chart.js / ngx-charts**: Graphiques et visualisations

### Icônes
- Material Icons
- Font Awesome

---

## 📚 Ressources Utiles

### Documentation
- [NestJS](https://docs.nestjs.com/)
- [NestJS GraphQL](https://docs.nestjs.com/graphql/quick-start)
- [TypeORM](https://typeorm.io/)
- [Angular](https://angular.io/docs)
- [Apollo Angular](https://apollo-angular.com/docs/)
- [PostgreSQL](https://www.postgresql.org/docs/)

### Tutoriels
- GraphQL avec NestJS: [nestjs.com/graphql](https://docs.nestjs.com/graphql/quick-start)
- TypeORM Relations: [typeorm.io/relations](https://typeorm.io/relations)
- Apollo Client: [apollographql.com/docs/angular](https://www.apollographql.com/docs/angular/)

---

## ✅ Checklist de Développement

### Backend
- [ ] Configuration NestJS et TypeORM
- [ ] Création des entités
- [ ] Schéma GraphQL complet
- [ ] Resolvers et Services
- [ ] Logique de calcul temps restant
- [ ] Validation des données
- [ ] Tests unitaires
- [ ] Documentation GraphQL

### Frontend
- [ ] Configuration Angular et Apollo
- [ ] Structure des modules
- [ ] Formulaire d'intervention
- [ ] Planning salarié (calendrier)
- [ ] Dashboard client
- [ ] Gestion des erreurs
- [ ] Loading states
- [ ] Responsive design
- [ ] Tests unitaires

### Base de Données
- [ ] Création des tables
- [ ] Relations configurées
- [ ] Index optimisés
- [ ] Données de seed
- [ ] Backup strategy

---

## 🚀 Commandes Rapides

### Backend
```bash
# Démarrage dev
npm run start:dev

# Build production
npm run build

# Tests
npm run test
npm run test:e2e

# Migrations
npm run typeorm migration:generate -- -n MigrationName
npm run typeorm migration:run
```

### Frontend
```bash
# Démarrage dev
ng serve

# Build production
ng build --prod

# Tests
ng test
ng e2e

# Génération composant
ng generate component features/interventions/intervention-form
```

---

## 📊 Estimations

| Phase | Durée Estimée |
|-------|---------------|
| Configuration initiale | 1 jour |
| Backend - Entities et Modules | 2 jours |
| Backend - Logique métier | 1 jour |
| Frontend - Structure | 1 jour |
| Frontend - Composants | 3 jours |
| Tests et finitions | 2 jours |
| **TOTAL** | **10 jours** |

---

## 💡 Améliorations Futures (Post-MVP)

1. **Authentification et Autorisation**
   - JWT + Guards
   - Rôles utilisateurs (Admin, Salarié, Client)

2. **Fonctionnalités Avancées**
   - Notifications par email/SMS
   - Export PDF des plannings
   - Gestion des congés salariés
   - Disponibilité temps réel du matériel
   - Tableau de bord analytique

3. **Performance**
   - Redis pour le cache
   - DataLoader pour éviter N+1 queries
   - Pagination cursor-based

4. **Mobile**
   - Application mobile React Native/Ionic
   - PWA pour accès offline

---

## 📞 Support

Pour toute question sur l'implémentation, référez-vous à ce document ou consultez la documentation officielle des technologies utilisées.

---

**Date de création**: Octobre 2025  
**Version**: 1.0  
**Auteur**: Documentation Projet BTP
