# Rapport de Projet : Application de Gestion des Interventions BTP

**Établissement :** ESTIAM
**Année Académique :** 2025
**Date :** Octobre 2025
**Projet :** Système de Gestion des Interventions pour Entreprise de BTP

---

## Objectif du Projet

Développement d'une application web de gestion des interventions pour une entreprise de BTP. L'application permet de gérer les clients, projets, salariés, matériel et interventions, avec un système de planification et de suivi.

## Objectifs Fonctionnels Réalisés

L'application répond à trois besoins principaux :

**Gestion des interventions** : Création et planification des interventions avec affectation des salariés et du matériel.

**Planning salariés** : Visualisation chronologique des interventions à venir pour chaque salarié.

**Suivi client** : Affichage du temps total et du temps restant pour chaque projet avec barre de progression visuelle.

## Stack Technique

**Backend :**
- NestJS (framework TypeScript modulaire)
- GraphQL avec Apollo Server (API flexible)
- Prisma (ORM pour PostgreSQL)
- PostgreSQL (base de données)
- JWT + Passport (authentification)
- Bcrypt (hashing des mots de passe)

**Frontend :**
- Angular 20 (composants standalone)
- Apollo Client (client GraphQL)
- RxJS (gestion des flux de données)

## Modèle de Données

Le schéma de base de données comprend 5 entités principales :

**Client** → **Projet** → **Intervention** ← **Salarie** / **Materiel**

**Relations implémentées :**
- Client → Projet (1:N)
- Projet → Intervention (1:N)
- Intervention ↔ Salarie (N:N via table de jointure)
- Intervention ↔ Materiel (N:N via table de jointure)

**Calculs automatiques :**
- Temps total : somme des durées de toutes les interventions d'un projet
- Temps restant : somme des durées des interventions futures

## Travail Réalisé - Backend

**Structure modulaire :**
- Module Auth : inscription, connexion, JWT
- Module Client : CRUD clients
- Module Projet : CRUD projets + calculs temps
- Module Salarie : CRUD salariés + planning
- Module Materiel : CRUD matériel
- Module Intervention : CRUD interventions avec relations N:N

**API GraphQL (code-first) :**
- Queries : récupération de données (listes, détails, plannings)
- Mutations : création, modification, suppression
- Validation automatique avec class-validator
- Types générés automatiquement depuis TypeScript

**Logique métier développée :**
- Calcul dynamique du temps total et restant par projet
- Récupération du planning futur des salariés
- Gestion des relations many-to-many (salariés et matériel par intervention)

## Travail Réalisé - Frontend

**Pages développées :**
- Page d'authentification (login)
- Page d'accueil avec navigation
- Liste clients (CRUD)
- Liste projets (CRUD + vue détail)
- Liste salariés (CRUD)
- Liste matériel (CRUD)
- Liste interventions (CRUD avec sélection multiple)
- Planning salariés (vue chronologique)
- Détail projet (progression visuelle)

**Intégration Apollo Client :**
- Configuration avec middleware JWT automatique
- Services GraphQL typés avec RxJS Observables
- Gestion optimiste de l'état (ajout/suppression sans rechargement)

**Fonctionnalités avancées :**
- Planning salariés : sélection d'un salarié, affichage timeline avec interventions futures
- Détail projet : métriques (temps total/restant), barre de progression, liste des interventions
- Interface adaptée au rôle (ADMIN/USER)

## Sécurité et Contrôle d'Accès

**Authentification JWT :**
- Login/Register avec génération de token JWT
- Token stocké dans localStorage
- Middleware Apollo injecte le token automatiquement
- Mots de passe hashés avec bcrypt

**Système de rôles (RBAC) :**

Deux rôles implémentés : **ADMIN** et **USER**

| Fonctionnalité | ADMIN | USER |
|----------------|-------|------|
| Clients | CRUD complet | Aucun accès |
| Projets | CRUD complet | Aucun accès |
| Salariés | CRUD complet | Aucun accès |
| Matériel | CRUD complet | Aucun accès |
| Interventions | CRUD complet | Lecture seule |
| Planning | Lecture | Lecture |

**Implémentation :**
- Backend : JwtAuthGuard + RolesGuard (guards globaux)
- Backend : Décorateurs @Public() et @Roles(Role.ADMIN)
- Frontend : authGuard + adminGuard (protection des routes)
- Frontend : Affichage conditionnel selon le rôle

## Résultats

**Application fonctionnelle avec :**
- 9 pages frontend complètes
- 5 modules backend avec API GraphQL
- Système d'authentification JWT
- Système de rôles (ADMIN/USER)
- Base de données normalisée avec 5 entités
- Calculs automatiques (temps total/restant)
- Interface responsive et cohérente

## Compétences Développées

- Architecture 3-tiers (frontend/backend/BDD)
- Développement TypeScript full-stack
- API GraphQL (code-first avec NestJS)
- ORM Prisma avec relations complexes
- Authentification JWT et RBAC
- Framework Angular (composants standalone)
- Gestion d'état avec RxJS
- Modélisation de données relationnelles
- Résolution de problèmes techniques

## Conclusion

Application complète de gestion des interventions BTP développée avec des technologies modernes. Le projet démontre la capacité à architecturer une solution full-stack, implémenter un système de sécurité robuste, et créer une interface utilisateur fonctionnelle.

L'architecture modulaire et le code typé facilitent la maintenance et l'évolution future. Les objectifs fonctionnels sont atteints avec des fonctionnalités de gestion, planification et suivi opérationnelles.

---

**Fin du Rapport**
