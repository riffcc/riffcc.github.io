+++
date = '2025-07-22T06:21:22+02:00'
draft = false
title = 'Site Reference'
weight = 4
+++

### Schemas

This document provides a detailed reference for the data schemas that constitute a `Site` program. Understanding these schemas is crucial for preparing data for API calls and for interpreting the data returned by the `LensService`.

All data objects submitted to the `LensService` for creation or editing should conform to the structures described below.

#### Common Document Properties

While there is no rigid base class, most documents share a set of common, fundamental properties. When creating a new content item (like a `Release`), the `id`, `postedBy`, and `siteAddress` fields are automatically handled by the `LensService`.

| Field         | Type                          | Description                                                                                                                                                             |
|---------------|-------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `id`          | `string`                      | A unique identifier for the document. Usually a UUID, generated automatically on creation. Required when editing an existing document.                                     |
| `postedBy`    | `PublicSignKey` or `Uint8Array` | The cryptographic public key of the identity associated with the document. When creating content, this is automatically set to the current user unless specified otherwise. |
| `siteAddress` | `string`                      | The unique address of the `Site` where this document was originally created. This is always set by the service and is immutable.                                         |

> **Note on Immutability:** The `postedBy` and `siteAddress` fields are considered immutable. Once a document is created, these values cannot be changed via an `edit` operation. The SDK enforces this rule at the service layer.

---

#### 1. `Release`

The `Release` is the primary content object. It represents a single, publishable item like a music album, a video, or an article.

| Field          | Type     | Required | Description                                                               |
|----------------|----------|:--------:|---------------------------------------------------------------------------|
| `name`         | `string` | **Yes**  | The display title of the release.                                         |
| `categoryId`   | `string` | **Yes**  | The `id` of the `ContentCategory` this release belongs to (e.g., "music"). |
| `contentCID`   | `string` | **Yes**  | The IPFS Content Identifier (CID) of the main data file(s) for this release. |
| `thumbnailCID` | `string` | No       | The IPFS CID for a thumbnail or cover image associated with the release.  |
| `metadata`     | `string` | No       | A JSON string containing additional, category-specific metadata.          |

#### 2. `ContentCategory`

A `ContentCategory` defines a template for a type of content, including what metadata is expected. These are typically created by a `Site` administrator or initialized from a default set.

| Field          | Type     | Required | Description                                                                                                   |
|----------------|----------|:--------:|---------------------------------------------------------------------------------------------------------------|
| `categoryId`   | `string` | **Yes**  | A unique, human-readable string identifier (e.g., "movies", "tv-shows"). **This field is immutable.**         |
| `displayName`  | `string` | **Yes**  | The human-readable name for the category (e.g., "TV Shows").                                                  |
| `featured`     | `boolean`| No       | A flag to indicate if this category should be prominently displayed. Defaults to `false`.                       |
| `description`  | `string` | No       | A brief explanation of what content belongs in this category.                                                 |
| `metadataSchema`| `string` | No       | A JSON string defining the structure of the `metadata` field for `Releases` in this category. See [defaults.ts](https://github.com/riffcc/lens-sdk/blob/main/src/programs/site/defaults.ts) for examples. |

> **Note on `categoryId` Immutability:** The `categoryId` field acts as a stable "business key". Once a category is created, this ID cannot be changed to ensure that all `Releases` linked to it remain valid. The SDK enforces this rule.

#### 3. `FeaturedRelease`

A `FeaturedRelease` acts as a "pin" or "shortcut" to an existing `Release`, allowing it to be highlighted.

| Field       | Type      | Required | Description                                                            |
|-------------|-----------|:--------:|------------------------------------------------------------------------|
| `releaseId` | `string`  | **Yes**  | The `id` of the `Release` document that is being featured.             |
| `startTime` | `string`  | **Yes**  | An ISO 8601 formatted date-time string indicating when the feature should become active. |
| `endTime`   | `string`  | **Yes**  | An ISO 8601 formatted date-time string indicating when the feature should expire.   |
| `promoted`  | `boolean` | **Yes**  | A flag for additional styling or priority in a "promoted" section.     |

#### 4. `Subscription`

A `Subscription` represents a unilateral "follow" action, forming the basis of federation. When a `Subscription` is created, the `FederationManager` begins syncing content from the target `Site`.

| Field         | Type     | Required | Description                                                                                               |
|---------------|----------|:--------:|-----------------------------------------------------------------------------------------------------------|
| `to`          | `string` | **Yes**  | The full, unique address of the remote `Site` program being subscribed to.                                 |

>Note: The `id` for a subscription is deterministically generated from a combination of the subscriber's and the target site's addresses to prevent duplicate subscriptions.

#### 5. `BlockedContent`

A `BlockedContent` record is a moderation tool used by `Site` administrators to hide or prevent content from being displayed.

| Field | Type     | Required | Description                                  |
|-------|----------|:--------:|----------------------------------------------|
| `cid` | `string` | **Yes**  | The IPFS Content Identifier (CID) to be blocked. |

---

This reference provides the necessary detail for developers to correctly format data for all API interactions. For information on how to create, retrieve, or manage documents using these schemas, please consult the [**API Reference**](/docs/lens-sdk/api-reference).
