+++
date = '2025-07-22T12:25:02+02:00'
draft = false
title = 'Advanced Topics'
weight = 3
+++


This section covers advanced concepts and best practices for building robust, scalable, and secure applications with the Lens SDK. It is intended for developers who are already familiar with the topics covered in the Quick Start Guide and Core Concepts.

### 1. Managing Peerbit Client Externally

In some complex applications, you may need to manage the lifecycle of the Peerbit P2P client yourself, especially if your application uses other Peerbit programs alongside the `Site` program.

The `LensService` constructor accepts an optional `peerbit` client instance. When a client is provided this way, the service will not attempt to manage its lifecycle.

**Use Case:** Your application needs to run a `Site` program and a separate custom `Chat` program on the same Peerbit node.

```typescript
import { Peerbit } from 'peerbit';
import { LensService } from '@riffcc/lens-sdk';
import { ChatProgram } from './my-chat-program'; // Your custom program

async function setup() {
  // 1. Create and manage the Peerbit client yourself.
  const peerbit = await Peerbit.create({ directory: './shared-p2p-node' });

  // 2. Pass the external client to the LensService.
  const lens = new LensService({ peerbit: peerbit, debug: true });
  
  // 3. You can now open a Site...
  await lens.openSite('EXISTING_SITE_ADDRESS');
  
  // 4. ...and also open your other custom programs on the same node.
  const chat = await peerbit.open(new ChatProgram());

  // ... application logic ...

  // 5. You are responsible for stopping the client.
  // The lens.stop() call will NOT stop the external client.
  await lens.stop(); // Only stops the Site program and FederationManager
  await peerbit.stop();
}
```

### 2. Customizing Replication (`SiteArgs`)

By default, a `Site` program attempts to replicate its data stores with a low replication factor to save resources. For applications requiring higher availability or performance, you can provide custom replication arguments when opening a site.

The `SiteArgs` object allows you to specify `replicate` options for each data store within the `Site`.

**Use Case:** You are running a dedicated "pinning" node that should store a complete copy of all data for maximum availability.

```typescript
import { Site } from '@riffcc/lens-sdk/programs';

const dedicatedPinningNodeArgs = {
  // Setting 'replicate: true' means "replicate everything you can find."
  releasesArgs: { replicate: true },
  featuredReleasesArgs: { replicate: true },
  contentCategoriesArgs: { replicate: true },
  // ACLs and Subscriptions should always be fully replicated on an admin node.
  membersArg: { replicate: true },
  administratorsArgs: { replicate: true },
  subscriptionsArgs: { replicate: true }
};

const site = new Site(myPublicKey);
await lens.openSite(site, { siteArgs: dedicatedPinningNodeArgs });
```

For detailed replication options, refer to the Peerbit documentation on `ReplicationOptions`.

### 3. Understanding Federation Performance

The `FederationManager` is designed to be efficient, but in large-scale networks, it's helpful to understand its behavior:

* **Historical Sync:** This is the most resource-intensive part of federation. When a site with thousands of releases is subscribed to, the initial sync can take time and consume bandwidth. This process runs in the background and does not block other operations.
* **Live Sync:** Live updates via pub/sub are extremely lightweight. A `FederationUpdate` message only contains the cryptographic hashes and metadata of changed entries, not the full data, making real-time updates very fast.
* **Network Topology:** Federation performance is dependent on the underlying libp2p network. For optimal performance, ensure that nodes (especially those that frequently federate with each other) are well-connected. You can use `peerbit.dial()` to manually establish connections between nodes if needed.

### 4. Production-Level Content Moderation (`BlockedContent` and Denylists)

The Lens SDK is designed with a powerful content moderation architecture that extends beyond simple in-app filtering to the core infrastructure. This section outlines the full vision, separating what is currently available from features that are in progress or planned for the future.

#### Logical Deletes vs. Hard Deletes

It is important to distinguish between the two forms of content removal:

*   **`deleteRelease()` (Logical Delete):** This is a standard feature. When an administrator calls `deleteRelease()`, it removes the `Release` document from the site's database. This is a "soft" or "logical" delete within the application's view. The underlying data file on IPFS is not immediately affected.

*   **`BlockedContent` (Hard Delete Foundation):** This schema is the foundation for a "hard delete" process. It is designed to create a permanent, verifiable record that a piece of content (identified by its CID) should be purged not just from the app, but from the entire storage infrastructure.

#### The "Bad Bits" Moderation Pattern: Current State and Future Vision

The recommended pattern for robust moderation follows the principles of established denylist formats like the ["Bad Bits" denylist](https://badbits.dwebops.pub/).

Here is the workflow, including the status of each component:

1.  **Administrator Action:** An administrator identifies a piece of content by its IPFS Content Identifier (CID) that needs to be blocked.

2.  **Double Hashing and Record Creation (In Progress):**
    *   **Functionality:** To protect privacy, the original CID is **double-hashed** (e.g., SHA256(SHA256(CID))) before being stored. This prevents casual observers from identifying the content on the blocklist.
    *   **Status:** The high-level `LensService` methods to perform this action (e.g., `blockContent()`) are **currently in progress**. This will provide a simple, secure way for administrators to add entries to the `blockedContent` store without needing direct program interaction.

3.  **Infrastructure Synchronization (Future Implementation):**
    *   **Vision:** The long-term vision is for a trusted backend service or "Operator" to monitor the `Site`'s `blockedContent` store. This Operator will generate a standard denylist file from the stored hashes and distribute it to all core infrastructure.
    *   **Status:** The implementation of this **Operator service is planned for the future**. When complete, it will enable the `blockedContent` store to act as a decentralized source of truth that can instruct IPFS nodes, clusters, and CDNs to refuse to serve and permanently delete blocked content.

#### Summary of Moderation Features

| Feature                                   | Status            | Description                                                                                             |
|-------------------------------------------|-------------------|---------------------------------------------------------------------------------------------------------|
| **Logical Deletion** (`deleteRelease`)      | ✅ **Implemented** | Removes content metadata from the `Site`'s database.                                                      |
| **Blocklist Schema** (`BlockedContent`)   | ✅ **Implemented** | The on-chain data structure for recording moderation decisions exists.                                    |
| **Service API for Blocking** (`blockContent`) | ⏳ **In Progress**  | High-level `LensService` methods for easy and secure management of the `blockedContent` store.          |
| **Operator for Infrastructure Sync**        | 🗺️ **Future**       | A service to automate the syncing of the on-chain blocklist to IPFS nodes, clusters, and CDNs.        |

This roadmap provides a clear path from the current capabilities to a comprehensive, end-to-end content moderation system that is both powerful and privacy-preserving.

### 5. Direct Program Interaction (For Advanced Use Cases)

While the `LensService` should be used for 99% of interactions, there may be rare cases where direct interaction with the `Site` program is necessary (e.g., in server-side administrative scripts).

The active `Site` program instance is available via `lensService.siteProgram`.

**Use Case:** A script needs to inspect the low-level replication state of a specific database.

```typescript
// This is NOT a typical application pattern. Use with caution.
const site: Site | null = lens.siteProgram;

if (site) {
  // Accessing the underlying log of a store
  const releaseLog = site.releases.log;

  // Get the cryptographic heads of the log
  const heads = await releaseLog.log.getHeads().all();
  console.log('Current release log heads:', heads.map(h => h.hash));

  // Directly interacting with ACLs
  await site._authorise(AccountType.MEMBER, 'some_public_key');
}
```

**Warning:** Bypassing the `LensService` means you lose its safety checks, error handling, and stable API contract. This should only be done when you have a deep understanding of the Peerbit framework and the internal logic of the `Site` program.

