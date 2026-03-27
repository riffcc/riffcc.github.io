+++
date = '2025-07-22T06:21:22+02:00'
draft = false
title = 'Reference de Site'
weight = 4
+++

### Schemas

Ce document fournit une reference detaillee des schemas de donnees qui constituent un programme `Site`. Comprendre ces schemas est essentiel pour preparer les donnees des appels d'API et pour interpreter les donnees renvoyees par `LensService`.

Tous les objets de donnees soumis a `LensService` pour creation ou modification doivent respecter les structures decrites ci-dessous.

#### Proprietes communes des documents

Bien qu'il n'existe pas de classe de base rigide, la plupart des documents partagent un ensemble de proprietes fondamentales. Lors de la creation d'un nouvel element de contenu, comme une `Release`, les champs `id`, `postedBy` et `siteAddress` sont automatiquement geres par `LensService`.

| Field         | Type                          | Description                                                                                                                                                             |
|---------------|-------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `id`          | `string`                      | Un identifiant unique pour le document. Generalement un UUID genere automatiquement a la creation. Requis lors de la modification d'un document existant.            |
| `postedBy`    | `PublicSignKey` or `Uint8Array` | La cle publique cryptographique de l'identite associee au document. Lors de la creation de contenu, elle est automatiquement definie sur l'utilisateur courant, sauf indication contraire. |
| `siteAddress` | `string`                      | L'adresse unique du `Site` dans lequel ce document a ete cree a l'origine. Elle est toujours definie par le service et reste immuable.                              |

> **Remarque sur l'immutabilite :** les champs `postedBy` et `siteAddress` sont consideres comme immuables. Une fois un document cree, ces valeurs ne peuvent pas etre modifiees via une operation `edit`. Le SDK applique cette regle au niveau du service.

---

#### 1. `Release`

La `Release` est l'objet principal de contenu. Elle represente un element unique publiable, comme un album de musique, une video ou un article.

| Field          | Type     | Required | Description                                                               |
|----------------|----------|:--------:|---------------------------------------------------------------------------|
| `name`         | `string` | **Yes**  | Le titre affiche de la release.                                           |
| `categoryId`   | `string` | **Yes**  | L'`id` de la `ContentCategory` a laquelle cette release appartient, par exemple `"music"`. |
| `contentCID`   | `string` | **Yes**  | L'identifiant de contenu IPFS, ou CID, du ou des fichiers principaux de cette release. |
| `thumbnailCID` | `string` | No       | Le CID IPFS d'une miniature ou image de couverture associee a la release. |
| `metadata`     | `string` | No       | Une chaine JSON contenant des metadonnees supplementaires specifiques a la categorie. |

#### 2. `ContentCategory`

Une `ContentCategory` definit un modele pour un type de contenu, y compris les metadonnees attendues. Elles sont generalement creees par un administrateur de `Site` ou initialisees a partir d'un ensemble par defaut.

| Field          | Type     | Required | Description                                                                                                   |
|----------------|----------|:--------:|---------------------------------------------------------------------------------------------------------------|
| `categoryId`   | `string` | **Yes**  | Un identifiant unique lisible par un humain, par exemple `"movies"` ou `"tv-shows"`. **Ce champ est immuable.** |
| `displayName`  | `string` | **Yes**  | Le nom lisible par un humain pour la categorie, par exemple `"TV Shows"`.                                     |
| `featured`     | `boolean`| No       | Indique si cette categorie doit etre affichee de facon proeminente. La valeur par defaut est `false`.        |
| `description`  | `string` | No       | Une breve explication du type de contenu qui appartient a cette categorie.                                    |
| `metadataSchema`| `string` | No       | Une chaine JSON definissant la structure du champ `metadata` pour les `Releases` de cette categorie. Voir [defaults.ts](https://github.com/riffcc/lens-sdk/blob/main/src/programs/site/defaults.ts) pour des exemples. |

> **Remarque sur l'immutabilite de `categoryId` :** le champ `categoryId` agit comme une "business key" stable. Une fois une categorie creee, cet identifiant ne peut pas etre modifie afin de garantir que toutes les `Releases` qui y sont liees restent valides. Le SDK applique cette regle.

#### 3. `FeaturedRelease`

Une `FeaturedRelease` agit comme une "epingle" ou un raccourci vers une `Release` existante, permettant de la mettre en avant.

| Field       | Type      | Required | Description                                                            |
|-------------|-----------|:--------:|------------------------------------------------------------------------|
| `releaseId` | `string`  | **Yes**  | L'`id` du document `Release` qui est mis en avant.                     |
| `startTime` | `string`  | **Yes**  | Une date-heure ISO 8601 indiquant quand la mise en avant devient active. |
| `endTime`   | `string`  | **Yes**  | Une date-heure ISO 8601 indiquant quand la mise en avant expire.       |
| `promoted`  | `boolean` | **Yes**  | Un indicateur pour appliquer un style ou une priorite supplementaires dans une section promue. |

#### 4. `Subscription`

Une `Subscription` represente une action unilaterale de "suivi", a la base de la federation. Lorsqu'une `Subscription` est creee, le `FederationManager` commence a synchroniser le contenu du `Site` cible.

| Field         | Type     | Required | Description                                                                                               |
|---------------|----------|:--------:|-----------------------------------------------------------------------------------------------------------|
| `to`          | `string` | **Yes**  | L'adresse unique complete du programme `Site` distant auquel on s'abonne.                                 |

>Remarque : l'`id` d'une subscription est genere de facon deterministe a partir d'une combinaison des adresses du site abonne et du site cible afin d'eviter les doublons.

#### 5. `BlockedContent`

Un enregistrement `BlockedContent` est un outil de moderation utilise par les administrateurs de `Site` pour masquer un contenu ou empecher son affichage.

| Field | Type     | Required | Description                                  |
|-------|----------|:--------:|----------------------------------------------|
| `cid` | `string` | **Yes**  | Le CID IPFS du contenu a bloquer.            |

---

Cette reference fournit aux developpeurs les details necessaires pour formater correctement les donnees pour toutes les interactions API. Pour savoir comment creer, recuperer ou gerer des documents avec ces schemas, consultez la [**Reference d'API**](/fr/docs/lens-sdk/api-reference).
