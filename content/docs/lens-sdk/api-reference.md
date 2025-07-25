+++
date = '2025-07-22T05:45:03+02:00'
draft = false
title = 'API Reference'
weight = 5
+++

This document provides a detailed reference for the public API of the Lens SDK, primarily focusing on the `LensService` class. The `LensService` is the sole intended entry point for developers building applications with the SDK.

## `LensService`

The `LensService` class provides a high-level, asynchronous interface for all SDK functionalities. It manages the Peerbit client, the `Site` program lifecycle, and all user-facing operations.

### Constructor

```typescript
new LensService(options?: {
  peerbit?: ProgramClient;
  debug?: boolean;
  customPrefix?: string;
  identity?: Identity<Secp256k1PublicKey>;
})
```

Initializes a new instance of the service.

| Parameter      | Type            | Optional | Description                                                                                             |
|----------------|-----------------|:--------:|---------------------------------------------------------------------------------------------------------|
| `options`      | `object`        | **Yes**  | Configuration for the service instance.                                                                 |
| `options.peerbit`| `ProgramClient` | **Yes**  | An externally managed Peerbit client. If provided, `init()` and `stop()` will not affect its lifecycle. |
| `options.debug`| `boolean`       | **Yes**  | Enables verbose diagnostic logging to the console. Defaults to `false`.                                   |
| `options.customPrefix`| `string` | **Yes**  | Sets a custom prefix for log messages. Defaults to `'[LensService]'`.                                     |
| `options.identity`| `Identity`   | **Yes**  | A custom, user-centric identity (e.g., from a wallet) to use for all signing operations. If omitted, the service uses the Peerbit node's default identity. |

---

## Lifecycle Methods

These methods control the connection to the Peerbit network and the active `Site` program.

### `init()`

```typescript
init(directory?: string): Promise<void>
```

Initializes and starts a new, internally managed Peerbit client. This method must be called before any other operations if the service was not constructed with an external client.

| Parameter   | Type     | Optional | Description                                                                                |
|-------------|----------|:--------:|--------------------------------------------------------------------------------------------|
| `directory` | `string` | **Yes**  | The file system path for storing peer identity and data. If omitted, data is stored in memory. |

### `stop()`

```typescript
stop(): Promise<void>
```

Gracefully shuts down the service, closing the active `Site` and stopping the Peerbit client (if internally managed).

### `openSite()`

```typescript
openSite(
  siteOrAddress: Site | string, 
  options?: { siteArgs?: SiteArgs, federate?: boolean }
): Promise<void>
```

Opens a `Site` program, making it the active context for all subsequent API calls.

| Parameter         | Type                | Optional | Description                                                                                                |
|-------------------|---------------------|:--------:|------------------------------------------------------------------------------------------------------------|
| `siteOrAddress`   | `Site \| string`      | No       | To create a new `Site`, pass a `new Site(rootTrust)` instance. To open an existing one, pass its address.   |
| `options`         | `object`            | **Yes**  | Additional configuration.                                                                                  |
| `options.siteArgs`| `SiteArgs`          | **Yes**  | Advanced configuration for database replication.                                                           |
| `options.federate`| `boolean`           | **Yes**  | If `true`, starts the `FederationManager` for this site to handle subscriptions. Defaults to `true`.        |

---

## Account and Status Methods

Methods for retrieving information about the current user.

### `getAccountStatus()`

```typescript
getAccountStatus(): Promise<AccountStatusResponse>
```

Determines the full permission status of the current **active identity** (custom wallet or default node identity) for the active `Site`. This is the primary method for fetching the necessary information to render a user interface tailored to their capabilities.

```typescript
interface AccountStatusResponse {
  isAdmin: boolean;      // True if the user is a top-level administrator
  roles: string[];       // An array of role names assigned to the user (e.g., ["moderator", "member"])
  permissions: string[]; // A flattened, unique list of all permissions granted by the user's roles
}
```

---

### API Input Types

To simplify interactions, the `LensService` uses two primary input patterns for creating and editing documents.

* **`AddInput<T>`**: This is used for creating new documents (e.g., in `addRelease`). The type `AddInput<T>` is an alias for just `T`. You provide only the core data properties for the document you want to create. The `LensService` is responsible for automatically adding the required `id`, `postedBy`, and `siteAddress` fields.

* **`EditInput<T>`**: This is used for updating existing documents (e.g., in `editRelease`). This type is an alias for `T & ImmutableProps`. You must provide the full data for the document, including the `id`, `postedBy`, and `siteAddress` of the existing document. The service will verify that the immutable properties (`postedBy` and `siteAddress`) have not been changed.

---

## Content Management (Releases)

Methods for creating and managing the primary content type, `Release`.

### `addRelease()`

```typescript
addRelease(data: AddInput<ReleaseData>): Promise<HashResponse>
```

Creates and saves a new `Release` document. Requires the user to have a role with the `release:create` permission (e.g., `Member`, `Moderator`, `Admin`).

| Parameter | Type                | Description                                                                                             |
|-----------|---------------------|---------------------------------------------------------------------------------------------------------|
| `data`    | `AddInput<ReleaseData>` | An object with the release properties (`name`, `categoryId`, etc.). |

### `editRelease()`

```typescript
editRelease(data: EditInput<ReleaseData>): Promise<HashResponse>
```

Updates an existing `Release`. The required permission depends on the action:

* A user with the `release:edit:own` permission can edit a release where they are the `postedBy`.
* A user with the `release:edit:any` permission can edit any release.

| Parameter | Type                | Description                                                                                                                               |
|-----------|---------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| `data`    | `EditInput<ReleaseData>` | The full `Release` data, including the `id` of the document to update. The service will reject the edit if `postedBy` or `siteAddress` are modified. |

Updates an existing `Release`. The `data` object must include the `id`. Requires `ADMIN` privileges.

### `deleteRelease()`

```typescript
deleteRelease(id: string): Promise<IdResponse>
```

Deletes a `Release` by its ID. Requires the `release:delete` permission (e.g., `Moderator`, `Admin`).

### `getRelease()`

```typescript
getRelease(id: string): Promise<WithContext<Release> | undefined>
```

Retrieves a single `Release` by its ID.

### `getReleases()`

```typescript
getReleases(options?: SearchOptions): Promise<WithContext<Release>[]>
```

Retrieves an array of `Release` documents.

---

## Featured Content Management

Methods for managing `FeaturedRelease` entries. These operations require a role with the `featured:manage` permission (e.g., `Moderator`, `Admin`).

### `addFeaturedRelease()`

```typescript
addFeaturedRelease(data: AddInput<FeaturedReleaseData>): Promise<HashResponse>
```

Creates a `FeaturedRelease` to highlight an existing `Release`.

### `editFeaturedRelease()`

```typescript
editFeaturedRelease(data: EditInput<FeaturedReleaseData>): Promise<HashResponse>
```

Updates an existing `FeaturedRelease`. The `id` must be present, and core properties (`postedBy`, `siteAddress`) cannot be changed.

### `deleteFeaturedRelease()`

```typescript
deleteFeaturedRelease(id:string): Promise<IdResponse>
```

Deletes a `FeaturedRelease` by its ID.

*(Methods `getFeaturedRelease` and `getFeaturedReleases` follow the same pattern as their `Release` counterparts.)*

---

## Content Category Management

Methods for managing `ContentCategory` documents. These operations require a role with the `category:manage` permission (e.g., `Moderator`, `Admin`).

### `addContentCategory()`

```typescript
addContentCategory(data: AddInput<ContentCategoryData>): Promise<HashResponse>
```

Creates a new `ContentCategory`. The `categoryId` must be unique.

### `editContentCategory()`

```typescript
editContentCategory(data: EditInput<ContentCategoryData>): Promise<HashResponse>
```

Updates an existing `ContentCategory`. The service will reject the update if immutable fields (`postedBy`, `siteAddress`, `categoryId`) are changed.

### `deleteContentCategory()`

```typescript
deleteContentCategory(id: string): Promise<IdResponse>
```

Deletes a `ContentCategory` by its ID.

### `getContentCategory()`

```typescript
getContentCategory(id: string): Promise<WithContext<ContentCategory> | undefined>
```

Retrieves a single `ContentCategory` by its ID.

### `getContentCategories()`

```typescript
getContentCategories(options?: SearchOptions): Promise<WithContext<ContentCategory>[]>
```

Retrieves an array of all `ContentCategory` documents.

---

## Federation (Subscription) Management

Methods for managing federation relationships. These operations require a role with the `subscription:manage` permission (e.g., `Moderator`, `Admin`).

### `addSubscription()`

```typescript
addSubscription(data: AddInput<SubscriptionData>): Promise<HashResponse>
```

Subscribes to another `Site`, initiating federation.

| Parameter | Type       | Description                                                 |
|-----------|------------|-------------------------------------------------------------|
| `data`    | `AddInput<SubscriptionData>`   | An object with the subscription properties. `SubscriptionData` is `{ to: string }` |

### `deleteSubscription()`

```typescript
deleteSubscription(data: { id?: string; to?: string }): Promise<IdResponse>
```

Unsubscribes from a `Site`, stopping federation and purging its content.

| Parameter | Type     | Description                                                          |
|-----------|----------|----------------------------------------------------------------------|
| `data`    | `object` | An object containing either the subscription `id` or the target site's `to` address to remove. |

### `getSubscriptions()`

```typescript
getSubscriptions(options?: SearchOptions): Promise<Subscription[]>
```

Retrieves a list of all current `Subscription` documents.

## Access Control Management

Methods for managing user permissions on the active `Site`. These operations are privileged and can **only be performed by an Administrator**.

### `addAdmin()`

```typescript
addAdmin(publicKey: string | PublicSignKey): Promise<BaseResponse>
```

Promotes another user to be a full Administrator, adding them to the site's root `TrustedNetwork`.

| Parameter   | Type                   | Description                                                |
|-------------|------------------------|------------------------------------------------------------|
| `publicKey` | `string \| PublicSignKey` | The public key of the user to promote.                     |

### `assignRole()`

```typescript
assignRole(publicKey: string | PublicSignKey, roleId: string): Promise<BaseResponse>
```

Assigns a specific role to a user.

| Parameter   | Type                   | Description                                                                 |
|-------------|------------------------|-----------------------------------------------------------------------------|
| `publicKey` | `string \| PublicSignKey` | The public key of the user.                                                 |
| `roleId`    | `string`               | The string identifier of the role to assign (e.g., `"member"`, `"moderator"`). |

### `revokeRole()`

```typescript
revokeRole(publicKey: string | PublicSignKey, roleId: string): Promise<BaseResponse>
```

Revokes a specific role from a user.

| Parameter   | Type                   | Description                                                                 |
|-------------|------------------------|-----------------------------------------------------------------------------|
| `publicKey` | `string \| PublicSignKey` | The public key of the user.                                                 |
| `roleId`    | `string`               | The string identifier of the role to revoke.                                  |

## Common Response Objects

Most methods in the `LensService` return one of the following standardized response objects to ensure consistent error handling and feedback.

### `BaseResponse`

The simplest response object, indicating only success or failure.

| Field     | Type      | Description                                           |
|-----------|-----------|-------------------------------------------------------|
| `success` | `boolean` | `true` if the operation was successful, otherwise `false`. |
| `error`   | `string`  | An error message if `success` is `false`.               |

### `IdResponse`

Extends `BaseResponse` to include the unique ID of the document that was affected.

| Field | Type     | Description                                               |
|-------|----------|-----------------------------------------------------------|
| `id`  | `string` | The unique identifier of the created or modified document. |
| *(...inherits from `BaseResponse`)* | | |

### `HashResponse`

Extends `IdResponse` to also include the cryptographic hash of the operation's log entry, which can be used for verification.

| Field | Type     | Description                                          |
|-------|----------|------------------------------------------------------|
| `hash`| `string` | The cryptographic hash of the underlying P2P log entry. |
| *(...inherits from `IdResponse`)* | | |
