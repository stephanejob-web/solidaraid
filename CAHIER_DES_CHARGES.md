# Cahier des Charges — Application d'Entraide Solidaire

**Nom provisoire :** SolidarAid
**Version :** 1.1
**Date :** 17 avril 2026
**Stack :** React + Express.js + MySQL
**Approche design :** Mobile First — l'application est conçue en priorité pour les smartphones

---

## Sommaire

1. [Présentation du projet](#1-présentation-du-projet)
2. [Acteurs](#2-acteurs)
3. [Fonctionnalités](#3-fonctionnalités)
4. [Règles métier](#4-règles-métier)
5. [Sécurité et confiance](#5-sécurité-et-confiance)
6. [Lien avec les services d'urgence](#6-lien-avec-les-services-durgence)
7. [Dons proactifs et matching](#7-dons-proactifs-et-matching)
8. [Design Mobile First](#8-design-mobile-first)
9. [Accessibilité et multilinguisme](#9-accessibilité-et-multilinguisme)
10. [Aspects légaux et RGPD](#10-aspects-légaux-et-rgpd)
11. [Modèle de données](#11-modèle-de-données)
12. [Stack technique](#12-stack-technique)
13. [Phases de développement](#13-phases-de-développement)
14. [Points à décider](#14-points-à-décider)

---

## 1. Présentation du projet

### Contexte

Lorsqu'une personne croise quelqu'un dans le besoin dans la rue (sans nourriture, sans vêtements adaptés, sans abri), elle se retrouve souvent démunie et ne sait pas comment l'aider efficacement. SolidarAid est une application qui permet de mobiliser rapidement la communauté locale pour répondre à ces besoins immédiats.

### Objectif principal

Mettre en relation en temps réel :
- des **signalants** (personnes qui identifient un besoin)
- des **donateurs** (personnes qui ont des objets à donner)
- des **bénévoles** (personnes prêtes à se déplacer pour aider)

### Objectifs secondaires

- Créer un réseau de solidarité de proximité
- Compléter l'action des associations existantes (sans les remplacer)
- Garantir la dignité des bénéficiaires
- Offrir de la transparence sur les aides réalisées

---

## 2. Acteurs

| Acteur | Description | Compte requis |
|---|---|---|
| **Signalant** | Observe une personne dans le besoin et crée un signalement | Oui |
| **Donateur** | Possède des objets à donner en réponse à un besoin | Oui |
| **Bénévole livreur** | Se déplace pour apporter l'aide sur place | Oui |
| **Donateur proactif** | Publie des objets disponibles sans attendre un besoin | Oui |
| **Association partenaire** | Structure officielle (Croix-Rouge, Secours Pop...) avec compte professionnel | Oui (vérifié) |
| **Bénéficiaire** | La personne dans le besoin — ne nécessite aucun compte | Non |
| **Administrateur** | Modère les contenus, gère les utilisateurs et les statistiques | Oui (back-office) |

---

## 3. Fonctionnalités

### 3.1 Authentification et profil

- Inscription par email / mot de passe
- Connexion Google OAuth (optionnel)
- Vérification email obligatoire à l'inscription
- Vérification numéro de téléphone pour renforcer la confiance
- Profil utilisateur :
  - Nom, photo de profil
  - Ville / zone d'action (rayon en km)
  - Score de réputation (basé sur les notations reçues)
  - Historique des aides données et signalements créés
  - Badge "Compte vérifié" si téléphone confirmé
- Suppression de compte avec effacement de toutes les données (RGPD)

---

### 3.2 Création d'un signalement (besoin)

**Informations saisies :**

| Champ | Type | Obligatoire |
|---|---|---|
| Catégorie du besoin | Liste déroulante | Oui |
| Sous-catégorie / détail | Texte libre ou liste | Oui |
| Taille / pointure (vêtements) | Sélecteur | Non |
| Quantité | Nombre | Non |
| Description libre | Textarea | Non |
| Photo de l'objet demandé | Upload image | Non |
| Localisation | GPS automatique ou saisie | Oui |
| Niveau d'urgence | Faible / Modérée / Urgente | Oui |
| La personne est-elle un mineur ? | Checkbox | Non |

**Catégories disponibles :**
- Nourriture / eau
- Vêtements (manteau, pantalon, chaussures, chaussettes, ceinture, sous-vêtements...)
- Hygiène (savon, shampooing, rasoir, serviettes...)
- Médicaments / soins de base
- Abri / hébergement d'urgence
- Transport / déplacement
- Accompagnement (rendez-vous médical, démarches administratives)
- Autre (champ libre)

**Règles automatiques :**
- Le signalement expire après 48h sans activité
- Si la personne signalée est un mineur, une alerte spéciale est envoyée à l'administrateur
- L'app détecte les doublons (même zone géographique dans les 30 minutes) et propose une fusion

---

### 3.3 Confirmation de présence

- Bouton **"Je confirme, la personne est encore là"** pour mettre à jour le signalement
- Relance automatique toutes les 6h : "La personne est-elle toujours à cet endroit ?"
- Si pas de réponse après 12h → statut passe à "À confirmer"
- Si pas de réponse après 24h → statut passe à "Expiré"

---

### 3.4 Flux de signalements (Feed)

**Affichage :**
- Liste des signalements proches, triés par distance puis urgence
- Carte interactive (Leaflet.js + OpenStreetMap)
- Chaque signalement affiche : catégorie, urgence, distance, temps écoulé, nombre de répondants

**Filtres disponibles :**
- Catégorie
- Distance maximale (1km / 5km / 10km / 20km)
- Niveau d'urgence
- Statut (Ouvert / En cours / Résolu)
- Date de création

**Recherche :**
- Par mot-clé dans la description
- Par adresse ou quartier

---

### 3.5 Réponse à un signalement

Quand un utilisateur consulte un signalement ouvert, il peut choisir :

| Action | Description |
|---|---|
| **"J'ai cet objet à donner"** | Je propose l'objet, le signalant vient le chercher chez moi ou en point relais |
| **"Je peux l'apporter sur place"** | Je me déplace jusqu'à l'endroit du signalement |
| **"Je suis déjà sur place"** | Je suis à proximité immédiate, je peux agir maintenant |
| **"Je contacte une association"** | Je transmets le signalement à une structure partenaire |

- Un utilisateur ne peut répondre qu'une seule fois par signalement
- Le signalant voit toutes les réponses et peut en **accepter une ou plusieurs**
- Les autres répondants sont notifiés si le besoin est déjà couvert

---

### 3.6 Dons proactifs

- Un utilisateur peut publier un objet disponible **sans qu'un besoin existe**
- Champs : catégorie, description, photo, taille/pointure, état (neuf / bon état / usagé), mode de remise (sur place / livraison)
- L'objet reste disponible jusqu'à ce qu'il soit réclamé ou retiré par le donateur
- **Matching automatique** : quand un signalement est créé, l'app notifie les donateurs qui ont un objet correspondant dans un rayon défini

---

### 3.7 Messagerie interne

- Chat privé entre le signalant et chaque répondant
- Aucun numéro de téléphone exposé publiquement
- Partage de position optionnel pour faciliter la rencontre
- Suggestions de lieux de remise publics (café, mairie, bibliothèque) à proximité
- Historique des messages conservé 30 jours après résolution

---

### 3.8 Notifications

| Événement | Destinataire | Canal |
|---|---|---|
| Nouveau signalement dans ma zone | Utilisateurs proches | Push + In-app |
| Quelqu'un répond à mon signalement | Signalant | Push + Email |
| Ma réponse est acceptée | Répondant | Push |
| Signalement sans réponse depuis 4h (urgence) | Utilisateurs proches | Push |
| Confirmation de présence demandée | Signalant | Push + Email |
| Alerte grand froid (< 0°C) | Tous les utilisateurs actifs | Push |
| Don proactif correspond à un nouveau besoin | Donateur | Push |

---

### 3.9 Résolution et notation

- Le signalant marque le besoin comme **"Résolu"** avec un commentaire optionnel et une photo optionnelle
- Confirmation par le bénévole/donateur qui a aidé
- **Notation mutuelle** (1 à 5 étoiles + commentaire) :
  - Le signalant note le donateur/bénévole
  - Le donateur/bénévole note le signalant
- La notation est anonyme et visible sur le profil
- Un score moyen inférieur à 2/5 après 10 notations déclenche une vérification admin

---

### 3.10 Associations partenaires

- **Compte professionnel vérifié** avec badge officiel
- Fonctionnalités supplémentaires :
  - Planifier des **tournées de distribution** (date, heure, lieu, objets disponibles)
  - Inviter des bénévoles à rejoindre une tournée
  - Gérer un **stock associatif** (inventaire des ressources disponibles)
  - Accès à des statistiques avancées sur leur zone d'intervention
- Les signalements peuvent être **transmis** à une association partenaire par les utilisateurs

---

### 3.11 Administration (back-office)

- Dashboard avec statistiques en temps réel :
  - Nombre de signalements créés / résolus / expirés
  - Zones géographiques les plus actives
  - Catégories les plus fréquentes
  - Nombre d'utilisateurs actifs
- Modération :
  - File d'attente des signalements signalés
  - Gestion des utilisateurs (avertissement, suspension, bannissement)
  - Alertes automatiques (mineur signalé, score faible, compte suspect)
- Gestion des associations partenaires (validation, révocation)
- Export des données en CSV/PDF

---

## 4. Règles métier

| Règle | Détail |
|---|---|
| Expiration automatique | Un signalement expire après 48h sans activité (confirmation ou réponse) |
| Limite de signalements | Maximum 5 signalements actifs simultanément par utilisateur |
| Doublons | Deux signalements dans un rayon de 100m en moins de 30min → proposition de fusion |
| Réouverture | Un signalement résolu peut être rouvert dans les 24h si le besoin persiste |
| Dignité | Il est interdit de photographier les personnes dans le besoin — la photo doit montrer l'objet uniquement |
| Localisation floue | La position exacte du bénéficiaire n'est jamais affichée publiquement (rayon de 100m minimum) |
| Mineur | Tout signalement impliquant un mineur déclenche une alerte admin immédiate |
| Inactivité | Un compte sans connexion depuis 6 mois est archivé (données anonymisées) |

---

## 5. Sécurité et confiance

### Vérification des utilisateurs
- Email vérifié obligatoire
- Numéro de téléphone (optionnel mais affiche un badge "Vérifié")
- Score de réputation visible sur le profil

### Protection contre les fraudes
- Signalement d'un contenu abusif (faux besoin, escroquerie)
- Limite de signalements actifs simultanément
- Analyse comportementale : trop de signalements non résolus → alerte admin
- Délai de 24h avant de pouvoir créer un premier signalement après inscription

### Sécurité lors des rencontres physiques
- Conseils de sécurité affichés avant toute remise (lieu public, ne pas y aller seul la nuit...)
- Suggestions automatiques de lieux de remise sécurisés à proximité
- Signalement d'incident après une rencontre

### Protection des mineurs
- Signalement immédiat à l'administrateur
- Bouton de contact direct vers le 119 (Enfance en danger)
- Aucune mise en relation directe sans validation admin

---

## 6. Lien avec les services d'urgence

- **Bouton "Appeler le 115"** (SAMU Social) accessible depuis tout signalement
- **Bouton "Appeler le 119"** visible en cas de signalement impliquant un mineur
- **Bouton "Appeler le 15"** si la personne semble en danger vital
- **Annuaire des ressources locales** intégré :
  - Centres d'hébergement d'urgence
  - Banques alimentaires
  - Vestiaires solidaires
  - Points d'eau potable
  - Bornes de recharge téléphone
- **Alerte grand froid** automatique basée sur la météo locale :
  - Signalements d'urgence automatiquement remontés en priorité
  - Notification à tous les utilisateurs dans la zone concernée

---

## 7. Dons proactifs et matching

### Publication d'un don
- L'utilisateur publie un objet disponible depuis son profil
- Champs : catégorie, description, photo, taille, état, mode de remise
- Durée de disponibilité : 7 jours renouvelables

### Matching automatique
| Événement | Action |
|---|---|
| Nouveau signalement créé | Recherche de dons disponibles correspondants dans un rayon de 20km |
| Résultat trouvé | Notification au signalant ET au donateur |
| Don réclamé | Statut passe à "Réservé" puis "Donné" |

### Historique des dons
- Chaque utilisateur a un compteur public de dons réalisés
- Page "Transparence" : statistiques globales anonymisées

---

## 8. Design Mobile First

### Principe fondamental

> L'utilisateur principal est une personne qui marche dans la rue avec uniquement son téléphone.
> Chaque écran, chaque action, chaque interaction est conçue pour être utilisable **d'une seule main, debout, en mouvement**.

---

### Contraintes de conception

| Contrainte | Exigence |
|---|---|
| **Taille des boutons** | Minimum 48x48px — utilisables avec le pouce |
| **Formulaires courts** | Maximum 3 à 4 champs visibles à l'écran en même temps |
| **Navigation** | Barre de navigation fixe en bas de l'écran (zone de confort du pouce) |
| **Actions critiques** | Créer un signalement accessible en 2 taps maximum depuis l'écran d'accueil |
| **Lisibilité** | Taille de police minimum 16px — lisible en plein soleil |
| **Contraste** | Ratio minimum 4.5:1 — visible en extérieur avec luminosité forte |
| **Chargement** | Écrans opérationnels en moins de 3 secondes sur 4G |
| **Scroll** | Éviter les menus cachés ou les interactions complexes (hover, double-clic) |

---

### Points d'attention UX mobile

- **Géolocalisation en un tap** : pas de saisie d'adresse manuelle obligatoire
- **Photo rapide** : accès direct à l'appareil photo sans quitter l'app
- **Pas de popups intrusives** : les alertes et confirmations utilisent des bottom sheets (tiroirs depuis le bas)
- **Retour arrière clair** : chaque écran a un bouton de retour visible
- **Mode portrait prioritaire** : l'app fonctionne parfaitement en portrait, le paysage est supporté mais secondaire
- **Feedback tactile** : vibration courte sur les actions importantes (signalement créé, réponse envoyée)
- **Icônes + texte** : jamais d'icône seule sans libellé — l'utilisateur ne doit pas deviner

---

### Breakpoints responsive

| Taille | Usage |
|---|---|
| < 480px | Téléphone (priorité absolue) |
| 480px – 768px | Grand téléphone / petite tablette |
| 768px – 1024px | Tablette |
| > 1024px | Desktop (administration, consultation) |

---

### PWA (Progressive Web App)

L'application sera une **PWA** pour éviter le passage par les stores et permettre une installation directe depuis le navigateur :

- Installable sur l'écran d'accueil du téléphone (icône, splash screen)
- Notifications push sans application native
- Fonctionnement partiel hors-ligne (cache des signalements récents)
- Mise à jour automatique sans action de l'utilisateur
- Compatible iOS (Safari) et Android (Chrome)

---

## 9. Accessibilité et multilinguisme

### Langues supportées (Phase 1)
- Français
- Anglais

### Langues prévues (Phase 2)
- Arabe
- Roumain
- Espagnol

### Accessibilité WCAG 2.1 niveau AA
- Contrastes suffisants
- Taille de police ajustable
- Compatible lecteurs d'écran (aria-labels)
- Navigation clavier complète

### Mode simplifié
- Interface épurée avec grandes icônes pour les utilisateurs peu à l'aise avec le numérique
- Textes courts et clairs, sans jargon

### Mode hors-ligne partiel
- Consultation des signalements récents mis en cache
- Création d'un brouillon de signalement (envoyé dès retour de connexion)

---

## 9. Aspects légaux et RGPD

### Données collectées

| Donnée | Utilisation | Conservation |
|---|---|---|
| Email | Authentification, notifications | Durée du compte |
| Téléphone | Vérification (optionnel) | Durée du compte |
| Localisation | Affichage de la carte (floue, 100m) | Non stockée après expiration du signalement |
| Photos | Illustration du signalement | 30 jours après résolution |
| Messages | Coordination entre utilisateurs | 30 jours après résolution |
| Notations | Score de réputation | Durée du compte |

### Droits des utilisateurs
- Droit d'accès à ses données
- Droit de rectification
- Droit à l'effacement (suppression de compte avec anonymisation de l'historique)
- Droit à la portabilité (export JSON de ses données)
- Droit d'opposition au traitement

### Documents obligatoires
- Conditions Générales d'Utilisation (CGU)
- Politique de confidentialité
- Politique relative aux cookies
- Déclaration CNIL si nécessaire
- Mentions légales

### Responsabilité
- L'application est un intermédiaire technique
- Clause de non-responsabilité sur la qualité des dons et le déroulement des remises
- Les utilisateurs s'engagent à respecter la charte de bonne conduite à l'inscription

---

## 10. Modèle de données

```sql
-- Utilisateurs
users
  id              INT PK AUTO_INCREMENT
  name            VARCHAR(100)
  email           VARCHAR(150) UNIQUE
  password        VARCHAR(255)
  phone           VARCHAR(20)
  phone_verified  BOOLEAN DEFAULT FALSE
  email_verified  BOOLEAN DEFAULT FALSE
  avatar          VARCHAR(255)
  reputation      DECIMAL(3,2) DEFAULT 5.00
  role            ENUM('user', 'association', 'admin') DEFAULT 'user'
  zone_radius_km  INT DEFAULT 10
  is_active       BOOLEAN DEFAULT TRUE
  created_at      TIMESTAMP
  last_login      TIMESTAMP

-- Signalements
alerts
  id              INT PK AUTO_INCREMENT
  user_id         INT FK → users.id
  category        ENUM('food', 'clothing', 'hygiene', 'medical', 'shelter', 'transport', 'support', 'other')
  description     TEXT
  photo_url       VARCHAR(255)
  latitude        DECIMAL(10,7)
  longitude       DECIMAL(10,7)
  urgency         ENUM('low', 'medium', 'high')
  status          ENUM('open', 'in_progress', 'resolved', 'expired', 'to_confirm')
  involves_minor  BOOLEAN DEFAULT FALSE
  expires_at      TIMESTAMP
  resolved_at     TIMESTAMP
  created_at      TIMESTAMP

-- Détail des objets dans un signalement
alert_items
  id              INT PK AUTO_INCREMENT
  alert_id        INT FK → alerts.id
  item_type       VARCHAR(100)
  size            VARCHAR(20)
  quantity        INT DEFAULT 1

-- Réponses à un signalement
responses
  id              INT PK AUTO_INCREMENT
  alert_id        INT FK → alerts.id
  user_id         INT FK → users.id
  type            ENUM('give', 'deliver', 'onsite', 'association')
  status          ENUM('pending', 'accepted', 'completed', 'cancelled')
  created_at      TIMESTAMP

-- Dons proactifs
donations
  id              INT PK AUTO_INCREMENT
  user_id         INT FK → users.id
  category        ENUM(...)
  description     TEXT
  photo_url       VARCHAR(255)
  size            VARCHAR(20)
  condition       ENUM('new', 'good', 'used')
  delivery_mode   ENUM('pickup', 'delivery')
  status          ENUM('available', 'reserved', 'given')
  expires_at      TIMESTAMP
  created_at      TIMESTAMP

-- Messages
messages
  id              INT PK AUTO_INCREMENT
  alert_id        INT FK → alerts.id
  sender_id       INT FK → users.id
  receiver_id     INT FK → users.id
  content         TEXT
  is_read         BOOLEAN DEFAULT FALSE
  created_at      TIMESTAMP

-- Notations
ratings
  id              INT PK AUTO_INCREMENT
  rater_id        INT FK → users.id
  rated_id        INT FK → users.id
  alert_id        INT FK → alerts.id
  score           TINYINT (1 à 5)
  comment         TEXT
  created_at      TIMESTAMP

-- Ressources locales
local_resources
  id              INT PK AUTO_INCREMENT
  name            VARCHAR(150)
  type            ENUM('shelter', 'food', 'clothing', 'medical', 'water', 'phone_charge')
  address         TEXT
  phone           VARCHAR(20)
  latitude        DECIMAL(10,7)
  longitude       DECIMAL(10,7)
  schedule        TEXT
  verified        BOOLEAN DEFAULT FALSE

-- Tournées associatives
tours
  id              INT PK AUTO_INCREMENT
  association_id  INT FK → users.id
  title           VARCHAR(150)
  description     TEXT
  scheduled_at    TIMESTAMP
  location        TEXT
  latitude        DECIMAL(10,7)
  longitude       DECIMAL(10,7)
  max_volunteers  INT
  created_at      TIMESTAMP

-- Participants à une tournée
tour_participants
  id              INT PK AUTO_INCREMENT
  tour_id         INT FK → tours.id
  user_id         INT FK → users.id
  status          ENUM('registered', 'confirmed', 'attended', 'absent')
  created_at      TIMESTAMP

-- Signalements abusifs
reports
  id              INT PK AUTO_INCREMENT
  reporter_id     INT FK → users.id
  alert_id        INT FK → alerts.id
  reason          TEXT
  status          ENUM('pending', 'reviewed', 'resolved')
  created_at      TIMESTAMP
```

---

## 11. Stack technique

| Couche | Technologie | Justification |
|---|---|---|
| Front-end | React 18 + Vite | Rapide, écosystème riche |
| Style | Tailwind CSS (Mobile First) | Classes responsive mobile-first intégrées |
| Carte | Leaflet.js + OpenStreetMap | Gratuit, open source |
| Back-end | Express.js (Node.js) | Simple, performant, JS full-stack |
| Base de données | MySQL 8 + Sequelize ORM | Relationnel, bien adapté au modèle |
| Temps réel | Socket.io | Notifications et feed en live |
| Authentification | JWT + bcrypt | Standard sécurisé |
| Upload photos | Multer + stockage local ou Cloudinary | Gestion simple des fichiers |
| Emails | Nodemailer + SMTP | Notifications et vérification email |
| Internationalisation | i18next | Multi-langues |
| Déploiement | Docker Compose | Portabilité et simplicité |
| Tests | Jest + Supertest | Tests unitaires et API |

---

## 12. Phases de développement

### Phase 1 — MVP (6 semaines)
**Objectif : avoir une application fonctionnelle de bout en bout**

- [ ] Authentification (inscription, connexion, vérification email)
- [ ] Création et consultation de signalements
- [ ] Carte interactive avec géolocalisation
- [ ] Réponse à un signalement
- [ ] Messagerie interne basique
- [ ] Résolution d'un signalement
- [ ] Notifications in-app (Socket.io)

---

### Phase 2 — Consolidation (4 semaines)
**Objectif : fiabilité et expérience utilisateur**

- [ ] Système de notation
- [ ] Notifications push (PWA)
- [ ] Dons proactifs + matching automatique
- [ ] Confirmation de présence / expiration automatique
- [ ] Détection de doublons
- [ ] Alerte grand froid
- [ ] Liens vers services d'urgence (115, 119)

---

### Phase 3 — Communauté (4 semaines)
**Objectif : engagement et confiance**

- [ ] Dashboard admin + modération
- [ ] Compte association partenaire
- [ ] Tournées bénévoles
- [ ] Statistiques publiques (page transparence)
- [ ] Signalement de contenu abusif
- [ ] Multilinguisme (EN + AR)
- [ ] Accessibilité WCAG 2.1

---

### Phase 4 — Croissance (à définir)
**Objectif : passage à l'échelle**

- [ ] Application mobile React Native
- [ ] Annuaire des ressources locales
- [ ] Stock associatif
- [ ] Partage sur réseaux sociaux
- [ ] API ouverte pour intégration partenaires
- [ ] Mode hors-ligne partiel
- [ ] Mode simplifié (grande police, interface épurée)

---

## 13. Points à décider

| # | Question | Options | Recommandation |
|---|---|---|---|
| 1 | PWA ou application mobile native ? | PWA (React) / React Native | PWA pour commencer, moins coûteux |
| 2 | Modération des contenus | Manuelle / Semi-automatique / IA | Manuelle en phase 1, semi-auto ensuite |
| 3 | Anonymat du bénéficiaire | Aucune donnée collectée ? | Oui, recommandé pour la dignité |
| 4 | Associations partenaires dès le MVP ? | Oui / Non | Non, prévoir en Phase 3 |
| 5 | Modèle économique | Associatif / Dons / Subventions | Associatif à but non lucratif |
| 6 | Zones de lancement | 1 ville pilote / Régional / National | 1 ville pilote (moins de risques) |
| 7 | Hébergement | VPS (OVH, Scaleway) / Cloud (AWS, GCP) | VPS pour maîtriser les coûts |
| 8 | Nom définitif de l'application | SolidarAid / MainTendue / ProcheSolidaire | À définir avec l'équipe |

---

*Document rédigé le 17 avril 2026 — Version 1.0*
*À mettre à jour à chaque évolution majeure du projet*
