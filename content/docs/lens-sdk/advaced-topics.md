+++
date = '2025-07-22T12:25:02+02:00'
draft = true
title = 'Advaced Topics'
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

### 4. Direct Program Interaction (For Advanced Use Cases)

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

