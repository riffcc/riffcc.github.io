+++
date = '2025-07-22T05:45:03+02:00'
draft = false
title = 'Reference d API'
weight = 5
+++

Ce document fournit une reference detaillee de l'API publique du SDK Lens, en se concentrant principalement sur la classe `LensService`. `LensService` est le seul point d'entree prevu pour les developpeurs qui construisent des applications avec le SDK.

## `LensService`

La classe `LensService` fournit une interface asynchrone de haut niveau pour toutes les fonctionnalites du SDK. Elle gere le client Peerbit, le cycle de vie du programme `Site` et toutes les operations exposees aux utilisateurs.

### Constructeur

```typescript
new LensService(options?: {
  peerbit?: ProgramClient;
  debug?: boolean;
  customPrefix?: string;
  identity?: Identity<Secp256k1PublicKey>;
})
```

Initialise une nouvelle instance du service.

| Parameter      | Type            | Optional | Description                                                                                             |
|----------------|-----------------|:--------:|---------------------------------------------------------------------------------------------------------|
| `options`      | `object`        | **Yes**  | Configuration de l'instance de service.                                                                 |
| `options.peerbit`| `ProgramClient` | **Yes**  | Un client Peerbit gere en externe. S'il est fourni, `init()` et `stop()` n'affecteront pas son cycle de vie. |
| `options.debug`| `boolean`       | **Yes**  | Active les journaux de diagnostic detailles dans la console. La valeur par defaut est `false`.         |
| `options.customPrefix`| `string` | **Yes**  | Definit un prefixe personnalise pour les messages de log. La valeur par defaut est `'[LensService]'`.  |
| `options.identity`| `Identity`   | **Yes**  | Une identite personnalisee centree sur l'utilisateur, par exemple depuis un portefeuille, a utiliser pour toutes les signatures. Si elle est omise, le service utilise l'identite par defaut du noeud Peerbit. |

---

## Methodes de cycle de vie

Ces methodes controlent la connexion au reseau Peerbit et au programme `Site` actif.

### `init()`

```typescript
init(directory?: string): Promise<void>
```

Initialise et demarre un nouveau client Peerbit gere en interne. Cette methode doit etre appelee avant toute autre operation si le service n'a pas ete construit avec un client externe.

| Parameter   | Type     | Optional | Description                                                                                |
|-------------|----------|:--------:|--------------------------------------------------------------------------------------------|
| `directory` | `string` | **Yes**  | Chemin du systeme de fichiers pour stocker l'identite pair et les donnees. Si omis, les donnees sont stockees en memoire. |

### `stop()`

```typescript
stop(): Promise<void>
```

Arrete proprement le service en fermant le `Site` actif et en stoppant le client Peerbit, lorsqu'il est gere en interne.

### `openSite()`

```typescript
openSite(
  siteOrAddress: Site | string, 
  options?: { siteArgs?: SiteArgs, federate?: boolean }
): Promise<void>
```

Ouvre un programme `Site` et en fait le contexte actif pour tous les appels API suivants.

| Parameter         | Type                | Optional | Description                                                                                                |
|-------------------|---------------------|:--------:|------------------------------------------------------------------------------------------------------------|
| `siteOrAddress`   | `Site \| string`      | No       | Pour creer un nouveau `Site`, passez une instance `new Site(rootTrust)`. Pour ouvrir un site existant, passez son adresse. |
| `options`         | `object`            | **Yes**  | Configuration supplementaire.                                                                              |
| `options.siteArgs`| `SiteArgs`          | **Yes**  | Configuration avancee de la replication de base de donnees.                                               |
| `options.federate`| `boolean`           | **Yes**  | Si `true`, demarre le `FederationManager` pour ce site afin de gerer les subscriptions. La valeur par defaut est `true`. |

---

## Methodes de compte et d'etat

Methodes permettant de recuperer des informations sur l'utilisateur courant.

### `getAccountStatus()`

```typescript
getAccountStatus(): Promise<AccountStatusResponse>
```

Determine l'etat complet des permissions de l'**identite active** actuelle, identite de portefeuille personnalisee ou identite par defaut du noeud, pour le `Site` actif. C'est la methode principale pour recuperer les informations necessaires au rendu d'une interface adaptee aux capacites de l'utilisateur.

```typescript
interface AccountStatusResponse {
  isAdmin: boolean;      // True if the user is a top-level administrator
  roles: string[];       // An array of role names assigned to the user (e.g., ["moderator", "member"])
  permissions: string[]; // A flattened, unique list of all permissions granted by the user's roles
}
```

---

### Types d'entree API

Pour simplifier les interactions, `LensService` utilise deux principaux modeles d'entree pour creer et modifier des documents.

* **`AddInput<T>`** : utilise pour creer de nouveaux documents, par exemple dans `addRelease`. Le type `AddInput<T>` est simplement un alias de `T`. Vous fournissez uniquement les proprietes de donnees principales du document a creer. `LensService` se charge d'ajouter automatiquement les champs requis `id`, `postedBy` et `siteAddress`.

* **`EditInput<T>`** : utilise pour mettre a jour des documents existants, par exemple dans `editRelease`. Ce type est un alias de `T & ImmutableProps`. Vous devez fournir toutes les donnees du document, y compris `id`, `postedBy` et `siteAddress` du document existant. Le service verifie que les proprietes immuables, `postedBy` et `siteAddress`, n'ont pas ete modifiees.

---

## Gestion du contenu (`Releases`)

Methodes permettant de creer et gerer le type principal de contenu, `Release`.

### `addRelease()`

```typescript
addRelease(data: AddInput<ReleaseData>): Promise<HashResponse>
```

Cree et enregistre un nouveau document `Release`. Necessite un role disposant de la permission `release:create`, par exemple `Member`, `Moderator` ou `Admin`.

| Parameter | Type                | Description                                                                                             |
|-----------|---------------------|---------------------------------------------------------------------------------------------------------|
| `data`    | `AddInput<ReleaseData>` | Objet contenant les proprietes de la release, comme `name`, `categoryId`, etc. |

### `editRelease()`

```typescript
editRelease(data: EditInput<ReleaseData>): Promise<HashResponse>
```

Met a jour une `Release` existante. La permission requise depend de l'action :

* Un utilisateur disposant de la permission `release:edit:own` peut modifier une release dont il ou elle est `postedBy`.
* Un utilisateur disposant de la permission `release:edit:any` peut modifier n'importe quelle release.

| Parameter | Type                | Description                                                                                                                               |
|-----------|---------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| `data`    | `EditInput<ReleaseData>` | Les donnees completes de la `Release`, y compris l'`id` du document a mettre a jour. Le service rejettera la modification si `postedBy` ou `siteAddress` sont modifies. |

Met a jour une `Release` existante. L'objet `data` doit inclure l'`id`. Necessite des privileges `ADMIN`.

### `deleteRelease()`

```typescript
deleteRelease(id: string): Promise<IdResponse>
```

Supprime une `Release` a partir de son identifiant. Necessite la permission `release:delete`, par exemple `Moderator` ou `Admin`.

### `getRelease()`

```typescript
getRelease(id: string): Promise<WithContext<Release> | undefined>
```

Recupere une `Release` unique a partir de son identifiant.

### `getReleases()`

```typescript
getReleases(options?: SearchOptions): Promise<WithContext<Release>[]>
```

Recupere un tableau de documents `Release`.

---

## Gestion du contenu mis en avant

Methodes pour gerer les entrees `FeaturedRelease`. Ces operations necessitent un role disposant de la permission `featured:manage`, par exemple `Moderator` ou `Admin`.

### `addFeaturedRelease()`

```typescript
addFeaturedRelease(data: AddInput<FeaturedReleaseData>): Promise<HashResponse>
```

Cree une `FeaturedRelease` afin de mettre en avant une `Release` existante.

### `editFeaturedRelease()`

```typescript
editFeaturedRelease(data: EditInput<FeaturedReleaseData>): Promise<HashResponse>
```

Met a jour une `FeaturedRelease` existante. L'`id` doit etre present, et les proprietes principales `postedBy` et `siteAddress` ne peuvent pas etre modifiees.

### `deleteFeaturedRelease()`

```typescript
deleteFeaturedRelease(id:string): Promise<IdResponse>
```

Supprime une `FeaturedRelease` a partir de son identifiant.

*(Les methodes `getFeaturedRelease` et `getFeaturedReleases` suivent le meme schema que leurs equivalents pour `Release`.)*

---

## Gestion des categories de contenu

Methodes permettant de gerer les documents `ContentCategory`. Ces operations necessitent un role disposant de la permission `category:manage`, par exemple `Moderator` ou `Admin`.

### `addContentCategory()`

```typescript
addContentCategory(data: AddInput<ContentCategoryData>): Promise<HashResponse>
```

Cree une nouvelle `ContentCategory`. Le champ `categoryId` doit etre unique.

### `editContentCategory()`

```typescript
editContentCategory(data: EditInput<ContentCategoryData>): Promise<HashResponse>
```

Met a jour une `ContentCategory` existante. Le service rejettera la mise a jour si des champs immuables, `postedBy`, `siteAddress` ou `categoryId`, sont modifies.

### `deleteContentCategory()`

```typescript
deleteContentCategory(id: string): Promise<IdResponse>
```

Supprime une `ContentCategory` a partir de son identifiant.

### `getContentCategory()`

```typescript
getContentCategory(id: string): Promise<WithContext<ContentCategory> | undefined>
```

Recupere une `ContentCategory` unique a partir de son identifiant.

### `getContentCategories()`

```typescript
getContentCategories(options?: SearchOptions): Promise<WithContext<ContentCategory>[]>
```

Recupere un tableau de tous les documents `ContentCategory`.

---

## Gestion de la federation (`Subscription`)

Methodes permettant de gerer les relations de federation. Ces operations necessitent un role disposant de la permission `subscription:manage`, par exemple `Moderator` ou `Admin`.

### `addSubscription()`

```typescript
addSubscription(data: AddInput<SubscriptionData>): Promise<HashResponse>
```

S'abonne a un autre `Site`, ce qui declenche la federation.

| Parameter | Type       | Description                                                 |
|-----------|------------|-------------------------------------------------------------|
| `data`    | `AddInput<SubscriptionData>`   | Objet contenant les proprietes de subscription. `SubscriptionData` vaut `{ to: string }`. |

### `deleteSubscription()`

```typescript
deleteSubscription(data: { id?: string; to?: string }): Promise<IdResponse>
```

Se desabonne d'un `Site`, stoppe la federation et purge son contenu.

| Parameter | Type     | Description                                                          |
|-----------|----------|----------------------------------------------------------------------|
| `data`    | `object` | Objet contenant soit l'`id` de la subscription, soit l'adresse `to` du site cible a supprimer. |

### `getSubscriptions()`

```typescript
getSubscriptions(options?: SearchOptions): Promise<Subscription[]>
```

Recupere la liste de tous les documents `Subscription` actuels.

## Gestion du controle d'acces

Methodes pour gerer les permissions des utilisateurs sur le `Site` actif. Ces operations sont privilegiees et **ne peuvent etre effectuees que par un Administrator**.

### `addAdmin()`

```typescript
addAdmin(publicKey: string | PublicSignKey): Promise<BaseResponse>
```

Promouvoit un autre utilisateur au rang d'Administrator complet en l'ajoutant au `TrustedNetwork` racine du site.

| Parameter   | Type                   | Description                                                |
|-------------|------------------------|------------------------------------------------------------|
| `publicKey` | `string \| PublicSignKey` | Cle publique de l'utilisateur a promouvoir.                |

### `assignRole()`

```typescript
assignRole(publicKey: string | PublicSignKey, roleId: string): Promise<BaseResponse>
```

Attribue un role specifique a un utilisateur.

| Parameter   | Type                   | Description                                                                 |
|-------------|------------------------|-----------------------------------------------------------------------------|
| `publicKey` | `string \| PublicSignKey` | Cle publique de l'utilisateur.                                              |
| `roleId`    | `string`               | Identifiant texte du role a attribuer, par exemple `"member"` ou `"moderator"`. |

### `revokeRole()`

```typescript
revokeRole(publicKey: string | PublicSignKey, roleId: string): Promise<BaseResponse>
```

Retire un role specifique a un utilisateur.

| Parameter   | Type                   | Description                                                                 |
|-------------|------------------------|-----------------------------------------------------------------------------|
| `publicKey` | `string \| PublicSignKey` | Cle publique de l'utilisateur.                                              |
| `roleId`    | `string`               | Identifiant texte du role a revoquer.                                       |

## Objets de reponse courants

La plupart des methodes de `LensService` renvoient l'un des objets de reponse standardises suivants afin de garantir une gestion des erreurs et un retour coherents.

### `BaseResponse`

L'objet de reponse le plus simple, indiquant seulement le succes ou l'echec.

| Field     | Type      | Description                                           |
|-----------|-----------|-------------------------------------------------------|
| `success` | `boolean` | `true` si l'operation a reussi, sinon `false`.        |
| `error`   | `string`  | Message d'erreur si `success` vaut `false`.           |

### `IdResponse`

Etend `BaseResponse` pour inclure l'identifiant unique du document affecte.

| Field | Type     | Description                                               |
|-------|----------|-----------------------------------------------------------|
| `id`  | `string` | Identifiant unique du document cree ou modifie.           |
| *(...inherits from `BaseResponse`)* | | |

### `HashResponse`

Etend `IdResponse` afin d'inclure egalement le hachage cryptographique de l'entree de journal de l'operation, qui peut servir a la verification.

| Field | Type     | Description                                          |
|-------|----------|------------------------------------------------------|
| `hash`| `string` | Hachage cryptographique de l'entree du log P2P sous-jacent. |
| *(...inherits from `IdResponse`)* | | |
