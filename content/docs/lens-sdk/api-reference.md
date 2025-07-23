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
})
```

Initializes a new instance of the service.

#### Parameters

| Parameter      | Type            | Optional | Description                                                                                             |
|----------------|-----------------|:--------:|---------------------------------------------------------------------------------------------------------|
| `options`      | `object`        | **Yes**  | Configuration for the service instance.                                                                 |
| `options.peerbit`| `ProgramClient` | **Yes**  | An externally managed Peerbit client. If provided, `init()` and `stop()` will not affect its lifecycle. |
| `options.debug`| `boolean`       | **Yes**  | Enables verbose diagnostic logging to the console. Defaults to `false`.                                   |
| `options.customPrefix`| `string` | **Yes**  | Sets a custom prefix for log messages. Defaults to `'[LensService]'`.                                     |

---

## Lifecycle Methods

These methods control the connection to the Peerbit network and the active `Site` program.

### `init()`

```typescript
init(directory?: string): Promise<void>
```

Initializes and starts a new, internally managed Peerbit client. This method must be called before any other operations if the service was not constructed with an external client.

#### Parameters

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

#### Parameters

| Parameter         | Type                | Optional | Description                                                                                                |
|-------------------|---------------------|:--------:|------------------------------------------------------------------------------------------------------------|
| `siteOrAddress`   | `Site \| string`      | No       | To create a new `Site`, pass a `new Site(rootTrust)` instance. To open an existing one, pass its address.   |
| `options`         | `object`            | **Yes**  | Additional configuration.                                                                                  |
| `options.siteArgs`| `SiteArgs`          | **Yes**  | Advanced configuration for database replication.                                                           |
| `options.federate`| `boolean`           | **Yes**  | If `true`, starts the `FederationManager` for this site to handle subscriptions. Defaults to `true`.        |

---

## Account and Status Methods

Methods for retrieving information about the current user and `Site`.

### `getAccountStatus()`

```typescript
getAccountStatus(options?: { cached?: boolean }): Promise<AccountType>
```

Determines the permission level of the current user (`ADMIN`, `MEMBER`, or `GUEST`) for the active `Site`.

#### Parameters

| Parameter         | Type      | Optional | Description                                                                                  |
|-------------------|-----------|:--------:|----------------------------------------------------------------------------------------------|
| `options`         | `object`  | **Yes**  | Configuration options.                                                                       |
| `options.cached`  | `boolean` | **Yes**  | If `true`, may return a cached result for performance. Defaults to `true`. Set to `false` for a fresh check. |

#### Returns

A `Promise` that resolves to an `AccountType` enum value.

---

### API Input Types

To simplify interactions, the `LensService` uses two primary input patterns for creating and editing documents.

* `AddInput<T>`: Used for creating new documents (e.g., `addRelease`). You only need to provide the core data for the document type `T`. The `siteAddress` is always handled by the service. The `postedBy` field is optional; if omitted, it defaults to the service's current identity.
* `EditInput<T>`: Used for updating existing documents (e.g., `editRelease`). This requires the full document data, including the `id` of the document to be updated, its `postedBy` key, and its `siteAddress`. The service will verify that `postedBy` and `siteAddress` have not been changed.

---

## Content Management (Releases)

Methods for creating and managing the primary content type, `Release`.

### `addRelease()`

```typescript
addRelease(data: AddInput<ReleaseData>): Promise<HashResponse>
```

Creates and saves a new `Release` document. Automatically populates `id`, `siteAddress`, and `postedBy` (if not provided).

#### Parameters

| Parameter | Type                | Description                                                                                             |
|-----------|---------------------|---------------------------------------------------------------------------------------------------------|
| `data`    | `AddInput<ReleaseData>` | An object with the release properties (`name`, `categoryId`, etc.). `postedBy` is optional. |

#### Returns

A `Promise` resolving to a `HashResponse` object.

### `editRelease()`

```typescript
editRelease(data: EditInput<ReleaseData>): Promise<HashResponse>
```

Updates an existing Release. A `MEMBER` can edit their own releases. An `ADMIN` can edit any release on the Site.

#### Parameters

| Parameter | Type                | Description                                                                                                                               |
|-----------|---------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| `data`    | `EditInput<ReleaseData>` | The full `Release` data, including the `id` of the document to update. The service will reject the edit if `postedBy` or `siteAddress` are modified. |

Updates an existing `Release`. The `data` object must include the `id`. Requires `ADMIN` privileges.

### `deleteRelease()`

```typescript
deleteRelease(id: string): Promise<IdResponse>
```

Deletes a `Release` by its ID. Requires `ADMIN` privileges.

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

Methods for managing `FeaturedRelease` entries. These operations require `ADMIN` privileges.

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

## Federation (Subscription) Management

Methods for managing federation relationships. These operations require `ADMIN` privileges.

### `addSubscription()`

```typescript
addSubscription(data: AddInput<SubscriptionData>): Promise<HashResponse>
```

Subscribes to another `Site`, initiating federation.

#### Parameters

| Parameter | Type       | Description                                                 |
|-----------|------------|-------------------------------------------------------------|
| `data`    | `AddInput<SubscriptionData>`   | An object with the subscription properties. `SubscriptionData` is `{ to: string }` |

### `deleteSubscription()`

```typescript
deleteSubscription(data: { id?: string; to?: string }): Promise<IdResponse>
```

Unsubscribes from a `Site`, stopping federation and purging its content.

#### Parameters

| Parameter | Type     | Description                                                          |
|-----------|----------|----------------------------------------------------------------------|
| `data`    | `object` | An object containing either the subscription `id` or the target site's `to` address to remove. |

### `getSubscriptions()`

```typescript
getSubscriptions(options?: SearchOptions): Promise<Subscription[]>
```

Retrieves a list of all current `Subscription` documents.

---

## Access Control Management

Methods for managing user permissions on the active `Site`. These operations require `ADMIN` privileges.

### `grantAccess()`

```typescript
grantAccess(accountType: AccountType, publicKey: string): Promise<BaseResponse>
```

Grants a specific role (`ADMIN` or `MEMBER`) to a user for the active `Site`.

#### Parameters

| Parameter     | Type          | Description                                                                 |
|---------------|---------------|-----------------------------------------------------------------------------|
| `accountType` | `AccountType` | The role to grant (`AccountType.ADMIN` or `AccountType.MEMBER`).            |
| `publicKey`   | `string`      | The string-encoded public key of the user to grant access to.               |

#### Returns

A `Promise` resolving to a `BaseResponse` object indicating success or failure.

### `revokeAccess()`

```typescript
revokeAccess(accountType: AccountType, publicKey: string): Promise<BaseResponse>
```

Revokes a user's role from the active `Site`.

#### Parameters

| Parameter     | Type          | Description                                                                                             |
|---------------|---------------|---------------------------------------------------------------------------------------------------------|
| `accountType` | `AccountType` | The role to revoke. Revoking `ADMIN` also revokes the `MEMBER` role.                                      |
| `publicKey`   | `string`      | The string-encoded public key of the user whose access is being revoked.                                |

#### Returns

A `Promise` resolving to a `BaseResponse` object indicating success or failure.

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
